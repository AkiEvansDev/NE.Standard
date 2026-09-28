using System;

namespace NE.Standard.UI.Shell.Files;

/// <summary>
/// The default <see cref="IUIContentAddressResolver"/>: a fixed prefix the platform's startup gives it once, at
/// registration.
/// </summary>
public sealed class UIContentAddress : IUIContentAddressResolver
{
    private readonly string _prefix;

    /// <summary>
    /// Creates a resolver serving content under <paramref name="prefix"/> — a path on the web, or whatever the
    /// platform's own transport calls an address.
    /// </summary>
    public UIContentAddress(string prefix)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(prefix);

        _prefix = prefix.TrimEnd('/');
    }

    /// <inheritdoc />
    public string AddressOf(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        // Each segment on its own: an escaped slash is a path a server does not unescape, so a key that holds one would never
        // come back as itself.
        var segments = key.Split('/');

        for (var i = 0; i < segments.Length; i++)
            segments[i] = Uri.EscapeDataString(segments[i]);

        return $"{_prefix}/{string.Join('/', segments)}";
    }
}
