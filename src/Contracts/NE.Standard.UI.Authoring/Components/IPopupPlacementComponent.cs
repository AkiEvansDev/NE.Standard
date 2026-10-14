using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a component that opens a popup against itself — a flyout's content, a select's list, a split button's menu.
/// </summary>
public interface IPopupPlacementComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="PopupPlacement"/>.
    /// </summary>
    static UIProperty PopupPlacementProperty { get; } = new UIProperty(nameof(PopupPlacement));

    /// <summary>
    /// Gets where the popup opens against its anchor, flipping where there is no room; below from its start unless the component says
    /// otherwise. Read each time the popup opens.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIPopupPlacement.BottomStart)]
    UIPopupPlacement? PopupPlacement { get; }
}
