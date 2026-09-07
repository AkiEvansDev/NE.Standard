using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model describing one step of a trail, for use in collections bound to <see cref="IBreadcrumbItemModel"/>.
/// </summary>
public partial class BreadcrumbItem : TextBaseItem, IBreadcrumbItemModel
{
    /// <inheritdoc />
    [RecursiveMember]
    public partial string? Url { get; set; }
}
