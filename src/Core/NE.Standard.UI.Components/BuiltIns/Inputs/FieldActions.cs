using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// The buttons a field carries at either end, kept as its regions under <see cref="RegionNames.FieldAction"/> names in the order
/// they stand — the text input's and the text area's alike — and one per end flagged in the field, under
/// <see cref="RegionNames.LeadingInFieldAction"/> and <see cref="RegionNames.TrailingInFieldAction"/>, first and last. Those sent to
/// the other end of the row under the field stand under <see cref="RegionNames.LeadingBelowEndAction"/> and
/// <see cref="RegionNames.TrailingBelowStartAction"/>, beside the text nearest it. A flyout among them stands in its region whole and
/// is listed by the button it opens from.
/// </summary>
internal sealed class FieldActions
{
    // Whose actions a flyout's anchor is refused among.
    private const string Host = "a field's";

    private readonly Dictionary<string, IVisualComponent> _regions = new(StringComparer.Ordinal);
    private readonly List<IButtonComponent> _leading = [];
    private readonly List<IButtonComponent> _trailing = [];

    // How many stand under each numbered region name: an in-field one has a region of its own.
    private int _leadingCount;
    private int _leadingBelowEndCount;
    private int _trailingBelowStartCount;
    private int _trailingCount;

    public IReadOnlyDictionary<string, IVisualComponent> Regions => _regions;

    public IReadOnlyList<IButtonComponent> Leading => _leading;

    public IReadOnlyList<IButtonComponent> Trailing => _trailing;

    public IButtonComponent? LeadingInField { get; private set; }

    public IButtonComponent? TrailingInField { get; private set; }

    /// <summary>Adds <paramref name="action"/> at the field's start; <paramref name="inField"/> stands it first, one to a field.</summary>
    public void AddLeading(IButtonComponent action, bool inField)
        => AddLeading(action, action, inField, belowEnd: false);

    /// <summary>Adds <paramref name="flyout"/> at the field's start, listed by the button it opens from, as the button's overload.</summary>
    public void AddLeading(FlyoutComponent flyout, bool inField)
        => AddLeading(FlyoutComponent.ButtonAnchorOf(flyout, Host), flyout, inField, belowEnd: false);

    /// <summary>Adds <paramref name="action"/> at the field's start, standing at <paramref name="belowAt"/> of the row under it.</summary>
    public void AddLeading(IButtonComponent action, UIAlignment belowAt)
        => AddLeading(action, action, inField: false, IsEnd(belowAt));

    /// <summary>Adds <paramref name="flyout"/> at the field's start, standing at <paramref name="belowAt"/> of the row under it.</summary>
    public void AddLeading(FlyoutComponent flyout, UIAlignment belowAt)
        => AddLeading(FlyoutComponent.ButtonAnchorOf(flyout, Host), flyout, inField: false, IsEnd(belowAt));

    private void AddLeading(IButtonComponent control, IVisualComponent region, bool inField, bool belowEnd)
    {
        ArgumentNullException.ThrowIfNull(control);

        if (inField)
        {
            ThrowIfTaken(LeadingInField);

            _regions[RegionNames.LeadingInFieldAction] = region;
            _leading.Insert(0, control);
            LeadingInField = control;
        }
        else if (belowEnd)
        {
            // Last at the start, nearest the text, so the row under it reads in the field's order.
            _regions[RegionNames.FieldAction(RegionNames.LeadingBelowEndAction, _leadingBelowEndCount++)] = region;
            _leading.Add(control);
        }
        else
        {
            _leading.Insert((LeadingInField is null ? 0 : 1) + _leadingCount, control);
            _regions[RegionNames.FieldAction(RegionNames.LeadingAction, _leadingCount++)] = region;
        }
    }

    private static bool IsEnd(UIAlignment belowAt)
        => belowAt switch
        {
            UIAlignment.Start => false,
            UIAlignment.End => true,
            _ => throw new ArgumentOutOfRangeException(nameof(belowAt), belowAt, "The row under a field has a start and an end."),
        };

    private static void ThrowIfTaken(IButtonComponent? inField)
    {
        if (inField is not null)
            throw new InvalidOperationException("A field has one action in it at each end.");
    }

    /// <summary>Adds <paramref name="action"/> at the field's end; <paramref name="inField"/> stands it last, one to a field.</summary>
    public void AddTrailing(IButtonComponent action, bool inField)
        => AddTrailing(action, action, inField, belowStart: false);

    /// <summary>Adds <paramref name="flyout"/> at the field's end, listed by the button it opens from, as the button's overload.</summary>
    public void AddTrailing(FlyoutComponent flyout, bool inField)
        => AddTrailing(FlyoutComponent.ButtonAnchorOf(flyout, Host), flyout, inField, belowStart: false);

    /// <summary>Adds <paramref name="action"/> at the field's end, standing at <paramref name="belowAt"/> of the row under it.</summary>
    public void AddTrailing(IButtonComponent action, UIAlignment belowAt)
        => AddTrailing(action, action, inField: false, !IsEnd(belowAt));

    /// <summary>Adds <paramref name="flyout"/> at the field's end, standing at <paramref name="belowAt"/> of the row under it.</summary>
    public void AddTrailing(FlyoutComponent flyout, UIAlignment belowAt)
        => AddTrailing(FlyoutComponent.ButtonAnchorOf(flyout, Host), flyout, inField: false, !IsEnd(belowAt));

    private void AddTrailing(IButtonComponent control, IVisualComponent region, bool inField, bool belowStart)
    {
        ArgumentNullException.ThrowIfNull(control);

        if (inField)
        {
            ThrowIfTaken(TrailingInField);

            _regions[RegionNames.TrailingInFieldAction] = region;
            _trailing.Add(control);
            TrailingInField = control;
        }
        else if (belowStart)
        {
            // First at the end, nearest the text, as a leading one sent to the row's end stands last at the start.
            _trailing.Insert(_trailingBelowStartCount, control);
            _regions[RegionNames.FieldAction(RegionNames.TrailingBelowStartAction, _trailingBelowStartCount++)] = region;
        }
        else
        {
            // Before the in-field one, which stands last whenever it was added.
            _trailing.Insert(_trailingBelowStartCount + _trailingCount, control);
            _regions[RegionNames.FieldAction(RegionNames.TrailingAction, _trailingCount++)] = region;
        }
    }

    /// <summary>Makes <paramref name="action"/> the field's one trailing action, in place of any added before.</summary>
    public void SetTrailing(IButtonComponent action)
    {
        ArgumentNullException.ThrowIfNull(action);

        ClearTrailing();
        AddTrailing(action, action, inField: false, belowStart: false);
    }

    /// <summary>Makes <paramref name="flyout"/> the field's one trailing action, in place of any added before.</summary>
    public void SetTrailing(FlyoutComponent flyout)
    {
        IButtonComponent anchor = FlyoutComponent.ButtonAnchorOf(flyout, Host);

        ClearTrailing();
        AddTrailing(anchor, flyout, inField: false, belowStart: false);
    }

    private void ClearTrailing()
    {
        for (var i = 0; i < _trailingCount; i++)
            _ = _regions.Remove(RegionNames.FieldAction(RegionNames.TrailingAction, i));

        for (var i = 0; i < _trailingBelowStartCount; i++)
            _ = _regions.Remove(RegionNames.FieldAction(RegionNames.TrailingBelowStartAction, i));

        _ = _regions.Remove(RegionNames.TrailingInFieldAction);
        _trailing.Clear();
        _trailingCount = 0;
        _trailingBelowStartCount = 0;
        TrailingInField = null;
    }
}
