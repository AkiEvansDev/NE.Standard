using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Items;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// The projection of every items host of a view, made once when the view compiles.
/// </summary>
public sealed class UIItemProjectionIndex
{
    private readonly FrozenDictionary<UIComponentId, UIItemProjection> _projections;

    /// <summary>
    /// Initializes the index from each host's projection.
    /// </summary>
    public UIItemProjectionIndex(IReadOnlyDictionary<UIComponentId, UIItemProjection> projections)
    {
        ArgumentNullException.ThrowIfNull(projections);

        _projections = projections.ToFrozenDictionary();
    }

    /// <summary>
    /// Gets an index that knows no host, so every item travels whole.
    /// </summary>
    public static UIItemProjectionIndex Empty { get; } = new(new Dictionary<UIComponentId, UIItemProjection>());

    /// <summary>
    /// Gets the projection of a host's items, <see cref="UIItemProjection.Whole"/> for a host the compile did not project.
    /// </summary>
    public UIItemProjection For(UIComponentId host)
        => _projections.TryGetValue(host, out UIItemProjection? projection) ? projection : UIItemProjection.Whole;
}
