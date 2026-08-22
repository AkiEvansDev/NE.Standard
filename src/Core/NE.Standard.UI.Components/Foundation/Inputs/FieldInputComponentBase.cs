using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for inputs that draw a field surface of their own. It exists to keep <c>Appearance</c> off the
/// controls that have no field to draw — a checkbox and a switch inherit the border metadata for their box
/// but would have nothing to underline.
/// </summary>
public abstract partial class FieldInputComponentBase<TComponent, TValue>(string? id = null) : TextInputComponentBase<TComponent, TValue>(id), IFieldInputComponent
    where TComponent : FieldInputComponentBase<TComponent, TValue>, IUIComponentDefinition
{
    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IFieldInputComponent), DefaultValue = UIInputAppearance.Filled)]
    public UIInputAppearance? Appearance { get; set; }
}
