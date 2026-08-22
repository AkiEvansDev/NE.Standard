using System;
using System.Threading.Tasks;

namespace NE.Standard.UI.Shell.Commands;

/// <summary>
/// Intercepts the execution of a command, so a controller can carry cross-cutting behaviour of its own.
/// </summary>
/// <remarks>
/// The command-side counterpart of <c>IUIViewFilter</c>, and the same single method covers every shape: work
/// before the command runs, work after it (with <see cref="UICommandFilterContext.Result"/> to hand), a
/// short-circuit (do not call the next delegate — set the result instead), and exception handling (wrap the
/// call). Implement it on an attribute to attach it to a controller class or a single command method, or
/// register one globally with <c>UIApplicationBuilder.AddCommandFilter</c>.
/// <para>
/// <b>A filter can change what is reported, not undo what happened.</b> By the time a filter runs after
/// <c>next</c>, the command's writes are already in the controller's change buffer and on their way to the
/// client; <c>RecursiveObservable</c> has no transaction to roll back. A filter that must prevent an effect
/// has to short-circuit before the command runs.
/// </para>
/// <para>
/// An attribute cannot take constructor dependencies, so implement <see cref="IUICommandFilterFactory"/> when
/// the filter needs services rather than trying to resolve them from a field.
/// </para>
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
