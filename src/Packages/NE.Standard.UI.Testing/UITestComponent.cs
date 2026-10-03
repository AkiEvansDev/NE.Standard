using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Testing;

/// <summary>One component of an open page, in the rows it stands in: what it shows now, and the ways a reader acts on it.</summary>
public sealed class UITestComponent
{
    private readonly UITestPage _page;
    private readonly UIComponentNode _node;
    private readonly object?[] _rowKeys;

    internal UITestComponent(UITestPage page, UIComponentNode node, object?[] rowKeys)
    {
        _page = page;
        _node = node;
        _rowKeys = rowKeys;
    }

    /// <summary>Gets the id the view gave the component, or a generated one where it gave none.</summary>
    public string Id => _node.AuthoringId;

    /// <summary>Gets the component's type, as the view registered it.</summary>
    public string Type => _node.TypeKey;

    /// <summary>Gets the keys of the rows the component stands in, outermost first; empty outside a list.</summary>
    public IReadOnlyList<object?> RowKeys => _rowKeys;

    /// <summary>Gets the value of an input: what the reader typed, else what the server sent.</summary>
    public object? Value => Get(IInputComponent.ValueProperty);

    /// <summary>Gets the title as the page shows it, in its language.</summary>
    public string? Title => Text(ITextBaseComponent.TitleProperty);

    /// <summary>Gets whether a reader sees the component: neither it nor an ancestor collapsed or hidden, its row there, its dialog open.</summary>
    public bool IsVisible => _page.IsShown(_node.ComponentId, _rowKeys);

    /// <summary>Gets whether a reader can act on it: neither it nor an ancestor disabled or loading.</summary>
    public bool IsEnabled => _page.IsEnabled(_node.ComponentId, _rowKeys);

    /// <summary>Gets the validation message the field shows, in the page's language, or <see langword="null"/> for none.</summary>
    public string? ValidationMessage => _page.Message(_node.ComponentId, _rowKeys) is { } message ? _page.Words(message.Message) : null;

    /// <summary>Gets the severity of the message the field shows, or <see langword="null"/> for none.</summary>
    public UIValidationSeverity? ValidationSeverity => _page.Message(_node.ComponentId, _rowKeys)?.Severity;

    /// <summary>Gets the rows a list shows now, in the order the server sent them.</summary>
    public IReadOnlyList<UITestRow> Rows
    {
        get
        {
            IReadOnlyList<UITestRowEntry> entries = _page.Rows(_node.ComponentId, _rowKeys);
            UITestRow[] rows = new UITestRow[entries.Count];

            for (var i = 0; i < rows.Length; i++)
                rows[i] = new UITestRow(_page, _node, _rowKeys, entries[i]);

            return rows;
        }
    }

    /// <summary>Gets the component shown on a right click or a long press on this one.</summary>
    /// <exception cref="InvalidOperationException">It has none.</exception>
    public UITestComponent ContextMenu
        => _page.View.Graph.TryGetSlot(_node.ComponentId, UIComponentSlotKind.ContextMenu, out UIComponentSlot? slot)
            ? _page.At(slot.RootComponentId, _rowKeys)
            : throw new InvalidOperationException($"'{Id}' has no context menu.");

    /// <summary>Gets a property's value as the page holds it; a responsive value as it was sent.</summary>
    public object? Get(UIProperty property)
        => _page.Read(_node.ComponentId, _rowKeys, property);

    /// <summary>Gets a property's value as <typeparamref name="T"/>, or the default where it holds none of that shape.</summary>
    public T? Get<T>(UIProperty property)
        => Get(property) switch
        {
            T typed => typed,
            null => default,
            var other => RecursiveValueCoercion.TryCoerce(other, out T coerced) ? coerced : default
        };

    /// <summary>Gets a property's words as the page shows them, in its language.</summary>
    public string? Text(UIProperty property)
        => _page.Words(Get(property));

    /// <summary>Gets the row with the key <paramref name="key"/>.</summary>
    /// <exception cref="InvalidOperationException">The list shows no such row.</exception>
    public UITestRow Row(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        foreach (UITestRowEntry entry in _page.Rows(_node.ComponentId, _rowKeys))
        {
            if (string.Equals(entry.Key, key, StringComparison.Ordinal))
                return new UITestRow(_page, _node, _rowKeys, entry);
        }

        throw new InvalidOperationException($"'{Id}' shows no row '{key}'.");
    }

    /// <summary>Gets the component with the authored id <paramref name="id"/> inside this one.</summary>
    public UITestComponent Component(string id)
        => _page.Find(id, _node.ComponentId, _rowKeys);

    /// <summary>Gets the one component inside this one bound to <paramref name="path"/>.</summary>
    public UITestComponent ComponentBoundTo(string path)
        => _page.FindBoundTo(path, _node.ComponentId, _rowKeys);

    /// <summary>Gets the one component inside this one a reader knows by <paramref name="name"/>.</summary>
    public UITestComponent ComponentNamed(string name)
        => _page.FindNamed(name, _node.ComponentId, _rowKeys);

    /// <summary>
    /// Types <paramref name="value"/> into the input and leaves it, as a reader does: its rules, the server's answer, its change command
    /// and their effects land on the page.
    /// </summary>
    /// <exception cref="InvalidOperationException">The input is not shown, is disabled or read-only.</exception>
    public Task SetValueAsync(object? value, CancellationToken cancellationToken = default)
        => _page.SetValueAsync(_node.ComponentId, _rowKeys, IInputComponent.ValueProperty, value, cancellationToken);

    /// <summary>Writes <paramref name="value"/> to a property the reader changes, such as a list's chosen key, as <see cref="SetValueAsync"/> does.</summary>
    public Task SetAsync(UIProperty property, object? value, CancellationToken cancellationToken = default)
        => _page.SetValueAsync(_node.ComponentId, _rowKeys, property, value, cancellationToken);

    /// <summary>Presses the component: its click command — refused while its form has a field in error — or the interactions it drives.</summary>
    /// <exception cref="InvalidOperationException">The component is not shown, or is disabled or loading.</exception>
    public Task<UITestCommandResult> ClickAsync(CancellationToken cancellationToken = default)
        => DispatchAsync(EventNames.Click, eventKeys: null, cancellationToken);

    /// <summary>Raises <paramref name="eventName"/> on the component, with the keys the event itself names (a moved row's place) after its rows'.</summary>
    public Task<UITestCommandResult> DispatchAsync(string eventName, object?[]? eventKeys = null, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(eventName);

        return _page.DispatchAsync(_node.ComponentId, _rowKeys, eventName, eventKeys ?? [], cancellationToken);
    }

    /// <inheritdoc />
    public override string ToString()
        => _rowKeys.Length == 0 ? $"{Type} '{Id}'" : $"{Type} '{Id}' [{string.Join(", ", _rowKeys)}]";
}
