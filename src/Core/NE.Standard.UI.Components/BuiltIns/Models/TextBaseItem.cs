using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model describing an item's icon and title, plus visibility/enabled state, for use in lists/collections bound to <see cref="ITextBaseModel"/>.
/// </summary>
public partial class TextBaseItem : BadgeItem, ITextBaseModel
{
    /// <inheritdoc />
    [Translatable]
    [RecursiveMember]
    public partial string? Icon { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIThemeColor? IconColor { get; set; } = UIThemeColor.FromStyle(UIColorStyle.Primary);

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIIconSize? IconSize { get; set; } = UIIconSize.Medium;

    /// <inheritdoc />
    [Translatable]
    [RecursiveMember]
    public partial string? Title { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UITextAppearance? TitleType { get; set; } = UITextAppearance.Body;

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIThemeColor? TitleColor { get; set; } = UIThemeColor.FromStyle(UIColorStyle.OnBackground);

    /// <inheritdoc />
    [RecursiveMember]
    public partial UITextBadgePlacement? BadgePlacement { get; set; } = UITextBadgePlacement.Trailing;

    /// <inheritdoc />
    [Translatable]
    [RecursiveMember]
    public partial string? Tooltip { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIResponsive<bool>? Visible { get; set; } = true;

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? Enabled { get; set; } = true;
}
