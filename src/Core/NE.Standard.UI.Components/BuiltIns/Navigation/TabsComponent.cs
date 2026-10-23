using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// A strip of captions over a set of fixed pages, each page authored from whatever controls it wants.
/// </summary>
/// <remarks>Pages are regions known when the view is written; pages from a collection are <see cref="TabsViewComponent"/>.</remarks>
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
[UIComponentPropertyBlock(typeof(ISelectedKeyComponent))]
public abstract partial class TabsComponent<T>(string? id = null) : RegionContainerComponentBase<T>(id), ISelectionStyleComponent, ISelectedKeyComponent
    where T : TabsComponent<T>, IUIComponentDefinition
{
    // Whose actions a flyout's anchor is refused among.
    private const string ActionsHost = "a strip's";

    private readonly List<string> _keys = [];
    private readonly Dictionary<string, int> _tabActions = new(StringComparer.Ordinal);
    private int _stripActions;

    /// <summary>
    /// Gets the tab keys, in the order their captions appear.
    /// </summary>
    public IReadOnlyList<string> TabKeys => _keys;

    /// <summary>
    /// Gets or sets whether the captions past the strip's room go behind a "…" list; off, the strip wraps them onto the next line.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowOverflow { get; set; }

    /// <summary>
    /// Adds a tab with a plain caption; a string is the author's text, a key with arguments a phrase.
    /// </summary>
    public T AddTab(string key, UIPhrase title, IVisualComponent page)
    {
        ArgumentNullException.ThrowIfNull(title);

        // A tab no one can read the name of is no tab: the caption's words are its one handle.
        if (!UIPhrase.HasWords(title))
            throw new ArgumentException("A tab needs a caption.", nameof(title));

        return AddTab(key, new TabCaptionComponent().SetTitle(title), page);
    }

    /// <summary>
    /// Adds a tab whose caption is configured by the caller.
    /// </summary>
    public T AddTab(string key, TabCaptionComponent caption, IVisualComponent page)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentNullException.ThrowIfNull(caption);
        ArgumentNullException.ThrowIfNull(page);

        if (_keys.Contains(key))
            throw new InvalidOperationException($"Tab '{key}' is already added.");

        _ = caption.SetTabKey(key);

        _keys.Add(key);
        SetRegion(TabRegionNames.Caption(key), caption);
        SetRegion(TabRegionNames.Page(key), page);

        // The first tab added is the one shown, so a view that never sets SelectedKey still renders a page.
        SelectedKey ??= key;

        return Self;
    }

    /// <summary>Adds an action at the strip's end for every tab, after the shown tab's own.</summary>
    public T AddAction(IButtonComponent action)
        => AddStripAction(action);

    /// <summary>Adds a flyout at the strip's end for every tab, opening from its button.</summary>
    public T AddAction(FlyoutComponent action)
    {
        _ = FlyoutComponent.ButtonAnchorOf(action, ActionsHost);

        return AddStripAction(action);
    }

    private T AddStripAction(IVisualComponent action)
    {
        ArgumentNullException.ThrowIfNull(action);

        SetRegion(TabRegionNames.Action(_stripActions++), action);

        return Self;
    }

    /// <summary>Adds an action at the strip's end shown only while the tab <paramref name="key"/> is in front.</summary>
    public T AddTabAction(string key, IButtonComponent action)
        => AddTabActionCore(key, action);

    /// <summary>Adds a flyout at the strip's end shown only while the tab <paramref name="key"/> is in front.</summary>
    public T AddTabAction(string key, FlyoutComponent action)
    {
        _ = FlyoutComponent.ButtonAnchorOf(action, ActionsHost);

        return AddTabActionCore(key, action);
    }

    private T AddTabActionCore(string key, IVisualComponent action)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentNullException.ThrowIfNull(action);

        if (!_keys.Contains(key))
            throw new InvalidOperationException($"Tab '{key}' is not added: add the tab before its actions.");

        var index = _tabActions.GetValueOrDefault(key);

        _tabActions[key] = index + 1;
        SetRegion(TabRegionNames.TabAction(key, index), action);

        return Self;
    }
}

/// <summary>
/// A strip of captions over a set of fixed pages.
/// </summary>
public sealed class TabsComponent(string? id = null) : TabsComponent<TabsComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.tabs";
}

/// <summary>
/// The two region names a tab occupies, and those of the actions at the strip's end.
/// </summary>
public static class TabRegionNames
{
    private const string CaptionPrefix = "tab-caption:";
    private const string PagePrefix = "tab-page:";
    private const string ActionPrefix = "strip-action:";
    private const string TabActionPrefix = "tab-action:";

    /// <summary>The region holding the strip's <paramref name="index"/>th action for every tab.</summary>
    public static string Action(int index)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(index);
        return ActionPrefix + index.ToString(CultureInfo.InvariantCulture);
    }

    /// <summary>The region holding the <paramref name="index"/>th action shown while <paramref name="key"/> is in front.</summary>
    public static string TabAction(string key, int index)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentOutOfRangeException.ThrowIfNegative(index);
        return TabActionPrefix + key + ":" + index.ToString(CultureInfo.InvariantCulture);
    }

    /// <summary>The region holding <paramref name="key"/>'s caption.</summary>
    public static string Caption(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        return CaptionPrefix + key;
    }

    /// <summary>The region holding <paramref name="key"/>'s page.</summary>
    public static string Page(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        return PagePrefix + key;
    }
}
