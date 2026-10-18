using System;
using System.Diagnostics;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Defines collection update actions sent to the UI client.
/// </summary>
public enum CollectionUpdateAction
{
    Insert = 0,
    Remove = 1,
    Move = 2,
    Replace = 3,
    Reset = 4
}

/// <summary>
/// Represents a server-originated collection change update.
/// </summary>
public sealed class ServerCollectionChangeUIUpdate : ServerUIUpdate
{
    /// <inheritdoc />
    public override ServerUIUpdateKind Kind => ServerUIUpdateKind.CollectionChange;

    /// <summary>
    /// Gets the collection update action.
    /// </summary>
    public required CollectionUpdateAction Action { get; init; }

    /// <summary>
    /// Gets the component address whose collection changed.
    /// </summary>
    public required UIComponentAddress Component { get; init; }

    /// <summary>
    /// Gets inserted, removed, or replaced item changes.
    /// </summary>
    public ServerCollectionItemChange[] Items { get; init; } = [];

    /// <summary>
    /// Gets moved item changes.
    /// </summary>
    public ServerCollectionMoveChange[] Moves { get; init; } = [];

    /// <summary>
    /// Gets whether a remove only trimmed a window: its rows leave the page but not the source, and may come back. Sent only when true.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool Trimmed { get; init; }

    /// <summary>
    /// Validates the collection change update.
    /// </summary>
    public void Validate()
    {
        if (Component.Id.IsEmpty)
            throw new InvalidOperationException("Component id must not be empty.");

        // The address's row keys were held to UIRowKeys.IsKey when it was made; a default one holds none.
        ArgumentNullException.ThrowIfNull(Items);
        ArgumentNullException.ThrowIfNull(Moves);

        for (var i = 0; i < Items.Length; i++)
        {
            ArgumentNullException.ThrowIfNull(Items[i]);
            Items[i].Validate();
        }

        for (var i = 0; i < Moves.Length; i++)
        {
            ArgumentNullException.ThrowIfNull(Moves[i]);
            Moves[i].Validate();
        }

        if (Trimmed && Action != CollectionUpdateAction.Remove)
            throw new InvalidOperationException($"Collection action '{Action}' cannot be a trim; only a remove is.");

        switch (Action)
        {
            case CollectionUpdateAction.Insert:
            case CollectionUpdateAction.Remove:
            case CollectionUpdateAction.Replace:
                if (Items.Length == 0)
                    throw new InvalidOperationException($"Collection action '{Action}' must provide item changes.");

                if (Moves.Length != 0)
                    throw new InvalidOperationException($"Collection action '{Action}' must not provide move changes.");
                break;

            case CollectionUpdateAction.Move:
                if (Moves.Length == 0)
                    throw new InvalidOperationException("Move collection action must provide move changes.");

                if (Items.Length != 0)
                    throw new InvalidOperationException("Move collection action must not provide item changes.");
                break;

            case CollectionUpdateAction.Reset:
                if (Items.Length != 0)
                    throw new InvalidOperationException("Reset collection action must not provide item changes.");

                if (Moves.Length != 0)
                    throw new InvalidOperationException("Reset collection action must not provide move changes.");
                break;

            default:
                throw new UnreachableException();
        }
    }
}
