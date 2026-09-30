using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    private const string LanguageChangedOperation = "LanguageChanged";

    private readonly Lock _connectionsLock = new();
    // Each attached instance's handle, so the connection outside a command can pass to a tab still attached when its own leaves.
    private readonly Dictionary<string, UIHandle> _attachedHandles = new(StringComparer.Ordinal);

    // Materialized snapshot: the flush loop reads it every tick and would otherwise copy the set each time.
    private string[] _attachedInstanceIdsSnapshot = [];

    // The attached instances that are a page someone looks at, leaving out a page render's own; read without the lock.
    private int _viewers;

    // The last queued update each instance's attach snapshot holds; an instance with none is sent every change set whole, unless it
    // starts from a snapshot it has not taken yet, and then it is sent nothing.
    private readonly Dictionary<string, long> _watermarks = new(StringComparer.Ordinal);
    private readonly HashSet<string> _awaitingSnapshot = new(StringComparer.Ordinal);

    // The page whose render last ran the navigation hook, which its own attach then skips.
    private string? _navigatedPageId;

    /// <inheritdoc />
    public IReadOnlyCollection<string> AttachedInstanceIds => _attachedInstanceIdsSnapshot;

    /// <inheritdoc />
    public bool HasViewers => Volatile.Read(ref _viewers) > 0;

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
        var added = !_attachedHandles.ContainsKey(instance.Id);

        _attachedHandles[instance.Id] = handle;

        if (added)
        {
            _attachedInstanceIdsSnapshot = [.. _attachedHandles.Keys];

            if (IsViewer(instance))
                Volatile.Write(ref _viewers, _viewers + 1);
        }

        if (instance.StartsFromSnapshot && !_watermarks.ContainsKey(instance.Id))
            _ = _awaitingSnapshot.Add(instance.Id);
    }

    /// <inheritdoc />
    public void DetachConnection(string instanceId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);

        UIHandle? removed;

        lock (_connectionsLock)
        {
            _ = _watermarks.Remove(instanceId);
            _ = _awaitingSnapshot.Remove(instanceId);

            if (!_attachedHandles.Remove(instanceId, out removed))
                return;

            _attachedInstanceIdsSnapshot = [.. _attachedHandles.Keys];

            if (IsViewer(removed.Instance))
                Volatile.Write(ref _viewers, _viewers - 1);

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
            PostCore("Detached", lifecycle.DetachedAsync);
    }

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
            if (navigated)
                await lifecycle.NavigatedAsync(instance.Navigation, cancellation).ConfigureAwait(false);

            if (viewer)
                await lifecycle.AttachedAsync(instance.Navigation, cancellation).ConfigureAwait(false);
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
    /// Runs a controller's lifecycle hook as a command runs: held, under the state lock, its writes queued like a command's, and the
    /// given connection its handle. The hook's failure is the controller's to report; the attach or the switch still stands.
    /// </summary>
    private async Task RunLifecycleHookAsync(UIHandle handle, string operation, Func<CancellationToken, Task> hook, CancellationToken cancellationToken)
    {
        await using ConfiguredAsyncDisposable hold = HoldAsCommand().ConfigureAwait(false);
        ThrowIfAskedToGo();

        using IDisposable invocation = BeginInvocation(handle);

        try
        {
            _ = await InvokeAsync(hook, cancellationToken).ConfigureAwait(false);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            _ = await HandleRuntimeExceptionAsync(exception, operation, commandRequest: null, clientChangeSet: null, cancellationToken).ConfigureAwait(false);
        }
    }

    /// <summary>
    /// A command's code switched its connection's language: the controller's hook inline — the command already runs outside the
    /// lock, and waits for it — then the page is told to switch.
    /// </summary>
    async Task IUILanguageChangeListener.LanguageChangedAsync(UIHandle handle, string previousLanguage, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(handle);

        if (Controller is IUIControllerLifecycle lifecycle)
        {
            try
            {
                await lifecycle.LanguageChangedAsync(previousLanguage, cancellationToken).ConfigureAwait(false);
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception exception)
            {
                // The language did switch; the hook's failure is the controller's to report, not the command's.
                _ = await HandleRuntimeExceptionAsync(exception, LanguageChangedOperation, commandRequest: null, clientChangeSet: null, cancellationToken).ConfigureAwait(false);
            }
        }

        await PushCommandResultAsync(handle, new UICommandExecutionResult
        {
            Command = UICommandResult.Ok([new SetLanguageEffect(handle.Session.Language)]),
            Changes = ServerChangeSet.Empty
        }, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async Task NotifyLanguageChangedAsync(UIHandle handle, string previousLanguage, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentException.ThrowIfNullOrWhiteSpace(previousLanguage);

        if (Controller is not IUIControllerLifecycle lifecycle)
            return;

        await RunLifecycleHookAsync(handle, LanguageChangedOperation, cancellation => lifecycle.LanguageChangedAsync(previousLanguage, cancellation), cancellationToken).ConfigureAwait(false);
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
