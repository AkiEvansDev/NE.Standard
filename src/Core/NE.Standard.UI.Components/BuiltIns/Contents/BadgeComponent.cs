using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A small status/tag indicator combining an optional icon and short text.
/// </summary>
[UIComponentPropertyDefault(nameof(IVisualComponent.HorizontalAlignment), nameof(DefaultAlignment))]
[UIComponentPropertyDefault(nameof(IVisualComponent.VerticalAlignment), nameof(DefaultAlignment))]
[UIComponentPropertyBlock(typeof(ITooltipComponent))]
public abstract partial class BadgeComponent<T>(string? id = null) : VisualComponentBase<T>(id), ITooltipComponent
    where T : BadgeComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<UIAlignment> DefaultAlignment = UIAlignment.Center;
    private static readonly UIThemeColor DefaultIconColor = UIThemeColor.FromStyle(UIColorStyle.Default);
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Overline;

    /// <summary>
    /// Gets or sets the badge's visual kind — Primary, Accent, Info, Warning, Success, Danger, or Surface; default Primary.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIBadgeVariant.Primary)]
    public UIBadgeVariant? Variant { get; set; }

    /// <summary>
    /// Overrides <see cref="Variant"/> with an explicit color when set, e.g. a tag/category swatch.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIThemeColor? Color { get; set; }

    /// <summary>
    /// Gets or sets how the badge spends its colour; unset, a <see cref="Variant"/> fills and a <see cref="Color"/> tints. A plain badge
    /// ignores it.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIBadgeFill? Fill { get; set; }

    /// <summary>
    /// Gets or sets the icon shown beside the badge's title, by name from the registered icon font/set.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? Icon { get; set; }

    /// <summary>
    /// Gets or sets the icon's colour; unset resolves to <c>color: inherit</c>, so it follows whatever it's drawn in.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultIconColor))]
    public UIThemeColor? IconColor { get; set; }

    /// <summary>
    /// Gets or sets the icon's size; unset the glyph is as tall as the badge's title.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UISize? IconSize { get; set; }

    /// <summary>
    /// Gets or sets the shape an icon that is a picture is drawn in — <see cref="UIShape.Circle"/> for a person's avatar on a
    /// chip; a glyph keeps its own.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIShape? IconShape { get; set; }

    /// <summary>
    /// Gets or sets the glyph a picture icon shows while it has no picture — a round one (<see cref="IconShape"/> Circle) none given
    /// or one that fails, any other one that fails; unset, <c>UIGlyphs.Person</c> on a round one and <c>UIGlyphs.Image</c> on any other.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? IconFallback { get; set; }

    /// <summary>
    /// Gets or sets the short text drawn inside the badge, beside its icon.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public UIPhrase? Title { get; set; }

    /// <summary>
    /// Gets or sets the text style used to render <see cref="Title"/>.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultTitleType))]
    public UITextAppearance? TitleType { get; set; }
}

/// <summary>
/// A small status/tag indicator combining an optional icon and short text.
/// </summary>
public sealed class BadgeComponent(string? id = null) : BadgeComponent<BadgeComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.badge";
}
