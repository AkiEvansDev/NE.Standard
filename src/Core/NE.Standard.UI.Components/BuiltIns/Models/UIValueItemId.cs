using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// Renders a plain value as the <see cref="IBindableItem.Id"/> of an item wrapping it.
/// </summary>
/// <remarks>
/// Non-generic so both <see cref="UIValueItem{T}"/> and <see cref="UIOptionValue{T}"/> can share it: a public
/// static member on a generic type is what CA1000 refuses, and duplicating the rule in two places is how the
/// two wrappers would drift into deriving different ids from the same value.
/// </remarks>
public static class UIValueItemId
{
    /// <summary>
    /// Renders a value as a stable item id.
    /// </summary>
    /// <exception cref="ArgumentException">The value renders as empty and cannot identify an item.</exception>
    public static string Create(object value)
    {
        ArgumentNullException.ThrowIfNull(value);

        var id = value as string ?? Convert.ToString(value, CultureInfo.InvariantCulture);

        return string.IsNullOrWhiteSpace(id)
            ? throw new ArgumentException($"A value of type '{value.GetType().Name}' rendered as empty and cannot identify an item.", nameof(value))
            : id;
    }
}
