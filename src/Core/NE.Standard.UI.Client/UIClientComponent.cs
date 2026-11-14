using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Client;

/// <summary>One component of an open page, in the rows it stands in: what it shows now, and the ways a reader acts on it.</summary>
public sealed class UIClientComponent
{
    private readonly object?[] _rowKeys;

    internal UIClientComponent(UIClientPage page, UIComponentNode node, object?[] rowKeys)
    {
        Page = page;
        Node = node;
        _rowKeys = rowKeys;
    }

    /// <summary>Gets the page this component belongs to.</summary>
    public UIClientPage Page { get; }

    /// <summary>Gets the compiled node of this component.</summary>
    public UIComponentNode Node { get; }

    /// <summary>Gets the component address combining its compiled id and current row keys.</summary>
    public UIComponentAddress Address => new(Node.ComponentId, _rowKeys);

    /// <summary>Gets the id the view gave the component, or a generated one where it gave none.</summary>
    public string Id => Node.AuthoringId;

    /// <summary>Gets the component's type, as the view registered it.</summary>
    public string Type => Node.TypeKey;

    /// <summary>Gets the keys of the rows the component stands in, outermost first; empty outside a list.</summary>
    public IReadOnlyList<object?> RowKeys => _rowKeys;

    /// <summary>Gets the direct child components of this component in the same row scope.</summary>
    public IReadOnlyList<UIClientComponent> Children
    {
        get
        {
            UIComponentId[] childIds = Node.Children;
            if (childIds.Length == 0)
                return [];

            UIClientComponent[] children = new UIClientComponent[childIds.Length];
            for (var i = 0; i < childIds.Length; i++)
                children[i] = Page.At(childIds[i], _rowKeys);

            return children;
        }
    }

    /// <summary>Gets the value of an input: what the reader typed, else what the server sent.</summary>
    public object? Value => Get(IInputComponent.ValueProperty);

    /// <summary>Gets the title as the page shows it, in its language.</summary>
    public string? Title => Text(ITextBaseComponent.TitleProperty);

    /// <summary>Gets whether a reader sees the component: neither it nor an ancestor collapsed or hidden, its row there, its dialog open.</summary>
    public bool IsVisible => Page.IsShown(Node.ComponentId, _rowKeys);

    /// <summary>Gets whether a reader can act on it: neither it nor an ancestor disabled or loading.</summary>
    public bool IsEnabled => Page.IsEnabled(Node.ComponentId, _rowKeys);

    /// <summary>Gets the validation message the field shows, in the page's language, or <see langword="null"/> for none.</summary>
    public string? ValidationMessage
        => Page.View.Validations.TryGetMessageTarget(Node.ComponentId, out _)
            ? null
            : Page.Message(Node.ComponentId, _rowKeys) is { } message ? Page.Words(message.Message) : null;

    /// <summary>Gets the severity of the message the field shows, or <see langword="null"/> for none.</summary>
    public UIValidationSeverity? ValidationSeverity => Page.Message(Node.ComponentId, _rowKeys)?.Severity;

    /// <summary>Gets the rows a list shows now, after active filter and sort rules.</summary>
    public IReadOnlyList<UIClientRow> Rows => Page.RowList(Node, _rowKeys);

    /// <summary>Gets the component shown on a right click or a long press on this one.</summary>
    /// <exception cref="InvalidOperationException">It has none.</exception>
    public UIClientComponent ContextMenu
        => Page.View.Graph.TryGetSlot(Node.ComponentId, UIComponentSlotKind.ContextMenu, out UIComponentSlot? slot)
            ? Page.At(slot.RootComponentId, _rowKeys)
            : throw new InvalidOperationException($"'{Id}' has no context menu.");

    /// <summary>Gets the menu a split button drops, whose rows are its entries.</summary>
    /// <exception cref="InvalidOperationException">It drops none.</exception>
    public UIClientComponent Menu
        => Page.View.Graph.TryGetSlot(Node.ComponentId, UIComponentSlotKind.Region, out UIComponentSlot? slot, RegionNames.Menu)
            ? Page.At(slot.RootComponentId, _rowKeys)
            : throw new InvalidOperationException($"'{Id}' drops no menu.");

    /// <summary>Attempts to resolve a child slot of <paramref name="kind"/> (and optional <paramref name="key"/>) on this component.</summary>
    public bool TryGetSlot(UIComponentSlotKind kind, [NotNullWhen(true)] out UIClientComponent? slotComponent, string? key = null)
    {
        if (Page.View.Graph.TryGetSlot(Node.ComponentId, kind, out UIComponentSlot? slot, key))
        {
            slotComponent = Page.At(slot.RootComponentId, _rowKeys);
            return true;
        }

        slotComponent = null;
        return false;
    }

    /// <summary>Gets whether this component declares a server command or client interaction for <paramref name="eventName"/>.</summary>
    public bool HasEvent(string eventName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(eventName);

        return Page.HasEventOrInteraction(Node.ComponentId, _rowKeys, eventName);
    }

