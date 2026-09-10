using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a visual component that accepts or displays an input value.
/// </summary>
public interface IInputComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Value"/>.
    /// </summary>
    static UIProperty ValueProperty { get; } = new(nameof(Value));

    /// <summary>
    /// Gets the registered property key for <see cref="IsReadOnly"/>.
    /// </summary>
    static UIProperty IsReadOnlyProperty { get; } = new(nameof(IsReadOnly));

    /// <summary>
    /// Gets the registered property key for <see cref="FormId"/>.
    /// </summary>
    static UIProperty FormIdProperty { get; } = new(nameof(FormId));

    /// <summary>
    /// Gets the registered property key for <see cref="Validation"/>.
    /// </summary>
    static UIProperty ValidationProperty { get; } = new(nameof(Validation));

    /// <summary>
    /// Gets the registered property key for <see cref="ValidationPresentation"/>.
    /// </summary>
    static UIProperty ValidationPresentationProperty { get; } = new(nameof(ValidationPresentation));

    /// <summary>
    /// Gets the input's current value, boxed to <see cref="object"/>; a concrete input also exposes its own typed
    /// <c>Value</c> alongside this one.
    /// </summary>
    object? Value { get; }

    /// <summary>
    /// Gets whether the input can be seen but not edited; unlike <see cref="IVisualComponent.Enabled"/>, a
    /// read-only value still submits and stays focusable.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    bool? IsReadOnly { get; }

    /// <summary>
    /// Gets the id of the form this input belongs to, used to scope Submit-trigger validation.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    string? FormId { get; }

    /// <summary>A message the controller puts on the field, beside whatever the client rules say; the strongest one shows.</summary>
    [UIComponentProperty(DefaultValue = null)]
    UIValidationMessage? Validation { get; }

    /// <summary>
    /// Where the message goes: a line under the field, or a mark at its edge with the message in a tooltip. Decided once at render;
    /// <see cref="UIValidationPresentation.Auto"/> is the line except in a cell of a grid.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = UIValidationPresentation.Auto)]
    UIValidationPresentation? ValidationPresentation { get; }

    /// <summary>
    /// Gets validation rules applied to the input value.
    /// </summary>
    IReadOnlyList<UIValidationRule> Validations { get; }
}
