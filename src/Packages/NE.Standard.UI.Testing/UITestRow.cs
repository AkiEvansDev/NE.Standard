using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Client;

namespace NE.Standard.UI.Testing;

/// <summary>One row of a list on an open page: its key, the item the server sent for it, and the components its template drew.</summary>
public sealed class UITestRow
{
    private readonly UITestPage _page;
    private readonly UIClientRow _row;

    internal UITestRow(UITestPage page, UIClientRow row)
    {
        _page = page;
        _row = row;
    }

    /// <summary>Gets the row's key, its item's id.</summary>
    public string Key => _row.Key;

    /// <summary>Gets the item the server sent for the row.</summary>
    /// <remarks>The server's own object: a property it changed since shows here before the flush sends it.</remarks>
    public object? Item => _row.Item;

    /// <summary>Gets the component the row's template drew it with: the variant its item names, a composite's row, else the list's template.</summary>
    public UITestComponent Root => new(_page, _row.Root);

    /// <summary>Gets the component shown on a right click or a long press on the row.</summary>
    public UITestComponent ContextMenu => new(_page, _row.ContextMenu);

    /// <summary>Gets the sub-entries a menu row shows now, in the order the server sent them; empty where the row opens none.</summary>
    public IReadOnlyList<UITestRow> Rows
    {
        get
        {
            IReadOnlyList<UIClientRow> rows = _row.Rows;
            UITestRow[] mapped = new UITestRow[rows.Count];

            for (var i = 0; i < mapped.Length; i++)
                mapped[i] = new UITestRow(_page, rows[i]);

            return mapped;
        }
    }

    /// <summary>Gets the item as <typeparamref name="TItem"/>.</summary>
    /// <exception cref="InvalidOperationException">The item is of another type.</exception>
    public TItem ItemAs<TItem>()
        => _row.ItemAs<TItem>();

    /// <summary>Gets the sub-entry under this menu row with the key <paramref name="key"/>.</summary>
    /// <exception cref="InvalidOperationException">The row shows no such sub-entry, or several deeper sub-entries share that key.</exception>
    public UITestRow Row(string key)
        => new(_page, _row.Row(key));

    /// <summary>Gets the component with the authored id <paramref name="id"/> in this row.</summary>
    public UITestComponent Component(string id)
        => new(_page, _row.Component(id));

    /// <summary>Gets the one component in this row bound to <paramref name="path"/> on the item.</summary>
    public UITestComponent ComponentBoundTo<TItem>(Expression<Func<TItem, object?>> path)
        => new(_page, _row.ComponentBoundTo(path));

    /// <summary>Gets the one component in this row bound to <paramref name="path"/> on the item.</summary>
    public UITestComponent ComponentBoundTo(string path)
        => new(_page, _row.ComponentBoundTo(path));

    /// <summary>Gets the one component in this row a reader knows by <paramref name="name"/>.</summary>
    public UITestComponent ComponentNamed(string name)
        => new(_page, _row.ComponentNamed(name));

    /// <summary>Presses the row: its template's click command, with the row's key.</summary>
    public async Task<UITestCommandResult> ClickAsync(CancellationToken cancellationToken = default)
        => UITestCommandResult.From(await _row.ClickAsync(cancellationToken).ConfigureAwait(false));

    /// <summary>
    /// Chooses the row as a press does: the host's chosen key or option value written where the host binds it to write back, then the row's
    /// click command where it has one and the write succeeded.
    /// </summary>
    public async Task<UITestCommandResult> ChooseAsync(CancellationToken cancellationToken = default)
        => UITestCommandResult.From(await _row.ChooseAsync(cancellationToken).ConfigureAwait(false));

    /// <inheritdoc />
    public override string ToString()
        => _row.ToString();
}
