using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Testing;

public sealed partial class UITestPage
{
    private static readonly UIProperty[] NameProperties = [ITextBaseComponent.TitleProperty, IAccessibleNameComponent.AccessibleNameProperty, ITooltipComponent.TooltipProperty];

    /// <summary>A property's value as the page holds it at a component in the rows <paramref name="rowKeys"/> name.</summary>
    internal object? Read(UIComponentId componentId, object?[] rowKeys, UIProperty property)
    {
        lock (_sync)
            return ReadNoLock(componentId, rowKeys, property);
    }

    /// <summary>
    /// What was sent or written to the address, else what the binding reads off the row's item, else the view's own value; a bound
    /// property holding nothing shows its fallback, as on the page.
    /// </summary>
    private object? ReadNoLock(UIComponentId componentId, object?[] rowKeys, UIProperty property)
    {
        _ = View.State.TryGetValue(componentId, property, out CompiledUIPropertyValue? compiled);
        CompiledUIBinding? binding = BindingOf(componentId, property);

        if (_values.TryGetValue(new UIPropertyAddress(new UIComponentAddress(componentId, rowKeys), property), out var held))
            return held ?? binding?.TargetFallbackValue;

        if (binding is null)
            return compiled?.Value;

        if (ReadsItem(binding) && TryReadItemValueNoLock(binding, componentId, rowKeys, out var value))
            return value ?? binding.TargetFallbackValue;

        return binding.TargetFallbackValue;
    }

    /// <summary>The binding a property takes its value from: its own, or a list's collection binding for its items.</summary>
    private CompiledUIBinding? BindingOf(UIComponentId componentId, UIProperty property)
    {
        if (View.Bindings.TryGetProperty(new UIPropertyAddress(componentId, property), out CompiledUIBinding? binding))
            return binding;

        return property == IItemsComponent.ItemsProperty && View.Bindings.TryGetCollection(componentId, out binding) ? binding : null;
    }

    private bool ReadsItem(CompiledUIBinding binding)
    {
        if (View.Sources.GetRequired(binding.SourceId).Kind == CompiledUIBindingSourceKind.ComponentItems)
            return true;

        foreach (CompiledUIBindingParameter parameter in binding.Parameters)
        {
            if (parameter.Kind == CompiledUIBindingParameterKind.Dynamic)
                return true;
        }

        return false;
    }

    /// <summary>A bound value read off the items in scope, innermost first, as the page reads a row's binding off its item.</summary>
    private bool TryReadItemValueNoLock(CompiledUIBinding binding, UIComponentId componentId, object?[] rowKeys, out object? value)
    {
        value = null;

        List<UIDynamicParameterScope> scopes = ScopesNoLock(componentId, rowKeys);
        CompiledUIBindingTemplate template = View.Templates.GetRequired(binding.TemplateId);

        for (var i = scopes.Count - 1; i >= 0; i--)
        {
            if (new ItemContext(scopes[i].Item).TryResolveBindingTemplate(template, binding.Parameters, scopes, out value))
                return true;
        }

        return false;
    }

    /// <summary>The rows a component stands in, outermost first: each row template's root, the row's key, and the item the row holds.</summary>
    private List<UIDynamicParameterScope> ScopesNoLock(UIComponentId componentId, object?[] rowKeys)
    {
        List<UIComponentId> roots = RowRoots(componentId);
        List<UIDynamicParameterScope> scopes = new(roots.Count);

        for (var i = 0; i < roots.Count && i < rowKeys.Length; i++)
        {
            var key = rowKeys[i] as string ?? Convert.ToString(rowKeys[i], System.Globalization.CultureInfo.InvariantCulture) ?? string.Empty;
            UIComponentId host = HostOf(roots[i]);
            object? item = null;

            foreach (UITestRowEntry row in ReadRowsNoLock(new UIComponentAddress(host, rowKeys[..i])))
            {
                if (string.Equals(row.Key, key, StringComparison.Ordinal))
                {
                    item = row.Item;
                    break;
                }
            }

            scopes.Add(new UIDynamicParameterScope(roots[i], key, item));
        }

        return scopes;
    }

    /// <summary>
    /// The roots of the row templates a component stands in, outermost first, the component itself included: a template's root is
    /// where a row's key begins, so a host's empty template and its own header stand outside its rows.
    /// </summary>
    internal List<UIComponentId> RowRoots(UIComponentId componentId)
    {
        List<UIComponentId> roots = [];

        for (UIComponentNode? node = View.Graph.GetRequired(componentId); node is not null; node = node.ParentId is UIComponentId parent ? View.Graph.GetRequired(parent) : null)
        {
            if (node.DefinesContextParameter)
                roots.Add(node.ComponentId);
        }

        roots.Reverse();

        return roots;
    }

