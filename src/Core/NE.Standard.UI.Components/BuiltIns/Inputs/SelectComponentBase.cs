using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A field that opens a list of options: the field's chrome and the list's templates, whatever the value made of the options is.
/// </summary>
/// <remarks><see cref="SelectComponent{T, TItem}"/> holds one key and <see cref="MultiSelectComponent{T, TItem}"/> a list of them.</remarks>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(IAffixedInputComponent))]
[UIComponentPropertyBlock(typeof(IPlaceholderInputComponent))]
[UIComponentPropertyBlock(typeof(IPopupPlacementComponent))]
[UIComponentPropertyBlock(typeof(IClearableInputComponent))]
public abstract partial class SelectComponentBase<T, TItem, TValue> : OptionsInputComponentBase<T, TItem, TValue>, IAffixedInputComponent, IPlaceholderInputComponent, IPopupPlacementComponent, IClearableInputComponent
    where T : SelectComponentBase<T, TItem, TValue>, IUIComponentDefinition
    where TItem : class, IOptionModel
{
    /// <summary>
    /// Gets or sets whether the field draws the mark that says it opens a list.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowChevron { get; set; }

    /// <summary>
    /// Initializes the input with the default item, empty and group templates.
    /// </summary>
    protected SelectComponentBase(string? id = null) : base(id)
    {
        // Content, not Title: an option is a list row, so its glyph stands for both lines.
        _ = SetTemplate(new DefaultTextTemplate(binds: true).SetIconAlignment(UITextIconAlignment.Content));
        _ = SetEmptyTemplate(new DefaultEmptyTemplate());
        _ = SetGroupTemplate(new DefaultGroupTemplate(binds: true));
    }

    /// <summary>
    /// Configures the built-in default group template, throwing if a different template has been set.
    /// </summary>
    public T ConfigureDefaultGroupTemplate(Action<DefaultGroupTemplate> configure)
        => Self.ConfigureTemplate(GroupTemplate as DefaultGroupTemplate, configure, "template");
}