    /// <summary>Gets whether <paramref name="property"/> is bound to write back to the controller.</summary>
    public bool WritesBack(UIProperty property)
        => Page.WritesBack(Node.ComponentId, property);

    /// <summary>Gets a property's value as the page holds it; a responsive value as it was sent.</summary>
    public object? Get(UIProperty property)
        => Page.Read(Node.ComponentId, _rowKeys, property);

    /// <summary>Gets a property's value as <typeparamref name="T"/>, resolving a responsive value at the page's current tier, or the default where it holds none of that shape.</summary>
    public T? Get<T>(UIProperty property)
    {
        var raw = Get(property);

        if (raw is T typed)
            return typed;

        if (raw is not null && Page.TryResolveResponsive(raw, out T? resolved))
            return resolved;

        return raw is not null && RecursiveValueCoercion.TryCoerce(raw, out T? coerced) ? coerced : default;
    }

    /// <summary>Gets a property's words as the page shows them, in its language.</summary>
    public string? Text(UIProperty property)
        => Page.Words(Get(property));

    /// <summary>Gets the row with the key <paramref name="key"/>: a direct row first, else the one menu sub-entry with that key.</summary>
    /// <exception cref="InvalidOperationException">The list shows no such row, or several sub-entries share that key.</exception>
    public UIClientRow Row(string key)
        => Page.FindRow(Node, _rowKeys, $"'{Id}'", key);

    /// <summary>Gets the component with the authored id <paramref name="id"/> inside this one.</summary>
    public UIClientComponent Component(string id)
        => Page.Find(id, Node.ComponentId, _rowKeys);

    /// <summary>Gets the one component inside this one bound to <paramref name="path"/>.</summary>
    public UIClientComponent ComponentBoundTo<TSource>(Expression<Func<TSource, object?>> path)
        => ComponentBoundTo(RecursivePath.FromExpression(path).ToString());

    /// <summary>Gets the one component inside this one bound to <paramref name="path"/>.</summary>
    public UIClientComponent ComponentBoundTo(string path)
        => Page.FindBoundTo(path, Node.ComponentId, _rowKeys);

    /// <summary>Gets the one component inside this one a reader knows by <paramref name="name"/>.</summary>
    public UIClientComponent ComponentNamed(string name)
        => Page.FindNamed(name, Node.ComponentId, _rowKeys);

    /// <summary>
    /// Types <paramref name="value"/> into the input and leaves it, as a reader does: its rules, the server's answer, its change command
    /// and their effects land on the page, and the result tells whether the value was refused and what its change command did.
    /// </summary>
    /// <exception cref="InvalidOperationException">The input is not shown, is disabled or read-only.</exception>
    public Task<UIClientCommandResult> SetValueAsync(object? value, CancellationToken cancellationToken = default)
        => Page.SetValueAsync(Node.ComponentId, _rowKeys, IInputComponent.ValueProperty, value, cancellationToken);

    /// <summary>Writes <paramref name="value"/> to a property the reader changes, such as a list's chosen key, as <see cref="SetValueAsync"/> does.</summary>
    public Task<UIClientCommandResult> SetAsync(UIProperty property, object? value, CancellationToken cancellationToken = default)
        => Page.SetValueAsync(Node.ComponentId, _rowKeys, property, value, cancellationToken);

    /// <summary>Commits <paramref name="title"/> as an inline rename on this component, writing <c>RenamedTitle</c> and raising <c>rename</c>.</summary>
    public Task<UIClientCommandResult> RenameAsync(string title, CancellationToken cancellationToken = default)
        => Page.RenameComponentAsync(Node.ComponentId, _rowKeys, title, cancellationToken);

    /// <summary>Presses the component: its click command — refused while its form has a field in error — or the interactions it drives.</summary>
    /// <exception cref="InvalidOperationException">The component is not shown, or is disabled or loading.</exception>
    public Task<UIClientCommandResult> ClickAsync(CancellationToken cancellationToken = default)
        => DispatchAsync(EventNames.Click, eventKeys: null, cancellationToken);

    /// <summary>Raises <paramref name="eventName"/> on the component, with the keys the event itself names (a moved row's place) after its rows'.</summary>
    public Task<UIClientCommandResult> DispatchAsync(string eventName, object?[]? eventKeys = null, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(eventName);

        return Page.DispatchAsync(Node.ComponentId, _rowKeys, eventName, eventKeys ?? [], cancellationToken);
    }

    /// <summary>Reads a window of items from this windowed host at <paramref name="anchor"/>.</summary>
    public Task RequestItemWindowAsync(UIItemAnchor anchor, int count, UIItemWindowMode mode = UIItemWindowMode.Replace, CancellationToken cancellationToken = default)
        => Page.RequestItemWindowAsync(Node.ComponentId, _rowKeys, anchor, count, mode, cancellationToken);

    /// <inheritdoc />
    public override string ToString()
        => _rowKeys.Length == 0 ? $"{Type} '{Id}'" : $"{Type} '{Id}' [{string.Join(", ", _rowKeys)}]";
}
