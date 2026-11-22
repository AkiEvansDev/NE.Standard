using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using Microsoft.Extensions.Logging;

namespace NE.Standard.UI.Logging;

/// <summary>
/// Formats single-line log entries shared by the framework's console and rolling file loggers.
/// </summary>
public static class UILogLineFormatter
{
    private const int MaxRetainedBuilderCapacity = 4096;

    [ThreadStatic]
    private static StringBuilder? _sharedBuilder;

    /// <summary>
    /// Formats a plain-text single-line log entry with bracketed timestamp, 3-letter level tag, category, optional scopes, and exception.
    /// </summary>
    public static string FormatPlainEntry(DateTimeOffset timestamp, string timestampFormat, LogLevel logLevel, string category, bool fullCategoryName, IExternalScopeProvider? scopeProvider, bool includeScopes, string? message, Exception? exception)
    {
        ArgumentNullException.ThrowIfNull(timestampFormat);
        ArgumentNullException.ThrowIfNull(category);

        StringBuilder builder = AcquireBuilder();

        try
        {
            if (timestampFormat.Length > 0)
            {
                _ = builder.Append('[');
                AppendTimestamp(builder, timestamp, timestampFormat);
                _ = builder.Append("] ");
            }

            _ = builder.Append('[').Append(GetLevelTag(logLevel)).Append("] ");
            _ = builder.Append(TrimCategory(category, fullCategoryName));

            if (includeScopes && scopeProvider is not null)
                AppendScopes(builder, scopeProvider);

            _ = builder.Append(": ");

            if (!string.IsNullOrEmpty(message))
            {
                _ = builder.Append(message);

                if (exception is not null)
                    _ = builder.AppendLine().Append(exception);
            }
            else if (exception is not null)
            {
                _ = builder.Append(exception);
            }

            return builder.ToString();
        }
        finally
        {
            ReleaseBuilder(builder);
        }
    }

    private static StringBuilder AcquireBuilder()
    {
        StringBuilder? builder = _sharedBuilder;

        if (builder is null)
            return new StringBuilder(256);

        _sharedBuilder = null;
        _ = builder.Clear();

        return builder;
    }

    private static void ReleaseBuilder(StringBuilder builder)
    {
        if (builder.Capacity <= MaxRetainedBuilderCapacity)
            _sharedBuilder = builder;
    }

    private static void AppendTimestamp(StringBuilder builder, DateTimeOffset timestamp, string timestampFormat)
    {
        Span<char> buffer = stackalloc char[64];

        if (timestamp.TryFormat(buffer, out var charsWritten, timestampFormat, CultureInfo.InvariantCulture))
            _ = builder.Append(buffer[..charsWritten]);
        else
            _ = builder.Append(timestamp.ToString(timestampFormat, CultureInfo.InvariantCulture));
    }

    /// <summary>
    /// Writes <paramref name="timestamp"/> formatted with <paramref name="timestampFormat"/> in invariant culture into <paramref name="writer"/>.
    /// </summary>
    public static void WriteTimestamp(TextWriter writer, DateTimeOffset timestamp, string timestampFormat)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(timestampFormat);

        Span<char> buffer = stackalloc char[64];

