using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Shell.Navigation;

namespace NE.Standard.UI.Navigation;

/// <summary>
/// Runs a filter attribute that builds its real filter from the service provider.
/// </summary>
/// <remarks>
/// Created per request, not once at registration, so it does not capture the wrong service scope.
/// </remarks>
internal sealed class UIViewFilterFactoryAdapter(IUIViewFilterFactory factory) : IUIViewFilter
{
    public int Order => factory.Order;

    public Task InvokeAsync(UIViewFilterContext context, Func<Task> next)
    {
        ArgumentNullException.ThrowIfNull(context);

        IUIViewFilter filter = factory.CreateFilter(context.Services)
            ?? throw new InvalidOperationException($"View filter factory '{factory.GetType().Name}' returned null.");

        return filter.InvokeAsync(context, next);
    }
}

/// <summary>
/// Runs a globally-registered filter type resolved from the service provider per request.
/// </summary>
internal sealed class UIViewFilterServiceAdapter<TFilter>(int order) : IUIViewFilter
    where TFilter : class, IUIViewFilter
{
    public int Order => order;

    public Task InvokeAsync(UIViewFilterContext context, Func<Task> next)
    {
        ArgumentNullException.ThrowIfNull(context);

        return context.Services.GetRequiredService<TFilter>().InvokeAsync(context, next);
    }
}
