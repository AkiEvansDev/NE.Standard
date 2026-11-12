using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Components.Foundation.Items;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Items;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>A strip of captions over pages that come from a collection — a document-tab control.</summary>
/// <remarks>
/// The strip is sorted on <see cref="ITabItemModel.Order"/>, so the collection's own order never changes for a drag to stick. A
/// right press on a caption opens <see cref="TabMenu"/> — the built-in entries <see cref="TabMenuEntries"/> chose and the
/// application's own — unless the tab template carries a context menu of its own, which then replaces it. A <c>Draggable</c> strip
/// reorders by its captions, the server writing the orders.
/// </remarks>
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
[UIComponentPropertyBlock(typeof(IEmptyStateComponent))]
[UIComponentPropertyBlock(typeof(ISelectedKeyComponent))]
[UIComponentPropertyBlock(typeof(IItemsHostAbilitiesComponent))]
[UIComponentPropertyBlock(typeof(IAccessibleNameComponent))]
public abstract partial class TabsViewComponent<T> : ItemsComponentBase<T, ITabItemModel, ITabItemComponent>, ISelectionStyleComponent, IRegionContainerComponent, IEmptyStateComponent, IPressablePartsComponent, ISelectedKeyComponent, IItemsHostAbilitiesComponent, IItemRemoveComponent, IItemRenameComponent, IAccessibleNameComponent, IConfigurationValidatedComponent
    where T : TabsViewComponent<T>, IUIComponentDefinition
{
    private readonly Dictionary<string, IVisualComponent> _regions;
    private readonly List<MenuItem> _entries = [];

    /// <summary>Gets or sets the built-in entries the tab menu offers, none by default.</summary>
    /// <remarks>
    /// Assigning it directly skips the refusal of Close and Delete together that <see cref="SetTabMenuEntries"/> applies. Pin sets
    /// the tab's <see cref="ITabItemModel.Pinned"/> and moves it to the boundary of the pinned tabs, written back as a drag writes
    /// its order. The remove entry raises what the tab's cross does, so it needs <c>OnItemRemoveWithItemKey</c> and is
    /// never offered on a pinned tab.
    /// </remarks>
    [UIComponentProperty(DefaultValue = UITabMenuEntries.None, GenerateSetter = false)]
    public UITabMenuEntries? TabMenuEntries { get; set; }

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
        SetDefaultTemplate(new DefaultTabItemTemplate(binds: true));
        SetDefaultEmptyTemplate(new DefaultEmptyTemplate());
        AddDefaultSort(nameof(ITabItemModel.Pinned), UIItemsSortDirection.Descending);
        AddDefaultSort(nameof(ITabItemModel.Order));

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
            UIStandardAction.Rename.ToMenuItem(UITabMenu.Rename),
            UIStandardAction.Pin.ToMenuItem(UITabMenu.Pin),
            UIStandardAction.Unpin.ToMenuItem(UITabMenu.Unpin),
            new MenuItem { Id = UITabMenu.Separator, Kind = UIMenuItemKind.Separator }
        ];

        if (_entries.Count > 0)
        {
            items.AddRange(_entries);
            items.Add(new MenuItem { Id = UITabMenu.RemoveSeparator, Kind = UIMenuItemKind.Separator });
        }

        items.Add(UIStandardAction.Close.ToMenuItem(UITabMenu.Close));
        items.Add(UIStandardAction.Delete.ToMenuItem(UITabMenu.Delete));

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
    /// A click on one raises <see cref="OnItemMenuEntry(string, string, string)"/>'s command with the entry's key and the tab's.
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
    public T OnItemMenuEntry(string command, string entryArgumentName = "entry", string tabArgumentName = "id")
        => OnItemMenuEntry(command, UIAction.Offered(UITabMenu.Entry(entryArgumentName)), UIAction.Offered(UITabMenu.Tab(tabArgumentName)));

    /// <summary>
    /// Registers a command invoked when an appended tab menu entry is clicked, with UI action arguments —
    /// <see cref="UITabMenu.Entry"/> and <see cref="UITabMenu.Tab"/> name its two keys.
    /// </summary>
    /// <remarks>Raised on the tab the menu was opened on, as its own events are, so the tab's state and abilities answer for it.</remarks>
    public T OnItemMenuEntry(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnItemTemplate(template => _ = template.On(EventNames.ItemMenuEntry, command, arguments));

    /// <summary>
    /// Registers a command invoked when an appended tab menu entry is clicked, with literal argument values — neither key, for an entry
    /// the command needs no name of.
    /// </summary>
    public T OnItemMenuEntryLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnItemMenuEntry(command, UIActionArgument.Literals(arguments));

    /// <summary>
    /// Sets the page rendered for every tab, leaving the built-in caption in place.
    /// </summary>
    public T SetPageTemplate(IVisualComponent page)
    {
        ArgumentNullException.ThrowIfNull(page);

        _ = RequiredTemplate.SetPage(page);
        MarkTemplateAuthored();
        return Self;
    }

    /// <summary>
    /// Writes a remove registration on the tab template, now and on every one set later: a tab's close pressed, or the tab menu's
    /// remove entry; the controller removes the tab or leaves it.
    /// </summary>
    public void OnRemovableItemTemplates(Action<IVisualComponent> register)
        => _ = OnItemTemplate(template => register(template));

    /// <summary>
    /// Writes a rename registration on the tab template, now and on every one set later: a caption renamed in place.
    /// </summary>
    public void OnRenamableItemTemplates(Action<IVisualComponent> register)
        => _ = OnItemTemplate(template => register(template));

    /// <inheritdoc/>
    public void ValidateConfiguration()
    {
        if (TabMenuEntries is UITabMenuEntries entries && entries.HasFlag(UITabMenuEntries.Close | UITabMenuEntries.Delete))
            throw new ArgumentException("Close and Delete are the two forms of the tab menu's one remove entry; choose one.", nameof(TabMenuEntries));
    }
}

/// <summary>
/// A strip of captions over pages that come from a collection.
/// </summary>
public sealed class TabsViewComponent(string? id = null) : TabsViewComponent<TabsViewComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.tabs-view";
}
