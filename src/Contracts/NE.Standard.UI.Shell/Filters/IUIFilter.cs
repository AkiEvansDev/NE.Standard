using System;
using System.Threading.Tasks;

namespace NE.Standard.UI.Shell.Filters;

/// <summary>
/// Intercepts one step the framework takes — a view's resolution, a command's run — around the rest of its pipeline; the base of
/// <c>IUIViewFilter</c> and <c>IUICommandFilter</c>.
/// </summary>
public interface IUIFilter<in TContext>
    where TContext : IUIFilterContext
{
    /// <summary>
    /// Gets the order this filter runs in, lowest first; ties break by where the filter is attached.
    /// </summary>
    int Order => 0;

    /// <summary>
    /// Runs the filter around the rest of the pipeline.
    /// </summary>
    Task InvokeAsync(TContext context, Func<Task> next);
}
