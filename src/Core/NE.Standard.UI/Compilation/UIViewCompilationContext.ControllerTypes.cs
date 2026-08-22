using System;
using System.Collections.Generic;
using System.Reflection;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Data;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    private const string BindableItemGuidance =
        "Every rendered item is addressed by its key, so an item collection must carry one per item. Implement " +
        "'IBindableItem' on the item type, or wrap a plain value in 'UIValueItem<T>' ('UIOptionValue<T>' for " +
        "Select/Search/RadioGroup) so the value itself becomes the key.";

    /// <summary>
    /// Rejects a statically-authored item collection whose elements cannot be addressed.
    /// </summary>
    /// <remarks>
    /// The instances are right here at compile time, so this is exact rather than best-effort — unlike the
    /// bound case below, which can only reach a verdict when the path resolves against the controller's types.
    /// </remarks>
    private static void EnsureStaticItemsAreBindable(IVisualComponent component, IItemsComponent itemsComponent)
    {
        IReadOnlyList<object?> items = itemsComponent.Items;

        for (var i = 0; i < items.Count; i++)
        {
            if (items[i] is null or IBindableItem)
                continue;

            throw new InvalidOperationException(
                $"Component '{component.Id}' has a static item #{i} of type '{items[i]!.GetType().Name}', which does not " +
                $"implement '{nameof(IBindableItem)}'. {BindableItemGuidance}");
        }
    }

    /// <summary>
    /// Rejects a bound item collection whose element type cannot be addressed.
    /// </summary>
    /// <remarks>
    /// Stays silent on anything it cannot positively resolve — a view with no controller type, a non-controller
    /// source, a path the walk loses. The renderer refuses those at render time instead; this exists to turn the
    /// common case into a build error rather than a page that throws.
    /// </remarks>
    private void EnsureBoundItemsAreBindable(IVisualComponent component, CompiledPath collectionPath)
    {
        if (_controllerType is null || collectionPath.Source.Kind != CompiledUIBindingSourceKind.Controller)
            return;

        Type? collectionType = TryResolveControllerPathType(collectionPath.Template.Template);

        if (collectionType is null)
            return;

        Type? itemType = TryResolveElementType(collectionType);

        if (itemType is null || typeof(IBindableItem).IsAssignableFrom(itemType) || itemType == typeof(object))
            return;

        throw new InvalidOperationException(
            $"Component '{component.Id}' binds items to '{collectionPath.Template.Template}', whose element type " +
            $"'{itemType.Name}' does not implement '{nameof(IBindableItem)}'. {BindableItemGuidance}");
    }

    /// <summary>
    /// Rejects a windowed host whose bound path is not a source at all — the usual slip being a path that names
    /// the window instead of the source that holds it, which would then address one property too deep.
    /// </summary>
    /// <remarks>
    /// Takes the path *before* the window property is appended, and stays silent on anything it cannot
    /// positively resolve, like every other check here.
    /// </remarks>
    private void EnsureWindowedSourceIsAnItemSource(IVisualComponent component, CompiledPath sourcePath)
    {
        if (!IsWindowedItemsHost(component) || _controllerType is null || sourcePath.Source.Kind != CompiledUIBindingSourceKind.Controller)
            return;

        Type? sourceType = TryResolveControllerPathType(sourcePath.Template.Template);

        if (sourceType is null || typeof(UIItemSourceBase).IsAssignableFrom(sourceType))
            return;

        throw new InvalidOperationException(
            $"Component '{component.Id}' binds a source to '{sourcePath.Template.Template}', whose type " +
            $"'{sourceType.Name}' does not derive from '{nameof(UIItemSourceBase)}'. Bind the source itself, not its window.");
    }

    /// <summary>
    /// Rejects static items on a windowed host: where the items come from is one decision, and a host that
    /// answers it twice would show the authored ones until the first window arrived and lose them after.
    /// </summary>
    private static void EnsureWindowedHostHasNoStaticItems(IVisualComponent component, IItemsComponent itemsComponent)
    {
        if (IsWindowedItemsHost(component) && itemsComponent.HasItems)
        {
            throw new InvalidOperationException(
                $"Component '{component.Id}' binds a source and also carries {itemsComponent.Items.Count} static item(s). " +
                "A windowed host takes its items from the source alone.");
        }
    }

    /// <summary>
    /// Rejects virtualizing a windowed host, which is already showing nothing but a window and would be
    /// virtualizing a virtualization.
    /// </summary>
    /// <remarks>
    /// Grouping is <em>not</em> refused here, though a virtualized host cannot lay it out either: whether a
    /// collection groups is a fact about its items, not about the view — every items view carries a default
    /// group template and none of them means anything until an item names a group. The client stands down on
    /// a host that turns out to have group headers.
    /// </remarks>
    private static void EnsureVirtualizationIsLayableOut(IVisualComponent component)
    {
        if (component is IVirtualizedItemsComponent { Virtualize: true } && IsWindowedItemsHost(component))
            throw new InvalidOperationException($"Component '{component.Id}' binds a source and is virtualized. A windowed host already lays out only what it holds.");
    }

    /// <summary>
    /// Rejects a host marked windowed with nothing bound — only reachable by clearing the binding after
    /// <c>BindSource</c>, which would otherwise render an empty host that never asks anyone for anything.
    /// </summary>
    private static void EnsureWindowedHostBindsASource(IVisualComponent component)
    {
        if (IsWindowedItemsHost(component))
            throw new InvalidOperationException($"Component '{component.Id}' is windowed but binds no source.");
    }

    /// <summary>
    /// Walks a binding template against the controller's CLR types, returning what it lands on. Returns
    /// <see langword="null"/> as soon as a segment cannot be resolved — the checks this backs must stay silent
    /// on anything they do not positively understand rather than reject a legal view.
    /// </summary>
    private Type? TryResolveControllerPathType(string template)
    {
        Type? current = _controllerType;
        var index = 0;

        while (current is not null && index < template.Length)
        {
            if (template[index] == '.')
            {
                index++;
                continue;
            }

            if (template[index] == '[')
            {
                // Both a parameter and a fixed index or key render as "[]" — either way the walk steps into
                // the collection's element type.
                index += 2;
                current = TryResolveElementType(current);
                continue;
            }

            var start = index;

            while (index < template.Length && template[index] != '.' && template[index] != '[')
                index++;

            PropertyInfo? property = current.GetProperty(template[start..index], BindingFlags.Public | BindingFlags.Instance);
            current = property?.PropertyType;
        }

        return current;
    }

    private static Type? TryResolveElementType(Type collectionType)
    {
        if (collectionType.IsArray)
            return collectionType.GetElementType();

        foreach (Type contract in collectionType.GetInterfaces())
        {
            if (contract.IsGenericType && contract.GetGenericTypeDefinition() == typeof(IEnumerable<>))
                return contract.GetGenericArguments()[0];
        }

        return null;
    }
}
