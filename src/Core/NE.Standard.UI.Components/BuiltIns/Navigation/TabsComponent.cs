using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// A strip of captions over a set of fixed pages, each page authored from whatever controls it wants.
/// </summary>
/// <remarks>
/// Pages are <em>regions</em>, not a template over a collection: this is the plain variant, where the pages
/// are known when the view is written. The advanced one — pages from a collection, renamed in place,
/// reordered, closable — is a different control, because that difference is the difference between a layout
/// and an items view.
/// <para>
/// Each tab occupies two regions, a caption and a page, keyed from the tab's own key. Order is kept here
/// rather than taken from the region dictionary, which has none.
/// </para>
/// </remarks>
public abstract partial class TabsComponent<T>(string? id = null) : RegionContainerComponentBase<T>(id)
    where T : TabsComponent<T>, IUIComponentDefinition
{
    private readonly List<string> _keys = [];

    /// <summary>
    /// Gets the tab keys, in the order their captions appear.
    /// </summary>
    public IReadOnlyList<string> TabKeys => _keys;

    /// <summary>
    /// Gets or sets the key of the page currently shown. Two-way: the client switches on click and writes the
    /// new key back, so a controller can both read the current tab and drive it.
    /// </summary>
    [UIComponentProperty(
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay,
        DefaultValue = null)]
    public string? SelectedKey { get; set; }

    /// <summary>
    /// Adds a tab with a plain caption.
    /// </summary>
    public T AddTab(string key, string title, IVisualComponent page)
        => AddTab(key, new TabHeaderComponent().ConfigureDefaultContent(content => _ = content.SetTitle(title)), page);

    /// <summary>
    /// Adds a tab whose caption is configured by the caller — an icon, a badge, or a bound <c>Visible</c>.
    /// </summary>
    public T AddTab(string key, TabHeaderComponent header, IVisualComponent page)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentNullException.ThrowIfNull(header);
        ArgumentNullException.ThrowIfNull(page);

        if (_keys.Contains(key))
            throw new InvalidOperationException($"Tab '{key}' is already added.");

        _ = header.SetTabKey(key);

        _keys.Add(key);
        SetRegion(TabRegionNames.Header(key), header);
        SetRegion(TabRegionNames.Page(key), page);

        // The first tab added is the one shown, so a view that never sets SelectedKey still renders a page.
        SelectedKey ??= key;

        return Self;
    }
}

/// <summary>
/// A strip of captions over a set of fixed pages.
/// </summary>
public sealed class TabsComponent(string? id = null) : TabsComponent<TabsComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.tabs";
}

/// <summary>
/// The two region names a tab occupies. A type of its own rather than statics on the generic component,
/// where they would be per-instantiation — which is what CA1000 objects to.
/// </summary>
public static class TabRegionNames
{
    private const string HeaderPrefix = "tab-header:";
    private const string PagePrefix = "tab-page:";

    /// <summary>The region holding <paramref name="key"/>'s caption.</summary>
    public static string Header(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        return HeaderPrefix + key;
    }

    /// <summary>The region holding <paramref name="key"/>'s page.</summary>
    public static string Page(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        return PagePrefix + key;
    }
}