        if (timestamp.TryFormat(buffer, out var charsWritten, timestampFormat, CultureInfo.InvariantCulture))
            writer.Write(buffer[..charsWritten]);
        else
            writer.Write(timestamp.ToString(timestampFormat, CultureInfo.InvariantCulture));
    }

    /// <summary>
    /// Returns the 3-character uppercase badge text for <paramref name="logLevel"/>.
    /// </summary>
    public static string GetLevelTag(LogLevel logLevel)
        => logLevel switch
        {
            LogLevel.Trace => "TRC",
            LogLevel.Debug => "DBG",
            LogLevel.Information => "INF",
            LogLevel.Warning => "WRN",
            LogLevel.Error => "ERR",
            LogLevel.Critical => "CRT",
            _ => "NON"
        };

    /// <summary>
    /// Returns either <paramref name="category"/> whole or its short type segment without namespace or generic arguments.
    /// </summary>
    public static ReadOnlySpan<char> TrimCategory(string category, bool fullCategoryName)
    {
        if (fullCategoryName || string.IsNullOrEmpty(category))
            return category.AsSpan();

        ReadOnlySpan<char> span = category.AsSpan();

        if (span.IndexOfAny('[', '<', '`') < 0)
        {
            var dot = span.LastIndexOf('.');

            return dot >= 0 && dot + 1 < span.Length ? span[(dot + 1)..] : span;
        }

        return TrimGenericCategory(span);
    }

    private static ReadOnlySpan<char> TrimGenericCategory(ReadOnlySpan<char> span)
    {
        var depth = 0;
        var lastOuterDot = -1;

        for (var i = 0; i < span.Length; i++)
        {
            var ch = span[i];
            if (ch is '[' or '<')
                depth++;
            else if (ch is ']' or '>' && depth > 0)
                depth--;
            else if (ch == '.' && depth == 0)
                lastOuterDot = i;
        }

        if (depth != 0)
        {
            var fallbackDot = span.LastIndexOf('.');

            return fallbackDot >= 0 && fallbackDot + 1 < span.Length ? span[(fallbackDot + 1)..] : span;
        }

        ReadOnlySpan<char> tail = lastOuterDot >= 0 && lastOuterDot + 1 < span.Length ? span[(lastOuterDot + 1)..] : span;
        var firstGenericMarker = tail.IndexOfAny('[', '<', '`');

        if (firstGenericMarker < 0)
            return tail;

        StringBuilder trimmed = new(tail.Length);

        for (var i = 0; i < tail.Length; i++)
        {
            var ch = tail[i];

            if (ch is '[' or '<')
            {
                var nestedDepth = 1;
                while (i + 1 < tail.Length && nestedDepth > 0)
                {
                    i++;
                    if (tail[i] is '[' or '<')
                        nestedDepth++;
                    else if (tail[i] is ']' or '>')
                        nestedDepth--;
                }

                continue;
            }

            if (ch == '`')
            {
                while (i + 1 < tail.Length && char.IsAsciiDigit(tail[i + 1]))
                    i++;

                continue;
            }

            _ = trimmed.Append(ch);
        }

        return trimmed.Length > 0 ? trimmed.ToString().AsSpan() : tail;
    }

    private static void AppendScopes(StringBuilder builder, IExternalScopeProvider scopeProvider)
    {
        scopeProvider.ForEachScope(static (scope, target) =>
        {
            var text = FormatScopeValue(scope);

            if (!string.IsNullOrEmpty(text))
                _ = target.Append(" => ").Append(text);
        }, builder);
    }

    /// <summary>
    /// Appends active scopes from <paramref name="scopeProvider"/> into <paramref name="writer"/> separated by <c> =&gt; </c>.
    /// </summary>
    public static void WriteScopes(TextWriter writer, IExternalScopeProvider scopeProvider)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(scopeProvider);

        scopeProvider.ForEachScope(static (scope, target) =>
        {
            var text = FormatScopeValue(scope);

            if (!string.IsNullOrEmpty(text))
            {
                target.Write(" => ");
                target.Write(text);
            }
        }, writer);
    }

    private static string? FormatScopeValue(object? scope)
    {
        if (scope is null)
            return null;

        if (scope is string text)
            return text;

        if (scope is IEnumerable<KeyValuePair<string, object?>> pairs and not IReadOnlyList<KeyValuePair<string, object?>>)
        {
            StringBuilder builder = new();

            foreach (KeyValuePair<string, object?> pair in pairs)
            {
                if (string.Equals(pair.Key, "{OriginalFormat}", StringComparison.Ordinal))
                    continue;

                if (builder.Length > 0)
                    _ = builder.Append(", ");

                _ = builder.Append(pair.Key).Append('=').Append(Convert.ToString(pair.Value, CultureInfo.InvariantCulture));
            }

            return builder.ToString();
        }

        return Convert.ToString(scope, CultureInfo.InvariantCulture);
    }
}
