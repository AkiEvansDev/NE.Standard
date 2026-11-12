using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for input components with value binding, events, and validation rules.
/// </summary>
/// <remarks><see cref="InputTemplatedComponentBase{TComponent, TItem, TValue, TTemplate}"/> is the same thing over an items host.</remarks>
[UIComponentPropertyBlock(typeof(IInputComponent))]
[UIComponentPropertyBlock(typeof(ITextBaseComponent))]
[UIComponentPropertyBlock(typeof(IAccessibleNameComponent))]
[UIComponentPropertyDefault(nameof(ITextBaseComponent.IconColor), nameof(DefaultIconColor))]
[UIComponentPropertyDefault(nameof(ITextBaseComponent.TitleType), nameof(DefaultTitleType))]
[UIComponentPropertyDefault(nameof(ITextBaseComponent.BadgePlacement), nameof(DefaultBadgePlacement))]
[UIComponentPropertyDefault(nameof(VerticalAlignment), nameof(DefaultVerticalAlignment))]
public abstract partial class InputComponentBase<TComponent, TValue>(string? id = null) : VisualComponentBase<TComponent>(id), IInputComponent, ITextBaseComponent, IAccessibleNameComponent, ICaptionRowComponent
    where TComponent : InputComponentBase<TComponent, TValue>, IUIComponentDefinition
{
    private readonly List<UIValidationRule> _validations = [];

    // A field's caption defaults, the same in InputComponentBase and InputTemplatedComponentBase.
    private static readonly UIThemeColor DefaultIconColor = UIThemeColor.Default;
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Caption;
    private const UITextBadgePlacement DefaultBadgePlacement = UITextBadgePlacement.Trailing;

    // Centers the field in its track, since a field is only as tall as its own content and would otherwise sit at the top of a taller row.
    private static readonly UIResponsive<UIAlignment> DefaultVerticalAlignment = UIAlignment.Center;

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
    public virtual UISize? CaptionRowBox(UIResponsiveTier tier) => InputCaptionRow.Box(this, tier);

    /// <inheritdoc/>
    protected override Action? SnapshotAuthoredState()
    {
        Action? restoreBase = base.SnapshotAuthoredState();

        if (_validations.Count == 0)
            return restoreBase;

        UIValidationRule[] ownValidations = [.. _validations];
        _validations.Clear();

        return () =>
        {
            restoreBase?.Invoke();
            InputValidationDefaults.MergeAuthored(_validations, ownValidations);
        };
    }
}

internal static class InputValidationDefaults
{
    public static void MergeAuthored(List<UIValidationRule> target, UIValidationRule[] ownValidations)
    {
        UIValidationRule[] inherited = target.Count > 0 ? [.. target] : [];
        target.Clear();

        for (var i = 0; i < inherited.Length; i++)
        {
            var overridden = false;

            for (var j = 0; j < ownValidations.Length; j++)
            {
                if (ownValidations[j].Operator == inherited[i].Operator && Nullable.Equals(ownValidations[j].ValueSource, inherited[i].ValueSource))
                {
                    overridden = true;
                    break;
                }
            }

            if (!overridden)
                target.Add(inherited[i]);
        }

        target.AddRange(ownValidations);
    }
}
