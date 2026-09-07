using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A component that explains itself on hover: the text, and the side it is shown on.
/// </summary>
public interface ITooltipComponent : ITooltipModel, IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="ITooltipModel.Tooltip"/>.
    /// </summary>
    static UIProperty TooltipProperty { get; } = new(nameof(Tooltip));

    /// <summary>
    /// Gets the registered property key for <see cref="ITooltipModel.TooltipPlacement"/>.
    /// </summary>
    static UIProperty TooltipPlacementProperty { get; } = new(nameof(TooltipPlacement));
}
