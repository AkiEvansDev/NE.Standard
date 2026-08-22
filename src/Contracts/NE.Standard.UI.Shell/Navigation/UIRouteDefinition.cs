using System;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Shell.Controllers;

namespace NE.Standard.UI.Shell.Navigation;

/// <summary>
/// Defines a routable UI view and its runtime metadata.
/// </summary>
public sealed class UIRouteDefinition
{
    /// <summary>
    /// Gets the route pattern or route key.
    /// </summary>
    public required string Route { get; init; }

    /// <summary>
    /// Gets the authored view key resolved by this route.
    /// </summary>
    public required string ViewKey { get; init; }

    /// <summary>
    /// Gets the controller type associated with the route.
    /// </summary>
    public Type? ControllerType { get; init; }

    /// <summary>
    /// Gets whether the route can be accessed without authorization.
    /// </summary>
    public bool AllowAnonymous { get; init; }

    /// <summary>
    /// Gets access rules required by the route.
    /// </summary>
    public UIAccessRule[] AccessRules { get; init; } = [];

    /// <summary>
    /// Gets the view filters attached to this route, already ordered.
    /// </summary>
    public IUIViewFilter[] ViewFilters { get; init; } = [];

    /// <summary>
    /// Gets when the route view is compiled.
    /// </summary>
    public UIViewCompilationMode ViewCompilationMode { get; init; } = UIViewCompilationMode.Startup;

    /// <summary>
    /// Gets how controller updates are flushed to the client.
    /// </summary>
    public UIControllerUpdateMode ControllerUpdateMode { get; init; } = UIControllerUpdateMode.Batch;

    /// <summary>
    /// Gets the controller flush interval in milliseconds, or -1 to use the runtime default.
    /// </summary>
    public int FlushIntervalMilliseconds { get; init; } = -1;

    /// <summary>
    /// Gets the controller flush interval, or <see langword="null"/> when the runtime default should be used.
    /// </summary>
    public TimeSpan? FlushInterval
        => FlushIntervalMilliseconds < 0
            ? null
            : TimeSpan.FromMilliseconds(FlushIntervalMilliseconds);

    /// <summary>
    /// Validates the route definition.
    /// </summary>
    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(Route);
        ArgumentException.ThrowIfNullOrWhiteSpace(ViewKey);
        ArgumentNullException.ThrowIfNull(AccessRules);

        if (ControllerType is not null && !typeof(IUIController).IsAssignableFrom(ControllerType))
            throw new ArgumentException($"Controller type '{ControllerType.Name}' must implement '{nameof(IUIController)}'.", nameof(ControllerType));

        if (FlushIntervalMilliseconds == 0)
            throw new ArgumentOutOfRangeException(nameof(FlushIntervalMilliseconds), FlushIntervalMilliseconds, "Flush interval must be greater than zero.");

        if (FlushIntervalMilliseconds < -1)
            throw new ArgumentOutOfRangeException(nameof(FlushIntervalMilliseconds), FlushIntervalMilliseconds, "Flush interval must be -1 or greater than zero.");

        for (var i = 0; i < AccessRules.Length; i++)
        {
            ArgumentNullException.ThrowIfNull(AccessRules[i]);
            AccessRules[i].Validate();
        }
    }
}
