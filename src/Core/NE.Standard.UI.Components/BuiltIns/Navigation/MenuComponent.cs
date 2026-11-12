using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Components.Foundation.Items;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>A list of navigation entries, vertical or horizontal, that folds to its icons alone or stands as a rail.</summary>
/// <remarks>
/// <c>Surface</c> names the popup's fill — the context menu, split button list, or sub-entry flyout — and a sidebar's or rail's own ground. One
/// collection carries entries, captions, rules, checks and selects via <see cref="IMenuItemModel.Kind"/>; checks and selects
/// write back to the bound item, so they need a bound collection, not entries set once. Folded to its icons, an entry's title is its
/// tooltip unless the entry has a tooltip of its own, and its badge stands on the icon's corner. Unset, <c>Spacing</c> is the
/// stylesheet's: a list's entries stand the list gap apart, so a chosen ground and the pointer's read as two, while a bar's and a
/// rail's stand edge to edge, their grounds square slices with no rounded hover to set apart.
/// </remarks>
[UIComponentPropertyDefault(nameof(IItemsComponent.TemplateKeyProperty), nameof(DefaultTemplateKeyProperty))]
[UIComponentPropertyBlock(typeof(IOrientationComponent))]
[UIComponentPropertyBlock(typeof(ISpacingComponent))]
[UIComponentPropertyBlock(typeof(ICollapsibleComponent))]
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
[UIComponentPropertyBlock(typeof(ISurfaceStyleComponent))]
[UIComponentPropertyDefault(nameof(ISurfaceStyleComponent.Surface), nameof(DefaultSurface))]
[UIComponentPropertyBlock(typeof(IEmptyStateComponent))]
[UIComponentPropertyBlock(typeof(IAccessibleNameComponent))]
public abstract partial class MenuComponent<T> : ItemsComponentBase<T, IMenuItemModel, IButtonComponent>, IOrientationComponent, ISpacingComponent, ICollapsibleComponent, ISelectionStyleComponent, ISurfaceStyleComponent, IRegionContainerComponent, IItemClickComponent, IEmptyStateComponent, IAccessibleNameComponent
    where T : MenuComponent<T>, IUIComponentDefinition
{
    private const string DefaultTemplateKeyProperty = nameof(IMenuItemModel.Kind);

    private readonly Dictionary<string, IVisualComponent> _regions = [with(StringComparer.Ordinal)];
    private int _submenuDepth;
    private bool _readsSubmenus;

    // Unset, rather than the block's Background, which would paint every menu: a sidebar menu draws no ground, while a popup menu
    // (context menu, split-button list, flyout) wears the popup's surface colour; set, it is the sidebar's or rail's own ground too, a
    // step apart from the page's.
    private static UISurfaceStyle? DefaultSurface => null;

    private static readonly UIResponsive<UIMenuDisplay> DefaultDisplay = UIMenuDisplay.List;
    private static readonly UIResponsive<UISize> DefaultSize = UISize.Medium;

    /// <summary>The default number of nested submenu levels compiled for a menu.</summary>
    public const int DefaultSubmenuDepth = 1;

    /// <summary>The maximum number of nested submenu levels a menu compiles.</summary>
    public const int MaxSubmenuDepth = 4;

    /// <summary>The template variant key rendering <see cref="UIMenuItemKind.Header"/> entries.</summary>
    public const string HeaderTemplateKey = nameof(UIMenuItemKind.Header);

    /// <summary>The template variant key rendering <see cref="UIMenuItemKind.Separator"/> entries.</summary>
    public const string SeparatorTemplateKey = nameof(UIMenuItemKind.Separator);

    /// <summary>The template variant key rendering <see cref="UIMenuItemKind.Check"/> entries.</summary>
    public const string CheckTemplateKey = nameof(UIMenuItemKind.Check);

    /// <summary>The template variant key rendering <see cref="UIMenuItemKind.Select"/> entries.</summary>
    public const string SelectTemplateKey = nameof(UIMenuItemKind.Select);

    /// <summary>
    /// The template slot holding an entry's sub-entries: a nested menu bound to <see cref="IMenuItemModel.Items"/>,
    /// so a sub-entry is a compiled row the runtime updates like any other.
    /// </summary>
    public const string SubmenuTemplateKey = "Submenu";

    /// <summary>
    /// Gets or sets how the entries are laid out, per breakpoint: rows of icon and title, or a rail of icons each over a one-line label.
    /// </summary>
    /// <remarks>
    /// Render-time only. One menu may be a rail on one width and a list on another (<c>SetDisplay(UIMenuDisplay.Rail, xl:
    /// UIMenuDisplay.List)</c>): the browser draws the shape of the width it stands at. Where a view's left side is a drawer, the base
    /// tier alone says whether a menu there is the phone's bottom bar or a rail drawn as a list; a <c>sm</c> tier never does. A rail
    /// has nothing to fold, so it ignores <c>Expanded</c> and draws no collapse toggle; the fold is kept for the widths it is a list
    /// on. An entry's label cut short shows whole as its tooltip unless the entry has one of its own; a badge stands on the icon's
    /// corner, an empty <c>BadgeTitle</c> as a dot; the current entry wears its icon filled. The rail's ground is <see cref="Surface"/>'s.
    /// A rail takes no search (<see cref="SetSearch"/>): its groups fly out, so a match among their entries would not show; a search
    /// typed on a list is let go of where it turns into a rail. A rail that is the whole of a view's left side is the page's bottom
    /// navigation bar on a phone rather than a drawer (<see cref="UIMenuDisplay.Rail"/> says when): its entries share the width down to
    /// a press's width each (<see cref="Size"/> says which) and then scroll sideways, the current one marked on its top edge, over the
    /// bar's hairline — or, where the view turns <c>UIViewOptions.RailBottomBar</c> off, it is that side's drawer drawn as a list. A
    /// rail's entries stand edge to edge, as square slices of it.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, DefaultValueMember = nameof(DefaultDisplay))]
    public UIResponsive<UIMenuDisplay>? Display { get; set; }

    /// <summary>
    /// Gets or sets whether a sidebar menu that is a side's drawer offers to pin it: a pin at the end of its top row, after the switch
    /// and the search, which keeps the side in its column from the extra-large breakpoint up until it is pressed again.
    /// </summary>
    /// <remarks>
    /// Render-time only, and a list's alone: a rail is no drawer's head. Shown only where pinning means something — from the extra-large
    /// breakpoint up, where the side is a drawer (<c>UIViewOptions.SideDrawers</c>) or pinned. The pin is kept in the browser under the
    /// first authored id in the side (the menu's, where nothing around it has one); a side with no menu is pinned by a button of the page's own (<c>ButtonComponent.PinsDrawer</c>).
    /// </remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = false)]
    public bool? DrawerPin { get; set; }

    /// <summary>
    /// Gets or sets how much room a rail takes — its column, its glyphs and labels — and the bottom bar it becomes on a phone, optionally
    /// per breakpoint.
    /// </summary>
    /// <remarks>
    /// Render-time only, and a rail's alone (<see cref="UIMenuDisplay.Rail"/>): a list menu's rows keep their size. Large is a 72 px
    /// column of 24 px glyphs over caption-size labels; Medium, the default, 60 px of 20 px glyphs over overline-size labels; Small
    /// 48 px of 20 px glyphs alone, each label kept as the entry's name and shown as its tooltip. On the bar an entry is squeezed no
    /// narrower than 64, 56 or 48 px.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, DefaultValueMember = nameof(DefaultSize))]
    public UIResponsive<UISize>? Size { get; set; }

    /// <summary>
    /// Gets whether this menu is another entry's sub-entries: it folds and flies out with that entry.
    /// </summary>
    /// <remarks>Render-time only: a nested list is built as its entry's block.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = false)]
    public bool? Nested { get; private set; }

    /// <summary>
    /// Gets whether the menu carries a search beside its switch, which narrows the entries in the browser as it is typed into.
    /// </summary>
    /// <remarks>Render-time only: <see cref="SetSearch"/> puts the field in and turns this on.</remarks>
    [UIComponentProperty(IsBindable = false, GenerateSetter = false, DefaultValue = false)]
    public bool? ShowSearch { get; private set; }

    /// <inheritdoc/>
    public IReadOnlyDictionary<string, IVisualComponent> Regions => _regions;

    /// <inheritdoc/>
    public bool HasRegions => _regions.Count > 0;

    /// <summary>
    /// Gets what the menu carries beside its switch.
    /// </summary>
    public IVisualComponent? ToggleContent => _regions.GetValueOrDefault(RegionNames.ToggleContent);

    /// <summary>
    /// Puts content beside the menu's switch, in one row with it — a title, a button of the menu's own — seen only while the menu is
    /// open. <see cref="SetSearch"/> puts a search there.
    /// </summary>
    public T SetToggleContent(IVisualComponent content)
    {
        ArgumentNullException.ThrowIfNull(content);

        // Content of the author's own is no search: a field inside it must not start narrowing the entries.
        ShowSearch = null;
        _regions[RegionNames.ToggleContent] = content;
        return Self;
    }

    /// <summary>
    /// Puts a search beside the menu's switch, the field <see cref="TextInputComponent{T}.SetSearch"/> makes, Filled and small: what is
    /// typed narrows the entries in the browser by the words they show.
    /// </summary>
    /// <remarks>
    /// A group stays, open, while one of its sub-entries matches, and a caption while an entry under it does. A search that leaves
    /// nothing shows the menu's empty template, as a select's does — the default one's "Nothing to show." unless the author set one.
    /// </remarks>
    public T SetSearch(UIPhrase? placeholder = null)
    {
        _ = SetToggleContent(new TextInputComponent()
            .SetSearch(placeholder)
            // Filled, by the field rule: the menu's band already frames it.
            .SetAppearance(UIInputAppearance.Filled)
            .SetSize(UISize.Small)
        );

        EnsureDefaultEmptyTemplate();

        ShowSearch = true;
        return Self;
    }

    /// <summary>
    /// Puts the built-in empty template in where the menu has none. Never in the constructor: a context menu, a split button's list or
    /// an entry's sub-entries that hold nothing would each say "Nothing to show."
    /// </summary>
    private void EnsureDefaultEmptyTemplate()
    {
        if (!HasEmptyTemplate)
            SetDefaultEmptyTemplate(new DefaultEmptyTemplate());
    }

    /// <summary>
    /// Sets how many levels of nested sub-entries the menu compiles templates for (<see cref="DefaultSubmenuDepth"/> by default, up to
    /// <see cref="MaxSubmenuDepth"/>); entries set through <c>SetItems</c> raise this to their own depth automatically.
    /// </summary>
    public T SetSubmenuDepth(int depth)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(depth);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(depth, MaxSubmenuDepth);

        ConfigureSubmenuDepth(depth);
        return Self;
    }

    private void ConfigureSubmenuDepth(int depth)
    {
        _submenuDepth = depth;

        if (depth == 0)
        {
            RemoveDefaultTemplateVariant(SubmenuTemplateKey);

            if (!IsTemplateVariantAuthored(SelectTemplateKey))
                RemoveDefaultTemplateVariant(SelectTemplateKey);

            return;
        }

        if (!_readsSubmenus)
        {
            _readsSubmenus = true;
            _ = AddItemReads($"{nameof(IMenuItemModel.Items)}.{nameof(IMenuItemModel.Id)}", nameof(IMenuItemModel.Expanded));
        }

        if (GetTemplateVariant(SelectTemplateKey) is null)
            SetDefaultTemplateVariant(SelectTemplateKey, DefaultMenuItemTemplate.ForKind(UIMenuItemKind.Select));

        if (!IsTemplateVariantAuthored(SubmenuTemplateKey))
            SetDefaultTemplateVariant(SubmenuTemplateKey, MenuComponent.CreateNested(depth - 1).BindItems(nameof(IMenuItemModel.Items), UIBindingScope.Relative));
    }

    /// <summary>
    /// Initializes the menu with its default entry template, the caption/rule/check/select variants, and — unless it is itself a leaf
    /// sub-entry menu — the nested menu an entry's sub-entries are shown through.
    /// </summary>
    protected MenuComponent(string? id = null, bool nested = false) : this(id, nested ? 0 : DefaultSubmenuDepth, nested)
    {
    }

    private protected MenuComponent(string? id, int submenuDepth, bool nested) : base(id)
    {
        SetDefaultTemplate(new DefaultMenuItemTemplate(binds: true));
        SetDefaultTemplateVariant(HeaderTemplateKey, DefaultMenuItemTemplate.ForKind(UIMenuItemKind.Header));
        SetDefaultTemplateVariant(SeparatorTemplateKey, DefaultMenuItemTemplate.ForKind(UIMenuItemKind.Separator));
        SetDefaultTemplateVariant(CheckTemplateKey, DefaultMenuItemTemplate.ForKind(UIMenuItemKind.Check));

        if (nested)
            MarkNested();

        ConfigureSubmenuDepth(submenuDepth);
    }

    private protected void MarkNested()
        => Nested = true;

    /// <inheritdoc/>
    protected override void OnItemsChanged()
    {
        var depth = MeasureSubmenuDepth(Items, MaxSubmenuDepth);

        if (depth > _submenuDepth)
            ConfigureSubmenuDepth(depth);
    }

    private static int MeasureSubmenuDepth(IEnumerable<IMenuItemModel>? items, int remainingCap)
    {
        if (remainingCap <= 0 || items is null)
            return 0;

        var deepest = 0;

        foreach (IMenuItemModel item in items)
        {
            if (item.Items is null)
                continue;

            var hasChild = false;

            foreach (IMenuItemModel _ in item.Items)
            {
                hasChild = true;
                break;
            }

            if (!hasChild)
                continue;

            var childDepth = 1 + MeasureSubmenuDepth(item.Items, remainingCap - 1);

            if (childDepth > deepest)
            {
                deepest = childDepth;

                if (deepest >= remainingCap)
                    return remainingCap;
            }
        }

        return deepest;
    }

    /// <summary>
    /// Writes a click on the entry and check templates, now and whenever either is set again; captions and rules take no click, and
    /// a select's own click only opens its choices.
    /// </summary>
    public void OnClickableItemTemplates(Action<IVisualComponent> register)
    {
        _ = OnItemTemplate(register);
        _ = OnTemplate<IButtonComponent>(CheckTemplateKey, register);

        // A sub-entry runs the same command: its own key as the current item, its entry as the parent.
        _ = OnTemplate<IVisualComponent>(SubmenuTemplateKey, template =>
        {
            if (template is IItemClickComponent submenu)
                submenu.OnClickableItemTemplates(register);
        });
    }

    /// <inheritdoc/>
    protected override Action? SnapshotAuthoredState()
    {
        Action? restoreBase = base.SnapshotAuthoredState();

        if (!_regions.TryGetValue(RegionNames.ToggleContent, out IVisualComponent? ownToggleContent))
            return restoreBase;

        var ownShowSearch = ShowSearch;

        return () =>
        {
            restoreBase?.Invoke();
            _regions[RegionNames.ToggleContent] = ownToggleContent;
            ShowSearch = ownShowSearch;
        };
    }
}

/// <summary>
/// A list of navigation entries, vertical or horizontal, that can collapse to icons alone.
/// </summary>
public sealed class MenuComponent : MenuComponent<MenuComponent>, IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.menu";

    /// <summary>Initializes a new menu component.</summary>
    public MenuComponent(string? id = null, bool nested = false) : base(id, nested)
    {
    }

    private MenuComponent(string? id, int submenuDepth) : base(id, submenuDepth, nested: true)
    {
    }

    /// <summary>The menu an entry's sub-entries are shown through.</summary>
    internal static MenuComponent CreateNested(int submenuDepth = 0)
        => new(id: null, submenuDepth: submenuDepth);
}
