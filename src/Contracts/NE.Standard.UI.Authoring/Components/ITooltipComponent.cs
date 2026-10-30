using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.Components;

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

    /// <summary>
    /// Gets the registered property key for <see cref="TooltipPlain"/>.
    /// </summary>
    static UIProperty TooltipPlainProperty { get; } = new(nameof(TooltipPlain));

    /// <summary>
    /// Gets whether the tooltip is shown as written, its asterisks, brackets and braces as characters, rather than read as inline
    /// markup: words the controller holds bound to it — a person's name, a note's status; unset, it is markup.
    /// </summary>
    /// <remarks>Render-time only: the first paint and every value pushed later are shown the same way.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = false)]
    bool? TooltipPlain { get; }
}
