using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A checkbox input that toggles a boolean value.
/// </summary>
/// <remarks>
/// Its label is a full <see cref="ITextComponent"/>, not an input caption; <c>BadgePlacement</c> has no effect here. Its title and
/// description keep one line each beside the box, cut short past it: a description is a short phrase. Words that explain the
/// choice at length go under the toggle as the field's hint — <c>UIForm.Field(toggle, hint)</c> — which wraps.
/// </remarks>
[UIComponentPropertyBlock(typeof(ITextComponent))]
[UIComponentPropertyBlock(typeof(IAccessibleNameComponent))]
[UIComponentPropertyBlock(typeof(ISizedInputComponent))]
[UIComponentPropertyBlock(typeof(ITextMarkAlignmentComponent))]
public abstract partial class CheckboxComponent<T> : TextInputComponentBase<T, bool?>, ITextComponent, ISizedInputComponent, IAccessibleNameComponent, ITextMarkAlignmentComponent
    where T : CheckboxComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes the checkbox with its label in the body role and its description a caption, as a radio option's: a field's caption
    /// would make the label smaller than its own description (the Small size steps it back down to a caption in the stylesheet). Its
    /// icon and badge stand on the title's line, as a radio option's do, beside the box that also stands there.
    /// </summary>
    protected CheckboxComponent(string? id = null) : base(id)
    {
        TitleType = UITextAppearance.Body;
        DescriptionType = UITextAppearance.Caption;
        IconAlignment = UITextIconAlignment.Title;
        BadgeAlignment = UITextBadgeAlignment.Title;
    }
}

/// <summary>
/// A checkbox input that toggles a boolean value.
/// </summary>
public sealed class CheckboxComponent(string? id = null) : CheckboxComponent<CheckboxComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.checkbox";
}
