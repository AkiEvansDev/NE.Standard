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

        return $"{_prefix}/{Uri.EscapeDataString(key)}";
    }
}
