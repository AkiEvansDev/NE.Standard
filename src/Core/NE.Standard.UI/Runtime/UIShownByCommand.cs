using System;
using System.Collections.Generic;
using System.Threading;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Runtime;

/// <summary>
/// The components authored hidden that a command's show opened, for the page that received it alone, by the row each stands in: a hide
/// or a collapse sent to that page closes one again, and a page leaving or attaching anew forgets its own — a reload draws them hidden.
/// </summary>
/// <remarks>
/// Recorded as an answer or a push reaches a page, never as an effect resolves: another tab of the runtime, or a page an effect was not
/// sent to, keeps the gate. Read on a refusal's path alone (a static Hidden closing), so an open page pays nothing for it.
/// </remarks>
internal sealed class UIShownByCommand
{
    private readonly Lock _sync = new();

    // By page instance, then by component: the row keys each was shown in. Null until the first show, so the read is one field.
    private Dictionary<string, Dictionary<UIComponentId, List<object?[]>>>? _byPage;

    /// <summary>Follows what <paramref name="effects"/> sent to the page <paramref name="instanceId"/> do to a component authored hidden.</summary>
    public void Follow(string instanceId, IReadOnlyList<ClientEffect> effects, UIComponentGateIndex gates)
    {
        if (gates.IsEmpty)
            return;

        for (var i = 0; i < effects.Count; i++)
        {
            if (effects[i] is not CompiledTargetedClientEffect targeted)
                continue;

            switch (targeted.Kind)
            {
                case ClientEffectKinds.Show when IsAuthoredHidden(gates, targeted.Target.Id):
                    Add(instanceId, targeted.Target);
                    break;
                case ClientEffectKinds.Hide or ClientEffectKinds.Collapse when Volatile.Read(ref _byPage) is not null:
                    Remove(instanceId, targeted.Target);
                    break;
                default:
                    break;
            }
        }
    }

    /// <summary>Whether the component's own static visibility closes it: what a show may lift, unlike an ancestor's or a bound one.</summary>
    private static bool IsAuthoredHidden(UIComponentGateIndex gates, UIComponentId componentId)
    {
        if (!gates.TryGet(componentId, out UIComponentGates? own))
            return false;

        foreach (UIComponentGate gate in own!.Chain)
        {
            if (gate is { Kind: UIComponentGateKind.Visibility, Binding: null } && gate.Owner.Equals(componentId))
                return true;
        }

        return false;
    }

    private void Add(string instanceId, UIComponentAddress target)
    {
        lock (_sync)
        {
            _byPage ??= new Dictionary<string, Dictionary<UIComponentId, List<object?[]>>>(StringComparer.Ordinal);

            if (!_byPage.TryGetValue(instanceId, out Dictionary<UIComponentId, List<object?[]>>? byComponent))
                _byPage[instanceId] = byComponent = [];

            if (!byComponent.TryGetValue(target.Id, out List<object?[]>? rows))
                byComponent[target.Id] = rows = [];

            if (IndexOf(rows, target.DynamicParameters) < 0)
                rows.Add(target.DynamicParameters);
        }
    }

    private static int IndexOf(List<object?[]> rows, object?[] keys)
    {
        for (var i = 0; i < rows.Count; i++)
        {
            if (rows[i].AsSpan().SequenceEqual(keys))
                return i;
        }

        return -1;
    }

    private void Remove(string instanceId, UIComponentAddress target)
    {
        lock (_sync)
        {
            if (_byPage is null || !_byPage.TryGetValue(instanceId, out Dictionary<UIComponentId, List<object?[]>>? byComponent)
                || !byComponent.TryGetValue(target.Id, out List<object?[]>? rows))
            {
                return;
            }

            var at = IndexOf(rows, target.DynamicParameters);

            if (at >= 0)
                rows.RemoveAt(at);
        }
    }

    /// <summary>
    /// Whether a show the page <paramref name="instanceId"/> received lifts <paramref name="gate"/>, its owner's static Hidden, for the row
    /// the keys name; compares in place, allocating nothing.
    /// </summary>
    public bool Lifts(string instanceId, UIComponentGate gate, object?[] dynamicParameters)
    {
        if (gate.Kind != UIComponentGateKind.Visibility || gate.Binding is not null || Volatile.Read(ref _byPage) is null)
            return false;

        lock (_sync)
        {
            if (!_byPage!.TryGetValue(instanceId, out Dictionary<UIComponentId, List<object?[]>>? byComponent) || !byComponent.TryGetValue(gate.Owner, out List<object?[]>? rows))
                return false;

            for (var i = 0; i < rows.Count; i++)
            {
                var keys = rows[i];

                if (keys.Length <= dynamicParameters.Length && keys.AsSpan().SequenceEqual(dynamicParameters.AsSpan(0, keys.Length)))
                    return true;
            }
        }

        return false;
    }

    /// <summary>Forgets what the page <paramref name="instanceId"/> was shown: it left, or attached anew and draws them as authored.</summary>
    public void Forget(string instanceId)
    {
        if (Volatile.Read(ref _byPage) is null)
            return;

        lock (_sync)
            _ = _byPage!.Remove(instanceId);
    }

    /// <summary>Forgets what every page was shown: a full resync draws the whole page anew, as authored.</summary>
    public void ForgetAll()
    {
        if (Volatile.Read(ref _byPage) is null)
            return;

        lock (_sync)
            _byPage!.Clear();
    }

    /// <summary>
    /// Forgets, on every page, what was shown in the rows of <paramref name="hostId"/> at <paramref name="hostKeys"/> that left their
    /// collection — the one keyed <paramref name="rowKey"/>, or every row where null (a reset, a list sent whole): a row back under the
    /// same key is drawn as authored.
    /// </summary>
    public void ForgetRows(UIComponentGraph graph, UIComponentId hostId, object?[] hostKeys, string? rowKey)
    {
        if (Volatile.Read(ref _byPage) is null)
            return;

        lock (_sync)
        {
            foreach (Dictionary<UIComponentId, List<object?[]>> byComponent in _byPage!.Values)
            {
                foreach (KeyValuePair<UIComponentId, List<object?[]>> shown in byComponent)
                {
                    if (StandsInRowsOf(graph, shown.Key, hostId, hostKeys.Length))
                        RemoveUnder(shown.Value, hostKeys, rowKey);
                }
            }
        }
    }

    /// <summary>Whether the component stands in the rows of <paramref name="hostId"/>, whose key is the one at <paramref name="depth"/>.</summary>
    private static bool StandsInRowsOf(UIComponentGraph graph, UIComponentId componentId, UIComponentId hostId, int depth)
    {
        IReadOnlyList<UIComponentId> scopes = graph.GetItemScopes(componentId);

        return depth < scopes.Count && graph.TryGet(scopes[depth], out UIComponentNode? root) && root.ParentId is UIComponentId parent && parent.Equals(hostId);
    }

    private static void RemoveUnder(List<object?[]> rows, object?[] hostKeys, string? rowKey)
    {
        for (var i = rows.Count - 1; i >= 0; i--)
        {
            var keys = rows[i];

            if (keys.Length > hostKeys.Length
                && keys.AsSpan(0, hostKeys.Length).SequenceEqual(hostKeys)
                && (rowKey is null || Equals(keys[hostKeys.Length], rowKey)))
            {
                rows.RemoveAt(i);
            }
        }
    }
}
