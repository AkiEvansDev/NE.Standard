using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for text-like input components: the border metadata a field draws around itself. The label
/// surface — icon, title and badge — moved up to <see cref="InputComponentBase{TComponent, TValue}"/>, since
/// every input draws the same header.
/// </summary>
public abstract partial class TextInputComponentBase<TComponent, TValue>(string? id = null) : InputComponentBase<TComponent, TValue>(id), ITextInputComponent
    where TComponent : TextInputComponentBase<TComponent, TValue>, IUIComponentDefinition
{

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IBorderedComponent), DefaultValue = null)]
    public UIThemeColor? BorderColor { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IBorderedComponent), DefaultValue = null)]
    public UIThickness? BorderThickness { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IBorderedComponent), DefaultValue = null)]
    public UICornerRadius? BorderRadius { get; set; }
}
