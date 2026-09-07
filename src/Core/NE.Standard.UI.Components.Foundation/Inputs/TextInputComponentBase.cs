using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for text-like input components: the border metadata a field draws around itself.
/// </summary>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
public abstract partial class TextInputComponentBase<TComponent, TValue>(string? id = null) : InputComponentBase<TComponent, TValue>(id), IBorderedComponent
    where TComponent : TextInputComponentBase<TComponent, TValue>, IUIComponentDefinition
{
}
