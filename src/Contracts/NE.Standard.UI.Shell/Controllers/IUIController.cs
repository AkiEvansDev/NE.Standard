using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Shell.Commands;

namespace NE.Standard.UI.Shell.Controllers;

/// <summary>
/// Defines the runtime contract implemented by UI controllers.
/// </summary>
public interface IUIController : IDisposable
{
    /// <summary>
    /// Initializes the controller before the runtime starts processing client updates.
    /// </summary>
    Task InitializeAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Attempts to get a controller value by recursive path.
    /// </summary>
    bool TryGetRecursiveValue(RecursivePath path, out object? value);

    /// <summary>
    /// Gets a controller value by recursive path or throws when it cannot be resolved.
    /// </summary>
    object? GetRecursiveValue(RecursivePath path);

    /// <summary>
    /// Attempts to set a controller value by recursive path.
    /// </summary>
    bool TrySetRecursiveValue(RecursivePath path, object? value);

    /// <summary>
    /// Sets a controller value by recursive path or throws when it cannot be set.
    /// </summary>
    void SetRecursiveValue(RecursivePath path, object? value);

    /// <summary>
    /// Drains pending recursive changes into the destination collection.
    /// </summary>
    int DrainChanges(ICollection<RecursiveChange> destination);

    /// <summary>
    /// Sets a callback invoked when controller state changes.
    /// </summary>
    void SetChangeNotifier(Action<RecursiveChange>? notify);

    /// <summary>
    /// Gets metadata for a command exposed by the controller.
    /// </summary>
    IUICommandMetadata GetCommandMetadata(string command);

    /// <summary>
    /// Executes a command exposed by the controller.
    /// </summary>
    Task<UICommandResult> ExecuteCommandAsync(string command, IReadOnlyDictionary<string, object?>? parameters, CancellationToken cancellationToken = default);

    /// <summary>
    /// Handles an exception raised while processing runtime operations for this controller.
    /// </summary>
    Task<RuntimeExceptionResult> HandleRuntimeExceptionAsync(RuntimeExceptionContext context, CancellationToken cancellationToken = default);
}
