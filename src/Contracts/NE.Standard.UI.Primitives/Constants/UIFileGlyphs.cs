using System;
using System.Collections.Frozen;
using System.Collections.Generic;

namespace NE.Standard.UI.Primitives.Constants;

/// <summary>
/// The <see cref="UIGlyphs"/> mark a file is shown by — a PDF, text, a document, a spreadsheet, slides, an archive, audio, video, a
/// picture, code, or a blank page for anything else — as an image input's shelf draws a file's square.
/// </summary>
/// <remarks>
/// The extension decides first, since a browser guesses the type from it anyway and guesses wrong (<c>.ts</c> as a video); the MIME
/// type where the extension says nothing. The client's <c>file-glyphs.ts</c> is the same table.
/// </remarks>
public static class UIFileGlyphs
{
    private static readonly FrozenDictionary<string, string> ByExtension = Kinds(
        (UIGlyphs.PictureAsPdf, ["pdf"]),
        (UIGlyphs.TextSnippet, ["txt", "md", "log"]),
        (UIGlyphs.Description, ["doc", "docx", "odt", "rtf"]),
        (UIGlyphs.TableChart, ["xls", "xlsx", "ods", "csv", "tsv"]),
        (UIGlyphs.Slideshow, ["ppt", "pptx", "odp", "key"]),
        (UIGlyphs.FolderZip, ["zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"]),
        (UIGlyphs.AudioFile, ["mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"]),
        (UIGlyphs.VideoFile, ["mp4", "m4v", "mov", "avi", "mkv", "webm"]),
        (UIGlyphs.Image, ["png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"]),
        (UIGlyphs.Code, ["json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1"])
    );

    private static readonly FrozenDictionary<string, string> ByType = new Dictionary<string, string>(StringComparer.Ordinal)
    {
        ["application/pdf"] = UIGlyphs.PictureAsPdf,
        ["text/csv"] = UIGlyphs.TableChart,
        ["application/msword"] = UIGlyphs.Description,
        ["application/rtf"] = UIGlyphs.Description,
        ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] = UIGlyphs.Description,
        ["application/vnd.oasis.opendocument.text"] = UIGlyphs.Description,
        ["application/vnd.ms-excel"] = UIGlyphs.TableChart,
        ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"] = UIGlyphs.TableChart,
        ["application/vnd.oasis.opendocument.spreadsheet"] = UIGlyphs.TableChart,
        ["application/vnd.ms-powerpoint"] = UIGlyphs.Slideshow,
        ["application/vnd.openxmlformats-officedocument.presentationml.presentation"] = UIGlyphs.Slideshow,
        ["application/vnd.oasis.opendocument.presentation"] = UIGlyphs.Slideshow,
        ["application/zip"] = UIGlyphs.FolderZip,
        ["application/x-zip-compressed"] = UIGlyphs.FolderZip,
        ["application/x-7z-compressed"] = UIGlyphs.FolderZip,
        ["application/vnd.rar"] = UIGlyphs.FolderZip,
        ["application/x-rar-compressed"] = UIGlyphs.FolderZip,
        ["application/x-tar"] = UIGlyphs.FolderZip,
        ["application/gzip"] = UIGlyphs.FolderZip,
        ["application/json"] = UIGlyphs.Code,
        ["application/xml"] = UIGlyphs.Code,
        ["text/xml"] = UIGlyphs.Code,
        ["text/html"] = UIGlyphs.Code
    }.ToFrozenDictionary(StringComparer.Ordinal);

    /// <summary>The families a type's first half names, once no whole type has said.</summary>
    private static readonly FrozenDictionary<string, string> ByFamily = new Dictionary<string, string>(StringComparer.Ordinal)
    {
        ["image"] = UIGlyphs.Image,
        ["audio"] = UIGlyphs.AudioFile,
        ["video"] = UIGlyphs.VideoFile,
        ["text"] = UIGlyphs.TextSnippet
    }.ToFrozenDictionary(StringComparer.Ordinal);

    /// <summary>The glyph for a file by its name and MIME type, either of which may be missing.</summary>
    public static string For(string? fileName, string? contentType)
    {
        var name = fileName ?? string.Empty;
        var dot = name.LastIndexOf('.');

        if (dot >= 0 && ByExtension.TryGetValue(name[(dot + 1)..].ToLowerInvariant(), out var byExtension))
            return byExtension;

        var type = contentType ?? string.Empty;
        var semicolon = type.IndexOf(';', StringComparison.Ordinal);
        var mime = (semicolon < 0 ? type : type[..semicolon]).Trim().ToLowerInvariant();

        if (ByType.TryGetValue(mime, out var byType))
            return byType;

        var slash = mime.IndexOf('/', StringComparison.Ordinal);

        return slash >= 0 && ByFamily.TryGetValue(mime[..slash], out var byFamily) ? byFamily : UIGlyphs.Draft;
    }

    private static FrozenDictionary<string, string> Kinds(params (string Glyph, string[] Extensions)[] kinds)
    {
        Dictionary<string, string> table = new(StringComparer.Ordinal);

        foreach ((var glyph, var extensions) in kinds)
        {
            foreach (var extension in extensions)
                table[extension] = glyph;
        }

        return table.ToFrozenDictionary(StringComparer.Ordinal);
    }
}
