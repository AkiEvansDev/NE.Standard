using System;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Shell.Hosting;

/// <summary>
/// Represents an attached runtime resolution for a resolved view.
/// </summary>
public sealed class RuntimeResolution
{
    /// <summary>
    /// Gets the resolved view information.
    /// </summary>
    public required UIViewResolution ViewResolution { get; init; }

    /// <summary>
    /// Gets the UI runtime handle.
    /// </summary>
    public required UIHandle Handle { get; init; }

    /// <summary>
    /// Gets the attached runtime, when the route declares a controller.
    /// </summary>
    public IUIRuntime? Runtime { get; init; }

    /// <summary>
    /// Gets the resolved route.
    /// </summary>
    public UIRouteDefinition Route => ViewResolution.Route;

    /// <summary>
    /// Gets the resolved navigation request.
    /// </summary>
    public UINavigationRequest Navigation => ViewResolution.Navigation;

    /// <summary>
    /// Gets the compiled view.
    /// </summary>
    public CompiledView CompiledView => ViewResolution.View;

    /// <summary>
    /// Validates the runtime resolution.
    /// </summary>
    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(ViewResolution);
        ArgumentNullException.ThrowIfNull(Handle);

        ViewResolution.Validate();

        if (Route.ControllerType is not null && Runtime is null)
            throw new InvalidOperationException($"Route '{Route.Route}' requires a runtime.");

        if (Route.ControllerType is null && Runtime is not null)
            throw new InvalidOperationException($"Route '{Route.Route}' does not declare a controller.");
    }
}
