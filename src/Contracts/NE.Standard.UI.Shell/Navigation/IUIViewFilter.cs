using System;
using System.Threading.Tasks;

namespace NE.Standard.UI.Shell.Navigation;

/// <summary>
/// Intercepts the resolution of a view, so a route can carry cross-cutting behaviour of its own.
/// </summary>
public interface IUIViewFilter
{
    /// <summary>
    /// Gets the order this filter runs in, lowest first. Ties break by attachment: global, then view, then
    /// controller.
    /// </summary>
    int Order => 0;

    /// <summary>
    /// Runs the filter around the rest of the pipeline.
    /// </summary>
    Task InvokeAsync(UIViewFilterContext context, Func<Task> next);
}

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
