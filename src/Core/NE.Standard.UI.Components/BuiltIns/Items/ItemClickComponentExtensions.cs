using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Components.BuiltIns.Items;

/// <summary>
/// A component whose items are clicked through templates it holds, so the <c>OnItemClick</c> shorthands reach it.
/// </summary>
public interface IItemClickComponent
{
    /// <summary>
    /// Writes a click registration on every template an item is clicked through, now and on every one set there later.
    /// </summary>
    void OnClickableItemTemplates(Action<IVisualComponent> register);
}

/// <summary>
/// The click-registration shorthands shared by every <see cref="IItemClickComponent"/>.
/// </summary>
public static class ItemClickComponentExtensions
{
    /// <summary>
    /// Registers a click command invoked when an item is clicked.
    /// </summary>
    public static T OnItemClick<T>(this T component, string command)
        where T : IItemClickComponent
        => component.OnItemClick(command, []);

    /// <summary>
    /// Registers a click command invoked when an item is clicked, with UI action arguments.
    /// </summary>
    public static T OnItemClick<T>(this T component, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where T : IItemClickComponent
    {
        ArgumentNullException.ThrowIfNull(component);
        ArgumentException.ThrowIfNullOrWhiteSpace(command);
        ArgumentNullException.ThrowIfNull(arguments);

        component.OnClickableItemTemplates(template => _ = template.On(EventNames.Click, command, arguments));
        return component;
    }

    /// <summary>
    /// Registers a click command invoked when an item is clicked, with literal argument values.
    /// </summary>
    public static T OnItemClickLiteral<T>(this T component, string command, params KeyValuePair<string, object?>[] arguments)
        where T : IItemClickComponent
    {
        ArgumentNullException.ThrowIfNull(arguments);

        KeyValuePair<string, UIActionArgument>[] mapped = new KeyValuePair<string, UIActionArgument>[arguments.Length];

        for (var i = 0; i < arguments.Length; i++)
            mapped[i] = new(arguments[i].Key, UIActionArgument.Literal(arguments[i].Value));

        return component.OnItemClick(command, mapped);
    }

    /// <summary>
    /// Registers a click command that passes the clicked item as an argument.
    /// </summary>
    public static T OnItemClickWithItem<T>(this T component, string command, string argumentName = "item")
        where T : IItemClickComponent
        => component.OnItemClick(command, UIAction.ArgCurrentItem(argumentName));

    /// <summary>
    /// Registers a click command that passes the clicked item's key as an argument.
    /// </summary>
    public static T OnItemClickWithItemKey<T>(this T component, string command, string argumentName = "id")
        where T : IItemClickComponent
        => component.OnItemClick(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a click command with an argument derived from the specified <paramref name="argumentKind"/>.
    /// </summary>
    public static T OnItemClickWith<T>(this T component, string command, string argumentName, UIActionArgumentKind argumentKind)
        where T : IItemClickComponent
        => component.OnItemClick(command, UIAction.ArgCurrent(argumentKind, argumentName));
}
