using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A group of radio buttons that lets the user select a single option from a list.
/// </summary>
/// <remarks>
/// Derives from <see cref="OptionsInputComponentBase{TComponent, TItem}"/> rather than from
/// <c>SelectComponent</c>: it shares the option collection and item template, but a radio group has no
/// trigger to place a <c>Placeholder</c> in and no popup selection to clear, and its renderer draws
/// neither — inheriting them only advertised two properties that did nothing.
/// </remarks>
public abstract partial class RadioGroupComponent<T>(string? id = null) : OptionsInputComponentBase<T, OptionItem>(id)
    where T : RadioGroupComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the layout orientation of the radio buttons.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIOrientation.Vertical)]
    public UIOrientation? Orientation { get; set; }
}

/// <summary>
/// A group of radio buttons that lets the user select a single option from a list.
/// </summary>
public sealed class RadioGroupComponent(string? id = null) : RadioGroupComponent<RadioGroupComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.radio-group";
}
