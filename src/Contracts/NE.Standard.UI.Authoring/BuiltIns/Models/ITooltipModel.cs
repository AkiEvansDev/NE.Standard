using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents the shared data contract for anything that explains itself on hover.
/// </summary>
public interface ITooltipModel
{
    /// <summary>
    /// Gets the tooltip shown on hover and on focus.
    /// </summary>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITooltipComponent), DefaultValue = null)]
    string? Tooltip { get; }

    /// <summary>
    /// Gets the side the tooltip prefers; flips to the opposite side when there is no room for it there.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITooltipComponent), DefaultValue = UIPopupPlacement.Top)]
    UIPopupPlacement? TooltipPlacement { get; }
}
