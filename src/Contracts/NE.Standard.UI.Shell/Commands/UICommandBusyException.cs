using System;

namespace NE.Standard.UI.Shell.Commands;

/// <summary>
/// Thrown when a background command already has as many runs under way as its <c>MaxConcurrent</c> allows; refused like any
/// <see cref="UnauthorizedAccessException"/>, and told to the reader as already running rather than as not allowed.
/// </summary>
public sealed class UICommandBusyException : UnauthorizedAccessException
{
    /// <summary>
    /// Initializes the exception.
    /// </summary>
    public UICommandBusyException() { }

    /// <summary>
    /// Initializes the exception with a message.
    /// </summary>
    public UICommandBusyException(string message) : base(message) { }

    /// <summary>
    /// Initializes the exception with a message and an inner exception.
    /// </summary>
    public UICommandBusyException(string message, Exception innerException) : base(message, innerException) { }
}
