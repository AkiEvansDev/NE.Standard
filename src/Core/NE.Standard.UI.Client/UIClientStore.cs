using System;
using System.Text.Json;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;

namespace NE.Standard.UI.Client;

/// <summary>
/// Component-local UI preference store (<c>ne.ui:&lt;id&gt;:&lt;slot&gt;</c>), mirroring the browser's <c>client-store.ts</c>:
/// only components with an explicit authored id persist values.
/// </summary>
public sealed class UIClientStore
{
    private const string Prefix = "ne.ui:";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly CompiledView _view;
    private readonly IUIClientStorageProvider _storage;

    internal UIClientStore(CompiledView view, IUIClientStorageProvider storage)
    {
        ArgumentNullException.ThrowIfNull(view);
        ArgumentNullException.ThrowIfNull(storage);

        _view = view;
        _storage = storage;
    }

    /// <summary>Reads the stored string for <paramref name="componentId"/> and <paramref name="slot"/>, or <see langword="null"/> when unset or unauthored.</summary>
    public string? Get(string componentId, string slot)
        => TryBuildKey(componentId, slot, out var key) ? _storage.GetItem(key) : null;

    /// <summary>Reads the stored string for <paramref name="componentId"/> and <paramref name="slot"/>, or <see langword="null"/> when unset or unauthored.</summary>
    public string? Get(UIComponentId componentId, string slot)
        => TryBuildKey(componentId, slot, out var key) ? _storage.GetItem(key) : null;

    /// <summary>Reads and deserializes the JSON value stored for <paramref name="componentId"/> and <paramref name="slot"/>.</summary>
    public T? GetJson<T>(string componentId, string slot)
        => Deserialize<T>(Get(componentId, slot));

    /// <summary>Reads and deserializes the JSON value stored for <paramref name="componentId"/> and <paramref name="slot"/>.</summary>
    public T? GetJson<T>(UIComponentId componentId, string slot)
        => Deserialize<T>(Get(componentId, slot));

    private static T? Deserialize<T>(string? raw)
    {
        if (string.IsNullOrEmpty(raw))
            return default;

        try
        {
            return JsonSerializer.Deserialize<T>(raw, JsonOptions);
        }
        catch (JsonException)
        {
            return default;
        }
    }

    /// <summary>Writes <paramref name="value"/> for <paramref name="componentId"/> and <paramref name="slot"/>, or removes it when <see langword="null"/>.</summary>
    public void Set(string componentId, string slot, string? value)
    {
        if (!TryBuildKey(componentId, slot, out var key))
            return;

        if (value is null)
            _storage.RemoveItem(key);
        else
            _storage.SetItem(key, value);
    }

    /// <summary>Writes <paramref name="value"/> for <paramref name="componentId"/> and <paramref name="slot"/>, or removes it when <see langword="null"/>.</summary>
    public void Set(UIComponentId componentId, string slot, string? value)
    {
        if (!TryBuildKey(componentId, slot, out var key))
            return;

        if (value is null)
            _storage.RemoveItem(key);
        else
            _storage.SetItem(key, value);
    }

    /// <summary>Serializes and writes <paramref name="value"/> as JSON for <paramref name="componentId"/> and <paramref name="slot"/>.</summary>
    public void SetJson<T>(string componentId, string slot, T value)
        => Set(componentId, slot, value is null ? null : JsonSerializer.Serialize(value, JsonOptions));

    /// <summary>Serializes and writes <paramref name="value"/> as JSON for <paramref name="componentId"/> and <paramref name="slot"/>.</summary>
    public void SetJson<T>(UIComponentId componentId, string slot, T value)
        => Set(componentId, slot, value is null ? null : JsonSerializer.Serialize(value, JsonOptions));

    /// <summary>Removes the stored value for <paramref name="componentId"/> and <paramref name="slot"/>.</summary>
    public void Remove(string componentId, string slot)
    {
        if (TryBuildKey(componentId, slot, out var key))
            _storage.RemoveItem(key);
    }

    /// <summary>Removes the stored value for <paramref name="componentId"/> and <paramref name="slot"/>.</summary>
    public void Remove(UIComponentId componentId, string slot)
    {
        if (TryBuildKey(componentId, slot, out var key))
            _storage.RemoveItem(key);
    }

    private bool TryBuildKey(string componentId, string slot, out string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(componentId);
        ArgumentException.ThrowIfNullOrWhiteSpace(slot);

        if (_view.Graph.TryGetComponentId(componentId, out UIComponentId id))
            return TryBuildKey(id, slot, out key);

        key = string.Empty;
        return false;
    }

    private bool TryBuildKey(UIComponentId componentId, string slot, out string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(slot);

        UIComponentNode node = _view.Graph.GetRequired(componentId);

        if (!node.HasAuthoredId || string.IsNullOrWhiteSpace(node.AuthoringId))
        {
            key = string.Empty;
            return false;
        }

        key = $"{Prefix}{node.AuthoringId}:{slot}";
        return true;
    }
}
