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
    /// Rejects a statically-authored item collection whose elements cannot be addressed, or two of which share an address.
    /// </summary>
    private static void EnsureStaticItemsAreBindable(IVisualComponent component, IItemsComponent itemsComponent)
    {
        IReadOnlyList<object?> items = itemsComponent.Items;
        HashSet<string> ids = new(StringComparer.Ordinal);

        for (var i = 0; i < items.Count; i++)
        {
            if (items[i] is null)
                continue;

            if (items[i] is IBindableItem bindable)
            {
                if (string.IsNullOrWhiteSpace(bindable.Id))
                    throw new InvalidOperationException($"Component '{component.Id}' has a static item #{i} with no id. {BindableItemGuidance}");

                if (!ids.Add(bindable.Id))
                    throw new InvalidOperationException($"Component '{component.Id}' has two static items with the id '{bindable.Id}'; a key addresses one item.");

                continue;
            }

            throw new InvalidOperationException(
                $"Component '{component.Id}' has a static item #{i} of type '{items[i]!.GetType().Name}', which does not " +
                $"implement '{nameof(IBindableItem)}'. {BindableItemGuidance}");
        }
    }

    /// <summary>
    /// Rejects a bound item collection whose element type cannot be addressed.
    /// </summary>
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
    /// Rejects a windowed host whose bound path names the window instead of the source that holds it.
    /// </summary>
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
    /// Rejects static items on a windowed host, which takes its items from the source alone.
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
    /// Rejects a host marked windowed with nothing bound.
    /// </summary>
    private static void EnsureWindowedHostBindsASource(IVisualComponent component)
    {
        if (IsWindowedItemsHost(component))
            throw new InvalidOperationException($"Component '{component.Id}' is windowed but binds no source.");
    }

    /// <summary>
    /// Walks a binding template against the controller's CLR types, returning what it lands on, or
    /// <see langword="null"/> as soon as a segment cannot be resolved.
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
                // Both a parameter and a fixed index or key render as "[]" — either way the walk steps into the collection's element type.
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
