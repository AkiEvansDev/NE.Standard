using System;
using NE.Standard.UI.Abstractions.Navigation;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>
/// Identifies a UI client connection attached to a client tab and navigation request.
/// </summary>
public sealed class UIInstance
{
    /// <summary>
    /// Gets the active UI transport connection id.
    /// </summary>
    public required string Id { get; init; }

    /// <summary>
    /// Gets the stable client tab id associated with the instance.
    /// </summary>
    public required string TabId { get; init; }

    /// <summary>
    /// Gets the navigation request associated with the instance.
    /// </summary>
    public required UINavigationRequest Navigation { get; init; }

    /// <summary>
    /// Validates the UI instance.
    /// </summary>
    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(Id);
        ArgumentException.ThrowIfNullOrWhiteSpace(TabId);
        ArgumentNullException.ThrowIfNull(Navigation);

        Navigation.Validate();
    }
}
