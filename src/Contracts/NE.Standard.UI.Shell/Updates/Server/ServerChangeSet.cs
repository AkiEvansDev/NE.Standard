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
    /// Gets each update's place in the order the runtime queued them, aligned with <see cref="Updates"/>; unset for a change set
    /// the runtime did not queue (an attach snapshot, a window read), which every client receives whole.
    /// </summary>
    [JsonIgnore]
    public long[]? Sequences { get; init; }

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
        var sequences = Sequences is null ? null : new long[updates.Length];
        var next = 0;

        for (var i = 0; i < Updates.Length; i++)
        {
            if (IsExcepted(Updates[i], instanceId))
                continue;

            sequences?[next] = Sequences![i];

            updates[next++] = Updates[i];
        }

        return new ServerChangeSet { Updates = updates, Sequences = sequences };
    }

    /// <summary>
    /// Gets the change set without the updates queued at or before <paramref name="watermark"/> — those a client's attach snapshot
    /// already holds; the same instance when there are none.
    /// </summary>
    public ServerChangeSet After(long watermark)
    {
        if (Sequences is not { } sequences)
            return this;

        var dropped = 0;

        for (var i = 0; i < sequences.Length; i++)
        {
            if (sequences[i] <= watermark)
                dropped++;
        }

        if (dropped == 0)
            return this;

        if (dropped == Updates.Length)
            return Empty;

        ServerUIUpdate[] updates = new ServerUIUpdate[Updates.Length - dropped];
        var kept = new long[updates.Length];
        var next = 0;

        for (var i = 0; i < Updates.Length; i++)
        {
            if (sequences[i] <= watermark)
                continue;

            updates[next] = Updates[i];
            kept[next++] = sequences[i];
        }

        return new ServerChangeSet { Updates = updates, Sequences = kept };
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

        if (Sequences is not null && Sequences.Length != Updates.Length)
            throw new InvalidOperationException("A change set's sequences must match its updates one to one.");

        for (var i = 0; i < Updates.Length; i++)
        {
            ArgumentNullException.ThrowIfNull(Updates[i]);

            if (Updates[i] is ServerCollectionChangeUIUpdate collectionUpdate)
                collectionUpdate.Validate();
        }
    }
}
