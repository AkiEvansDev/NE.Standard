using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
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
[UIComponentPropertyBlock(typeof(ISizedInputComponent))]
public abstract partial class RadioGroupComponent<T> : OptionsInputComponentBase<T, OptionItem>, ISizedInputComponent
    where T : RadioGroupComponent<T>, IUIComponentDefinition
{
    private readonly DefaultTextTemplate _optionTemplate = new DefaultTextTemplate(binds: true)
        .SetIconAlignment(UITextIconAlignment.Title)
        .SetBadgeAlignment(UITextBadgeAlignment.Title);

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
        // Title, as a checkbox's: an option's dot stands on its title's line, and its glyph and badge beside it.
        _ = SetTemplate(_optionTemplate);
        _ = SetEmptyTemplate(new DefaultEmptyTemplate());
        _ = SetGroupTemplate(new DefaultGroupTemplate(binds: true));
    }

    /// <summary>
    /// Sets where an option's icon sits against its text: on the title's line (the default) or centred across title and description.
    /// The default option template's; a template of the author's own says its own.
    /// </summary>
    public T SetIconAlignment(UITextIconAlignment alignment)
    {
        _ = _optionTemplate.SetIconAlignment(alignment);
        return Self;
    }

    /// <summary>
    /// Sets where an option's badge sits against its text: at the title line's end (the default) or centred across title and
    /// description. The default option template's; a template of the author's own says its own.
    /// </summary>
    public T SetBadgeAlignment(UITextBadgeAlignment alignment)
    {
        _ = _optionTemplate.SetBadgeAlignment(alignment);
        return Self;
    }
}

/// <summary>
/// A group of radio buttons that lets the user select a single option from a list.
/// </summary>
public sealed class RadioGroupComponent(string? id = null) : RadioGroupComponent<RadioGroupComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.radio-group";
}
