using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model describing one menu entry for use in collections bound to <see cref="IMenuItemModel"/>.
/// </summary>
public partial class MenuItem : TextBaseItem, IMenuItemModel
{
    /// <inheritdoc />
    [RecursiveMember]
    public partial UIMenuItemKind? Kind { get; set; } = UIMenuItemKind.Item;

    /// <inheritdoc />
    [RecursiveMember]
    public partial string? Url { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? Selected { get; set; } = false;

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? Expanded { get; set; } = false;

    /// <inheritdoc />
    [RecursiveMember]
    public partial string? Shortcut { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? Checked { get; set; } = false;

    /// <inheritdoc />
    [RecursiveMember]
    public partial string? Value { get; set; }

    /// <summary>
    /// Gets the nested entries. See <see cref="IMenuItemModel.Items"/> on how deep a menu actually renders.
    /// </summary>
    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Items { get; } = [];

    IEnumerable<IMenuItemModel> IMenuItemModel.Items => Items;
}
