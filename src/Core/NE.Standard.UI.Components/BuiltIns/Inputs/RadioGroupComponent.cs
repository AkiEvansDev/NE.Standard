using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A group of radio buttons that lets the user select a single option from a list.
/// </summary>
/// <remarks>Unset, <c>Spacing</c> is the stylesheet's own gap for the orientation.</remarks>
[UIComponentPropertyBlock(typeof(ISizedInputComponent))]
[UIComponentPropertyBlock(typeof(IOrientationComponent))]
[UIComponentPropertyBlock(typeof(ISpacingComponent))]
[UIComponentPropertyBlock(typeof(IEmptyStateComponent))]
public abstract partial class RadioGroupComponent<T> : OptionsInputComponentBase<T, OptionItem>, ISizedInputComponent, IOrientationComponent, ISpacingComponent, IEmptyStateComponent
    where T : RadioGroupComponent<T>, IUIComponentDefinition
{
    private readonly DefaultTextTemplate _optionTemplate = new DefaultTextTemplate(binds: true)
        .SetIconAlignment(UITextIconAlignment.Title)
        .SetBadgeAlignment(UITextBadgeAlignment.Title);

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
    /// Configures the built-in default group template, throwing if a different template has been set.
    /// </summary>
    public T ConfigureDefaultGroupTemplate(Action<DefaultGroupTemplate> configure)
        => Self.ConfigureTemplate(GroupTemplate as DefaultGroupTemplate, configure, "template");

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
