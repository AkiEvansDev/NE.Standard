using System;

namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Represents an inserted, removed, or replaced collection item.
/// </summary>
public sealed class ServerCollectionItemChange
{
    /// <summary>
    /// Gets the item index, when the item is addressed by index.
    /// </summary>
    public int? Index { get; init; }

    /// <summary>
    /// Gets the item key, when the item is addressed by key.
    /// </summary>
    public string? Key { get; init; }

    /// <summary>
    /// Gets the previous item key for replace changes.
    /// </summary>
    public string? OldKey { get; init; }

    /// <summary>
    /// Gets the item value.
    /// </summary>
    public object? Item { get; init; }

    /// <summary>
    /// Validates the collection item change.
    /// </summary>
    public void Validate()
    {
        if (Index is < 0)
            throw new ArgumentOutOfRangeException(nameof(Index), Index, "Index cannot be negative.");

        if (Key is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(Key);

        if (OldKey is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(OldKey);
    }
}
