using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for inputs that draw a field surface of their own, keeping <c>Appearance</c> off those that do not.
/// </summary>
public abstract partial class FieldInputComponentBase<TComponent, TValue>(string? id = null) : TextInputComponentBase<TComponent, TValue>(id), IFieldInputComponent
    where TComponent : FieldInputComponentBase<TComponent, TValue>, IUIComponentDefinition
{
    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IFieldInputComponent), DefaultValue = UIInputAppearance.Filled)]
    public UIInputAppearance? Appearance { get; set; }
}
