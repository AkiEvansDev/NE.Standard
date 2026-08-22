using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A text block with optional leading icon, title, description and badge content.
/// </summary>
public abstract partial class TextComponent<T> : VisualComponentBase<T>, ITextComponent
    where T : TextComponent<T>, IUIComponentDefinition
{
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Title;
    private static readonly UIThemeColor DefaultTitleColor = UIThemeColor.FromStyle(UIColorStyle.Default);
    private static readonly UITextAppearance DefaultBadgeTextType = UITextAppearance.Overline;
    private static readonly UIThemeColor DefaultBadgeIconColor = UIThemeColor.FromStyle(UIColorStyle.Default);
    private static readonly UITextAppearance DefaultDescriptionType = UITextAppearance.Body;
    private static readonly UIThemeColor DefaultDescriptionColor = UIThemeColor.FromStyle(UIColorStyle.Muted);

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    public string? Icon { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    public UIThemeColor? IconColor { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UIIconSize.Medium)]
    public UIIconSize? IconSize { get; set; }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    public string? Title { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultTitleType))]
    public UITextAppearance? TitleType { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultTitleColor))]
    public UIThemeColor? TitleColor { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UITextBadgePlacement.Inline)]
    public UITextBadgePlacement? BadgePlacement { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UIBadgeType.Info)]
    public UIBadgeType? BadgeStyle { get; set; }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    public string? BadgeIcon { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultBadgeIconColor))]
    public UIThemeColor? BadgeIconColor { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UIIconSize.Small)]
    public UIIconSize? BadgeIconSize { get; set; }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    public string? BadgeText { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultBadgeTextType))]
    public UITextAppearance? BadgeTextType { get; set; }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    public string? Tooltip { get; set; }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    public string? BadgeTooltip { get; set; }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextComponent), DefaultValue = null)]
    public string? Description { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextComponent), DefaultValueMember = nameof(DefaultDescriptionType))]
    public UITextAppearance? DescriptionType { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextComponent), DefaultValueMember = nameof(DefaultDescriptionColor))]
    public UIThemeColor? DescriptionColor { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextComponent), DefaultValue = UITextAlignment.Start)]
    public UITextAlignment? TextAlignment { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextComponent), DefaultValue = UITextWrapMode.Wrap)]
    public UITextWrapMode? WrapMode { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextComponent), DefaultValue = null, GenerateSetter = false)]
    public int? MaxLines { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextComponent), DefaultValue = true)]
    public bool? Selectable { get; set; }

    /// <summary>
    /// Initializes the text component with a stretched horizontal alignment.
    /// </summary>
    protected TextComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Stretch;
        VerticalAlignment = UIAlignment.Center;
    }

    /// <summary>
    /// Sets the maximum number of lines the text can wrap to before truncating.
    /// </summary>
    public T SetMaxLines(int maxLines)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxLines);

        MaxLines = maxLines;
        return Self;
    }
}

/// <summary>
/// A text block with optional leading icon, title, description and badge content.
/// </summary>
public sealed class TextComponent(string? id = null) : TextComponent<TextComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.text";
}
