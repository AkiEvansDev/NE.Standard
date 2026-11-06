using System;
using System.Collections.Concurrent;

namespace NE.Standard.UI.Client;

/// <summary>Provides key-value persistence for component-local client state (<see cref="UIClientStore"/>).</summary>
public interface IUIClientStorageProvider
{
    /// <summary>Reads the stored string for <paramref name="key"/>, or <see langword="null"/> when unset.</summary>
    string? GetItem(string key);

    /// <summary>Writes <paramref name="value"/> under <paramref name="key"/>.</summary>
    void SetItem(string key, string value);

    /// <summary>Removes any stored value under <paramref name="key"/>.</summary>
    void RemoveItem(string key);
}

/// <summary>In-memory implementation of <see cref="IUIClientStorageProvider"/>.</summary>
public sealed class InMemoryUIClientStorageProvider : IUIClientStorageProvider
{
    private readonly ConcurrentDictionary<string, string> _items = new(StringComparer.Ordinal);

    /// <inheritdoc />
    public string? GetItem(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return _items.TryGetValue(key, out var value) ? value : null;
    }

    /// <inheritdoc />
    public void SetItem(string key, string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentNullException.ThrowIfNull(value);

        _items[key] = value;
    }

    /// <inheritdoc />
    public void RemoveItem(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        _ = _items.TryRemove(key, out _);
    }
}