    /// <summary>The list a row template belongs to.</summary>
    private UIComponentId HostOf(UIComponentId root)
        => View.Graph.GetRequired(root).ParentId ?? throw new InvalidOperationException($"Row template '{View.Graph.GetRequired(root).AuthoringId}' has no list.");

    /// <summary>Whether a reader sees the component: it, and every ancestor, is not collapsed or hidden, its rows exist, and a dialog it stands in is open.</summary>
    internal bool IsShown(UIComponentId componentId, object?[] rowKeys)
    {
        lock (_sync)
        {
            for (UIComponentNode? node = View.Graph.GetRequired(componentId); node is not null; node = node.ParentId is UIComponentId parent ? View.Graph.GetRequired(parent) : null)
            {
                var keys = rowKeys[..Math.Min(rowKeys.Length, RowRoots(node.ComponentId).Count)];

                if (Widest<UIVisibility>(ReadNoLock(node.ComponentId, keys, IVisualComponent.VisibilityProperty)) is UIVisibility.Collapsed or UIVisibility.Hidden)
                    return false;

                if (DialogKeyOf(node.ComponentId) is { } dialog && !_openDialogs.Contains(dialog))
                    return false;
            }

            foreach (UIDynamicParameterScope scope in ScopesNoLock(componentId, rowKeys))
            {
                if (scope.Item is null)
                    return false;
            }

            return true;
        }
    }

    private string? DialogKeyOf(UIComponentId componentId)
    {
        foreach (CompiledDialog dialog in View.Dialogs)
        {
            if (dialog.RootComponentId.Equals(componentId))
                return dialog.Key;
        }

        return null;
    }

    /// <summary>A plain or responsive value as the widest screen reads it.</summary>
    private static T? Widest<T>(object? value) where T : struct
        => value switch
        {
            T plain => plain,
            UIResponsive<T> responsive => responsive.Xxl ?? responsive.Xl ?? responsive.Md ?? responsive.Sm ?? responsive.Base,
            _ => null
        };

    /// <summary>Whether a reader can act on the component: neither it nor an ancestor is disabled or loading.</summary>
    internal bool IsEnabled(UIComponentId componentId, object?[] rowKeys)
    {
        lock (_sync)
        {
            for (UIComponentNode? node = View.Graph.GetRequired(componentId); node is not null; node = node.ParentId is UIComponentId parent ? View.Graph.GetRequired(parent) : null)
            {
                var keys = rowKeys[..Math.Min(rowKeys.Length, RowRoots(node.ComponentId).Count)];

                if (Widest<bool>(ReadNoLock(node.ComponentId, keys, IVisualComponent.EnabledProperty)) is false)
                    return false;

                if (Widest<bool>(ReadNoLock(node.ComponentId, keys, IVisualComponent.LoadingProperty)) is true)
                    return false;
            }

            return true;
        }
    }

    /// <summary>The rows a host shows now.</summary>
    internal IReadOnlyList<UITestRowEntry> Rows(UIComponentId hostId, object?[] rowKeys)
    {
        lock (_sync)
            return [.. ReadRowsNoLock(new UIComponentAddress(hostId, rowKeys))];
    }

    /// <summary>The root a row is drawn with, as the list renders it: the variant its item's key property names, the fallback, else the template.</summary>
    internal UIComponentId RowTemplate(UIComponentId hostId, object?[] hostKeys, object? item)
    {
        UIComponentSlot? slot = null;

        if (Read(hostId, hostKeys, ITemplatedComponent.TemplateKeyPropertyProperty) is string { Length: > 0 } keyProperty
            && ItemContext.TryReadProperty(item, keyProperty, out var key)
            && Convert.ToString(key, System.Globalization.CultureInfo.InvariantCulture) is { Length: > 0 } variant)
        {
            _ = View.Graph.TryGetSlot(hostId, UIComponentSlotKind.TemplateVariant, out slot, variant);
        }

        if (slot is null && Read(hostId, hostKeys, ITemplatedComponent.FallbackTemplateKeyProperty) is string { Length: > 0 } fallback)
            _ = View.Graph.TryGetSlot(hostId, UIComponentSlotKind.TemplateVariant, out slot, fallback);

        if (slot is null && !View.Graph.TryGetSlot(hostId, UIComponentSlotKind.Template, out slot))
            throw new InvalidOperationException($"'{View.Graph.GetRequired(hostId).AuthoringId}' draws its rows with no template of its own.");

        return slot.RootComponentId;
    }

    /// <summary>Whether the property is bound to write back what the reader changes.</summary>
    internal bool WritesBack(UIComponentId componentId, UIProperty property)
        => BindingOf(componentId, property) is { Mode: UIBindingMode.TwoWay or UIBindingMode.OneWayToSource };

