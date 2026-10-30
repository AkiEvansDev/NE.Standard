using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Components.Foundation.Items;

/// <summary>
/// The unfold-registration shorthands shared by every <see cref="IItemUnfoldComponent"/>.
/// </summary>
public static class ItemUnfoldComponentExtensions
{
    /// <summary>
    /// Registers a command invoked when an item that says it has children is unfolded before any are in the list.
    /// </summary>
    public static T OnItemUnfold<T>(this T component, string command)
        where T : IItemUnfoldComponent
        => component.OnItemUnfold(command, []);

    /// <summary>
    /// Registers a command invoked when an item is unfolded before its children are in the list, with UI action arguments.
    /// </summary>
    /// <remarks>The controller adds the children or clears <c>HasChildren</c>.</remarks>
    public static T OnItemUnfold<T>(this T component, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where T : IItemUnfoldComponent
    {
        ArgumentNullException.ThrowIfNull(component);
        ArgumentException.ThrowIfNullOrWhiteSpace(command);
        ArgumentNullException.ThrowIfNull(arguments);

        component.OnUnfoldableItemTemplates(template => _ = template.On(EventNames.Unfold, command, arguments));
        return component;
    }

    /// <summary>
    /// Registers a command invoked when an item is unfolded before its children are in the list, with literal argument values.
    /// </summary>
    public static T OnItemUnfoldLiteral<T>(this T component, string command, params KeyValuePair<string, object?>[] arguments)
        where T : IItemUnfoldComponent
        => component.OnItemUnfold(command, UIActionArgument.Literals(arguments));

    /// <summary>
    /// Registers a command invoked when an item is unfolded before its children are in the list, passing the item as an argument.
    /// </summary>
    public static T OnItemUnfoldWithItem<T>(this T component, string command, string argumentName = "item")
        where T : IItemUnfoldComponent
        => component.OnItemUnfold(command, UIAction.ArgCurrentItem(argumentName));

    /// <summary>
    /// Registers a command invoked when an item is unfolded before its children are in the list, passing the item's key as an argument.
    /// </summary>
    public static T OnItemUnfoldWithItemKey<T>(this T component, string command, string argumentName = "id")
        where T : IItemUnfoldComponent
        => component.OnItemUnfold(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked when an item is unfolded before its children are in the list, with an argument derived from the specified <paramref name="argumentKind"/>.
    /// </summary>
    public static T OnItemUnfoldWith<T>(this T component, string command, string argumentName, UIActionArgumentKind argumentKind)
        where T : IItemUnfoldComponent
        => component.OnItemUnfold(command, UIAction.ArgCurrent(argumentKind, argumentName));
}
