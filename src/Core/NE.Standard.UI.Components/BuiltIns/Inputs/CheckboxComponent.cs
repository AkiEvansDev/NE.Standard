using NE.Standard.UI.Abstractions.Styling;
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
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(ITextComponent))]
[UIComponentPropertyDefault(nameof(ITextComponent.TitleType), nameof(DefaultTitleType))]
[UIComponentPropertyDefault(nameof(ITextComponent.DescriptionType), nameof(DefaultDescriptionType))]
[UIComponentPropertyBlock(typeof(ISizedInputComponent))]
[UIComponentPropertyBlock(typeof(ITextMarkAlignmentComponent))]
[UIComponentPropertyDefault(nameof(ITextMarkAlignmentComponent.IconAlignment), nameof(DefaultIconAlignment))]
[UIComponentPropertyDefault(nameof(ITextMarkAlignmentComponent.BadgeAlignment), nameof(DefaultBadgeAlignment))]
public abstract partial class CheckboxComponent<T>(string? id = null) : InputComponentBase<T, bool?>(id), IBorderedComponent, ITextComponent, ISizedInputComponent, ITextMarkAlignmentComponent
    where T : CheckboxComponent<T>, IUIComponentDefinition
{
    // Label in the body role and description a caption, as a radio option's: a field's caption would make the label smaller than its
    // own description (the Small size steps it back down to a caption in the stylesheet). Icon and badge stand on the title's line.
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Body;
    private static readonly UITextAppearance DefaultDescriptionType = UITextAppearance.Caption;
    private const UITextIconAlignment DefaultIconAlignment = UITextIconAlignment.Title;
    private const UITextBadgeAlignment DefaultBadgeAlignment = UITextBadgeAlignment.Title;

    /// <summary>None: its words stand beside its box, not over it.</summary>
    public override UISize? CaptionRowBox(UIResponsiveTier tier) => null;
}

/// <summary>
/// A checkbox input that toggles a boolean value.
/// </summary>
public sealed class CheckboxComponent(string? id = null) : CheckboxComponent<CheckboxComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.checkbox";
}
