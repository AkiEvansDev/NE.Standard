using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model describing an item's title and description text for use in lists/collections bound to <see cref="ITextModel"/>.
/// </summary>
public partial class TextItem : TextBaseItem, ITextModel
{
    /// <inheritdoc />
    [Translatable]
    [RecursiveMember]
    public partial string? Description { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UITextAppearance? DescriptionType { get; set; } = UITextAppearance.Caption;

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIThemeColor? DescriptionColor { get; set; } = UIThemeColor.FromStyle(UIColorStyle.OnSurface);

    /// <inheritdoc />
    [RecursiveMember]
    public partial UITextAlignment? TextAlignment { get; set; } = UITextAlignment.Start;

    /// <inheritdoc />
    [RecursiveMember]
    public partial UITextWrapMode? WrapMode { get; set; } = UITextWrapMode.NoWrap;

    /// <inheritdoc />
    [RecursiveMember]
    public partial int? MaxLines { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? Selectable { get; set; } = false;
}
