using System;

namespace NE.Standard.UI.Shell.Updates.Client;

/// <summary>
/// Represents a batch of updates sent from the UI client to the runtime.
/// </summary>
public sealed class ClientChangeSet
{
    /// <summary>
    /// Gets an empty client change set.
    /// </summary>
    public static ClientChangeSet Empty { get; } = new() { Updates = [] };

    /// <summary>
    /// Gets client-originated updates in this change set.
    /// </summary>
    public required ClientUIUpdate[] Updates { get; init; }

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
            ArgumentNullException.ThrowIfNull(Updates[i]);
    }
}
