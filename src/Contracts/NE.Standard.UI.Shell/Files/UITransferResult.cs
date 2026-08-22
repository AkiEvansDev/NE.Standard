using System;

namespace NE.Standard.UI.Shell.Files;

/// <summary>
/// Represents the outcome of a client file transfer operation.
/// </summary>
public sealed class UITransferResult
{
    /// <summary>
    /// Creates a transfer result. Cannot be both successful and cancelled; a failed (non-cancelled)
    /// result must provide an error message, and a successful or cancelled one must not.
    /// </summary>
    public UITransferResult(bool success = true, bool cancelled = false, string? error = null)
    {
        if (success && cancelled)
            throw new ArgumentException("A transfer result cannot be both successful and cancelled.", nameof(cancelled));

        if (!success && !cancelled && string.IsNullOrWhiteSpace(error))
            throw new ArgumentException("A failed transfer result must provide an error message.", nameof(error));

        if ((success || cancelled) && !string.IsNullOrWhiteSpace(error))
            throw new ArgumentException("A successful or cancelled transfer result cannot provide an error message.", nameof(error));

        Success = success;
        Cancelled = cancelled;
        Error = string.IsNullOrWhiteSpace(error) ? null : error;
    }

    /// <summary>
    /// Gets whether the transfer completed successfully.
    /// </summary>
    public bool Success { get; }

    /// <summary>
    /// Gets whether the transfer was cancelled.
    /// </summary>
    public bool Cancelled { get; }

    /// <summary>
    /// Gets the transfer error message when the transfer failed.
    /// </summary>
    public string? Error { get; }

    /// <summary>
    /// Creates a successful transfer result.
    /// </summary>
    public static UITransferResult Ok()
        => new(success: true);

    /// <summary>
    /// Creates a cancelled transfer result.
    /// </summary>
    public static UITransferResult Cancel()
        => new(success: false, cancelled: true);

    /// <summary>
    /// Creates a failed transfer result with the given error message.
    /// </summary>
    public static UITransferResult Fail(string error)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(error);
        return new(success: false, error: error);
    }
}
