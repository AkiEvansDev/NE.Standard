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
    /// Gets the client's stable id for the window showing the instance — a browser tab, a desktop window.
    /// </summary>
    public required string WindowId { get; init; }

    /// <summary>
    /// Gets the navigation request associated with the instance.
    /// </summary>
    public required UINavigationRequest Navigation { get; init; }

    /// <summary>
    /// Gets the id of the page render this instance belongs to, when the host issued one.
    /// </summary>
    /// <remarks>
    /// Lets one runtime serve both halves of a page load; null when a host does not prepare a runtime at render
    /// time, and the key falls back to the connection.
    /// </remarks>
    public string? PageId { get; init; }

    /// <summary>
    /// Validates the UI instance.
    /// </summary>
    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(Id);
        ArgumentException.ThrowIfNullOrWhiteSpace(WindowId);
        ArgumentNullException.ThrowIfNull(Navigation);

        Navigation.Validate();
    }
}
