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

    private readonly Dictionary<string, IVisualComponent> _regions = [with(StringComparer.Ordinal)];
    private readonly List<IButtonComponent> _leading = [];
    private readonly List<IButtonComponent> _trailing = [];

    // How many stand under each numbered region name: an in-field one has a region of its own.
    private int _leadingCount;
    private int _leadingButtonCount;
    private int _leadingBelowEndCount;
    private int _trailingBelowStartCount;
    private int _trailingBelowStartButtonCount;
    private int _trailingCount;
    private int _trailingButtonCount;
    private bool _hasLeadingInField;
    private bool _hasTrailingInField;

    public IReadOnlyDictionary<string, IVisualComponent> Regions => _regions;

    public IReadOnlyList<IButtonComponent> Leading => _leading;

    public IReadOnlyList<IButtonComponent> Trailing => _trailing;

    public IButtonComponent? LeadingInField { get; private set; }

    public IButtonComponent? TrailingInField { get; private set; }

    /// <summary>Adds <paramref name="action"/> at the field's start; <paramref name="inField"/> stands it first, one to a field.</summary>
    public void AddLeading(IButtonComponent action, bool inField)
    {
        ArgumentNullException.ThrowIfNull(action);
        AddLeading(action, action, inField, belowEnd: false);
    }

    /// <summary>Adds <paramref name="flyout"/> at the field's start, listed by the button it opens from, as the button's overload.</summary>
    public void AddLeading(FlyoutComponent flyout, bool inField)
        => AddLeading(FlyoutComponent.ButtonAnchorOf(flyout, Host), flyout, inField, belowEnd: false);

    /// <summary>Adds a button-variant <paramref name="select"/> at the field's start.</summary>
    public void AddLeading(IMultiSelectComponent select, bool inField)
    {
        MultiSelectComponent.RequireButtonVariant(select, Host);
        AddLeading(control: null, select, inField, belowEnd: false);
    }

    /// <summary>Adds <paramref name="action"/> at the field's start, standing at <paramref name="belowAt"/> of the row under it.</summary>
    public void AddLeading(IButtonComponent action, UIAlignment belowAt)
    {
        ArgumentNullException.ThrowIfNull(action);
        AddLeading(action, action, inField: false, IsEnd(belowAt));
    }

    /// <summary>Adds <paramref name="flyout"/> at the field's start, standing at <paramref name="belowAt"/> of the row under it.</summary>
    public void AddLeading(FlyoutComponent flyout, UIAlignment belowAt)
        => AddLeading(FlyoutComponent.ButtonAnchorOf(flyout, Host), flyout, inField: false, IsEnd(belowAt));

    /// <summary>Adds a button-variant <paramref name="select"/> at the field's start, standing at <paramref name="belowAt"/> of the row under it.</summary>
    public void AddLeading(IMultiSelectComponent select, UIAlignment belowAt)
    {
        MultiSelectComponent.RequireButtonVariant(select, Host);
        AddLeading(control: null, select, inField: false, IsEnd(belowAt));
    }

    private void AddLeading(IButtonComponent? control, IVisualComponent region, bool inField, bool belowEnd)
    {
        if (inField)
        {
            ThrowIfTaken(_hasLeadingInField);

            _regions[RegionNames.LeadingInFieldAction] = region;
            _hasLeadingInField = true;

            if (control is not null)
            {
                _leading.Insert(0, control);
                LeadingInField = control;
            }
        }
        else if (belowEnd)
        {
            // Last at the start, nearest the text, so the row under it reads in the field's order.
            _regions[RegionNames.FieldAction(RegionNames.LeadingBelowEndAction, _leadingBelowEndCount++)] = region;

            if (control is not null)
                _leading.Add(control);
        }
        else
        {
            if (control is not null)
                _leading.Insert((LeadingInField is null ? 0 : 1) + _leadingButtonCount++, control);

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

    private static void ThrowIfTaken(bool hasInField)
    {
        if (hasInField)
            throw new InvalidOperationException("A field has one action in it at each end.");
    }

    /// <summary>Adds <paramref name="action"/> at the field's end; <paramref name="inField"/> stands it last, one to a field.</summary>
    public void AddTrailing(IButtonComponent action, bool inField)
    {
        ArgumentNullException.ThrowIfNull(action);
        AddTrailing(action, action, inField, belowStart: false);
    }

    /// <summary>Adds <paramref name="flyout"/> at the field's end, listed by the button it opens from, as the button's overload.</summary>
    public void AddTrailing(FlyoutComponent flyout, bool inField)
        => AddTrailing(FlyoutComponent.ButtonAnchorOf(flyout, Host), flyout, inField, belowStart: false);

    /// <summary>Adds a button-variant <paramref name="select"/> at the field's end.</summary>
    public void AddTrailing(IMultiSelectComponent select, bool inField)
    {
        MultiSelectComponent.RequireButtonVariant(select, Host);
        AddTrailing(control: null, select, inField, belowStart: false);
    }

    /// <summary>Adds <paramref name="action"/> at the field's end, standing at <paramref name="belowAt"/> of the row under it.</summary>
    public void AddTrailing(IButtonComponent action, UIAlignment belowAt)
    {
        ArgumentNullException.ThrowIfNull(action);
        AddTrailing(action, action, inField: false, !IsEnd(belowAt));
    }

    /// <summary>Adds <paramref name="flyout"/> at the field's end, standing at <paramref name="belowAt"/> of the row under it.</summary>
    public void AddTrailing(FlyoutComponent flyout, UIAlignment belowAt)
        => AddTrailing(FlyoutComponent.ButtonAnchorOf(flyout, Host), flyout, inField: false, !IsEnd(belowAt));

    /// <summary>Adds a button-variant <paramref name="select"/> at the field's end, standing at <paramref name="belowAt"/> of the row under it.</summary>
    public void AddTrailing(IMultiSelectComponent select, UIAlignment belowAt)
    {
        MultiSelectComponent.RequireButtonVariant(select, Host);
        AddTrailing(control: null, select, inField: false, !IsEnd(belowAt));
    }

    private void AddTrailing(IButtonComponent? control, IVisualComponent region, bool inField, bool belowStart)
    {
        if (inField)
        {
            ThrowIfTaken(_hasTrailingInField);

            _regions[RegionNames.TrailingInFieldAction] = region;
            _hasTrailingInField = true;

            if (control is not null)
            {
                _trailing.Add(control);
                TrailingInField = control;
            }
        }
        else if (belowStart)
        {
            // First at the end, nearest the text, as a leading one sent to the row's end stands last at the start.
            if (control is not null)
                _trailing.Insert(_trailingBelowStartButtonCount++, control);

            _regions[RegionNames.FieldAction(RegionNames.TrailingBelowStartAction, _trailingBelowStartCount++)] = region;
        }
        else
        {
            // Before the in-field one, which stands last whenever it was added.
            if (control is not null)
                _trailing.Insert(_trailingBelowStartButtonCount + _trailingButtonCount++, control);

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

    /// <summary>Makes a button-variant <paramref name="select"/> the field's one trailing action, in place of any added before.</summary>
    public void SetTrailing(IMultiSelectComponent select)
    {
        MultiSelectComponent.RequireButtonVariant(select, Host);

        ClearTrailing();
        AddTrailing(control: null, select, inField: false, belowStart: false);
    }

    public Action? SnapshotAuthoredState()
    {
        var hadLeading = _leadingCount > 0 || _leadingBelowEndCount > 0 || _hasLeadingInField;
        var hadTrailing = _trailingCount > 0 || _trailingBelowStartCount > 0 || _hasTrailingInField;

        if (!hadLeading && !hadTrailing)
            return null;

        KeyValuePair<string, IVisualComponent>[]? leadingRegions = hadLeading ? SnapshotLeadingRegions() : null;
        IButtonComponent[]? leadingButtons = hadLeading ? [.. _leading] : null;
        var leadingCount = _leadingCount;
        var leadingButtonCount = _leadingButtonCount;
        var leadingBelowEndCount = _leadingBelowEndCount;
        var hasLeadingInField = _hasLeadingInField;
        IButtonComponent? leadingInField = LeadingInField;

        KeyValuePair<string, IVisualComponent>[]? trailingRegions = hadTrailing ? SnapshotTrailingRegions() : null;
        IButtonComponent[]? trailingButtons = hadTrailing ? [.. _trailing] : null;
        var trailingCount = _trailingCount;
        var trailingButtonCount = _trailingButtonCount;
        var trailingBelowStartCount = _trailingBelowStartCount;
        var trailingBelowStartButtonCount = _trailingBelowStartButtonCount;
        var hasTrailingInField = _hasTrailingInField;
        IButtonComponent? trailingInField = TrailingInField;

        if (hadLeading)
            ClearLeading();

        if (hadTrailing)
            ClearTrailing();

        return () =>
        {
            if (hadLeading)
            {
                ClearLeading();

                for (var i = 0; i < leadingRegions!.Length; i++)
                    _regions[leadingRegions[i].Key] = leadingRegions[i].Value;

                _leading.AddRange(leadingButtons!);
                _leadingCount = leadingCount;
                _leadingButtonCount = leadingButtonCount;
                _leadingBelowEndCount = leadingBelowEndCount;
                _hasLeadingInField = hasLeadingInField;
                LeadingInField = leadingInField;
            }

            if (hadTrailing)
            {
                ClearTrailing();

                for (var i = 0; i < trailingRegions!.Length; i++)
                    _regions[trailingRegions[i].Key] = trailingRegions[i].Value;

                _trailing.AddRange(trailingButtons!);
                _trailingCount = trailingCount;
                _trailingButtonCount = trailingButtonCount;
                _trailingBelowStartCount = trailingBelowStartCount;
                _trailingBelowStartButtonCount = trailingBelowStartButtonCount;
                _hasTrailingInField = hasTrailingInField;
                TrailingInField = trailingInField;
            }
        };
    }

    private KeyValuePair<string, IVisualComponent>[] SnapshotLeadingRegions()
    {
        List<KeyValuePair<string, IVisualComponent>> list = [];

        if (_regions.TryGetValue(RegionNames.LeadingInFieldAction, out IVisualComponent? inField))
            list.Add(new KeyValuePair<string, IVisualComponent>(RegionNames.LeadingInFieldAction, inField));

        for (var i = 0; i < _leadingCount; i++)
        {
            var name = RegionNames.FieldAction(RegionNames.LeadingAction, i);
            list.Add(new KeyValuePair<string, IVisualComponent>(name, _regions[name]));
        }

        for (var i = 0; i < _leadingBelowEndCount; i++)
        {
            var name = RegionNames.FieldAction(RegionNames.LeadingBelowEndAction, i);
            list.Add(new KeyValuePair<string, IVisualComponent>(name, _regions[name]));
        }

        return [.. list];
    }

    private KeyValuePair<string, IVisualComponent>[] SnapshotTrailingRegions()
    {
        List<KeyValuePair<string, IVisualComponent>> list = [];

        if (_regions.TryGetValue(RegionNames.TrailingInFieldAction, out IVisualComponent? inField))
            list.Add(new KeyValuePair<string, IVisualComponent>(RegionNames.TrailingInFieldAction, inField));

        for (var i = 0; i < _trailingCount; i++)
        {
            var name = RegionNames.FieldAction(RegionNames.TrailingAction, i);
            list.Add(new KeyValuePair<string, IVisualComponent>(name, _regions[name]));
        }

        for (var i = 0; i < _trailingBelowStartCount; i++)
        {
            var name = RegionNames.FieldAction(RegionNames.TrailingBelowStartAction, i);
            list.Add(new KeyValuePair<string, IVisualComponent>(name, _regions[name]));
        }

        return [.. list];
    }

    private void ClearLeading()
    {
        for (var i = 0; i < _leadingCount; i++)
            _ = _regions.Remove(RegionNames.FieldAction(RegionNames.LeadingAction, i));

        for (var i = 0; i < _leadingBelowEndCount; i++)
            _ = _regions.Remove(RegionNames.FieldAction(RegionNames.LeadingBelowEndAction, i));

        _ = _regions.Remove(RegionNames.LeadingInFieldAction);
        _leading.Clear();
        _leadingCount = 0;
        _leadingButtonCount = 0;
        _leadingBelowEndCount = 0;
        _hasLeadingInField = false;
        LeadingInField = null;
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
        _trailingButtonCount = 0;
        _trailingBelowStartCount = 0;
        _trailingBelowStartButtonCount = 0;
        _hasTrailingInField = false;
        TrailingInField = null;
    }
}
