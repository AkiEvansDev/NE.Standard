using System;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Updates.Client;

namespace NE.Standard.UI.Shell.Controllers;

/// <summary>
/// Provides context for an exception raised during UI runtime processing.
/// </summary>
public sealed class RuntimeExceptionContext
{
    /// <summary>
    /// Gets the exception raised by the runtime.
    /// </summary>
    public required Exception Exception { get; init; }

    /// <summary>
    /// Gets the runtime operation being executed when the exception was raised.
    /// </summary>
    public required string Operation { get; init; }

    /// <summary>
    /// Gets the command request being processed, when applicable.
    /// </summary>
    public UICommandRequest? CommandRequest { get; init; }

    /// <summary>
    /// Gets the client change set being processed, when applicable.
    /// </summary>
    public ClientChangeSet? ClientChangeSet { get; init; }

    /// <summary>
    /// Validates the exception context.
    /// </summary>
    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(Exception);
        ArgumentException.ThrowIfNullOrWhiteSpace(Operation);

        CommandRequest?.Validate();
        ClientChangeSet?.Validate();
    }
}
