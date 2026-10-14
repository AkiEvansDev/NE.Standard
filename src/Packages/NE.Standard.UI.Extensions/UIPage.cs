using System;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// The regions a page is made of: its header band, a titled section, a thing under its label, a band, a reading column, and the
/// states a page or a pane stands in — empty, or showing what came of a press.
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
        var actionsUnder = Array.Exists(trailing, static item => item is IButtonComponent button && ShowsWords(button));

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

    /// <summary>Whether a button shows words — a title written or bound — rather than only an icon.</summary>
    internal static bool ShowsWords(IButtonComponent button)
    {
        if (button.Title is not null)
            return true;

        foreach (UIBinding binding in button.Bindings)
        {
            if (binding.Target.Equals(ITextBaseComponent.TitleProperty))
                return true;
        }

        return false;
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

        // A bound name is the thing's own (a note's, a person's), never a key that happens to match it.
        return bound ? text.BindTitle(title).AsContent(ITextBaseComponent.TitleProperty) : text.SetTitle(title);
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
    /// The band at <paramref name="size"/>: <see cref="UIHeaderSize.Page"/> is <see cref="Header(IVisualComponent, string, string?, IVisualComponent[])"/>'s;
    /// <see cref="UIHeaderSize.Pane"/> is the title row of a pane beside a list or a tree — a conversation's, an open note's — at every
    /// width: the name one line in the subtitle role, cut with its whole words as its tooltip, the description a muted caption beside
    /// it (a status: "Not saved"), the far end on the same row, and no edge of its own, the pane's padding being it. A
    /// <paramref name="leading"/> action (<c>UIIconButtons.Back().ShownBelow(UIResponsiveTier.Md)</c>, an avatar, both in a row)
    /// stands before the name. <see cref="UIHeaderSize.Strip"/> is a panel's caption over the list or the tree in it — an explorer's
    /// "Files": the name in the label role, set in by a row's 8 px so it stands over the rows' words, the far end on its row.
    /// </summary>
    public static ContainerComponent Header(UIHeaderSize size, IVisualComponent? leading, string title, string? description = null, params IVisualComponent[] trailing)
        => size == UIHeaderSize.Page ? Header(leading, title, description, false, trailing) : PaneHeader(leading, title, description, false, size == UIHeaderSize.Strip, trailing);

    /// <summary>
    /// The pane's title row, or a panel's caption where <paramref name="strip"/>, its name and caption written out or, where
    /// <paramref name="bound"/>, the paths they are bound at.
    /// </summary>
    private static ContainerComponent PaneHeader(IVisualComponent? leading, string title, string? description, bool bound, bool strip, IVisualComponent[] trailing)
    {
        ArgumentNullException.ThrowIfNull(trailing);

        // The leading action and the far end as wide as they are, the name and its caption in the star columns between: the grid
        // gives the auto columns their whole width before the stars get any, so on a phone the name gives way — cut, its whole words
        // the tooltip — and never the last icon. Side by side in auto columns, the name took an equal share and clipped it.
        ContainerComponent header = new ContainerComponent()
            .SetColumn(PaneLeadingColumn, UIGridUnit.Auto())
            .SetColumn(24, UIGridUnit.Auto());

        // A row's own inset (a list's, a tree's), so the caption's words stand over the rows' words under it.
        if (strip)
            _ = header.SetPadding(UIThickness.All(StripInset, 0, 0, 0));

        if (leading is not null)
            _ = header.AddChild(PaneLeading(leading));

        _ = header.AddChild(PaneWords(title, description, bound, strip).SetPlacement(2, 1, 22, 1));

        if (trailing.Length == 0)
            return header;

        return header.AddChild(new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(4)
            .SetMargin(UIThickness.All(12, 0, 0, 0))
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChildren(trailing)
            .SetPlacement(24, 1, 1, 1)
        );
    }

    /// <summary>
    /// The name and its caption, each as wide as it is, so a short name keeps its caption beside it rather than across the row;
    /// neither has a floor, so a long one is cut rather than pushing past its room.
    /// </summary>
    private static ContainerComponent PaneWords(string title, string? description, bool bound, bool strip)
    {
        ContainerComponent words = new ContainerComponent()
            .SetColumn(1, UIGridUnit.Auto(min: 0))
            .SetColumn(2, UIGridUnit.Auto(min: 0))
            .SetVerticalAlignment(UIAlignment.Center);

        TextComponent name = new TextComponent()
            .SetVerticalAlignment(UIAlignment.Center)
            .SetPlacement(1, 1, 1, 1);

        _ = strip ? name.AsOverline().Muted() : name.AsSubtitle().SetTitleColor(UIThemeColor.OnBackground);

        // A bound name is the thing's own (a person's, a note's), never a key that happens to match it.
        _ = words.AddChild(bound
            ? name.BindTitle(title).BindTooltip(title).AsContent(ITextBaseComponent.TitleProperty, ITooltipComponent.TooltipProperty)
            : name.SetTitle(title).SetTooltip(title)
        );

        if (description is null)
            return words;

        TextComponent caption = new TextComponent()
            .AsCaption()
            .Muted()
            .SetMargin(UIThickness.All(8, 0, 0, 0))
            .SetVerticalAlignment(UIAlignment.Center)
            .SetPlacement(2, 1, 1, 1);

        return words.AddChild(bound ? caption.BindTitle(description) : caption.SetTitle(description));
    }

    /// <summary>
    /// The leading action's cell, the 8 px before the name its own. It is shown as the action is — <c>Back().ShownBelow(Md)</c>,
    /// a bound visibility — so where the action is hidden its gap goes with it and the name stands on the pane's edge.
    /// </summary>
    private static StackPanelComponent PaneLeading(IVisualComponent leading)
    {
        StackPanelComponent cell = new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetMargin(UIThickness.All(0, 0, 8, 0))
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChild(leading)
            .SetPlacement(PaneLeadingColumn, 1, 1, 1);

        if (leading.Visibility is { } visibility)
            _ = cell.SetVisibility(visibility);

        foreach (UIBinding binding in leading.Bindings)
        {
            if (binding.Target.Equals(IVisualComponent.VisibilityProperty))
                _ = cell.BindVisibility(binding.Source.ToString(), binding.Scope);
        }

        return cell;
    }

    private const int PaneLeadingColumn = 1;

    // A list's and a tree's row inset: an explorer's caption over a tree.
    private const double StripInset = 8;

    /// <summary>
    /// The band at <paramref name="size"/>, its name and line the controller holds, bound at <paramref name="titlePath"/> and
    /// <paramref name="descriptionPath"/>: on a pane or a strip, the name bound as the thing's own words and the line as a caption
    /// beside it.
    /// </summary>
    public static ContainerComponent BoundHeader(UIHeaderSize size, IVisualComponent? leading, string titlePath, string? descriptionPath = null, params IVisualComponent[] trailing)
    {
        if (size == UIHeaderSize.Page)
            return BoundHeader(leading, titlePath, descriptionPath, trailing);

        ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);

        if (descriptionPath is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(descriptionPath);

        return PaneHeader(leading, titlePath, descriptionPath, true, size == UIHeaderSize.Strip, trailing);
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
        => Section(HeadingWords(title, description), content);

    /// <summary>The same under a heading of the author's: <see cref="Heading"/>, with things at its far end.</summary>
    public static StackPanelComponent Section(IVisualComponent heading, params IVisualComponent[] content)
    {
        ArgumentNullException.ThrowIfNull(heading);
        ArgumentNullException.ThrowIfNull(content);

        return UILayout.Stack(16).AddChild(heading).AddChildren(content);
    }

    /// <summary>The title over its muted line, a section's heading.</summary>
    private static StackPanelComponent HeadingWords(string title, string? description)
    {
        // The heading and its note sit closer to each other than to the content: two stacks, not one spacing. A heading is prose, so on
        // a phone a long one wraps rather than losing its end.
        StackPanelComponent heading = UILayout.Stack(4).AddChild(UIText.Title(title).SetTitleWrap(true));

        return description is null ? heading : heading.AddChild(UIText.Note(description));
    }

    /// <summary>
    /// A section's heading with things at its far end — the source of a sample, the "+" that adds to the list under it — the title
    /// and its line taking the rest of the row (<see cref="UILayout.Ends"/>).
    /// </summary>
    public static ContainerComponent Heading(string title, string? description = null, params IVisualComponent[] trailing)
        => UILayout.Ends(HeadingWords(title, description), trailing);

    /// <summary>
    /// A part of a page or a panel folded under its name, the collapsible sibling of <see cref="Section(string, string?, IVisualComponent[])"/>:
    /// the quiet expander — the name a muted caption with the chevron after it, no card — over the content in a stack. A null
    /// <paramref name="title"/> leaves the name to the header: <c>.ConfigureDefaultHeader(header => header.BindTitle(path))</c>;
    /// <c>.BindExpanded(path)</c> follows the controller.
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

    /// <summary>
    /// A thing under its label: the overline over a sample, a value, a control that has no title of its own. The label keeps one line
    /// unless <paramref name="wrap"/>, for a label that is a sentence.
    /// </summary>
    public static StackPanelComponent Labelled(string label, IVisualComponent content, bool wrap = false)
    {
        ArgumentNullException.ThrowIfNull(content);

        TextComponent overline = UIText.Label(label);

        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetVerticalAlignment(UIAlignment.Start)
            .SetSpacing(6)
            .AddChild(wrap ? overline.SetTitleWrap(true) : overline)
            .AddChild(content);
    }

    /// <summary>
    /// Where something would be and nothing is yet — a pane before a row is chosen, a page with nothing made — drawn as a list draws its
    /// own empty state, because it is that state (<see cref="DefaultEmptyTemplate"/>): the icon in the brand's colour, the muted body
    /// title and the caption under it, both wrapping; <paramref name="action"/> (the button that makes the first one, a link to where
    /// they are) under the words. The block stands in the middle of the room it is given.
    /// </summary>
    public static ContainerComponent Empty(string icon, string title, string? line = null, IVisualComponent? action = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(icon);
        ArgumentException.ThrowIfNullOrWhiteSpace(title);

        if (line is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(line);

        DefaultEmptyTemplate words = new DefaultEmptyTemplate()
            .SetIcon(icon)
            .SetTitle(title)
            .SetWrapMode(UITextWrapMode.Wrap);

        StackPanelComponent block = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .SetHorizontalAlignment(UIAlignment.Center)
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChild(line is null ? words : words.SetDescription(line));

        if (action is not null)
            _ = block.AddChild(action);

        // A grid as tall as its room, so the block can stand in the middle of a pane rather than at its top.
        return new ContainerComponent()
            .SetHeight(UILayoutLength.Fill())
            .AddChild(block.SetPlacement(1, 1, 24, 1));
    }

    /// <summary>
    /// What came of a press, in place of the form it ends — "Check your inbox", "Thank you", "Not for this account": a raised panel
    /// with the mark in <paramref name="tone"/>'s colour (<paramref name="icon"/>, else the tone's own) before the title, the line
    /// under it, and the ways on from it at its far end, the safe one first. One on an empty page is <see cref="UICard.Centered"/>.
    /// </summary>
    public static SurfaceComponent Outcome(string? icon, UIMessageSeverity tone, string title, string? line, params IVisualComponent[] actions)
        => Outcome(icon, tone, title, line is null ? null : new ParagraphComponent().SetDescription(line), actions);

    /// <summary>
    /// The same with a line of the author's — bound to what the controller says, the address a mail went to — given the note's role
    /// here.
    /// </summary>
    public static SurfaceComponent Outcome(string? icon, UIMessageSeverity tone, string title, ParagraphComponent? line, params IVisualComponent[] actions)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentNullException.ThrowIfNull(actions);

        if (icon is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        StackPanelComponent content = UILayout.Stack(16, new TextComponent()
            .SetIcon(icon ?? UIMessage.GlyphOf(tone))
            .SetIconColor(UIThemeColor.FromStyle(UIMessage.ColorOf(tone)))
            .SetTitle(title)
            .AsTitle()
            .SetTitleWrap(true)
        );

        if (line is not null)
            _ = content.AddChild(line.SetDescriptionType(UITextAppearance.Caption).Muted());

        if (actions.Length > 0)
        {
            // A form's foot, as UIButtons.Pair lays it: at the far edge, the last wrapping under the rest there on a phone.
            _ = content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetHorizontalAlignment(UIAlignment.End)
                .SetSpacing(8)
                .SetWrap(true)
                .AddChildren(actions)
            );
        }

        // Read out as it replaces the form, as a message shown later is.
        return new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Raised)
            .SetPadding(UIThickness.Uniform(24))
            .SetLiveRegion(tone is UIMessageSeverity.Warning or UIMessageSeverity.Danger ? UILiveRegion.Alert : UILiveRegion.Status)
            .SetContent(content);
    }

    /// <summary>
    /// A band across the content in the brand's faint tint, 16 px in and 12 down — the filters over a list, the question at an
    /// article's foot: one row of controls or words set apart from the page around it.
    /// </summary>
    public static SurfaceComponent Band(IVisualComponent content)
    {
        ArgumentNullException.ThrowIfNull(content);

        return new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Tinted)
            .SetPadding(UIThickness.All(16, 12, 16, 12))
            .SetContent(content);
    }

    /// <summary>
    /// The content kept to a column of <paramref name="width"/> from the content's edge, however wide the page: an article, a settings
    /// page, a form beside its summary.
    /// </summary>
    public static StackPanelComponent Column(UIColumnWidth width, IVisualComponent content)
    {
        ArgumentNullException.ThrowIfNull(content);

        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetMaxWidth(UILayoutLength.Absolute(Pixels(width)))
            .AddChild(content);
    }

    /// <summary>A column's width in pixels: a form's, a text's, a page that should not run to a wide screen's edges.</summary>
    internal static double Pixels(UIColumnWidth width) => width switch
    {
        UIColumnWidth.Reading => 720,
        UIColumnWidth.Form => 440,
        UIColumnWidth.Wide => 1080,
        _ => throw new ArgumentOutOfRangeException(nameof(width), width, "A column is one of the widths UIColumnWidth names.")
    };
}
