using System;
using System.IO;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using NE.Standard.UI.Application;

namespace NE.Standard.UI.Desktop.Hosting;

internal static class DesktopIconLoader
{
    private const string EmbeddedDefaultIcon = "NE.Standard.UI.Desktop.Assets.icon.ico";

    private static readonly Lazy<byte[]> DefaultIconBytes = new(LoadEmbeddedDefaultBytes);

    public static ImageSource? Resolve(DesktopWebHost host)
    {
        ArgumentNullException.ThrowIfNull(host);

        var icon = host.ActiveIcon;
        if (string.IsNullOrWhiteSpace(icon))
            return CreateDefaultIcon();

        if (string.Equals(icon, UIApplication.NoIcon, StringComparison.Ordinal))
            return null;

        if (icon.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
            return TryLoadDataUri(icon) ?? CreateDefaultIcon();

        if (icon.StartsWith("pack://", StringComparison.OrdinalIgnoreCase))
            return TryLoadPackUri(icon) ?? CreateDefaultIcon();

        return TryLoadFile(icon, host.WebRootPath, host.ContentRootPath) ?? CreateDefaultIcon();
    }

    // Created on the window's STA thread because BitmapFrame.Decoder (IconBitmapDecoder) is a DispatcherObject read during Window.Show().
    private static BitmapFrame CreateDefaultIcon()
        => BitmapFrame.Create(new MemoryStream(DefaultIconBytes.Value, writable: false));

    private static byte[] LoadEmbeddedDefaultBytes()
    {
        using Stream stream = typeof(DesktopIconLoader).Assembly.GetManifestResourceStream(EmbeddedDefaultIcon)
            ?? throw new InvalidOperationException($"Embedded desktop icon resource '{EmbeddedDefaultIcon}' was not found.");

        using MemoryStream buffer = new();
        stream.CopyTo(buffer);
        return buffer.ToArray();
    }

    private static BitmapFrame? TryLoadDataUri(string dataUri)
    {
        const string marker = ";base64,";
        var index = dataUri.IndexOf(marker, StringComparison.OrdinalIgnoreCase);
        if (index < 0 || dataUri.StartsWith("data:image/svg+xml", StringComparison.OrdinalIgnoreCase))
            return null;

        try
        {
            var bytes = Convert.FromBase64String(dataUri[(index + marker.Length)..]);
            return TryLoadBytes(bytes);
        }
        catch (FormatException)
        {
            return null;
        }
    }

    private static BitmapFrame? TryLoadPackUri(string packUri)
    {
        try
        {
            return BitmapFrame.Create(new Uri(packUri, UriKind.Absolute));
        }
        catch (Exception exception) when (exception is UriFormatException or IOException or NotSupportedException)
        {
            return null;
        }
    }

    private static BitmapFrame? TryLoadFile(string spec, string webRootPath, string contentRootPath)
    {
        var queryIndex = spec.IndexOf('?', StringComparison.Ordinal);
        var clean = queryIndex >= 0 ? spec[..queryIndex] : spec;

        if (Path.IsPathFullyQualified(clean))
            return TryLoadResolvedPath(clean);

        var relative = clean.TrimStart('/', '\\').Replace('/', Path.DirectorySeparatorChar);
        if (relative.Length == 0)
            return null;

        return TryLoadResolvedPath(Path.Combine(webRootPath, relative))
            ?? TryLoadResolvedPath(Path.Combine(contentRootPath, relative));
    }

    private static BitmapFrame? TryLoadResolvedPath(string path)
    {
        if (path.EndsWith(".svg", StringComparison.OrdinalIgnoreCase))
        {
            var icoSibling = Path.ChangeExtension(path, ".ico");
            if (File.Exists(icoSibling) && TryReadAndDecode(icoSibling) is { } ico)
                return ico;

            var pngSibling = Path.ChangeExtension(path, ".png");
            return File.Exists(pngSibling) ? TryReadAndDecode(pngSibling) : null;
        }

        return File.Exists(path) ? TryReadAndDecode(path) : null;
    }

    private static BitmapFrame? TryReadAndDecode(string path)
    {
        try
        {
            return TryLoadBytes(File.ReadAllBytes(path));
        }
        catch (IOException)
        {
            return null;
        }
        catch (UnauthorizedAccessException)
        {
            return null;
        }
    }

    private static BitmapFrame? TryLoadBytes(byte[] bytes)
    {
        if (bytes.Length == 0)
            return null;

        try
        {
            return BitmapFrame.Create(new MemoryStream(bytes, writable: false));
        }
        catch (NotSupportedException)
        {
            return null;
        }
        catch (FileFormatException)
        {
            return null;
        }
    }
}
