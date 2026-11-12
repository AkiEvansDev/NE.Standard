using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;
using System.Text;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Data;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Items;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Serialization;

namespace NE.Standard.UI.Client;

public sealed partial class UIClientPage
{
    private static readonly UIProperty[] NameProperties = [ITextBaseComponent.TitleProperty, IAccessibleNameComponent.AccessibleNameProperty, ITooltipComponent.TooltipProperty];
    private static readonly ConcurrentDictionary<Type, MethodInfo?> CustomResponsiveResolvers = [];

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

        if (rowKeys.Length > 0 && binding is not null)
        {
            var boundDepth = CompiledUIBindingParameterResolver.CountDynamic(binding.Parameters);

            if (boundDepth < rowKeys.Length && _values.TryGetValue(new UIPropertyAddress(new UIComponentAddress(componentId, rowKeys[..boundDepth]), property), out held))
                return held ?? binding.TargetFallbackValue;
        }

        if (binding is null)
            return View.Interactions.TryGetFirstPaintValue(new UIPropertyAddress(componentId, property), out var painted) ? painted : compiled?.Value;

        if (ReadsItem(binding) && TryReadItemValueNoLock(binding, componentId, rowKeys, out var value))
            return CompiledViewWireSerializer.CoerceWireValue(binding.TargetValueType, value) ?? binding.TargetFallbackValue;

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
        IReadOnlyList<UIComponentId> roots = View.Graph.GetItemScopes(componentId);
        List<UIDynamicParameterScope> scopes = [with(roots.Count)];

        for (var i = 0; i < roots.Count && i < rowKeys.Length; i++)
        {
            var key = rowKeys[i] as string ?? Convert.ToString(rowKeys[i], CultureInfo.InvariantCulture) ?? string.Empty;
            UIComponentId host = HostOf(roots[i]);
            var item = TryGetSourceRowNoLock(new UIComponentAddress(host, rowKeys[..i]), key, out UIClientRowEntry? row) ? row.Item : null;

            scopes.Add(new UIDynamicParameterScope(roots[i], key, item));
        }

