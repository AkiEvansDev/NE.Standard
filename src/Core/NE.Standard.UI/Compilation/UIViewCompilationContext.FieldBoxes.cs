using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
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
    private Dictionary<string, UIResponsive<UIFieldBoxAlignment>>? _impliedSliderRowBoxes;

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
        Dictionary<string, UIResponsive<UIFieldBoxAlignment>> implied = [with(StringComparer.Ordinal)];
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
    private static UISize? CertainCaption(IVisualComponent child, UIResponsiveTier tier)
        => IsGone(child, tier) || child.HasBinding(IVisualComponent.VisibilityProperty) ? null : UIFieldBoxes.CaptionRowBox(child, tier);

    /// <summary>The box captioned fields stand on together: their size, the medium one where they differ.</summary>
    private static UISize Merge(UISize? size, UISize own)
        => size is null || size == own ? own : UISize.Medium;

    private static UIFieldBoxAlignment? ToAlignment(UISize? size)
        => size switch
        {
            null => null,
            UISize.Small => UIFieldBoxAlignment.Small,
            UISize.Large => UIFieldBoxAlignment.Large,
            _ => UIFieldBoxAlignment.Medium
        };

    /// <summary>The pass's working memory, kept across containers: each child's tiers, its caption at the tier, the captioned by row.</summary>
    private sealed class FieldRowScratch
    {
        private readonly Dictionary<int, List<int>> _byRow = [];
        private readonly Stack<List<int>> _spare = new();
        private IReadOnlyList<IVisualComponent> _children = [];
        private UIFieldBoxAlignment[] _tiers = [];
        private UISize?[] _captions = [];

        /// <summary>Clears the tiers for a container of <paramref name="count"/> children, each one's tiers one after another.</summary>
        public UIFieldBoxAlignment[] Begin(int count)
        {
            if (_tiers.Length < count * TierCount)
                _tiers = new UIFieldBoxAlignment[count * TierCount];

            if (_captions.Length < count)
                _captions = new UISize?[count];

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
            UISize? size = null;

            for (var i = 0; i < _children.Count; i++)
            {
                if (_captions[i] is UISize own)
                    size = Merge(size, own);
            }

            return ToAlignment(size);
        }

        /// <summary>The boxes the captioned children sharing a grid row and no column with <paramref name="child"/> stand on.</summary>
        public UIFieldBoxAlignment? BoxesBeside(IVisualComponent child, UIResponsiveTier tier)
        {
            UIGridPlacement placement = child.Placement?.Resolve(tier) ?? WholeRow;
            UISize? size = null;

            for (var row = placement.Row; row < placement.Row + placement.RowSpan; row++)
            {
                if (!_byRow.TryGetValue(row, out List<int>? rows))
                    continue;

                foreach (var index in rows)
                {
                    UIGridPlacement other = _children[index].Placement?.Resolve(tier) ?? WholeRow;

                    if (!Overlap(placement.Column, placement.ColumnSpan, other.Column, other.ColumnSpan) && _captions[index] is UISize own)
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
        if (component.HasBinding(IOrientationComponent.OrientationProperty))
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

    /// <summary>
    /// A control, a row holding at least one and words at most beside them, or a column of one control and words under it (its note);
    /// never a column of more controls (a form) or a block of its own (a card, a list).
    /// </summary>
    private static bool StandsOnFieldBox(IVisualComponent component)
    {
        switch (component)
        {
            case IInputComponent or IButtonComponent or ISwitcherComponent or ButtonGroupComponent:
                return true;
            case StackPanelComponent panel when RunsDownEverywhere(panel):
                if (panel.Children.Count == 0 || !StandsOnFieldBox(panel.Children[0]))
                    return false;

                for (var i = 1; i < panel.Children.Count; i++)
                {
                    if (panel.Children[i] is (not ITextComponent) or IInputComponent or IButtonComponent or ISwitcherComponent)
                        return false;
                }

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
        => value is not null || component.HasBinding(property);

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

    /// <summary>
    /// The field-box height a horizontal slider's track row centres within at each breakpoint where it stands side by side with a
    /// boxed field or a control aligned to the slider's own caption box, leaving stacked sliders at their compact height.
    /// </summary>
    private UIResponsive<UIFieldBoxAlignment>? ImpliedSliderRowBoxes(IVisualComponent component)
    {
        if (component is not SliderComponent { RowFieldBox: null })
            return null;

        _impliedSliderRowBoxes ??= ImplySliderRowBoxes();

        return _impliedSliderRowBoxes.TryGetValue(component.Id, out UIResponsive<UIFieldBoxAlignment> boxes) ? boxes : null;
    }

    private Dictionary<string, UIResponsive<UIFieldBoxAlignment>> ImplySliderRowBoxes()
    {
        Dictionary<string, UIResponsive<UIFieldBoxAlignment>> implied = [with(StringComparer.Ordinal)];
        FieldRowScratch scratch = new();

        foreach (IVisualComponent component in _componentOrder)
        {
            if (component is (StackPanelComponent or WrapPanelComponent or ContainerComponent) and IContainerComponent { Children.Count: > 1 } container)
                ImplySliderRowBoxes(container, implied, scratch);
        }

        return implied;
    }

    private void ImplySliderRowBoxes(IContainerComponent container, Dictionary<string, UIResponsive<UIFieldBoxAlignment>> implied, FieldRowScratch scratch)
    {
        IReadOnlyList<IVisualComponent> children = container.Children;
        IVisualComponent?[] controls = new IVisualComponent?[children.Count];
        var hasSlider = false;

        for (var i = 0; i < children.Count; i++)
        {
            controls[i] = SoleRowControl(children[i]);
            hasSlider |= controls[i] is SliderComponent { RowFieldBox: null };
        }

        if (!hasSlider)
            return;

        UIFieldBoxAlignment[] tiers = scratch.Begin(children.Count);
        var grid = container is ContainerComponent;
        var wraps = container is WrapPanelComponent or StackPanelComponent { Wrap: true };
        var any = false;

        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (container is IOrientationComponent oriented && !RunsAcross(oriented, tier))
                continue;

            for (var i = 0; i < children.Count; i++)
            {
                if (controls[i] is not SliderComponent { RowFieldBox: null } slider || !RunsAcross(slider, tier) || IsGone(children[i], tier) || IsGone(slider, tier))
                    continue;

                if (wraps && FillsRowLine(children[i], slider, tier))
                    continue;

                if (ResolveSliderRowBox(children, controls, i, tier, grid, wraps) is UIFieldBoxAlignment box)
                {
                    tiers[(i * TierCount) + (int)tier] = box;
                    any = true;
                }
            }
        }

        if (!any)
            return;

        for (var i = 0; i < children.Count; i++)
        {
            if (controls[i] is SliderComponent { RowFieldBox: null } slider && ToResponsive(tiers, i) is UIResponsive<UIFieldBoxAlignment> boxes)
                implied[slider.Id] = boxes;
        }
    }

    /// <summary>The sole control inside a row child or a single-control label/field cell; null for plain words, surfaces or multi-field forms.</summary>
    private static IVisualComponent? SoleRowControl(IVisualComponent component)
    {
        switch (component)
        {
            case IInputComponent or IButtonComponent or ISwitcherComponent or ButtonGroupComponent:
                return component;
            case StackPanelComponent panel:
                IVisualComponent? sole = null;

                for (var i = 0; i < panel.Children.Count; i++)
                {
                    IVisualComponent child = panel.Children[i];

                    if (SoleRowControl(child) is IVisualComponent inner)
                    {
                        if (sole is not null)
                            return null;

                        sole = inner;
                    }
                    else if (child is (not ITextComponent) or IInputComponent or IButtonComponent or ISwitcherComponent)
                    {
                        return null;
                    }
                }

                return sole;
            default:
                return null;
        }
    }

    private static bool FillsRowLine(IVisualComponent cell, IVisualComponent? control, UIResponsiveTier tier)
        => cell.Width?.Resolve(tier) == UILayoutLength.Fill() || control?.Width?.Resolve(tier) == UILayoutLength.Fill();

    private static UIFieldBoxAlignment? ResolveSliderRowBox(IReadOnlyList<IVisualComponent> children, IVisualComponent?[] controls, int sliderIndex, UIResponsiveTier tier, bool grid, bool wraps)
    {
        UIGridPlacement ownPlacement = grid ? children[sliderIndex].Placement?.Resolve(tier) ?? WholeRow : default;

        if (grid && ownPlacement.ColumnSpan >= UIGridPlacement.GridColumns)
            return null;

        UISize? siblingFieldBox = null;
        var alignsUncaptionedSibling = false;

        for (var j = 0; j < children.Count; j++)
        {
            if (j == sliderIndex || IsGone(children[j], tier))
                continue;

            if (grid)
            {
                UIGridPlacement otherPlacement = children[j].Placement?.Resolve(tier) ?? WholeRow;

                if (otherPlacement.ColumnSpan >= UIGridPlacement.GridColumns
                    || !Overlap(ownPlacement.Row, ownPlacement.RowSpan, otherPlacement.Row, otherPlacement.RowSpan)
                    || Overlap(ownPlacement.Column, ownPlacement.ColumnSpan, otherPlacement.Column, otherPlacement.ColumnSpan))
                {
                    continue;
                }
            }
            else if (wraps && FillsRowLine(children[j], controls[j], tier))
            {
                continue;
            }

            if (SiblingFieldBox(controls[j], tier) is UISize box)
                siblingFieldBox = Merge(siblingFieldBox, box);
            else if (UIFieldBoxes.CaptionRowBox(children[j], tier) is null && (AlignTarget(children[j]) is not null || children[j].AlignWithFieldBoxes?.Resolve(tier) is not (null or UIFieldBoxAlignment.None)))
                alignsUncaptionedSibling = true;
        }

        if (siblingFieldBox is not null)
            return ToAlignment(siblingFieldBox);

        return alignsUncaptionedSibling ? ToAlignment(CertainCaption(children[sliderIndex], tier)) : null;
    }

    private static UISize? SiblingFieldBox(IVisualComponent? control, UIResponsiveTier tier)
        => control switch
        {
            SelectComponent { Variant: UISelectVariant.Quiet } => null,
            IMultiSelectComponent { Variant: UIMultiSelectVariant.Checkboxes or UIMultiSelectVariant.Button } => null,
            IFieldInputComponent => (control as ISizedInputComponent)?.Size?.Resolve(tier) ?? UISize.Medium,
            ISwitcherComponent { Variant: UISwitcherVariant.Field } switcher => switcher.Size?.Resolve(tier) ?? UISize.Medium,
            _ => null
        };
}
