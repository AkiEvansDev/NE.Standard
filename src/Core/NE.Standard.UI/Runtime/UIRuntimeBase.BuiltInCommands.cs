using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Updates.Client;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    /// <summary>
    /// Runs a command the framework raises for itself (<see cref="UIBuiltInCommands"/>) in the place of a controller's, in the same
    /// turn and through the same answer.
    /// </summary>
    /// <remarks>
    /// Not authorized as a controller's command is: like a value written back, it writes what the page already shows. A move is gated
    /// on the tab's <c>CanDrag</c> as any row's <c>move</c> is, before it gets here; a pin is the reader's whether or not it may be dragged.
    /// </remarks>
    private async Task<UICommandResult> RunBuiltInCommandAsync(UICommandRequest request, string command, IReadOnlyDictionary<string, object?> arguments, CancellationToken cancellationToken)
    {
        CompiledUIEvent compiledEvent = View.Events.GetRequired(request.EventId);
        var key = arguments.GetValueOrDefault(UIBuiltInCommands.KeyArgument) as string ?? throw new InvalidOperationException($"Command '{command}' names no tab.");
        int? index = command switch
        {
            UIBuiltInCommands.MoveTab => ReadTabIndex(arguments.GetValueOrDefault(UIBuiltInCommands.IndexArgument)),
            UIBuiltInCommands.PlaceTab => null,
            _ => throw new InvalidOperationException($"Command '{command}' is no command the framework runs.")
        };

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            PlaceTabNoLock(compiledEvent, request.DynamicParameters, key, index);
        }
        finally
        {
            _ = _stateLock.Release();
        }

        return UICommandResult.Ok();
    }

    private static int ReadTabIndex(object? value)
        => value switch
        {
            int index => index,
            long index => checked((int)index),
            double index when index == Math.Floor(index) => checked((int)index),
            string text when int.TryParse(text, NumberStyles.Integer, CultureInfo.InvariantCulture, out var index) => index,
            _ => throw new InvalidOperationException("A tab's move names no place.")
        };

    /// <summary>
    /// Puts the tab the keys name where a drop put it (<paramref name="index"/>, its place in the strip after the move), or at the edge
    /// of the pinned tabs, and writes the orders that keep it there through each tab's own <c>Order</c> binding.
    /// </summary>
    /// <remarks>
    /// The strip's arithmetic as the client had it: the moved tab takes an order between its new neighbours, and only where a neighbour
    /// carries none — such a tab sorts ahead of any number — is every tab numbered by its place.
    /// </remarks>
    private void PlaceTabNoLock(CompiledUIEvent compiledEvent, object?[] dynamicParameters, string key, int? index)
    {
        UIComponentId tabId = compiledEvent.Address.ComponentId;

        if (!Gates.TryGetRowRoot(tabId, out UIRowAbilities? row) || row!.Items?.Bound is not { } bound || dynamicParameters.Length < row.RowParameterCount)
            throw new InvalidOperationException($"Command '{compiledEvent.Command}' was raised on no tab of a strip the controller holds.");

        var rowParameters = TakeDynamicParameters(dynamicParameters, row.RowParameterCount);

        if (!TryResolveGatePath(bound, rowParameters, out RecursivePath path) || !Controller.TryGetRecursiveValue(path, out var held) || held is not IEnumerable tabs)
            throw new InvalidOperationException($"Command '{compiledEvent.Command}' found no tabs at '{path}'.");

        List<StripTab> strip = ReadStripNoLock(tabId, rowParameters, tabs);
        var from = strip.FindIndex(tab => string.Equals(tab.Key, key, StringComparison.Ordinal));

        if (from < 0)
            throw new InvalidOperationException($"Command '{compiledEvent.Command}' names tab '{key}', which the strip does not hold.");

        StripTab moved = strip[from];

        strip.RemoveAt(from);

        var to = index is int place ? Math.Clamp(place, 0, strip.Count) : PinnedBoundary(strip);

        strip.Insert(to, moved);

        if (to == from)
            return;

        foreach ((var at, var order) in OrdersAfterMove(strip, to))
            WriteTabOrderNoLock(tabId, strip[at].Parameters, order);
    }

    /// <summary>The strip as it stands: every tab with its keys, its order and whether it is pinned, sorted as the strip sorts them.</summary>
    private List<StripTab> ReadStripNoLock(UIComponentId tabId, object?[] rowParameters, IEnumerable tabs)
    {
        List<StripTab> strip = [];
        var outer = TakeDynamicParameters(rowParameters, rowParameters.Length - 1);

        foreach (var tab in tabs)
        {
            if (tab is not IBindableItem item)
                continue;

            var parameters = AppendDynamicParameter(outer, item.Id);

            strip.Add(new StripTab(item.Id, parameters, strip.Count, ReadTabValueNoLock(tabId, TabItemComponent.OrderProperty, parameters) is { } order ? Convert.ToDouble(order, CultureInfo.InvariantCulture) : null, ReadTabValueNoLock(tabId, TabItemComponent.PinnedProperty, parameters) is true));
        }

        // A tab with no order sorts ahead of any number; ties keep the collection's order, as the page's stable sort does, which
        // List.Sort alone does not keep.
        strip.Sort(static (left, right) =>
        {
            var order = left.Order is null ? right.Order is null ? 0 : -1 : right.Order is null ? 1 : left.Order.Value.CompareTo(right.Order.Value);

            return order != 0 ? order : left.Position.CompareTo(right.Position);
        });

        return strip;
    }

    /// <summary>A tab's bound value, read where its binding points; null where the template does not bind it.</summary>
    private object? ReadTabValueNoLock(UIComponentId tabId, UIProperty property, object?[] parameters)
    {
        UIPropertyAddress address = new(tabId, property);

        if (!View.Bindings.TryGetProperty(address, out _))
            return null;

        CompiledUIBindingResolution resolution = View.Bindings.Resolve(address, parameters);

        return resolution.Source.Kind == CompiledUIBindingSourceKind.Controller ? TryGetControllerValue(resolution.Path) : null;
    }

    /// <summary>Where a tab just pinned or unpinned goes among the others, in strip order: right after the last pinned one, else first.</summary>
    private static int PinnedBoundary(List<StripTab> others)
    {
        var index = 0;

        for (var i = 0; i < others.Count; i++)
        {
            if (others[i].Pinned)
                index = i + 1;
        }

        return index;
    }

    /// <summary>The orders to write, by place, once the tab at <paramref name="index"/> stands there in <paramref name="strip"/>.</summary>
    private static Dictionary<int, double> OrdersAfterMove(List<StripTab> strip, int index)
    {
        StripTab? next = index + 1 < strip.Count ? strip[index + 1] : null;

        if (next is null || next.Order is not null)
            return new Dictionary<int, double> { [index] = OrderBetween(index > 0 ? strip[index - 1].Order : null, next?.Order) };

        Dictionary<int, double> orders = [];

        for (var place = 0; place < strip.Count; place++)
        {
            if (strip[place].Order != place)
                orders[place] = place;
        }

        return orders;
    }

    /// <summary>The order a tab takes between two neighbours, either of which may be missing or carry none.</summary>
    private static double OrderBetween(double? previous, double? next)
        => (previous, next) switch
        {
            (null, null) => 0,
            (null, double after) => after - 1,
            (double before, null) => before + 1,
            (double before, double after) => (before + after) / 2
        };

    /// <summary>Writes one tab's order as the page's own write would land, through the tab's two-way binding.</summary>
    private void WriteTabOrderNoLock(UIComponentId tabId, object?[] parameters, double order)
    {
        ClientValueUIUpdate update = new()
        {
            Address = new UIPropertyAddress(tabId, TabItemComponent.OrderProperty),
            DynamicParameters = parameters,
            Value = order
        };

        _ = ApplyValueUpdate(update, View.Bindings.Resolve(update.Address, parameters), read: null, out _);
    }

    /// <summary>
    /// One tab of a strip as its arithmetic sees it: its key, the keys its bindings resolve by, its place in the collection, its order
    /// and whether it is pinned.
    /// </summary>
    private sealed record StripTab(string Key, object?[] Parameters, int Position, double? Order, bool Pinned);

    /// <summary>What a built-in command answers to as a command: one at a time, between exclusive commands.</summary>
    private sealed class BuiltInCommandMetadata(string name) : IUICommandMetadata
    {
        public string Name { get; } = name;

        public UICommandConcurrencyMode ConcurrencyMode => UICommandConcurrencyMode.Exclusive;

        public int MaxConcurrent => 0;

        public bool? AllowAnonymous => null;

        public IReadOnlyList<UIAccessRule> AccessRules => [];
    }
}
