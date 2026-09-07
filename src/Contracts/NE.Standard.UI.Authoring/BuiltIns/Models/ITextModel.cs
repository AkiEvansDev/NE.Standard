using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Text content: a title, and a description beside or under it, each on one line.
/// </summary>
public interface ITextModel : ITextBaseModel
{
    /// <summary>
    /// The description's role when unset.
    /// </summary>
    static UITextAppearance DefaultDescriptionType { get; } = UITextAppearance.Body;

    /// <summary>
    /// The description's colour when unset — muted, so it reads as secondary to the title.
    /// </summary>
    static UIThemeColor DefaultDescriptionColor { get; } = UIThemeColor.FromStyle(UIColorStyle.Muted);

    /// <summary>
    /// Gets the secondary text.
    /// </summary>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextComponent), DefaultValue = null)]
    string? Description { get; }

    /// <summary>
    /// Gets the secondary text type.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextComponent), DefaultValueMember = nameof(DefaultDescriptionType))]
    UITextAppearance? DescriptionType { get; }

    /// <summary>
    /// Gets the secondary text color.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextComponent), DefaultValueMember = nameof(DefaultDescriptionColor))]
    UIThemeColor? DescriptionColor { get; }

    /// <summary>
    /// Gets how the title and description align within their box — Start, Center, End, or Justify; default Start.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextComponent), DefaultValue = UITextAlignment.Start)]
    UITextAlignment? TextAlignment { get; }
}
