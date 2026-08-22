using System;
using System.Collections.Generic;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Shell.Commands;

/// <summary>
/// What a command filter is given about the invocation it is intercepting.
/// </summary>
public sealed class UICommandFilterContext
{
    /// <summary>
    /// Creates a filter context for one command invocation.
    /// </summary>
    public UICommandFilterContext(IUICommandMetadata command, IReadOnlyDictionary<string, object?> arguments, UIHandle handle, UIRouteDefinition route, IServiceProvider services)
    {
        ArgumentNullException.ThrowIfNull(command);
        ArgumentNullException.ThrowIfNull(arguments);
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(route);
        ArgumentNullException.ThrowIfNull(services);

        Command = command;
        Arguments = arguments;
        Handle = handle;
        Route = route;
        Services = services;
    }

    /// <summary>
    /// Gets what is known about the command being invoked, including its access rules.
    /// </summary>
    public IUICommandMetadata Command { get; }

    /// <summary>
    /// Gets the arguments the command will be invoked with, keyed by parameter name.
    /// </summary>
    public IReadOnlyDictionary<string, object?> Arguments { get; }

    /// <summary>
    /// Gets the handle of the connection that raised the command, and through it the session.
    /// </summary>
    public UIHandle Handle { get; }

    /// <summary>
    /// Gets the route the controller is running on.
    /// </summary>
    public UIRouteDefinition Route { get; }

    /// <summary>
    /// Gets the application service provider.
    /// </summary>
    public IServiceProvider Services { get; }

    /// <summary>
    /// Gets whether the command itself ran.
    /// </summary>
    /// <remarks>
    /// False inside a filter that has not yet awaited <c>next</c>, and still false afterwards when an inner
    /// filter short-circuited — which is how an outer filter tells "it ran and failed" from "it never ran".
    /// </remarks>
    public bool Invoked { get; private set; }

    /// <summary>
    /// Gets or sets the result the invocation returns.
    /// </summary>
    /// <remarks>
    /// Unlike the view pipeline's observation-only resolution, this <em>is</em> what the caller gets: a filter
    /// may replace it after <c>next</c> to add effects or reword a failure, or set it without calling
    /// <c>next</c> at all to short-circuit. A pipeline that short-circuits without leaving a result is an
    /// error, because there is nothing to return.
    /// </remarks>
    public UICommandResult? Result { get; set; }

    /// <summary>
    /// Records that the command ran. Called by the pipeline, not by filters.
    /// </summary>
    public void MarkInvoked()
        => Invoked = true;
}
