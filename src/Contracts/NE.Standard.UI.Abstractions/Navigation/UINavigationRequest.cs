using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using NE.Standard.UI.Abstractions.Recursive;

namespace NE.Standard.UI.Abstractions.Navigation;

/// <summary>
/// Represents a request to navigate to a UI route.
/// </summary>
public sealed class UINavigationRequest
{
    /// <summary>
    /// Gets the requested route.
    /// </summary>
    public required string Route { get; init; }

    /// <summary>
    /// Gets route parameters supplied with the navigation request.
    /// </summary>
    public IReadOnlyDictionary<string, object?>? Parameters { get; init; }

    /// <summary>
    /// Attempts to read a parameter as a string: its own value, or, for any other primitive, its invariant text.
    /// </summary>
    public bool TryGetParameter(string name, [NotNullWhen(true)] out string? value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        value = null;

        if (Parameters is null || !Parameters.TryGetValue(name, out var raw) || raw is null)
            return false;

        value = raw as string ?? Convert.ToString(raw, CultureInfo.InvariantCulture);

        return value is not null;
    }

    /// <summary>
    /// Attempts to read a parameter and coerce it into <typeparamref name="T"/> — one of the primitives
    /// <see cref="RecursiveValueCoercion"/> knows.
    /// </summary>
    public bool TryGetParameter<T>(string name, out T value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        value = default!;

        return Parameters is not null
            && Parameters.TryGetValue(name, out var raw)
            && RecursiveValueCoercion.TryCoerce(raw, out value);
    }

    /// <summary>
    /// Validates the navigation request.
    /// </summary>
    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(Route);

        if (Parameters is null)
            return;

        foreach (KeyValuePair<string, object?> parameter in Parameters)
            ArgumentException.ThrowIfNullOrWhiteSpace(parameter.Key);
    }
}
