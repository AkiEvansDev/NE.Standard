using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    private const string LanguageChangedOperation = "LanguageChanged";
    private const string ThemeChangedOperation = "ThemeChanged";
    private const string SessionChangedOperation = "SessionChanged";
    private const string NotificationPermissionChangedOperation = "NotificationPermissionChanged";
    private const string VisibilityChangedOperation = "VisibilityChanged";

    private readonly Lock _connectionsLock = new();
    // Each attached instance's handle, so the connection outside a command can pass to a tab still attached when its own leaves.
    private readonly Dictionary<string, UIHandle> _attachedHandles = new(StringComparer.Ordinal);

    // Materialized snapshot: the flush loop reads it every tick and would otherwise copy the set each time.
    private string[] _attachedInstanceIdsSnapshot = [];

    // The attached instances that are a page someone looks at, leaving out a page render's own; read without the lock.
    private int _viewers;

    // Of those, the ones whose page last reported itself on screen; read without the lock.
    private int _visibleViewers;

    // Whether a page was on screen when the controller last heard, so a flip reaches it once however it came — a report, an attach
    // or a detach — and a flip back before it ran reaches it not at all.
    private bool _heardVisible;

    // The last queued update each instance's attach snapshot holds; an instance with none is sent every change set whole, unless it
    // starts from a snapshot it has not taken yet, and then it is sent nothing.
    private readonly Dictionary<string, long> _watermarks = new(StringComparer.Ordinal);
    private readonly HashSet<string> _awaitingSnapshot = new(StringComparer.Ordinal);

    // The page whose render last ran the navigation hook, which its own attach then skips.
    private string? _navigatedPageId;

    // The session's language and theme mode the controller last heard, so each change reaches it once: where it was made, from the
    // switch reaching the session's pages, or at the next attach of a runtime no page showed then.
    private string _heardLanguage;
    private UIThemeMode? _heardThemeMode;

    /// <inheritdoc />
    public IReadOnlyCollection<string> AttachedInstanceIds => _attachedInstanceIdsSnapshot;

    /// <inheritdoc />
    public bool HasViewers => Volatile.Read(ref _viewers) > 0;

    /// <inheritdoc />
    public bool HasVisibleViewers => Volatile.Read(ref _visibleViewers) > 0;

    /// <inheritdoc />
    public IReadOnlyList<UIHandle> ViewerHandles
    {
        get
        {
            lock (_connectionsLock)
            {
                List<UIHandle> viewers = new(_attachedHandles.Count);

                foreach (UIHandle handle in _attachedHandles.Values)
                {
                    if (IsViewer(handle.Instance))
                        viewers.Add(handle);
                }

                return viewers;
            }
        }
    }

    /// <summary>
    /// Whether an instance is a page someone looks at; a render's own instance names its page as its window, and is no one.
    /// </summary>
    private static bool IsViewer(UIInstance instance)
        => !string.Equals(instance.WindowId, instance.PageId, StringComparison.Ordinal);

    public virtual void UpdateConnection(UIHandle handle, UIClientServices clientServices)
    {
        ThrowIfDisposed();

        ArgumentNullException.ThrowIfNull(handle);

        clientServices.Validate();
        handle.Instance.Validate();

        lock (_connectionsLock)
        {
            AttachInstanceNoLock(handle);
            UseConnectionNoLock(handle, clientServices);
        }
    }

    /// <summary>
    /// Makes <paramref name="handle"/> the connection the runtime answers for outside a command, on the runtime and the
    /// controller's context alike; under the connections lock, so an attach and a detach cannot leave the two disagreeing.
    /// </summary>
    private void UseConnectionNoLock(UIHandle handle, UIClientServices clientServices)
    {
        UpdateConnectionSnapshot(RuntimeConnection.FromClientServices(handle, clientServices));

        if (Controller is IUIContextController contextController)
            contextController.Context.RefreshConnection(handle, clientServices.Dialogs, clientServices.Downloads, clientServices.Uploads);
    }

    /// <summary>
    /// Marks the connection a command is running for, on the controller's context; a no-op when the controller carries no context.
    /// </summary>
    private IDisposable BeginInvocation(UIHandle invoker)
        => Controller is IUIContextController contextController
            ? contextController.Context.BeginInvocation(invoker)
            : EmptyScope.Instance;

    private sealed class EmptyScope : IDisposable
    {
        public static readonly EmptyScope Instance = new();

        public void Dispose() { }
    }

    private void AttachInstance(UIHandle handle)
    {
        lock (_connectionsLock)
            AttachInstanceNoLock(handle);
    }

    private void AttachInstanceNoLock(UIHandle handle)
    {
        UIInstance instance = handle.Instance;
        var added = !_attachedHandles.TryGetValue(instance.Id, out UIHandle? replaced);

        _attachedHandles[instance.Id] = handle;

        if (added)
            _attachedInstanceIdsSnapshot = [.. _attachedHandles.Keys];

        if (IsViewer(instance))
        {
            if (added)
                Volatile.Write(ref _viewers, _viewers + 1);

            // A connection attaching again (a full resync) brings a handle of its own, its page's state read anew: the one it
            // replaces is counted no more.
            _ = CountVisibleNoLock(replaced is not null && replaced.ClientState.IsVisible, handle.ClientState.IsVisible);
        }

        if (instance.StartsFromSnapshot && !_watermarks.ContainsKey(instance.Id))
            _ = _awaitingSnapshot.Add(instance.Id);
    }

    /// <summary>
    /// Counts a viewer's move on or off screen — attached, replaced, reported, detached — and answers whether it took the runtime
    /// from none on screen to one, or back.
    /// </summary>
    private bool CountVisibleNoLock(bool wasVisible, bool isVisible)
    {
        if (wasVisible == isVisible)
            return false;

        var before = _visibleViewers;

        Volatile.Write(ref _visibleViewers, before + (isVisible ? 1 : -1));

        return before == (isVisible ? 0 : 1);
    }

    /// <inheritdoc />
    public void DetachConnection(string instanceId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);

        UIHandle? removed;
        var hidden = false;

        lock (_connectionsLock)
        {
            _ = _watermarks.Remove(instanceId);
            _ = _awaitingSnapshot.Remove(instanceId);

            if (!_attachedHandles.Remove(instanceId, out removed))
                return;

            _attachedInstanceIdsSnapshot = [.. _attachedHandles.Keys];

            if (IsViewer(removed.Instance))
            {
                Volatile.Write(ref _viewers, _viewers - 1);
                hidden = CountVisibleNoLock(removed.ClientState.IsVisible, isVisible: false);
            }

            // Under PerClient another tab may still be attached: what the runtime raises outside a command goes to it, not to
            // the connection that just left.
            if (!_disposed && StringComparer.Ordinal.Equals(Connection.Handle.Instance.Id, instanceId))
            {
                foreach (UIHandle remaining in _attachedHandles.Values)
                {
                    UseConnectionNoLock(remaining, Connection.ClientServices);
                    break;
                }
            }
        }

        // Queued, not awaited: a detach comes from a closing connection, which waits for nobody's code.
        if (IsViewer(removed.Instance) && Controller is IUIControllerLifecycle lifecycle)
        {
            PostCore("Detached", lifecycle.DetachedAsync);

            if (hidden)
                PostCore(VisibilityChangedOperation, cancellation => HearVisibilityAsync(lifecycle, cancellation));
        }
    }

    /// <summary>
    /// Tells the controller its runtime went on or off screen, where that differs from what it last heard; run in a command's turn, so
    /// two flips queued back to back collapse into what is true when the first runs.
    /// </summary>
    private Task HearVisibilityAsync(IUIControllerLifecycle lifecycle, CancellationToken cancellationToken)
    {
        bool wasVisible;

        lock (_connectionsLock)
        {
            var visible = HasVisibleViewers;

            if (visible == _heardVisible)
                return Task.CompletedTask;

            wasVisible = _heardVisible;
            _heardVisible = visible;
        }

        return lifecycle.VisibilityChangedAsync(wasVisible, cancellationToken);
    }

    /// <inheritdoc />
    public void UpdateClientState(UIHandle handle, UIClientState state)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(state);

        UIClientState previous;
        var flipped = false;

        lock (_connectionsLock)
        {
            previous = handle.RefreshClientState(state);

            // Counted only while attached: one that left, or a render's own, is no viewer to count.
            if (IsViewer(handle.Instance) && _attachedHandles.TryGetValue(handle.Instance.Id, out UIHandle? attached) && ReferenceEquals(attached, handle))
                flipped = CountVisibleNoLock(previous.IsVisible, state.IsVisible);
        }

        if (Controller is not IUIControllerLifecycle lifecycle)
            return;

        // Posted, not awaited: the page's next command waits behind this report on its connection, and must not wait for a turn too.
        if (flipped)
            PostLifecycleHook(handle, VisibilityChangedOperation, cancellation => HearVisibilityAsync(lifecycle, cancellation));

        if (previous.NotificationPermission != state.NotificationPermission)
            PostLifecycleHook(handle, NotificationPermissionChangedOperation, cancellation => lifecycle.NotificationPermissionChangedAsync(previous.NotificationPermission, cancellation));
    }

    /// <summary>Queues a controller's lifecycle hook as posted work, with <paramref name="handle"/> the connection it runs for.</summary>
    private void PostLifecycleHook(UIHandle handle, string operation, Func<CancellationToken, Task> hook)
        => PostCore(operation, async cancellation =>
        {
            using IDisposable invocation = BeginInvocation(handle);

            await hook(cancellation).ConfigureAwait(false);
        });

    /// <inheritdoc />
    public async Task NotifyAttachedAsync(UIHandle handle, bool created, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(handle);

        if (Controller is not IUIControllerLifecycle lifecycle)
            return;

        UIInstance instance = handle.Instance;
        var viewer = IsViewer(instance);

        // A render tells the navigation only to the runtime it built: one already running may be another tab's page.
        if (!viewer && !created)
            return;

        var navigated = viewer ? TakeNavigationRun(instance.PageId) : MarkNavigationRun(instance.PageId);

        await RunLifecycleHookAsync(handle, viewer ? "Attached" : "Navigated", async cancellation =>
        {
            // A runtime kept while its session moved elsewhere hears it here, before the hooks of the page it is attached for.
            if (viewer)
                await HearSessionAsync(handle, cancellation).ConfigureAwait(false);

            if (navigated)
                await lifecycle.NavigatedAsync(instance.Navigation, cancellation).ConfigureAwait(false);

            if (viewer)
            {
                await lifecycle.AttachedAsync(instance.Navigation, cancellation).ConfigureAwait(false);

                // In the attach's own turn, so a page attaching on screen is answered with what the controller wrote for it.
                await HearVisibilityAsync(lifecycle, cancellation).ConfigureAwait(false);
            }
        }, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Records that a page's render ran the navigation hook, so that page's own attach need not run it again.</summary>
    private bool MarkNavigationRun(string? pageId)
    {
        lock (_connectionsLock)
            _navigatedPageId = pageId;

        return true;
    }

    /// <summary>
    /// Whether an attach runs the navigation hook: every attach but the one whose page's render ran it last; any run clears that mark.
    /// </summary>
    private bool TakeNavigationRun(string? pageId)
    {
        lock (_connectionsLock)
        {
            var renderRan = pageId is not null && string.Equals(_navigatedPageId, pageId, StringComparison.Ordinal);

            _navigatedPageId = null;

            return !renderRan;
        }
    }

    /// <summary>
    /// Runs a controller's lifecycle hook held, in a command's turn and outside the state lock, its writes queued like a command's, and
    /// the given connection its handle. The hook's failure is the controller's to report; the attach or the switch still stands.
    /// </summary>
    /// <remarks>
    /// Its callers — an attach, a render of a kept runtime, a session the page stored — come from outside every command, so the turn
    /// is never held here already; a back or forward, which runs in a command's turn, calls the hook itself. Waiting for the turn ends
    /// with <paramref name="cancellationToken"/> — the attaching connection's — and nothing else.
    /// </remarks>
    private async Task RunLifecycleHookAsync(UIHandle handle, string operation, Func<CancellationToken, Task> hook, CancellationToken cancellationToken)
    {
        await using ConfiguredAsyncDisposable hold = HoldAsCommand().ConfigureAwait(false);
        ThrowIfAskedToGo();

        using IDisposable invocation = BeginInvocation(handle);

        // A reload's hooks redraw the page while the old connection's command may still be writing it.
        await _exclusiveCommandLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            await RunInTurnAsync(hook, cancellationToken).ConfigureAwait(false);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            _ = await HandleRuntimeExceptionAsync(exception, operation, commandRequest: null, clientChangeSet: null, cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            _ = _exclusiveCommandLock.Release();
        }
    }

    /// <summary>
    /// A command's code moved its connection's session: the controller told inline — the command already runs outside the lock, and
    /// waits for it — then the page told to switch, then the session's other pages reached.
    /// </summary>
    async Task IUISessionChangeListener.SessionChangedAsync(UIHandle handle, IUserSessionContext previous, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(previous);

        await HearSessionAsync(handle, cancellationToken).ConfigureAwait(false);

        await PushCommandResultAsync(handle, new UICommandExecutionResult
        {
            Command = UICommandResult.Ok(UISessionMoves.Effects(previous, handle.Session)),
            Changes = ServerChangeSet.Empty
        }, cancellationToken).ConfigureAwait(false);

        // Found where the host registers itself, as a sign-out finds it: a runtime has no other way to its session's other runtimes.
        if (handle.Session is UserSessionState session && Controller is IUIContextController contextController && contextController.Context.Services.GetService(typeof(IUISessions)) is UIHost host)
            await host.ReachSessionAsync(session, handle, this, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Tells the controller what moved in its connection's session since it last heard — each change once, whichever way it came;
    /// a hook's failure is the controller's to report, and the other hook still runs.
    /// </summary>
    private async Task HearSessionAsync(UIHandle handle, CancellationToken cancellationToken)
    {
        if (Controller is not IUIControllerLifecycle lifecycle)
            return;

        SessionMove move = TakeSessionMove(handle.Session);

        if (move.PreviousLanguage is string previousLanguage)
            await RunSessionHookAsync(LanguageChangedOperation, cancellation => lifecycle.LanguageChangedAsync(previousLanguage, cancellation), cancellationToken).ConfigureAwait(false);

        if (move.ThemeMoved)
            await RunSessionHookAsync(ThemeChangedOperation, cancellation => lifecycle.ThemeChangedAsync(move.PreviousThemeMode, cancellation), cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Takes what moved in a session since the controller last heard it, and marks it heard.</summary>
    private SessionMove TakeSessionMove(IUserSessionContext session)
    {
        lock (_connectionsLock)
        {
            SessionMove move = new(
                string.Equals(_heardLanguage, session.Language, StringComparison.Ordinal) ? null : _heardLanguage,
                _heardThemeMode != session.ThemeMode,
                _heardThemeMode
            );

            _heardLanguage = session.Language;
            _heardThemeMode = session.ThemeMode;

            return move;
        }
    }

    private async Task RunSessionHookAsync(string operation, Func<CancellationToken, Task> hook, CancellationToken cancellationToken)
    {
        try
        {
            await hook(cancellationToken).ConfigureAwait(false);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            // The session did move; the hook's failure is the controller's to report, not the switch's.
            _ = await HandleRuntimeExceptionAsync(exception, operation, commandRequest: null, clientChangeSet: null, cancellationToken).ConfigureAwait(false);
        }
    }

    /// <summary>What moved in a session since the controller last heard it: the language it left, and whether and from what the theme moved.</summary>
    private readonly record struct SessionMove(string? PreviousLanguage, bool ThemeMoved, UIThemeMode? PreviousThemeMode);

    /// <inheritdoc />
    public bool HasSessionMoved(IUserSessionContext session)
    {
        ArgumentNullException.ThrowIfNull(session);

        lock (_connectionsLock)
            return !string.Equals(_heardLanguage, session.Language, StringComparison.Ordinal) || _heardThemeMode != session.ThemeMode;
    }

    /// <inheritdoc />
    public Task NotifySessionChangedAsync(UIHandle handle, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(handle);

        return RunLifecycleHookAsync(handle, SessionChangedOperation, cancellation => HearSessionAsync(handle, cancellation), cancellationToken);
    }

    /// <inheritdoc />
    public void PostSessionChanged(UIHandle handle)
    {
        ArgumentNullException.ThrowIfNull(handle);

        if (Controller is not IUIControllerLifecycle)
            return;

        PostLifecycleHook(handle, SessionChangedOperation, cancellation => HearSessionAsync(handle, cancellation));
    }

    /// <summary>Records what an instance's attach snapshot holds: every update queued up to <paramref name="sequence"/>.</summary>
    private void MarkSnapshot(string instanceId, long sequence)
    {
        lock (_connectionsLock)
        {
            _watermarks[instanceId] = sequence;
            _ = _awaitingSnapshot.Remove(instanceId);
        }
    }

    /// <summary>
    /// Records that an instance's answer carried every update queued up to <paramref name="sequence"/>, so the flush does not
    /// send it them again.
    /// </summary>
    private void MarkAnswered(string instanceId, long sequence)
    {
        lock (_connectionsLock)
        {
            // An instance still to take its snapshot is marked by the snapshot, and one that left needs no mark.
            if (!_attachedHandles.ContainsKey(instanceId) || _awaitingSnapshot.Contains(instanceId))
                return;

            if (!_watermarks.TryGetValue(instanceId, out var watermark) || watermark < sequence)
                _watermarks[instanceId] = sequence;
        }
    }

    /// <summary>Whether an instance other than <paramref name="instanceId"/> is attached, one the flush still sends to.</summary>
    private bool HasOtherAttachedInstance(string instanceId)
    {
        var attached = _attachedInstanceIdsSnapshot;

        for (var i = 0; i < attached.Length; i++)
        {
            if (!StringComparer.Ordinal.Equals(attached[i], instanceId))
                return true;
        }

        return false;
    }

    /// <inheritdoc />
    public ServerChangeSet ChangesFor(string instanceId, ServerChangeSet changes)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);
        ArgumentNullException.ThrowIfNull(changes);

        long watermark;

        lock (_connectionsLock)
        {
            if (_awaitingSnapshot.Contains(instanceId))
                return ServerChangeSet.Empty;

            _ = _watermarks.TryGetValue(instanceId, out watermark);
        }

        return changes.After(watermark).For(instanceId);
    }
}