    /// <summary>Whether the component raises a command on the event.</summary>
    internal bool HasEvent(UIComponentId componentId, string eventName)
        => View.Events.TryGet(new CompiledUIEventAddress(componentId, eventName), out _);

    /// <summary>The component with the authored id, in the rows the caller stands in.</summary>
    internal UITestComponent Find(string id, UIComponentId? scope, object?[] rowKeys)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);

        if (!View.Graph.TryGetComponentId(id, out UIComponentId componentId) || (scope is UIComponentId root && !IsWithin(componentId, root)))
            throw new InvalidOperationException($"The page at '{Route}' has no component '{id}'{(scope is null ? string.Empty : " there")}.");

        return At(componentId, rowKeys);
    }

    /// <summary>A handle to the component in as many of the caller's rows as it stands in; one deeper in a list is reached through its row.</summary>
    internal UITestComponent At(UIComponentId componentId, object?[] rowKeys)
    {
        List<UIComponentId> roots = RowRoots(componentId);
        UIComponentNode node = View.Graph.GetRequired(componentId);

        if (roots.Count > rowKeys.Length)
        {
            var host = View.Graph.GetRequired(HostOf(roots[rowKeys.Length])).AuthoringId;

            throw new InvalidOperationException($"'{node.AuthoringId}' stands in the rows of '{host}': reach it through that list's Row(key).");
        }

        return new UITestComponent(this, node, rowKeys[..roots.Count]);
    }

    private bool IsWithin(UIComponentId componentId, UIComponentId root)
    {
        for (UIComponentId? at = componentId; at is UIComponentId id; at = View.Graph.GetRequired(id).ParentId)
        {
            if (id.Equals(root))
                return true;
        }

        return false;
    }

    /// <summary>The one component bound to the path: a binding of its own on the root, or a row's binding relative to its item.</summary>
    internal UITestComponent FindBoundTo(string path, UIComponentId? scope, object?[] rowKeys)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);

        List<(UIComponentId Component, bool Value)> found = [];

        foreach (CompiledUIBinding binding in View.Bindings.All)
        {
            if (binding.Kind != CompiledUIBindingKind.ComponentProperty || !NamesPath(View.Templates.GetRequired(binding.TemplateId).Template, path))
                continue;

            UIComponentId componentId = binding.Address.Component.Id;

            if ((scope is UIComponentId root && !IsWithin(componentId, root)) || RowRoots(componentId).Count > rowKeys.Length)
                continue;

            found.Add((componentId, binding.Address.Property == IInputComponent.ValueProperty));
        }

        return At(SingleFound(found, path, "bound to"), rowKeys);
    }

    /// <summary>Whether a binding's template names the path: itself, or the part after its last row.</summary>
    private static bool NamesPath(string template, string path)
        => string.Equals(template, path, StringComparison.Ordinal) || template.EndsWith("[]." + path, StringComparison.Ordinal);

    /// <summary>The one component a reader knows by the name: its title, accessible name or tooltip, as written or as shown.</summary>
    internal UITestComponent FindNamed(string name, UIComponentId? scope, object?[] rowKeys)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        List<(UIComponentId Component, bool Value)> found = [];

        foreach (UIComponentNode node in View.Graph.All)
        {
            if ((scope is UIComponentId root && !IsWithin(node.ComponentId, root)) || RowRoots(node.ComponentId).Count > rowKeys.Length)
                continue;

            foreach (UIProperty property in NameProperties)
            {
                var value = Read(node.ComponentId, rowKeys[..RowRoots(node.ComponentId).Count], property);

                if (value is not null && (string.Equals(value.ToString(), name, StringComparison.Ordinal) || string.Equals(Words(value), name, StringComparison.Ordinal)))
                {
                    found.Add((node.ComponentId, false));
                    break;
                }
            }
        }

        return At(SingleFound(found, name, "named"), rowKeys);
    }

    /// <summary>The one candidate, or the one whose value it is; none, or several alike, is the test's mistake to hear about.</summary>
    private UIComponentId SingleFound(List<(UIComponentId Component, bool Value)> found, string what, string how)
    {
        if (found.Count == 1)
            return found[0].Component;

        List<(UIComponentId Component, bool Value)> values = found.FindAll(static candidate => candidate.Value);

        if (values.Count == 1)
            return values[0].Component;

        if (found.Count == 0)
            throw new InvalidOperationException($"The page at '{Route}' has no component {how} '{what}'.");

        List<string> ids = found.ConvertAll(candidate => View.Graph.GetRequired(candidate.Component).AuthoringId);

        throw new InvalidOperationException($"The page at '{Route}' has {found.Count} components {how} '{what}' ({string.Join(", ", ids)}): find one by its id.");
    }
}
