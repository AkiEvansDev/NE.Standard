using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    private void ValidateItemsView(IVisualComponent component)
    {
        if (component is not IItemsComponent itemsComponent)
            return;

        UIItemsView? itemsView = itemsComponent.ItemsView;

        if (itemsView is null || itemsView.IsEmpty)
            return;

        var windowed = IsWindowedItemsHost(component);

        for (var i = 0; i < itemsView.Filters.Length; i++)
            ValidateItemsFilter(component, itemsView.Filters[i], i, windowed);

        for (var i = 0; i < itemsView.Sorts.Length; i++)
            ValidateItemsSort(component, itemsView.Sorts[i], i, windowed);
    }

    private void ValidateItemsFilter(IVisualComponent owner, UIItemsFilter filter, int index, bool windowed)
    {
        ArgumentNullException.ThrowIfNull(filter);

        ValidateItemsRuleSource(owner, filter.Source, $"filter[{index}]", windowed);
        ValidateItemProperty(owner, filter.ItemProperty, $"filter[{index}]");
    }

    /// <summary>
    /// Checks that a rule's source names a real property, and — on a windowed host — that the server can read
    /// its value.
    /// </summary>
    /// <remarks>
    /// A windowed host's rules are resolved on the server, which knows a component's value only where it is
    /// bound to the controller: an unbound search box lives entirely in the browser, and a filter reading it
    /// would simply never activate. Refused here rather than left to fail quietly, since nothing about the
    /// page would look wrong.
    /// </remarks>
    private void ValidateItemsRuleSource(IVisualComponent owner, UIItemsRuleSource source, string ruleName, bool windowed)
    {
        if (source.Source is not UIPropertyReference reference)
            return;

        ArgumentException.ThrowIfNullOrWhiteSpace(reference.Component.Id);

        UIComponentId sourceComponentId = GetComponentId(reference.Component.Id);
        var sourceAuthoringId = GetAuthoringId(sourceComponentId);

        if (!_components.TryGetValue(sourceAuthoringId, out IVisualComponent? sourceComponent))
            throw new InvalidOperationException($"ItemsView {ruleName} source component '{reference.Component.Id}' was not found for component '{owner.Id}'.");

        _ = GetRequiredPropertyDefinition(sourceComponent.TypeKey, reference.Property);

        if (windowed && FindBinding(sourceComponent, reference.Property) is null)
        {
            throw new InvalidOperationException(
                $"ItemsView {ruleName} on windowed component '{owner.Id}' reads '{reference.Component.Id}.{reference.Property.Name}', " +
                "which is not bound. A windowed host resolves its rules on the server, so a rule source must be bound to the controller.");
        }
    }

    private static void ValidateItemProperty(IVisualComponent owner, string itemProperty, string ruleName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);

        try
        {
            _ = RecursivePath.Parse(itemProperty);
        }
        catch (FormatException exception)
        {
            throw new InvalidOperationException($"ItemsView {ruleName} item property '{itemProperty}' on component '{owner.Id}' is not a valid recursive path.", exception);
        }
    }

    private void ValidateItemsSort(IVisualComponent owner, UIItemsSort sort, int index, bool windowed)
    {
        ArgumentNullException.ThrowIfNull(sort);

        ValidateItemsRuleSource(owner, sort.Source, $"sort[{index}]", windowed);
        ValidateItemProperty(owner, sort.ItemProperty, $"sort[{index}]");

        if (sort.Priority < 0)
            throw new InvalidOperationException($"ItemsView sort[{index}] priority on component '{owner.Id}' must not be negative.");
    }
}
