using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A toggle switch input that represents a boolean value.
/// </summary>
/// <remarks>Its words keep one line each, as a checkbox's: a longer explanation is the field's hint (<c>UIForm.Field(toggle, hint)</c>).</remarks>
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
