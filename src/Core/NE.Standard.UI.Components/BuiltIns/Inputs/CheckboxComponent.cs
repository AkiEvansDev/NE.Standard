using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A checkbox input that toggles a boolean value.
/// </summary>
/// <remarks>Its label is a full <see cref="ITextComponent"/>, not an input caption; <c>BadgePlacement</c> has no effect here.</remarks>
[UIComponentPropertyBlock(typeof(ITextComponent))]
public abstract partial class CheckboxComponent<T>(string? id = null) : TextInputComponentBase<T, bool?>(id), ITextComponent
    where T : CheckboxComponent<T>, IUIComponentDefinition
{ }

/// <summary>
/// A checkbox input that toggles a boolean value.
/// </summary>
public sealed class CheckboxComponent(string? id = null) : CheckboxComponent<CheckboxComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.checkbox";
}
