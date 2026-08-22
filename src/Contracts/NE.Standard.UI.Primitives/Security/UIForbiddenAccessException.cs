using System;

namespace NE.Standard.UI.Primitives.Security;

/// <summary>
/// Thrown when an authenticated session lacks the roles or permissions a route or command requires.
/// </summary>
/// <remarks>
/// Separate from a plain <see cref="UnauthorizedAccessException"/>, which here means "no identity yet". The two
/// need different answers: the first is a dead end for this user and belongs on a forbidden page, the second is
/// fixed by signing in. Sending the first to a sign-in page tells someone already signed in to sign in again.
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
