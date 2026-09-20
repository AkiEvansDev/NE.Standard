using System;
using System.Text.Json.Serialization;

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
    [JsonIgnore]
    public bool IsEmpty => Updates.Length == 0;

    /// <summary>
    /// Gets the change set as one client instance receives it: without the value updates that instance already holds.
    /// </summary>
    public ServerChangeSet For(string instanceId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);

        var excepted = 0;

        for (var i = 0; i < Updates.Length; i++)
        {
            if (IsExcepted(Updates[i], instanceId))
                excepted++;
        }

        if (excepted == 0)
            return this;

        ServerUIUpdate[] updates = new ServerUIUpdate[Updates.Length - excepted];
        var next = 0;

        for (var i = 0; i < Updates.Length; i++)
        {
            if (!IsExcepted(Updates[i], instanceId))
                updates[next++] = Updates[i];
        }

        return new ServerChangeSet { Updates = updates };
    }

    /// <summary>
    /// Gets whether any update in the change set is withheld from one client instance.
    /// </summary>
    [JsonIgnore]
    public bool HasExceptions
    {
        get
        {
            for (var i = 0; i < Updates.Length; i++)
            {
                if (Updates[i] is ServerValueUIUpdate { ExceptInstanceId: not null })
                    return true;
            }

            return false;
        }
    }

    private static bool IsExcepted(ServerUIUpdate update, string instanceId)
        => update is ServerValueUIUpdate { ExceptInstanceId: { } excepted } && string.Equals(excepted, instanceId, StringComparison.Ordinal);

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
