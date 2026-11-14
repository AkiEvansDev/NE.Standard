using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Items;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Primitives.Text;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Client;

/// <summary>A value the page owes the server: one an interaction wrote to a property bound to write back.</summary>
internal sealed record UIClientWrite(UIPropertyAddress Address, object? Value);

/// <summary>What an effect or bound change leaves the page to do once the act that brought it is done.</summary>
internal sealed record UIClientReaction(UIComponentId? DialogClosed = null, ClientEffect? Setting = null, IReadOnlyDictionary<string, object?>? NavigateInPlace = null, bool HasNavigateInPlace = false, UINavigationRequest? FallbackOrigin = null, IReadOnlyList<UIClientWrite>? DeferredWrites = null);

/// <summary>The server's refusal of a field's value, shown until a value it takes replaces it or the controller gives that property again.</summary>
internal sealed record UIClientRefusal(UIPhrase Message, UIValidationSeverity Severity, UIProperty Property);

/// <summary>
/// What the page knows of one field: the rules it fails, whether the reader has been in it, the server's refusal, and the page's own
/// of a value past the field's bounds.
/// </summary>
internal sealed class UIClientField
{
    public HashSet<CompiledUIValidationRule> Failing { get; } = [];

    public HashSet<UIProperty> WithheldByBounds { get; } = [];

    public bool Touched { get; set; }

    public UIClientRefusal? Refusal { get; set; }

    public UIPhrase? BoundRefusal { get; set; }

    public bool GateRefused { get; set; }

    public bool LastEditedEnd { get; set; }
}

public sealed partial class UIClientPage
{
    // The client's own bound on a chain of interactions answering each other.
    private const int MaxInteractionDepth = 8;

    /// <summary>
    /// Writes a value as a reader does: typed in — the field's change rules and the interactions reading it run — judged against its
    /// bounds, committed to the server, or held for its form's submit where its binding says so, then the field's change command,
    /// then its blur rules.
    /// </summary>
    internal async Task<UIClientCommandResult> SetValueAsync(UIComponentId componentId, object?[] rowKeys, UIProperty property, object? value, CancellationToken cancellationToken)
    {
        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);

        UIComponentNode node = EnsureActionable(componentId, rowKeys, "write to");

        if (Read(componentId, rowKeys, IInputComponent.IsReadOnlyProperty) is true)
            throw new InvalidOperationException($"'{node.AuthoringId}' is read-only: a reader cannot write to it.");

        EnsureGivable(node, rowKeys, property, value);

        UIPropertyAddress address = new(new UIComponentAddress(componentId, rowKeys), property);
        CompiledUIBinding? binding = BindingOf(componentId, property);
        List<UIClientWrite> writes = [];
        int mark;
        bool outOfBounds;

        lock (_sync)
        {
            mark = _effects.Count;
            UIClientField field = FieldNoLock(address.Component);
            field.Touched = true;
            if (property == IPeriodInputComponent.EndValueProperty)
                field.LastEditedEnd = true;
            else if (property == IInputComponent.ValueProperty)
                field.LastEditedEnd = false;

            _ = _changedValidations.Add(address.Component);

            // From the first edit on, the server's value waits aside for a discard to put back; a push meanwhile lands there.
            var prior = ReadNoLock(componentId, rowKeys, property);
            var hadServerValue = _serverValues.ContainsKey(address);

            WriteValueNoLock(address, value, local: true, depth: 0, writes);
            outOfBounds = JudgeBoundsNoLock(address.Component);

            if (binding is { Mode: UIBindingMode.OnSubmit })
            {
                if (!hadServerValue)
                    _serverValues[address] = prior;

                _held[address] = value;
            }
            else if (binding is { Mode: UIBindingMode.TwoWay or UIBindingMode.OneWayToSource })
            {
                if (outOfBounds)
                {
                    if (!hadServerValue && !field.WithheldByBounds.Contains(property))
                        _serverValues[address] = prior;

                    _ = field.WithheldByBounds.Add(property);
                }
                else
                {
                    _ = field.WithheldByBounds.Remove(property);
                    _ = _serverValues.Remove(address);
                }
            }
        }

        // A value past the bounds stays the reader's and is never sent: the controller keeps the last one it took.
        if (!outOfBounds && binding is { Mode: UIBindingMode.TwoWay or UIBindingMode.OneWayToSource })
            writes.Insert(0, new UIClientWrite(address, value));

