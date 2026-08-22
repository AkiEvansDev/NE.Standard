using System;
using System.Collections.Generic;

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
