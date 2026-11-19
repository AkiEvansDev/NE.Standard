using System;
using System.Globalization;

namespace NE.Standard.UI.Application;

/// <summary>
/// Configures the framework's default single-line console log output.
/// </summary>
public sealed class UIConsoleLogOptions
{
    /// <summary>
    /// Gets or sets whether console log output is enabled; <see langword="null"/> leaves it to the platform (<see langword="true"/> on
    /// web and server hosts, <see langword="false"/> on desktop and test hosts).
    /// </summary>
    public bool? Enabled { get; set; }

    /// <summary>
    /// Gets or sets the timestamp pattern written inside <c>[...]</c> at the start of each line; an empty string omits the timestamp.
    /// </summary>
    public string TimestampFormat { get; set; } = "HH:mm:ss.fff";

    /// <summary>
    /// Gets or sets whether timestamps are formatted in UTC rather than the machine's local time.
    /// </summary>
    public bool UseUtcTimestamp { get; set; }

    /// <summary>
    /// Gets or sets whether the full logger category name is written rather than the short type name.
    /// </summary>
    public bool FullCategoryName { get; set; }

    /// <summary>
    /// Gets or sets whether 24-bit ANSI level colors are written when standard output is not redirected and <c>NO_COLOR</c> is unset.
    /// </summary>
    public bool UseColors { get; set; } = true;

    /// <summary>
    /// Gets or sets whether active <see cref="Microsoft.Extensions.Logging.ILogger.BeginScope{TState}"/> values are included on each line.
    /// </summary>
    public bool IncludeScopes { get; set; }

    /// <summary>
    /// Validates console logging options.
    /// </summary>
    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(TimestampFormat);
        ValidateTimestampPattern(TimestampFormat, nameof(TimestampFormat));
    }

    internal static void ValidateTimestampPattern(string pattern, string propertyName)
    {
        if (pattern.Length == 0)
            return;

        try
        {
            _ = DateTimeOffset.UtcNow.ToString(pattern, CultureInfo.InvariantCulture);
        }
        catch (FormatException exception)
        {
            throw new InvalidOperationException($"{propertyName} '{pattern}' is not a valid date and time format string.", exception);
        }
    }
}
