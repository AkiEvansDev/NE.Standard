using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Serialization;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Client;

/// <summary>A row a host holds: its key and the item the change set carried.</summary>
public sealed record UIClientRowEntry(string Key, object? Item);

public sealed partial class UIClientPage
{
    private static readonly JsonSerializerOptions ItemJsonOptions = new(JsonSerializerDefaults.Web);

    /// <summary>Takes the attached transport and applies the snapshot a connecting page starts from: every binding's value and every list.</summary>
    public Task StartAsync(CancellationToken cancellationToken = default)
        => StartCoreAsync(keepNavigation: false, cancellationToken);

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

        Receive(snapshot);
    }

    /// <summary>Applies a change set the page was sent: an answer, a push or the flush.</summary>
    public void Receive(ServerChangeSet changes)
    {
        lock (_sync)
            ApplyNoLock(changes.For(Transport.InstanceId));

        NotifyIfChanged();
    }

    /// <summary>Applies a result pushed to the page — a background command's, a session's switch — and runs its effects.</summary>
    public void Receive(UICommandExecutionResult result)
    {
        lock (_sync)
        {
            ApplyNoLock(result.Changes.For(Transport.InstanceId));
            ApplyEffectsNoLock(result.Command.Effects);
        }

        NotifyIfChanged();
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
            field.BoundRefusal = null;
            _ = _changedValidations.Add(address.Component);
        }
        else if (field.BoundRefusal is not null && (address.Property == IBoundedInputComponent.MinProperty || address.Property == IBoundedInputComponent.MaxProperty))
        {
            field.BoundRefusal = BoundRefusalNoLock(address.Component);
            _ = _changedValidations.Add(address.Component);
        }
    }

    private void ClearShadowedRowValuesNoLock(UIPropertyAddress outer)
    {
        List<UIPropertyAddress>? shadowed = null;

        foreach (UIPropertyAddress held in _values.Keys)
        {
            if (held.Component.Id == outer.Component.Id
                && held.Property == outer.Property
                && held.Component.DynamicParameters.Length > outer.Component.DynamicParameters.Length
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
            _ = _values.Remove(shadowed[i]);
            _ = _changedProperties.Add(shadowed[i]);
        }
    }

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
        List<UIClientRowEntry> rows = RowsForChangeNoLock(host);
        Dictionary<string, UIClientRowEntry> previous = new(StringComparer.Ordinal);

        foreach (UIClientRowEntry row in rows)
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

        rows.Clear();
        rows.AddRange(refilled);
        _ = _changedCollections.Add(host);
    }

    /// <summary>Whether a row's item is the one it was: the same object, or one that writes the same JSON, as the page compares the items it was sent.</summary>
    private static bool IsSameItem(object? kept, object? item)
        => ReferenceEquals(kept, item) || Equals(kept, item) || JsonSerializer.Serialize(kept, ItemJsonOptions) == JsonSerializer.Serialize(item, ItemJsonOptions);

    private void ApplyCollectionNoLock(ServerCollectionChangeUIUpdate update)
    {
        List<UIClientRowEntry> rows = RowsForChangeNoLock(update.Component);

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

                    rows.Insert(Math.Clamp(change.Index ?? rows.Count, 0, rows.Count), row);
                }

                break;
            case CollectionUpdateAction.Remove:
                foreach (ServerCollectionItemChange change in update.Items)
                {
                    var at = IndexOf(rows, change.Key, change.Index);

                    if (at < 0)
                        continue;

                    DropRowNoLock(update.Component, rows[at].Key);
                    rows.RemoveAt(at);
                }

                break;
            case CollectionUpdateAction.Replace:
                foreach (ServerCollectionItemChange change in update.Items)
                {
                    var at = IndexOf(rows, change.OldKey ?? change.Key, change.Index);
                    UIClientRowEntry row = new(change.Key ?? KeyOf(change.Item), change.Item);

                    // A row it replaces no longer there is drawn where the change places it, as an insert is.
                    if (at < 0)
                    {
                        rows.Insert(Math.Clamp(change.Index ?? rows.Count, 0, rows.Count), row);
                        continue;
                    }

                    DropRowNoLock(update.Component, rows[at].Key);
                    rows[at] = row;
                }

                break;
            case CollectionUpdateAction.Move:
                foreach (ServerCollectionMoveChange move in update.Moves)
                {
                    var at = IndexOf(rows, move.Key, move.OldIndex);

                    if (at < 0)
                        continue;

                    UIClientRowEntry row = rows[at];

                    rows.RemoveAt(at);
                    rows.Insert(Math.Clamp(move.NewIndex ?? rows.Count, 0, rows.Count), row);
                }

                break;
            default:
                break;
        }

        _ = _changedCollections.Add(update.Component);
    }

    /// <summary>The rows a change applies to: the ones the page holds, else — a list nested in a row — those its row's item carried.</summary>
    private List<UIClientRowEntry> RowsForChangeNoLock(UIComponentAddress host)
    {
        if (!_rows.TryGetValue(host, out List<UIClientRowEntry>? rows))
        {
            rows = [.. ReadSourceRowsNoLock(host)];
            _rows.Add(host, rows);
        }

        return rows;
    }

    /// <summary>The source rows a host holds before client-side filtering or sorting: those the page holds, else the list its binding reads off its row's item or its own static items.</summary>
    private List<UIClientRowEntry> ReadSourceRowsNoLock(UIComponentAddress host)
    {
        if (_rows.TryGetValue(host, out List<UIClientRowEntry>? held))
            return held;

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

    private static int IndexOf(List<UIClientRowEntry> rows, string? key, int? index)
    {
        if (key is not null)
            return rows.FindIndex(row => string.Equals(row.Key, key, StringComparison.Ordinal));

        return index is int at && at < rows.Count ? at : -1;
    }

    /// <summary>Forgets what the page held under a row that went, or under every row of a host that was reset: values, lists and fields.</summary>
    private void DropRowNoLock(UIComponentAddress host, string? key)
    {
        foreach (UIPropertyAddress address in _values.Keys.ToArray())
        {
            if (IsUnderRow(address.Component, host, key))
                _ = _values.Remove(address);
        }

        foreach (UIPropertyAddress address in _held.Keys.ToArray())
        {
            if (IsUnderRow(address.Component, host, key))
                _ = _held.Remove(address);
        }

        foreach (UIPropertyAddress address in _serverValues.Keys.ToArray())
        {
            if (IsUnderRow(address.Component, host, key))
                _ = _serverValues.Remove(address);
        }

        foreach (UIComponentAddress list in _rows.Keys.ToArray())
        {
            if (IsUnderRow(list, host, key))
                _ = _rows.Remove(list);
        }

        foreach (UIComponentAddress field in _fields.Keys.ToArray())
        {
            if (IsUnderRow(field, host, key))
                _ = _fields.Remove(field);
        }
    }

    private static bool IsUnderRow(UIComponentAddress component, UIComponentAddress host, string? key)
    {
        var keys = component.DynamicParameters;
        var depth = host.DynamicParameters.Length;

        return keys.Length > depth && StartsWith(keys, host.DynamicParameters) && (key is null || Equals(keys[depth], key));
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
    private void ApplyEffectsNoLock(IReadOnlyList<ClientEffect> effects)
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
                        _navigation = UINavigationAddress.Parse(back.Fallback);
                        _history[0] = _navigation;
                        _navigationChanged = true;
                    }

                    break;
                case DiscardFormEffect discard:
                    DiscardFormNoLock(discard.FormId);
                    break;
                case SetLanguageEffect or SetThemeEffect or SetThemeColorsEffect when !Transport.SessionHolds(effect):
                    _reactions.Add(new UIClientReaction(Setting: effect));
                    break;
                default:
                    break;
            }
        }
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
        foreach (UIPropertyAddress address in _held.Keys.ToArray())
        {
            if (!IsInFormNoLock(address.Component, formId))
                continue;

            _ = _held.Remove(address);
            _ = _serverValues.Remove(address, out var server);
            WriteValueNoLock(address, server, local: false, depth: 0, writes: []);
        }

        // After the values: their restore judged the fields again, and that goes too.
        foreach (KeyValuePair<UIComponentAddress, UIClientField> field in _fields)
        {
            if (!IsInFormNoLock(field.Key, formId))
                continue;

            field.Value.Touched = false;
            field.Value.Failing.Clear();
            field.Value.Refusal = null;
            field.Value.BoundRefusal = null;
            field.Value.GateRefused = false;
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
            _values.Clear();
            _rows.Clear();

            // A held field keeps the reader's edit through the rebuild, as the page's input does; the snapshot's value waits aside.
            foreach (KeyValuePair<UIPropertyAddress, object?> held in _held)
                _values[held.Key] = held.Value;

            foreach (KeyValuePair<UIComponentAddress, UIClientField> field in _fields)
            {
                if (!HasHeldPropertyNoLock(field.Key))
                {
                    field.Value.Refusal = null;
                    field.Value.BoundRefusal = null;
                    field.Value.GateRefused = false;
                }
            }
        }

        await StartCoreAsync(keepNavigation: true, cancellationToken).ConfigureAwait(false);
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
