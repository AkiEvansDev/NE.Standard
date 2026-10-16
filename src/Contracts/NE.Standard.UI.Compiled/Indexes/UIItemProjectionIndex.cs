using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Items;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// The projection of every items host of a view, and what each host's own rules read off its rows, made once when the view compiles.
/// </summary>
public sealed class UIItemProjectionIndex
{
    private readonly FrozenDictionary<UIComponentId, UIItemProjection> _projections;
    private readonly FrozenDictionary<UIComponentId, string[]> _ruleReads;
    private readonly FrozenSet<UIComponentId> _boundRules;

    /// <summary>
    /// Initializes the index from each host's projection, the dotted item paths each host's static rules read, and the hosts whose
    /// rules or query are bound.
    /// </summary>
    public UIItemProjectionIndex(IReadOnlyDictionary<UIComponentId, UIItemProjection> projections, IReadOnlyDictionary<UIComponentId, string[]>? ruleReads = null, IEnumerable<UIComponentId>? boundRules = null)
    {
        ArgumentNullException.ThrowIfNull(projections);

        _projections = projections.ToFrozenDictionary();
        _ruleReads = ruleReads is null ? FrozenDictionary<UIComponentId, string[]>.Empty : ruleReads.ToFrozenDictionary();
        _boundRules = boundRules is null ? [] : boundRules.ToFrozenSet();
    }

    /// <summary>
    /// Gets an index that knows no host, so every item travels whole.
    /// </summary>
    public static UIItemProjectionIndex Empty { get; } = new(new Dictionary<UIComponentId, UIItemProjection>());

    /// <summary>
    /// Gets whether any host reads its rows by rules of its own, static or bound.
    /// </summary>
    public bool HasRules => _ruleReads.Count > 0 || _boundRules.Count > 0;

    /// <summary>
    /// Gets the projection of a host's items, <see cref="UIItemProjection.Whole"/> for a host the compile did not project.
    /// </summary>
    public UIItemProjection For(UIComponentId host)
        => _projections.TryGetValue(host, out UIItemProjection? projection) ? projection : UIItemProjection.Whole;

    /// <summary>
    /// Gets the item properties, dotted, that a host's static rules read — its items view's filters and sorts and a static query's
    /// terms; false for a host with none, and for a windowed host, whose rules its source answers.
    /// </summary>
    public bool TryGetRuleReads(UIComponentId host, [NotNullWhen(true)] out string[]? paths)
        => _ruleReads.TryGetValue(host, out paths);

    /// <summary>
    /// Gets whether a host's items view or query is bound, so what its rules read is known only from their value as it stands.
    /// </summary>
    public bool HasBoundRules(UIComponentId host)
        => _boundRules.Contains(host);
}
