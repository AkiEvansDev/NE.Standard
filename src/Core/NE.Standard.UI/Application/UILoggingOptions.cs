using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;

namespace NE.Standard.UI.Application;

/// <summary>
/// Configures standard console and rolling file logging for a UI application.
/// </summary>
public sealed class UILoggingOptions
{
    /// <summary>
    /// Gets or sets the application-wide minimum log level; <see langword="null"/> leaves the host's configured minimum level unchanged.
    /// </summary>
    public LogLevel? MinimumLevel { get; set; }

    /// <summary>
    /// Gets per-category minimum log level overrides keyed by logger category or namespace prefix.
    /// </summary>
    public IDictionary<string, LogLevel> CategoryLevels { get; } = new Dictionary<string, LogLevel>(StringComparer.Ordinal);

    /// <summary>
    /// Gets console formatter options.
    /// </summary>
    public UIConsoleLogOptions Console { get; } = new();

    /// <summary>
    /// Gets rolling file logger and retention options.
    /// </summary>
    public UIFileLogOptions File { get; } = new();

    /// <summary>
    /// Enables rolling file logging with optional configuration.
    /// </summary>
    public UILoggingOptions UseFile(Action<UIFileLogOptions>? configure = null)
    {
        File.Enabled = true;
        configure?.Invoke(File);
        File.Validate();

        return this;
    }

    /// <summary>
    /// Enables rolling file logging in <paramref name="directoryPath"/> with optional configuration.
    /// </summary>
    public UILoggingOptions UseFile(string directoryPath, Action<UIFileLogOptions>? configure = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(directoryPath);

        File.DirectoryPath = directoryPath;

        return UseFile(configure);
    }

    /// <summary>
    /// Enables rolling file logging with the specified retention and optional cleanup sweep interval.
    /// </summary>
    public UILoggingOptions UseFile(TimeSpan retention, TimeSpan? cleanupInterval = null)
        => UseFile(file =>
        {
            file.Retention = retention;

            if (cleanupInterval is { } interval)
                file.CleanupInterval = interval;
        });

    /// <summary>
    /// Enables rolling file logging in <paramref name="directoryPath"/> with the specified retention and optional cleanup sweep interval.
    /// </summary>
    public UILoggingOptions UseFile(string directoryPath, TimeSpan retention, TimeSpan? cleanupInterval = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(directoryPath);

        File.DirectoryPath = directoryPath;

        return UseFile(retention, cleanupInterval);
    }

    /// <summary>
    /// Validates logging options.
    /// </summary>
    public void Validate()
    {
        if (MinimumLevel is { } minimumLevel && !Enum.IsDefined(minimumLevel))
            throw new ArgumentOutOfRangeException(nameof(MinimumLevel), minimumLevel, "Minimum log level is not a defined LogLevel value.");

        foreach (KeyValuePair<string, LogLevel> pair in CategoryLevels)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(pair.Key, nameof(CategoryLevels));

            if (!Enum.IsDefined(pair.Value))
                throw new ArgumentOutOfRangeException(nameof(CategoryLevels), pair.Value, $"Category '{pair.Key}' has an undefined LogLevel value.");
        }

        Console.Validate();
        File.Validate();
    }
}
