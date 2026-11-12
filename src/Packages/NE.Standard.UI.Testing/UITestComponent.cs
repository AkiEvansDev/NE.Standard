using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Client;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Testing;

/// <summary>One component of an open page, in the rows it stands in: what it shows now, and the ways a reader acts on it.</summary>
public sealed class UITestComponent
{
    private readonly UITestPage _page;
    private readonly UIClientComponent _component;

    internal UITestComponent(UITestPage page, UIClientComponent component)
    {
        _page = page;
        _component = component;
    }

    /// <summary>Gets the id the view gave the component, or a generated one where it gave none.</summary>
    public string Id => _component.Id;

    /// <summary>Gets the component's type, as the view registered it.</summary>
    public string Type => _component.Type;

    /// <summary>Gets the keys of the rows the component stands in, outermost first; empty outside a list.</summary>
    public IReadOnlyList<object?> RowKeys => _component.RowKeys;

    /// <summary>Gets the value of an input: what the reader typed, else what the server sent.</summary>
    public object? Value => _component.Value;

    /// <summary>Gets the title as the page shows it, in its language.</summary>
    public string? Title => _component.Title;

    /// <summary>Gets whether a reader sees the component: neither it nor an ancestor collapsed or hidden, its row there, its dialog open.</summary>
    public bool IsVisible => _component.IsVisible;

    /// <summary>Gets whether a reader can act on it: neither it nor an ancestor disabled or loading.</summary>
    public bool IsEnabled => _component.IsEnabled;

    /// <summary>Gets the validation message the field shows, in the page's language, or <see langword="null"/> for none.</summary>
    public string? ValidationMessage => _component.ValidationMessage;

    /// <summary>Gets the severity of the message the field shows, or <see langword="null"/> for none.</summary>
    public UIValidationSeverity? ValidationSeverity => _component.ValidationSeverity;

    /// <summary>Gets the rows a list shows now, after active filter and sort rules.</summary>
    public IReadOnlyList<UITestRow> Rows
    {
        get
        {
            IReadOnlyList<UIClientRow> rows = _component.Rows;
            UITestRow[] mapped = new UITestRow[rows.Count];

            for (var i = 0; i < mapped.Length; i++)
                mapped[i] = new UITestRow(_page, rows[i]);

            return mapped;
        }
    }

    /// <summary>Gets the component shown on a right click or a long press on this one.</summary>
    /// <exception cref="InvalidOperationException">It has none.</exception>
    public UITestComponent ContextMenu => new(_page, _component.ContextMenu);

    /// <summary>Gets the menu a split button drops, whose rows are its entries.</summary>
    /// <exception cref="InvalidOperationException">It drops none.</exception>
    public UITestComponent Menu => new(_page, _component.Menu);

    /// <summary>Gets a property's value as the page holds it; a responsive value as it was sent.</summary>
    public object? Get(UIProperty property)
        => _component.Get(property);

    /// <summary>Gets a property's value as <typeparamref name="T"/>, resolving a responsive value at the page's current tier, or the default where it holds none of that shape.</summary>
    public T? Get<T>(UIProperty property)
        => _component.Get<T>(property);

    /// <summary>Gets a property's words as the page shows them, in its language.</summary>
    public string? Text(UIProperty property)
        => _component.Text(property);

    /// <summary>Gets the row with the key <paramref name="key"/>: a direct row first, else the one menu sub-entry with that key.</summary>
    /// <exception cref="InvalidOperationException">The list shows no such row, or several sub-entries share that key.</exception>
    public UITestRow Row(string key)
        => new(_page, _component.Row(key));

    /// <summary>Gets the component with the authored id <paramref name="id"/> inside this one.</summary>
    public UITestComponent Component(string id)
        => new(_page, _component.Component(id));

    /// <summary>Gets the one component inside this one bound to <paramref name="path"/>.</summary>
    public UITestComponent ComponentBoundTo<TSource>(Expression<Func<TSource, object?>> path)
        => new(_page, _component.ComponentBoundTo(path));

    /// <summary>Gets the one component inside this one bound to <paramref name="path"/>.</summary>
    public UITestComponent ComponentBoundTo(string path)
        => new(_page, _component.ComponentBoundTo(path));

    /// <summary>Gets the one component inside this one a reader knows by <paramref name="name"/>.</summary>
    public UITestComponent ComponentNamed(string name)
        => new(_page, _component.ComponentNamed(name));

    /// <summary>
    /// Types <paramref name="value"/> into the input and leaves it, as a reader does: its rules, the server's answer, its change command
    /// and their effects land on the page, and the result tells whether the value was refused and what its change command did.
    /// </summary>
    /// <exception cref="InvalidOperationException">The input is not shown, is disabled or read-only.</exception>
    public async Task<UITestCommandResult> SetValueAsync(object? value, CancellationToken cancellationToken = default)
        => UITestCommandResult.From(await _component.SetValueAsync(value, cancellationToken).ConfigureAwait(false));

    /// <summary>Writes <paramref name="value"/> to a property the reader changes, such as a list's chosen key, as <see cref="SetValueAsync"/> does.</summary>
    public async Task<UITestCommandResult> SetAsync(UIProperty property, object? value, CancellationToken cancellationToken = default)
        => UITestCommandResult.From(await _component.SetAsync(property, value, cancellationToken).ConfigureAwait(false));

    /// <summary>Commits <paramref name="title"/> as an inline rename on this component, writing <c>RenamedTitle</c> and raising <c>rename</c>.</summary>
    public async Task<UITestCommandResult> RenameAsync(string title, CancellationToken cancellationToken = default)
        => UITestCommandResult.From(await _component.RenameAsync(title, cancellationToken).ConfigureAwait(false));

    /// <summary>Presses the component: its click command — refused while its form has a field in error — or the interactions it drives.</summary>
    /// <exception cref="InvalidOperationException">The component is not shown, or is disabled or loading.</exception>
    public async Task<UITestCommandResult> ClickAsync(CancellationToken cancellationToken = default)
        => UITestCommandResult.From(await _component.ClickAsync(cancellationToken).ConfigureAwait(false));

    /// <summary>Raises <paramref name="eventName"/> on the component, with the keys the event itself names (a moved row's place) after its rows'.</summary>
    public async Task<UITestCommandResult> DispatchAsync(string eventName, object?[]? eventKeys = null, CancellationToken cancellationToken = default)
        => UITestCommandResult.From(await _component.DispatchAsync(eventName, eventKeys, cancellationToken).ConfigureAwait(false));

    /// <summary>Reads a window of items from this windowed host at <paramref name="anchor"/>.</summary>
    public Task RequestItemWindowAsync(UIItemAnchor anchor, int count, UIItemWindowMode mode = UIItemWindowMode.Replace, CancellationToken cancellationToken = default)
        => _component.RequestItemWindowAsync(anchor, count, mode, cancellationToken);

    /// <inheritdoc />
    public override string ToString()
        => _component.ToString();
}
