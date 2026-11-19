using System;
using System.Drawing;
using System.Globalization;
using System.IO;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Logging.Console;
using Microsoft.Extensions.Options;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Application;
using NE.Standard.UI.Logging;

namespace NE.Standard.UI.Web.Logging;

internal sealed class UIConsoleFormatter(IOptionsMonitor<SimpleConsoleFormatterOptions> formatterOptions, IServiceProvider services) : ConsoleFormatter(FormatterName)
{
    public const string FormatterName = "ne.standard";

    private const string ResetAnsi = "\x1b[0m";

    private static readonly UIConsoleLogOptions DefaultConsoleOptions = new();
    private static readonly UIColorPalette DarkPalette = new();
    private static readonly string MutedAnsi = Foreground(140, 140, 140);
    private static readonly string TraceAnsi = Foreground(108, 108, 108);
    private static readonly string DebugAnsi = Foreground(DarkPalette.AccentInk.ToColor());
    private static readonly string InfoAnsi = Foreground(DarkPalette.PrimaryInk.ToColor());
    private static readonly string WarningAnsi = Foreground(DarkPalette.WarningInk.ToColor());
    private static readonly string ErrorAnsi = Foreground(DarkPalette.DangerInk.ToColor());
    private static readonly string CriticalAnsi = Badge(DarkPalette.OnDanger.ToColor(), DarkPalette.Danger.ToColor());

    private readonly UIConsoleLogOptions _consoleOptions = services.GetService<UILoggingOptions>()?.Console ?? DefaultConsoleOptions;
    private readonly TimeProvider _timeProvider = services.GetService<TimeProvider>() ?? TimeProvider.System;

    public override void Write<TState>(in LogEntry<TState> logEntry, IExternalScopeProvider? scopeProvider, TextWriter textWriter)
    {
        ArgumentNullException.ThrowIfNull(textWriter);

        var message = logEntry.Formatter?.Invoke(logEntry.State, logEntry.Exception);

        if (string.IsNullOrEmpty(message) && logEntry.Exception is null)
            return;

        SimpleConsoleFormatterOptions hostOptions = formatterOptions.CurrentValue;
        var useColors = ShouldUseColors(_consoleOptions, hostOptions.ColorBehavior);
        var useUtc = _consoleOptions.UseUtcTimestamp || hostOptions.UseUtcTimestamp;
        var includeScopes = _consoleOptions.IncludeScopes || hostOptions.IncludeScopes;
        var timestampFormat = _consoleOptions.TimestampFormat;
        DateTimeOffset timestamp = useUtc ? _timeProvider.GetUtcNow() : _timeProvider.GetLocalNow();

        if (timestampFormat.Length > 0)
        {
            if (useColors)
                textWriter.Write(MutedAnsi);

            textWriter.Write('[');
            UILogLineFormatter.WriteTimestamp(textWriter, timestamp, timestampFormat);
            textWriter.Write(']');

            if (useColors)
                textWriter.Write(ResetAnsi);

            textWriter.Write(' ');
        }

        if (useColors)
            textWriter.Write(GetLevelAnsi(logEntry.LogLevel));

        textWriter.Write('[');
        textWriter.Write(UILogLineFormatter.GetLevelTag(logEntry.LogLevel));
        textWriter.Write(']');

        if (useColors)
            textWriter.Write(ResetAnsi);

        textWriter.Write(' ');

        if (useColors)
            textWriter.Write(MutedAnsi);

        textWriter.Write(UILogLineFormatter.TrimCategory(logEntry.Category, _consoleOptions.FullCategoryName));

        if (includeScopes && scopeProvider is not null)
            UILogLineFormatter.WriteScopes(textWriter, scopeProvider);

        textWriter.Write(':');

        if (useColors)
            textWriter.Write(ResetAnsi);

        textWriter.Write(' ');

        if (!string.IsNullOrEmpty(message))
        {
            textWriter.WriteLine(message);

            if (logEntry.Exception is not null)
                WriteException(textWriter, logEntry.Exception, useColors);
        }
        else if (logEntry.Exception is not null)
        {
            WriteException(textWriter, logEntry.Exception, useColors);
        }
    }

    internal static bool ShouldUseColors(UIConsoleLogOptions consoleOptions, LoggerColorBehavior colorBehavior)
    {
        if (!consoleOptions.UseColors || colorBehavior == LoggerColorBehavior.Disabled)
            return false;

        if (colorBehavior == LoggerColorBehavior.Enabled)
            return true;

        return !Console.IsOutputRedirected && string.IsNullOrEmpty(Environment.GetEnvironmentVariable("NO_COLOR"));
    }

    internal static string GetLevelAnsi(LogLevel logLevel)
        => logLevel switch
        {
            LogLevel.Trace => TraceAnsi,
            LogLevel.Debug => DebugAnsi,
            LogLevel.Information => InfoAnsi,
            LogLevel.Warning => WarningAnsi,
            LogLevel.Error => ErrorAnsi,
            LogLevel.Critical => CriticalAnsi,
            _ => MutedAnsi
        };

    private static void WriteException(TextWriter textWriter, Exception exception, bool useColors)
    {
        var text = exception.ToString();

        if (!useColors)
        {
            textWriter.WriteLine(text);

            return;
        }

        foreach (ReadOnlySpan<char> line in text.AsSpan().EnumerateLines())
        {
            if (line.IsEmpty)
            {
                textWriter.WriteLine();
                continue;
            }

            var ansi = IsStackFrameOrBoundary(line) ? MutedAnsi : ErrorAnsi;
            textWriter.Write(ansi);
            textWriter.Write(line);
            textWriter.Write(ResetAnsi);
            textWriter.WriteLine();
        }
    }

    private static bool IsStackFrameOrBoundary(ReadOnlySpan<char> line)
    {
        ReadOnlySpan<char> trimmed = line.TrimStart();

        return trimmed.StartsWith("at ", StringComparison.Ordinal)
            || trimmed.StartsWith("--- ", StringComparison.Ordinal);
    }

    private static string Foreground(Color color)
        => Foreground(color.R, color.G, color.B);

    private static string Foreground(byte r, byte g, byte b)
        => string.Create(CultureInfo.InvariantCulture, $"\x1b[38;2;{r};{g};{b}m");

    private static string Badge(Color foreground, Color background)
        => string.Create(CultureInfo.InvariantCulture, $"\x1b[1;38;2;{foreground.R};{foreground.G};{foreground.B};48;2;{background.R};{background.G};{background.B}m");
}
