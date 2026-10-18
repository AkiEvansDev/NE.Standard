using System;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Shell.Filters;

namespace NE.Standard.UI.Shell.Navigation;

/// <summary>
/// Intercepts the resolution of a view, so a route can carry cross-cutting behaviour of its own.
/// </summary>
/// <remarks>
/// Ordered by <see cref="IUIFilter{TContext}.Order"/>, ties broken by attachment: global, then view, then controller.
/// </remarks>
[SuppressMessage("Design", "CA1040:Avoid empty interfaces", Justification = "Names the view side of IUIFilter, which an attribute implements and the pipeline collects.")]
public interface IUIViewFilter : IUIFilter<UIViewFilterContext>;

/// <summary>
/// Creates a view filter from the service provider, for a filter attribute that needs dependencies.
/// </summary>
public interface IUIViewFilterFactory
{
    /// <summary>
    /// Gets the order the created filter runs in — read from the attribute, since the filter itself does not
    /// exist until the request does.
    /// </summary>
    int Order => 0;

    /// <summary>
    /// Creates the filter that runs in this attribute's place.
    /// </summary>
    IUIViewFilter CreateFilter(IServiceProvider services);
}
