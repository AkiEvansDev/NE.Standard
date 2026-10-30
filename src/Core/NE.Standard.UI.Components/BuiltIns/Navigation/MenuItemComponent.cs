using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// One entry of a <see cref="MenuComponent"/>: the button's own content plus a destination and a current
/// state.
/// </summary>
/// <remarks>
/// Rendered as an anchor; an entry with a command and no <c>Url</c> is still one, just without an <c>href</c>. An entry may carry an
/// address and a command both (<see cref="IEntryLinkComponent"/>).
/// </remarks>
[UIComponentPropertyDefault(nameof(IVisualComponent.HorizontalAlignment), nameof(DefaultAlignment))]
[UIComponentPropertyDefault(nameof(IVisualComponent.VerticalAlignment), nameof(DefaultAlignment))]
[UIComponentPropertyDefault(nameof(IButtonComponent.Variant), nameof(DefaultVariant))]
[UIComponentPropertyDefault(nameof(ITextComponent.TextAlignment), nameof(DefaultTextAlignment))]
[UIComponentPropertyBlock(typeof(ILinkableComponent))]
public abstract partial class MenuItemComponent<T>(string? id = null) : ButtonComponent<T>(id), IEntryLinkComponent
    where T : MenuItemComponent<T>, IUIComponentDefinition
{
    // Both axes: a vertical menu lays out with flexbox, so the entry's width comes from align-self.
    private static readonly UIResponsive<UIAlignment> DefaultAlignment = UIAlignment.Stretch;
    private const UIButtonVariant DefaultVariant = UIButtonVariant.Ghost;
    private const UITextAlignment DefaultTextAlignment = UITextAlignment.Start;

    /// <summary>
    /// Gets or sets whether this entry renders as an entry, a section caption or a rule.
    /// </summary>
    /// <remarks>Render-time only, not bindable: the menu already picks a template variant from <c>IMenuItemModel.Kind</c>.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = UIMenuItemKind.Item)]
    public UIMenuItemKind? Kind { get; set; }

    /// <summary>
    /// Gets or sets whether this entry is the current one.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Selected { get; set; }

    /// <summary>
    /// Gets or sets whether a <see cref="UIMenuItemKind.Check"/> entry is on.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Checked { get; set; }

    /// <summary>
    /// Gets or sets what a <see cref="UIMenuItemKind.Select"/> entry says at its end.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public UIPhrase? Value { get; set; }

    /// <summary>
    /// Gets or sets whether this entry of a context menu also stands in its owner's action bar, as its icon.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? InActionBar { get; set; }
}

/// <summary>
/// One entry of a <see cref="MenuComponent"/>.
/// </summary>
public sealed class MenuItemComponent(string? id = null) : MenuItemComponent<MenuItemComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.menu.item";
}
