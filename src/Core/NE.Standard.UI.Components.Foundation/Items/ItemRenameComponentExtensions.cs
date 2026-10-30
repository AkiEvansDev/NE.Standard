using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Components.Foundation.Items;

/// <summary>
/// The rename-registration shorthands shared by every <see cref="IItemRenameComponent"/>.
/// </summary>
public static class ItemRenameComponentExtensions
{
    /// <summary>
    /// Registers a command invoked after a rename in place wrote the item's new title back.
    /// </summary>
    public static T OnItemRename<T>(this T component, string command)
        where T : IItemRenameComponent
        => component.OnItemRename(command, []);

    /// <summary>
    /// Registers a command invoked after a rename in place wrote the item's new title back, with UI action arguments.
    /// </summary>
    /// <remarks>Optional: the two-way title already carries the new text; this is for refusing or normalizing it.</remarks>
    public static T OnItemRename<T>(this T component, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where T : IItemRenameComponent
    {
        ArgumentNullException.ThrowIfNull(component);
        ArgumentException.ThrowIfNullOrWhiteSpace(command);
        ArgumentNullException.ThrowIfNull(arguments);

        component.OnRenamableItemTemplates(template => _ = template.On(EventNames.Rename, command, arguments));
        return component;
    }

    /// <summary>
    /// Registers a command invoked after a rename in place wrote the item's new title back, with literal argument values.
    /// </summary>
    public static T OnItemRenameLiteral<T>(this T component, string command, params KeyValuePair<string, object?>[] arguments)
        where T : IItemRenameComponent
        => component.OnItemRename(command, UIActionArgument.Literals(arguments));

    /// <summary>
    /// Registers a command invoked after a rename in place wrote the item's new title back, passing the item as an argument.
    /// </summary>
    public static T OnItemRenameWithItem<T>(this T component, string command, string argumentName = "item")
        where T : IItemRenameComponent
        => component.OnItemRename(command, UIAction.ArgCurrentItem(argumentName));

    /// <summary>
    /// Registers a command invoked after a rename in place wrote the item's new title back, passing the item's key as an argument.
    /// </summary>
    public static T OnItemRenameWithItemKey<T>(this T component, string command, string argumentName = "id")
        where T : IItemRenameComponent
        => component.OnItemRename(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked after a rename in place wrote the item's new title back, with an argument derived from the specified <paramref name="argumentKind"/>.
    /// </summary>
    public static T OnItemRenameWith<T>(this T component, string command, string argumentName, UIActionArgumentKind argumentKind)
        where T : IItemRenameComponent
        => component.OnItemRename(command, UIAction.ArgCurrent(argumentKind, argumentName));
}
