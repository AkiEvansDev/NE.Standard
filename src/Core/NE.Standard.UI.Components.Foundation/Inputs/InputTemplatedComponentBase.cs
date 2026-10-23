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
[UIComponentPropertyBlock(typeof(IAccessibleNameComponent))]
[UIComponentPropertyDefault(nameof(ITextBaseComponent.IconColor), nameof(DefaultIconColor))]
[UIComponentPropertyDefault(nameof(ITextBaseComponent.TitleType), nameof(DefaultTitleType))]
[UIComponentPropertyDefault(nameof(ITextBaseComponent.BadgePlacement), nameof(DefaultBadgePlacement))]
public abstract partial class InputTemplatedComponentBase<TComponent, TItem, TValue, TTemplate> : GroupedItemsComponentBase<TComponent, TItem, TTemplate>, IInputComponent, ITextBaseComponent, IAccessibleNameComponent, ICaptionRowComponent
    where TComponent : InputTemplatedComponentBase<TComponent, TItem, TValue, TTemplate>, IUIComponentDefinition
    where TItem : class
    where TTemplate : class, IVisualComponent
{
    private readonly List<UIValidationRule> _validations = [];

    // A field's caption differs from a text's on these three, the same in InputComponentBase and InputTemplatedComponentBase.
    private static readonly UIThemeColor DefaultIconColor = UIThemeColor.FromStyle(UIColorStyle.Primary);
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Caption;
    private const UITextBadgePlacement DefaultBadgePlacement = UITextBadgePlacement.Trailing;

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

    /// <inheritdoc/>
    public UIPropertyReference? ValidationTarget { get; set; }

    /// <inheritdoc/>
    public IReadOnlyList<UIValidationRule> Validations => _validations;

    /// <inheritdoc/>
    public void AddValidation(UIValidationRule rule) => _validations.Add(rule);

    /// <inheritdoc/>
    public virtual UIInputSize? CaptionRowBox(UIResponsiveTier tier) => InputCaptionRow.Box(this, tier);
}
