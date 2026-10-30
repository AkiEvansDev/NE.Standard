using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Components.Foundation.Items;

/// <summary>
/// The open-registration shorthands shared by every <see cref="IItemOpenComponent"/>.
/// </summary>
public static class ItemOpenComponentExtensions
{
    /// <summary>
    /// Registers a command invoked when an item is opened — Enter on the keyboard's row, or a double click.
    /// </summary>
    public static T OnItemOpen<T>(this T component, string command)
        where T : IItemOpenComponent
        => component.OnItemOpen(command, []);

    /// <summary>
    /// Registers a command invoked when an item is opened, with UI action arguments.
    /// </summary>
    public static T OnItemOpen<T>(this T component, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where T : IItemOpenComponent
    {
        ArgumentNullException.ThrowIfNull(component);
        ArgumentException.ThrowIfNullOrWhiteSpace(command);
        ArgumentNullException.ThrowIfNull(arguments);

        component.OnOpenableItemTemplates(template => _ = template.On(EventNames.Open, command, arguments));
        return component;
    }

    /// <summary>
    /// Registers a command invoked when an item is opened, with literal argument values.
    /// </summary>
    public static T OnItemOpenLiteral<T>(this T component, string command, params KeyValuePair<string, object?>[] arguments)
        where T : IItemOpenComponent
        => component.OnItemOpen(command, UIActionArgument.Literals(arguments));

    /// <summary>
    /// Registers a command invoked when an item is opened, passing the item as an argument.
    /// </summary>
    public static T OnItemOpenWithItem<T>(this T component, string command, string argumentName = "item")
        where T : IItemOpenComponent
        => component.OnItemOpen(command, UIAction.ArgCurrentItem(argumentName));

    /// <summary>
    /// Registers a command invoked when an item is opened, passing the item's key as an argument.
    /// </summary>
    public static T OnItemOpenWithItemKey<T>(this T component, string command, string argumentName = "id")
        where T : IItemOpenComponent
        => component.OnItemOpen(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked when an item is opened, with an argument derived from the specified <paramref name="argumentKind"/>.
    /// </summary>
    public static T OnItemOpenWith<T>(this T component, string command, string argumentName, UIActionArgumentKind argumentKind)
        where T : IItemOpenComponent
        => component.OnItemOpen(command, UIAction.ArgCurrent(argumentKind, argumentName));
}