        return scopes;
    }

    /// <summary>The list a row template belongs to.</summary>
    private UIComponentId HostOf(UIComponentId root)
        => View.Graph.GetRequired(root).ParentId ?? throw new InvalidOperationException($"Row template '{View.Graph.GetRequired(root).AuthoringId}' has no list.");

    /// <summary>Whether a reader sees the component: it, and every ancestor, is not collapsed or hidden, its rows exist, and a dialog it stands in is open.</summary>
    internal bool IsShown(UIComponentId componentId, object?[] rowKeys)
    {
        lock (_sync)
            return IsShownNoLock(componentId, rowKeys);
    }

    private bool IsShownNoLock(UIComponentId componentId, object?[] rowKeys)
    {
        for (UIComponentNode? node = View.Graph.GetRequired(componentId); node is not null; node = node.ParentId is UIComponentId parent ? View.Graph.GetRequired(parent) : null)
        {
            var keys = rowKeys[..Math.Min(rowKeys.Length, View.Graph.GetItemScopes(node.ComponentId).Count)];

            if (ResolveAtTierNoLock<UIVisibility>(ReadNoLock(node.ComponentId, keys, IVisualComponent.VisibilityProperty)) is UIVisibility.Collapsed or UIVisibility.Hidden)
                return false;

            if (DialogKeyOf(node.ComponentId) is { } dialog && !_openDialogs.Contains(dialog))
                return false;
        }

        foreach (UIDynamicParameterScope scope in ScopesNoLock(componentId, rowKeys))
        {
            if (scope.Item is null)
                return false;

            if (scope.Item is IMenuItemModel entry && ResolveAtTierNoLock<UIVisibility>(entry.Visibility) is UIVisibility.Collapsed or UIVisibility.Hidden)
                return false;

            if (scope.Item is ITextBaseModel textEntry && ResolveAtTierNoLock<UIVisibility>(textEntry.Visibility) is UIVisibility.Collapsed or UIVisibility.Hidden)
                return false;

            if (scope.Item is IReadOnlyDictionary<string, object?> && ItemContext.TryReadProperty(scope.Item, nameof(IMenuItemModel.Visibility), out var visibility) && ResolveAtTierNoLock<UIVisibility>(visibility) is UIVisibility.Collapsed or UIVisibility.Hidden)
                return false;
        }

        return true;
    }

    /// <summary>A plain or responsive value resolved at the page's current <see cref="ResponsiveTier"/>.</summary>
    private T? ResolveAtTierNoLock<T>(object? value) where T : struct
    {
        if (value is T plain)
            return plain;

        if (value is UIResponsive<T> responsive)
            return responsive.Resolve(_responsiveTier);

        if (value is IReadOnlyDictionary<string, object?> && CompiledViewWireSerializer.CoerceWireValue(typeof(UIResponsive<T>), value) is UIResponsive<T> coercedResponsive)
            return coercedResponsive.Resolve(_responsiveTier);

        return value is not null && RecursiveValueCoercion.TryCoerce(value, out T coercedPlain) ? coercedPlain : null;
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

    /// <summary>Whether a reader can act on the component: neither it nor an ancestor is disabled or loading.</summary>
    internal bool IsEnabled(UIComponentId componentId, object?[] rowKeys)
    {
        lock (_sync)
            return IsEnabledNoLock(componentId, rowKeys);
    }

    private bool IsEnabledNoLock(UIComponentId componentId, object?[] rowKeys)
    {
        for (UIComponentNode? node = View.Graph.GetRequired(componentId); node is not null; node = node.ParentId is UIComponentId parent ? View.Graph.GetRequired(parent) : null)
        {
            var keys = rowKeys[..Math.Min(rowKeys.Length, View.Graph.GetItemScopes(node.ComponentId).Count)];

            if (ResolveAtTierNoLock<bool>(ReadNoLock(node.ComponentId, keys, IVisualComponent.EnabledProperty)) is false)
                return false;

            if (ResolveAtTierNoLock<bool>(ReadNoLock(node.ComponentId, keys, IVisualComponent.LoadingProperty)) is true)
                return false;
        }

        foreach (UIDynamicParameterScope scope in ScopesNoLock(componentId, rowKeys))
        {
            if (scope.Item is IMenuItemModel entry && (ResolveAtTierNoLock<bool>(entry.Enabled) is false || entry.Kind is UIMenuItemKind.Header or UIMenuItemKind.Separator))
                return false;

            if (scope.Item is ITextBaseModel textEntry && ResolveAtTierNoLock<bool>(textEntry.Enabled) is false)
                return false;

            if (scope.Item is IReadOnlyDictionary<string, object?>
                && ((ItemContext.TryReadProperty(scope.Item, nameof(IMenuItemModel.Enabled), out var enabled) && ResolveAtTierNoLock<bool>(enabled) is false)
                    || (ItemContext.TryReadProperty(scope.Item, nameof(IMenuItemModel.Kind), out var kind) && ResolveAtTierNoLock<UIMenuItemKind>(kind) is UIMenuItemKind.Header or UIMenuItemKind.Separator)))
            {
                return false;
            }
        }

        return true;
    }

    /// <summary>Resolves a <see cref="UIResponsive{T}"/> value at the page's current <see cref="ResponsiveTier"/> when <typeparamref name="T"/> matches the inner value type.</summary>
    internal bool TryResolveResponsive<T>(object raw, out T? resolved)
    {
        UIResponsiveTier tier = ResponsiveTier;
        var unwrapped = raw switch
        {
            UIResponsive<bool> value => value.Resolve(tier),
            UIResponsive<int> value => value.Resolve(tier),
            UIResponsive<double> value => value.Resolve(tier),
            UIResponsive<UIVisibility> value => value.Resolve(tier),
            UIResponsive<UIOrientation> value => value.Resolve(tier),
            UIResponsive<UISize> value => value.Resolve(tier),
            UIResponsive<UIAlignment> value => value.Resolve(tier),
            UIResponsive<UIThickness> value => value.Resolve(tier),
            UIResponsive<UICornerRadius> value => value.Resolve(tier),
            UIResponsive<UILayoutLength> value => value.Resolve(tier),
            UIResponsive<UIGridPlacement> value => value.Resolve(tier),
            UIResponsive<UIGridUnit> value => value.Resolve(tier),
            UIResponsive<UIItemsLayoutType> value => value.Resolve(tier),
            UIResponsive<UIMenuDisplay> value => value.Resolve(tier),
            _ => TryResolveCustomResponsive(raw, tier)
        };

        if (unwrapped is T typed)
        {
            resolved = typed;
            return true;
        }

        resolved = default;
        return false;
    }

    private static object? TryResolveCustomResponsive(object raw, UIResponsiveTier tier)
    {
        Type type = raw.GetType();

        if (!type.IsValueType || !type.IsGenericType || type.GetGenericTypeDefinition() != typeof(UIResponsive<>))
            return null;

        MethodInfo? method = CustomResponsiveResolvers.GetOrAdd(type, static responsiveType => responsiveType.GetMethod(nameof(UIResponsive<>.Resolve), [typeof(UIResponsiveTier)]));
        return method?.Invoke(raw, [tier]);
    }

    /// <summary>The sub-entries a menu row shows now; empty where its host opens no submenus.</summary>
    internal IReadOnlyList<UIClientRow> SubmenuRows(UIComponentId hostId, object?[] rowKeys)
        => SubmenuOf(hostId) is UIComponentNode submenu ? RowList(submenu, rowKeys) : [];

    private UIComponentNode? SubmenuOf(UIComponentId hostId)
        => View.Graph.TryGetSlot(hostId, UIComponentSlotKind.TemplateVariant, out UIComponentSlot? slot, MenuComponent.SubmenuTemplateKey)
            ? View.Graph.GetRequired(slot.RootComponentId)
            : null;

    /// <summary>The rows a host shows now, wrapped as handles.</summary>
    internal IReadOnlyList<UIClientRow> RowList(UIComponentNode host, object?[] rowKeys)
    {
        IReadOnlyList<UIClientRowEntry> entries = Rows(host.ComponentId, rowKeys);
        UIClientRow[] rows = new UIClientRow[entries.Count];

        for (var i = 0; i < rows.Length; i++)
            rows[i] = new UIClientRow(this, host, rowKeys, entries[i]);

        return rows;
    }

    /// <summary>The rows a host shows now, after client-side filtering and sorting.</summary>
    internal IReadOnlyList<UIClientRowEntry> Rows(UIComponentId hostId, object?[] rowKeys)
    {
        lock (_sync)
            return [.. ReadVisibleRowsNoLock(new UIComponentAddress(hostId, rowKeys))];
    }

    /// <summary>The sub-entry under a menu row with <paramref name="key"/>: a direct child first, else the one deeper sub-entry under it.</summary>
    internal UIClientRow FindSubmenuRow(UIComponentNode host, object?[] rowKeys, string parentKey, string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        var owner = $"Row '{parentKey}' of '{host.AuthoringId}'";

        if (SubmenuOf(host.ComponentId) is not UIComponentNode submenu)
            throw new InvalidOperationException($"{owner} shows no row '{key}'.");

        return FindRow(submenu, rowKeys, owner, key);
    }

    /// <summary>The row of <paramref name="host"/> with <paramref name="key"/>: a direct row first, else the one sub-entry with that key.</summary>
    internal UIClientRow FindRow(UIComponentNode host, object?[] rowKeys, string owner, string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        foreach (UIClientRowEntry entry in Rows(host.ComponentId, rowKeys))
        {
            if (string.Equals(entry.Key, key, StringComparison.Ordinal))
                return new UIClientRow(this, host, rowKeys, entry);
        }

        List<UIClientRow> descendants = [];

        CollectSubmenuRows(host.ComponentId, rowKeys, key, descendants);

        if (descendants.Count == 1)
            return descendants[0];

        if (descendants.Count > 1)
            throw new InvalidOperationException($"{owner} shows {descendants.Count} sub-entries '{key}': reach one through its parent Row(key).");

        throw new InvalidOperationException($"{owner} shows no row '{key}'.");
    }

    private void CollectSubmenuRows(UIComponentId hostId, object?[] hostKeys, string key, List<UIClientRow> matches)
    {
        if (SubmenuOf(hostId) is not UIComponentNode submenu)
            return;

        foreach (UIClientRowEntry parent in Rows(hostId, hostKeys))
        {
            object?[] parentKeys = [.. hostKeys, parent.Key];

            foreach (UIClientRowEntry entry in Rows(submenu.ComponentId, parentKeys))
            {
                if (string.Equals(entry.Key, key, StringComparison.Ordinal))
                    matches.Add(new UIClientRow(this, submenu, parentKeys, entry));
            }

            CollectSubmenuRows(submenu.ComponentId, parentKeys, key, matches);
        }
    }

    /// <summary>
    /// The root a row is drawn with, as the list renders it: the variant its item's key property names, the fallback, a composite's
    /// <c>row</c>, else the template.
    /// </summary>
    internal UIComponentId RowTemplate(UIComponentId hostId, object?[] hostKeys, object? item)
    {
        lock (_sync)
            return RowTemplateNoLock(hostId, hostKeys, item);
    }

    private UIComponentId RowTemplateNoLock(UIComponentId hostId, object?[] hostKeys, object? item)
    {
        var keyProperty = ReadNoLock(hostId, hostKeys, ITemplatedComponent.TemplateKeyPropertyProperty) as string;
        var fallbackKey = ReadNoLock(hostId, hostKeys, ITemplatedComponent.FallbackTemplateKeyProperty) as string;
        UIComponentSlot? slot = null;

        if (ItemTemplateSelection.ResolveVariant(View.Graph, hostId, keyProperty, fallbackKey, item) is { } variant)
            _ = View.Graph.TryGetSlot(hostId, UIComponentSlotKind.TemplateVariant, out slot, variant);

        if (slot is null)
            _ = View.Graph.TryGetSlot(hostId, UIComponentSlotKind.TemplateVariant, out slot, TemplateNames.Row);

        if (slot is null && !View.Graph.TryGetSlot(hostId, UIComponentSlotKind.Template, out slot))
            throw new InvalidOperationException($"'{View.Graph.GetRequired(hostId).AuthoringId}' draws its rows with no template of its own.");

        return slot.RootComponentId;
    }

    /// <summary>
    /// Where a row's components are looked for: the host for a composite, whose cells stand in templates beside its <c>row</c>, else the
    /// root the row is drawn with.
    /// </summary>
    internal UIComponentId RowScope(UIComponentId hostId, object?[] hostKeys, object? item)
    {
        lock (_sync)
            return RowScopeNoLock(hostId, hostKeys, item);
    }

    internal UIComponentId RowScopeNoLock(UIComponentId hostId, object?[] hostKeys, object? item)
        => View.Graph.TryGetSlot(hostId, UIComponentSlotKind.TemplateVariant, out _, TemplateNames.Row) ? hostId : RowTemplateNoLock(hostId, hostKeys, item);

    /// <summary>Resolves a named composite template variant slot on <paramref name="hostId"/> for a row holding <paramref name="item"/>.</summary>
    internal UIClientComponent? RowCompositeSlot(UIComponentId hostId, object?[] rowKeys, object? item, string variantKey, string? variantKeyPropertyName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(variantKey);

        var resolvedKey = ItemTemplateSelection.ResolveCompositeVariant(View.Graph, hostId, variantKey, variantKeyPropertyName, item);
        return View.Graph.TryGetSlot(hostId, UIComponentSlotKind.TemplateVariant, out UIComponentSlot? slot, resolvedKey)
            ? At(slot.RootComponentId, rowKeys)
            : null;
    }

    /// <summary>Whether the property is bound to write back what the reader changes.</summary>
    internal bool WritesBack(UIComponentId componentId, UIProperty property)
        => BindingOf(componentId, property) is { Mode: UIBindingMode.TwoWay or UIBindingMode.OneWayToSource or UIBindingMode.OnSubmit };

    /// <summary>The property and value choosing an option row writes back on <paramref name="host"/>, or null where it writes none.</summary>
    internal (UIProperty Property, object Value)? ChoiceWrite(UIComponentNode host, object?[] hostKeys, string key)
    {
        if (View.State.TryGetValue(host.ComponentId, ISelectableItemsComponent.SelectionModeProperty, out _))
        {
            UISelectionMode mode = Read(host.ComponentId, hostKeys, ISelectableItemsComponent.SelectionModeProperty) is UISelectionMode chosenMode
                ? chosenMode
                : UISelectionMode.None;

            return mode switch
            {
                UISelectionMode.One when WritesBack(host.ComponentId, ISelectedKeyComponent.SelectedKeyProperty) => (ISelectedKeyComponent.SelectedKeyProperty, key),
                UISelectionMode.Many when WritesBack(host.ComponentId, ISelectableItemsComponent.SelectedKeysProperty) => (ISelectableItemsComponent.SelectedKeysProperty, ToggleChosenKey(host.ComponentId, hostKeys, ISelectableItemsComponent.SelectedKeysProperty, key)),
                _ => null
            };
        }

        if (WritesBack(host.ComponentId, ISelectedKeyComponent.SelectedKeyProperty))
            return (ISelectedKeyComponent.SelectedKeyProperty, key);

        if (!View.State.TryGetValue(host.ComponentId, IInputComponent.IsReadOnlyProperty, out _) || !WritesBack(host.ComponentId, IInputComponent.ValueProperty))
            return null;

        if (!View.State.TryGetValue(host.ComponentId, MultiSelectComponent.MaxSelectedProperty, out _))
            return (IInputComponent.ValueProperty, key);

        return (IInputComponent.ValueProperty, ToggleChosenKey(host.ComponentId, hostKeys, IInputComponent.ValueProperty, key));
    }

    private string[] ToggleChosenKey(UIComponentId hostId, object?[] hostKeys, UIProperty property, string key)
    {
        List<string> chosen = [];

        if (Read(hostId, hostKeys, property) is IEnumerable current and not string)
        {
            foreach (var item in current)
            {
                if (item is string { Length: > 0 } existing)
                    chosen.Add(existing);
            }
        }

        if (!chosen.Remove(key))
            chosen.Add(key);

        return [.. chosen];
    }

    /// <summary>Whether the component raises a command on the event.</summary>
    internal bool HasEvent(UIComponentId componentId, string eventName)
        => View.Events.TryGet(new CompiledUIEventAddress(componentId, eventName), out _);

    /// <summary>The component with the authored id, in the rows the caller stands in.</summary>
    internal UIClientComponent Find(string id, UIComponentId? scope, object?[] rowKeys, object? rowItem = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);

        if (!View.Graph.TryGetComponentId(id, out UIComponentId componentId) || (scope is UIComponentId root && !IsWithin(componentId, root, rowKeys, rowItem)))
            throw new InvalidOperationException($"The page at '{Route}' has no component '{id}'{(scope is null ? string.Empty : " there")}.");

        return At(componentId, rowKeys);
    }

    private bool IsWithin(UIComponentId componentId, UIComponentId root, object?[] rowKeys, object? rowItem)
    {
        UIComponentId? directChild = null;

        for (UIComponentId? at = componentId; at is UIComponentId id; at = View.Graph.GetRequired(id).ParentId)
        {
            if (id.Equals(root))
                return directChild is null || IsWornByCompositeRow(root, directChild.Value, rowKeys, rowItem);

            directChild = id;
        }

        return false;
    }

    private bool IsWornByCompositeRow(UIComponentId root, UIComponentId directChild, object?[] rowKeys, object? rowItem)
    {
        if (rowKeys.Length != View.Graph.GetItemScopes(root).Count + 1 || !View.Graph.TryGetSlot(root, UIComponentSlotKind.TemplateVariant, out _, TemplateNames.Row))
            return true;

        foreach (UIComponentSlot slot in View.Graph.GetRequired(root).Slots)
        {
            if (slot.RootComponentId != directChild)
                continue;

            if (slot.Kind is not (UIComponentSlotKind.Template or UIComponentSlotKind.TemplateVariant))
                return false;

            if (slot.KeyProperty is not { Length: > 0 } keyProperty || slot.Key is not { Length: > 0 } slotKey)
                return true;

            var colon = slotKey.IndexOf(':', StringComparison.Ordinal);
            var baseKey = colon < 0 ? slotKey : slotKey[..colon];

            return string.Equals(ItemTemplateSelection.ResolveCompositeVariant(View.Graph, root, baseKey, keyProperty, rowItem), slotKey, StringComparison.Ordinal);
        }

        return false;
    }

    /// <summary>A handle to the component in as many of the caller's rows as it stands in; one deeper in a list is reached through its row.</summary>
    internal UIClientComponent At(UIComponentId componentId, object?[] rowKeys)
    {
        IReadOnlyList<UIComponentId> roots = View.Graph.GetItemScopes(componentId);
        UIComponentNode node = View.Graph.GetRequired(componentId);

        if (roots.Count > rowKeys.Length)
        {
            var host = View.Graph.GetRequired(HostOf(roots[rowKeys.Length])).AuthoringId;

            throw new InvalidOperationException($"'{node.AuthoringId}' stands in the rows of '{host}': reach it through that list's Row(key).");
        }

        return new UIClientComponent(this, node, rowKeys[..roots.Count]);
    }

    /// <summary>The one component bound to the path: a binding of its own on the root, or a row's binding relative to its item.</summary>
    internal UIClientComponent FindBoundTo(string path, UIComponentId? scope, object?[] rowKeys, object? rowItem = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);

        var inRow = rowKeys.Length > 0;
        List<(UIComponentId Component, bool Value)> found = [];

        foreach (CompiledUIBinding binding in View.Bindings.All)
        {
            UIComponentId componentId = binding.Address.Component.Id;

            if ((scope is UIComponentId root && !IsWithin(componentId, root, rowKeys, rowItem)) || View.Graph.GetItemScopes(componentId).Count > rowKeys.Length)
                continue;

            if (inRow && (!ReadsItem(binding) || CompiledUIBindingParameterResolver.CountDynamic(binding.Parameters) != rowKeys.Length))
                continue;

            if (!string.Equals(AuthoredPath(binding, componentId, inRow), path, StringComparison.Ordinal))
                continue;

            found.Add((componentId, binding.Kind == CompiledUIBindingKind.ComponentCollection || binding.Address.Property == IInputComponent.ValueProperty));
        }

        return At(SingleFound(found, path, "bound to"), rowKeys);
    }

    /// <summary>The path the view bound: fixed indices materialized, a row's outer segments dropped, and a windowed source's window suffix stripped.</summary>
    private string AuthoredPath(CompiledUIBinding binding, UIComponentId componentId, bool inRow)
    {
        ReadOnlySpan<RecursivePathTemplatePart> parts = View.Templates.GetRequired(binding.TemplateId).Parsed.Parts;
        CompiledUIBindingParameter[] parameters = binding.Parameters;
        List<CompiledUIBindingParameter> slotParameters = [with(parameters.Length)];

        for (var i = 0; i < parameters.Length; i++)
        {
            if (parameters[i].Kind != CompiledUIBindingParameterKind.Scope)
                slotParameters.Add(parameters[i]);
        }

        var startPart = 0;

        if (inRow)
        {
            var lastDynamicSlot = -1;

            for (var i = 0; i < slotParameters.Count; i++)
            {
                if (slotParameters[i].Kind == CompiledUIBindingParameterKind.Dynamic)
                    lastDynamicSlot = i;
            }

            if (lastDynamicSlot >= 0)
            {
                for (var i = 0; i < parts.Length; i++)
                {
                    if (parts[i].ParameterIndex == lastDynamicSlot)
                    {
                        startPart = i + 1;
                        break;
                    }
                }
            }

            if (startPart >= parts.Length)
                return ".";
        }

        StringBuilder builder = new();

        for (var i = startPart; i < parts.Length; i++)
        {
            RecursivePathTemplatePart part = parts[i];

            if (!part.IsParameter)
            {
                if (builder.Length > 0)
                    _ = builder.Append('.');

                _ = builder.Append(part.Segment.Property);
                continue;
            }

            CompiledUIBindingParameter parameter = slotParameters[part.ParameterIndex];
            _ = builder.Append(parameter.Kind == CompiledUIBindingParameterKind.Fixed && UIRowKeys.IsPathParameter(parameter.Value) ? PathSegment.ForParameter(parameter.Value).ToString() : "[]");
        }

        var formatted = builder.ToString();
        const string windowSuffix = "." + UIItemSourceBase.WindowProperty;

        return binding.Kind == CompiledUIBindingKind.ComponentCollection
            && View.State.TryGetValue(componentId, IItemsHostComponent.HostModeProperty, out CompiledUIPropertyValue? mode)
            && mode.Value is UIItemsHostMode.Windowed
            && formatted.EndsWith(windowSuffix, StringComparison.Ordinal)
            ? formatted[..^windowSuffix.Length]
            : formatted;
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

    /// <summary>The one component a reader knows by the name: its title, accessible name or tooltip, as written or as shown.</summary>
    internal UIClientComponent FindNamed(string name, UIComponentId? scope, object?[] rowKeys, object? rowItem = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        List<(UIComponentId Component, bool Value)> found = [];

        foreach (UIComponentNode node in View.Graph.All)
        {
            if ((scope is UIComponentId root && !IsWithin(node.ComponentId, root, rowKeys, rowItem)) || View.Graph.GetItemScopes(node.ComponentId).Count > rowKeys.Length)
                continue;

            foreach (UIProperty property in NameProperties)
            {
                var value = Read(node.ComponentId, rowKeys[..View.Graph.GetItemScopes(node.ComponentId).Count], property);

                if (value is not null && (string.Equals(value.ToString(), name, StringComparison.Ordinal) || string.Equals(Words(value), name, StringComparison.Ordinal)))
                {
                    found.Add((node.ComponentId, node.TypeKey is not "standard.text" and not "standard.paragraph"));
                    break;
                }
            }
        }

        return At(SingleFound(found, name, "named"), rowKeys);
    }
}
