using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// An items component whose item is a row of named slots laid out by the renderer rather than one template: the row itself is a
/// <typeparamref name="TRow"/> the derived component installs, the identity a click on the whole row is attached to.
/// </summary>
public abstract class RowItemsComponentBase<TComponent, TItem, TRow>(string? id = null) : ItemsComponentBase<TComponent, TItem>(id)
    where TComponent : RowItemsComponentBase<TComponent, TItem, TRow>, IUIComponentDefinition
    where TItem : class
    where TRow : VisualComponentBase<TRow>, IUIComponentDefinition
{
    /// <summary>
    /// Gets the template used to render each row's overall layout.
    /// </summary>
    public TRow? RowTemplate => GetTemplateVariant(TemplateNames.Row) as TRow;

    /// <summary>
    /// Sets the row template.
    /// </summary>
    public TComponent SetRowTemplate(TRow template)
        => SetTemplateVariantCore(TemplateNames.Row, template);

    /// <summary>
    /// Registers a row click command that passes the current item as an argument.
    /// </summary>
    public TComponent OnRowClickWithItem(string command, string argumentName = "item")
        => OnRowClick(command, UIAction.ArgCurrentItem(argumentName));
    /// <summary>
    /// Registers a row click command that passes the current item's key as an argument.
    /// </summary>
    public TComponent OnRowClickWithItemKey(string command, string argumentName = "id")
        => OnRowClick(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a click command invoked when a row is clicked.
    /// </summary>
    public TComponent OnRowClick(string command)
    {
        _ = RequiredRowTemplate.On(EventNames.Click, command);
        return Self;
    }

    /// <summary>
    /// Registers a click command invoked when a row is clicked, with UI action arguments.
    /// </summary>
    public TComponent OnRowClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = RequiredRowTemplate.On(EventNames.Click, command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a click command invoked when a row is clicked, with literal argument values.
    /// </summary>
    public TComponent OnRowClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
    {
        _ = RequiredRowTemplate.OnLiteral(EventNames.Click, command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a command invoked when a row is opened — Enter on the keyboard's row, or a double click — with the row's key.
    /// </summary>
    public TComponent OnRowOpenWithItemKey(string command, string argumentName = "id")
        => OnRowOpen(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked when a row is opened — Enter on the keyboard's row, or a double click.
    /// </summary>
    public TComponent OnRowOpen(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = RequiredRowTemplate.On(EventNames.Open, command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a command invoked when the Delete key is pressed on a row that may be removed, with the row's key; the
    /// controller removes the row or leaves it.
    /// </summary>
    public TComponent OnRowRemoveWithItemKey(string command, string argumentName = "id")
        => OnRowRemove(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked when the Delete key is pressed on a row that may be removed.
    /// </summary>
    public TComponent OnRowRemove(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = RequiredRowTemplate.On(EventNames.Remove, command, arguments);
        return Self;
    }

    /// <summary>
    /// The row template, which a click needs configured.
    /// </summary>
    protected TRow RequiredRowTemplate
        => RowTemplate ?? throw new InvalidOperationException($"The row template of '{TypeKey}' is not configured.");
}
