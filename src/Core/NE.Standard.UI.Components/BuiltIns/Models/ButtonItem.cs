using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model describing a button item's text and style for use in lists/collections bound to <see cref="IButtonModel"/>.
/// </summary>
public partial class ButtonItem : TextItem, IButtonModel
{
    /// <inheritdoc />
    [RecursiveMember]
    public partial UIButtonType? Type { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIButtonSize? Size { get; set; }

    /// <summary>
    /// Gets or sets the group this button belongs to; a command bar draws its <c>GroupSeparator</c> where the group changes.
    /// </summary>
    [RecursiveMember]
    public partial string? Group { get; set; }
}
