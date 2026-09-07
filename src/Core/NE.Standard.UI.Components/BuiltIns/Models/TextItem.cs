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
    public partial UITextAppearance? DescriptionType { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIThemeColor? DescriptionColor { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UITextAlignment? TextAlignment { get; set; }
}
