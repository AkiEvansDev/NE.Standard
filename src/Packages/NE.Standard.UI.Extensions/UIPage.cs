using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// The regions a page is made of: its header band, a titled section, a card with a name, a thing under its label.
/// </summary>
public static class UIPage
{
    /// <summary>
    /// The band a page is headed by: the name in the display role, a muted line under it, and whatever stands at the far
    /// end (a theme switcher, a signed-in person, the page's buttons).
    /// </summary>
    public static ContainerComponent Header(string title, string? description = null, params IVisualComponent[] trailing)
    {
        ArgumentNullException.ThrowIfNull(trailing);

        ContainerComponent header = new ContainerComponent()
            .SetPadding(UIThickness.All(24, 20, 24, 4))
            .AddChild(UIText.Display(title, description)
                .SetTitleColor(UIThemeColor.OnBackground)
                .SetDescriptionType(UITextAppearance.Body)
                .SetDescriptionColor(UIThemeColor.Muted)
                .SetPlacement(1, 1, trailing.Length == 0 ? 24 : 16, 1)
            );

        if (trailing.Length == 0)
            return header;

        return header.AddChild(new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(12)
            .SetHorizontalAlignment(UIAlignment.End)
            .SetVerticalAlignment(UIAlignment.Start)
            .AddChildren(trailing)
            .SetPlacement(17, 1, 8, 1)
        );
    }

    /// <summary>
    /// A titled part of a page: the heading, a muted line under it when there is one, and the content below with air between.
    /// </summary>
    public static StackPanelComponent Section(string title, string? description, params IVisualComponent[] content)
    {
        ArgumentNullException.ThrowIfNull(content);

        // The heading and its note sit closer to each other than to the content: two stacks, not one spacing.
        StackPanelComponent heading = UILayout.Stack(4).AddChild(UIText.Title(title));

        if (description is not null)
            _ = heading.AddChild(UIText.Note(description));

        return UILayout.Stack(16).AddChild(heading).AddChildren(content);
    }

    /// <summary>A card with its name and an optional line in the header band, and one thing as its content.</summary>
    public static CardComponent Card(string title, string? description, IVisualComponent content, string? icon = null)
    {
        ArgumentNullException.ThrowIfNull(content);

        return new CardComponent()
            .ConfigureDefaultHeader(header =>
            {
                _ = header.SetTitle(title);

                if (description is not null)
                    _ = header.SetDescription(description);

                if (icon is not null)
                    _ = header.SetIcon(icon);
            })
            .SetContent(content);
    }

    /// <summary>A thing under its label: the overline over a sample, a value, a control that has no title of its own.</summary>
    public static StackPanelComponent Labelled(string label, IVisualComponent content)
    {
        ArgumentNullException.ThrowIfNull(content);

        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetVerticalAlignment(UIAlignment.Start)
            .SetSpacing(6)
            .AddChild(UIText.Label(label))
            .AddChild(content);
    }
}
