using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Compiled.Items;

namespace NE.Standard.UI.Items;

internal static class UIItemsViewResolver
{
    public static CompiledUIItemsView Resolve(UIItemsView itemsView, IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(itemsView);
        ArgumentNullException.ThrowIfNull(resolver);

        CompiledUIItemsFilter[] filters = itemsView.Filters.Length == 0
            ? []
            : new CompiledUIItemsFilter[itemsView.Filters.Length];

        for (var i = 0; i < filters.Length; i++)
            filters[i] = ResolveFilter(itemsView.Filters[i], resolver);

        CompiledUIItemsSort[] sorts = itemsView.Sorts.Length == 0
            ? []
            : new CompiledUIItemsSort[itemsView.Sorts.Length];

        for (var i = 0; i < sorts.Length; i++)
            sorts[i] = ResolveSort(itemsView.Sorts[i], resolver);

        return new CompiledUIItemsView(filters, sorts);
    }

    private static CompiledUIItemsFilter ResolveFilter(UIItemsFilter filter, IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(filter);

        return new CompiledUIItemsFilter(ResolveSource(filter.Source, resolver), filter.ItemProperty, filter.Operator, filter.Value);
    }

    private static CompiledUIItemsSort ResolveSort(UIItemsSort sort, IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(sort);

        return new CompiledUIItemsSort(ResolveSource(sort.Source, resolver), sort.ItemProperty, sort.Direction, sort.Priority);
    }

    private static CompiledUIItemsRuleSource ResolveSource(UIItemsRuleSource source, IUIReferenceResolver resolver)
        => new(
            source.Source is UIPropertyReference reference ? resolver.ResolveProperty(reference) : null,
            source.ActiveOperator,
            source.ActiveValue
        );
}
