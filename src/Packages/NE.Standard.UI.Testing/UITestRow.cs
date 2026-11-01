using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
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
    /// <remarks>The server's own object: a property it changed since shows here before the flush sends it.</remarks>
    public object? Item => _entry.Item;

    /// <summary>Gets the component the row's template drew it with: the variant its item names, a composite's row, else the list's template.</summary>
    public UITestComponent Root
        => _page.At(_page.RowTemplate(_host.ComponentId, _hostKeys, _entry.Item), RowKeys);

    /// <summary>Gets the component shown on a right click or a long press on the row.</summary>
    public UITestComponent ContextMenu => Root.ContextMenu;

    /// <summary>Gets the sub-entries a menu row shows now, in the order the server sent them; empty where the row opens none.</summary>
    public IReadOnlyList<UITestRow> Rows => _page.SubmenuRows(_host.ComponentId, RowKeys);

    /// <summary>Gets the item as <typeparamref name="TItem"/>.</summary>
    /// <exception cref="InvalidOperationException">The item is of another type.</exception>
    public TItem ItemAs<TItem>()
        => _entry.Item is TItem item ? item : throw new InvalidOperationException($"Row '{Key}' holds a '{_entry.Item?.GetType().Name ?? "null"}', not a '{typeof(TItem).Name}'.");

    /// <summary>Gets the sub-entry under this menu row with the key <paramref name="key"/>.</summary>
    /// <exception cref="InvalidOperationException">The row shows no such sub-entry, or several deeper sub-entries share that key.</exception>
    public UITestRow Row(string key)
        => _page.FindSubmenuRow(_host, RowKeys, Key, key);

    /// <summary>Gets the component with the authored id <paramref name="id"/> in this row.</summary>
    public UITestComponent Component(string id)
        => _page.Find(id, Scope, RowKeys, _entry.Item);

    /// <summary>Gets the one component in this row bound to <paramref name="path"/> on the item.</summary>
    public UITestComponent ComponentBoundTo<TItem>(Expression<Func<TItem, object?>> path)
        => ComponentBoundTo(RecursivePath.FromExpression(path).ToString());

    /// <summary>Gets the one component in this row bound to <paramref name="path"/> on the item.</summary>
    public UITestComponent ComponentBoundTo(string path)
        => _page.FindBoundTo(path, Scope, RowKeys, _entry.Item);

    /// <summary>Gets the one component in this row a reader knows by <paramref name="name"/>.</summary>
    public UITestComponent ComponentNamed(string name)
        => _page.FindNamed(name, Scope, RowKeys, _entry.Item);

    private UIComponentId Scope => _page.RowScope(_host.ComponentId, _hostKeys, _entry.Item);

    private object?[] RowKeys => [.. _hostKeys, _entry.Key];

    /// <summary>Presses the row: its template's click command, with the row's key.</summary>
    public Task<UITestCommandResult> ClickAsync(CancellationToken cancellationToken = default)
        => Root.ClickAsync(cancellationToken);

    /// <summary>
    /// Chooses the row as a press does: the host's chosen key or option value written where the host binds it to write back, then the row's
    /// click command where it has one and the write succeeded.
    /// </summary>
    public async Task<UITestCommandResult> ChooseAsync(CancellationToken cancellationToken = default)
    {
        UITestComponent root = Root;
        UITestCommandResult? chosen = null;

        if (_page.ChoiceWrite(_host, _hostKeys, Key) is (UIProperty property, object value))
            chosen = await _page.SetValueAsync(_host.ComponentId, _hostKeys, property, value, cancellationToken).ConfigureAwait(false);

        if (chosen is { Succeeded: false })
            return chosen;

        if (_page.HasEvent(_page.RowTemplate(_host.ComponentId, _hostKeys, _entry.Item), EventNames.Click) || chosen is null)
            return await root.ClickAsync(cancellationToken).ConfigureAwait(false);

        return chosen;
    }

    /// <inheritdoc />
    public override string ToString()
        => $"row '{Key}' of '{_host.AuthoringId}'";
}
