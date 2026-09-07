using System;

namespace NE.Standard.UI.Primitives.Security;

/// <summary>
/// Thrown when an authenticated session lacks the roles or permissions a route or command requires.
/// </summary>
/// <remarks>
/// Distinct from a plain <see cref="UnauthorizedAccessException"/>, which means no identity yet and should route to
/// sign-in rather than a forbidden page.
/// </remarks>
public sealed class UIForbiddenAccessException : UnauthorizedAccessException
{
    /// <summary>
    /// Initializes the exception.
    /// </summary>
    public UIForbiddenAccessException() { }

    /// <summary>
    /// Initializes the exception with a message.
    /// </summary>
    public UIForbiddenAccessException(string message) : base(message) { }

    /// <summary>
    /// Initializes the exception with a message and an inner exception.
    /// </summary>
    public UIForbiddenAccessException(string message, Exception innerException) : base(message, innerException) { }
}
