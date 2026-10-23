using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// The one reading of which things draw a field's caption row (<see cref="ICaptionRowComponent"/>) and the boxes they stand on: the
/// compiler stands a thing with none level with those boxes wherever the two stand side by side
/// (<see cref="IVisualComponent.AlignWithFieldBoxes"/>).
/// </summary>
public static class UIFieldBoxes
{
    /// <summary>The size of the box <paramref name="component"/>'s caption row stands over at <paramref name="tier"/>, or null where it draws none.</summary>
    public static UIInputSize? CaptionRowBox(IVisualComponent component, UIResponsiveTier tier)
    {
        ArgumentNullException.ThrowIfNull(component);

        return component is ICaptionRowComponent captioned ? captioned.CaptionRowBox(tier) : null;
    }

    /// <summary>Whether <paramref name="component"/> draws a caption row at any width.</summary>
    public static bool HasCaptionRow(IVisualComponent component)
    {
        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (CaptionRowBox(component, tier) is not null)
                return true;
        }

        return false;
    }

    /// <summary>The box of the first of <paramref name="children"/> that draws a caption row at <paramref name="tier"/>, or null where none does.</summary>
    public static UIInputSize? FirstCaptionRowBox(IReadOnlyList<IVisualComponent> children, UIResponsiveTier tier)
    {
        ArgumentNullException.ThrowIfNull(children);

        for (var i = 0; i < children.Count; i++)
        {
            if (CaptionRowBox(children[i], tier) is UIInputSize box)
                return box;
        }

        return null;
    }

    /// <summary>
    /// The boxes the captioned things among <paramref name="items"/> stand on at <paramref name="tier"/> — their size, the medium one
    /// where they differ — or null where none draws a caption row.
    /// </summary>
    public static UIFieldBoxAlignment? Of(IEnumerable<IVisualComponent> items, UIResponsiveTier tier)
    {
        ArgumentNullException.ThrowIfNull(items);

        UIInputSize? size = null;

        foreach (IVisualComponent item in items)
        {
            if (CaptionRowBox(item, tier) is not UIInputSize own)
                continue;

            // Fields that differ stand on the medium box.
            if (size is not null && size != own)
                return UIFieldBoxAlignment.Medium;

            size = own;
        }

        return size switch
        {
            null => null,
            UIInputSize.Small => UIFieldBoxAlignment.Small,
            UIInputSize.Large => UIFieldBoxAlignment.Large,
            _ => UIFieldBoxAlignment.Medium
        };
    }
}
