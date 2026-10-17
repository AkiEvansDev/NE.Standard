using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// The buttons a field carries at either end, kept as its regions under <see cref="RegionNames.FieldAction"/> names in the order
/// they stand — the text input's and the text area's alike — and one per end flagged in the field, under
/// <see cref="RegionNames.LeadingInFieldAction"/> and <see cref="RegionNames.TrailingInFieldAction"/>, first and last.
/// A flyout among them stands in its region whole and is listed by the button it opens from.
/// </summary>
internal sealed class FieldActions
{
    // Whose actions a flyout's anchor is refused among.
    private const string Host = "a field's";

    private readonly Dictionary<string, IVisualComponent> _regions = new(StringComparer.Ordinal);
    private readonly List<IButtonComponent> _leading = [];
    private readonly List<IButtonComponent> _trailing = [];

    public IReadOnlyDictionary<string, IVisualComponent> Regions => _regions;

    public IReadOnlyList<IButtonComponent> Leading => _leading;

    public IReadOnlyList<IButtonComponent> Trailing => _trailing;

    public IButtonComponent? LeadingInField { get; private set; }

    public IButtonComponent? TrailingInField { get; private set; }

    // The trailing actions numbered under RegionNames.TrailingAction: all but the in-field one, which has a region of its own.
    private int TrailingNumbered => TrailingInField is null ? _trailing.Count : _trailing.Count - 1;

    /// <summary>Adds <paramref name="action"/> at the field's start; <paramref name="inField"/> stands it first, one to a field.</summary>
    public void AddLeading(IButtonComponent action, bool inField)
        => AddLeading(action, action, inField);

    /// <summary>Adds <paramref name="flyout"/> at the field's start, listed by the button it opens from, as the button's overload.</summary>
    public void AddLeading(FlyoutComponent flyout, bool inField)
        => AddLeading(FlyoutComponent.ButtonAnchorOf(flyout, Host), flyout, inField);

    private void AddLeading(IButtonComponent control, IVisualComponent region, bool inField)
    {
        ArgumentNullException.ThrowIfNull(control);

        if (inField)
        {
            ThrowIfTaken(LeadingInField);

            _regions[RegionNames.LeadingInFieldAction] = region;
            _leading.Insert(0, control);
            LeadingInField = control;
        }
        else
        {
            _regions[RegionNames.FieldAction(RegionNames.LeadingAction, LeadingInField is null ? _leading.Count : _leading.Count - 1)] = region;
            _leading.Add(control);
        }
    }

    private static void ThrowIfTaken(IButtonComponent? inField)
    {
        if (inField is not null)
            throw new InvalidOperationException("A field has one action in it at each end.");
    }

    /// <summary>Adds <paramref name="action"/> at the field's end; <paramref name="inField"/> stands it last, one to a field.</summary>
    public void AddTrailing(IButtonComponent action, bool inField)
        => AddTrailing(action, action, inField);

    /// <summary>Adds <paramref name="flyout"/> at the field's end, listed by the button it opens from, as the button's overload.</summary>
    public void AddTrailing(FlyoutComponent flyout, bool inField)
        => AddTrailing(FlyoutComponent.ButtonAnchorOf(flyout, Host), flyout, inField);

    private void AddTrailing(IButtonComponent control, IVisualComponent region, bool inField)
    {
        ArgumentNullException.ThrowIfNull(control);

        if (inField)
        {
            ThrowIfTaken(TrailingInField);

            _regions[RegionNames.TrailingInFieldAction] = region;
            _trailing.Add(control);
            TrailingInField = control;
        }
        else
        {
            var index = TrailingNumbered;

            // Before the in-field one, which stands last whenever it was added.
            _regions[RegionNames.FieldAction(RegionNames.TrailingAction, index)] = region;
            _trailing.Insert(index, control);
        }
    }

    /// <summary>Makes <paramref name="action"/> the field's one trailing action, in place of any added before.</summary>
    public void SetTrailing(IButtonComponent action)
    {
        ArgumentNullException.ThrowIfNull(action);

        ClearTrailing();
        AddTrailing(action, action, inField: false);
    }

    /// <summary>Makes <paramref name="flyout"/> the field's one trailing action, in place of any added before.</summary>
    public void SetTrailing(FlyoutComponent flyout)
    {
        IButtonComponent anchor = FlyoutComponent.ButtonAnchorOf(flyout, Host);

        ClearTrailing();
        AddTrailing(anchor, flyout, inField: false);
    }

    private void ClearTrailing()
    {
        for (var i = 1; i < TrailingNumbered; i++)
            _ = _regions.Remove(RegionNames.FieldAction(RegionNames.TrailingAction, i));

        _ = _regions.Remove(RegionNames.TrailingInFieldAction);
        _trailing.Clear();
        TrailingInField = null;
    }
}
