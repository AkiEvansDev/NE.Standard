using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Compiled.Models;

/// <summary>
/// Represents a compiled component property value or binding reference.
/// </summary>
public sealed class CompiledUIPropertyValue
{
    /// <summary>
    /// Gets the property key.
    /// </summary>
    public required UIProperty Property { get; init; }

    /// <summary>
    /// Gets whether the static value is localizable text.
    /// </summary>
    public bool IsTranslatable { get; init; }

    /// <summary>
    /// Gets whether the property value is provided by a binding.
    /// </summary>
    public bool IsBind { get; init; }

    /// <summary>
    /// Gets the binding id for bound property values.
    /// </summary>
    public UIBindingId? BindingId { get; init; }

    /// <summary>
    /// Gets the static property value.
    /// </summary>
    public object? Value { get; init; }
}
