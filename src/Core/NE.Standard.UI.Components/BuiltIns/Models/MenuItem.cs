using System.Collections.Generic;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model describing one menu entry for use in collections bound to <see cref="IMenuItemModel"/>.
/// </summary>
/// <remarks>A text item, so an entry carries a description: one muted line under its title, gone while the menu is folded.</remarks>
public partial class MenuItem : TextItem, IMenuItemModel
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
    [JsonConverter(typeof(UIPhraseValueJsonConverter))]
    public partial UIPhrase? Value { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? InActionBar { get; set; } = false;

    /// <summary>
    /// Gets the nested entries. See <see cref="IMenuItemModel.Items"/> on how deep a menu actually renders.
    /// </summary>
    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Items { get; } = [];

    IEnumerable<IMenuItemModel> IMenuItemModel.Items => Items;
}
