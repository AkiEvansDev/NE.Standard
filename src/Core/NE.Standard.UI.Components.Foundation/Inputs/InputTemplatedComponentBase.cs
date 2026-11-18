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
public abstract partial class InputTemplatedComponentBase<TComponent, TItem, TValue, TTemplate> : GroupedItemsComponentBase<TComponent, TItem, TTemplate>, IInputComponent, ITextBaseComponent, IAccessibleNameComponent, ICaptionRowComponent, IRegionContainerComponent
    where TComponent : InputTemplatedComponentBase<TComponent, TItem, TValue, TTemplate>, IUIComponentDefinition
    where TItem : class
    where TTemplate : class, IVisualComponent
{
    private readonly ComponentRegionBag _regions;
    private readonly List<UIValidationRule> _validations = [];

    // A field's caption defaults, the same in InputComponentBase and InputTemplatedComponentBase.
    private static readonly UIThemeColor DefaultIconColor = UIThemeColor.Default;
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Caption;
    private const UITextBadgePlacement DefaultBadgePlacement = UITextBadgePlacement.Trailing;

    // Centers the field in its track, as InputComponentBase does.
    private static readonly UIResponsive<UIAlignment> DefaultVerticalAlignment = UIAlignment.Center;

    protected InputTemplatedComponentBase(string? id = null) : base(id)
    {
        _regions = new ComponentRegionBag(this);
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
    public IReadOnlyDictionary<string, IVisualComponent> Regions => _regions.Regions;

    /// <inheritdoc/>
    public bool HasRegions => _regions.HasRegions;

    /// <summary>
    /// Mutable view of the component's named regions for subclasses whose own helpers maintain numbered or conditional region entries.
    /// </summary>
    protected IDictionary<string, IVisualComponent> RegionEntries => _regions.Entries;

    /// <summary>
    /// Gets the control the caption row carries at its far edge, or <see langword="null"/> when none is set.
    /// </summary>
    public virtual IVisualComponent? HeaderAction => _regions.GetOrDefault(RegionNames.HeaderAction);

    /// <summary>
    /// Sets the control the caption row carries at its far edge, keeping the row at one caption line's height.
    /// </summary>
    public virtual TComponent SetHeaderAction(IVisualComponent action)
    {
        ArgumentNullException.ThrowIfNull(action);
        ValidateHeaderActionSupported(nameof(action));

        _regions.Set(RegionNames.HeaderAction, action);
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
        => InputValidationDefaults.SnapshotWith(_regions.SnapshotWith(base.SnapshotAuthoredState()), _validations);
}
