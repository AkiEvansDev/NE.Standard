using System;

namespace NE.Standard.UI.Primitives.Security;

/// <summary>
/// Thrown when an authenticated session lacks the required roles or permissions; distinct from <see cref="UnauthorizedAccessException"/>,
/// which means no identity yet. That routes to sign-in; this to a forbidden page.
/// </summary>
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
