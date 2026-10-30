using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>An input that holds several options out of a bound list.</summary>
/// <remarks>
/// As <see cref="UIMultiSelectVariant.Chips"/>, the default, the chosen ones stand in the field as chips, each with its own remove
/// button, and the list marks them with a check and stays open while options are toggled; <see cref="Variant"/> draws them as their
/// badges instead, or every option as a checkbox in place of the field. The value is the chosen keys in the order they were chosen,
/// each once. <c>Orientation</c>, <c>Spacing</c> and <c>ItemMinWidth</c> lay out the checkboxes and are read by that variant alone; the field's chrome —
/// appearance, placeholder, affixes, clear, chevron, border, the list's placement — by the other two alone.
/// </remarks>
[UIComponentPropertyBlock(typeof(IOrientationComponent))]
[UIComponentPropertyBlock(typeof(ISpacingComponent))]
[UIComponentPropertyBlock(typeof(IEvenColumnsComponent))]
public abstract partial class MultiSelectComponent<T, TItem> : SelectComponentBase<T, TItem, IReadOnlyList<string>?>, IMultiSelectComponent, IOrientationComponent, ISpacingComponent, IEvenColumnsComponent, IConfigurationValidatedComponent
    where T : MultiSelectComponent<T, TItem>, IUIComponentDefinition
    where TItem : class, IOptionModel
{
    // The option template the component installed for its variant: SetVariant replaces this one alone, never a template of the author's.
    private ITextComponent? _variantTemplate;

    /// <summary>
    /// Initializes the input with the select's default item, empty and group templates; the item template follows the variant.
    /// </summary>
    protected MultiSelectComponent(string? id = null) : base(id)
    {
        _variantTemplate = Template;
    }

    /// <summary>
    /// Gets or sets what the input is drawn as: chips in a field (the default), the options' badges in a field, or a checkbox per option.
    /// </summary>
    /// <remarks>Decided at render: a variant is how the input is built. <see cref="SetVariant"/> gives it its option template too.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = UIMultiSelectVariant.Chips, GenerateSetter = false)]
    public UIMultiSelectVariant? Variant
    {
        get;
        set
        {
            field = value;

            if (value is UIMultiSelectVariant variant && ReferenceEquals(Template, _variantTemplate))
            {
                _variantTemplate = CreateVariantTemplate(variant);
                _ = SetTemplate(_variantTemplate);
            }
        }
    }

    /// <summary>
    /// Gets or sets how many options can be chosen at most; unset, any number. The list refuses one more once the field holds as many,
    /// and the checkboxes turn the unchecked ones off.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public int? MaxSelected { get; set; }

    /// <summary>
    /// Gets or sets whether the reader may type values of their own — tags: an entry after the chips where Enter or a comma makes a
    /// chip of the text, the options standing as suggestions. A typed value's key is its text; <see cref="MaxSelected"/> and a
    /// <c>RegexEach</c> rule refuse one on the field's validation line before it becomes a chip.
    /// </summary>
    /// <remarks>
    /// Decided at render: it makes the entry, not the field's box, the control the reader types and lands in. Refused under
    /// <see cref="UIMultiSelectVariant.Checkboxes"/>, which has no field to type in: by the setters, and by
    /// <see cref="ValidateConfiguration"/> where the property is written past them.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = false, GenerateSetter = false)]
    public bool? AllowFreeText { get; set; }

    /// <summary>
    /// Gets or sets what Enter takes in a field taking free text while the reader types: the text as typed (the arrows pick a
    /// suggestion), or the first suggestion the text names, marked as it is typed. Nothing without <see cref="AllowFreeText"/>.
    /// </summary>
    /// <remarks>Decided at render, as <see cref="AllowFreeText"/> is: it is how the entry answers its keys.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = UITagEntry.TypedText)]
    public UITagEntry? TagEntry { get; set; }

    /// <summary>
    /// Sets what the input is drawn as, with the variant's option template — the badge row for <see cref="UIMultiSelectVariant.Badges"/>,
    /// a checkbox's row for <see cref="UIMultiSelectVariant.Checkboxes"/> — unless a template of the author's own is already set.
    /// </summary>
    public T SetVariant(UIMultiSelectVariant variant)
    {
        if (AllowFreeText == true)
            ThrowIfFreeTextRefused(variant, nameof(variant));

        Variant = variant;

        return Self;
    }

    /// <summary>Refuses free text under <see cref="UIMultiSelectVariant.Checkboxes"/>, which has no field to type a tag in.</summary>
    private static void ThrowIfFreeTextRefused(UIMultiSelectVariant? variant, string parameterName)
    {
        if (variant == UIMultiSelectVariant.Checkboxes)
            throw new ArgumentException("A multi-select drawn as checkboxes takes no free text: it has no field to type a tag in. Leave AllowFreeText off, or draw it as Chips or Badges.", parameterName);
    }

    private static DefaultTextTemplate CreateVariantTemplate(UIMultiSelectVariant variant) => variant switch
    {
        // The badge inline on the row's first line, after a title only where the option has one, the description under it.
        UIMultiSelectVariant.Badges => CreateOptionTemplate().SetBadgePlacement(UITextBadgePlacement.Inline),
        // Title, as a checkbox's and a radio's: the box stands on its option's title line, and its glyph and badge beside it.
        UIMultiSelectVariant.Checkboxes => new DefaultTextTemplate(binds: true)
            .SetIconAlignment(UITextIconAlignment.Title)
            .SetBadgeAlignment(UITextBadgeAlignment.Title),
        _ => CreateOptionTemplate()
    };

    /// <summary>
    /// Lets the reader type values of their own as chips, the options standing as suggestions.
    /// </summary>
    public T SetAllowFreeText()
        => SetAllowFreeText(true);

    /// <summary>
    /// Sets whether the reader may type values of their own as chips; refused under <see cref="UIMultiSelectVariant.Checkboxes"/>.
    /// </summary>
    public T SetAllowFreeText(bool allowFreeText)
    {
        if (allowFreeText)
            ThrowIfFreeTextRefused(Variant, nameof(allowFreeText));

        AllowFreeText = allowFreeText;
        return Self;
    }

    /// <summary>
    /// Sets the chosen keys, no more of them than <see cref="MaxSelected"/>; whichever of the two is set last is checked against the
    /// other.
    /// </summary>
    public new T SetValue(IReadOnlyList<string>? value)
    {
        ValidateSelectedCount(value, MaxSelected);

        Value = value;
        return Self;
    }

    /// <summary>A count of at least one, and no more chosen keys than it allows; an unset count or value checks nothing.</summary>
    private static void ValidateSelectedCount(IReadOnlyList<string>? value, int? maxSelected)
    {
        if (maxSelected is int least)
            ArgumentOutOfRangeException.ThrowIfLessThan(least, 1, nameof(maxSelected));

        if (value is null || maxSelected is not int max || value.Count <= max)
            return;

        // A repeated key is one chip on the page, so only the distinct keys count.
        var count = new HashSet<string>(value, StringComparer.Ordinal).Count;

        if (count > max)
            throw new ArgumentOutOfRangeException(nameof(value), count, $"A multi-select cannot hold more than {max} keys.");
    }

    /// <summary>
    /// Sets how many options can be chosen at most, which the chosen keys may not already exceed.
    /// </summary>
    public T SetMaxSelected(int maxSelected)
    {
        ValidateSelectedCount(Value, maxSelected);

        MaxSelected = maxSelected;
        return Self;
    }

    /// <summary>
    /// Checks <see cref="MaxSelected"/> and the chosen keys, and free text against the variant, as they stand, by the setters' own rules.
    /// </summary>
    public void ValidateConfiguration()
    {
        ValidateSelectedCount(Value, MaxSelected);

        if (AllowFreeText == true)
            ThrowIfFreeTextRefused(Variant, nameof(AllowFreeText));
    }

    /// <summary>The checkboxes keep their caption on top whatever <c>TitlePlacement</c> asks, as their renderer draws it; the field honours it.</summary>
    public override UISize? CaptionRowBox(UIResponsiveTier tier)
        => InputCaptionRow.Box(this, tier, honoursInside: Variant != UIMultiSelectVariant.Checkboxes);
}

/// <summary>
/// An input that holds several options out of a bound list.
/// </summary>
public abstract class MultiSelectComponent<T>(string? id = null) : MultiSelectComponent<T, OptionItem>(id)
    where T : MultiSelectComponent<T>, IUIComponentDefinition
{ }

/// <summary>
/// An input that holds several options out of a bound list: chips in a field, the options' badges, or a checkbox per option.
/// </summary>
public sealed class MultiSelectComponent(string? id = null) : MultiSelectComponent<MultiSelectComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.multi-select";
}
