using System;
using System.Collections.Generic;
using System.Threading;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    private readonly Lock _connectionsLock = new();
    private readonly HashSet<string> _attachedInstanceIds = new(StringComparer.Ordinal);

    // Kept as a materialized snapshot because the flush loop reads it on every tick and would otherwise copy
    // the set each time just to hand it to the sink.
    private string[] _attachedInstanceIdsSnapshot = [];

    /// <inheritdoc />
    public IReadOnlyCollection<string> AttachedInstanceIds => _attachedInstanceIdsSnapshot;

    public virtual void UpdateConnection(UIHandle handle, UIClientServices clientServices)
    {
        ThrowIfDisposed();

        ArgumentNullException.ThrowIfNull(handle);

        clientServices.Validate();
        handle.Instance.Validate();

        AttachInstance(handle.Instance.Id);
        UpdateConnectionSnapshot(RuntimeConnection.FromClientServices(handle, clientServices));

        if (Controller is IUIContextController contextController)
            contextController.Context.RefreshConnection(handle, clientServices.Dialogs, clientServices.Downloads, clientServices.Uploads);
    }

    /// <summary>
    /// Marks the connection a command is running for, on the controller's context. A no-op when the
    /// controller carries no context, which the host refuses to create anyway.
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

    private void AttachInstance(string instanceId)
    {
        lock (_connectionsLock)
        {
            if (_attachedInstanceIds.Add(instanceId))
                _attachedInstanceIdsSnapshot = [.. _attachedInstanceIds];
        }
    }

    /// <inheritdoc />
    public void DetachConnection(string instanceId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);

        lock (_connectionsLock)
        {
            if (_attachedInstanceIds.Remove(instanceId))
                _attachedInstanceIdsSnapshot = [.. _attachedInstanceIds];
        }
    }
}
