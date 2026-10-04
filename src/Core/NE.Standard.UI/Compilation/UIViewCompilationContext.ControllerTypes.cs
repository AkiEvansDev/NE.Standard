using System;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;
using System.Text;
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
    /// Refuses a controller path that reads one element of a collection by a fixed index or key before any row: the first paint
    /// sends it no value, a keyed collection's change never matches it, and a row's walk, which starts on the row's item, stops at it.
    /// </summary>
    private static void EnsureNoFixedControllerSegment(IVisualComponent component, string reads, CompiledPath path)
    {
        // A row reached first: a fixed segment after it is read off the row's own item, which the row carries.
        if (path.Source.Kind != CompiledUIBindingSourceKind.Controller || path.Parameters.Length == 0 || path.Parameters[0].Kind != CompiledUIBindingParameterKind.Fixed)
            return;

        throw new InvalidOperationException(
            $"Component '{component.Id}' {reads} '{DescribePath(path)}', which reads one element of a collection by a fixed index or key " +
            "from the controller. Address one element per row through an item template; a fixed [0] or [\"key\"] is read inside a row's item.");
    }

    /// <summary>A compiled controller path as written: its fixed segments filled in, a row's left as "[]".</summary>
    private static string DescribePath(CompiledPath path)
    {
        var parts = path.Template.Template.Split("[]");
        StringBuilder builder = new(parts[0]);

        for (var i = 1; i < parts.Length; i++)
        {
            _ = builder.Append(path.Parameters[i - 1].Value switch
            {
                int index => string.Create(CultureInfo.InvariantCulture, $"[{index}]"),
                string key => $"[\"{key}\"]",
                _ => "[]"
            });
            _ = builder.Append(parts[i]);
        }

        return builder.ToString();
    }

    /// <summary>
    /// Warns when a bound path names a property the controller's types don't have — a typo the component would otherwise show
    /// silently. The path is the compiled one, from the controller down, so a relative or parent binding is checked as well.
    /// </summary>
    /// <remarks>
    /// Skips type-less walks, and a property a type derived from the one reached declares: an item template chosen per item type
    /// binds what only its own variant has.
    /// </remarks>
    private void WarnOnUnresolvableControllerPath(IVisualComponent component, string propertyName, CompiledPath path)
    {
        if (_controllerType is null || path.Source.Kind != CompiledUIBindingSourceKind.Controller)
            return;

        _ = TryResolveControllerPathType(path.Template.Template, out var missingProperty, out Type? owner);

        if (missingProperty is null || owner is null || IsDeclaredByDerivedType(owner, missingProperty))
            return;

        _warnings.Add(
            $"Component '{component.Id}' binds '{propertyName}' to '{path.Template.Template}', but " +
            $"'{owner.Name}' has no public property '{missingProperty}'. The binding resolves to nothing and the " +
            "component keeps the value it was authored with.");
    }

    private bool IsDeclaredByDerivedType(Type owner, string property)
    {
        if (owner.IsSealed || owner.IsValueType)
            return false;

        foreach (Type candidate in CandidateDerivedTypes(owner))
        {
            if (candidate != owner && owner.IsAssignableFrom(candidate) && candidate.GetProperty(property, BindingFlags.Public | BindingFlags.Instance) is not null)
                return true;
        }

        return false;
    }

    /// <summary>The types a derived item type can come from: the item type's own assembly and the controller's.</summary>
    private IEnumerable<Type> CandidateDerivedTypes(Type owner)
    {
        HashSet<Assembly> assemblies = [owner.Assembly];

        if (_controllerType is not null)
            _ = assemblies.Add(_controllerType.Assembly);

        foreach (Assembly assembly in assemblies)
        {
            Type?[] types;

            try
            {
                types = assembly.GetTypes();
            }
            catch (ReflectionTypeLoadException exception)
            {
                types = exception.Types;
            }

            foreach (Type? type in types)
            {
                if (type is not null)
                    yield return type;
            }
        }
    }

    /// <summary>
    /// Walks a binding template against the controller's CLR types, returning what it lands on, or
    /// <see langword="null"/> as soon as a segment cannot be resolved.
    /// </summary>
    private Type? TryResolveControllerPathType(string template)
        => TryResolveControllerPathType(template, out _, out _);

    /// <inheritdoc cref="TryResolveControllerPathType(string)" />
    private Type? TryResolveControllerPathType(string template, out string? missingProperty, out Type? missingPropertyOwner)
    {
        missingProperty = null;
        missingPropertyOwner = null;

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

            // Nothing is known about what an `object` holds, so a property it does not declare is not a missing one.
            if (current == typeof(object))
                return null;

            PropertyInfo? property = FindProperty(current, template[start..index]);

            if (property is null)
            {
                missingProperty = template[start..index];
                missingPropertyOwner = current;
                return null;
            }

            current = property.PropertyType;
        }

        return current;
    }

    /// <summary>A public instance property of the type, looked up through an interface's base interfaces too, which reflection skips.</summary>
    private static PropertyInfo? FindProperty(Type type, string name)
    {
        PropertyInfo? property = type.GetProperty(name, BindingFlags.Public | BindingFlags.Instance);

        if (property is not null || !type.IsInterface)
            return property;

        foreach (Type contract in type.GetInterfaces())
        {
            property = contract.GetProperty(name, BindingFlags.Public | BindingFlags.Instance);

            if (property is not null)
                return property;
        }

        return null;
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
