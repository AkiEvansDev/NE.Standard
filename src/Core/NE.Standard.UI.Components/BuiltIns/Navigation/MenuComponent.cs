using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// A list of navigation entries, vertical or horizontal, that folds to its icons alone.
/// </summary>
/// <remarks>
/// <c>Surface</c> names the popup's fill — the context menu, split button list, or sub-entry flyout — unset elsewhere. One
/// collection carries entries, captions, rules, checks and selects via <see cref="IMenuItemModel.Kind"/>; checks and selects
/// write back to the bound item, so they need a bound collection, not entries set once.
/// </remarks>
[UIComponentPropertyBlock(typeof(ICollapsibleComponent))]
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
public abstract partial class MenuComponent<T> : ItemsComponentBase<T, IMenuItemModel, IButtonComponent>, ICollapsibleComponent, ISelectionStyleComponent, ISurfaceStyleComponent
    where T : MenuComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<double> DefaultSpacing = 2d;

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
    /// Gets or sets the gap between entries, optionally overridden per breakpoint.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultSpacing))]
    public UIResponsive<double>? Spacing { get; set; }

    /// <summary>
    /// Gets or sets the ground the menu paints, unset by default: a sidebar menu draws no ground, while a popup menu (context
    /// menu, split-button list, flyout) wears the popup's surface colour.
    /// </summary>
    /// <remarks>Declared here rather than through the property block, whose default (<c>Background</c>) would paint every menu.</remarks>
    [UIComponentProperty(Contract = typeof(ISurfaceStyleComponent), DefaultValue = null)]
    public UISurfaceStyle? Surface { get; set; }

    /// <summary>
    /// Gets whether this menu is another entry's sub-entries: it folds and flies out with that entry, and has no sub-entries of its own.
    /// </summary>
    /// <remarks>Render-time only: a nested list is built as its entry's block.</remarks>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = false)]
    public bool? Nested { get; private set; }

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
        _ = SetTemplateVariantCore(SubmenuTemplateKey, MenuComponent.CreateNested().BindItems(nameof(IMenuItemModel.Items), UIBindingScope.Relative));
    }

    /// <summary>
    /// Registers a click command invoked when an entry is clicked.
    /// </summary>
    public T OnItemClick(string command)
    {
        foreach (IButtonComponent template in ClickableTemplates())
            _ = template.OnClick(command);

        _ = Submenu?.OnItemClick(command);

        return Self;
    }

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
        foreach (IButtonComponent template in ClickableTemplates())
            _ = template.OnClick(command, arguments);

        // A sub-entry runs the same command: its own key as the current item, its entry as the parent.
        _ = Submenu?.OnItemClick(command, arguments);

        return Self;
    }

    /// <summary>The nested menu an entry's sub-entries are shown through; null on a nested menu itself.</summary>
    private MenuComponent? Submenu => GetTemplateVariant(SubmenuTemplateKey) as MenuComponent;

    /// <summary>
    /// The entry and check templates; captions and rules take no click, and a select's own click only opens its choices.
    /// </summary>
    private IEnumerable<IButtonComponent> ClickableTemplates()
    {
        yield return Template ?? throw new InvalidOperationException($"'{TypeKey}' has no item template.");

        if (GetTemplateVariant(CheckTemplateKey) is IButtonComponent check)
            yield return check;
    }
}

/// <summary>
/// A list of navigation entries, vertical or horizontal, that can collapse to icons alone.
/// </summary>
public sealed class MenuComponent(string? id = null, bool nested = false) : MenuComponent<MenuComponent>(id, nested), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.menu";

    /// <summary>The menu an entry's sub-entries are shown through.</summary>
    internal static MenuComponent CreateNested()
        => new(nested: true);
}
