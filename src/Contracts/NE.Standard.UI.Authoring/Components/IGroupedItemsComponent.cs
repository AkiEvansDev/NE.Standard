namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents an items component that can render grouped items.
/// </summary>
public interface IGroupedItemsComponent : IItemsComponent
{
    /// <summary>
    /// Gets the template used to render a group header or group container.
    /// </summary>
    IVisualComponent? GroupTemplate { get; }

    /// <summary>
    /// Gets whether a group template is defined.
    /// </summary>
    bool HasGroupTemplate { get; }
}
