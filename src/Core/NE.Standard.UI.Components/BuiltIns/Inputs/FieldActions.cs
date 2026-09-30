using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// The buttons a field carries at either end, kept as its regions under <see cref="RegionNames.FieldAction"/> names in the order
/// they were added — the text input's and the text area's alike.
/// </summary>
internal sealed class FieldActions
{
    private readonly Dictionary<string, IVisualComponent> _regions = new(StringComparer.Ordinal);
    private readonly List<IButtonComponent> _leading = [];
    private readonly List<IButtonComponent> _trailing = [];

    public IReadOnlyDictionary<string, IVisualComponent> Regions => _regions;

    public IReadOnlyList<IButtonComponent> Leading => _leading;

    public IReadOnlyList<IButtonComponent> Trailing => _trailing;

    public void AddLeading(IButtonComponent action)
        => Add(_leading, RegionNames.LeadingAction, action);

    public void AddTrailing(IButtonComponent action)
        => Add(_trailing, RegionNames.TrailingAction, action);

    /// <summary>Makes <paramref name="action"/> the field's one trailing action, in place of any added before.</summary>
    public void SetTrailing(IButtonComponent action)
    {
        ArgumentNullException.ThrowIfNull(action);

        for (var i = 1; i < _trailing.Count; i++)
            _ = _regions.Remove(RegionNames.FieldAction(RegionNames.TrailingAction, i));

        _trailing.Clear();
        Add(_trailing, RegionNames.TrailingAction, action);
    }

    private void Add(List<IButtonComponent> actions, string side, IButtonComponent action)
    {
        ArgumentNullException.ThrowIfNull(action);

        _regions[RegionNames.FieldAction(side, actions.Count)] = action;
        actions.Add(action);
    }
}
