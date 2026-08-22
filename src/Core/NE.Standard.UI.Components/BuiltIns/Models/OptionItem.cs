using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model describing a selectable option's text, group and selection state for use in lists/collections bound to <see cref="IOptionModel"/>.
/// </summary>
public partial class OptionItem : TextItem, IOptionModel
{
    /// <inheritdoc />
    [RecursiveMember]
    public partial string? Group { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? Selected { get; set; }
}
