using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model describing an item's icon and title, plus visibility/enabled state, for use in lists/collections bound to <see cref="ITextBaseModel"/>.
/// </summary>
/// <remarks>Styling starts at <see langword="null"/>; <see cref="Visibility"/> and <see cref="Enabled"/> keep their defaults, being state rather than style.</remarks>
public partial class TextBaseItem : BadgeItem, ITextBaseModel, IItemAbilitiesModel
{
    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? CanSelect { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? CanDrag { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? CanRemove { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? CanRename { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? CanShowContextMenu { get; set; }

    /// <inheritdoc />
    [Translatable]
    [RecursiveMember]
    public partial string? Icon { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIThemeColor? IconColor { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIIconSize? IconSize { get; set; }

    /// <inheritdoc />
    [Translatable]
    [RecursiveMember]
    public partial string? Title { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UITextAppearance? TitleType { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIThemeColor? TitleColor { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? Selectable { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UITextBadgePlacement? BadgePlacement { get; set; }

    /// <inheritdoc />
    [Translatable]
    [RecursiveMember]
    public partial string? Tooltip { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIPopupPlacement? TooltipPlacement { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIResponsive<UIVisibility>? Visibility { get; set; } = UIVisibility.Visible;

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? Enabled { get; set; } = true;
}
