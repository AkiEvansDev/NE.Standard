using System;
using System.Diagnostics;
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
    /// Validates the collection change update.
    /// </summary>
    public void Validate()
    {
        if (Component.Id.IsEmpty)
            throw new InvalidOperationException("Component id must not be empty.");

        ArgumentNullException.ThrowIfNull(Items);
        ArgumentNullException.ThrowIfNull(Moves);

        for (var i = 0; i < Component.DynamicParameters.Length; i++)
        {
            if (Component.DynamicParameters[i] is not null and not int and not string)
                throw new InvalidOperationException($"Dynamic parameter #{i} must be int or string.");
        }

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
