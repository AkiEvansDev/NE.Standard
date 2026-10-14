using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// A card with its name in the header band — a part of a page that stands on its own: a session, a settings group, a summary — and
/// one card alone on an otherwise empty page.
/// </summary>
public static class UICard
{
    /// <summary>
    /// A card with its name, an optional line and an optional mark in the default header, one component as its content, and
    /// <paramref name="trailing"/> (an icon button, a switcher) at the header's far end.
    /// </summary>
    public static CardComponent Create(string title, string? description, IVisualComponent content, string? icon = null, params IVisualComponent[] trailing)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentNullException.ThrowIfNull(content);
        ArgumentNullException.ThrowIfNull(trailing);

        if (icon is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        CardComponent card = new CardComponent()
            .ConfigureDefaultHeader(header =>
            {
                _ = header.SetTitle(title);

                if (description is not null)
                    _ = header.SetDescription(description);

                if (icon is not null)
                    _ = header.SetIcon(icon);
            })
            .SetContent(content);

        if (trailing.Length == 0)
            return card;

        // One stands as it is; more stand in a row with a toolbar's air.
        return card.SetHeaderAction(trailing.Length == 1 ? trailing[0] : new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(4)
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChildren(trailing)
        );
    }

    /// <summary>
    /// One card alone on an otherwise empty page — a sign-in, a refusal, what a submit came to (<see cref="UIPage.Outcome(string?, UIMessageSeverity, string, string?, IVisualComponent[])"/>),
    /// or a stack of a form and what replaces it: a form's column (<see cref="UIColumnWidth.Form"/>, the whole width on a phone) in the
    /// middle, 24 px under the top on a phone and 96 px from the medium breakpoint, where a card at a wide screen's top edge reads as
    /// pushed up.
    /// </summary>
    public static ContainerComponent Centered(IVisualComponent card)
    {
        ArgumentNullException.ThrowIfNull(card);

        return new ContainerComponent()
            .SetPadding(UIResponsive<UIThickness>.Create(UIThickness.All(0, 24, 0, 24), md: UIThickness.All(0, 96, 0, 24)))
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetWidth(UILayoutLength.Fill())
                .SetMaxWidth(UILayoutLength.Absolute(UIPage.Pixels(UIColumnWidth.Form)))
                .SetHorizontalAlignment(UIAlignment.Center)
                .AddChild(card)
                .SetPlacement(1, 1, 24, 1)
            );
    }
}
