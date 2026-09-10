using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// One tab of a tabs view: a text item with a place in the strip. A tab that cannot be closed says so with <see cref="TextBaseItem.CanRemove"/>.
/// </summary>
public partial class TabItem : TextBaseItem, ITabItemModel
{
    /// <inheritdoc />
    [RecursiveMember]
    public partial double? Order { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? Pinned { get; set; }
}
