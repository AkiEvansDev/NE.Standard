using System;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;

namespace NE.Standard.UI.Application;

/// <summary>
/// Where the framework writes for one application when the application names no folder of its own.
/// </summary>
internal static class UIApplicationStorage
{
    private const int MaxSegmentLength = 80;

    /// <summary>
    /// A folder under <paramref name="area"/> in the temp folder, named for the entry assembly and the folder it runs from.
    /// </summary>
    /// <remarks>
    /// The temp folder, since the application's own may be read-only (a container, run-from-package, an IIS pool without write
    /// rights); one per application, so two on one machine never share what they write or sweep each other's.
    /// </remarks>
    public static string TempDirectory(string area)
        => TempDirectory(area, Assembly.GetEntryAssembly()?.GetName().Name ?? "application", AppContext.BaseDirectory);

    /// <inheritdoc cref="TempDirectory(string)" />
    public static string TempDirectory(string area, string applicationName, string baseDirectory)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(area);
        ArgumentException.ThrowIfNullOrWhiteSpace(applicationName);
        ArgumentNullException.ThrowIfNull(baseDirectory);

        var location = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(baseDirectory)));

        return Path.Combine(Path.GetTempPath(), area, string.Create(CultureInfo.InvariantCulture, $"{ToSegment(applicationName, "application")}-{location[..12]}"));
    }

    /// <summary>
    /// A name as one folder name: ASCII letters, digits, '-', '_' and '.' kept, anything else a '-', at most eighty characters;
    /// <paramref name="fallback"/> when nothing is left.
    /// </summary>
    public static string ToSegment(string name, string fallback)
    {
        ArgumentNullException.ThrowIfNull(name);

        StringBuilder builder = new(name.Length);

        for (var i = 0; i < name.Length; i++)
        {
            var ch = name[i];

            _ = builder.Append(char.IsAsciiLetterOrDigit(ch) || ch is '-' or '_' or '.' ? ch : '-');
        }

        if (builder.Length == 0)
            return fallback;

        return builder.Length <= MaxSegmentLength
            ? builder.ToString()
            : builder.ToString(0, MaxSegmentLength);
    }
}
