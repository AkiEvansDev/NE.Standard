using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A multi-line text input for entering longer free-form text.
/// </summary>
[UIComponentPropertyDefault(nameof(IVisualComponent.VerticalAlignment), nameof(DefaultVerticalAlignment))]
[UIComponentPropertyBlock(typeof(IExpandableInputComponent))]
public abstract partial class TextAreaComponent<T>(string? id = null) : TextEntryInputComponentBase<T>(id), IExpandableInputComponent, IConfigurationValidatedComponent
    where T : TextAreaComponent<T>, IUIComponentDefinition
{
    // Stretched, unlike the one-line fields it shares a base with: a box for longer text takes the height its track gives it.
    private static readonly UIResponsive<UIAlignment> DefaultVerticalAlignment = UIAlignment.Stretch;
    private const int DefaultRows = 3;

    /// <summary>
    /// Gets or sets the number of visible text rows; the least the area shows while it grows (<see cref="MaxRows"/>).
    /// </summary>
    [UIComponentProperty(DefaultValue = DefaultRows, GenerateSetter = false)]
    public int? Rows { get; set; }

    /// <summary>
    /// Gets or sets how many rows the area grows to with its text before it scrolls; unset, it keeps <see cref="Rows"/>.
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
    /// Sets the number of visible text rows.
    /// </summary>
    public T SetRows(int rows)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(rows);

        if (MaxRows is int maxRows)
            ArgumentOutOfRangeException.ThrowIfGreaterThan(rows, maxRows);

        Rows = rows;
        RemoveNonOptionalBinding(RowsProperty);
        return Self;
    }

    /// <summary>
    /// Makes the area grow with its text from <see cref="Rows"/> up to <paramref name="maxRows"/> rows, then scroll.
    /// </summary>
    public T SetAutoGrow(int maxRows)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(maxRows, Rows ?? DefaultRows);

        MaxRows = maxRows;
        RemoveNonOptionalBinding(MaxRowsProperty);
        return Self;
    }

    /// <summary>
    /// Makes Enter press the submit button of the area's form, and Shift+Enter break the line.
    /// </summary>
    public T SetSubmitOnEnter()
        => SetSubmitOnEnter(true);

    /// <summary>
    /// Enables or disables opening the area in a full-height modal dialog.
    /// </summary>
    public T SetExpandable(bool expandable)
    {
        Expandable = expandable;
        return Self;
    }

    /// <summary>
    /// Enables opening the area in a full-height modal dialog and optionally configures its expanded presentation.
    /// </summary>
    public T SetExpandable(Action<UIExpandedTextAreaBuilder>? configure = null)
    {
        Expandable = true;

        if (configure is not null)
            configure(new UIExpandedTextAreaBuilder(this));

        return Self;
    }

    /// <summary>A multi-line field keeps its caption on top whatever <c>TitlePlacement</c> asks, as its renderer draws it.</summary>
    public override UISize? CaptionRowBox(UIResponsiveTier tier)
        => InputCaptionRow.Box(this, tier, honoursInside: false);

    /// <inheritdoc/>
    public void ValidateConfiguration()
    {
        if (Rows is int rows)
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(rows);

        if (MaxRows is int maxRows)
            ArgumentOutOfRangeException.ThrowIfLessThan(maxRows, Rows ?? DefaultRows);
    }
}

/// <summary>
/// A multi-line text input for entering longer free-form text.
/// </summary>
public sealed class TextAreaComponent(string? id = null) : TextAreaComponent<TextAreaComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.text-area";
}

/// <summary>
/// Configures how a <see cref="TextAreaComponent"/> presents itself when expanded into a full-height modal dialog.
/// </summary>
public sealed class UIExpandedTextAreaBuilder : IUIExpandedFieldBuilder<UIExpandedTextAreaBuilder>
{
    private readonly IExpandableInputComponent _target;

    internal UIExpandedTextAreaBuilder(IExpandableInputComponent target)
    {
        _target = target;
    }

    /// <inheritdoc/>
    public UIExpandedTextAreaBuilder SetShowButton(bool showButton = true)
    {
        _target.ShowExpandButton = showButton;
        return this;
    }

    /// <inheritdoc/>
    public UIExpandedTextAreaBuilder SetWidth(UILayoutLength width)
    {
        _target.ExpandedWidth = width;
        return this;
    }

    /// <inheritdoc/>
    public UIExpandedTextAreaBuilder SetWidth(UIResponsive<UILayoutLength> width)
    {
        _target.ExpandedWidth = width;
        return this;
    }

    /// <inheritdoc/>
    public UIExpandedTextAreaBuilder SetAppearance(UIInputAppearance appearance)
    {
        _target.ExpandedAppearance = appearance;
        return this;
    }
}
