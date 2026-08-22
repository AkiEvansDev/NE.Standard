using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A small status/tag indicator combining an optional icon and short text.
/// </summary>
public abstract partial class BadgeComponent<T> : VisualComponentBase<T>
    where T : BadgeComponent<T>, IUIComponentDefinition
{
    private static readonly UIThemeColor DefaultIconColor = UIThemeColor.FromStyle(UIColorStyle.Default);
    private static readonly UITextAppearance DefaultTextType = UITextAppearance.Overline;

    /// <summary>
    /// Gets or sets the badge's visual style.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIBadgeType.Primary)]
    public UIBadgeType? Style { get; set; }

    /// <summary>
    /// Overrides <see cref="Style"/> with an explicit color when set, e.g. a tag/category swatch.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIThemeColor? Color { get; set; }

    /// <summary>
    /// Gets or sets the icon name to render.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Icon { get; set; }

    /// <summary>
    /// Gets or sets the icon's color.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultIconColor))]
    public UIThemeColor? IconColor { get; set; }

    /// <summary>
    /// Gets or sets the icon's size.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIIconSize.Small)]
    public UIIconSize? IconSize { get; set; }

    /// <summary>
    /// Gets or sets the badge text.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Text { get; set; }

    /// <summary>
    /// Gets or sets the text style used to render <see cref="Text"/>.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultTextType))]
    public UITextAppearance? TextType { get; set; }

    /// <summary>
    /// Gets or sets the tooltip shown on hover.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Tooltip { get; set; }

    /// <summary>
    /// Initializes the badge with a centered alignment.
    /// </summary>
    protected BadgeComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Center;
        VerticalAlignment = UIAlignment.Center;
    }
}

/// <summary>
/// A small status/tag indicator combining an optional icon and short text.
/// </summary>
public sealed class BadgeComponent(string? id = null) : BadgeComponent<BadgeComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.badge";
}
