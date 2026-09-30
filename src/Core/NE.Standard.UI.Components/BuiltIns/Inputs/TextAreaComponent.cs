using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A multi-line text input for entering longer free-form text.
/// </summary>
public abstract partial class TextAreaComponent<T> : FieldInputComponentBase<T, string?>, IPlaceholderInputComponent, IRegionContainerComponent, IDebounceInputComponent, ITextLengthComponent
    where T : TextAreaComponent<T>, IUIComponentDefinition
{
    private const int DefaultRows = 3;

    private readonly FieldActions _actions = new();

    /// <summary>
    /// Initializes the area stretched, unlike the one-line fields it shares a base with: a box for longer text takes the height its
    /// track gives it.
    /// </summary>
    protected TextAreaComponent(string? id = null) : base(id)
    {
        VerticalAlignment = UIAlignment.Stretch;
    }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(IPlaceholderInputComponent), DefaultValue = null)]
    public string? Placeholder { get; set; }

    /// <summary>
    /// Gets the controls at the start of the field, beside its text at the bottom edge, in the order they stand.
    /// </summary>
    public IReadOnlyList<IButtonComponent> LeadingActions => _actions.Leading;

    /// <summary>
    /// Gets the controls at the end of the field, beside its text at the bottom edge, in the order they stand.
    /// </summary>
    public IReadOnlyList<IButtonComponent> TrailingActions => _actions.Trailing;

    /// <inheritdoc/>
    public IReadOnlyDictionary<string, IVisualComponent> Regions => _actions.Regions;

    /// <inheritdoc/>
    public bool HasRegions => _actions.Regions.Count > 0;

    /// <summary>
    /// Gets or sets the number of visible text rows; the least the area shows while it grows (<see cref="MaxRows"/>).
    /// </summary>
    [UIComponentProperty(DefaultValue = DefaultRows, GenerateSetter = false)]
    public int? Rows { get; set; }

    /// <summary>
    /// Gets or sets how many rows the area grows to with its text before it scrolls; unset, it keeps <see cref="Rows"/>. While it
    /// grows, the reader's own resize is off, whatever <see cref="Resize"/> says.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public int? MaxRows { get; set; }

    /// <summary>
    /// Gets or sets whether Enter presses the submit button of the area's form (<c>FormId</c>), its value committed first, and
    /// Shift+Enter breaks the line; off, Enter breaks the line.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? SubmitOnEnter { get; set; }

    /// <summary>
    /// Gets or sets how the text area can be resized by the user.
    /// </summary>
    [UIComponentProperty(DefaultValue = UITextAreaResizeMode.Vertical)]
    public UITextAreaResizeMode? Resize { get; set; }

    /// <summary>
    /// Gets or sets the maximum number of characters allowed.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public int? MaxLength { get; set; }

    /// <summary>
    /// Gets or sets whether leading and trailing whitespace is trimmed from the input.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? TrimInput { get; set; }

    /// <summary>
    /// Gets or sets how long after the viewer stops typing the value is committed, in milliseconds; unset, it
    /// commits on blur.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public int? DebounceMilliseconds { get; set; }

    /// <summary>
    /// Sets the number of visible text rows.
    /// </summary>
    public T SetRows(int rows)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(rows);

        if (MaxRows is int maxRows)
            ArgumentOutOfRangeException.ThrowIfGreaterThan(rows, maxRows);

        Rows = rows;
        return Self;
    }

    /// <summary>
    /// Makes the area grow with its text from <see cref="Rows"/> up to <paramref name="maxRows"/> rows, then scroll.
    /// </summary>
    public T SetAutoGrow(int maxRows)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(maxRows, Rows ?? DefaultRows);

        MaxRows = maxRows;
        return Self;
    }

    /// <summary>
    /// Makes Enter press the submit button of the area's form, and Shift+Enter break the line.
    /// </summary>
    public T SetSubmitOnEnter()
        => SetSubmitOnEnter(true);

    /// <summary>
    /// Adds a button at the start of the field, beside its text at the bottom edge, after those added before.
    /// </summary>
    public T AddLeadingAction(IButtonComponent action)
    {
        _actions.AddLeading(action);
        return Self;
    }

    /// <summary>
    /// Adds a button at the end of the field, beside its text at the bottom edge, after those added before.
    /// </summary>
    public T AddTrailingAction(IButtonComponent action)
    {
        _actions.AddTrailing(action);
        return Self;
    }

    /// <summary>
    /// Enables trimming leading and trailing whitespace from the input.
    /// </summary>
    public T SetTrimInput()
        => SetTrimInput(true);
}

/// <summary>
/// A multi-line text input for entering longer free-form text.
/// </summary>
public sealed class TextAreaComponent(string? id = null) : TextAreaComponent<TextAreaComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.text-area";
}
