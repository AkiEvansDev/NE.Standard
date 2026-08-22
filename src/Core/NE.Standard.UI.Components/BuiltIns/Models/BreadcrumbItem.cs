using NE.Standard.UI.Abstractions.Styling;
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

    /// <summary>
    /// Initializes a new step whose icon and title inherit the step's own colour.
    /// </summary>
    public BreadcrumbItem()
    {
        // A step is muted while it is a link and plain while it is the current page, so both follow the step
        // rather than the page background TextBaseItem's defaults assume. Same reasoning as MenuItem.
        IconColor = UIThemeColor.Default;
        TitleColor = UIThemeColor.Default;
    }
}
