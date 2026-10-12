using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
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
    /// signed-in person, the page's buttons) on the name's row — on a phone, buttons with words stand on a row of their own under the
    /// line. On a phone the name is a title's size and wraps under itself between words when long, and the line is one line, cut —
    /// its whole words its tooltip, a long press away — so the band
    /// stays about a title's height and leaves the screen to the page; from the medium breakpoint the name is in the display role and
    /// the line runs to three lines.
    /// </summary>
    public static ContainerComponent Header(string title, string? description = null, params IVisualComponent[] trailing)
        => Header(null, title, description, false, trailing);

    /// <summary>
    /// The same band led by an action before the name — <c>UIIconButtons.Back()</c> to where the page was reached from — on the name's
    /// row at every width, the name and the line starting after it and the action's glyph on the content's edge. On a phone it follows
    /// the shell's drawer toggle, where the view has one.
    /// </summary>
    public static ContainerComponent Header(IVisualComponent leading, string title, string? description = null, params IVisualComponent[] trailing)
    {
        ArgumentNullException.ThrowIfNull(leading);

        return Header(leading, title, description, false, trailing);
    }

    /// <summary>The band, its name and line written out or, where <paramref name="bound"/>, the paths they are bound at.</summary>
    private static ContainerComponent Header(IVisualComponent? leading, string title, string? description, bool bound, IVisualComponent[] trailing)
    {
        ArgumentNullException.ThrowIfNull(trailing);

        // The name's columns: after the leading action, before the far end.
        var first = leading is null ? 1 : 2;
        var span = (trailing.Length == 0 ? 25 : 24) - first;

        // Buttons with words take a phone's row from the name — two left "Servers" a few letters a line — so there they stand on a
        // row of their own under the line; icons (a switcher, a person) stay on the name's row.
        var actionsUnder = Array.Exists(trailing, static item => item is ButtonComponent { Title: not null });

        // The name and the line twice, one of each pair shown on either side of the medium breakpoint: a text's role and a
        // paragraph's cap on its lines do not change with the width.
        UIResponsive<UIVisibility> phone = UIResponsive<UIVisibility>.Create(UIVisibility.Visible, md: UIVisibility.Collapsed);
        UIResponsive<UIVisibility> wide = UIResponsive<UIVisibility>.Create(UIVisibility.Collapsed, md: UIVisibility.Visible);

        // A leading action's glyph, 11 px inside its button, stands on the content's 24 px edge; the shell's drawer toggle band
        // replaces the start padding with its own step.
        var start = leading is null ? 24 : 24 - LeadingGlyphInset;

        ContainerComponent header = new ContainerComponent()
            // The name's line on the shell's drawer toggle's middle: 10 on a phone (the toggle 12 down and 36 tall), 20 from md (the
            // toggle 22 down, side-drawers.less).
            .SetPadding(UIResponsive<UIThickness>.Create(UIThickness.All(start, 10, 16, 4), md: UIThickness.All(start, 20, 24, 4)));

        // First in the band's order, as it stands, so the keyboard reaches it before the far end; at the row's top, level with the far
        // end and, on a phone, with the drawer toggle. From md the name stands as far after it as the glyph inside it, so an action
        // shown only on a phone leaves the name on the content's edge.
        if (leading is not null)
        {
            _ = header
                .SetColumn(1, UIGridUnit.Auto())
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.All(0, 0, 4, 0), md: UIThickness.All(0, 0, LeadingGlyphInset, 0)))
                    .SetVerticalAlignment(UIAlignment.Start)
                    .AddChild(leading)
                    .SetPlacement(1, 1, 1, 1)
                );
        }

        // On a phone a name too long for its row wraps under itself rather than losing its end, its first line level with the far
        // end, which stands at the row's top. A wrapped display name would push the page down, so it wraps at a title's size.
        _ = header
            .AddChild(HeaderTitle(title, bound, first, actionsUnder ? 25 - first : span, phone)
                .AsTitle()
                .SetTitleWrap(true)
                .SetVerticalAlignment(UIAlignment.Start)
                .SetMargin(UIThickness.All(0, PhoneTitleInset, 0, 0))
            )
            .AddChild(HeaderTitle(title, bound, first, span, wide).AsDisplay());

        // A paragraph rather than a text, which has no cap on its lines. On a phone it runs under the far end too, its whole words a
        // long press away (its tooltip), since the one line cuts them; under the name, never under the leading action.
        if (description is not null)
        {
            ParagraphComponent line = HeaderLine(description, bound, 1, phone);

            _ = header
                .AddChild((bound ? line.BindTooltip(description) : line.SetTooltip(description)).SetPlacement(first, 2, 25 - first, 1))
                .AddChild(HeaderLine(description, bound, 3, wide).SetPlacement(first, 2, span, 1));
        }

        if (trailing.Length == 0)
            return header;

        // The last column as wide as what stands in it, so the name keeps the rest — a third of the band given to one switch
        // left the name a few letters and an ellipsis. Icons stay on the name's row on a phone as well: folded under the line they
        // took a third of a phone's height.
        UIGridPlacement end = UIGridPlacement.At(24, 1, 1, 1);
        UIThickness beside = UIThickness.All(12, 0, 0, 0);

        return header
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(UIResponsive<double>.Create(8, md: 12))
                .SetWrap(actionsUnder)
                .SetMargin(UIResponsive<UIThickness>.Create(actionsUnder ? UIThickness.All(0, 12, 0, 0) : UIThickness.All(8, 0, 0, 0), md: beside))
                .SetHorizontalAlignment(UIAlignment.End)
                .SetVerticalAlignment(UIAlignment.Start)
                .AddChildren(trailing)
                .SetPlacement(actionsUnder ? UIResponsive<UIGridPlacement>.Create(UIGridPlacement.At(first, 3, 25 - first, 1), md: end) : UIResponsive<UIGridPlacement>.Create(end))
            );
    }

    // Half a control's 40 px less the name's 28 px line: a one-line name stands in the far end's middle, a wrapped one's first line too.
    private const double PhoneTitleInset = 6;

    // Half of an icon button's 40 px less its 18 px glyph.
    private const double LeadingGlyphInset = 11;

    /// <summary>The page's name, from <paramref name="column"/> across <paramref name="span"/>, where <paramref name="visibility"/> shows it.</summary>
    private static TextComponent HeaderTitle(string title, bool bound, int column, int span, UIResponsive<UIVisibility> visibility)
    {
        TextComponent text = new TextComponent()
            .SetTitleColor(UIThemeColor.OnBackground)
            .SetVerticalAlignment(UIAlignment.Center)
            .SetVisibility(visibility)
            .SetPlacement(column, 1, span, 1);

        return bound ? text.BindTitle(title) : text.SetTitle(title);
    }

    /// <summary>The muted line under the name, at most <paramref name="lines"/> lines, where <paramref name="visibility"/> shows it.</summary>
    private static ParagraphComponent HeaderLine(string description, bool bound, int lines, UIResponsive<UIVisibility> visibility)
    {
        ParagraphComponent line = new ParagraphComponent()
            .SetMaxLines(lines)
            .SetDescriptionType(UITextAppearance.Body)
            .SetDescriptionColor(UIThemeColor.Muted)
            .SetVisibility(visibility);

        return bound ? line.BindDescription(description) : line.SetDescription(description);
    }

    /// <summary>
    /// The band with a name and a line the controller holds — a note's name, its status — bound at <paramref name="titlePath"/> and
    /// <paramref name="descriptionPath"/>, led by <paramref name="leading"/> where one is given.
    /// </summary>
    public static ContainerComponent BoundHeader(IVisualComponent? leading, string titlePath, string? descriptionPath = null, params IVisualComponent[] trailing)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);

        if (descriptionPath is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(descriptionPath);

        return Header(leading, titlePath, descriptionPath, true, trailing);
    }

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

    /// <summary>
    /// A part of a page or a panel folded under its name, the collapsible sibling of <see cref="Section"/>: the quiet expander — the
    /// name a muted caption with the chevron after it, no card — over the content in a stack. A null <paramref name="title"/> leaves
    /// the name to the header: <c>.ConfigureDefaultHeader(header => header.BindTitle(path))</c>; <c>.BindExpanded(path)</c> follows the
    /// controller.
    /// </summary>
    public static ExpanderComponent Fold(string? title, bool expanded, params IVisualComponent[] content)
    {
        ArgumentNullException.ThrowIfNull(content);

        if (title is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(title);

        ExpanderComponent fold = new ExpanderComponent()
            .SetVariant(UIExpanderVariant.Quiet)
            // A caption rather than a title: between two fields or in a narrow panel, a heading would make it a part of its own.
            .ConfigureDefaultHeader(header =>
            {
                _ = header.AsCaption();

                if (title is not null)
                    _ = header.SetTitle(title);
            })
            .SetContent(UILayout.Stack(12, content));

        return expanded ? fold.SetExpanded() : fold.SetCollapsed();
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
