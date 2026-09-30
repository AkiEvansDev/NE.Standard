using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// An items component whose item template is an <see cref="IButtonComponent"/>.
/// </summary>
public interface IButtonTemplatedItemsComponent
{
    /// <summary>
    /// Gets the item template.
    /// </summary>
    IButtonComponent? Template { get; }
}

/// <summary>
/// The click-registration shorthands shared by every <see cref="IButtonTemplatedItemsComponent"/>.
/// </summary>
public static class ButtonTemplatedItemsExtensions
{
    /// <summary>
    /// Registers a click command invoked when an item is clicked.
    /// </summary>
    public static T OnItemClick<T>(this T component, string command)
        where T : IButtonTemplatedItemsComponent, IUIComponentDefinition
        => OnItemTemplate(component, template => _ = template.OnClick(command));

    /// <summary>
    /// Writes a click on the item template and on every one set later; a host of its own making writes on the template in hand.
    /// </summary>
    private static T OnItemTemplate<T>(T component, Action<IButtonComponent> register)
        where T : IButtonTemplatedItemsComponent, IUIComponentDefinition
    {
        if (component is ITemplateEventHost host)
            host.OnTemplate(null, register);
        else
            register(component.Template ?? throw new InvalidOperationException($"'{T.ComponentTypeKey}' has no item template."));

        return component;
    }

    /// <summary>
    /// Registers a click command invoked when an item is clicked, with UI action arguments.
    /// </summary>
    public static T OnItemClick<T>(this T component, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where T : IButtonTemplatedItemsComponent, IUIComponentDefinition
        => OnItemTemplate(component, template => _ = template.OnClick(command, arguments));

    /// <summary>
    /// Registers a click command invoked when an item is clicked, with literal argument values.
    /// </summary>
    public static T OnItemClickLiteral<T>(this T component, string command, params KeyValuePair<string, object?>[] arguments)
        where T : IButtonTemplatedItemsComponent, IUIComponentDefinition
        => OnItemTemplate(component, template => _ = template.OnClickLiteral(command, arguments));

    /// <summary>
    /// Registers a click command that passes the clicked item as an argument.
    /// </summary>
    public static T OnItemClickWithItem<T>(this T component, string command, string argumentName = "item")
        where T : IButtonTemplatedItemsComponent, IUIComponentDefinition
        => component.OnItemClick(command, UIAction.ArgCurrentItem(argumentName));

    /// <summary>
    /// Registers a click command that passes the clicked item's key as an argument.
    /// </summary>
    public static T OnItemClickWithItemKey<T>(this T component, string command, string argumentName = "id")
        where T : IButtonTemplatedItemsComponent, IUIComponentDefinition
        => component.OnItemClick(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a click command with an argument derived from the specified <paramref name="argumentKind"/>.
    /// </summary>
    public static T OnItemClickWith<T>(this T component, string command, string argumentName, UIActionArgumentKind argumentKind)
        where T : IButtonTemplatedItemsComponent, IUIComponentDefinition
        => component.OnItemClick(command, UIAction.ArgCurrent(argumentKind, argumentName));
}
