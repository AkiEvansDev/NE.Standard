using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A group of radio buttons that lets the user select a single option from a list.
/// </summary>
public abstract partial class RadioGroupComponent<T> : OptionsInputComponentBase<T, OptionItem>
    where T : RadioGroupComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the layout orientation of the radio buttons.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIOrientation.Vertical)]
    public UIOrientation? Orientation { get; set; }

    /// <summary>
    /// Gets or sets the gap between options; unset, the stylesheet's own gap for the orientation applies.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIResponsive<double>? Spacing { get; set; }

    /// <summary>
    /// Initializes the input with the default item, empty and group templates.
    /// </summary>
    protected RadioGroupComponent(string? id = null) : base(id)
    {
        // Content, not Title: an option is a list row, so its glyph stands for both lines.
        _ = SetTemplate(new DefaultTextTemplate(binds: true).SetIconAlignment(UITextIconAlignment.Content));
        _ = SetEmptyTemplate(new DefaultEmptyTemplate());
        _ = SetGroupTemplate(new DefaultGroupTemplate(binds: true));
    }
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
