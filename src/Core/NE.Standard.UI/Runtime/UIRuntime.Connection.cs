using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal sealed partial class UIRuntime
{
    private const string LanguageChangedOperation = "LanguageChanged";
    private const string ThemeChangedOperation = "ThemeChanged";
    private const string SessionChangedOperation = "SessionChanged";
    private const string NotificationPermissionChangedOperation = "NotificationPermissionChanged";
    private const string VisibilityChangedOperation = "VisibilityChanged";

    private readonly ConnectionRegistry _connections;

    /// <inheritdoc />
    public IReadOnlyCollection<string> AttachedInstanceIds => _connections.AttachedInstanceIds;

    /// <inheritdoc />
    public bool HasViewers => _connections.HasViewers;

    /// <inheritdoc />
    public bool HasVisibleViewers => _connections.HasVisibleViewers;

    /// <inheritdoc />
    public IReadOnlyList<UIHandle> ViewerHandles => _connections.GetViewerHandles();

    /// <summary>
    /// Whether an instance is a page someone looks at; a render's own instance names its page as its window, and is no one.
    /// </summary>
    private static bool IsViewer(UIInstance instance)
        => !string.Equals(instance.WindowId, instance.PageId, StringComparison.Ordinal);

    public void UpdateConnection(UIHandle handle, UIClientServices clientServices)
    {
        ThrowIfDisposed();

        ArgumentNullException.ThrowIfNull(handle);

        clientServices.Validate();
        handle.Instance.Validate();

        _connections.AttachAndUse(this, handle, clientServices);
    }

    /// <summary>
    /// Makes <paramref name="handle"/> the connection the runtime answers for outside a command, on the runtime and the
    /// controller's context alike; under the connections lock, so an attach and a detach cannot leave the two disagreeing.
    /// </summary>
    private void UseConnectionNoLock(UIHandle handle, UIClientServices clientServices)
    {
        UpdateConnectionSnapshot(RuntimeConnection.FromClientServices(handle, clientServices));

        if (Controller is IUIContextController contextController)
            contextController.Context.RefreshConnection(handle, clientServices.Downloads, clientServices.Uploads);
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
        => _connections.Attach(this, handle);

    /// <inheritdoc />
    public void DetachConnection(string instanceId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);

        if (!_connections.TryDetach(this, instanceId, out UIHandle? removed, out var hidden))
            return;

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
        => _connections.TryTakeVisibilityFlip(out var wasVisible)
            ? lifecycle.VisibilityChangedAsync(wasVisible, cancellationToken)
            : Task.CompletedTask;

    /// <inheritdoc />
    public void UpdateClientState(UIHandle handle, UIClientState state)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(state);

        (UIClientState previous, var flipped) = _connections.RefreshClientState(handle, state);

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

        var navigated = viewer ? _connections.TakeNavigationRun(instance.PageId) : _connections.MarkNavigationRun(instance.PageId);

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
        // A reload's hooks redraw the page while the old connection's command may still be writing it.
        _ = await InCommandTurnAsync(handle, async cancellation =>
        {
            try
            {
                await RunInTurnAsync(hook, cancellation).ConfigureAwait(false);
            }
            catch (OperationCanceledException) when (cancellation.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception exception)
            {
                _ = await HandleRuntimeExceptionAsync(exception, operation, commandRequest: null, clientChangeSet: null, cancellation).ConfigureAwait(false);
            }

            // A hook answers nothing; the turn's shape is a call's, which does.
            return true;
        }, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// A command's code changed its connection's session: where its language, theme or colours moved, the controller told inline — the
    /// command already runs outside the lock, and waits for it — and the page told to switch; then the session's pages re-checked
    /// against their routes and reached, as a change from outside reaches them. This page, where its route no longer passes, goes
    /// with its command's answer; code no answer follows — a hook, posted work — ends it once its turn is over.
    /// </summary>
    async Task IUISessionChangeListener.SessionChangedAsync(UIHandle handle, IUserSessionContext previous, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(previous);

        if (UISessionMoves.Any(previous, handle.Session))
        {
            await HearSessionAsync(handle, cancellationToken).ConfigureAwait(false);

            // Through the send queue, behind what was queued before it and ahead of the command's answer; not drained first, as a push
            // outside a command is, since the command's own writes go with its answer.
            if (_dispatcher.EnqueueResult(this, handle, OutsideCommand(UISessionMoves.Effects(previous, handle.Session))) is { } sent)
                await sent.WaitAsync(cancellationToken).ConfigureAwait(false);
        }

        if (handle.Session is UserSessionState session && await _host.SessionChangedInCommandAsync(session, handle, this, cancellationToken).ConfigureAwait(false) && !TrySendAwayWithAnswer(handle))
            Post(_ => _host.EndIfRefusedAsync(handle, carriedByAnswer: false));
    }

    /// <summary>
    /// Tells the controller what moved in its connection's session since it last heard — each change once, whichever way it came;
    /// a hook's failure is the controller's to report, and the other hook still runs.
    /// </summary>
    private async Task HearSessionAsync(UIHandle handle, CancellationToken cancellationToken)
    {
        if (Controller is not IUIControllerLifecycle lifecycle)
            return;

        SessionMove move = _connections.TakeSessionMove(handle.Session);

        if (move.PreviousLanguage is string previousLanguage)
            await RunSessionHookAsync(LanguageChangedOperation, cancellation => lifecycle.LanguageChangedAsync(previousLanguage, cancellation), cancellationToken).ConfigureAwait(false);

        if (move.ThemeMoved)
            await RunSessionHookAsync(ThemeChangedOperation, cancellation => lifecycle.ThemeChangedAsync(move.PreviousThemeMode, cancellation), cancellationToken).ConfigureAwait(false);
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

        return _connections.HasSessionMoved(session);
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
        => _connections.MarkSnapshot(instanceId, sequence);

    /// <summary>
    /// Records that an instance was sent every update queued up to <paramref name="sequence"/> in its answer, so no later set sends it
    /// them again; run as that answer is sent, where it stands among the dispatcher's sends.
    /// </summary>
    private void MarkAnswered(string instanceId, long sequence)
        => _connections.MarkAnswered(instanceId, sequence);

    /// <summary>Whether an instance other than <paramref name="instanceId"/> is attached, one the flush still sends to.</summary>
    private bool HasOtherAttachedInstance(string instanceId)
        => _connections.HasOtherAttached(instanceId);

    /// <inheritdoc />
    public ServerChangeSet ChangesFor(string instanceId, ServerChangeSet changes)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);
        ArgumentNullException.ThrowIfNull(changes);

        return _connections.ChangesFor(instanceId, changes);
    }

    /// <summary>
    /// Owns the attached handles, watermarks, visibility and heard session state under its own leaf lock.
    /// </summary>
    private sealed class ConnectionRegistry(string initialLanguage, UIThemeMode? initialThemeMode)
    {
        private readonly Lock _sync = new();
        private readonly Dictionary<string, UIHandle> _handles = [with(StringComparer.Ordinal)];
        private string[] _instanceIdsSnapshot = [];
        private int _viewers;
        private int _visibleViewers;
        private bool _heardVisible;
        private readonly Dictionary<string, long> _watermarks = [with(StringComparer.Ordinal)];
        private readonly HashSet<string> _awaitingSnapshot = [with(StringComparer.Ordinal)];
        private string? _navigatedPageId;
        private string _heardLanguage = initialLanguage;
        private UIThemeMode? _heardThemeMode = initialThemeMode;

        public IReadOnlyCollection<string> AttachedInstanceIds => _instanceIdsSnapshot;

        public bool HasViewers => Volatile.Read(ref _viewers) > 0;

        public bool HasVisibleViewers => Volatile.Read(ref _visibleViewers) > 0;

        public List<UIHandle> GetViewerHandles()
        {
            lock (_sync)
            {
                List<UIHandle> viewers = [with(_handles.Count)];

                foreach (UIHandle handle in _handles.Values)
                {
                    if (IsViewer(handle.Instance))
                        viewers.Add(handle);
                }

                return viewers;
            }
        }

        public bool IsAttached(string instanceId)
            => Array.IndexOf(Volatile.Read(ref _instanceIdsSnapshot), instanceId) >= 0;

        public bool HasOtherAttached(string instanceId)
        {
            var attached = _instanceIdsSnapshot;

            for (var i = 0; i < attached.Length; i++)
            {
                if (!StringComparer.Ordinal.Equals(attached[i], instanceId))
                    return true;
            }

            return false;
        }

        public UIHandle? TryGetHandle(string? instanceId)
        {
            if (instanceId is null)
                return null;

            lock (_sync)
                return _handles.TryGetValue(instanceId, out UIHandle? handle) ? handle : null;
        }

        public UIHandle? FindWindow(string windowId)
        {
            lock (_sync)
            {
                foreach (UIHandle handle in _handles.Values)
                {
                    if (string.Equals(handle.Instance.WindowId, windowId, StringComparison.Ordinal))
                        return handle;
                }
            }

            return null;
        }

        public CancellationToken GetOrCreatePageStay(UIRuntime runtime, string windowId)
        {
            lock (_sync)
                return runtime._pageStays.GetOrCreate(windowId, Volatile.Read(ref runtime._disposeRequested) != 0, HoldsWindowNoLock(windowId) ? null : DateTime.UtcNow);
        }

        public void Attach(UIRuntime runtime, UIHandle handle)
        {
            lock (_sync)
                AttachNoLock(runtime, handle);
        }

        public void AttachAndUse(UIRuntime runtime, UIHandle handle, UIClientServices clientServices)
        {
            lock (_sync)
            {
                AttachNoLock(runtime, handle);
                runtime.UseConnectionNoLock(handle, clientServices);
            }
        }

        private void AttachNoLock(UIRuntime runtime, UIHandle handle)
        {
            UIInstance instance = handle.Instance;
            var added = !_handles.TryGetValue(instance.Id, out UIHandle? replaced);

            _handles[instance.Id] = handle;

            runtime.MarkPageStayPresent(instance.WindowId);

            if (added)
                _instanceIdsSnapshot = [.. _handles.Keys];

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

        private bool CountVisibleNoLock(bool wasVisible, bool isVisible)
        {
            if (wasVisible == isVisible)
                return false;

            var before = _visibleViewers;

            Volatile.Write(ref _visibleViewers, before + (isVisible ? 1 : -1));

            return before == (isVisible ? 0 : 1);
        }

        public bool TryDetach(UIRuntime runtime, string instanceId, [System.Diagnostics.CodeAnalysis.NotNullWhen(true)] out UIHandle? removed, out bool hidden)
        {
            hidden = false;

            lock (_sync)
            {
                _ = _watermarks.Remove(instanceId);
                _ = _awaitingSnapshot.Remove(instanceId);

                if (!_handles.Remove(instanceId, out removed))
                    return false;

                _instanceIdsSnapshot = [.. _handles.Keys];

                if (!HoldsWindowNoLock(removed.Instance.WindowId))
                    runtime.MarkPageStayLeft(removed.Instance.WindowId, DateTime.UtcNow);

                if (IsViewer(removed.Instance))
                {
                    Volatile.Write(ref _viewers, _viewers - 1);
                    hidden = CountVisibleNoLock(removed.ClientState.IsVisible, isVisible: false);
                }

                // Under PerClient another tab may still be attached: what the runtime raises outside a command goes to it, not to
                // the connection that just left.
                if (!runtime._disposed && StringComparer.Ordinal.Equals(runtime.Connection.Handle.Instance.Id, instanceId))
                {
                    foreach (UIHandle remaining in _handles.Values)
                    {
                        runtime.UseConnectionNoLock(remaining, runtime.Connection.ClientServices);
                        break;
                    }
                }

                return true;
            }
        }

        private bool HoldsWindowNoLock(string windowId)
        {
            foreach (UIHandle handle in _handles.Values)
            {
                if (StringComparer.Ordinal.Equals(handle.Instance.WindowId, windowId))
                    return true;
            }

            return false;
        }

        public bool TryTakeVisibilityFlip(out bool wasVisible)
        {
            lock (_sync)
            {
                var visible = HasVisibleViewers;

                if (visible == _heardVisible)
                {
                    wasVisible = false;
                    return false;
                }

                wasVisible = _heardVisible;
                _heardVisible = visible;
                return true;
            }
        }

        public (UIClientState Previous, bool Flipped) RefreshClientState(UIHandle handle, UIClientState state)
        {
            lock (_sync)
            {
                UIClientState previous = handle.RefreshClientState(state);
                var flipped = false;

                // Counted only while attached: one that left, or a render's own, is no viewer to count.
                if (IsViewer(handle.Instance) && _handles.TryGetValue(handle.Instance.Id, out UIHandle? attached) && ReferenceEquals(attached, handle))
                    flipped = CountVisibleNoLock(previous.IsVisible, state.IsVisible);

                return (previous, flipped);
            }
        }

        public bool MarkNavigationRun(string? pageId)
        {
            lock (_sync)
                _navigatedPageId = pageId;

            return true;
        }

        public bool TakeNavigationRun(string? pageId)
        {
            lock (_sync)
            {
                var renderRan = pageId is not null && string.Equals(_navigatedPageId, pageId, StringComparison.Ordinal);

                _navigatedPageId = null;

                return !renderRan;
            }
        }

        public SessionMove TakeSessionMove(IUserSessionContext session)
        {
            lock (_sync)
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

        public bool HasSessionMoved(IUserSessionContext session)
        {
            lock (_sync)
                return !string.Equals(_heardLanguage, session.Language, StringComparison.Ordinal) || _heardThemeMode != session.ThemeMode;
        }

        public void MarkSnapshot(string instanceId, long sequence)
        {
            lock (_sync)
            {
                _watermarks[instanceId] = sequence;
                _ = _awaitingSnapshot.Remove(instanceId);
            }
        }

        public void MarkAnswered(string instanceId, long sequence)
        {
            lock (_sync)
            {
                // An instance still to take its snapshot is marked by the snapshot, and one that left needs no mark.
                if (!_handles.ContainsKey(instanceId) || _awaitingSnapshot.Contains(instanceId))
                    return;

                if (!_watermarks.TryGetValue(instanceId, out var watermark) || watermark < sequence)
                    _watermarks[instanceId] = sequence;
            }
        }

        public ServerChangeSet ChangesFor(string instanceId, ServerChangeSet changes)
        {
            long watermark;

            lock (_sync)
            {
                if (_awaitingSnapshot.Contains(instanceId))
                    return ServerChangeSet.Empty;

                _ = _watermarks.TryGetValue(instanceId, out watermark);
            }

            return changes.After(watermark).For(instanceId);
        }
    }
}
