using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A checkbox input that toggles a boolean value.
/// </summary>
/// <remarks>
/// <c>BadgePlacement</c> is inherited but has no effect here: a toggle is sized by its own content, so both
/// placements put the badge after the text. Same for <see cref="SwitchComponent"/>.
/// </remarks>
public abstract class CheckboxComponent<T>(string? id = null) : TextInputComponentBase<T, bool?>(id)
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
