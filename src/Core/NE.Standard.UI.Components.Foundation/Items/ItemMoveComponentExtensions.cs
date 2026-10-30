using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Components.Foundation.Items;

/// <summary>
/// The move-registration shorthands shared by every <see cref="IItemMoveComponent"/>.
/// </summary>
/// <remarks>
/// The forms that name the item also pass the index it takes, read by <c>UIAction.ArgEventValue</c>: a move without its place is no
/// move. Where the index counts is the host's to say (its own remarks): an items view's and a table's in the collection, a tree's
/// among the nodes of the folder its <c>DropTarget</c> names.
/// </remarks>
public static class ItemMoveComponentExtensions
{
    /// <summary>
    /// Registers a command invoked when an item is moved to another place — a drag with <c>Draggable</c> on, or Alt with an arrow.
    /// </summary>
    public static T OnItemMove<T>(this T component, string command)
        where T : IItemMoveComponent
        => component.OnItemMove(command, []);

    /// <summary>
    /// Registers a command invoked when an item is moved to another place, with UI action arguments.
    /// </summary>
    /// <remarks>The controller moves the item, keeps it where the page put it, or refuses by doing nothing.</remarks>
    public static T OnItemMove<T>(this T component, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where T : IItemMoveComponent
    {
        ArgumentNullException.ThrowIfNull(component);
        ArgumentException.ThrowIfNullOrWhiteSpace(command);
        ArgumentNullException.ThrowIfNull(arguments);

        component.OnMovableItemTemplates(template => _ = template.On(EventNames.Move, command, arguments));
        return component;
    }

    /// <summary>
    /// Registers a command invoked when an item is moved to another place, with literal argument values.
    /// </summary>
    public static T OnItemMoveLiteral<T>(this T component, string command, params KeyValuePair<string, object?>[] arguments)
        where T : IItemMoveComponent
        => component.OnItemMove(command, UIActionArgument.Literals(arguments));

    /// <summary>
    /// Registers a command invoked when an item is moved to another place, passing the item and the index it takes.
    /// </summary>
    public static T OnItemMoveWithItem<T>(this T component, string command, string argumentName = "item", string indexArgumentName = "index")
        where T : IItemMoveComponent
        => component.OnItemMove(command, UIAction.ArgCurrentItem(argumentName), UIAction.Offered(UIAction.ArgEventValue(indexArgumentName)));

    /// <summary>
    /// Registers a command invoked when an item is moved to another place, passing the item's key and the index it takes.
    /// </summary>
    public static T OnItemMoveWithItemKey<T>(this T component, string command, string keyArgumentName = "id", string indexArgumentName = "index")
        where T : IItemMoveComponent
        => component.OnItemMove(command, UIAction.ArgCurrentItemKey(keyArgumentName), UIAction.Offered(UIAction.ArgEventValue(indexArgumentName)));

    /// <summary>
    /// Registers a command invoked when an item is moved to another place, passing an argument derived from the specified
    /// <paramref name="argumentKind"/> and the index it takes.
    /// </summary>
    public static T OnItemMoveWith<T>(this T component, string command, string argumentName, UIActionArgumentKind argumentKind, string indexArgumentName = "index")
        where T : IItemMoveComponent
        => component.OnItemMove(command, UIAction.ArgCurrent(argumentKind, argumentName), UIAction.Offered(UIAction.ArgEventValue(indexArgumentName)));
}
