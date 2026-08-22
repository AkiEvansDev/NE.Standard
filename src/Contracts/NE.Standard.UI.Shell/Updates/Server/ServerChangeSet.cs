using System;

namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Represents a batch of updates sent from the runtime to the UI client.
/// </summary>
public sealed class ServerChangeSet
{
    /// <summary>
    /// Gets an empty server change set.
    /// </summary>
    public static ServerChangeSet Empty { get; } = new() { Updates = [] };

    /// <summary>
    /// Gets server-originated updates in this change set.
    /// </summary>
    public required ServerUIUpdate[] Updates { get; init; }

    /// <summary>
    /// Gets whether the change set contains no updates.
    /// </summary>
    public bool IsEmpty => Updates.Length == 0;

    /// <summary>
    /// Validates the change set.
    /// </summary>
    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(Updates);

        for (var i = 0; i < Updates.Length; i++)
        {
            ArgumentNullException.ThrowIfNull(Updates[i]);

            if (Updates[i] is ServerCollectionChangeUIUpdate collectionUpdate)
                collectionUpdate.Validate();
        }
    }
}
