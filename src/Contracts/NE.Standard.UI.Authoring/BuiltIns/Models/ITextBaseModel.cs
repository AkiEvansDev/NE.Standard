using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents the shared data contract for text-based UI models.
/// </summary>
public interface ITextBaseModel : IBadgeModel, ITooltipModel
{
    /// <summary>
    /// The leading icon's colour when unset: <c>Default</c> resolves to <c>color: inherit</c>, so the glyph
    /// follows the text beside it.
    /// </summary>
    static UIThemeColor DefaultIconColor { get; } = UIThemeColor.FromStyle(UIColorStyle.Default);

    /// <summary>
    /// The title's role when unset.
    /// </summary>
    static UITextAppearance DefaultTitleType { get; } = UITextAppearance.Title;

    /// <summary>
    /// The title's colour when unset.
    /// </summary>
    static UIThemeColor DefaultTitleColor { get; } = UIThemeColor.FromStyle(UIColorStyle.Default);

    /// <summary>
    /// Gets the icon shown before the title, by name from the registered icon font/set.
    /// </summary>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    string? Icon { get; }

    /// <summary>
    /// Gets the leading icon's colour, defaulting to <see cref="DefaultIconColor"/>.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultIconColor))]
    UIThemeColor? IconColor { get; }

    /// <summary>
    /// Gets the leading icon size; left unset the glyph is as tall as the title beside it.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    UIIconSize? IconSize { get; }

    /// <summary>
    /// Gets the label text drawn as the title; nothing renders when it is unset.
    /// </summary>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    string? Title { get; }

    /// <summary>
    /// Gets the primary text type.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultTitleType))]
    UITextAppearance? TitleType { get; }

    /// <summary>
    /// Gets the primary text colour, which also colours the icon and the description unless either is
    /// overridden by <see cref="ITextModel.DescriptionColor"/> or <c>IconColor</c>.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultTitleColor))]
    UIThemeColor? TitleColor { get; }

    /// <summary>
    /// Gets whether the text can be selected with the pointer; content says yes, a control's caption says no.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = true)]
    bool? Selectable { get; }

    /// <summary>
    /// Gets where badge content is placed.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UITextBadgePlacement.Inline)]
    UITextBadgePlacement? BadgePlacement { get; }

    /// <summary>
    /// Gets what the model does with the room it was given, optionally overridden per breakpoint.
    /// </summary>
    UIResponsive<UIVisibility>? Visibility { get; }

    /// <summary>
    /// Gets whether this item is enabled; a default row template binds it to the row's own Enabled, so one item can
    /// disable itself independent of its siblings.
    /// </summary>
    bool? Enabled { get; }
}
