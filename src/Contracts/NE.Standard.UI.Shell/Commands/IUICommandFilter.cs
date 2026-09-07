using System;
using System.Threading.Tasks;

namespace NE.Standard.UI.Shell.Commands;

/// <summary>
/// Intercepts the execution of a command, so a controller can carry cross-cutting behaviour of its own.
/// </summary>
/// <remarks>
/// A filter can change what is reported, not undo what already happened: blocking an effect requires short-circuiting before it runs.
/// </remarks>
public interface IUICommandFilter
{
    /// <summary>
    /// Gets the order this filter runs in, lowest first. Ties break by attachment: global, then controller,
    /// then the command method.
    /// </summary>
    int Order => 0;

    /// <summary>
    /// Runs the filter around the rest of the pipeline.
    /// </summary>
    Task InvokeAsync(UICommandFilterContext context, Func<Task> next);
}

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
