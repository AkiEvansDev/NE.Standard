using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Serialization;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Client;

/// <summary>A row a host holds: its key and the item the change set carried.</summary>
public sealed record UIClientRowEntry(string Key, object? Item);

internal sealed class UIClientRowBuffer
{
    private Dictionary<string, int>? _indexByKey;

    public List<UIClientRowEntry> Items { get; } = [];

    public void Clear()
    {
        Items.Clear();
        _indexByKey?.Clear();
    }

    public void ResetFrom(List<UIClientRowEntry> rows)
    {
        Items.Clear();
        Items.AddRange(rows);
        _indexByKey = null;
    }

    public void InsertAt(int index, UIClientRowEntry entry)
    {
        var clamped = Math.Clamp(index, 0, Items.Count);

        if (clamped == Items.Count)
        {
            Items.Add(entry);
            _indexByKey?[entry.Key] = Items.Count - 1;
            return;
        }

        Items.Insert(clamped, entry);
        _indexByKey = null;
    }

    public void RemoveAt(int index)
    {
        Items.RemoveAt(index);
        _indexByKey = null;
    }

    public void ReplaceAt(int index, UIClientRowEntry entry)
    {
        var previousKey = Items[index].Key;
        Items[index] = entry;

        if (_indexByKey is not null)
        {
            if (!string.Equals(previousKey, entry.Key, StringComparison.Ordinal))
                _ = _indexByKey.Remove(previousKey);

            _indexByKey[entry.Key] = index;
        }
    }

    public void Move(int oldIndex, int newIndex)
    {
        UIClientRowEntry entry = Items[oldIndex];
        Items.RemoveAt(oldIndex);
        Items.Insert(Math.Clamp(newIndex, 0, Items.Count), entry);
        _indexByKey = null;
    }

    public int IndexOf(string? key, int? index)
    {
        if (key is not null)
            return TryGetIndexByKey(key, out var found) ? found : -1;

        return index is int at && at >= 0 && at < Items.Count ? at : -1;
    }

    public bool TryGetByKey(string key, [NotNullWhen(true)] out UIClientRowEntry? entry)
    {
        if (TryGetIndexByKey(key, out var at))
        {
            entry = Items[at];
            return true;
        }

        entry = null;
        return false;
    }

    private bool TryGetIndexByKey(string key, out int index)
    {
        if (Items.Count <= 8)
        {
            for (var i = 0; i < Items.Count; i++)
            {
                if (string.Equals(Items[i].Key, key, StringComparison.Ordinal))
                {
                    index = i;
                    return true;
                }
            }

            index = -1;
            return false;
        }

        if (_indexByKey is null)
        {
            _indexByKey = new Dictionary<string, int>(Items.Count, StringComparer.Ordinal);
            for (var i = 0; i < Items.Count; i++)
                _indexByKey[Items[i].Key] = i;
        }

        return _indexByKey.TryGetValue(key, out index);
    }
}

public sealed partial class UIClientPage
{
    private static readonly JsonSerializerOptions ItemJsonOptions = new(JsonSerializerDefaults.Web);

    /// <summary>Takes the attached transport and applies the snapshot a connecting page starts from: every binding's value and every list.</summary>
    public async Task StartAsync(CancellationToken cancellationToken = default)
    {
        await StartCoreAsync(keepNavigation: false, cancellationToken).ConfigureAwait(false);
        NotifyIfChanged();
    }

    private async Task StartCoreAsync(bool keepNavigation, CancellationToken cancellationToken)
    {
        if (!keepNavigation)
        {
            lock (_sync)
            {
                _navigation = Transport.InitialNavigation;
                _history.Clear();
                _history.Add(_navigation);
                _historyIndex = 0;
            }
        }

        if (!Transport.HasController)
            return;

        UIBindingId[] bindings = [.. View.Bindings.All.Where(static binding => binding.Kind == CompiledUIBindingKind.ComponentProperty).Select(static binding => binding.Id)];
        ServerChangeSet snapshot = await Transport.BuildAttachChangesAsync(bindings, cancellationToken).ConfigureAwait(false);

        ApplyReceivedChanges(snapshot);
    }

    /// <summary>Applies a change set the page was sent: an answer, a push or the flush.</summary>
    public void Receive(ServerChangeSet changes)
    {
        ArgumentNullException.ThrowIfNull(changes);

        bool scheduled;

        lock (_sync)
        {
            ApplyNoLock(changes.For(Transport.InstanceId));
            scheduled = ScheduleReactionDrainNoLock();
        }

        if (!scheduled)
            NotifyIfChanged();
    }

    /// <summary>Applies a change set pushed to the page and awaits any resync or deferred reactions it triggers.</summary>
    internal async Task ReceivePushedAsync(ServerChangeSet changes, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(changes);

        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);

