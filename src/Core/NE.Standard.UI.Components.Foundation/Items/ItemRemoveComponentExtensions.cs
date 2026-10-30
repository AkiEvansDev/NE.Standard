using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Components.Foundation.Items;

/// <summary>
/// The remove-registration shorthands shared by every <see cref="IItemRemoveComponent"/>.
/// </summary>
public static class ItemRemoveComponentExtensions
{
    /// <summary>
    /// Registers a command invoked when an item is asked to be removed — the Delete key on a row that may be removed, or a tab's close.
    /// </summary>
    public static T OnItemRemove<T>(this T component, string command)
        where T : IItemRemoveComponent
        => component.OnItemRemove(command, []);

    /// <summary>
    /// Registers a command invoked when an item is asked to be removed, with UI action arguments.
    /// </summary>
    /// <remarks>The controller removes the item or leaves it; a chosen group under the cursor raises it once per item.</remarks>
    public static T OnItemRemove<T>(this T component, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where T : IItemRemoveComponent
    {
        ArgumentNullException.ThrowIfNull(component);
        ArgumentException.ThrowIfNullOrWhiteSpace(command);
        ArgumentNullException.ThrowIfNull(arguments);

        component.OnRemovableItemTemplates(template => _ = template.On(EventNames.Remove, command, arguments));
        return component;
    }

    /// <summary>
    /// Registers a command invoked when an item is asked to be removed, with literal argument values.
    /// </summary>
    public static T OnItemRemoveLiteral<T>(this T component, string command, params KeyValuePair<string, object?>[] arguments)
        where T : IItemRemoveComponent
        => component.OnItemRemove(command, UIActionArgument.Literals(arguments));

    /// <summary>
    /// Registers a command invoked when an item is asked to be removed, passing the item as an argument.
    /// </summary>
    public static T OnItemRemoveWithItem<T>(this T component, string command, string argumentName = "item")
        where T : IItemRemoveComponent
        => component.OnItemRemove(command, UIAction.ArgCurrentItem(argumentName));

    /// <summary>
    /// Registers a command invoked when an item is asked to be removed, passing the item's key as an argument.
    /// </summary>
    public static T OnItemRemoveWithItemKey<T>(this T component, string command, string argumentName = "id")
        where T : IItemRemoveComponent
        => component.OnItemRemove(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked when an item is asked to be removed, with an argument derived from the specified <paramref name="argumentKind"/>.
    /// </summary>
    public static T OnItemRemoveWith<T>(this T component, string command, string argumentName, UIActionArgumentKind argumentKind)
        where T : IItemRemoveComponent
        => component.OnItemRemove(command, UIAction.ArgCurrent(argumentKind, argumentName));
}
