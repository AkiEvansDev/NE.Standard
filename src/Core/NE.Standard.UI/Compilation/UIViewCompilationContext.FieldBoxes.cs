using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    private const int TierCount = (int)UIResponsiveTier.Xxl + 1;

    // A child that stands nowhere of its own stands on the grid's whole first row (ui-container.less).
    private static readonly UIGridPlacement WholeRow = UIGridPlacement.At(1, 1, UIGridPlacement.GridColumns, 1);

    // The things standing level with captioned fields' boxes, by authored id: found once, when the first component asks, over the
    // whole tree, since a thing's alignment is its siblings'.
    private Dictionary<string, UIResponsive<UIFieldBoxAlignment>>? _impliedFieldBoxes;

    /// <summary>
    /// The field boxes a control with no caption row stands level with, per breakpoint, where its author left it unset: at each width
    /// it stands side by side with a sibling that draws one itself (<see cref="UIFieldBoxes"/>) — in a stack running across that does
    /// not wrap, or on a grid's row — on its box. Decided here rather than by each preset: a plain row of a titled field and a button
    /// misaligned until its author wrote it.
    /// </summary>
    private UIResponsive<UIFieldBoxAlignment>? ImpliedFieldBoxes(IVisualComponent component)
    {
        _impliedFieldBoxes ??= ImplyFieldBoxes();

        return _impliedFieldBoxes.TryGetValue(component.Id, out UIResponsive<UIFieldBoxAlignment> boxes) ? boxes : null;
    }

    private Dictionary<string, UIResponsive<UIFieldBoxAlignment>> ImplyFieldBoxes()
    {
        Dictionary<string, UIResponsive<UIFieldBoxAlignment>> implied = new(StringComparer.Ordinal);
        FieldRowScratch scratch = new();

        foreach (IVisualComponent component in _componentOrder)
        {
            if (component is IContainerComponent { Children.Count: > 1 } container && ArrangesFieldRows(container))
                ImplyFieldBoxes(container, implied, scratch);
        }

        return implied;
    }

    /// <summary>
    /// Whether the container lays its children in rows a field stands in: not a wrapping panel, whose later line holds no captioned
    /// neighbour it can know of, and not a panel standing its first child's line on a button (its own margin there).
    /// </summary>
    private static bool ArrangesFieldRows(IContainerComponent container)
        => container is not (WrapPanelComponent or StackPanelComponent { Wrap: true } or StackPanelComponent { FirstLineOnControl: not null });

    /// <summary>
    /// Per tier, the box the container's captioned children stand on, written onto every control beside them, in time linear in the
    /// children: a stack running across sets all of them side by side, so one box serves all (a stack running down, none); a grid finds
    /// a control's captioned neighbours by the rows they stand on.
    /// </summary>
    private void ImplyFieldBoxes(IContainerComponent container, Dictionary<string, UIResponsive<UIFieldBoxAlignment>> implied, FieldRowScratch scratch)
    {
        IReadOnlyList<IVisualComponent> children = container.Children;
        UIFieldBoxAlignment[] tiers = scratch.Begin(children.Count);
        var across = container is IOrientationComponent;
        var any = false;

        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (across && !RunsAcross((IOrientationComponent)container, tier))
                continue;

            if (!scratch.FindCaptions(children, tier, grid: !across))
                continue;

            UIFieldBoxAlignment? row = across ? scratch.AllBoxes() : null;

            for (var i = 0; i < children.Count; i++)
            {
                // Captioned for certain or not, a thing drawing a caption row stays where it is.
                if (IsGone(children[i], tier) || UIFieldBoxes.CaptionRowBox(children[i], tier) is not null)
                    continue;

                if ((row ?? scratch.BoxesBeside(children[i], tier)) is UIFieldBoxAlignment boxes)
                {
                    tiers[(i * TierCount) + (int)tier] = boxes;
                    any = true;
                }
            }
        }

        if (!any)
            return;

        for (var i = 0; i < children.Count; i++)
        {
            if (AlignTarget(children[i]) is IVisualComponent target && ToResponsive(tiers, i) is UIResponsive<UIFieldBoxAlignment> boxes)
                implied[target.Id] = boxes;
        }
    }

    /// <summary>
    /// A sibling's caption box at <paramref name="tier"/> where it draws one for certain: shown there by a written value, not one a
    /// binding may take away (it would leave its neighbour a caption line low).
    /// </summary>
    private static UIInputSize? CertainCaption(IVisualComponent child, UIResponsiveTier tier)
        => IsGone(child, tier) || Binds(child, IVisualComponent.VisibilityProperty) ? null : UIFieldBoxes.CaptionRowBox(child, tier);

    /// <summary>The box captioned fields stand on together: their size, the medium one where they differ.</summary>
    private static UIInputSize Merge(UIInputSize? size, UIInputSize own)
        => size is null || size == own ? own : UIInputSize.Medium;

    private static UIFieldBoxAlignment? ToAlignment(UIInputSize? size)
        => size switch
        {
            null => null,
            UIInputSize.Small => UIFieldBoxAlignment.Small,
            UIInputSize.Large => UIFieldBoxAlignment.Large,
            _ => UIFieldBoxAlignment.Medium
        };

    /// <summary>The pass's working memory, kept across containers: each child's tiers, its caption at the tier, the captioned by row.</summary>
    private sealed class FieldRowScratch
    {
        private readonly Dictionary<int, List<int>> _byRow = [];
        private readonly Stack<List<int>> _spare = new();
        private IReadOnlyList<IVisualComponent> _children = [];
        private UIFieldBoxAlignment[] _tiers = [];
        private UIInputSize?[] _captions = [];

        /// <summary>Clears the tiers for a container of <paramref name="count"/> children, each one's tiers one after another.</summary>
        public UIFieldBoxAlignment[] Begin(int count)
        {
            if (_tiers.Length < count * TierCount)
                _tiers = new UIFieldBoxAlignment[count * TierCount];

            if (_captions.Length < count)
                _captions = new UIInputSize?[count];

            Array.Clear(_tiers, 0, count * TierCount);

            return _tiers;
        }

        /// <summary>Reads every child's certain caption at <paramref name="tier"/>, in a grid filed by row; answers whether any has one.</summary>
        public bool FindCaptions(IReadOnlyList<IVisualComponent> children, UIResponsiveTier tier, bool grid)
        {
            _children = children;

            foreach (List<int> rows in _byRow.Values)
            {
                rows.Clear();
                _spare.Push(rows);
            }

            _byRow.Clear();

            var found = false;

            for (var i = 0; i < children.Count; i++)
            {
                _captions[i] = CertainCaption(children[i], tier);

                if (_captions[i] is null)
                    continue;

                found = true;

                if (grid)
                    File(i, children[i].Placement?.Resolve(tier) ?? WholeRow);
            }

            return found;
        }

        /// <summary>A field the whole width stands beside nothing, so only a narrower one is filed, under each row it stands on.</summary>
        private void File(int index, UIGridPlacement placement)
        {
            if (placement.ColumnSpan >= UIGridPlacement.GridColumns)
                return;

            for (var row = placement.Row; row < placement.Row + placement.RowSpan; row++)
            {
                if (!_byRow.TryGetValue(row, out List<int>? rows))
                {
                    rows = _spare.Count > 0 ? _spare.Pop() : [];
                    _byRow.Add(row, rows);
                }

                rows.Add(index);
            }
        }

        /// <summary>The boxes every captioned child stands on: a stack running across holds them all side by side.</summary>
        public UIFieldBoxAlignment? AllBoxes()
        {
            UIInputSize? size = null;

            for (var i = 0; i < _children.Count; i++)
            {
                if (_captions[i] is UIInputSize own)
                    size = Merge(size, own);
            }

            return ToAlignment(size);
        }

        /// <summary>The boxes the captioned children sharing a grid row and no column with <paramref name="child"/> stand on.</summary>
        public UIFieldBoxAlignment? BoxesBeside(IVisualComponent child, UIResponsiveTier tier)
        {
            UIGridPlacement placement = child.Placement?.Resolve(tier) ?? WholeRow;
            UIInputSize? size = null;

            for (var row = placement.Row; row < placement.Row + placement.RowSpan; row++)
            {
                if (!_byRow.TryGetValue(row, out List<int>? rows))
                    continue;

                foreach (var index in rows)
                {
                    UIGridPlacement other = _children[index].Placement?.Resolve(tier) ?? WholeRow;

                    if (!Overlap(placement.Column, placement.ColumnSpan, other.Column, other.ColumnSpan) && _captions[index] is UIInputSize own)
                        size = Merge(size, own);
                }
            }

            return ToAlignment(size);
        }
    }

    private static bool Overlap(int start, int span, int otherStart, int otherSpan)
        => start < otherStart + otherSpan && otherStart < start + span;

    private static bool IsGone(IVisualComponent component, UIResponsiveTier tier)
        => component.Visibility?.Resolve(tier) == UIVisibility.Collapsed;

    /// <summary>Whether the stack runs across at <paramref name="tier"/>: its written orientation, else its type's registered one; a bound one is not known.</summary>
    private bool RunsAcross(IOrientationComponent component, UIResponsiveTier tier)
    {
        if (Binds(component, IOrientationComponent.OrientationProperty))
            return false;

        UIResponsive<UIOrientation>? orientation = component.Orientation
            ?? (TryGetPropertyDefinition(component.TypeKey, IOrientationComponent.OrientationProperty, out UIPropertyDefinition? definition) ? definition.DefaultValue as UIResponsive<UIOrientation>? : null);

        return orientation?.Resolve(tier) == UIOrientation.Horizontal;
    }

    /// <summary>
    /// What stands level with the boxes for <paramref name="child"/>: a control (an input, a button, a switcher, a strip of buttons) or a
    /// panel of controls and their words, or a column inside a cell around one (a control and its note in a form row's cell), so the
    /// column's first child stands on the band rather than the column centred whole. Nothing for a block that is no control (a card, a
    /// list, words alone), a thing whose author set the alignment, or one whose own offset an authored Margin, or a panel's Padding,
    /// would replace.
    /// </summary>
    private static IVisualComponent? AlignTarget(IVisualComponent child)
    {
        if (child.AlignWithFieldBoxes is not null || !StandsOnFieldBox(child))
            return null;

        if (child is StackPanelComponent { Children: [StackPanelComponent column] } cell && RunsDownEverywhere(cell) && RunsDownEverywhere(column))
            return AlignTarget(column) is IVisualComponent inner && !Sets(cell, ISurfaceComponent.PaddingProperty, cell.Padding) ? inner : null;

        // A panel is set down by its padding, anything else by its top margin: an authored one replaces the offset.
        return child is StackPanelComponent panel
            ? Sets(panel, ISurfaceComponent.PaddingProperty, panel.Padding) ? null : panel
            : Sets(child, IVisualComponent.MarginProperty, child.Margin) ? null : child;
    }

    /// <summary>A control, or a panel holding at least one and words at most beside them; never a block of its own (a card, a list).</summary>
    private static bool StandsOnFieldBox(IVisualComponent component)
    {
        switch (component)
        {
            case IInputComponent or IButtonComponent or ISwitcherComponent or ButtonGroupComponent:
                return true;
            // The arrangements themselves, not a surface or a pane container built on them.
            case StackPanelComponent or ContainerComponent or WrapPanelComponent:
                var control = false;

                foreach (IVisualComponent child in ((IContainerComponent)component).Children)
                {
                    if (StandsOnFieldBox(child))
                        control = true;
                    else if (child is not ITextComponent)
                        return false;
                }

                return control;
            default:
                return false;
        }
    }

    private static bool RunsDownEverywhere(StackPanelComponent panel)
    {
        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (panel.Orientation?.Resolve(tier) == UIOrientation.Horizontal)
                return false;
        }

        return true;
    }

    private static bool Sets(IVisualComponent component, UIProperty property, object? value)
        => value is not null || Binds(component, property);

    private static bool Binds(IVisualComponent component, UIProperty property)
    {
        foreach (UIBinding binding in component.Bindings)
        {
            if (binding.Target.Equals(property))
                return true;
        }

        return false;
    }

    /// <summary>The <paramref name="index"/>th child's tiers as a responsive value, each written only where it differs from the one below; null where it stands level nowhere.</summary>
    private static UIResponsive<UIFieldBoxAlignment>? ToResponsive(UIFieldBoxAlignment[] tiers, int index)
    {
        var start = index * TierCount;
        UIFieldBoxAlignment?[] own = new UIFieldBoxAlignment?[TierCount];
        var aligned = tiers[start] != UIFieldBoxAlignment.None;

        for (var i = 1; i < TierCount; i++)
        {
            own[i] = tiers[start + i] == tiers[start + i - 1] ? null : tiers[start + i];
            aligned |= tiers[start + i] != UIFieldBoxAlignment.None;
        }

        return aligned ? UIResponsive<UIFieldBoxAlignment>.Create(tiers[start], own[1], own[2], own[3], own[4]) : null;
    }
}
