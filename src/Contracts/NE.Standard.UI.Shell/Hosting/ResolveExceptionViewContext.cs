using System;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Shell.Hosting;

/// <summary>
/// Provides context for a failure that occurred while resolving a view.
/// </summary>
public sealed class ResolveExceptionViewContext
{
    /// <summary>
    /// Gets the exception raised while resolving the view.
    /// </summary>
    public required Exception Exception { get; init; }

    /// <summary>
    /// Gets the navigation request being resolved.
    /// </summary>
    public required UINavigationRequest Navigation { get; init; }

    /// <summary>
    /// Gets the session initialization data.
    /// </summary>
    public required UserSessionInitData SessionInit { get; init; }

    /// <summary>
    /// Gets the resolved session, when available.
    /// </summary>
    public IUserSessionContext? Session { get; init; }

    /// <summary>
    /// Gets the matched route, when available.
    /// </summary>
    public UIRouteDefinition? Route { get; init; }

    /// <summary>
    /// Gets the zero-based resolution attempt number.
    /// </summary>
    public int Attempt { get; init; }

    /// <summary>
    /// Gets whether the exception represents an authorization failure.
    /// </summary>
    public bool IsUnauthorized => Exception is UnauthorizedAccessException;

    /// <summary>
    /// Validates the exception context.
    /// </summary>
    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(Exception);
        ArgumentNullException.ThrowIfNull(Navigation);
        ArgumentNullException.ThrowIfNull(SessionInit);

        Navigation.Validate();

        if (Attempt < 0)
            throw new ArgumentOutOfRangeException(nameof(Attempt), Attempt, "Attempt cannot be negative.");
    }
}
