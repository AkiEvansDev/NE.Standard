using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for input components with value binding, events, and validation rules.
/// </summary>
public abstract partial class InputComponentBase<TComponent, TValue>(string? id = null) : VisualComponentBase<TComponent>(id), IInputComponent, ITextBaseComponent
    where TComponent : InputComponentBase<TComponent, TValue>, IUIComponentDefinition
{
    private readonly InputValidationSupport<TComponent> _validation = new();

    private static readonly UIThemeColor DefaultIconColor = UIThemeColor.FromStyle(UIColorStyle.Primary);
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Caption;
    private static readonly UIThemeColor DefaultTitleColor = UIThemeColor.FromStyle(UIColorStyle.Default);
    private static readonly UIThemeColor DefaultBadgeIconColor = UIThemeColor.FromStyle(UIColorStyle.Default);
    private static readonly UITextAppearance DefaultBadgeTextType = UITextAppearance.Caption;

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IInputComponent), BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource | UIBindingCapabilities.SubmitBufferedTargetToSource, DefaultBindingMode = UIBindingMode.TwoWay)]
    public TValue? Value { get; set; }

    /// <inheritdoc/>
    object? IInputComponent.Value => Value;

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IInputComponent), DefaultValue = false)]
    public bool? IsReadOnly { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IInputComponent), DefaultValue = null)]
    public string? FormId { get; set; }

    // The label surface every input shares. Declared here and, identically, on
    // InputTemplatedComponentBase: the two input branches have no common ancestor below
    // VisualComponentBase, which is why Value/IsReadOnly/FormId above are duplicated the same way.

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    public string? Icon { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultIconColor))]
    public UIThemeColor? IconColor { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UIIconSize.Medium)]
    public UIIconSize? IconSize { get; set; }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    public string? Title { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultTitleType))]
    public UITextAppearance? TitleType { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultTitleColor))]
    public UIThemeColor? TitleColor { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UITextBadgePlacement.Trailing)]
    public UITextBadgePlacement? BadgePlacement { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UIBadgeType.Info)]
    public UIBadgeType? BadgeStyle { get; set; }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    public string? BadgeIcon { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultBadgeIconColor))]
    public UIThemeColor? BadgeIconColor { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UIIconSize.Small)]
    public UIIconSize? BadgeIconSize { get; set; }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    public string? BadgeText { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultBadgeTextType))]
    public UITextAppearance? BadgeTextType { get; set; }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    public string? Tooltip { get; set; }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    public string? BadgeTooltip { get; set; }

    /// <inheritdoc/>
    public IReadOnlyList<UIValidationRule> Validations => _validation.Validations;

    /// <summary>
    /// Registers a change event command.
    /// </summary>
    public TComponent OnChange(string command)
        => On(EventNames.Change, command);

    /// <summary>
    /// Registers a change event command with action arguments.
    /// </summary>
    public TComponent OnChange(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Change, command, arguments);

    /// <summary>
    /// Registers a change event command with literal action arguments.
    /// </summary>
    public TComponent OnChangeLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Change, command, arguments);

    /// <summary>
    /// Registers a blur event command.
    /// </summary>
    public TComponent OnBlur(string command)
        => On(EventNames.Blur, command);

    /// <summary>
    /// Registers a blur event command with action arguments.
    /// </summary>
    public TComponent OnBlur(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Blur, command, arguments);

    /// <summary>
    /// Registers a blur event command with literal action arguments.
    /// </summary>
    public TComponent OnBlurLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Blur, command, arguments);

    /// <summary>
    /// Adds a required-value validation rule.
    /// </summary>
    public TComponent Required(string message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIColorStyle severity = UIColorStyle.Danger)
        => _validation.Required(Self, message, trigger, severity);

    /// <summary>
    /// Adds a regular-expression validation rule.
    /// </summary>
    public TComponent Regex(string pattern, string message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIColorStyle severity = UIColorStyle.Danger)
        => _validation.Regex(Self, pattern, message, trigger, severity);

    /// <summary>
    /// Adds a validation rule.
    /// </summary>
    public TComponent Validate(UIValidationTrigger trigger, UIComparisonOperator @operator, object? value, UIColorStyle severity, string message)
        => _validation.Validate(Self, trigger, @operator, value, severity, message);
}
