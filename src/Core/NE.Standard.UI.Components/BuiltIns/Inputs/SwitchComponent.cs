using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A toggle switch input that represents a boolean value.
/// </summary>
public abstract class SwitchComponent<T>(string? id = null) : CheckboxComponent<T>(id)
    where T : SwitchComponent<T>, IUIComponentDefinition
{ }

/// <summary>
/// A toggle switch input that represents a boolean value.
/// </summary>
public sealed class SwitchComponent(string? id = null) : SwitchComponent<SwitchComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.switch";
}
