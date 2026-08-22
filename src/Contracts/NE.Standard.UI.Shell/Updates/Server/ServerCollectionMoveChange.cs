using System;

namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Represents a moved collection item.
/// </summary>
public sealed class ServerCollectionMoveChange
{
    /// <summary>
    /// Gets the previous item index, when addressed by index.
    /// </summary>
    public int? OldIndex { get; init; }

    /// <summary>
    /// Gets the new item index.
    /// </summary>
    public int? NewIndex { get; init; }

    /// <summary>
    /// Gets the moved item key, when addressed by key.
    /// </summary>
    public string? Key { get; init; }

    /// <summary>
    /// Validates the collection move change.
    /// </summary>
    public void Validate()
    {
        if (OldIndex is < 0)
            throw new ArgumentOutOfRangeException(nameof(OldIndex), OldIndex, "Old index cannot be negative.");

        if (NewIndex is < 0)
            throw new ArgumentOutOfRangeException(nameof(NewIndex), NewIndex, "New index cannot be negative.");

        if (Key is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(Key);

        if (OldIndex is null && Key is null)
            throw new InvalidOperationException("Move change must provide either old index or key.");

        if (NewIndex is null)
            throw new InvalidOperationException("Move change must provide new index.");
    }
}
