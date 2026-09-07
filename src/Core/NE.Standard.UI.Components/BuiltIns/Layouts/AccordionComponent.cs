using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A column of <see cref="ExpanderComponent"/>s of which at most one is open at a time.
/// </summary>
/// <remarks>No spacing of its own: sections share their edges as one block; separated sections are a stack panel of expanders.</remarks>
[UIComponentPropertyBlock(typeof(IOverflowComponent))]
public abstract partial class AccordionComponent<T>(string? id = null) : ContainerComponentBase<T>(id), IOverflowComponent
    where T : AccordionComponent<T>, IUIComponentDefinition
{ }

/// <summary>
/// A column of <see cref="ExpanderComponent"/>s of which at most one is open at a time.
/// </summary>
public sealed class AccordionComponent(string? id = null) : AccordionComponent<AccordionComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.accordion";
}
