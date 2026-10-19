using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Data;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Recursive;

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

        Type? collectionType = TryResolveControllerPathType(collectionPath.Template);

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

        Type? sourceType = TryResolveControllerPathType(sourcePath.Template);

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
        StringBuilder builder = new();

        foreach (RecursivePathTemplatePart part in path.Template.Parts)
        {
            if (!part.IsParameter)
            {
                if (builder.Length > 0)
                    _ = builder.Append('.');

                _ = builder.Append(part.Segment.Property);
                continue;
            }

            var value = path.Parameters[part.ParameterIndex].Value;

            _ = builder.Append(UIRowKeys.IsPathParameter(value) ? PathSegment.ForParameter(value).ToString() : "[]");
        }

        return builder.ToString();
    }

    /// <summary>
    /// Warns when a bound path resolves to nothing: a property the controller's types don't have — a typo the component would otherwise
    /// show silently — a step the server cannot read (no <c>[RecursiveMember]</c>, or no <c>RecursiveObservable</c>), or a property no
    /// declared item of the list has. The path is the compiled one, from the controller down, so a relative or parent binding is checked
    /// as well.
    /// </summary>
    /// <remarks>
    /// Skips type-less walks, and a property a type derived from the one reached declares: an item template chosen per item type
    /// binds what only its own variant has. Unresolved — what a test page refuses — only where the walk is certain, as an argument's
    /// path is refused (<see cref="MayGoUndrawn"/>): the type walked is the one every row reads, in a template every row is drawn
    /// with; anywhere else it is advice.
    /// </remarks>
    private void WarnOnUnresolvableControllerPath(IVisualComponent component, string propertyName, CompiledPath path)
    {
        if (FindMissingControllerProperty(path) is (string missingProperty, Type owner))
        {
            _warnings.Add(new(
                BindingWarningKind(component, owner == _controllerType || owner.IsSealed || owner.IsValueType),
                $"Component '{component.Id}' binds '{propertyName}' to '{path.Template.Template}', but " +
                $"'{owner.Name}' has no public property '{missingProperty}'. The binding resolves to nothing and the " +
                "component keeps the value it was authored with."
            ));

            return;
        }

        if (FindUnreadControllerSegment(path) is (string segment, Type reader))
        {
            var why = typeof(RecursiveObservable).IsAssignableFrom(reader) ? "where it is no [RecursiveMember]" : "which is no RecursiveObservable";

            _warnings.Add(new(
                BindingWarningKind(component, exact: true),
                $"Component '{component.Id}' binds '{propertyName}' to '{path.Template.Template}', but the server reads '{segment}' " +
                $"through '{reader.Name}', {why}, so the binding resolves to nothing and the component keeps the value it was authored " +
                "with. Make each step of the path a [RecursiveMember] of a RecursiveObservable."
            ));

            return;
        }

        if (FindMissingStaticItemProperty(path) is (string itemProperty, string host))
        {
            _warnings.Add(new(
                BindingWarningKind(component, exact: true),
                $"Component '{component.Id}' binds '{propertyName}' to '{path.Template.Template}', but no item '{host}' holds has a " +
                $"public property '{itemProperty}'. The binding resolves to nothing and the component keeps the value it was authored with."
            ));
        }
    }

    /// <summary>A binding naming nothing is unresolved where the walk is certain, else advice, as an argument's path is refused or warned of.</summary>
    private UICompileWarningKind BindingWarningKind(IVisualComponent component, bool exact)
        => exact && !MayGoUndrawn(component) ? UICompileWarningKind.UnresolvedBinding : UICompileWarningKind.Advisory;

    /// <summary>
    /// The property a controller path names that the type it reaches lacks, with that type; null where the walk finds every segment
    /// or cannot tell — a type-less walk, or a property a derived type declares (an item template chosen per item type).
    /// </summary>
    private (string Property, Type Owner)? FindMissingControllerProperty(CompiledPath path)
    {
        if (_controllerType is null || path.Source.Kind != CompiledUIBindingSourceKind.Controller)
            return null;

        _ = TryResolveControllerPathType(path.Template, out var missingProperty, out Type? owner);

        return missingProperty is null || owner is null || IsDeclaredByDerivedType(owner, missingProperty) ? null : (missingProperty, owner);
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
    /// The first step of a controller path the server cannot read, with the type it would read it through: a property that is no
    /// <c>[RecursiveMember]</c> of a <see cref="RecursiveObservable"/> — a computed one, a plain one — or one read through a type that is
    /// none, a record or a plain object; null where every step reads.
    /// </summary>
    /// <remarks>
    /// Only the steps before the first row: the server reads those off the controller, a row's off the item the page was sent, whose
    /// every public property travels. An interface or an <c>object</c> may hold an observable, so a walk stops there.
    /// </remarks>
    private (string Segment, Type Reader)? FindUnreadControllerSegment(CompiledPath path)
    {
        // A controller of its own making (an IUIContextController that is no RecursiveObservable) reads its paths its own way.
        if (_controllerType is null || !typeof(RecursiveObservable).IsAssignableFrom(_controllerType) || path.Source.Kind != CompiledUIBindingSourceKind.Controller)
            return null;

        Type? current = _controllerType;

        foreach (RecursivePathTemplatePart part in path.Template.Parts)
        {
            if (part.IsParameter || current is null || current == typeof(object) || current.IsInterface)
                return null;

            PropertyInfo? property = FindProperty(current, part.Segment.Property);

            if (property is null)
                return null;

            if (!IsReadByTheServer(current, property))
                return (part.Segment.Property, current);

            current = property.PropertyType;
        }

        return null;
    }

    /// <summary>Whether the server reads the property off an instance of its owner: a <c>[RecursiveMember]</c>, or an observable collection's <c>Count</c>.</summary>
    private static bool IsReadByTheServer(Type owner, PropertyInfo property)
    {
        if (!typeof(RecursiveObservable).IsAssignableFrom(owner))
            return false;

        return Attribute.IsDefined(property, typeof(RecursiveMemberAttribute), inherit: true)
            || (typeof(IRecursiveCollection).IsAssignableFrom(owner) && string.Equals(property.Name, nameof(IRecursiveCollection.Count), StringComparison.Ordinal));
    }

    /// <summary>
    /// The property a row of a list of declared items binds that none of those items has, with the list's id; null where one has it, the
    /// walk cannot tell, or the path is no such list's.
    /// </summary>
    private (string Property, string Host)? FindMissingStaticItemProperty(CompiledPath path)
    {
        if (path.Source.Kind != CompiledUIBindingSourceKind.ComponentItems || path.Source.ComponentId is not UIComponentId hostId)
            return null;

        IVisualComponent host = _components[GetAuthoringId(hostId)];

        if (host is not IItemsComponent { HasItems: true } items)
            return null;

        string? missing = null;

        foreach (Type itemType in ItemTypes(items.Items))
        {
            // As an array, so the row's "[]" steps into the item.
            _ = TryResolvePathType(itemType.MakeArrayType(), path.Template, out var missingProperty, out _);

            if (missingProperty is null)
                return null;

            missing = missingProperty;
        }

        return missing is null ? null : (missing, host.Id);
    }

    /// <summary>The distinct types of the declared items: a variant's row binds what its own type has.</summary>
    private static HashSet<Type> ItemTypes(IReadOnlyList<object?> items)
    {
        HashSet<Type> types = [];

        foreach (var item in items)
        {
            if (item is not null)
                _ = types.Add(item.GetType());
        }

        return types;
    }

    /// <summary>
    /// Warns when a component in a row binds a path off the controller — <c>Root</c>, the default — that the row's own item has too:
    /// almost always one meant <c>Relative</c>, showing the controller's one value in every row.
    /// </summary>
    private void WarnOnRootShadowedByRow(IVisualComponent component, string propertyName, UIBinding binding, Dictionary<string, ResolvedComponentContext> componentContexts)
    {
        if (binding.Scope != UIBindingScope.Root || binding.Source.Count == 0 || binding.Source[0].Kind != PathSegmentKind.Property
            || !componentContexts.TryGetValue(component.Id, out ResolvedComponentContext context) || !StandsInARow(context.Path))
        {
            return;
        }

        var first = binding.Source[0].Property;

        if (!RowHas(context.Path, first))
            return;

        _warnings.Add(new(
            UICompileWarningKind.Advisory,
            $"Component '{component.Id}' stands in a row and binds '{propertyName}' to the controller's '{binding.Source}' (Root, the " +
            $"default), while the row's item has '{first}' too, so every row shows the controller's one value; bind it Relative to show each row's."
        ));
    }

    private static bool StandsInARow(CompiledPath path)
    {
        foreach (CompiledUIBindingParameter parameter in path.Parameters)
        {
            if (parameter.Kind == CompiledUIBindingParameterKind.Dynamic)
                return true;
        }

        return false;
    }

    /// <summary>Whether the item a row's context reaches has the property: the controller's item type, or one of a declared list's items.</summary>
    private bool RowHas(CompiledPath context, string property)
    {
        if (context.Source.Kind == CompiledUIBindingSourceKind.Controller)
            return TryResolveControllerPathType(context.Template) is Type item && item != typeof(object) && FindProperty(item, property) is not null;

        if (context.Source.ComponentId is not UIComponentId hostId || _components[GetAuthoringId(hostId)] is not IItemsComponent { HasItems: true } items)
            return false;

        foreach (Type itemType in ItemTypes(items.Items))
        {
            if (TryResolvePathType(itemType.MakeArrayType(), context.Template, out _, out _) is Type reached && FindProperty(reached, property) is not null)
                return true;
        }

        return false;
    }

    /// <summary>
    /// Walks a binding template against the controller's CLR types, returning what it lands on, or
    /// <see langword="null"/> as soon as a segment cannot be resolved.
    /// </summary>
    private Type? TryResolveControllerPathType(RecursivePathTemplate template)
        => TryResolveControllerPathType(template, out _, out _);

    /// <inheritdoc cref="TryResolveControllerPathType(RecursivePathTemplate)" />
    private Type? TryResolveControllerPathType(RecursivePathTemplate template, out string? missingProperty, out Type? missingPropertyOwner)
        => TryResolvePathType(_controllerType, template, out missingProperty, out missingPropertyOwner);

    /// <summary>Walks a binding template from <paramref name="start"/>, as <see cref="TryResolveControllerPathType(RecursivePathTemplate)"/> does from the controller.</summary>
    private static Type? TryResolvePathType(Type? start, RecursivePathTemplate template, out string? missingProperty, out Type? missingPropertyOwner)
    {
        missingProperty = null;
        missingPropertyOwner = null;

        Type? current = start;

        foreach (RecursivePathTemplatePart part in template.Parts)
        {
            if (current is null)
                break;

            if (part.IsParameter)
            {
                // Both a parameter and a fixed index or key render as "[]" — either way the walk steps into the collection's element type.
                current = TryResolveElementType(current);
                continue;
            }

            // Nothing is known about what an `object` holds, so a property it does not declare is not a missing one.
            if (current == typeof(object))
                return null;

            PropertyInfo? property = FindProperty(current, part.Segment.Property);

            if (property is null)
            {
                missingProperty = part.Segment.Property;
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
