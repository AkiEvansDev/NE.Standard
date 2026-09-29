using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A toggle switch input that represents a boolean value.
/// </summary>
public abstract partial class SwitchComponent<T>(string? id = null) : CheckboxComponent<T>(id)
    where T : SwitchComponent<T>, IUIComponentDefinition
{ }

/// <summary>
/// A toggle switch input that represents a boolean value.
/// </summary>
public sealed class SwitchComponent(string? id = null) : SwitchComponent<SwitchComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.switch";
}
