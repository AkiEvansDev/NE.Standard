using System;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// A button in each of its types, in one call, and the two rows buttons are put in: the pair at a form's foot and the
/// toolbar of icon-only buttons.
/// </summary>
public static class UIButtons
{
    /// <summary>The one filled button of a group: what pressing means "go".</summary>
    public static ButtonComponent Primary(string title, string? icon = null)
        => Create(UIButtonType.Primary, title, icon);

    /// <summary>The filled button in the accent colour, for the one action a page is about.</summary>
    public static ButtonComponent Accent(string title, string? icon = null)
        => Create(UIButtonType.Accent, title, icon);

    /// <summary>An outlined button: the other way, beside the filled one.</summary>
    public static ButtonComponent Secondary(string title, string? icon = null)
        => Create(UIButtonType.Outline, title, icon);

    /// <summary>A bare button: the safe answer, the cancel, the thing that costs nothing.</summary>
    public static ButtonComponent Ghost(string title, string? icon = null)
        => Create(UIButtonType.Ghost, title, icon);

    /// <summary>The filled button in the danger colour, for the thing that cannot be undone.</summary>
    public static ButtonComponent Danger(string title, string? icon = null)
        => Create(UIButtonType.Danger, title, icon);

    /// <summary>A button that reads as a link, for a way out that sits in prose or beside a pair.</summary>
    public static ButtonComponent Link(string title, string? icon = null)
        => Create(UIButtonType.Link, title, icon);

    /// <summary>An icon-only bare button; the tooltip is the only name it has, so it is required.</summary>
    public static ButtonComponent Icon(string icon, string tooltip)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(icon);
        ArgumentException.ThrowIfNullOrWhiteSpace(tooltip);

        return new ButtonComponent().SetType(UIButtonType.Ghost).SetIcon(icon).SetTooltip(tooltip);
    }

    /// <summary>
    /// The pair at a form's foot: the safe answer first, the committing one last, both pushed to the far edge.
    /// </summary>
    public static StackPanelComponent Pair(ButtonComponent secondary, ButtonComponent primary)
    {
        ArgumentNullException.ThrowIfNull(secondary);
        ArgumentNullException.ThrowIfNull(primary);

        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetHorizontalAlignment(UIAlignment.End)
            .SetSpacing(8)
            .AddChild(secondary)
            .AddChild(primary);
    }

    /// <summary>A row of buttons with a toolbar's tight air, starting at the near edge.</summary>
    public static StackPanelComponent Toolbar(params ButtonComponent[] buttons)
    {
        ArgumentNullException.ThrowIfNull(buttons);

        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetHorizontalAlignment(UIAlignment.Start)
            .SetSpacing(4)
            .AddChildren(buttons);
    }

    private static ButtonComponent Create(UIButtonType type, string title, string? icon)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);

        ButtonComponent button = new ButtonComponent().SetType(type).SetTitle(title);

        return icon is null ? button : button.SetIcon(icon);
    }
}
