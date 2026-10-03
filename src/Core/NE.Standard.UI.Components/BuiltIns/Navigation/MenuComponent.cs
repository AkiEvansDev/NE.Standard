using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>A list of navigation entries, vertical or horizontal, that folds to its icons alone or stands as a rail.</summary>
/// <remarks>
/// <c>Surface</c> names the popup's fill — the context menu, split button list, or sub-entry flyout — and a sidebar's or rail's own ground. One
/// collection carries entries, captions, rules, checks and selects via <see cref="IMenuItemModel.Kind"/>; checks and selects
/// write back to the bound item, so they need a bound collection, not entries set once. Folded to its icons, an entry's title is its
/// tooltip unless the entry has a tooltip of its own, and its badge stands on the icon's corner.
/// </remarks>
[UIComponentPropertyBlock(typeof(ICollapsibleComponent))]
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
public abstract partial class MenuComponent<T> : ItemsComponentBase<T, IMenuItemModel, IButtonComponent>, ICollapsibleComponent, ISelectionStyleComponent, ISurfaceStyleComponent, IRegionContainerComponent
    where T : MenuComponent<T>, IUIComponentDefinition
{
    // UIStrings.MenuSearch: the Shell's key, written out, as the components reference no Shell.
    private const string SearchKey = "ui.menu.search";

    private readonly Dictionary<string, IVisualComponent> _regions = new(StringComparer.Ordinal);

    /// <summary>The template variant key rendering <see cref="UIMenuItemKind.Header"/> entries.</summary>
    public const string HeaderTemplateKey = nameof(UIMenuItemKind.Header);

    /// <summary>The template variant key rendering <see cref="UIMenuItemKind.Separator"/> entries.</summary>
    public const string SeparatorTemplateKey = nameof(UIMenuItemKind.Separator);

    /// <summary>The template variant key rendering <see cref="UIMenuItemKind.Check"/> entries.</summary>
    public const string CheckTemplateKey = nameof(UIMenuItemKind.Check);

    /// <summary>The template variant key rendering <see cref="UIMenuItemKind.Select"/> entries.</summary>
    public const string SelectTemplateKey = nameof(UIMenuItemKind.Select);

    /// <summary>
    /// The template slot holding an entry's sub-entries: a nested menu bound to <see cref="IMenuItemModel.Items"/>, one level deep,
    /// so a sub-entry is a compiled row the runtime updates like any other.
    /// </summary>
    public const string SubmenuTemplateKey = "Submenu";

    /// <summary>
    /// Gets or sets the direction the entries run in.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIOrientation.Vertical)]
    public UIOrientation? Orientation { get; set; }

    /// <summary>
    /// Gets or sets how the entries are laid out: rows of icon and title, or a rail of icons each over a one-line label.
    /// </summary>
    /// <remarks>
    /// Render-time only. A rail has nothing to fold, so it ignores <c>Expanded</c> and draws no collapse toggle. An entry's label
    /// cut short shows whole as its tooltip unless the entry has one of its own; a badge stands on the icon's corner, an empty
    /// <c>BadgeText</c> as a dot; the current entry wears its icon filled. The rail's ground is <see cref="Surface"/>'s. A rail takes no
    /// search (<see cref="SetSearch"/>): its groups fly out, so a match among their entries would not show. A rail that is the whole of
    /// a view's left side is the page's bottom navigation bar on a phone rather than a drawer (<see cref="UIMenuDisplay.Rail"/> says
    /// when): its entries share the width down to a press's width each (<see cref="Size"/> says which) and then scroll sideways, the
    /// current one marked on its top edge, over the bar's hairline. A rail's entries stand edge to edge, as square slices of it.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = UIMenuDisplay.List)]
    public UIMenuDisplay? Display { get; set; }

    /// <summary>
    /// Gets or sets how much room a rail takes — its column, its glyphs and labels — and the bottom bar it becomes on a phone.
    /// </summary>
    /// <remarks>
    /// Render-time only, and a rail's alone (<see cref="UIMenuDisplay.Rail"/>): a list menu's rows keep their size. Large is a 72 px
    /// column of 24 px glyphs over caption-size labels; Medium, the default, 60 px of 20 px glyphs over overline-size labels; Small
    /// 48 px of 20 px glyphs alone, each label kept as the entry's name and shown as its tooltip. On the bar an entry is squeezed no
    /// narrower than 64, 56 or 48 px.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = UIButtonSize.Medium)]
    public UIButtonSize? Size { get; set; }

    /// <summary>
    /// Gets or sets the gap between entries, optionally overridden per breakpoint.
    /// </summary>
    /// <remarks>
    /// Unset, the stylesheet decides: a list's entries stand the list gap apart, so a chosen ground and the pointer's read as two, while a
    /// bar's and a rail's stand edge to edge, their grounds square slices with no rounded hover to set apart.
    /// </remarks>
    [UIComponentProperty]
    public UIResponsive<double>? Spacing { get; set; }

    /// <summary>Gets or sets the ground the menu paints, unset by default.</summary>
    /// <remarks>
    /// Unset, a sidebar menu draws no ground, while a popup menu (context menu, split-button list, flyout) wears the popup's surface
    /// colour; set, it is the sidebar's or rail's own ground too, a step apart from the page's. Declared here rather than through
    /// the property block, whose default (<c>Background</c>) would paint every menu.
    /// </remarks>
    [UIComponentProperty(Contract = typeof(ISurfaceStyleComponent), DefaultValue = null)]
    public UISurfaceStyle? Surface { get; set; }

    /// <summary>
    /// Gets whether this menu is another entry's sub-entries: it folds and flies out with that entry, and has no sub-entries of its own.
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

    /// <summary>Puts a search beside the menu's switch: what is typed narrows the entries in the browser by the words they show.</summary>
    /// <remarks>
    /// A group stays, open, while one of its sub-entries matches, and a caption while an entry under it does. A search that leaves
    /// nothing shows the menu's empty template, as a select's does — the default one's "Nothing to show." unless the author set one.
    /// </remarks>
    public T SetSearch(string? placeholder = null)
    {
        _ = SetToggleContent(new TextInputComponent()
            .SetType(UITextInputType.Search)
            .SetAppearance(UIInputAppearance.Underline)
            .SetSize(UIInputSize.Small)
            .SetPlaceholder(placeholder ?? SearchKey)
            .SetPrefixIcon(UIGlyphs.Search)
            .SetShowClearButton()
        );

        if (!HasEmptyTemplate)
            _ = SetEmptyTemplate(new DefaultEmptyTemplate());

        ShowSearch = true;
        return Self;
    }

    /// <summary>
    /// Initializes the menu with its default entry template, the caption/rule/check/select variants, and — unless it is itself an
    /// entry's sub-entries — the nested menu those sub-entries are shown through.
    /// </summary>
    protected MenuComponent(string? id = null, bool nested = false) : base(id)
    {
        _ = SetTemplate(new DefaultMenuItemTemplate(binds: true));
        _ = AddTemplateVariant(HeaderTemplateKey, new DefaultMenuItemTemplate(binds: true).SetKind(UIMenuItemKind.Header));
        _ = AddTemplateVariant(SeparatorTemplateKey, new DefaultMenuItemTemplate(binds: true).SetKind(UIMenuItemKind.Separator));
        _ = AddTemplateVariant(CheckTemplateKey, new DefaultMenuItemTemplate(binds: true).SetKind(UIMenuItemKind.Check));
        _ = AddTemplateVariant(SelectTemplateKey, new DefaultMenuItemTemplate(binds: true).SetKind(UIMenuItemKind.Select));

        TemplateKeyProperty = nameof(IMenuItemModel.Kind);

        if (nested)
        {
            Nested = true;
            return;
        }

        // One level deep: the nested menu carries no nested menu of its own.
        // The row decorator draws an entry's sub-entries when it has any, and opens it as it arrives when it is expanded.
        _ = AddItemReads($"{nameof(IMenuItemModel.Items)}.{nameof(IMenuItemModel.Id)}", nameof(IMenuItemModel.Expanded));
        _ = SetTemplateVariantCore(SubmenuTemplateKey, MenuComponent.CreateNested().BindItems(nameof(IMenuItemModel.Items), UIBindingScope.Relative));
    }

    /// <summary>
    /// Registers a click command invoked when an entry is clicked.
    /// </summary>
    public T OnItemClick(string command)
    {
        OnClickableTemplates(template => _ = template.OnClick(command));

        _ = Submenu?.OnItemClick(command);

        return Self;
    }

    /// <summary>
    /// Writes a click on the entry and check templates, now and whenever either is set again; captions and rules take no click, and
    /// a select's own click only opens its choices.
    /// </summary>
    private void OnClickableTemplates(Action<IButtonComponent> register)
    {
        _ = OnItemTemplate(register);
        _ = OnTemplate(CheckTemplateKey, register);
    }

    /// <summary>The nested menu an entry's sub-entries are shown through; null on a nested menu itself.</summary>
    private MenuComponent? Submenu => GetTemplateVariant(SubmenuTemplateKey) as MenuComponent;

    /// <summary>
    /// Registers a click command that passes the clicked item as an argument.
    /// </summary>
    public T OnItemClickWithItem(string command, string argumentName = "item")
        => OnItemClick(command, UIAction.ArgCurrentItem(argumentName));

    /// <summary>
    /// Registers an entry click command that passes the clicked entry's key as an argument.
    /// </summary>
    public T OnItemClickWithItemKey(string command, string argumentName = "id")
        => OnItemClick(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a click command with an argument derived from the specified <paramref name="argumentKind"/>.
    /// </summary>
    public T OnItemClickWith(string command, string argumentName, UIActionArgumentKind argumentKind)
        => OnItemClick(command, UIAction.ArgCurrent(argumentKind, argumentName));

    /// <summary>
    /// Registers a click command invoked when an entry is clicked, with UI action arguments.
    /// </summary>
    public T OnItemClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        OnClickableTemplates(template => _ = template.OnClick(command, arguments));

        // A sub-entry runs the same command: its own key as the current item, its entry as the parent.
        _ = Submenu?.OnItemClick(command, arguments);

        return Self;
    }
}

/// <summary>
/// A list of navigation entries, vertical or horizontal, that can collapse to icons alone.
/// </summary>
public sealed class MenuComponent(string? id = null, bool nested = false) : MenuComponent<MenuComponent>(id, nested), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.menu";

    /// <summary>The menu an entry's sub-entries are shown through.</summary>
    internal static MenuComponent CreateNested()
        => new(nested: true);
}
