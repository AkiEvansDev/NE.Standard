using System.Collections.Generic;
using System.Linq;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Shell.Commands;

namespace NE.Standard.UI.Controllers;

internal sealed class UICommandDescriptor : IUICommandMetadata
{
    public required string Name { get; init; }
    public required UICommandInvoker Invoker { get; init; }
    public required UIAccessRule[] AccessRules { get; init; }
    public required UICommandConcurrencyMode ConcurrencyMode { get; init; }
    public bool? AllowAnonymous { get; init; }
    public required IUICommandFilter[] Filters { get; init; }

    IReadOnlyList<UIAccessRule> IUICommandMetadata.AccessRules => AccessRules;

    private OrderedRun? _ordered;

    /// <summary>The global filters and the command's own in one run, ordered once per global set; ties keep global then command.</summary>
    public IUICommandFilter[] OrderedFilters(IUICommandFilter[] globalFilters)
    {
        OrderedRun? cached = _ordered;

        if (cached is not null && ReferenceEquals(cached.Global, globalFilters))
            return cached.Filters;

        IUICommandFilter[] filters = [.. globalFilters, .. Filters];

        // A stable sort: filters of one order keep their attachment order.
        filters = [.. filters.OrderBy(static filter => filter.Order)];
        _ordered = new OrderedRun(globalFilters, filters);

        return filters;
    }

    private sealed record OrderedRun(IUICommandFilter[] Global, IUICommandFilter[] Filters);
}
