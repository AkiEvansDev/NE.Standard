using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// What stands a thing with no caption level with the boxes of captioned fields beside it, for every preset that lays the two side by
/// side: a form row (<see cref="UIForm.Row(double, IVisualComponent[])"/>), a row (<see cref="UILayout.Row"/>) and a start with its far
/// end (<see cref="UILayout.Ends(IVisualComponent, IVisualComponent[])"/>).
/// </summary>
internal static class UIFieldBoxes
{
    /// <summary>The box size the captioned things among <paramref name="items"/> stand on, or null where none draws a caption row.</summary>
    public static UIFieldBoxAlignment? Of(IEnumerable<IVisualComponent> items)
    {
        UIInputSize? size = null;
        var captioned = false;

        foreach (IVisualComponent item in items)
        {
            if (!HasCaptionRow(item))
                continue;

            UIInputSize own = SizeOf(item);

            // Fields that differ stand on the medium box.
            if (captioned && size != own)
                return UIFieldBoxAlignment.Medium;

            captioned = true;
            size = own;
        }

        if (!captioned)
            return null;

        return size switch
        {
            UIInputSize.Small => UIFieldBoxAlignment.Small,
            UIInputSize.Large => UIFieldBoxAlignment.Large,
            _ => UIFieldBoxAlignment.Medium
        };
    }

    /// <summary>
    /// Whether a thing draws a caption row over its box: an input with a caption to show that stands above it, a switcher drawn as a
    /// field, a thing under its label (<see cref="UIPage.Labelled(UIPhrase, IVisualComponent, bool)"/>), a column led by one (<see cref="UIForm.Field(IVisualComponent, UIPhrase)"/>),
    /// or a row or a grid holding one (a field and its Add). A toggle's words stand beside its box, a button's in it.
    /// </summary>
    public static bool HasCaptionRow(IVisualComponent component)
        => component switch
        {
            ISwitcherComponent switcher => switcher.Variant == UISwitcherVariant.Field,
            ITextComponent => false,
            IFieldInputComponent { TitlePlacement: UIInputTitlePlacement.Inside } => false,
            IInputComponent and ITextBaseComponent input => ShowsCaption(input),
            // A thing under its label (UIPage.Labelled): its label stands in a caption's row.
            StackPanelComponent { FirstChildAsCaption: true } => true,
            StackPanelComponent { Orientation: not UIOrientation.Horizontal, Children: [IVisualComponent first, ..] } => HasCaptionRow(first),
            IContainerComponent container => AnyHasCaptionRow(container.Children),
            _ => false
        };

    private static bool AnyHasCaptionRow(IReadOnlyList<IVisualComponent> children)
    {
        foreach (IVisualComponent child in children)
        {
            if (HasCaptionRow(child))
                return true;
        }

        return false;
    }

    /// <summary>Whether an input has a caption to show: a title, an icon or a badge, written or bound.</summary>
    private static bool ShowsCaption(ITextBaseComponent input)
        => input.Title is not null || input.Icon is not null || input.BadgeText is not null || input.BadgeIcon is not null
            || PresetBindings.Binds(input, ITextBaseComponent.TitleProperty) || PresetBindings.Binds(input, ITextBaseComponent.IconProperty)
            || PresetBindings.Binds(input, ITextBaseComponent.BadgeTextProperty) || PresetBindings.Binds(input, ITextBaseComponent.BadgeIconProperty);

    /// <summary>A captioned thing's size as written, a column's, row's or grid's that of the captioned thing in it; medium where unwritten.</summary>
    private static UIInputSize SizeOf(IVisualComponent component)
        => component switch
        {
            ISizedInputComponent { Size: UIInputSize size } => size,
            IContainerComponent container => SizeOf(container.Children),
            _ => UIInputSize.Medium
        };

    private static UIInputSize SizeOf(IReadOnlyList<IVisualComponent> children)
    {
        foreach (IVisualComponent child in children)
        {
            if (HasCaptionRow(child))
                return SizeOf(child);
        }

        return UIInputSize.Medium;
    }

    /// <summary>
    /// Stands <paramref name="child"/> level with the boxes at the widths <paramref name="boxes"/> names: a column of its own (a control
    /// and its note) through itself, so that its first child alone stands on the band and the rest hang under it; anything else through
    /// its <paramref name="cell"/>.
    /// </summary>
    public static void Align(StackPanelComponent cell, IVisualComponent child, UIResponsive<UIFieldBoxAlignment> boxes)
        => _ = (AlignsItself(child, out StackPanelComponent? column) ? column : cell).SetAlignWithFieldBoxes(boxes);

    /// <summary>Whether <paramref name="child"/> is a column standing level with the boxes itself, not through a cell around it.</summary>
    public static bool AlignsItself(IVisualComponent child, [NotNullWhen(true)] out StackPanelComponent? column)
    {
        column = child as StackPanelComponent;

        return column is { Orientation: not UIOrientation.Horizontal, AlignWithFieldBoxes: null };
    }
}
