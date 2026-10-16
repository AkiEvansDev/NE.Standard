using System;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// What a form is assembled from beyond its fields: a field with a hint under it, and fields side by side. The read-only rows a
/// summary is made of are <see cref="UIDetails"/>.
/// </summary>
public static class UIForm
{
    /// <summary>A field with a muted line under it: what may be typed, what it is for, how much is left.</summary>
    public static StackPanelComponent Field(IVisualComponent input, string hint)
    {
        ArgumentNullException.ThrowIfNull(input);
        ArgumentException.ThrowIfNullOrWhiteSpace(hint);

        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(4)
            .AddChild(input)
            .AddChild(UIText.Note(hint).SetFieldNote(true));
    }

    /// <summary>
    /// Fields side by side on one line — a city and its postcode, a first name and a last — in equal columns, their tops level.
    /// </summary>
    public static ContainerComponent Row(params IVisualComponent[] fields)
        => Row(16, fields);

    /// <summary>
    /// Fields side by side in equal columns, their tops level, <paramref name="spacing"/> apart. Among fields with a caption over their
    /// boxes, a control with none (a switch, a checkbox, a button) stands a caption line down, centred on a box of their size, while
    /// they stand side by side.
    /// </summary>
    public static ContainerComponent Row(double spacing, params IVisualComponent[] fields)
    {
        ArgumentNullException.ThrowIfNull(fields);

        // In a row with no caption, a line over a control would only be air.
        Func<IVisualComponent, UIFieldBoxAlignment>? fieldBoxes = null;

        if (Array.Exists(fields, HasCaptionRow))
        {
            UIFieldBoxAlignment boxes = BoxesOf(fields);
            fieldBoxes = field => HasCaptionRow(field) ? UIFieldBoxAlignment.None : boxes;
        }

        // Held by the top, not centred like a plain cell: a field growing its validation line must not push its neighbour down.
        return UILayout.Columns(spacing, UIAlignment.Start, fields, fieldBoxes);
    }

    /// <summary>
    /// Whether a field draws a caption row over its box: an input with a caption to show that stands above it, a switcher drawn as a
    /// field, or a column led by one (<see cref="Field"/>). A toggle's words stand beside its box, a button's in it.
    /// </summary>
    private static bool HasCaptionRow(IVisualComponent field)
        => field switch
        {
            ISwitcherComponent switcher => switcher.Variant == UISwitcherVariant.Field,
            ITextComponent => false,
            IFieldInputComponent { TitlePlacement: UIInputTitlePlacement.Inside } => false,
            IInputComponent and ITextBaseComponent input => ShowsCaption(input),
            StackPanelComponent { Orientation: not UIOrientation.Horizontal, Children: [IVisualComponent first, ..] } => HasCaptionRow(first),
            _ => false
        };

    /// <summary>Whether an input has a caption to show: a title, an icon or a badge, written or bound.</summary>
    private static bool ShowsCaption(ITextBaseComponent input)
    {
        if (input.Title is not null || input.Icon is not null || input.BadgeText is not null || input.BadgeIcon is not null)
            return true;

        foreach (UIBinding binding in input.Bindings)
        {
            if (binding.Target.Equals(ITextBaseComponent.TitleProperty) || binding.Target.Equals(ITextBaseComponent.IconProperty) || binding.Target.Equals(ITextBaseComponent.BadgeTextProperty) || binding.Target.Equals(ITextBaseComponent.BadgeIconProperty))
                return true;
        }

        return false;
    }

    /// <summary>The captioned fields' box size where they all write the same one; medium where they differ or one is bound.</summary>
    private static UIFieldBoxAlignment BoxesOf(IVisualComponent[] fields)
    {
        UIInputSize? size = null;

        foreach (IVisualComponent field in fields)
        {
            if (!HasCaptionRow(field))
                continue;

            UIInputSize own = SizeOf(field);

            if (size is not null && size != own)
                return UIFieldBoxAlignment.Medium;

            size = own;
        }

        return size switch
        {
            UIInputSize.Small => UIFieldBoxAlignment.Small,
            UIInputSize.Large => UIFieldBoxAlignment.Large,
            _ => UIFieldBoxAlignment.Medium
        };
    }

    /// <summary>A captioned field's size as written, a column's that of the field leading it (<see cref="Field"/>); medium where unwritten.</summary>
    private static UIInputSize SizeOf(IVisualComponent field)
        => field switch
        {
            StackPanelComponent { Children: [IVisualComponent first, ..] } => SizeOf(first),
            ISizedInputComponent { Size: UIInputSize size } => size,
            _ => UIInputSize.Medium
        };
}
