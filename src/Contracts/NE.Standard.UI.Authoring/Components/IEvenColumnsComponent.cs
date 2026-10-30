using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A component whose children or options may stand in even columns: a wrap panel's children, a radio group's options or those of a
/// multi-select drawn as checkboxes.
/// </summary>
public interface IEvenColumnsComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="ItemMinWidth"/>.
    /// </summary>
    static UIProperty ItemMinWidthProperty { get; } = new(nameof(ItemMinWidth));

    /// <summary>
    /// Gets the narrowest a child may be, in pixels: set, the children stand in even columns as many to a line as fit at that width,
    /// each line's columns shared out equally, so a wrapped one stands under the one above; unset, each takes its content's width.
    /// </summary>
    /// <remarks>
    /// Authoring-only: how a set of controls is laid out is decided once by the view. The columns share out the width the component
    /// is given, so one sized to its content stands in a single column.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    UIResponsive<double>? ItemMinWidth { get; }
}