        await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);

        bool refused;

        lock (_sync)
            refused = FieldNoLock(address.Component).Refusal is not null || FieldNoLock(address.Component).GateRefused;

        // An .OnChange command never runs for a value the page or the server refused.
        UIClientCommandResult result = outOfBounds || refused
            ? UIClientCommandResult.Refused($"The {(outOfBounds ? "page" : "server")} refused the value written to '{node.AuthoringId}'.")
            : View.Events.TryGet(new CompiledUIEventAddress(componentId, EventNames.Change), out _)
                ? await DispatchCoreAsync(componentId, rowKeys, EventNames.Change, [], cancellationToken).ConfigureAwait(false)
                : UIClientCommandResult.RanOnPage(EffectsSince(mark));

        // The reader leaves the field.
        lock (_sync)
            EvaluateRulesNoLock(address.Component, UIValidationTrigger.Blur, property: null);

        NotifyIfChanged();

        return result;
    }

    /// <summary>The component, where a reader could act on it: shown, and neither disabled nor loading.</summary>
    private UIComponentNode EnsureActionable(UIComponentId componentId, object?[] rowKeys, string act)
    {
        UIComponentNode node = View.Graph.GetRequired(componentId);

        if (!IsShown(componentId, rowKeys))
            throw new InvalidOperationException($"'{node.AuthoringId}' is not shown: a reader cannot {act} it.");

        if (!IsEnabled(componentId, rowKeys))
            throw new InvalidOperationException($"'{node.AuthoringId}' is disabled or loading: a reader cannot {act} it.");

        return node;
    }

    /// <summary>
    /// Refuses a value no reader could give the field: a slider's or a calendar's past its bounds, which it never moves to, and a
    /// number its field strips as it is typed — a negative where it takes none, a fraction where it takes whole numbers.
    /// </summary>
    private void EnsureGivable(UIComponentNode node, object?[] rowKeys, UIProperty property, object? value)
    {
        if (node.TypeKey == NumberInputComponent.ComponentTypeKey && AsNumber(value) is double number)
        {
            if (number < 0 && Read(node.ComponentId, rowKeys, NumberInputComponent.AllowNegativeProperty) is false)
                throw new InvalidOperationException($"'{node.AuthoringId}' takes no negative number: a reader cannot type {UIScriptNumber.Format(number)}.");

            if (number != Math.Truncate(number) && Read(node.ComponentId, rowKeys, NumberInputComponent.AllowDecimalsProperty) is false)
                throw new InvalidOperationException($"'{node.AuthoringId}' takes whole numbers: a reader cannot type {UIScriptNumber.Format(number)}.");

            return;
        }

        if ((node.TypeKey != SliderComponent.ComponentTypeKey && node.TypeKey != CalendarComponent.ComponentTypeKey) || !IsValueProperty(property))
            return;

        if (Order(value, Read(node.ComponentId, rowKeys, IBoundedInputComponent.MinProperty)) < 0 || Order(value, Read(node.ComponentId, rowKeys, IBoundedInputComponent.MaxProperty)) > 0)
            throw new InvalidOperationException($"'{node.AuthoringId}' moves only between its Min and Max: a reader cannot give it {value}.");
    }

    /// <summary>
    /// Judges a field's value against its <c>Min</c> and <c>Max</c> as the page does — a number field's, a temporal control's, both
    /// ends of a period — and keeps the words on the field; answers whether it is refused. A refusal of the server's spoke of a value
    /// since replaced.
    /// </summary>
    private bool JudgeBoundsNoLock(UIComponentAddress component)
    {
        UIClientField field = FieldNoLock(component);

        field.BoundRefusal = BoundRefusalNoLock(component);
        _ = _changedValidations.Add(component);

        if (field.BoundRefusal is null)
            return false;

        field.Refusal = null;
        return true;
    }

    /// <summary>The words a value past the bounds is refused in, the bound named; null inside them, or for a field the page does not judge so.</summary>
    private UIPhrase? BoundRefusalNoLock(UIComponentAddress component)
    {
        var keys = component.DynamicParameters;

        // A slider never stands past them, and a field the reader cannot change shows its value as it is.
        if (ReadNoLock(component.Id, keys, IInputComponent.IsReadOnlyProperty) is true)
            return null;

        var min = ReadNoLock(component.Id, keys, IBoundedInputComponent.MinProperty);
        var max = ReadNoLock(component.Id, keys, IBoundedInputComponent.MaxProperty);
        var moment = IsMoment(min ?? max);
        var isRange = ReadNoLock(component.Id, keys, IPeriodInputComponent.IsRangeProperty) is true;

        if ((min is not null || max is not null) && (moment || View.Graph.GetRequired(component.Id).TypeKey == NumberInputComponent.ComponentTypeKey))
        {
            UIProperty[] ends = isRange ? [IInputComponent.ValueProperty, IPeriodInputComponent.EndValueProperty] : [IInputComponent.ValueProperty];

            foreach (UIProperty end in ends)
            {
                var value = ReadNoLock(component.Id, keys, end);

                if (Order(value, min) < 0)
                    return UIPhrase.Of(moment ? UIStrings.ValueNotBefore : UIStrings.ValueAtLeast, ("min", min));

                if (Order(value, max) > 0)
                    return UIPhrase.Of(moment ? UIStrings.ValueNotAfter : UIStrings.ValueAtMost, ("max", max));
            }
        }

        return isRange ? PeriodDistanceRefusalNoLock(component, keys) : null;
    }

    private UIPhrase? PeriodDistanceRefusalNoLock(UIComponentAddress component, object?[] keys)
    {
        var typeKey = View.Graph.GetRequired(component.Id).TypeKey;

        if (typeKey == SliderComponent.ComponentTypeKey || typeKey == CalendarComponent.ComponentTypeKey)
            return null;

        if (ReadNoLock(component.Id, keys, IPeriodInputComponent.MinDistanceProperty) is not { } rawDistance
            || !RecursiveValueCoercion.TryCoerce(rawDistance, out TimeSpan span)
            || span <= TimeSpan.Zero)
        {
            return null;
        }

        var start = ReadNoLock(component.Id, keys, IInputComponent.ValueProperty);
        var end = ReadNoLock(component.Id, keys, IPeriodInputComponent.EndValueProperty);

        if (start is null || end is null || Order(start, end) is not int order)
            return null;

        var editedEnd = _fields.TryGetValue(component, out UIClientField? tracked) && tracked.LastEditedEnd;
        (var first, var second, var checkAsEnd) = order <= 0 ? (start, end, editedEnd) : (end, start, !editedEnd);

        return (first, second) switch
        {
            (DateOnly from, DateOnly to) when TimeSpan.FromDays(to.DayNumber - from.DayNumber) < span
                => checkAsEnd
                    ? UIPhrase.Of(UIStrings.ValueEndTooNear, ("min", from.AddDays((int)Math.Ceiling(span.TotalDays))))
                    : UIPhrase.Of(UIStrings.ValueStartTooNear, ("max", to.AddDays(-(int)Math.Ceiling(span.TotalDays)))),
            (TimeOnly from, TimeOnly to) when to.ToTimeSpan() - from.ToTimeSpan() < span
                => checkAsEnd
                    ? UIPhrase.Of(UIStrings.ValueEndTooNear, ("min", TimeOnly.FromTimeSpan(TimeSpan.FromTicks(Math.Clamp(from.Ticks + span.Ticks, 0L, TimeOnly.MaxValue.Ticks)))))
                    : UIPhrase.Of(UIStrings.ValueStartTooNear, ("max", TimeOnly.FromTimeSpan(TimeSpan.FromTicks(Math.Clamp(to.Ticks - span.Ticks, 0L, TimeOnly.MaxValue.Ticks))))),
            (DateTime from, DateTime to) when to - from < span
                => checkAsEnd
                    ? UIPhrase.Of(UIStrings.ValueEndTooNear, ("min", AddSafe(from, span)))
                    : UIPhrase.Of(UIStrings.ValueStartTooNear, ("max", SubtractSafe(to, span))),
            (DateTimeOffset from, DateTimeOffset to) when to - from < span
                => checkAsEnd
                    ? UIPhrase.Of(UIStrings.ValueEndTooNear, ("min", AddSafe(from, span)))
                    : UIPhrase.Of(UIStrings.ValueStartTooNear, ("max", SubtractSafe(to, span))),
            _ => null
        };
    }

    private static DateTime AddSafe(DateTime value, TimeSpan span)
        => DateTime.MaxValue - value < span ? DateTime.MaxValue : value + span;

    private static DateTime SubtractSafe(DateTime value, TimeSpan span)
        => value - DateTime.MinValue < span ? DateTime.MinValue : value - span;

    private static DateTimeOffset AddSafe(DateTimeOffset value, TimeSpan span)
        => DateTimeOffset.MaxValue - value < span ? DateTimeOffset.MaxValue : value + span;

    private static DateTimeOffset SubtractSafe(DateTimeOffset value, TimeSpan span)
        => value - DateTimeOffset.MinValue < span ? DateTimeOffset.MinValue : value - span;

    private static bool IsMoment(object? value)
        => value is DateOnly or TimeOnly or DateTime or DateTimeOffset;

    private static bool IsValueProperty(UIProperty property)
        => property == IInputComponent.ValueProperty || property == IPeriodInputComponent.EndValueProperty;

    /// <summary>A value's order against a bound: as numbers, or as moments of one type; null where the two do not compare, or either is none.</summary>
    private static int? Order(object? value, object? bound)
    {
        if (value is null || bound is null)
            return null;

        if (AsNumber(value) is double number && AsNumber(bound) is double limit)
            return number.CompareTo(limit);

        return value.GetType() == bound.GetType() && value is IComparable comparable ? comparable.CompareTo(bound) : null;
    }

    // As the page reads a number, a double whatever type the controller holds; null for no number, NaN or an infinity.
    private static double? AsNumber(object? value)
        => UIScriptNumber.TryRead(value, out var number) ? number : null;

    /// <summary>Raises an event as a reader's gesture does: refused on a component a reader could not reach.</summary>
    internal async Task<UIClientCommandResult> DispatchAsync(UIComponentId componentId, object?[] rowKeys, string eventName, object?[] eventKeys, CancellationToken cancellationToken)
    {
        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);

        UIComponentNode node = EnsureActionable(componentId, rowKeys, $"raise '{eventName}' on");

        if (ClosesOnReadOnly(eventName) && Read(componentId, rowKeys, IInputComponent.IsReadOnlyProperty) is true)
            throw new InvalidOperationException($"'{node.AuthoringId}' is read-only: a reader cannot raise '{eventName}' on it.");

        // A surface or a tile that is not clickable lets its click go by, as the page's suppress mark does.
        if (eventName == EventNames.Click && Read(componentId, rowKeys, IClickableComponent.ClickableProperty) is false)
            throw new InvalidOperationException($"'{node.AuthoringId}' is not clickable: a reader cannot press it.");

        return await DispatchCoreAsync(componentId, rowKeys, eventName, eventKeys, cancellationToken).ConfigureAwait(false);
    }

    private static bool ClosesOnReadOnly(string eventName)
        => eventName is not (EventNames.Focus or EventNames.Blur or EventNames.HoverStart or EventNames.HoverEnd or "graph-node-click" or "graph-run-stop");

    internal async Task EnsureRowChoosableAsync(UIComponentNode host, object?[] hostKeys, object?[] rowKeys, UIClientRowEntry entry, CancellationToken cancellationToken)
    {
        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);

        _ = EnsureActionable(host.ComponentId, hostKeys, "choose a row of");

        UIComponentId rootId = RowTemplate(host.ComponentId, hostKeys, entry.Item);
        _ = EnsureActionable(rootId, rowKeys, "choose");

        if (SelectsRows(host.ComponentId, hostKeys) && !IsRowSelectable(rootId, rowKeys, entry.Item))
            throw new InvalidOperationException($"Row '{entry.Key}' of '{host.AuthoringId}' refuses selection.");
    }

    private bool SelectsRows(UIComponentId hostId, object?[] hostKeys)
        => !View.State.TryGetValue(hostId, ISelectableItemsComponent.SelectionModeProperty, out _)
            || Read(hostId, hostKeys, ISelectableItemsComponent.SelectionModeProperty) is UISelectionMode.One or UISelectionMode.Many;

    private bool IsRowSelectable(UIComponentId rootId, object?[] rowKeys, object? item)
        => Read(rootId, rowKeys, IItemAbilitiesComponent.CanSelectProperty) is not false
            && item is not IItemAbilitiesModel { CanSelect: false }
            && !(item is IReadOnlyDictionary<string, object?> && ItemContext.TryReadProperty(item, nameof(IItemAbilitiesModel.CanSelect), out var canSelect) && canSelect is false);

    /// <summary>Commits an inline rename on a standalone renamable component or row template root, writing <c>RenamedTitle</c> and raising <c>rename</c>.</summary>
    internal async Task<UIClientCommandResult> RenameComponentAsync(UIComponentId componentId, object?[] rowKeys, string title, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(title);

        var trimmed = title.Trim();

        if (trimmed.Length == 0)
            throw new ArgumentException("A rename cannot commit a blank title.", nameof(title));

        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);

        UIComponentNode node = EnsureActionable(componentId, rowKeys, "rename");

        if (node.ParentId is UIComponentId hostId && View.State.TryGetValue(hostId, IItemsHostAbilitiesComponent.RenamableProperty, out _) && rowKeys.Length > 0)
            return await RenameRowCoreAsync(View.Graph.GetRequired(hostId), rowKeys[..^1], rowKeys, componentId, componentId, trimmed, $"'{node.AuthoringId}'", cancellationToken).ConfigureAwait(false);

        if (BindingOf(componentId, IRenamableComponent.RenamedTitleProperty) is null)
            throw new InvalidOperationException($"'{node.AuthoringId}' is not renamable: it binds no renamed title.");

        if (Read(componentId, rowKeys, IItemAbilitiesComponent.CanRenameProperty) is false)
            throw new InvalidOperationException($"'{node.AuthoringId}' refuses inline rename.");

        UIComponentAddress openedAddress = new(componentId, rowKeys);
        bool open;

        lock (_sync)
            open = _openedRenames.Contains(openedAddress) || ReadNoLock(componentId, rowKeys, TextComponent.RenamableProperty) is true;

        if (!open)
            throw new InvalidOperationException($"'{node.AuthoringId}' is not renamable: a reader cannot rename it.");

        return await CommitRenameAsync(componentId, componentId, rowKeys, trimmed, $"'{node.AuthoringId}'", openedAddress, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Commits an inline rename on a list, tree or tab row, writing <c>RenamedTitle</c> on its rename slot and raising <c>rename</c>.</summary>
    internal async Task<UIClientCommandResult> RenameRowAsync(UIComponentNode host, object?[] hostKeys, UIClientRowEntry entry, string title, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(title);

        var trimmed = title.Trim();

        if (trimmed.Length == 0)
            throw new ArgumentException("A rename cannot commit a blank title.", nameof(title));

        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);

        _ = EnsureActionable(host.ComponentId, hostKeys, "rename a row of");

        object?[] rowKeys = [.. hostKeys, entry.Key];
        UIComponentId rootId = RowTemplate(host.ComponentId, hostKeys, entry.Item);
        UIComponentId valueTargetId = ResolveRowRenameValueTarget(host, rowKeys, entry.Item, rootId);

        return await RenameRowCoreAsync(host, hostKeys, rowKeys, rootId, valueTargetId, trimmed, $"Row '{entry.Key}' of '{host.AuthoringId}'", cancellationToken).ConfigureAwait(false);
    }

    private UIComponentId ResolveRowRenameValueTarget(UIComponentNode host, object?[] rowKeys, object? rowItem, UIComponentId rootId)
    {
        if (BindingOf(rootId, IRenamableComponent.RenamedTitleProperty) is not null)
            return rootId;

        foreach (UIComponentSlot slot in host.Slots)
        {
            if (slot.Kind == UIComponentSlotKind.TemplateVariant
                && slot.RootComponentId != rootId
                && IsWornByCompositeRow(host.ComponentId, slot.RootComponentId, rowKeys, rowItem)
                && BindingOf(slot.RootComponentId, IRenamableComponent.RenamedTitleProperty) is not null)
            {
                return slot.RootComponentId;
            }
        }

        return rootId;
    }

    private async Task<UIClientCommandResult> RenameRowCoreAsync(UIComponentNode host, object?[] hostKeys, object?[] rowKeys, UIComponentId rootId, UIComponentId valueTargetId, string trimmed, string owner, CancellationToken cancellationToken)
    {
        _ = EnsureActionable(valueTargetId, rowKeys, "rename");

        if (valueTargetId != rootId)
            _ = EnsureActionable(rootId, rowKeys, "rename");

        if (BindingOf(valueTargetId, IRenamableComponent.RenamedTitleProperty) is null)
            throw new InvalidOperationException($"{owner} is not renamable: it binds no renamed title.");

        if (Read(rootId, rowKeys, IItemAbilitiesComponent.CanRenameProperty) is false || (valueTargetId != rootId && Read(valueTargetId, rowKeys, IItemAbilitiesComponent.CanRenameProperty) is false))
            throw new InvalidOperationException($"{owner} refuses inline rename.");

        UIComponentAddress openedHostRow = new(host.ComponentId, rowKeys);
        UIComponentAddress openedValueTarget = new(valueTargetId, rowKeys);
        bool open;

        lock (_sync)
            open = _openedRenames.Contains(openedHostRow) || _openedRenames.Contains(openedValueTarget) || IsHostRowRenamableNoLock(host.ComponentId, hostKeys, valueTargetId, rowKeys);

        if (!open)
            throw new InvalidOperationException($"{owner} is not renamable: a reader cannot rename it.");

        UIComponentId eventTargetId = HasEventOrInteraction(rootId, rowKeys, EventNames.Rename) ? rootId : valueTargetId;

        return await CommitRenameAsync(valueTargetId, eventTargetId, rowKeys, trimmed, owner, openedHostRow, cancellationToken).ConfigureAwait(false);
    }

    private bool IsHostRowRenamableNoLock(UIComponentId hostId, object?[] hostKeys, UIComponentId valueTargetId, object?[] rowKeys)
    {
        if (ReadNoLock(hostId, hostKeys, IItemsHostAbilitiesComponent.RenamableProperty) is true)
            return true;

        if (ReadNoLock(hostId, hostKeys, TabsViewComponent.TabMenuEntriesProperty) is UITabMenuEntries entries && entries.HasFlag(UITabMenuEntries.Rename))
            return true;

        return !View.State.TryGetValue(hostId, IItemsHostAbilitiesComponent.RenamableProperty, out _)
            && ReadNoLock(valueTargetId, rowKeys, TextComponent.RenamableProperty) is true;
    }

    internal bool HasEventOrInteraction(UIComponentId componentId, object?[] rowKeys, string eventName)
    {
        if (HasEvent(componentId, eventName))
            return true;

        IReadOnlyList<CompiledUIInteraction> interactions = View.Interactions.GetBySource(new CompiledUIEventAddress(componentId, eventName));

        for (var i = 0; i < interactions.Count; i++)
        {
            if (IsRowsOwn(interactions[i], rowKeys))
                return true;
        }

        return false;
    }

    /// <summary>
    /// Whether an event raised with these keys fires the interaction: any row's for one that names none, else the row it names — any
    /// key in the row's scope chain, so a submenu's key matches its entries too (<c>interaction-engine.ts</c>).
    /// </summary>
    private static bool IsRowsOwn(CompiledUIInteraction interaction, object?[] rowKeys)
        => interaction.RowKey is null
            || Array.Exists(rowKeys, key => key is not null && string.Equals(Convert.ToString(key, CultureInfo.InvariantCulture), interaction.RowKey, StringComparison.Ordinal));

    private async Task<UIClientCommandResult> CommitRenameAsync(UIComponentId valueTargetId, UIComponentId eventTargetId, object?[] rowKeys, string trimmed, string owner, UIComponentAddress openedAddress, CancellationToken cancellationToken)
    {
        UIComponentAddress valueComponent = new(valueTargetId, rowKeys);
        UIPropertyAddress renamedAddress = new(valueComponent, IRenamableComponent.RenamedTitleProperty);
        UIPropertyAddress? titleAddress = ResolveRenameTitleTarget(valueTargetId) is UIComponentId titleId
            ? new UIPropertyAddress(new UIComponentAddress(titleId, rowKeys), ITextBaseComponent.TitleProperty)
            : null;
        CompiledUIBinding? binding = BindingOf(valueTargetId, IRenamableComponent.RenamedTitleProperty);
        List<UIClientWrite> writes = [];
        var hadExplicitTitle = false;
        object? explicitTitle = null;
        var unchanged = false;
        int mark;

        lock (_sync)
        {
            mark = _effects.Count;
            _ = _openedRenames.Remove(openedAddress);
            _ = _openedRenames.Remove(valueComponent);

            var currentShown = titleAddress is UIPropertyAddress currentTitleAddress
                ? Words(ReadNoLock(currentTitleAddress.Component.Id, rowKeys, ITextBaseComponent.TitleProperty))?.Trim()
                : Words(ReadNoLock(valueTargetId, rowKeys, IRenamableComponent.RenamedTitleProperty))?.Trim();

            if (string.Equals(trimmed, currentShown, StringComparison.Ordinal))
            {
                unchanged = true;
            }
            else
            {
                if (titleAddress is UIPropertyAddress knownTitle)
                    hadExplicitTitle = _values.TryGetValue(knownTitle, out explicitTitle);

                if (binding is { Mode: UIBindingMode.OnSubmit } && !_held.ContainsKey(renamedAddress))
                    _serverValues[renamedAddress] = ReadNoLock(valueTargetId, rowKeys, IRenamableComponent.RenamedTitleProperty);

                WriteValueNoLock(renamedAddress, trimmed, local: true, depth: 0, writes);

                if (titleAddress is UIPropertyAddress targetTitle)
                {
                    SetValueEntryNoLock(targetTitle, trimmed);
                    _ = _changedProperties.Add(targetTitle);
                }

                if (binding is { Mode: UIBindingMode.OnSubmit })
                    _held[renamedAddress] = trimmed;
                else if (binding is { Mode: UIBindingMode.TwoWay or UIBindingMode.OneWayToSource })
                    writes.Insert(0, new UIClientWrite(renamedAddress, trimmed));
            }
        }

        if (unchanged)
        {
            NotifyIfChanged();
            return UIClientCommandResult.RanOnPage(EffectsSince(mark));
        }

        await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);

        bool refused;

        lock (_sync)
        {
            UIClientField field = FieldNoLock(valueComponent);
            refused = field.Refusal is not null || field.GateRefused;

            if (refused && titleAddress is UIPropertyAddress revertTitle && _values.TryGetValue(revertTitle, out var currentTitle) && Equals(currentTitle, trimmed))
            {
                if (hadExplicitTitle)
                    SetValueEntryNoLock(revertTitle, explicitTitle);
                else
                    _ = RemoveValueEntryNoLock(revertTitle);

                _ = _changedProperties.Add(revertTitle);
            }
        }

        if (refused)
        {
            NotifyIfChanged();
            return UIClientCommandResult.Refused($"The server refused the rename of {owner}.");
        }

        if (HasEventOrInteraction(eventTargetId, rowKeys, EventNames.Rename))
            return await DispatchCoreAsync(eventTargetId, rowKeys, EventNames.Rename, [], cancellationToken).ConfigureAwait(false);

        NotifyIfChanged();
        return UIClientCommandResult.RanOnPage(EffectsSince(mark));
    }

    private UIComponentId? ResolveRenameTitleTarget(UIComponentId valueTargetId)
    {
        if (View.State.TryGetValue(valueTargetId, ITextBaseComponent.TitleProperty, out _))
            return valueTargetId;

        return View.Graph.TryGetSlot(valueTargetId, UIComponentSlotKind.Region, out UIComponentSlot? header, RegionNames.Header)
            && View.State.TryGetValue(header.RootComponentId, ITextBaseComponent.TitleProperty, out _)
                ? header.RootComponentId
                : null;
    }

    /// <summary>
    /// The event's command — behind its form's submit rules, which refuse it while a field is in error, and its held values — or, with
    /// no command, only the interactions it drives.
    /// </summary>
    private async Task<UIClientCommandResult> DispatchCoreAsync(UIComponentId componentId, object?[] rowKeys, string eventName, object?[] eventKeys, CancellationToken cancellationToken)
    {
        UIComponentAddress source = new(componentId, rowKeys);

        // A row's own effect — one menu entry's — runs in place of the command the event carries for every other row.
        if (!View.Events.TryGet(new CompiledUIEventAddress(componentId, eventName), out CompiledUIEvent? compiled) || TakesRowEvent(source, eventName))
        {
            List<UIClientWrite> writes = [];
            int mark;

            lock (_sync)
            {
                mark = _effects.Count;
                RunEventInteractionsNoLock(source, eventName, writes);
            }

            await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);
            await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
            NotifyIfChanged();

            return UIClientCommandResult.RanOnPage(EffectsSince(mark));
        }

        if (SubmittedForm(compiled, componentId, rowKeys, eventName) is string formId)
        {
            bool valid;

            lock (_sync)
                valid = RunSubmitValidationNoLock(formId);

            if (!valid)
            {
                NotifyIfChanged();
                return UIClientCommandResult.Refused($"The form '{formId}' has a field in error.");
            }

            if (!await SubmitHeldValuesAsync(formId, cancellationToken).ConfigureAwait(false))
            {
                NotifyIfChanged();
                return UIClientCommandResult.Refused($"The server refused a value submitted in form '{formId}'.");
            }
        }

        UICommandRequest request = new() { EventId = compiled.Id, DynamicParameters = [.. rowKeys, .. eventKeys] };

        return await SendCommandAsync(request, source, eventName, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>The form an event submits: a submit button's on its click, or the field's own where its event submits it (a code field's save).</summary>
    private string? SubmittedForm(CompiledUIEvent compiled, UIComponentId componentId, object?[] rowKeys, string eventName)
    {
        if (eventName == EventNames.Click && Read(componentId, rowKeys, ButtonComponent.SubmitFormIdProperty) is string { Length: > 0 } button)
            return button;

        return compiled.SubmitsForm && Read(componentId, rowKeys, IInputComponent.FormIdProperty) is string { Length: > 0 } field ? field : null;
    }

    /// <summary>Evaluates every field of the form up front — top-level fields and materialized row fields alike — so all its failures show; only an error refuses the submit.</summary>
    private bool RunSubmitValidationNoLock(string formId)
    {
        var valid = true;

        foreach (UIComponentNode node in View.Graph.All)
        {
            foreach (UIComponentAddress field in EnumerateFieldAddressesNoLock(node.ComponentId))
            {
                if (!IsInFormNoLock(field, formId))
                    continue;

                if (!IsShownNoLock(field.Id, field.DynamicParameters) || !IsEnabledNoLock(field.Id, field.DynamicParameters))
                    continue;

                FieldNoLock(field).Touched = true;
                _ = _changedValidations.Add(field);
                EvaluateRulesNoLock(field, UIValidationTrigger.Submit, property: null);

                if (HasErrorNoLock(field))
                    valid = false;
            }
        }

        return valid;
    }

    private IEnumerable<UIComponentAddress> EnumerateFieldAddressesNoLock(UIComponentId componentId)
    {
        IReadOnlyList<UIComponentId> roots = View.Graph.GetItemScopes(componentId);

        if (roots.Count == 0)
        {
            yield return new UIComponentAddress(componentId, []);
            yield break;
        }

        List<object?[]> keySets = [[]];

        for (var depth = 0; depth < roots.Count; depth++)
        {
            UIComponentId hostId = HostOf(roots[depth]);
            List<object?[]> nextSets = [];

            foreach (var parentKeys in keySets)
            {
                foreach (UIClientRowEntry row in ReadVisibleRowsNoLock(new UIComponentAddress(hostId, parentKeys)))
                {
                    object?[] rowKeys = [.. parentKeys, row.Key];
                    UIComponentId scope = RowScopeNoLock(hostId, parentKeys, row.Item);

                    if (IsWithin(componentId, scope, rowKeys, row.Item))
                        nextSets.Add(rowKeys);
                }
            }

            if (nextSets.Count == 0)
                yield break;

            keySets = nextSets;
        }

        foreach (var rowKeys in keySets)
            yield return new UIComponentAddress(componentId, rowKeys);
    }

    private bool IsInFormNoLock(UIComponentAddress component, string formId)
        => string.Equals(ReadNoLock(component.Id, component.DynamicParameters, IInputComponent.FormIdProperty) as string, formId, StringComparison.Ordinal);

    // A controller's bound message gates no submit: its author judged the value and will judge it again.
    private bool HasErrorNoLock(UIComponentAddress component)
    {
        UIClientField field = FieldNoLock(component);

        if (field.BoundRefusal is not null || field.Refusal?.Severity == UIValidationSeverity.Error)
            return true;

        foreach (CompiledUIValidationRule rule in field.Failing)
        {
            if (rule.Severity == UIValidationSeverity.Error)
                return true;
        }

        return false;
    }

    /// <summary>Sends what a form's fields held back for its submit; answers whether the server accepted every submitted value.</summary>
    private async Task<bool> SubmitHeldValuesAsync(string formId, CancellationToken cancellationToken)
    {
        List<UIClientWrite> writes = [];
        List<(bool HadServerValue, object? ServerValue)> savedOriginals = [];

        lock (_sync)
        {
            foreach (KeyValuePair<UIPropertyAddress, object?> held in _held)
            {
                if (IsInFormNoLock(held.Key.Component, formId))
                    writes.Add(new UIClientWrite(held.Key, held.Value));
            }

            foreach (UIClientWrite write in writes)
            {
                _ = _held.Remove(write.Address);
                var hadOriginal = _serverValues.Remove(write.Address, out var original);
                savedOriginals.Add((hadOriginal, original));
            }
        }

        try
        {
            await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);
        }
        catch
        {
            lock (_sync)
            {
                for (var i = 0; i < writes.Count; i++)
                {
                    UIPropertyAddress address = writes[i].Address;
                    _ = _held.TryAdd(address, writes[i].Value);

                    if (savedOriginals[i].HadServerValue)
                        _ = _serverValues.TryAdd(address, savedOriginals[i].ServerValue);
                }
            }

            throw;
        }

        var accepted = true;

        lock (_sync)
        {
            for (var i = 0; i < writes.Count; i++)
            {
                UIPropertyAddress address = writes[i].Address;
                UIClientField field = FieldNoLock(address.Component);

                if (field.Refusal is not null && !field.GateRefused)
                {
                    _ = _held.TryAdd(address, writes[i].Value);

                    if (savedOriginals[i].HadServerValue)
                        _ = _serverValues.TryAdd(address, savedOriginals[i].ServerValue);

                    accepted = false;
                }
                else if (field.GateRefused)
                {
                    accepted = false;
                }
            }
        }

        return accepted;
    }

    /// <summary>Sends a command and applies its answer, the event's before- and after- interactions around it.</summary>
    [SuppressMessage("Design", "CA1031:Do not catch general exception types", Justification = "Best-effort after-interaction write flush must not mask the original command exception.")]
    private async Task<UIClientCommandResult> SendCommandAsync(UICommandRequest request, UIComponentAddress? source, string? eventName, CancellationToken cancellationToken)
    {
        List<UIClientWrite> writes = [];
        int mark;

        lock (_sync)
        {
            mark = _effects.Count;

            if (source is UIComponentAddress before)
                RunEventInteractionsNoLock(before, EventNames.BeforePrefix + eventName, writes);
        }

        await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);

        UICommandExecutionResult result;

        try
        {
            result = await Transport.ProcessEventAsync(request, cancellationToken).ConfigureAwait(false);
        }
        catch
        {
            writes.Clear();

            lock (_sync)
            {
                if (source is UIComponentAddress failedAfter)
                    RunEventInteractionsNoLock(failedAfter, EventNames.AfterPrefix + eventName, writes);
            }

            if (writes.Count > 0 && !cancellationToken.IsCancellationRequested)
            {
                try
                {
                    await SendValuesAsync(writes, CancellationToken.None).ConfigureAwait(false);
                }
                catch
                {
                }
            }

            NotifyIfChanged();
            throw;
        }

        writes.Clear();

        lock (_sync)
        {
            ApplyNoLock(result.Changes.For(Transport.InstanceId));
            ApplyEffectsNoLock(result.Command.Effects);

            if (source is UIComponentAddress after)
                RunEventInteractionsNoLock(after, EventNames.AfterPrefix + eventName, writes);
        }

        await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);
        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
        NotifyIfChanged();

        return UIClientCommandResult.Answered(result.Command.Success, result.Command.Error, EffectsSince(mark));
    }

    /// <summary>
    /// Runs what effects left for after the act, once the lock is let go: a dialog the viewer closed raises its close on its content —
    /// its <c>OnClose</c> — a language or theme the page switched to is stored in the session, and an in-place back navigation notifies the runtime.
    /// </summary>
    private async Task RunReactionsAsync(CancellationToken cancellationToken)
    {
        while (true)
        {
            UIClientReaction reaction;

            lock (_sync)
            {
                if (_reactions.Count == 0)
                    return;

                reaction = _reactions[0];
                _reactions.RemoveAt(0);
            }

            if (reaction.DeferredWrites is { Count: > 0 } deferredWrites)
            {
                await SendValuesAsync(deferredWrites, cancellationToken).ConfigureAwait(false);
            }
            else if (reaction.DialogClosed is UIComponentId root)
            {
                _ = await DispatchCoreAsync(root, [], EventNames.Close, [], cancellationToken).ConfigureAwait(false);
            }
            else if (reaction.Setting is ClientEffect setting)
            {
                await ReportSettingAsync(setting, cancellationToken).ConfigureAwait(false);
            }
            else if (reaction.HasNavigateInPlace && Transport.HasController)
            {
                UICommandExecutionResult navResult = await Transport.NavigateInPlaceAsync(reaction.NavigateInPlace, cancellationToken).ConfigureAwait(false);

                lock (_sync)
                {
                    if (reaction.FallbackOrigin is UINavigationRequest origin && Array.Exists(navResult.Command.Effects, static effect => effect is NavigateEffect))
                    {
                        _navigation = origin;
                        _history[0] = origin;
                    }

                    ApplyNoLock(navResult.Changes.For(Transport.InstanceId));
                    ApplyEffectsNoLock(navResult.Command.Effects);
                }

                await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
            }
        }
    }

    /// <summary>Stores a language, theme or colours the page switched to in its session, and reaches the session's pages with it.</summary>
    private async Task ReportSettingAsync(ClientEffect setting, CancellationToken cancellationToken)
    {
        await Transport.ApplySettingAsync(setting, cancellationToken).ConfigureAwait(false);

        lock (_sync)
            _languageOrThemeChanged = true;

        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Sends values to the server in one change set and applies the answer — a refusal among them.</summary>
    private async Task SendValuesAsync(IReadOnlyList<UIClientWrite> writes, CancellationToken cancellationToken)
    {
        if (writes.Count == 0 || !Transport.HasController)
            return;

        ClientUIUpdate[] updates = new ClientUIUpdate[writes.Count];

        for (var i = 0; i < writes.Count; i++)
        {
            UIPropertyAddress address = writes[i].Address;

            updates[i] = new ClientValueUIUpdate { Address = address, Value = writes[i].Value };

            // The value it takes clears a refusal of the one before; a new refusal comes back in the answer.
            lock (_sync)
            {
                UIClientField field = FieldNoLock(address.Component);

                field.Refusal = null;
                field.GateRefused = false;
                _ = _changedValidations.Add(address.Component);
            }
        }

        ServerChangeSet answer = await Transport.ProcessChangeSetAsync(new ClientChangeSet { Updates = updates }, cancellationToken).ConfigureAwait(false);

        ApplyReceivedChanges(answer);
        MarkRevertedWrites(writes, answer);
        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
    }

    private void MarkRevertedWrites(IReadOnlyList<UIClientWrite> writes, ServerChangeSet answer)
    {
        if (answer.IsEmpty)
            return;

        lock (_sync)
        {
            for (var i = 0; i < writes.Count; i++)
            {
                if (WasWriteReverted(answer, writes[i].Address))
                {
                    FieldNoLock(writes[i].Address.Component).GateRefused = true;
                    _ = _changedValidations.Add(writes[i].Address.Component);
                }
            }
        }
    }

    private static bool WasWriteReverted(ServerChangeSet answer, UIPropertyAddress written)
    {
        for (var i = 0; i < answer.Updates.Length; i++)
        {
            if (answer.Updates[i] is ServerValueUIUpdate reverted
                && reverted.Address.Component.Id == written.Component.Id
                && reverted.Address.Property == written.Property
                && HasRowKeyPrefix(written.Component.DynamicParameters, reverted.Address.Component.DynamicParameters))
            {
                return true;
            }
        }

        return false;
    }

    private static bool HasRowKeyPrefix(object?[] full, object?[] prefix)
    {
        if (prefix.Length > full.Length)
            return false;

        for (var i = 0; i < prefix.Length; i++)
        {
            if (!Equals(full[i], prefix[i]))
                return false;
        }

        return true;
    }

    private List<ClientEffect> EffectsSince(int mark)
    {
        lock (_sync)
            return mark >= _effects.Count ? [] : _effects.GetRange(mark, _effects.Count - mark);
    }

    /// <summary>
    /// Holds a value at an address — sent, typed, or an interaction's — and runs what reads it: the field's change rules and the
    /// interactions whose source it is; a value an interaction wrote locally to a property bound to write back is owed to the server.
    /// </summary>
    private void WriteValueNoLock(UIPropertyAddress address, object? value, bool local, int depth, List<UIClientWrite> writes)
    {
        SetValueEntryNoLock(address, value);
        _ = _changedProperties.Add(address);

        if (address.Property == IInputComponent.ValidationProperty)
        {
            FieldNoLock(address.Component).Touched = true;
            _ = _changedValidations.Add(address.Component);
        }
        else
        {
            EvaluateRulesNoLock(address.Component, UIValidationTrigger.Change, address.Property);
        }

        if (address.Property == IInputComponent.ValueProperty)
            EvaluateRulesAgainstNoLock(address.Component);

        if (depth > MaxInteractionDepth)
            return;

        foreach (CompiledUIInteraction interaction in View.Interactions.GetBySource(new UIPropertyAddress(address.Component.Id, address.Property)))
            ApplyInteractionNoLock(interaction, address.Component.DynamicParameters, local, value, depth, writes);
    }

    private void RunEventInteractionsNoLock(UIComponentAddress source, string eventName, List<UIClientWrite> writes)
    {
        foreach (CompiledUIInteraction interaction in View.Interactions.GetBySource(new CompiledUIEventAddress(source.Id, eventName)))
        {
            if (IsRowsOwn(interaction, source.DynamicParameters))
                ApplyInteractionNoLock(interaction, source.DynamicParameters, local: true, sourceValue: true, depth: 0, writes);
        }
    }

    /// <summary>Whether the event, raised in this row, is a row's own interaction's, which the page runs in place of the event's command.</summary>
    private bool TakesRowEvent(UIComponentAddress source, string eventName)
    {
        foreach (CompiledUIInteraction interaction in View.Interactions.GetBySource(new CompiledUIEventAddress(source.Id, eventName)))
        {
            if (interaction.RowKey is not null && IsRowsOwn(interaction, source.DynamicParameters))
                return true;
        }

        return false;
    }

    /// <summary>An interaction as the client runs it: its effect while the condition holds, else the value it writes to its target.</summary>
    private void ApplyInteractionNoLock(CompiledUIInteraction interaction, object?[] rowKeys, bool local, object? sourceValue, int depth, List<UIClientWrite> writes)
    {
        var matches = UIComparisonEvaluator.Evaluate(sourceValue, interaction.Operator, interaction.Value);

        if (interaction.ActionKind == UIInteractionActionKind.Effect)
        {
            if (matches && interaction.Effect is { } effect)
            {
                UIComponentId? sourceId = interaction.Source?.Component.Id ?? interaction.SourceEvent?.ComponentId;
                UIComponentAddress? sourceAddress = sourceId is UIComponentId id ? new UIComponentAddress(id, rowKeys) : null;
                ApplyEffectsNoLock([effect], sourceAddress, depth, writes);
            }

            return;
        }

        if (interaction.Target is not UIPropertyAddress target)
            return;

        var next = interaction.ActionKind == UIInteractionActionKind.CopyValue
            ? IsBlank(sourceValue) ? interaction.FalseValue : sourceValue
            : matches ? interaction.TrueValue : interaction.FalseValue;
        var keys = rowKeys[..Math.Min(rowKeys.Length, View.Graph.GetItemScopes(target.Component.Id).Count)];
        UIPropertyAddress address = new(new UIComponentAddress(target.Component.Id, keys), target.Property);

        WriteValueNoLock(address, next, local, depth + 1, writes);

        // Only what the page wrote itself: an interaction answering a server change must not echo it back.
        if (local && BindingOf(target.Component.Id, target.Property) is { Mode: UIBindingMode.TwoWay or UIBindingMode.OneWayToSource })
            writes.Add(new UIClientWrite(address, next));
    }

    private static bool IsBlank(object? value)
        => value is null || (value is string text && string.IsNullOrWhiteSpace(text));

    /// <summary>Evaluates a field's rules of one trigger against the value it holds — those on <paramref name="property"/> alone where given.</summary>
    private void EvaluateRulesNoLock(UIComponentAddress component, UIValidationTrigger trigger, UIProperty? property)
    {
        IReadOnlyList<CompiledUIValidationRule> rules = View.Validations.GetByComponent(component.Id);

        if (rules.Count == 0)
            return;

        UIClientField field = FieldNoLock(component);

        foreach (CompiledUIValidationRule rule in rules)
        {
            if (rule.Trigger == trigger && (property is not UIProperty only || rule.Target.Property == only))
                JudgeNoLock(component, rule, field);
        }
    }

    /// <summary>
    /// Judges one rule against the value a field holds, compared with the rule's value or with the value of the field it names — in
    /// the field's row, else standing in no row — as the page reads it.
    /// </summary>
    private void JudgeNoLock(UIComponentAddress component, CompiledUIValidationRule rule, UIClientField field)
    {
        var value = ReadNoLock(component.Id, component.DynamicParameters, rule.Target.Property);
        var comparand = rule.ValueSource is UIPropertyAddress source
            ? ReadNoLock(source.Component.Id, component.DynamicParameters[..Math.Min(component.DynamicParameters.Length, View.Graph.GetItemScopes(source.Component.Id).Count)], source.Property)
            : rule.Value;

        if (PassesRule(value, rule.Operator, comparand))
            _ = field.Failing.Remove(rule);
        else
            _ = field.Failing.Add(rule);

        _ = _changedValidations.Add(component);
    }

    /// <summary>
    /// Whether a value passes a rule as the page's validation judges it (<c>validation-engine.ts</c>): every rule but
    /// <see cref="UIComparisonOperator.Required"/> passes on an empty value, so an empty field says only that it is required.
    /// </summary>
    private static bool PassesRule(object? value, UIComparisonOperator @operator, object? comparand)
        => (@operator != UIComparisonOperator.Required && IsEmptyValue(value)) || UIComparisonEvaluator.Evaluate(value, @operator, comparand);

    /// <summary>Nothing given: what <see cref="UIComparisonOperator.Required"/> refuses, but a toggle's <see langword="false"/>, which is a value.</summary>
    private static bool IsEmptyValue(object? value)
        => value is not false && !UIComparisonEvaluator.Evaluate(value, UIComparisonOperator.Required, null);

    /// <summary>
    /// Judges again the rules that compare with this field's value — "Password again" as "New password" changes — in the field's own
    /// row, or in each row the page holds a field of where it stands outside them. Every write here is a settled value (typed and left,
    /// given, an interaction's), so a Change and a Blur rule are judged, as the page judges them on a commit; a submit's rules wait.
    /// </summary>
    private void EvaluateRulesAgainstNoLock(UIComponentAddress source)
    {
        foreach (CompiledUIValidationRule rule in View.Validations.All)
        {
            if (rule.Trigger == UIValidationTrigger.Submit || rule.ValueSource is not UIPropertyAddress named || named.Component.Id != source.Id)
                continue;

            UIComponentId target = rule.Target.Component.Id;

            if (View.Graph.GetItemScopes(target).Count == source.DynamicParameters.Length)
            {
                UIComponentAddress field = new(target, source.DynamicParameters);

                JudgeNoLock(field, rule, FieldNoLock(field));
                continue;
            }

            foreach ((UIComponentAddress field, UIClientField state) in _fields)
            {
                if (field.Id == target && field.DynamicParameters.Length > source.DynamicParameters.Length && field.DynamicParameters.AsSpan(0, source.DynamicParameters.Length).SequenceEqual(source.DynamicParameters, EqualityComparer<object?>.Default))
                    JudgeNoLock(field, rule, state);
            }
        }
    }

    /// <summary>
    /// The strongest message a field shows: the page's refusal of a value past its bounds, the server's refusal, the controller's bound
    /// message, or a failing rule's once the reader has been in the field — the graver first, the first of equals.
    /// </summary>
    internal (UIPhrase Message, UIValidationSeverity Severity)? Message(UIComponentId componentId, object?[] rowKeys)
    {
        lock (_sync)
            return MessageNoLock(new UIComponentAddress(componentId, rowKeys));
    }

    private (UIPhrase Message, UIValidationSeverity Severity)? MessageNoLock(UIComponentAddress component)
    {
        UIClientField field = FieldNoLock(component);
        (UIPhrase Message, UIValidationSeverity Severity)? strongest = null;

        if (field.BoundRefusal is { } outOfBounds)
            strongest = (outOfBounds, UIValidationSeverity.Error);

        if (field.Refusal is { } refusal && Graver(refusal.Severity, strongest))
            strongest = (refusal.Message, refusal.Severity);

        if (ReadNoLock(component.Id, component.DynamicParameters, IInputComponent.ValidationProperty) is UIValidationMessage bound && Graver(bound.Severity, strongest))
            strongest = (bound.Message, bound.Severity);

        if (!field.Touched)
            return strongest;

        foreach (CompiledUIValidationRule rule in View.Validations.GetByComponent(component.Id))
        {
            if (field.Failing.Contains(rule) && Graver(rule.Severity, strongest))
                strongest = (rule.Message, rule.Severity);
        }

        return strongest;
    }

    private static bool Graver(UIValidationSeverity severity, (UIPhrase Message, UIValidationSeverity Severity)? than)
        => than is null || severity < than.Value.Severity;

    /// <summary>Writes active validation messages of fields using <c>ValidationInto</c> onto their target component properties.</summary>
    internal void SyncRedirectedValidationMessagesNoLock()
    {
        if (View.Validations.MessageTargets.Count == 0 || (_changedValidations.Count == 0 && !_languageOrThemeChanged && !_fullResyncOccurred))
            return;

        Dictionary<UIPropertyAddress, List<string>>? gathered = null;

        foreach (UIComponentNode node in View.Graph.All)
        {
            if (!View.Validations.TryGetMessageTarget(node.ComponentId, out UIPropertyAddress target))
                continue;

            var targetDepth = View.Graph.GetItemScopes(target.Component.Id).Count;

            foreach (UIComponentAddress field in EnumerateFieldAddressesNoLock(node.ComponentId))
            {
                if (MessageNoLock(field) is not { } message || Words(message.Message) is not { Length: > 0 } words)
                    continue;

                var targetKeys = field.DynamicParameters.Length >= targetDepth ? field.DynamicParameters[..targetDepth] : [];
                UIPropertyAddress targetAddress = new(new UIComponentAddress(target.Component.Id, targetKeys), target.Property);

                gathered ??= [];
                if (!gathered.TryGetValue(targetAddress, out List<string>? lines))
                {
                    lines = [];
                    gathered.Add(targetAddress, lines);
                }

                lines.Add(words);
            }
        }

        if (_redirectedTargets.Count > 0)
        {
            List<UIPropertyAddress>? cleared = null;

            foreach (UIPropertyAddress previous in _redirectedTargets)
            {
                if (gathered is null || !gathered.ContainsKey(previous))
                    (cleared ??= []).Add(previous);
            }

            if (cleared is not null)
            {
                for (var i = 0; i < cleared.Count; i++)
                {
                    UIPropertyAddress address = cleared[i];
                    _ = _redirectedTargets.Remove(address);

                    if (View.State.TryGetValue(address.Component.Id, address.Property, out CompiledUIPropertyValue? compiled) && compiled.Value is not null)
                        SetValueEntryNoLock(address, null);
                    else
                        _ = RemoveValueEntryNoLock(address);

                    _ = _changedProperties.Add(address);
                }
            }
        }

        if (gathered is null)
            return;

        foreach ((UIPropertyAddress targetAddress, List<string> lines) in gathered)
        {
            var joined = string.Join('\n', lines);

            if (!_values.TryGetValue(targetAddress, out var existing) || !Equals(existing, joined))
            {
                SetValueEntryNoLock(targetAddress, joined);
                _ = _changedProperties.Add(targetAddress);
            }

            _ = _redirectedTargets.Add(targetAddress);
        }
    }
}
