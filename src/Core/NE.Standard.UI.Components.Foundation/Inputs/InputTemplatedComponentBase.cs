using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for templated input components with value binding, item templates, events, and validation rules.
/// </summary>
/// <remarks><see cref="InputComponentBase{TComponent, TValue}"/> is the same thing over a plain visual component.</remarks>
[UIComponentPropertyBlock(typeof(IInputComponent))]
[UIComponentPropertyBlock(typeof(ITextBaseComponent))]
public abstract partial class InputTemplatedComponentBase<TComponent, TItem, TValue, TTemplate> : GroupedItemsComponentBase<TComponent, TItem, TTemplate>, IInputComponent, ITextBaseComponent
    where TComponent : InputTemplatedComponentBase<TComponent, TItem, TValue, TTemplate>, IUIComponentDefinition
    where TItem : class
    where TTemplate : class, IVisualComponent
{
    private readonly List<UIValidationRule> _validations = [];

    private static readonly UIThemeColor DefaultIconColor = UIThemeColor.FromStyle(UIColorStyle.Primary);
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Caption;

    /// <summary>
    /// Initializes a field centred in its track, as <see cref="InputComponentBase{TComponent, TValue}"/> does.
    /// </summary>
    protected InputTemplatedComponentBase(string? id = null) : base(id)
    {
        VerticalAlignment = UIAlignment.Center;
    }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IInputComponent), BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource | UIBindingCapabilities.SubmitBufferedTargetToSource, DefaultBindingMode = UIBindingMode.TwoWay)]
    public TValue? Value { get; set; }

    /// <inheritdoc/>
    object? IInputComponent.Value => Value;

    // The four label properties a field's caption differs on, the same four as InputComponentBase; the rest come from the ITextBaseComponent block.

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultIconColor))]
    public UIThemeColor? IconColor { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultTitleType))]
    public UITextAppearance? TitleType { get; set; }

    /// <inheritdoc/>
    /// <remarks>A field's caption is part of the control, not content: it is not selectable unless asked.</remarks>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = false)]
    public bool? Selectable { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UITextBadgePlacement.Trailing)]
    public UITextBadgePlacement? BadgePlacement { get; set; }

    /// <inheritdoc/>
    public UIPropertyReference? ValidationTarget { get; set; }

    /// <inheritdoc/>
    public IReadOnlyList<UIValidationRule> Validations => _validations;

    /// <inheritdoc/>
    public void AddValidation(UIValidationRule rule) => _validations.Add(rule);
}
