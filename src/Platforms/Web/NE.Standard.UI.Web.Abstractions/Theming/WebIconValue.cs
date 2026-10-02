using System;
using System.Buffers;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Abstractions.Theming;

/// <summary>
/// What one icon string means: a glyph name from a registered pack, or a picture behind a URL.
/// </summary>
public static class WebIconValue
{
    /// <summary>Asks for the tinted form of a picture: masked with <c>currentColor</c>, like a glyph.</summary>
    public const string MaskPrefix = "mask:";

    /// <summary>The class an untinted picture wears: painted as it is.</summary>
    public const string ImageClassName = "ui-icon--image";

    /// <summary>The class a tinted picture wears: the one form <c>.ui-icon::before</c> paints, a mask filled with the text colour.</summary>
    public const string MaskClassName = "ui-icon--mask";

    /// <summary>The slot a picture fills, inline on the element.</summary>
    public const string ImageSourceProperty = "--ui-icon-url";

    // The characters a glyph class keeps; a name with none of them names no glyph (WebIconClassName.FromIconName).
    private static readonly SearchValues<char> GlyphCharacters = SearchValues.Create("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");

    /// <summary>
    /// The class an icon value wears — a glyph's, or a picture's form — or empty for a value that names nothing; mirrors
    /// <c>toIconClassName</c> in <c>icon-value.ts</c>, which trims the value first too.
    /// </summary>
    public static string ClassName(string? value)
    {
        if (TryReadImageSource(value, out _, out var tinted))
            return tinted ? MaskClassName : ImageClassName;

        // Nothing rather than a refusal: the value may be data (an emoji, a stray symbol), and data must not fail the page.
        return value is not null && value.AsSpan().ContainsAny(GlyphCharacters) ? WebIconClassName.FromIconName(value.Trim()) : string.Empty;
    }

    /// <summary><see cref="TryReadImage"/> over the value's own characters, so a caller that needs no source text allocates none.</summary>
    private static bool TryReadImageSource(string? value, out ReadOnlySpan<char> source, out bool tinted)
    {
        source = default;
        tinted = false;

        if (string.IsNullOrWhiteSpace(value))
            return false;

        ReadOnlySpan<char> candidate = value.AsSpan().Trim();

        if (candidate.StartsWith(MaskPrefix, StringComparison.Ordinal))
        {
            tinted = true;
            candidate = candidate[MaskPrefix.Length..].Trim();
        }

        // A picture of an icon names a folder or a scheme, so it holds a slash; a bare word is a glyph's name, never a file beside the page.
        if (!candidate.Contains('/') || !WebUrlSafety.TryReadImageSource(candidate, out source))
        {
            tinted = false;
            return false;
        }

        return true;
    }

    /// <summary>
    /// Whether an icon value names something to draw — a glyph name with a letter or digit (whether or not a pack draws it), or a
    /// picture the page may load: <see cref="ClassName"/> answering a class, without building it.
    /// </summary>
    public static bool Names([NotNullWhen(true)] string? value)
        => value is not null && (value.AsSpan().ContainsAny(GlyphCharacters) || TryReadImageSource(value, out _, out _));

    /// <summary>
    /// Reads an icon value as a picture; false for a glyph name or an unsupported scheme.
    /// </summary>
    public static bool TryReadImage(string? value, out string source, out bool tinted)
    {
        var image = TryReadImageSource(value, out ReadOnlySpan<char> candidate, out tinted);

        source = image ? candidate.ToString() : string.Empty;
        return image;
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
    /// Whether a string may be safely rendered as an image source — an <c>img src</c> or a CSS <c>url()</c>; the rule is
    /// <see cref="WebUrlSafety.IsSafeImageSource"/>.
    /// </summary>
    public static bool IsAllowedSource(string? value)
        => WebUrlSafety.IsSafeImageSource(value);
}
