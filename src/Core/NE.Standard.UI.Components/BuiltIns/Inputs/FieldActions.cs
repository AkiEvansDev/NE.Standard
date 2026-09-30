using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// The buttons a field carries at either end, kept as its regions under <see cref="RegionNames.FieldAction"/> names in the order
/// they were added — the text input's and the text area's alike. A flyout among them stands in its region whole and is listed by
/// the button it opens from.
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
        => Add(_leading, RegionNames.LeadingAction, action, action);

    public void AddLeading(FlyoutComponent flyout)
        => Add(_leading, RegionNames.LeadingAction, AnchorOf(flyout), flyout);

    public void AddTrailing(IButtonComponent action)
        => Add(_trailing, RegionNames.TrailingAction, action, action);

    public void AddTrailing(FlyoutComponent flyout)
        => Add(_trailing, RegionNames.TrailingAction, AnchorOf(flyout), flyout);

    /// <summary>Makes <paramref name="action"/> the field's one trailing action, in place of any added before.</summary>
    public void SetTrailing(IButtonComponent action)
    {
        ArgumentNullException.ThrowIfNull(action);

        ClearTrailing();
        Add(_trailing, RegionNames.TrailingAction, action, action);
    }

    /// <summary>Makes <paramref name="flyout"/> the field's one trailing action, in place of any added before.</summary>
    public void SetTrailing(FlyoutComponent flyout)
    {
        IButtonComponent anchor = AnchorOf(flyout);

        ClearTrailing();
        Add(_trailing, RegionNames.TrailingAction, anchor, flyout);
    }

    private void ClearTrailing()
    {
        for (var i = 1; i < _trailing.Count; i++)
            _ = _regions.Remove(RegionNames.FieldAction(RegionNames.TrailingAction, i));

        _trailing.Clear();
    }

    private void Add(List<IButtonComponent> actions, string side, IButtonComponent control, IVisualComponent region)
    {
        ArgumentNullException.ThrowIfNull(control);

        _regions[RegionNames.FieldAction(side, actions.Count)] = region;
        actions.Add(control);
    }

    /// <summary>The button a flyout opens from: a field's actions are its buttons, so a flyout among them must open from one.</summary>
    private static IButtonComponent AnchorOf(FlyoutComponent flyout)
    {
        ArgumentNullException.ThrowIfNull(flyout);

        return flyout.Anchor as IButtonComponent
            ?? throw new ArgumentException("A flyout among a field's actions opens from a button: set its anchor to one before adding it.", nameof(flyout));
    }
}
