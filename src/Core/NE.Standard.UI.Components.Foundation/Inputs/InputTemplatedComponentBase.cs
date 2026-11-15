using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
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
[UIComponentPropertyDefault(nameof(VerticalAlignment), nameof(DefaultVerticalAlignment))]
public abstract partial class InputTemplatedComponentBase<TComponent, TItem, TValue, TTemplate>(string? id = null) : GroupedItemsComponentBase<TComponent, TItem, TTemplate>(id), IInputComponent, ITextBaseComponent, IAccessibleNameComponent, ICaptionRowComponent, IRegionContainerComponent
    where TComponent : InputTemplatedComponentBase<TComponent, TItem, TValue, TTemplate>, IUIComponentDefinition
    where TItem : class
    where TTemplate : class, IVisualComponent
{
    private readonly Dictionary<string, IVisualComponent> _regions = [with(StringComparer.Ordinal)];
    private HashSet<string>? _authoredRegions;
    private readonly List<UIValidationRule> _validations = [];

    // A field's caption defaults, the same in InputComponentBase and InputTemplatedComponentBase.
    private static readonly UIThemeColor DefaultIconColor = UIThemeColor.Default;
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Caption;
    private const UITextBadgePlacement DefaultBadgePlacement = UITextBadgePlacement.Trailing;

    // Centers the field in its track, as InputComponentBase does.
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
    public IReadOnlyDictionary<string, IVisualComponent> Regions => _regions;

    /// <inheritdoc/>
    public bool HasRegions => _regions.Count > 0;

    /// <summary>
    /// Mutable view of the component's named regions for subclasses whose own helpers maintain numbered or conditional region entries.
    /// </summary>
    protected IDictionary<string, IVisualComponent> RegionEntries => _regions;

    /// <summary>
    /// Gets the control the caption row carries at its far edge, or <see langword="null"/> when none is set.
    /// </summary>
    public virtual IVisualComponent? HeaderAction => _regions.GetValueOrDefault(RegionNames.HeaderAction);

    /// <summary>
    /// Sets the control the caption row carries at its far edge, keeping the row at one caption line's height.
    /// </summary>
    public virtual TComponent SetHeaderAction(IVisualComponent action)
    {
        ArgumentNullException.ThrowIfNull(action);
        ValidateHeaderActionSupported(nameof(action));

        if (ReferenceEquals(action, this))
            throw new InvalidOperationException("A component cannot use itself as region content.");

        _regions[RegionNames.HeaderAction] = action;
        _ = (_authoredRegions ??= [with(StringComparer.Ordinal)]).Add(RegionNames.HeaderAction);
        return Self;
    }

    /// <summary>
    /// Checks whether the input draws a header row that can hold a <see cref="HeaderAction"/>.
    /// </summary>
    protected virtual void ValidateHeaderActionSupported(string parameterName)
    {
    }

    /// <inheritdoc/>
    public void AddValidation(UIValidationRule rule) => _validations.Add(rule);

    /// <inheritdoc/>
    public virtual UISize? CaptionRowBox(UIResponsiveTier tier) => InputCaptionRow.Box(this, tier);

    /// <inheritdoc/>
    protected override Action? SnapshotAuthoredState()
    {
        Action? restoreBase = base.SnapshotAuthoredState();
        var hadRegions = _authoredRegions is { Count: > 0 };
        var hadValidations = _validations.Count > 0;

        if (!hadRegions && !hadValidations)
            return restoreBase;

        List<(string Name, IVisualComponent Content, Action? Restore)>? ownRegions = null;

        if (hadRegions)
        {
            ownRegions = [with(_authoredRegions!.Count)];

            foreach (var name in _authoredRegions)
            {
                if (_regions.TryGetValue(name, out IVisualComponent? content))
                    ownRegions.Add((name, content, (content as ITemplateEventTarget)?.SnapshotComponentState()));
            }

            _authoredRegions.Clear();
        }

        UIValidationRule[]? ownValidations = hadValidations ? [.. _validations] : null;

        if (hadValidations)
            _validations.Clear();

        return () =>
        {
            restoreBase?.Invoke();

            if (ownRegions is not null)
            {
                for (var i = 0; i < ownRegions.Count; i++)
                {
                    (var name, IVisualComponent content, Action? restore) = ownRegions[i];
                    _regions[name] = content;
                    _ = (_authoredRegions ??= [with(StringComparer.Ordinal)]).Add(name);
                    restore?.Invoke();
                }
            }

            if (ownValidations is not null)
                InputValidationDefaults.MergeAuthored(_validations, ownValidations);
        };
    }
}
