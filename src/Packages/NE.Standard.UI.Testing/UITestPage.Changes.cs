using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Testing;

/// <summary>A row a host holds: its key and the item the change set carried.</summary>
internal sealed record UITestRowEntry(string Key, object? Item);

public sealed partial class UITestPage
{
    /// <summary>Takes the attached runtime and applies the snapshot a connecting page starts from: every binding's value and every list.</summary>
    internal async Task StartAsync(RuntimeResolution resolution, CancellationToken cancellationToken)
    {
        _resolution = resolution;
        View = resolution.CompiledView;
        _navigation = resolution.Navigation;

        if (resolution.Runtime is not { } runtime)
            return;

        UIBindingId[] bindings = [.. View.Bindings.All.Where(static binding => binding.Kind == CompiledUIBindingKind.ComponentProperty).Select(static binding => binding.Id)];
        ServerChangeSet snapshot = await runtime.BuildAttachChangesAsync(_instanceId, bindings, cancellationToken).ConfigureAwait(false);

        Receive(snapshot);
    }

    /// <summary>Applies a change set the page was sent: an answer, a push or the flush.</summary>
    internal void Receive(ServerChangeSet changes)
    {
        lock (_sync)
            ApplyNoLock(changes.For(_instanceId));
    }

    /// <summary>Applies a result pushed to the page — a background command's, a session's switch — and runs its effects.</summary>
    internal void Receive(UICommandExecutionResult result)
    {
        lock (_sync)
        {
            ApplyNoLock(result.Changes.For(_instanceId));
            ApplyEffectsNoLock(result.Command.Effects);
        }
    }

    /// <summary>Keeps a file the application sent the page to save.</summary>
    internal void Receive(UITestDownload download)
    {
        lock (_sync)
            _downloads.Add(download);
    }

    private void ApplyNoLock(ServerChangeSet changes)
    {
        foreach (ServerUIUpdate update in changes.Updates)
        {
            switch (update)
            {
                case ServerValueUIUpdate value:
                    WriteValueNoLock(value.Address, value.Value, local: false, depth: 0, writes: []);
                    break;
                case ServerCollectionChangeUIUpdate collection:
                    ApplyCollectionNoLock(collection);
                    break;
                case ServerValidationUIUpdate refusal:
                    FieldNoLock(refusal.Address.Component).Refusal = refusal.Message is null ? null : new UITestRefusal(refusal.Message, refusal.Severity);
                    FieldNoLock(refusal.Address.Component).Touched |= refusal.Message is not null;
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

    private void ApplyCollectionNoLock(ServerCollectionChangeUIUpdate update)
    {
        List<UITestRowEntry> rows = RowsForChangeNoLock(update.Component);

        switch (update.Action)
        {
            case CollectionUpdateAction.Reset:
                rows.Clear();
                DropRowNoLock(update.Component, key: null);
                break;
            case CollectionUpdateAction.Insert:
                foreach (ServerCollectionItemChange change in update.Items)
                {
                    UITestRowEntry row = new(change.Key ?? KeyOf(change.Item), change.Item);

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
                    UITestRowEntry row = new(change.Key ?? KeyOf(change.Item), change.Item);

                    if (at < 0)
                    {
                        rows.Add(row);
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

                    UITestRowEntry row = rows[at];

                    rows.RemoveAt(at);
                    rows.Insert(Math.Clamp(move.NewIndex ?? rows.Count, 0, rows.Count), row);
                }

                break;
            default:
                break;
        }
    }

    /// <summary>The rows a change applies to: the ones the page holds, else — a list nested in a row — those its row's item carried.</summary>
    private List<UITestRowEntry> RowsForChangeNoLock(UIComponentAddress host)
    {
        if (!_rows.TryGetValue(host, out List<UITestRowEntry>? rows))
        {
            rows = [.. ReadRowsNoLock(host)];
            _rows.Add(host, rows);
        }

        return rows;
    }

    /// <summary>The rows a host shows: those the page holds, else the list its binding reads off its row's item or its own static items.</summary>
    private List<UITestRowEntry> ReadRowsNoLock(UIComponentAddress host)
    {
        if (_rows.TryGetValue(host, out List<UITestRowEntry>? held))
            return held;

        if (ReadNoLock(host.Id, host.DynamicParameters, IItemsComponent.ItemsProperty) is not IEnumerable items || items is string)
            return [];

        List<UITestRowEntry> rows = [];

        foreach (var item in items)
        {
            if (item is IBindableItem { Id: { Length: > 0 } key })
                rows.Add(new UITestRowEntry(key, item));
        }

        return rows;
    }

    private static string KeyOf(object? item)
        => item is IBindableItem { Id: { Length: > 0 } id } ? id : throw new InvalidOperationException($"A row of type '{item?.GetType().Name ?? "null"}' carries no key.");

    private static int IndexOf(List<UITestRowEntry> rows, string? key, int? index)
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

    private UITestField FieldNoLock(UIComponentAddress component)
    {
        if (!_fields.TryGetValue(component, out UITestField? field))
        {
            field = new UITestField();
            _fields.Add(component, field);
        }

        return field;
    }

    /// <summary>Runs the effects the page was sent, as the client does: dialogs open and close, an address effect rewrites the address.</summary>
    private void ApplyEffectsNoLock(IReadOnlyList<ClientEffect> effects)
    {
        foreach (ClientEffect effect in effects)
        {
            _effects.Add(effect);

            switch (effect)
            {
                case OpenDialogEffect open:
                    _ = _openDialogs.Add(open.DialogKey);
                    break;
                case CloseDialogEffect close:
                    _ = _openDialogs.Remove(close.DialogKey);
                    break;
                case ReplaceAddressEffect replace:
                    _navigation = new UINavigationRequest { Route = _navigation.Route, Parameters = replace.Parameters };
                    break;
                case PushAddressEffect push:
                    _navigation = new UINavigationRequest { Route = _navigation.Route, Parameters = push.Parameters };
                    break;
                default:
                    break;
            }
        }
    }

    /// <summary>A dialog the controller opened or closed through the dialog service.</summary>
    internal void SetDialogOpen(string key, bool open)
    {
        lock (_sync)
        {
            if (open)
                _ = _openDialogs.Add(key);
            else
                _ = _openDialogs.Remove(key);
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
            _values.Clear();
            _rows.Clear();
        }

        await StartAsync(_resolution, cancellationToken).ConfigureAwait(false);
    }


}
