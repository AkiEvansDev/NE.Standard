using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Testing;

/// <summary>One row of a list on an open page: its key, the item the server sent for it, and the components its template drew.</summary>
public sealed class UITestRow
{
    private readonly UITestPage _page;
    private readonly UIComponentNode _host;
    private readonly object?[] _hostKeys;
    private readonly UITestRowEntry _entry;

    internal UITestRow(UITestPage page, UIComponentNode host, object?[] hostKeys, UITestRowEntry entry)
    {
        _page = page;
        _host = host;
        _hostKeys = hostKeys;
        _entry = entry;
    }

    /// <summary>Gets the row's key, its item's id.</summary>
    public string Key => _entry.Key;

    /// <summary>Gets the item the server sent for the row.</summary>
    /// <remarks>The server's own object: a property it changed since shows here before a <c>Batch</c> runtime's flush sends it.</remarks>
    public object? Item => _entry.Item;

    /// <summary>Gets the component the row's template drew it with: the variant its item names, else the list's template.</summary>
    public UITestComponent Root
        => _page.At(_page.RowTemplate(_host.ComponentId, _hostKeys, _entry.Item), [.. _hostKeys, _entry.Key]);

    /// <summary>Gets the component shown on a right click or a long press on the row.</summary>
    public UITestComponent ContextMenu => Root.ContextMenu;

    /// <summary>Gets the item as <typeparamref name="TItem"/>.</summary>
    /// <exception cref="InvalidOperationException">The item is of another type.</exception>
    public TItem ItemAs<TItem>()
        => _entry.Item is TItem item ? item : throw new InvalidOperationException($"Row '{Key}' holds a '{_entry.Item?.GetType().Name ?? "null"}', not a '{typeof(TItem).Name}'.");

    /// <summary>Gets the component with the authored id <paramref name="id"/> in this row.</summary>
    public UITestComponent Component(string id)
        => Root.Component(id);

    /// <summary>Gets the one component in this row bound to <paramref name="path"/> on the item.</summary>
    public UITestComponent ComponentBoundTo(string path)
        => Root.ComponentBoundTo(path);

    /// <summary>Gets the one component in this row a reader knows by <paramref name="name"/>.</summary>
    public UITestComponent ComponentNamed(string name)
        => Root.ComponentNamed(name);

    /// <summary>Presses the row: its template's click command, with the row's key.</summary>
    public Task<UITestCommandResult> ClickAsync(CancellationToken cancellationToken = default)
        => Root.ClickAsync(cancellationToken);

    /// <summary>
    /// Chooses the row as a press does: the list's chosen key written where the list binds it to write back, then the row's click
    /// command where it has one.
    /// </summary>
    public async Task<UITestCommandResult> ChooseAsync(CancellationToken cancellationToken = default)
    {
        UITestComponent root = Root;
        UITestCommandResult? chosen = null;

        if (_page.WritesBack(_host.ComponentId, ISelectableItemsComponent.SelectedKeyProperty))
            chosen = await _page.SetValueAsync(_host.ComponentId, _hostKeys, ISelectableItemsComponent.SelectedKeyProperty, Key, cancellationToken).ConfigureAwait(false);

        if (_page.HasEvent(_page.RowTemplate(_host.ComponentId, _hostKeys, _entry.Item), EventNames.Click) || chosen is null)
            return await root.ClickAsync(cancellationToken).ConfigureAwait(false);

        return chosen;
    }

    /// <inheritdoc />
    public override string ToString()
        => $"row '{Key}' of '{_host.AuthoringId}'";
}
