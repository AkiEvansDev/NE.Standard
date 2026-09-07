namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// One tab of a tabs view: a text item with a place in the strip. Whether it can be closed is <c>IItemAbilitiesModel.CanRemove</c>.
/// </summary>
public interface ITabItemModel : ITextBaseModel
{
    /// <summary>
    /// Gets where the tab sits in the strip, ascending; a drag writes the new position back.
    /// </summary>
    double? Order { get; }
}
