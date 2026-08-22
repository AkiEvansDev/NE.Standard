using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model describing one tab for use in collections bound to <see cref="ITabItemModel"/>.
/// </summary>
public partial class TabItem : TextBaseItem, ITabItemModel
{
    /// <inheritdoc />
    [RecursiveMember]
    public partial double? Order { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? Closable { get; set; } = true;

    /// <summary>
    /// Initializes a new tab whose icon and title inherit the caption's own colour.
    /// </summary>
    public TabItem()
    {
        IconColor = UIThemeColor.Default;
        TitleColor = UIThemeColor.Default;
    }
}
