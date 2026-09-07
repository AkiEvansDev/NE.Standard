using System;
using System.Text;

namespace NE.Standard.UI.Web.Abstractions.Theming;

/// <summary>
/// What one icon string means: a glyph name from a registered pack, or a picture behind a URL.
/// </summary>
public static class WebIconValue
{
    /// <summary>Asks for the tinted form of a picture: masked with <c>currentColor</c>, like a glyph.</summary>
    public const string MaskPrefix = "mask:";

    /// <summary>The class an untinted picture wears; a glyph and a tinted picture wear none of their own.</summary>
    public const string ImageClassName = "ui-icon--image";

    /// <summary>The slot both modes fill — a pack writes it per glyph class, a picture inline.</summary>
    public const string ImageSourceProperty = "--ui-icon-url";

    /// <summary>
    /// Reads an icon value as a picture; false for a glyph name or an unsupported scheme.
    /// </summary>
    public static bool TryReadImage(string? value, out string source, out bool tinted)
    {
        source = string.Empty;
        tinted = false;

        if (string.IsNullOrWhiteSpace(value))
            return false;

        ReadOnlySpan<char> candidate = value.AsSpan().Trim();

        if (candidate.StartsWith(MaskPrefix, StringComparison.Ordinal))
        {
            tinted = true;
            candidate = candidate[MaskPrefix.Length..].Trim();
        }

        if (!IsAllowedSource(candidate))
        {
            tinted = false;
            return false;
        }

        source = candidate.ToString();
        return true;
    }

    /// <summary>
    /// The CSS for <c>--ui-icon-url</c>, quoted and escaped so nothing in the source can end the declaration or the attribute.
    /// </summary>
    public static string ImageSourceCss(string source)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(source);

        StringBuilder builder = new("url(\"");

        foreach (var c in source)
        {
            // Percent-encoded rather than backslash-escaped, so the result survives CSS parsing and HTML attribute escaping unchanged.
            _ = c switch
            {
                '"' => builder.Append("%22"),
                '\'' => builder.Append("%27"),
                '\\' => builder.Append("%5C"),
                '(' => builder.Append("%28"),
                ')' => builder.Append("%29"),
                '<' => builder.Append("%3C"),
                '>' => builder.Append("%3E"),
                _ => char.IsControl(c) || c == ' ' ? builder.Append("%20") : builder.Append(c)
            };
        }

        return builder.Append("\")").ToString();
    }

    /// <summary>
    /// Whether a string may be safely rendered as an image source — an <c>img src</c> or a CSS <c>url()</c>.
    /// </summary>
    public static bool IsAllowedSource(string? value)
        => !string.IsNullOrEmpty(value) && IsAllowedSource(value.AsSpan());

    private static bool IsAllowedSource(ReadOnlySpan<char> value)
    {
        if (value.IsEmpty)
            return false;

        // `data:` is narrowed to images, since a blanket `data:` would carry whatever an author was handed by a third party.
        if (value[0] == '/')
            return value.Length > 1 && value[1] != '/';

        return value.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
            || value.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
            || value.StartsWith("data:image/", StringComparison.OrdinalIgnoreCase);
    }
}
