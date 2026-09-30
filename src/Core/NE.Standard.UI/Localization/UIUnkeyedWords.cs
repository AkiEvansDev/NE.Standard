using System;
using System.Collections;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Shell.Localization;

namespace NE.Standard.UI.Localization;

/// <summary>
/// Reports a compiled view's static text that is no key under the key prefixes, as <see cref="UIMissingWordKind.Unkeyed"/>: a plain
/// string on a translatable property the instance did not mark content, and one read off an author-declared item that does not say
/// it is content.
/// </summary>
/// <remarks>
/// Bound values are data and stay silent, and so do the items a template reaches through a binding (a tree's children), and all
/// static text under a component marked <c>AsContentTree</c> (a sample, a page of prose). Text without
/// a letter ("—", "404") is no word to translate, nor is an address — a path, a fragment or an absolute URL on a translatable
/// <c>Url</c>, which is translatable so a language can link elsewhere.
/// </remarks>
internal sealed class UIUnkeyedWords
{
    private readonly string[] _keyPrefixes;
    private readonly UIMissingWords _missing;

    public UIUnkeyedWords(IReadOnlyList<string> keyPrefixes, UIMissingWords missing)
    {
        ArgumentNullException.ThrowIfNull(keyPrefixes);
        ArgumentNullException.ThrowIfNull(missing);

        _keyPrefixes = UIKeyPrefixes.Build(keyPrefixes);
        _missing = missing;
    }

    /// <summary>Records every unkeyed static text of <paramref name="view"/>, named by <paramref name="viewType"/> in the log.</summary>
    public void Inspect(CompiledView view, Type viewType)
    {
        ArgumentNullException.ThrowIfNull(view);
        ArgumentNullException.ThrowIfNull(viewType);

        Dictionary<UIComponentId, bool> silenced = [];

        foreach (UIComponentState state in view.State.All)
        {
            if (IsInContentTree(view, state.ComponentId, silenced))
                continue;

            foreach (CompiledUIPropertyValue value in state.All)
            {
                if (value.IsBind)
                    continue;

                if (value.Value is IEnumerable items and not string && value.Property.Equals(IItemsComponent.ItemsProperty))
                    InspectItems(view, viewType, state.ComponentId, items);
                else if (value.IsTranslatable && value.Value is string text)
                    Check(text, view, viewType, state.ComponentId, value.Property.Name);
            }
        }
    }

    /// <summary>Whether the component or one above it is marked <c>AsContentTree</c>; each answer kept, since siblings share their parents'.</summary>
    private static bool IsInContentTree(CompiledView view, UIComponentId componentId, Dictionary<UIComponentId, bool> silenced)
    {
        if (silenced.TryGetValue(componentId, out var known))
            return known;

        var inTree = view.Graph.TryGet(componentId, out UIComponentNode? node)
            && (node.IsContentTree || (node.ParentId is { } parent && IsInContentTree(view, parent, silenced)));

        silenced[componentId] = inTree;

        return inTree;
    }

    /// <summary>Each author-declared item's words, as the item template's translatable bindings read them off it.</summary>
    private void InspectItems(CompiledView view, Type viewType, UIComponentId componentId, IEnumerable items)
    {
        List<(CompiledUIBinding Binding, UIComponentId Row)>? bindings = null;

        foreach (CompiledUIBinding binding in view.Bindings.All)
        {
            if (binding.IsTranslatable && view.Sources.TryGet(binding.SourceId, out CompiledUIBindingSource? source) && source.Kind == CompiledUIBindingSourceKind.ComponentItems && source.ComponentId == componentId && TryReadRow(binding, out UIComponentId row))
                (bindings ??= []).Add((binding, row));
        }

        if (bindings is null)
            return;

        foreach (var item in items)
        {
            if (item is null or IContentItem { IsContent: true })
                continue;

            ItemContext context = new(item);

            foreach ((CompiledUIBinding binding, UIComponentId row) in bindings)
            {
                // The row's template stands for the item, as it does when the page builds the row.
                if (context.TryResolveBindingTemplate(view.Templates.GetRequired(binding.TemplateId), binding.Parameters, [new UIDynamicParameterScope(row, string.Empty, item)], out var value) && value is string text)
                    Check(text, view, viewType, binding.Address.Component.Id, binding.Address.Property.Name);
            }
        }
    }

    /// <summary>The template a binding reads its row's item through — its one dynamic parameter; one reading a nested row has more.</summary>
    private static bool TryReadRow(CompiledUIBinding binding, out UIComponentId row)
    {
        row = default;

        var found = false;

        foreach (CompiledUIBindingParameter parameter in binding.Parameters)
        {
            if (parameter.Kind != CompiledUIBindingParameterKind.Dynamic || parameter.ComponentId is not { } component)
                continue;

            if (found)
                return false;

            row = component;
            found = true;
        }

        return found;
    }

    private void Check(string text, CompiledView view, Type viewType, UIComponentId componentId, string property)
    {
        if (UIKeyPrefixes.IsKey(text, _keyPrefixes) || !HasLetter(text) || IsAddress(text))
            return;

        _missing.RecordUnkeyed(text, DescribePlace(view, viewType, componentId, property));
    }

    private static bool HasLetter(string text)
    {
        foreach (var character in text)
        {
            if (char.IsLetter(character))
                return true;
        }

        return false;
    }

    private static bool IsAddress(string text)
    {
        foreach (var character in text)
        {
            if (char.IsWhiteSpace(character))
                return false;
        }

        return text[0] is '/' or '#' || Uri.TryCreate(text, UriKind.Absolute, out _);
    }

    /// <summary>"SettingsView, TextComponent 'name-label', Title" — the view, the component's type and its authored id when it has one.</summary>
    private static string DescribePlace(CompiledView view, Type viewType, UIComponentId componentId, string property)
    {
        if (!view.Graph.TryGet(componentId, out UIComponentNode? node))
            return string.Concat(viewType.Name, ", ", property);

        return node.HasAuthoredId
            ? $"{viewType.Name}, {node.TypeKey} '{node.AuthoringId}', {property}"
            : $"{viewType.Name}, {node.TypeKey}, {property}";
    }
}
