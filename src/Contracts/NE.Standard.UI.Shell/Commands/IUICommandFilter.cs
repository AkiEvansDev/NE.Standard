using System;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Shell.Filters;

namespace NE.Standard.UI.Shell.Commands;

/// <summary>Intercepts the execution of a command, so a controller can carry cross-cutting behaviour of its own.</summary>
/// <remarks>
/// A filter can change what is reported, not undo what already happened: blocking an effect requires short-circuiting before it runs.
/// Ordered by <see cref="IUIFilter{TContext}.Order"/>, ties broken by attachment: global, then controller, then the command method.
/// </remarks>
[SuppressMessage("Design", "CA1040:Avoid empty interfaces", Justification = "Names the command side of IUIFilter, which an attribute implements and the pipeline collects.")]
public interface IUICommandFilter : IUIFilter<UICommandFilterContext>;

/// <summary>
/// Creates a command filter from the service provider, for a filter attribute that needs dependencies.
/// </summary>
public interface IUICommandFilterFactory
{
    /// <summary>
    /// Gets the order the created filter runs in — read from the attribute, since the filter itself does not
    /// exist until the command does.
    /// </summary>
    int Order => 0;

    /// <summary>
    /// Creates the filter that runs in this attribute's place.
    /// </summary>
    IUICommandFilter CreateFilter(IServiceProvider services);
}
