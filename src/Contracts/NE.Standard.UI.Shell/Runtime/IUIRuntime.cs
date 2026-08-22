using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>
/// Represents a running UI runtime instance for a resolved view and controller.
/// </summary>
public interface IUIRuntime : IUIRuntimeAccess, IAsyncDisposable, IDisposable
{
    /// <summary>
    /// Gets whether the runtime has been initialized.
    /// </summary>
    bool IsInitialized { get; }

    /// <summary>
    /// Gets whether the runtime has been started.
    /// </summary>
    bool IsStarted { get; }

    /// <summary>
    /// Gets whether the runtime has been stopped.
    /// </summary>
    bool IsStopped { get; }

    /// <summary>
    /// Gets the runtime handle.
    /// </summary>
    UIHandle Handle { get; }

    /// <summary>
    /// Gets the client instances currently attached to this runtime.
    /// </summary>
    IReadOnlyCollection<string> AttachedInstanceIds { get; }

    /// <summary>
    /// Gets the compiled view served by the runtime.
    /// </summary>
    CompiledView View { get; }

    /// <summary>
    /// Gets the controller attached to the runtime.
    /// </summary>
    IUIController Controller { get; }

    /// <summary>
    /// Initializes the runtime and its controller.
    /// </summary>
    Task InitializeAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Starts runtime processing.
    /// </summary>
    Task StartAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Stops runtime processing.
    /// </summary>
    Task StopAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Builds initial server-originated updates for the specified compiled bindings.
    /// </summary>
    Task<ServerChangeSet> BuildInitialChangeSetAsync(IReadOnlyCollection<UIBindingId> bindingIds, CancellationToken cancellationToken = default);

    /// <summary>
    /// Builds a synthetic insert changeset for every bound items collection in the view.
    /// </summary>
    Task<IReadOnlyList<ServerCollectionChangeUIUpdate>> BuildInitialCollectionChangesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Processes client-originated value changes.
    /// </summary>
    Task<ServerChangeSet> ProcessChangeSetFromUIAsync(ClientChangeSet changeSet, CancellationToken cancellationToken = default);

    /// <summary>
    /// Processes a client-originated event command.
    /// </summary>
    Task<UICommandExecutionResult> ProcessEventAsync(UIHandle invoker, UICommandRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Reads a window of items for a windowed host, and returns what that changed.
    /// </summary>
    Task<ServerChangeSet> RequestItemWindowAsync(UIItemWindowClientRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Flushes pending server-originated updates.
    /// </summary>
    Task<ServerChangeSet> FlushAsync(CancellationToken cancellationToken = default);
}
