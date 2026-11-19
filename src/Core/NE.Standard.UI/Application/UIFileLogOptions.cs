using System;
using System.Threading;
using Microsoft.Extensions.Logging;

namespace NE.Standard.UI.Application;

/// <summary>
/// Configures rolling plain-text file logging and automatic retention cleanup.
/// </summary>
public sealed class UIFileLogOptions
{
    /// <summary>
    /// Gets or sets whether rolling file logging is enabled.
    /// </summary>
    public bool Enabled { get; set; }

    /// <summary>
    /// Gets or sets the directory where log files are written; <see langword="null"/> uses <c>logs</c> under
    /// <see cref="AppContext.BaseDirectory"/>, and relative paths resolve against <see cref="AppContext.BaseDirectory"/>.
    /// </summary>
    public string? DirectoryPath { get; set; }

    /// <summary>
    /// Gets or sets the file name prefix before <c>-yyyy-MM-dd.log</c>; <see langword="null"/> derives it from the entry assembly name.
    /// </summary>
    public string? FileNamePrefix { get; set; }

    /// <summary>
    /// Gets or sets an optional minimum log level specific to file output; <see langword="null"/> follows the host's general filter rules.
    /// </summary>
    public LogLevel? MinimumLevel { get; set; }

    /// <summary>
    /// Gets or sets the maximum size in bytes of one log file before rolling to <c>.001.log</c>, <c>.002.log</c>, and so on.
    /// </summary>
    public long MaxFileSize { get; set; } = 32L * 1024 * 1024;

    /// <summary>
    /// Gets or sets how long old log files are kept before cleanup removes them; <see langword="null"/> or
    /// <see cref="Timeout.InfiniteTimeSpan"/> keeps files indefinitely.
    /// </summary>
    public TimeSpan? Retention { get; set; } = TimeSpan.FromDays(7);

    /// <summary>
    /// Gets or sets how often expired log files are swept in addition to the startup sweep.
    /// </summary>
    public TimeSpan CleanupInterval { get; set; } = TimeSpan.FromHours(1);

    /// <summary>
    /// Gets or sets the timestamp pattern written inside <c>[...]</c> at the start of each line; an empty string omits the timestamp.
    /// </summary>
    public string TimestampFormat { get; set; } = "yyyy-MM-dd HH:mm:ss.fff zzz";

    /// <summary>
    /// Gets or sets whether file timestamps and daily roll boundaries use UTC rather than the machine's local time.
    /// </summary>
    public bool UseUtcTimestamp { get; set; }

    /// <summary>
    /// Gets or sets whether the full logger category name is written rather than the short type name.
    /// </summary>
    public bool FullCategoryName { get; set; } = true;

    /// <summary>
    /// Gets or sets whether active <see cref="ILogger.BeginScope{TState}"/> values are included on each line.
    /// </summary>
    public bool IncludeScopes { get; set; }

    /// <summary>
    /// Validates file logging options.
    /// </summary>
    public void Validate()
    {
        if (DirectoryPath is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(DirectoryPath);

        if (FileNamePrefix is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(FileNamePrefix);

        if (MinimumLevel is { } level && !Enum.IsDefined(level))
            throw new ArgumentOutOfRangeException(nameof(MinimumLevel), level, "Minimum log level is not a defined LogLevel value.");

        if (MaxFileSize <= 0)
            throw new ArgumentOutOfRangeException(nameof(MaxFileSize), MaxFileSize, "Maximum log file size must be greater than zero.");

        if (Retention is { } retention && retention <= TimeSpan.Zero && retention != Timeout.InfiniteTimeSpan)
            throw new ArgumentOutOfRangeException(nameof(Retention), retention, "Log retention must be greater than zero, null, or Timeout.InfiniteTimeSpan.");

        if (CleanupInterval <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(CleanupInterval), CleanupInterval, "Log cleanup interval must be greater than zero.");

        ArgumentNullException.ThrowIfNull(TimestampFormat);
        UIConsoleLogOptions.ValidateTimestampPattern(TimestampFormat, nameof(TimestampFormat));
    }
}
