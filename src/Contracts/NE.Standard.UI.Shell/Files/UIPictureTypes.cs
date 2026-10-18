using System;

namespace NE.Standard.UI.Shell.Files;

/// <summary>
/// What a picture file is, read off its first bytes rather than taken from its name or from what the browser said, and the
/// extension it is saved under.
/// </summary>
public static class UIPictureTypes
{
    /// <summary>
    /// The media type the first bytes say — PNG, JPEG, GIF, WebP or BMP — or null for a file that is none of them: an SVG among
    /// them, which would run its own script where the pictures are served. A caller narrower than these refuses the rest itself.
    /// </summary>
    public static string? Sniff(ReadOnlySpan<byte> bytes)
    {
        if (bytes.StartsWith((ReadOnlySpan<byte>)[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))
            return "image/png";

        if (bytes.StartsWith((ReadOnlySpan<byte>)[0xFF, 0xD8, 0xFF]))
            return "image/jpeg";

        if (bytes.StartsWith("GIF87a"u8) || bytes.StartsWith("GIF89a"u8))
            return "image/gif";

        if (bytes.Length >= 12 && bytes.StartsWith("RIFF"u8) && bytes[8..12].SequenceEqual("WEBP"u8))
            return "image/webp";

        return bytes.Length >= 26 && bytes.StartsWith("BM"u8) ? "image/bmp" : null;
    }

    /// <summary>The extension a picture of a media type is saved under; PNG's for a type none of these.</summary>
    public static string ExtensionOf(string contentType)
        => contentType switch
        {
            "image/jpeg" => ".jpg",
            "image/webp" => ".webp",
            "image/gif" => ".gif",
            "image/bmp" => ".bmp",
            _ => ".png"
        };
}
