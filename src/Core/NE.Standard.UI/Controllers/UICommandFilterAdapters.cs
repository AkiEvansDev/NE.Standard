using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Shell.Commands;

namespace NE.Standard.UI.Controllers;

/// <summary>
/// Runs a filter attribute that builds its real filter from the service provider.
/// </summary>
/// <remarks>
/// Created per invocation rather than once at registration, for the same reason the view pipeline does it: a
/// filter that captured services at registration would hold the wrong scope for the rest of the application's
/// life.
/// </remarks>
internal sealed class UICommandFilterFactoryAdapter(IUICommandFilterFactory factory) : IUICommandFilter
{
    public int Order => factory.Order;

    public Task InvokeAsync(UICommandFilterContext context, Func<Task> next)
    {
        ArgumentNullException.ThrowIfNull(context);

        IUICommandFilter filter = factory.CreateFilter(context.Services)
            ?? throw new InvalidOperationException($"Command filter factory '{factory.GetType().Name}' returned null.");

        return filter.InvokeAsync(context, next);
    }
}

/// <summary>
/// Runs a globally-registered filter type resolved from the service provider per invocation.
/// </summary>
internal sealed class UICommandFilterServiceAdapter<TFilter>(int order) : IUICommandFilter
    where TFilter : class, IUICommandFilter
{
    public int Order => order;

    public Task InvokeAsync(UICommandFilterContext context, Func<Task> next)
    {
        ArgumentNullException.ThrowIfNull(context);

        return context.Services.GetRequiredService<TFilter>().InvokeAsync(context, next);
    }
}
