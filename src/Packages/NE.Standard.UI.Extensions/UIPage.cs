using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// The regions a page is made of: its header band, a titled section, a card with a name, a thing under its label.
/// </summary>
public static class UIPage
{
    /// <summary>
    /// The band a page is headed by: the name, a muted line under it, and whatever stands at the far end (a theme switcher, a
    /// signed-in person, the page's buttons) on the name's row at every width. On a phone the name is a title's size and wraps
    /// under itself when long, and the line is one line, cut, so the band stays about a title's height and leaves the screen to
    /// the page; from the medium breakpoint the name is in the display role and the line runs to three lines.
    /// </summary>
    public static ContainerComponent Header(string title, string? description = null, params IVisualComponent[] trailing)
    {
        ArgumentNullException.ThrowIfNull(trailing);

        var span = trailing.Length == 0 ? 24 : 23;

        // The name and the line twice, one of each pair shown on either side of the medium breakpoint: a text's role and a
        // paragraph's cap on its lines do not change with the width.
        UIResponsive<UIVisibility> phone = UIResponsive<UIVisibility>.Create(UIVisibility.Visible, md: UIVisibility.Collapsed);
        UIResponsive<UIVisibility> wide = UIResponsive<UIVisibility>.Create(UIVisibility.Collapsed, md: UIVisibility.Visible);

        ContainerComponent header = new ContainerComponent()
            // 10 on a phone puts the name's line on the shell's drawer toggle's middle (12 down and 36 tall).
            .SetPadding(UIResponsive<UIThickness>.Create(UIThickness.All(24, 10, 16, 4), md: UIThickness.All(24, 20, 24, 4)))
            // On a phone a name too long for its row wraps under itself rather than losing its end, its first line level with the
            // far end, which stands at the row's top. A wrapped display name would push the page down, so it wraps at a title's size.
            .AddChild(HeaderTitle(title, span, phone)
                .AsTitle()
                .SetTitleWrap(true)
                .SetVerticalAlignment(UIAlignment.Start)
                .SetMargin(UIThickness.All(0, PhoneTitleInset, 0, 0))
            )
            .AddChild(HeaderTitle(title, span, wide).AsDisplay());

        // A paragraph rather than a text, which has no cap on its lines. On a phone it runs under the far end too.
        if (description is not null)
        {
            _ = header
                .AddChild(HeaderLine(description, 1, phone).SetPlacement(1, 2, 24, 1))
                .AddChild(HeaderLine(description, 3, wide).SetPlacement(1, 2, span, 1));
        }

        if (trailing.Length == 0)
            return header;

        // The last column as wide as what stands in it, so the name keeps the rest — a third of the band given to one switch
        // left the name a few letters and an ellipsis. The far end stays on the name's row on a phone as well: folded under the
        // line it took a third of a phone's height.
        return header
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(UIResponsive<double>.Create(8, md: 12))
                .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.All(8, 0, 0, 0), md: UIThickness.All(12, 0, 0, 0)))
                .SetHorizontalAlignment(UIAlignment.End)
                .SetVerticalAlignment(UIAlignment.Start)
                .AddChildren(trailing)
                .SetPlacement(24, 1, 1, 1)
            );
    }

    // Half a control's 40 px less the name's 28 px line: a one-line name stands in the far end's middle, a wrapped one's first line too.
    private const double PhoneTitleInset = 6;

    /// <summary>The page's name, where <paramref name="visibility"/> shows it.</summary>
    private static TextComponent HeaderTitle(string title, int span, UIResponsive<UIVisibility> visibility)
        => new TextComponent()
            .SetTitle(title)
            .SetTitleColor(UIThemeColor.OnBackground)
            .SetVerticalAlignment(UIAlignment.Center)
            .SetVisibility(visibility)
            .SetPlacement(1, 1, span, 1);

    /// <summary>The muted line under the name, at most <paramref name="lines"/> lines, where <paramref name="visibility"/> shows it.</summary>
    private static ParagraphComponent HeaderLine(string description, int lines, UIResponsive<UIVisibility> visibility)
        => new ParagraphComponent()
            .SetDescription(description)
            .SetMaxLines(lines)
            .SetDescriptionType(UITextAppearance.Body)
            .SetDescriptionColor(UIThemeColor.Muted)
            .SetVisibility(visibility);

    /// <summary>
    /// A message laid across the top of the page's content (<see cref="UIMessage"/>): edge to edge, square, a rule under it, its
    /// mark in line with the header's name. The content's first child, outside any padding of its own, it scrolls with the page; in
    /// the header region of a view whose header is sticky it stays, beside the drawer toggle on a phone.
    /// </summary>
    public static SurfaceComponent Banner(SurfaceComponent message)
    {
        ArgumentNullException.ThrowIfNull(message);

        UIThickness padding = message.Padding?.Base ?? UIThickness.Uniform(12);

        return message
            .SetBorderRadius(UICornerRadius.Uniform(0))
            .SetBorderThickness(UIThickness.All(0, 0, 0, 1))
            .SetHorizontalAlignment(UIAlignment.Stretch)
            .SetPadding(UIThickness.All(24, padding.Top, Math.Max(padding.Right, 16), padding.Bottom));
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
