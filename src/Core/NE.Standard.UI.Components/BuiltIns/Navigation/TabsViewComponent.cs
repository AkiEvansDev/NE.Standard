using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>A strip of captions over pages that come from a collection — a document-tab control.</summary>
/// <remarks>
/// The strip is sorted on <see cref="ITabItemModel.Order"/>, so the collection's own order never changes for a drag to stick. A
/// right press on a caption opens <see cref="TabMenu"/> — the built-in entries <see cref="TabMenuEntries"/> chose and the
/// application's own — unless the tab template carries a context menu of its own, which then replaces it.
/// </remarks>
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
public abstract partial class TabsViewComponent<T> : ItemsComponentBase<T, ITabItemModel, ITabItemComponent>, ISelectionStyleComponent, IRegionContainerComponent
    where T : TabsViewComponent<T>, IUIComponentDefinition
{
    // UIStrings keys, spelled here because the words are the framework's and the component cannot reach the shell's constants.
    private const string RenameKey = "ui.tab.rename";
    private const string PinKey = "ui.tab.pin";
    private const string UnpinKey = "ui.tab.unpin";
    private const string CloseKey = "ui.tab.close";
    private const string DeleteKey = "ui.tab.delete";

    private readonly Dictionary<string, IVisualComponent> _regions;
    private readonly List<MenuItem> _entries = [];

    /// <summary>
    /// Gets or sets the key of the tab currently shown. Two-way, as on <see cref="TabsComponent"/>.
    /// </summary>
    [UIComponentProperty(
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay,
        DefaultValue = null)]
    public string? SelectedKey { get; set; }

    /// <summary>
    /// Gets or sets whether a double click or F2 renames a caption in place. The tab menu's Rename and a <c>RenameTabEffect</c> are
    /// the application's own asking and open the field either way.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Renamable { get; set; }

    /// <summary>
    /// Gets or sets whether tabs can be reordered by dragging their captions; a tab whose item says <c>CanDrag</c> false stays put,
    /// and the server, which writes the orders, refuses its move.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Draggable { get; set; }

    /// <summary>Gets or sets the built-in entries the tab menu offers, none by default.</summary>
    /// <remarks>
    /// Assigning it directly skips the refusal of Close and Delete together that <see cref="SetTabMenuEntries"/> applies. Pin sets
    /// the tab's <see cref="ITabItemModel.Pinned"/> and moves it to the boundary of the pinned tabs, written back as a drag writes
    /// its order. The remove entry raises what the tab's cross does, so it needs <see cref="OnItemRemove(string, string)"/> and is
    /// never offered on a pinned tab.
    /// </remarks>
    [UIComponentProperty(DefaultValue = UITabMenuEntries.None, GenerateSetter = false)]
    public UITabMenuEntries? TabMenuEntries { get; set; }

    /// <summary>
    /// Gets or sets whether tabs can be closed at all; off, no caption shows a close and the strip reserves no room. A
    /// single tab refuses its close via the item's <c>CanRemove</c>.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? Removable { get; set; }

    /// <summary>
    /// Gets or sets whether the captions past the strip's room go behind a "…" list; off, the strip wraps them onto the next line.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowOverflow { get; set; }

    /// <summary>
    /// Initializes the view with the built-in tab template, sorted by the items' own order.
    /// </summary>
    protected TabsViewComponent(string? id = null) : base(id)
    {
        _ = SetTemplate(new DefaultTabItemTemplate(binds: true));
        _ = SetEmptyTemplate(new DefaultEmptyTemplate());
        _ = SortBy(nameof(ITabItemModel.Order));

        TemplateKeyProperty = null;

        TabMenu = new MenuComponent();
        ComposeTabMenu();

        _regions = new Dictionary<string, IVisualComponent>(StringComparer.Ordinal) { [RegionNames.TabMenu] = TabMenu };
    }

    /// <summary>
    /// Lays the tab menu out afresh. Every built-in entry is in it; the client leaves out what the strip did not choose or the tab
    /// it was opened on does not allow, and a rule left with nothing shown on one side.
    /// </summary>
    private void ComposeTabMenu()
    {
        List<MenuItem> items =
        [
            new MenuItem { Id = UITabMenu.Rename, Title = RenameKey, Icon = UIGlyphs.Edit },
            new MenuItem { Id = UITabMenu.Pin, Title = PinKey, Icon = UIGlyphs.PinOutlined },
            new MenuItem { Id = UITabMenu.Unpin, Title = UnpinKey, Icon = UIGlyphs.PinOff },
            new MenuItem { Id = UITabMenu.Separator, Kind = UIMenuItemKind.Separator }
        ];

        if (_entries.Count > 0)
        {
            items.AddRange(_entries);
            items.Add(new MenuItem { Id = UITabMenu.RemoveSeparator, Kind = UIMenuItemKind.Separator });
        }

        items.Add(new MenuItem { Id = UITabMenu.Close, Title = CloseKey, Icon = UIGlyphs.Close });
        items.Add(new MenuItem { Id = UITabMenu.Delete, Title = DeleteKey, Icon = UIGlyphs.Delete, TitleColor = UIThemeColor.Danger, IconColor = UIThemeColor.Danger });

        _ = TabMenu.SetItems(items);
    }

    /// <summary>Gets the menu a right press on a caption opens.</summary>
    /// <remarks>
    /// Rename and Pin or Unpin, the entries <see cref="AddTabMenuEntries"/> added, then Close or Delete, each group fenced by a rule —
    /// as <see cref="TabMenuEntries"/> chose them and the tab allows.
    /// </remarks>
    public MenuComponent TabMenu { get; }

    /// <inheritdoc/>
    public IReadOnlyDictionary<string, IVisualComponent> Regions => _regions;

    /// <inheritdoc/>
    public bool HasRegions => true;

    /// <summary>
    /// Sets the built-in entries the tab menu offers, refusing Close and Delete together: they are the two forms of one entry.
    /// </summary>
    public T SetTabMenuEntries(UITabMenuEntries entries)
    {
        if (entries.HasFlag(UITabMenuEntries.Close | UITabMenuEntries.Delete))
            throw new ArgumentException("Close and Delete are the two forms of the tab menu's one remove entry; choose one.", nameof(entries));

        TabMenuEntries = entries;
        return Self;
    }

    /// <summary>Adds entries to the tab menu, between Pin and the remove entry with a rule on either side.</summary>
    /// <remarks>
    /// A click on one raises <see cref="OnTabMenuEntry(string, string, string)"/>'s command with the entry's key and the tab's.
    /// </remarks>
    public T AddTabMenuEntries(params MenuItem[] entries)
    {
        ArgumentNullException.ThrowIfNull(entries);

        foreach (MenuItem entry in entries)
        {
            ArgumentNullException.ThrowIfNull(entry);

            if (entry.Id.StartsWith(UITabMenu.Prefix, StringComparison.Ordinal))
                throw new ArgumentException($"'{entry.Id}' starts with '{UITabMenu.Prefix}', which names the strip's own entries.", nameof(entries));
        }

        if (entries.Length == 0)
            return Self;

        _entries.AddRange(entries);
        ComposeTabMenu();

        return Self;
    }

    /// <summary>
    /// Registers a command invoked when an entry <see cref="AddTabMenuEntries"/> appended is clicked, passing the entry's key and
    /// the key of the tab the menu was opened on.
    /// </summary>
    /// <remarks>The built-in entries never reach it.</remarks>
    public T OnTabMenuEntry(string command, string entryArgumentName = "entry", string tabArgumentName = "id")
        => OnTabMenuEntry(command, UITabMenu.Entry(entryArgumentName), UITabMenu.Tab(tabArgumentName));

    /// <summary>
    /// Registers a command invoked when an appended tab menu entry is clicked, with UI action arguments —
    /// <see cref="UITabMenu.Entry"/> and <see cref="UITabMenu.Tab"/> name its two keys.
    /// </summary>
    public T OnTabMenuEntry(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.TabMenuEntry, command, arguments);

    /// <summary>
    /// Sets the page rendered for every tab, leaving the built-in caption in place.
    /// </summary>
    public T SetPageTemplate(IVisualComponent page)
    {
        ArgumentNullException.ThrowIfNull(page);

        _ = RequiredTemplate.SetPage(page);
        return Self;
    }

    /// <summary>
    /// Registers a command invoked when a tab's close is pressed, passing the tab's key; the controller removes the tab or leaves it.
    /// </summary>
    public T OnItemRemove(string command, string argumentName = "id")
        => OnItemRemove(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked when a tab's close is pressed, with UI action arguments.
    /// </summary>
    public T OnItemRemove(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnItemTemplate(template => _ = template.OnRemove(command, arguments));

    /// <summary>
    /// Registers a command invoked when a caption is renamed in place, passing the tab's key.
    /// </summary>
    /// <remarks>Optional: a two-way caption already writes the new text back; this is for refusing or normalizing it.</remarks>
    public T OnItemRename(string command, string argumentName = "id")
        => OnItemRename(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked when a caption is renamed in place, with UI action arguments.
    /// </summary>
    public T OnItemRename(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnItemTemplate(template => _ = template.OnRename(command, arguments));
}

/// <summary>
/// A strip of captions over pages that come from a collection.
/// </summary>
public sealed class TabsViewComponent(string? id = null) : TabsViewComponent<TabsViewComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.tabs-view";
}