        lock (_sync)
            ApplyNoLock(changes.For(Transport.InstanceId));

        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
        NotifyIfChanged();
    }

    /// <summary>Applies a result pushed to the page — a background command's, a session's switch — and runs its effects.</summary>
    public void Receive(UICommandExecutionResult result)
    {
        ArgumentNullException.ThrowIfNull(result);

        bool scheduled;

        lock (_sync)
        {
            ApplyNoLock(result.Changes.For(Transport.InstanceId));
            ApplyEffectsNoLock(result.Command.Effects);
            scheduled = ScheduleReactionDrainNoLock();
        }

        if (!scheduled)
            NotifyIfChanged();
    }

    /// <summary>Applies a result pushed to the page and awaits any resync or effects reactions it triggers.</summary>
    internal async Task ReceivePushedAsync(UICommandExecutionResult result, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(result);

        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);

        lock (_sync)
        {
            ApplyNoLock(result.Changes.For(Transport.InstanceId));
            ApplyEffectsNoLock(result.Command.Effects);
        }

        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
        NotifyIfChanged();
    }

    internal void ApplyReceivedChanges(ServerChangeSet changes)
    {
        lock (_sync)
            ApplyNoLock(changes.For(Transport.InstanceId));
    }

    internal Task DrainPendingReactionsAsync(CancellationToken cancellationToken)
    {
        Task pending;

        lock (_sync)
            pending = _pendingReactionDrain;

        return pending.IsCompletedSuccessfully ? Task.CompletedTask : pending.WaitAsync(cancellationToken);
    }

    private bool ScheduleReactionDrainNoLock()
    {
        if (!_resync && _reactions.Count == 0)
            return false;

        Task previous = _pendingReactionDrain;
        _pendingReactionDrain = Task.Run(() => DrainPushedReactionsAsync(previous), CancellationToken.None);
        return true;
    }

    private async Task DrainPushedReactionsAsync(Task previous)
    {
        try
        {
            await previous.ConfigureAwait(false);
            await ResyncIfAskedAsync(CancellationToken.None).ConfigureAwait(false);
            await RunReactionsAsync(CancellationToken.None).ConfigureAwait(false);
            NotifyIfChanged();
        }
        catch (Exception ex) when (ex is OperationCanceledException or ObjectDisposedException)
        {
            // Page or runtime closed while a background push's reaction was draining.
        }
    }

    /// <summary>Keeps a file the application sent the page to save.</summary>
    public void Receive(UIClientDownload download)
    {
        ArgumentNullException.ThrowIfNull(download);

        lock (_sync)
            _downloads.Add(download);

        NotifyIfChanged();
    }

    private void ApplyNoLock(ServerChangeSet changes)
    {
        ServerUIUpdate[] updates = changes.Updates;

        for (var i = 0; i < updates.Length; i++)
        {
            switch (updates[i])
            {
                case ServerValueUIUpdate value:
                    ApplyValueNoLock(value);
                    break;
                case ServerCollectionChangeUIUpdate { Action: CollectionUpdateAction.Reset } reset when ReadRefill(updates, i) is { Count: > 0 } refill:
                    RefillNoLock(reset.Component, refill);
                    i += refill.Count;
                    break;
                case ServerCollectionChangeUIUpdate collection:
                    ApplyCollectionNoLock(collection);
                    break;
                case ServerValidationUIUpdate refusal:
                    FieldNoLock(refusal.Address.Component).Refusal = refusal.Message is null ? null : new UIClientRefusal(refusal.Message, refusal.Severity, refusal.Address.Property);
                    FieldNoLock(refusal.Address.Component).Touched |= refusal.Message is not null;
                    _ = _changedValidations.Add(refusal.Address.Component);
                    break;
                case ServerPageUIUpdate page:
                    HoldsUnsavedWork = page.HoldsUnsavedWork;
                    break;
                case ServerFullResyncUIUpdate:
                    _resync = true;
                    break;
                default:
                    break;
            }
        }
    }

    /// <summary>
    /// A value the server gave, as the page takes it: a held field keeps the reader's edit and the value waits aside for a discard;
    /// any other is written, and what was said of the value it replaced goes — a refusal of that property, a bound's of the value.
    /// </summary>
    private void ApplyValueNoLock(ServerValueUIUpdate update)
    {
        UIPropertyAddress address = update.Address;
        var value = View.Bindings.TryGetProperty(new UIPropertyAddress(address.Component.Id, address.Property), out CompiledUIBinding? binding)
            ? CompiledViewWireSerializer.CoerceWireValue(binding.TargetValueType, update.Value)
            : update.Value;

        if (_held.ContainsKey(address))
        {
            _serverValues[address] = value;
            return;
        }

        WriteValueNoLock(address, value, local: false, depth: 0, writes: []);
        ClearShadowedRowValuesNoLock(address);

        if (!_fields.TryGetValue(address.Component, out UIClientField? field))
            return;

        if (field.Refusal?.Property == address.Property)
        {
            field.Refusal = null;
            _ = _changedValidations.Add(address.Component);
        }

        // Bounds that moved judge the reader's value again.
        if (address.Property == IInputComponent.ValueProperty || address.Property == IPeriodInputComponent.EndValueProperty)
        {
            _ = field.WithheldByBounds.Remove(address.Property);
            _ = _serverValues.Remove(address);
            RejudgeBoundsNoLock(address.Component, field);
        }
        else if (address.Property == IBoundedInputComponent.MinProperty || address.Property == IBoundedInputComponent.MaxProperty || address.Property == IPeriodInputComponent.MinDistanceProperty)
        {
            if (field.BoundRefusal is not null || field.WithheldByBounds.Count > 0 || HasHeldComponentValueNoLock(address.Component))
                RejudgeBoundsNoLock(address.Component, field);
        }
    }

    private bool HasHeldComponentValueNoLock(UIComponentAddress component)
        => _held.ContainsKey(new UIPropertyAddress(component, IInputComponent.ValueProperty))
            || _held.ContainsKey(new UIPropertyAddress(component, IPeriodInputComponent.EndValueProperty));

    private void RejudgeBoundsNoLock(UIComponentAddress component, UIClientField field)
    {
        field.BoundRefusal = BoundRefusalNoLock(component);
        _ = _changedValidations.Add(component);

        if (field.BoundRefusal is null && field.WithheldByBounds.Count > 0)
        {
            List<UIClientWrite> deferred = [with(field.WithheldByBounds.Count)];

            foreach (UIProperty withheld in field.WithheldByBounds)
            {
                UIPropertyAddress withheldAddress = new(component, withheld);
                _ = _serverValues.Remove(withheldAddress);
                deferred.Add(new UIClientWrite(withheldAddress, ReadNoLock(component.Id, component.DynamicParameters, withheld)));
            }

            field.WithheldByBounds.Clear();
            _reactions.Add(new UIClientReaction(DeferredWrites: deferred));
        }
    }

    private void ClearShadowedRowValuesNoLock(UIPropertyAddress outer)
    {
        if (!_scopedValues.TryGetValue((outer.Component.Id, outer.Property), out HashSet<UIPropertyAddress>? candidates))
            return;

        List<UIPropertyAddress>? shadowed = null;

        foreach (UIPropertyAddress held in candidates)
        {
            if (held.Component.DynamicParameters.Length > outer.Component.DynamicParameters.Length
                && !_held.ContainsKey(held)
                && HasRowKeyPrefix(held.Component.DynamicParameters, outer.Component.DynamicParameters))
            {
                (shadowed ??= []).Add(held);
            }
        }

        if (shadowed is null)
            return;

        for (var i = 0; i < shadowed.Count; i++)
        {
            _ = RemoveValueEntryNoLock(shadowed[i]);
            _ = _changedProperties.Add(shadowed[i]);
        }
    }

    internal bool RemoveValueEntryNoLock(UIPropertyAddress address)
    {
        if (!_values.Remove(address))
            return false;

        _visibleRowsStamp++;

        if (address.Component.DynamicParameters.Length == 0)
            return true;

        (UIComponentId Id, UIProperty Property) propKey = (address.Component.Id, address.Property);

        if (_scopedValues.TryGetValue(propKey, out HashSet<UIPropertyAddress>? byProp))
        {
            _ = byProp.Remove(address);
            if (byProp.Count == 0)
                _ = _scopedValues.Remove(propKey);
        }

        IReadOnlyList<UIComponentId> scopes = View.Graph.GetItemScopes(address.Component.Id);
        var count = Math.Min(scopes.Count, address.Component.DynamicParameters.Length);

        for (var i = 0; i < count; i++)
        {
            UIComponentAddress host = new(HostOf(scopes[i]), address.Component.DynamicParameters[..i]);
            var rowKey = KeyString(address.Component.DynamicParameters[i]);

            if (_valuesByRow.TryGetValue((host, rowKey), out HashSet<UIPropertyAddress>? byRow))
            {
                _ = byRow.Remove(address);
                if (byRow.Count == 0)
                {
                    _ = _valuesByRow.Remove((host, rowKey));
                    if (_rowKeysByHost.TryGetValue(host, out HashSet<string>? keys) && keys.Remove(rowKey) && keys.Count == 0)
                        _ = _rowKeysByHost.Remove(host);
                }
            }
        }

        return true;
    }

    internal void SetValueEntryNoLock(UIPropertyAddress address, object? value)
    {
        var isNew = !_values.ContainsKey(address);
        _values[address] = value;
        _visibleRowsStamp++;

        if (!isNew || address.Component.DynamicParameters.Length == 0)
            return;

        (UIComponentId Id, UIProperty Property) propKey = (address.Component.Id, address.Property);

        if (!_scopedValues.TryGetValue(propKey, out HashSet<UIPropertyAddress>? byProp))
        {
            byProp = [];
            _scopedValues.Add(propKey, byProp);
        }

        _ = byProp.Add(address);

        IReadOnlyList<UIComponentId> scopes = View.Graph.GetItemScopes(address.Component.Id);
        var count = Math.Min(scopes.Count, address.Component.DynamicParameters.Length);

        for (var i = 0; i < count; i++)
        {
            UIComponentAddress host = new(HostOf(scopes[i]), address.Component.DynamicParameters[..i]);
            var rowKey = KeyString(address.Component.DynamicParameters[i]);

            if (!_valuesByRow.TryGetValue((host, rowKey), out HashSet<UIPropertyAddress>? byRow))
            {
                byRow = [];
                _valuesByRow.Add((host, rowKey), byRow);
            }

            _ = byRow.Add(address);

            if (!_rowKeysByHost.TryGetValue(host, out HashSet<string>? keys))
            {
                keys = [with(StringComparer.Ordinal)];
                _rowKeysByHost.Add(host, keys);
            }

            _ = keys.Add(rowKey);
        }
    }

    private static string KeyString(object? key)
        => key as string ?? Convert.ToString(key, CultureInfo.InvariantCulture) ?? string.Empty;

    /// <summary>
    /// The inserts right after a reset on the same host — a controller's <c>Clear()</c> and its <c>Add</c>s — read as one "the list is now
    /// exactly this", as the page reads them (<c>readCollectionRefill</c>); none where no insert follows.
    /// </summary>
    private static List<ServerCollectionChangeUIUpdate> ReadRefill(ServerUIUpdate[] updates, int reset)
    {
        UIComponentAddress host = ((ServerCollectionChangeUIUpdate)updates[reset]).Component;
        List<ServerCollectionChangeUIUpdate> inserts = [];

        for (var i = reset + 1; i < updates.Length && updates[i] is ServerCollectionChangeUIUpdate { Action: CollectionUpdateAction.Insert } insert && insert.Component == host; i++)
            inserts.Add(insert);

        return inserts;
    }

    /// <summary>
    /// Reconciles a host's rows with a refill by key: a row resent with the same item keeps what the page holds under it — values,
    /// lists, fields — and one redrawn or gone forgets it.
    /// </summary>
    private void RefillNoLock(UIComponentAddress host, List<ServerCollectionChangeUIUpdate> inserts)
    {
        UIClientRowBuffer buffer = RowsForChangeNoLock(host);
        Dictionary<string, UIClientRowEntry> previous = new(buffer.Items.Count, StringComparer.Ordinal);

        foreach (UIClientRowEntry row in buffer.Items)
            previous[row.Key] = row;

        List<UIClientRowEntry> refilled = [];

        // The first insert's rows as they came; each later one's at its index in the list the ones before it left, else last.
        for (var i = 0; i < inserts.Count; i++)
        {
            foreach (ServerCollectionItemChange change in inserts[i].Items)
            {
                UIClientRowEntry row = new(change.Key ?? KeyOf(change.Item), change.Item);

                refilled.Insert(i > 0 && change.Index is int at && at >= 0 && at < refilled.Count ? at : refilled.Count, row);
            }
        }

        for (var i = 0; i < refilled.Count; i++)
        {
            if (!previous.Remove(refilled[i].Key, out UIClientRowEntry? kept))
                continue;

            if (IsSameItem(kept.Item, refilled[i].Item))
                refilled[i] = kept;
            else
                DropRowNoLock(host, kept.Key);
        }

        foreach (var gone in previous.Keys)
            DropRowNoLock(host, gone);

        buffer.ResetFrom(refilled);
        _visibleRowsStamp++;
        _ = _changedCollections.Add(host);
    }

    /// <summary>Whether a row's item is the one it was: the same object, or one that writes the same JSON, as the page compares the items it was sent.</summary>
    private static bool IsSameItem(object? kept, object? item)
        => ReferenceEquals(kept, item) || Equals(kept, item) || JsonSerializer.Serialize(kept, ItemJsonOptions) == JsonSerializer.Serialize(item, ItemJsonOptions);

    private void ApplyCollectionNoLock(ServerCollectionChangeUIUpdate update)
    {
        UIClientRowBuffer rows = RowsForChangeNoLock(update.Component);

        switch (update.Action)
        {
            case CollectionUpdateAction.Reset:
                rows.Clear();
                DropRowNoLock(update.Component, key: null);
                break;
            case CollectionUpdateAction.Insert:
                foreach (ServerCollectionItemChange change in update.Items)
                {
                    UIClientRowEntry row = new(change.Key ?? KeyOf(change.Item), change.Item);

                    rows.InsertAt(change.Index ?? rows.Items.Count, row);
                }

                break;
            case CollectionUpdateAction.Remove:
                foreach (ServerCollectionItemChange change in update.Items)
                {
                    var at = rows.IndexOf(change.Key, change.Index);

                    if (at < 0)
                        continue;

                    DropRowNoLock(update.Component, rows.Items[at].Key);
                    rows.RemoveAt(at);
                }

                break;
            case CollectionUpdateAction.Replace:
                foreach (ServerCollectionItemChange change in update.Items)
                {
                    var at = rows.IndexOf(change.OldKey ?? change.Key, change.Index);
                    UIClientRowEntry row = new(change.Key ?? KeyOf(change.Item), change.Item);

                    // A row it replaces no longer there is drawn where the change places it, as an insert is.
                    if (at < 0)
                    {
                        rows.InsertAt(change.Index ?? rows.Items.Count, row);
                        continue;
                    }

                    DropRowNoLock(update.Component, rows.Items[at].Key);
                    rows.ReplaceAt(at, row);
                }

                break;
            case CollectionUpdateAction.Move:
                foreach (ServerCollectionMoveChange move in update.Moves)
                {
                    var at = rows.IndexOf(move.Key, move.OldIndex);

                    if (at < 0)
                        continue;

                    rows.Move(at, move.NewIndex ?? rows.Items.Count);
                }

                break;
            default:
                break;
        }

        _visibleRowsStamp++;
        _ = _changedCollections.Add(update.Component);
    }

    /// <summary>The rows a change applies to: the ones the page holds, else — a list nested in a row — those its row's item carried.</summary>
    private UIClientRowBuffer RowsForChangeNoLock(UIComponentAddress host)
    {
        if (!_rows.TryGetValue(host, out UIClientRowBuffer? rows))
        {
            rows = new UIClientRowBuffer();
            rows.ResetFrom(ReadSourceRowsNoLock(host));
            _rows.Add(host, rows);
        }

        return rows;
    }

    /// <summary>The source rows a host holds before client-side filtering or sorting: those the page holds, else the list its binding reads off its row's item or its own static items.</summary>
    private List<UIClientRowEntry> ReadSourceRowsNoLock(UIComponentAddress host)
    {
        if (_rows.TryGetValue(host, out UIClientRowBuffer? held))
            return held.Items;

        if (ReadNoLock(host.Id, host.DynamicParameters, IItemsComponent.ItemsProperty) is not IEnumerable items || items is string)
            return [];

        List<UIClientRowEntry> rows = [];

        foreach (var item in items)
        {
            if (TryKeyOf(item, out var key))
                rows.Add(new UIClientRowEntry(key, item));
        }

        return rows;
    }

    internal bool TryGetSourceRowNoLock(UIComponentAddress host, string key, [NotNullWhen(true)] out UIClientRowEntry? entry)
    {
        if (_rows.TryGetValue(host, out UIClientRowBuffer? held))
            return held.TryGetByKey(key, out entry);

        foreach (UIClientRowEntry candidate in ReadSourceRowsNoLock(host))
        {
            if (string.Equals(candidate.Key, key, StringComparison.Ordinal))
            {
                entry = candidate;
                return true;
            }
        }

        entry = null;
        return false;
    }

    private static string KeyOf(object? item)
        => TryKeyOf(item, out var id) ? id : throw new InvalidOperationException($"A row of type '{item?.GetType().Name ?? "null"}' carries no key.");

    private static bool TryKeyOf(object? item, [NotNullWhen(true)] out string? key)
    {
        if (item is IBindableItem { Id: { Length: > 0 } id })
        {
            key = id;
            return true;
        }

        if (ItemContext.TryReadProperty(item, nameof(IBindableItem.Id), out var raw) && raw is string { Length: > 0 } wireId)
        {
            key = wireId;
            return true;
        }

        key = null;
        return false;
    }

    /// <summary>Forgets what the page held under a row that went, or under every row of a host that was reset: values, lists and fields.</summary>
    private void DropRowNoLock(UIComponentAddress host, string? key)
    {
        DropRowValuesNoLock(host, key);

        if (_held.Count > 0)
        {
            List<UIPropertyAddress>? droppedHeld = null;

            foreach (UIPropertyAddress address in _held.Keys)
            {
                if (IsUnderRow(address.Component, host, key))
                    (droppedHeld ??= []).Add(address);
            }

            if (droppedHeld is not null)
            {
                for (var i = 0; i < droppedHeld.Count; i++)
                    _ = _held.Remove(droppedHeld[i]);
            }
        }

        if (_serverValues.Count > 0)
        {
            List<UIPropertyAddress>? droppedServer = null;

            foreach (UIPropertyAddress address in _serverValues.Keys)
            {
                if (IsUnderRow(address.Component, host, key))
                    (droppedServer ??= []).Add(address);
            }

            if (droppedServer is not null)
            {
                for (var i = 0; i < droppedServer.Count; i++)
                    _ = _serverValues.Remove(droppedServer[i]);
            }
        }

        if (_rows.Count > 0)
        {
            List<UIComponentAddress>? droppedLists = null;

            foreach (UIComponentAddress list in _rows.Keys)
            {
                if (IsUnderRow(list, host, key))
                    (droppedLists ??= []).Add(list);
            }

            if (droppedLists is not null)
            {
                for (var i = 0; i < droppedLists.Count; i++)
                {
                    if (_rows.Remove(droppedLists[i]))
                        _ = _changedCollections.Add(droppedLists[i]);
                }
            }
        }

        if (_visibleRowsCache.Count > 0)
        {
            _ = _visibleRowsCache.Remove(host);

            List<UIComponentAddress>? droppedVisible = null;

            foreach (UIComponentAddress cached in _visibleRowsCache.Keys)
            {
                if (IsUnderRow(cached, host, key))
                    (droppedVisible ??= []).Add(cached);
            }

            if (droppedVisible is not null)
            {
                for (var i = 0; i < droppedVisible.Count; i++)
                    _ = _visibleRowsCache.Remove(droppedVisible[i]);
            }
        }

        if (_fields.Count > 0)
        {
            List<UIComponentAddress>? droppedFields = null;

            foreach (UIComponentAddress field in _fields.Keys)
            {
                if (IsUnderRow(field, host, key))
                    (droppedFields ??= []).Add(field);
            }

            if (droppedFields is not null)
            {
                for (var i = 0; i < droppedFields.Count; i++)
                {
                    if (_fields.Remove(droppedFields[i]))
                        _ = _changedValidations.Add(droppedFields[i]);
                }
            }
        }

        if (_openedRenames.Count > 0)
        {
            List<UIComponentAddress>? droppedRenames = null;

            foreach (UIComponentAddress rename in _openedRenames)
            {
                if (IsUnderRow(rename, host, key))
                    (droppedRenames ??= []).Add(rename);
            }

            if (droppedRenames is not null)
            {
                for (var i = 0; i < droppedRenames.Count; i++)
                    _ = _openedRenames.Remove(droppedRenames[i]);
            }
        }
    }

    private void DropRowValuesNoLock(UIComponentAddress host, string? key)
    {
        if (key is not null)
        {
            DropSingleRowValuesNoLock(host, key);
            return;
        }

        if (!_rowKeysByHost.Remove(host, out HashSet<string>? keys))
            return;

        foreach (var rowKey in keys)
            DropSingleRowValuesNoLock(host, rowKey);
    }

    private void DropSingleRowValuesNoLock(UIComponentAddress host, string key)
    {
        if (!_valuesByRow.TryGetValue((host, key), out HashSet<UIPropertyAddress>? bucket) || bucket.Count == 0)
            return;

        UIPropertyAddress[] addresses = [.. bucket];

        for (var i = 0; i < addresses.Length; i++)
        {
            UIPropertyAddress address = addresses[i];
            _ = _redirectedTargets.Remove(address);

            if (RemoveValueEntryNoLock(address))
                _ = _changedProperties.Add(address);
        }
    }

    private bool IsUnderRow(UIComponentAddress component, UIComponentAddress host, string? key)
    {
        var keys = component.DynamicParameters;
        var depth = host.DynamicParameters.Length;

        return keys.Length > depth
            && StartsWith(keys, host.DynamicParameters)
            && (key is null || Equals(keys[depth], key))
            && IsInHostSubtree(component.Id, host.Id);
    }

    private bool IsInHostSubtree(UIComponentId componentId, UIComponentId hostId)
    {
        for (UIComponentId? current = componentId; current is UIComponentId id && View.Graph.TryGet(id, out UIComponentNode? node); current = node.ParentId)
        {
            if (id.Equals(hostId))
                return true;
        }

        return false;
    }

    private static bool StartsWith(object?[] keys, object?[] prefix)
    {
        for (var i = 0; i < prefix.Length; i++)
        {
            if (!Equals(keys[i], prefix[i]))
                return false;
        }

        return true;
    }

    private UIClientField FieldNoLock(UIComponentAddress component)
    {
        if (!_fields.TryGetValue(component, out UIClientField? field))
        {
            field = new UIClientField();
            _fields.Add(component, field);
        }

        return field;
    }

    /// <summary>
    /// Runs the effects the page was sent, as the client does: dialogs open and close — the viewer's close raising the dialog's close
    /// once the act is done — an address effect rewrites the address and history, a discard lets a form's held edits go, and a language
    /// or theme the session does not hold yet is told to the session.
    /// </summary>
    private void ApplyEffectsNoLock(IReadOnlyList<ClientEffect> effects, UIComponentAddress? source = null, int depth = 0, List<UIClientWrite>? writes = null)
    {
        foreach (ClientEffect effect in effects)
        {
            _effects.Add(effect);
            _changedEffects.Add(effect);

            switch (effect)
            {
                case OpenDialogEffect open:
                    if (_openDialogs.Add(DeclaredDialog(open.DialogKey).Key))
                        _dialogsChanged = true;
                    break;
                case CloseDialogEffect { RaisesClose: true } close:
                    CloseAsTheViewerNoLock(DeclaredDialog(close.DialogKey));
                    break;
                case CloseDialogEffect close:
                    if (_openDialogs.Remove(DeclaredDialog(close.DialogKey).Key))
                        _dialogsChanged = true;
                    break;
                case ReplaceAddressEffect replace:
                    UINavigationRequest replaced = new() { Route = _navigation.Route, Parameters = replace.Parameters };
                    _navigation = replaced;
                    _history[_historyIndex] = replaced;
                    _navigationChanged = true;
                    break;
                case PushAddressEffect push:
                    UINavigationRequest pushed = new() { Route = _navigation.Route, Parameters = push.Parameters };
                    if (!string.Equals(UINavigationAddress.Format(pushed), UINavigationAddress.Format(_navigation), StringComparison.Ordinal))
                    {
                        if (_historyIndex + 1 < _history.Count)
                            _history.RemoveRange(_historyIndex + 1, _history.Count - (_historyIndex + 1));

                        _history.Add(pushed);
                        _historyIndex = _history.Count - 1;
                    }

                    _navigation = pushed;
                    _navigationChanged = true;
                    break;
                case NavigateBackEffect back:
                    if (_historyIndex > 0)
                    {
                        _historyIndex--;
                        _navigation = _history[_historyIndex];
                        _navigationChanged = true;
                        _reactions.Add(new UIClientReaction(NavigateInPlace: _navigation.Parameters, HasNavigateInPlace: true));
                    }
                    else
                    {
                        UINavigationRequest fallback = UINavigationAddress.Parse(back.Fallback);

                        if (IsSameRoute(fallback.Route, Route))
                        {
                            UINavigationRequest origin = _navigation;
                            _navigation = fallback;
                            _history[0] = fallback;
                            _navigationChanged = true;
                            _reactions.Add(new UIClientReaction(NavigateInPlace: fallback.Parameters, HasNavigateInPlace: true, FallbackOrigin: origin));
                        }
                    }

                    break;
                case DiscardFormEffect discard:
                    DiscardFormNoLock(discard.FormId);
                    break;
                case InsertTextEffect { ResolvedTarget: { } insertTarget } insert:
                    ApplyInsertTextNoLock(insert, insertTarget, source, depth, writes);
                    break;
                case RenameItemEffect { ResolvedTarget: { } renameTarget } rename:
                    OpenRenameNoLock(rename, renameTarget, source);
                    break;
                case SetLanguageEffect or SetThemeEffect or SetThemeColorsEffect when !Transport.SessionHolds(effect):
                    _reactions.Add(new UIClientReaction(Setting: effect));
                    break;
                default:
                    break;
            }
        }
    }

    private static bool IsSameRoute(string left, string right)
        => string.Equals(UIRoutePath.Normalize(left), UIRoutePath.Normalize(right), StringComparison.OrdinalIgnoreCase);

    private void ApplyInsertTextNoLock(InsertTextEffect insert, UIComponentAddress target, UIComponentAddress? source, int depth, List<UIClientWrite>? writes)
    {
        var text = ResolveInsertTextNoLock(insert, source);

        if (string.IsNullOrEmpty(text))
            return;

        UIComponentId targetId = target.Id;

        if (!View.Graph.TryGet(targetId, out _))
            return;

        var scopeDepth = View.Graph.GetItemScopes(targetId).Count;
        var targetKeys = target.DynamicParameters.Length > 0
            ? target.DynamicParameters
            : source is UIComponentAddress src && src.DynamicParameters.Length >= scopeDepth
                ? src.DynamicParameters[..scopeDepth]
                : [];

        if (targetKeys.Length < scopeDepth)
            return;

        if (!IsShownNoLock(targetId, targetKeys) || !IsEnabledNoLock(targetId, targetKeys) || ReadNoLock(targetId, targetKeys, IInputComponent.IsReadOnlyProperty) is true)
            return;

        var current = ReadNoLock(targetId, targetKeys, IInputComponent.ValueProperty)?.ToString() ?? string.Empty;
        var next = current + text;

        if (ReadNoLock(targetId, targetKeys, ITextLengthComponent.MaxLengthProperty) is int maxLength and >= 0 && next.Length > maxLength)
            return;

        UIPropertyAddress address = new(new UIComponentAddress(targetId, targetKeys), IInputComponent.ValueProperty);
        CompiledUIBinding? binding = BindingOf(targetId, IInputComponent.ValueProperty);
        UIClientField field = FieldNoLock(address.Component);

        field.Touched = true;
        _ = _changedValidations.Add(address.Component);

        if (binding is { Mode: UIBindingMode.OnSubmit } && !_held.ContainsKey(address))
            _serverValues[address] = ReadNoLock(targetId, targetKeys, IInputComponent.ValueProperty);

        List<UIClientWrite> targetWrites = writes ?? [];
        WriteValueNoLock(address, next, local: true, depth + 1, targetWrites);
        var outOfBounds = JudgeBoundsNoLock(address.Component);

        if (binding is { Mode: UIBindingMode.OnSubmit })
        {
            _held[address] = next;
        }
        else if (binding is { Mode: UIBindingMode.TwoWay or UIBindingMode.OneWayToSource })
        {
            if (outOfBounds)
            {
                _ = field.WithheldByBounds.Add(IInputComponent.ValueProperty);
            }
            else
            {
                _ = field.WithheldByBounds.Remove(IInputComponent.ValueProperty);
                targetWrites.Add(new UIClientWrite(address, next));
            }
        }

        if (writes is null && targetWrites.Count > 0)
            _reactions.Add(new UIClientReaction(DeferredWrites: targetWrites));
    }

    private string? ResolveInsertTextNoLock(InsertTextEffect insert, UIComponentAddress? source)
    {
        if (insert.ItemKey)
            return source is { DynamicParameters: { Length: > 0 } keys } && keys[^1] is { } key ? KeyString(key) : null;

        if (!insert.ItemValue)
            return insert.Text;

        if (source is not UIComponentAddress src)
            return null;

        List<UIDynamicParameterScope> scopes = ScopesNoLock(src.Id, src.DynamicParameters);

        if (scopes.Count > 0)
        {
            var rowItem = scopes[^1].Item;

            if (rowItem is IMenuItemModel { Value: UIPhrase modelValue } && Words(modelValue)?.Trim() is { Length: > 0 } trimmedModel)
                return trimmedModel;

            if (ItemContext.TryReadProperty(rowItem, nameof(IMenuItemModel.Value), out var rawValue) && Words(rawValue)?.Trim() is { Length: > 0 } trimmedWire)
                return trimmedWire;

            if (Words(ReadNoLock(src.Id, src.DynamicParameters, ITextBaseComponent.TitleProperty))?.Trim() is { Length: > 0 } sourceTitle)
                return sourceTitle;

            if (ItemContext.TryReadProperty(rowItem, nameof(IMenuItemModel.Title), out var itemTitle) && Words(itemTitle)?.Trim() is { Length: > 0 } rowTitle)
                return rowTitle;

            return null;
        }

        return Words(ReadNoLock(src.Id, src.DynamicParameters, ITextBaseComponent.TitleProperty))?.Trim() is { Length: > 0 } title ? title : null;
    }

    private void OpenRenameNoLock(RenameItemEffect rename, UIComponentAddress target, UIComponentAddress? source)
    {
        var scopeDepth = View.Graph.GetItemScopes(target.Id).Count;
        var targetKeys = target.DynamicParameters.Length > 0
            ? target.DynamicParameters
            : source is UIComponentAddress src && src.DynamicParameters.Length >= scopeDepth
                ? src.DynamicParameters[..scopeDepth]
                : [];

        if (targetKeys.Length < scopeDepth)
            return;

        if (rename.Key is { Length: > 0 } itemKey)
            _ = _openedRenames.Add(new UIComponentAddress(target.Id, [.. targetKeys, itemKey]));
        else
            _ = _openedRenames.Add(new UIComponentAddress(target.Id, targetKeys));
    }

    /// <summary>A dialog the page's view declares; one it does not is refused, as the runtime drops it and the page finds nothing.</summary>
    private CompiledDialog DeclaredDialog(string dialogKey)
        => View.FindDialog(dialogKey) ?? throw new InvalidOperationException($"An effect names dialog '{dialogKey}', which the page's view does not declare.");

    /// <summary>
    /// The viewer's own close of an open dialog, as the page runs it: the edit of a form under its key goes first, then its close is
    /// raised on its content once the act is done.
    /// </summary>
    private void CloseAsTheViewerNoLock(CompiledDialog dialog)
    {
        if (!_openDialogs.Contains(dialog.Key))
            return;

        DiscardDialogFormNoLock(dialog);
        _ = _openDialogs.Remove(dialog.Key);
        _dialogsChanged = true;
        _reactions.Add(new UIClientReaction(DialogClosed: dialog.RootComponentId));
    }

    /// <summary>Lets the edit of a form under the dialog's key go where a field of it stands in the dialog, as the page's dismiss does.</summary>
    private void DiscardDialogFormNoLock(CompiledDialog dialog)
    {
        foreach (UIComponentNode node in View.Graph.All)
        {
            if (!StandsUnder(node.ComponentId, dialog.RootComponentId))
                continue;

            foreach (UIComponentAddress address in EnumerateFieldAddressesNoLock(node.ComponentId))
            {
                if (IsInFormNoLock(address, dialog.Key))
                {
                    DiscardFormNoLock(dialog.Key);
                    return;
                }
            }
        }

        foreach (UIPropertyAddress held in _held.Keys)
        {
            if (StandsUnder(held.Component.Id, dialog.RootComponentId) && IsInFormNoLock(held.Component, dialog.Key))
            {
                DiscardFormNoLock(dialog.Key);
                return;
            }
        }

        foreach (UIComponentAddress field in _fields.Keys)
        {
            if (StandsUnder(field.Id, dialog.RootComponentId) && IsInFormNoLock(field, dialog.Key))
            {
                DiscardFormNoLock(dialog.Key);
                return;
            }
        }
    }

    private bool StandsUnder(UIComponentId componentId, UIComponentId root)
    {
        for (UIComponentId? at = componentId; at is UIComponentId id; at = View.Graph.GetRequired(id).ParentId)
        {
            if (id.Equals(root))
                return true;
        }

        return false;
    }

    /// <summary>
    /// Lets a form's held edits go, as the page's discard does: each field shows the server's latest value again, and what was said of
    /// the form's fields — the rules', the bounds' and the server's words, and that they were visited — goes with them. The controller's
    /// bound message stays its author's to take off.
    /// </summary>
    private void DiscardFormNoLock(string formId)
    {
        HashSet<UIPropertyAddress>? discarded = null;

        foreach (UIPropertyAddress address in _held.Keys)
        {
            if (IsInFormNoLock(address.Component, formId))
                _ = (discarded ??= []).Add(address);
        }

        foreach (KeyValuePair<UIComponentAddress, UIClientField> field in _fields)
        {
            if (field.Value.WithheldByBounds.Count == 0 || !IsInFormNoLock(field.Key, formId))
                continue;

            foreach (UIProperty property in field.Value.WithheldByBounds)
                _ = (discarded ??= []).Add(new UIPropertyAddress(field.Key, property));
        }

        if (discarded is not null)
        {
            foreach (UIPropertyAddress address in discarded)
            {
                _ = _held.Remove(address);
                if (_serverValues.Remove(address, out var server))
                    WriteValueNoLock(address, server, local: false, depth: 0, writes: []);
            }
        }

        // After the values: their restore judged the fields again, and that goes too.
        foreach (KeyValuePair<UIComponentAddress, UIClientField> field in _fields)
        {
            if (!IsInFormNoLock(field.Key, formId))
                continue;

            field.Value.Touched = false;
            field.Value.Failing.Clear();
            field.Value.WithheldByBounds.Clear();
            field.Value.Refusal = null;
            field.Value.BoundRefusal = null;
            field.Value.GateRefused = false;
            field.Value.LastEditedEnd = false;
            _ = _changedValidations.Add(field.Key);
        }
    }

    /// <summary>Starts the page again from a fresh snapshot where the server asked for a full resync.</summary>
    private async Task ResyncIfAskedAsync(CancellationToken cancellationToken)
    {
        lock (_sync)
        {
            if (!_resync)
                return;

            _resync = false;
            _fullResyncOccurred = true;
            ClearValueEntriesNoLock();
            _rows.Clear();
            _openedRenames.Clear();

            // A held field keeps the reader's edit through the rebuild, as the page's input does; the snapshot's value waits aside.
            foreach (KeyValuePair<UIPropertyAddress, object?> held in _held)
                SetValueEntryNoLock(held.Key, held.Value);

            foreach (KeyValuePair<UIComponentAddress, UIClientField> field in _fields)
            {
                if (!HasHeldPropertyNoLock(field.Key))
                {
                    field.Value.WithheldByBounds.Clear();
                    field.Value.Refusal = null;
                    field.Value.BoundRefusal = null;
                    field.Value.GateRefused = false;
                }
            }
        }

        await StartCoreAsync(keepNavigation: true, cancellationToken).ConfigureAwait(false);
    }

    private void ClearValueEntriesNoLock()
    {
        _values.Clear();
        _scopedValues.Clear();
        _valuesByRow.Clear();
        _rowKeysByHost.Clear();
        _redirectedTargets.Clear();
        _visibleRowsCache.Clear();
        _visibleRowsStamp++;
    }

    private bool HasHeldPropertyNoLock(UIComponentAddress component)
    {
        foreach (UIPropertyAddress held in _held.Keys)
        {
            if (held.Component == component)
                return true;
        }

        return false;
    }
}
