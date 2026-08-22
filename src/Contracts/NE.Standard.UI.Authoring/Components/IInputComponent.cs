using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Interaction;

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
    /// Gets the input value.
    /// </summary>
    object? Value { get; }

    /// <summary>
    /// Gets whether the input is read-only.
    /// </summary>
    bool? IsReadOnly { get; }

    /// <summary>
    /// Gets the id of the form this input belongs to, used to scope Submit-trigger validation.
    /// </summary>
    string? FormId { get; }

    /// <summary>
    /// Gets validation rules applied to the input value.
    /// </summary>
    IReadOnlyList<UIValidationRule> Validations { get; }
}
