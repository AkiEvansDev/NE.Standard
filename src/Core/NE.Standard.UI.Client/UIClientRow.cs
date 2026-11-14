using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Serialization;

namespace NE.Standard.UI.Client;

/// <summary>One row of a list on an open page: its key, the item the server sent for it, and the components its template drew.</summary>
public sealed class UIClientRow
{
    internal UIClientRow(UIClientPage page, UIComponentNode host, object?[] hostKeys, UIClientRowEntry entry)
    {
        Page = page;
        Host = host;
        HostKeys = hostKeys;
        Entry = entry;
    }

    internal UIClientPage Page { get; }

    internal UIComponentNode Host { get; }

    internal object?[] HostKeys { get; }

    internal UIClientRowEntry Entry { get; }

    /// <summary>Gets the row's key, its item's id.</summary>
    public string Key => Entry.Key;

    /// <summary>Gets the item the server sent for the row.</summary>
    public object? Item => Entry.Item;

    /// <summary>Gets the component the row's template drew it with: the variant its item names, a composite's row, else the list's template.</summary>
    public UIClientComponent Root
        => Page.At(Page.RowTemplate(Host.ComponentId, HostKeys, Entry.Item), RowKeys);

    /// <summary>Gets the component in the composite variant slot <paramref name="variantKey"/> for this row, or <see langword="null"/> where the host defines none.</summary>
    public UIClientComponent? Slot(string variantKey, string? variantKeyPropertyName = null)
        => Page.RowCompositeSlot(Host.ComponentId, RowKeys, Entry.Item, variantKey, variantKeyPropertyName);

    /// <summary>Gets the component shown on a right click or a long press on the row.</summary>
    public UIClientComponent ContextMenu => Root.ContextMenu;

    /// <summary>Gets the sub-entries a menu row shows now, in the order the server sent them; empty where the row opens none.</summary>
    public IReadOnlyList<UIClientRow> Rows => Page.SubmenuRows(Host.ComponentId, RowKeys);

    /// <summary>Gets the item as <typeparamref name="TItem"/>.</summary>
    /// <exception cref="InvalidOperationException">The item is of another type.</exception>
    public TItem ItemAs<TItem>()
        => TryItemAs(out TItem? item)
            ? item
            : throw new InvalidOperationException($"Row '{Key}' holds a '{Entry.Item?.GetType().Name ?? "null"}', not a '{typeof(TItem).Name}'.");

    /// <summary>Attempts to read or materialize the row item as <typeparamref name="TItem"/>.</summary>
    public bool TryItemAs<TItem>([NotNullWhen(true)] out TItem? item)
        => CompiledViewWireSerializer.TryMaterializeItem(Entry.Item, out item) && item is not null;

    /// <summary>Gets the sub-entry under this menu row with the key <paramref name="key"/>.</summary>
    /// <exception cref="InvalidOperationException">The row shows no such sub-entry, or several deeper sub-entries share that key.</exception>
    public UIClientRow Row(string key)
        => Page.FindSubmenuRow(Host, RowKeys, Key, key);

    /// <summary>Gets the component with the authored id <paramref name="id"/> in this row.</summary>
    public UIClientComponent Component(string id)
        => Page.Find(id, Scope, RowKeys, Entry.Item);

    /// <summary>Gets the one component in this row bound to <paramref name="path"/> on the item.</summary>
    public UIClientComponent ComponentBoundTo<TItem>(Expression<Func<TItem, object?>> path)
        => ComponentBoundTo(RecursivePath.FromExpression(path).ToString());

    /// <summary>Gets the one component in this row bound to <paramref name="path"/> on the item.</summary>
    public UIClientComponent ComponentBoundTo(string path)
        => Page.FindBoundTo(path, Scope, RowKeys, Entry.Item);

    /// <summary>Gets the one component in this row a reader knows by <paramref name="name"/>.</summary>
    public UIClientComponent ComponentNamed(string name)
        => Page.FindNamed(name, Scope, RowKeys, Entry.Item);

    private UIComponentId Scope => Page.RowScope(Host.ComponentId, HostKeys, Entry.Item);

    private object?[] RowKeys => [.. HostKeys, Entry.Key];

    /// <summary>Presses the row: its template's click command, with the row's key.</summary>
    public Task<UIClientCommandResult> ClickAsync(CancellationToken cancellationToken = default)
        => Root.ClickAsync(cancellationToken);

    /// <summary>Commits <paramref name="title"/> as an inline rename on this row, writing <c>RenamedTitle</c> and raising <c>rename</c>.</summary>
    public Task<UIClientCommandResult> RenameAsync(string title, CancellationToken cancellationToken = default)
        => Page.RenameRowAsync(Host, HostKeys, Entry, title, cancellationToken);

    /// <summary>
    /// Chooses the row as a press does: the host's chosen key or option value written where the host binds it to write back, then the row's
    /// click command where it has one and the write succeeded.
    /// </summary>
    public async Task<UIClientCommandResult> ChooseAsync(CancellationToken cancellationToken = default)
    {
        await Page.EnsureRowChoosableAsync(Host, HostKeys, RowKeys, Entry, cancellationToken).ConfigureAwait(false);

        UIClientComponent root = Root;
        UIClientCommandResult? chosen = null;

        if (Page.ChoiceWrite(Host, HostKeys, Key) is (UIProperty property, object value))
            chosen = await Page.SetValueAsync(Host.ComponentId, HostKeys, property, value, cancellationToken).ConfigureAwait(false);

        if (chosen is { Succeeded: false })
            return chosen;

        if ((root.HasEvent(EventNames.Click) && root.Get<bool?>(IClickableComponent.ClickableProperty) is not false) || chosen is null)
            return await root.ClickAsync(cancellationToken).ConfigureAwait(false);

        return chosen;
    }

    /// <inheritdoc />
    public override string ToString()
        => $"row '{Key}' of '{Host.AuthoringId}'";
}
