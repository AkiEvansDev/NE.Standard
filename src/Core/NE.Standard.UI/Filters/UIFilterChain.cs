using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Shell.Filters;

namespace NE.Standard.UI.Filters;

/// <summary>
/// The one filter pipeline the view and the command sides share: the chain folded around its inner step.
/// </summary>
internal static class UIFilterChain
{
    /// <summary>
    /// Folds <paramref name="filters"/>, the first outermost, around <paramref name="inner"/>.
    /// </summary>
    public static Func<Task> Fold<TContext>(IReadOnlyList<IUIFilter<TContext>> filters, TContext context, Func<Task> inner)
        where TContext : IUIFilterContext
    {
        Func<Task> next = inner;

        for (var i = filters.Count - 1; i >= 0; i--)
        {
            IUIFilter<TContext> filter = filters[i];
            Func<Task> rest = next;

            next = () => filter.InvokeAsync(context, rest);
        }

        return next;
    }
}

/// <summary>
/// Runs a filter attribute that builds its real filter from the service provider.
/// </summary>
/// <remarks>Created per invocation, not once at registration, so it does not capture the wrong service scope.</remarks>
internal abstract class UIFilterFactoryAdapter<TContext>(int order, Type factoryType, Func<IServiceProvider, IUIFilter<TContext>?> create) : IUIFilter<TContext>
    where TContext : IUIFilterContext
{
    public int Order => order;

    public Task InvokeAsync(TContext context, Func<Task> next)
    {
        ArgumentNullException.ThrowIfNull(context);

        IUIFilter<TContext> filter = create(context.Services)
            ?? throw new InvalidOperationException($"Filter factory '{factoryType.Name}' returned null.");

        return filter.InvokeAsync(context, next);
    }
}

/// <summary>
/// Runs a globally-registered filter type resolved from the service provider per invocation.
/// </summary>
internal abstract class UIFilterServiceAdapter<TContext, TFilter>(int order) : IUIFilter<TContext>
    where TContext : IUIFilterContext
    where TFilter : class, IUIFilter<TContext>
{
    public int Order => order;

    public Task InvokeAsync(TContext context, Func<Task> next)
    {
        ArgumentNullException.ThrowIfNull(context);

        return context.Services.GetRequiredService<TFilter>().InvokeAsync(context, next);
    }
}
