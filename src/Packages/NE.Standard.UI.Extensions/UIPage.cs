using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Localization;
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
    public static ContainerComponent Header(UIPhrase title, UIPhrase? description = null, params IVisualComponent[] trailing)
    {
        PresetWords.Require(title);
        PresetWords.RequireIfGiven(description);

        return Header(null, new BandWords(title, description, null, null), trailing);
    }

    /// <summary>
    /// The same band led by an action before the name — <c>UIIconButtons.Back()</c> to where the page was reached from — on the name's
    /// row at every width, the name and the line starting after it and the action's glyph on the content's edge. On a phone it follows
    /// the shell's drawer toggle, where the view has one.
    /// </summary>
    public static ContainerComponent Header(IVisualComponent leading, UIPhrase title, UIPhrase? description = null, params IVisualComponent[] trailing)
    {
        ArgumentNullException.ThrowIfNull(leading);
        PresetWords.Require(title);
        PresetWords.RequireIfGiven(description);

        return Header(leading, new BandWords(title, description, null, null), trailing);
    }

    /// <summary>The band, its name and line written out or bound at the paths <paramref name="words"/> holds.</summary>
    private static ContainerComponent Header(IVisualComponent? leading, BandWords words, IVisualComponent[] trailing)
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

        // The content's 24 px edge, on which an action at either end stands its glyph (GlyphEdge); the shell's drawer toggle band
        // replaces the start padding with its own step.
        ContainerComponent header = new ContainerComponent()
            // The name's line on the shell's drawer toggle's middle: 10 on a phone (the toggle 12 down and 36 tall), 20 from md (the
            // toggle 22 down, side-drawers.less).
            .SetPadding(UIResponsive<UIThickness>.Create(UIThickness.All(24, 10, 16, 4), md: UIThickness.All(24, 20, 24, 4)));

        // First in the band's order, as it stands, so the keyboard reaches it before the far end; at the row's top, level with the far
        // end and, on a phone, with the drawer toggle. From md the name stands as far after it as the glyph inside it. The cell is shown
        // as the action is, so an action shown only on a phone takes its gap with it and leaves the name on the content's edge.
        if (leading is not null)
        {
            StackPanelComponent cell = new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetGlyphEdge(UIAlignment.Start)
                .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.All(0, 0, 4, 0), md: UIThickness.All(0, 0, LeadingGlyphInset, 0)))
                .SetVerticalAlignment(UIAlignment.Start)
                .AddChild(leading)
                .SetPlacement(1, 1, 1, 1);

            _ = header.SetColumn(1, UIGridUnit.Auto()).AddChild(UILayout.FollowVisibility(cell, leading));
        }

        // On a phone a name too long for its row wraps under itself rather than losing its end, its first line level with the far
        // end, which stands at the row's top: the stylesheet stands that line on a control's middle, whatever line the theme gives the
        // title (an inset written here as a number moved with it). A wrapped display name would push the page down, so it wraps at a
        // title's size.
        _ = header
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetFirstLineOnControl(UIButtonSize.Medium)
                .SetVerticalAlignment(UIAlignment.Start)
                .SetVisibility(phone)
                .SetPlacement(first, 1, actionsUnder ? 25 - first : span, 1)
                .AddChild(HeaderTitle(words).AsTitle().SetTitleWrap(true))
            )
            .AddChild(HeaderTitle(words)
                .AsDisplay()
                .SetVerticalAlignment(UIAlignment.Center)
                .SetVisibility(wide)
                .SetPlacement(first, 1, span, 1)
            );

        // A paragraph rather than a text, which has no cap on its lines. On a phone it runs under the far end too, its whole words a
        // long press away (its tooltip), since the one line cuts them; under the name, never under the leading action.
        if (words.HasLine)
        {
            ParagraphComponent line = HeaderLine(words, 1, phone);

            _ = header
                .AddChild((words.LinePath is null ? line.SetTooltip(words.Line) : line.BindTooltip(words.LinePath, words.Scope).SetTooltipPlain(true).AsContent(ITooltipComponent.TooltipProperty)).SetPlacement(first, 2, 25 - first, 1))
                .AddChild(HeaderLine(words, 3, wide).SetPlacement(first, 2, span, 1));
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
                .SetGlyphEdge(UIAlignment.End)
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
        => button.Title is not null || PresetBindings.Binds(button, ITextBaseComponent.TitleProperty);

    // Half of an icon button's 40 px less its 18 px glyph: from md, the name's gap after the leading action's glyph.
    private const double LeadingGlyphInset = 11;

    /// <summary>The page's name in the background's ink, written out or bound.</summary>
    private static TextComponent HeaderTitle(BandWords words)
    {
        TextComponent text = new TextComponent().SetTitleColor(UIThemeColor.OnBackground);

        // A bound name is the thing's own (a note's, a person's), never a key that happens to match it.
        return words.TitlePath is null ? text.SetTitle(words.Title) : text.BindTitle(words.TitlePath, words.Scope).AsContent(ITextBaseComponent.TitleProperty);
    }

    /// <summary>The muted line under the name, at most <paramref name="lines"/> lines, where <paramref name="visibility"/> shows it.</summary>
    private static ParagraphComponent HeaderLine(BandWords words, int lines, UIResponsive<UIVisibility> visibility)
    {
        ParagraphComponent line = new ParagraphComponent()
            .SetMaxLines(lines)
            .SetDescriptionType(UITextAppearance.Body)
            .SetDescriptionColor(UIThemeColor.Muted)
            .SetVisibility(visibility);

        // A bound line is the thing's own too (a note's status), as its name is: data, drawn as written rather than read as markup.
        return words.LinePath is null ? line.SetDescription(words.Line) : line.BindDescription(words.LinePath, words.Scope).SetDescriptionPlain(true).AsContent(ITextComponent.DescriptionProperty);
    }

    /// <summary>
    /// The band with a name and a line the controller holds — a note's name, its status — bound at <paramref name="titlePath"/> and
    /// <paramref name="descriptionPath"/> as the thing's own words, drawn as written, led by <paramref name="leading"/> where one is
    /// given.
    /// </summary>
    public static ContainerComponent BoundHeader(IVisualComponent? leading, string titlePath, string? descriptionPath = null, params IVisualComponent[] trailing)
        => BoundHeader(leading, titlePath, descriptionPath, UIBindingScope.Root, trailing);

    /// <summary>The same, its paths read in <paramref name="scope"/>: a row's own words in an item template.</summary>
    public static ContainerComponent BoundHeader(IVisualComponent? leading, string titlePath, string? descriptionPath, UIBindingScope scope, params IVisualComponent[] trailing)
        => Header(leading, BandWords.Bound(titlePath, descriptionPath, scope), trailing);

    /// <summary>
    /// The band at <paramref name="size"/>: <see cref="UIHeaderSize.Page"/> is <see cref="Header(IVisualComponent, UIPhrase, UIPhrase, IVisualComponent[])"/>'s;
    /// <see cref="UIHeaderSize.Pane"/> is the title row of a pane beside a list or a tree — a conversation's, an open note's — at every
    /// width: the name one line in the subtitle role, cut with its whole words as its tooltip, the description a muted caption beside
    /// it (a status: "Not saved"), the far end on the same row, and no edge of its own, the pane's padding being it. A
    /// <paramref name="leading"/> action (<c>UIIconButtons.Back().ShownBelow(UIResponsiveTier.Md)</c>, an avatar, both in a row)
    /// stands before the name. <see cref="UIHeaderSize.Strip"/> is a panel's caption over the list or the tree in it — an explorer's
    /// "Files": the name in the label role, set in by a list row's 8 px so it stands over a list's words and a tree's chevrons, the far end on its row; its buttons with no size said are small.
    /// </summary>
    public static ContainerComponent Header(UIHeaderSize size, IVisualComponent? leading, UIPhrase title, UIPhrase? description = null, params IVisualComponent[] trailing)
    {
        PresetWords.Require(title);
        PresetWords.RequireIfGiven(description);

        BandWords words = new(title, description, null, null);

        return size == UIHeaderSize.Page ? Header(leading, words, trailing) : PaneHeader(leading, words, size == UIHeaderSize.Strip, trailing);
    }

    /// <summary>The pane's title row, or a panel's caption where <paramref name="strip"/>, its name and caption written out or bound.</summary>
    private static ContainerComponent PaneHeader(IVisualComponent? leading, BandWords words, bool strip, IVisualComponent[] trailing)
    {
        ArgumentNullException.ThrowIfNull(trailing);

        // The leading action and the far end as wide as they are, the name and its caption in the star columns between: the grid
        // gives the auto columns their whole width before the stars get any, so on a phone the name gives way — cut, its whole words
        // the tooltip — and never the last icon. Side by side in auto columns, the name took an equal share and clipped it.
        ContainerComponent header = new ContainerComponent()
            .SetColumn(PaneLeadingColumn, UIGridUnit.Auto())
            .SetColumn(24, UIGridUnit.Auto());

        // A list row's own inset: the caption stands over a list's words, and over a tree's chevrons, as an explorer's does.
        if (strip)
        {
            _ = header.SetPadding(UIThickness.All(StripInset, 0, 0, 0));
            SmallStripButtons(leading);

            foreach (IVisualComponent component in trailing)
                SmallStripButtons(component);
        }

        if (leading is not null)
            _ = header.AddChild(PaneLeading(leading));

        _ = header.AddChild(PaneWords(words, strip).SetPlacement(2, 1, 22, 1));

        if (trailing.Length == 0)
            return header;

        return header.AddChild(new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetGlyphEdge(UIAlignment.End)
            .SetSpacing(4)
            .SetMargin(UIThickness.All(12, 0, 0, 0))
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChildren(trailing)
            .SetPlacement(24, 1, 1, 1)
        );
    }

    /// <summary>
    /// A strip's buttons with no size said are small, a tree row's height — an icon button, a menu button, a switcher, one with words,
    /// and those in a row. A medium one hangs past the content's edge (#214) by more than a panel's 8 px padding and the 6 px a
    /// clipping layout leaves, so its wash and keyboard frame were cut; a small icon hangs 6, small words 8.
    /// </summary>
    private static void SmallStripButtons(IVisualComponent? component)
    {
        switch (component)
        {
            case ButtonComponent { Size: null } button:
                _ = button.SetSize(UIButtonSize.Small);
                break;
            case SplitButtonComponent { Size: null } menu:
                _ = menu.SetSize(UIButtonSize.Small);
                break;
            case ThemeSwitcherComponent { Size: null } theme:
                _ = theme.SetSize(UIButtonSize.Small);
                break;
            case LanguageSwitcherComponent { Size: null } language:
                _ = language.SetSize(UIButtonSize.Small);
                break;
            // A row at any width: one turning across at md holds the strip's buttons there too.
            case StackPanelComponent row when RunsAcrossAnywhere(row):
                foreach (IVisualComponent child in row.Children)
                    SmallStripButtons(child);

                break;
            default:
                break;
        }
    }

    private static bool RunsAcrossAnywhere(StackPanelComponent panel)
    {
        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (panel.Orientation?.Resolve(tier) == UIOrientation.Horizontal)
                return true;
        }

        return false;
    }

    /// <summary>
    /// The name and its caption, each as wide as it is, so a short name keeps its caption beside it rather than across the row;
    /// neither has a floor, so a long one is cut rather than pushing past its room.
    /// </summary>
    private static ContainerComponent PaneWords(BandWords words, bool strip)
    {
        ContainerComponent row = new ContainerComponent()
            .SetColumn(1, UIGridUnit.Auto(min: 0))
            .SetColumn(2, UIGridUnit.Auto(min: 0))
            .SetVerticalAlignment(UIAlignment.Center);

        TextComponent name = new TextComponent()
            .SetVerticalAlignment(UIAlignment.Center)
            .SetPlacement(1, 1, 1, 1);

        _ = strip ? name.AsOverline().Muted() : name.AsSubtitle().SetTitleColor(UIThemeColor.OnBackground);

        // A bound name is the thing's own (a person's, a note's), never a key that happens to match it.
        _ = row.AddChild(words.TitlePath is null
            ? name.SetTitle(words.Title).SetTooltip(words.Title)
            : name.BindTitle(words.TitlePath, words.Scope).BindTooltip(words.TitlePath, words.Scope).SetTooltipPlain(true).AsContent(ITextBaseComponent.TitleProperty, ITooltipComponent.TooltipProperty)
        );

        if (!words.HasLine)
            return row;

        TextComponent caption = new TextComponent()
            .AsCaption()
            .Muted()
            .SetMargin(UIThickness.All(8, 0, 0, 0))
            .SetVerticalAlignment(UIAlignment.Center)
            .SetPlacement(2, 1, 1, 1);

        return row.AddChild(words.LinePath is null ? caption.SetTitle(words.Line) : caption.BindTitle(words.LinePath, words.Scope).AsContent(ITextBaseComponent.TitleProperty));
    }

    /// <summary>
    /// The leading action's cell, the 8 px before the name its own. It is shown as the action is — <c>Back().ShownBelow(Md)</c>,
    /// a bound visibility — so where the action is hidden its gap goes with it and the name stands on the pane's edge.
    /// </summary>
    private static StackPanelComponent PaneLeading(IVisualComponent leading)
    {
        StackPanelComponent cell = new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetGlyphEdge(UIAlignment.Start)
            .SetMargin(UIThickness.All(0, 0, 8, 0))
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChild(leading)
            .SetPlacement(PaneLeadingColumn, 1, 1, 1);

        return UILayout.FollowVisibility(cell, leading);
    }

    private const int PaneLeadingColumn = 1;

    // A list row's inset; over a tree the caption stands on the chevrons, not the words after them.
    private const double StripInset = 8;

    /// <summary>
    /// The band at <paramref name="size"/>, its name and line the controller holds, bound at <paramref name="titlePath"/> and
    /// <paramref name="descriptionPath"/>: on a pane or a strip, the name bound as the thing's own words and the line as a caption
    /// beside it.
    /// </summary>
    public static ContainerComponent BoundHeader(UIHeaderSize size, IVisualComponent? leading, string titlePath, string? descriptionPath = null, params IVisualComponent[] trailing)
        => BoundHeader(size, leading, titlePath, descriptionPath, UIBindingScope.Root, trailing);

    /// <summary>The same, its paths read in <paramref name="scope"/>: a row's own words in an item template.</summary>
    public static ContainerComponent BoundHeader(UIHeaderSize size, IVisualComponent? leading, string titlePath, string? descriptionPath, UIBindingScope scope, params IVisualComponent[] trailing)
    {
        BandWords words = BandWords.Bound(titlePath, descriptionPath, scope);

        return size == UIHeaderSize.Page ? Header(leading, words, trailing) : PaneHeader(leading, words, size == UIHeaderSize.Strip, trailing);
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
    public static StackPanelComponent Section(UIPhrase title, UIPhrase? description, params IVisualComponent[] content)
    {
        PresetWords.Require(title);
        PresetWords.RequireIfGiven(description);

        return Section(HeadingWords(UIText.Title(title), description is null ? null : UIText.Note(description)), content);
    }

    /// <summary>The same under a heading of the author's: <see cref="Heading(UIPhrase, UIPhrase, IVisualComponent[])"/>, with things at its far end.</summary>
    public static StackPanelComponent Section(IVisualComponent heading, params IVisualComponent[] content)
    {
        ArgumentNullException.ThrowIfNull(heading);
        ArgumentNullException.ThrowIfNull(content);

        return UILayout.Stack(16).AddChild(heading).AddChildren(content);
    }

    /// <summary>The same with a title and a line the controller holds at <paramref name="titlePath"/> and <paramref name="descriptionPath"/>, as content.</summary>
    public static StackPanelComponent BoundSection(string titlePath, string? descriptionPath, params IVisualComponent[] content)
        => BoundSection(titlePath, descriptionPath, UIBindingScope.Root, content);

    /// <summary>The same, its paths read in <paramref name="scope"/>: a row's own words in an item template.</summary>
    public static StackPanelComponent BoundSection(string titlePath, string? descriptionPath, UIBindingScope scope, params IVisualComponent[] content)
    {
        (TextComponent title, ParagraphComponent? note) = BoundHeadingWords(titlePath, descriptionPath, scope);

        return Section(HeadingWords(title, note), content);
    }

    /// <summary>The title over its muted line, a section's heading.</summary>
    private static StackPanelComponent HeadingWords(TextComponent title, ParagraphComponent? note)
    {
        // The heading and its note sit closer to each other than to the content: two stacks, not one spacing. A heading is prose, so on
        // a phone a long one wraps rather than losing its end.
        StackPanelComponent heading = UILayout.Stack(4).AddChild(title.SetTitleWrap(true));

        return note is null ? heading : heading.AddChild(note);
    }

    /// <summary>A section's title and its muted line bound at the paths given, both the controller's own words, drawn as written.</summary>
    private static (TextComponent Title, ParagraphComponent? Note) BoundHeadingWords(string titlePath, string? descriptionPath, UIBindingScope scope)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);

        TextComponent title = new TextComponent().AsTitle().BindTitle(titlePath, scope).AsContent(ITextBaseComponent.TitleProperty);

        if (descriptionPath is null)
            return (title, null);

        ArgumentException.ThrowIfNullOrWhiteSpace(descriptionPath);

        return (title, new ParagraphComponent()
            .SetDescriptionType(UITextAppearance.Caption)
            .Muted()
            .BindDescription(descriptionPath, scope)
            .SetDescriptionPlain(true)
            .AsContent(ITextComponent.DescriptionProperty));
    }

    /// <summary>
    /// A section's heading with things at its far end — the source of a sample, the "+" that adds to the list under it — the title
    /// taking the rest of the row and the far end on its line, the muted line under both (<see cref="UILayout.Ends(IVisualComponent, IVisualComponent[])"/>).
    /// </summary>
    public static ContainerComponent Heading(UIPhrase title, UIPhrase? description = null, params IVisualComponent[] trailing)
    {
        PresetWords.Require(title);
        PresetWords.RequireIfGiven(description);

        return Heading(UIText.Title(title), description is null ? null : UIText.Note(description), trailing);
    }

    /// <summary>The same with a heading of the author's — a title with a badge, a person — and the far end centred on it.</summary>
    public static ContainerComponent Heading(IVisualComponent heading, params IVisualComponent[] trailing)
    {
        ArgumentNullException.ThrowIfNull(heading);

        return UILayout.Ends(heading, trailing);
    }

    /// <summary>The same with a title and a line the controller holds at <paramref name="titlePath"/> and <paramref name="descriptionPath"/>, as content.</summary>
    public static ContainerComponent BoundHeading(string titlePath, string? descriptionPath = null, params IVisualComponent[] trailing)
        => BoundHeading(titlePath, descriptionPath, UIBindingScope.Root, trailing);

    /// <summary>The same, its paths read in <paramref name="scope"/>: a row's own words in an item template.</summary>
    public static ContainerComponent BoundHeading(string titlePath, string? descriptionPath, UIBindingScope scope, params IVisualComponent[] trailing)
    {
        (TextComponent title, ParagraphComponent? note) = BoundHeadingWords(titlePath, descriptionPath, scope);

        return Heading(title, note, trailing);
    }

    /// <summary>
    /// The title in the start, its line under the title and the far end both, the far end on the title's first line: centred on the
    /// title and its line together it stood beside the line, and on a wrapped title's lines between them.
    /// </summary>
    private static ContainerComponent Heading(TextComponent title, ParagraphComponent? note, IVisualComponent[] trailing)
    {
        ArgumentNullException.ThrowIfNull(trailing);

        return UILayout.Ends(title.SetTitleWrap(true), note, trailing, titleLine: true);
    }

    /// <summary>
    /// A part of a page or a panel folded under its name, the collapsible sibling of <see cref="Section(UIPhrase, UIPhrase, IVisualComponent[])"/>:
    /// the quiet expander — the name a muted caption with the chevron after it, no card — over the content in a stack. A name the
    /// controller holds is <see cref="BoundFold(string, bool, IVisualComponent[])"/>'s, a null <paramref name="title"/> leaves it to the header;
    /// <c>.BindExpanded(path)</c> follows the controller.
    /// </summary>
    public static ExpanderComponent Fold(UIPhrase? title, bool expanded, params IVisualComponent[] content)
    {
        PresetWords.RequireIfGiven(title);

        return Fold(header =>
        {
            if (title is not null)
                _ = header.SetTitle(title);
        }, expanded, content);
    }

    /// <summary>The same named by words the controller holds at <paramref name="titlePath"/>, as content.</summary>
    public static ExpanderComponent BoundFold(string titlePath, bool expanded, params IVisualComponent[] content)
        => BoundFold(titlePath, UIBindingScope.Root, expanded, content);

    /// <summary>The same, its path read in <paramref name="scope"/>: a row's own words in an item template.</summary>
    public static ExpanderComponent BoundFold(string titlePath, UIBindingScope scope, bool expanded, params IVisualComponent[] content)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);

        return Fold(header => header.BindTitle(titlePath, scope).AsContent(ITextBaseComponent.TitleProperty), expanded, content);
    }

    /// <summary>The quiet expander, its name a caption the words are written into, over the content in a stack.</summary>
    private static ExpanderComponent Fold(Action<ExpanderHeaderRegion> words, bool expanded, IVisualComponent[] content)
    {
        ArgumentNullException.ThrowIfNull(content);

        ExpanderComponent fold = new ExpanderComponent()
            .SetVariant(UIExpanderVariant.Quiet)
            // A caption rather than a title: between two fields or in a narrow panel, a heading would make it a part of its own.
            .ConfigureDefaultHeader(header => words(header.AsCaption()))
            .SetContent(UILayout.Stack(12, content));

        return expanded ? fold.SetExpanded() : fold.SetCollapsed();
    }

    /// <summary>
    /// A thing under its label: the overline over a sample, a value, a control that has no title of its own. The label keeps one line
    /// unless <paramref name="wrap"/>, for a label that is a sentence. Beside captioned fields in a row, the label is the thing's caption.
    /// </summary>
    public static StackPanelComponent Labelled(UIPhrase label, IVisualComponent content, bool wrap = false)
    {
        PresetWords.Require(label);

        return Labelled(UIText.Label(label), content, wrap);
    }

    /// <summary>The same under a label the controller holds at <paramref name="labelPath"/>, as content.</summary>
    public static StackPanelComponent BoundLabelled(string labelPath, IVisualComponent content, bool wrap = false)
        => BoundLabelled(labelPath, UIBindingScope.Root, content, wrap);

    /// <summary>The same with its label bound in <paramref name="scope"/>, a row's own words in an item template.</summary>
    public static StackPanelComponent BoundLabelled(string labelPath, UIBindingScope scope, IVisualComponent content, bool wrap = false)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(labelPath);

        return Labelled(new TextComponent().AsOverline().Muted().BindTitle(labelPath, scope).AsContent(ITextBaseComponent.TitleProperty), content, wrap);
    }

    private static StackPanelComponent Labelled(TextComponent overline, IVisualComponent content, bool wrap)
    {
        ArgumentNullException.ThrowIfNull(content);

        // The label in a field's caption row and the input root's gap after it, so beside captioned fields its content stands level with
        // their boxes whatever lines the theme gives the overline and the caption (FirstChildAsCaption).
        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetVerticalAlignment(UIAlignment.Start)
            .SetFirstChildAsCaption(true)
            .SetSpacing(4)
            .AddChild(wrap ? overline.SetTitleWrap(true) : overline)
            .AddChild(content);
    }

    /// <summary>
    /// Where something would be and nothing is yet — a pane before a row is chosen, a page with nothing made — drawn as a list draws its
    /// own empty state, because it is that state (<see cref="DefaultEmptyTemplate"/>): the icon in the brand's colour where one is given,
    /// the body title in the text's own ink and the muted caption under it, both wrapping; <paramref name="actions"/> (the button that
    /// makes the first one, a link to where they are) in a row under the words, each as wide as it is. The block stands in the middle of
    /// the room it is given, and runs on past its end, not its top, where the room is shorter than it.
    /// </summary>
    public static ContainerComponent Empty(string? icon, UIPhrase title, UIPhrase? line = null, params IVisualComponent[] actions)
    {
        PresetWords.Require(title);
        PresetWords.RequireIfGiven(line);

        DefaultEmptyTemplate words = new DefaultEmptyTemplate().SetTitle(title);

        return Empty(icon, line is null ? words : words.SetDescription(line), actions);
    }

    /// <summary>
    /// The same with a title and a line the controller holds at <paramref name="titlePath"/> and <paramref name="linePath"/>, as content
    /// — what a filter found nothing for, whose chat is empty.
    /// </summary>
    public static ContainerComponent BoundEmpty(string? icon, string titlePath, string? linePath = null, params IVisualComponent[] actions)
        => BoundEmpty(icon, titlePath, linePath, UIBindingScope.Root, actions);

    /// <summary>The same, its paths read in <paramref name="scope"/>: a row's own words in an item template.</summary>
    public static ContainerComponent BoundEmpty(string? icon, string titlePath, string? linePath, UIBindingScope scope, params IVisualComponent[] actions)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);

        DefaultEmptyTemplate words = new DefaultEmptyTemplate().BindTitle(titlePath, scope).AsContent(ITextBaseComponent.TitleProperty);

        if (linePath is null)
            return Empty(icon, words, actions);

        ArgumentException.ThrowIfNullOrWhiteSpace(linePath);

        return Empty(icon, words.BindDescription(linePath, scope).SetDescriptionPlain(true).AsContent(ITextComponent.DescriptionProperty), actions);
    }

    /// <summary>The words with their mark where one is given, the ways on under them, the block in the middle of its room.</summary>
    private static ContainerComponent Empty(string? icon, DefaultEmptyTemplate words, IVisualComponent[] actions)
    {
        ArgumentNullException.ThrowIfNull(actions);

        // Beside a glyph the words keep the start, as the list's own state draws them; with none, they centre as the ways on under them
        // do, one axis for the whole block (a short title left of a longer line stood off its own button).
        if (icon is not null)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(icon);
            _ = words.SetIcon(icon);
        }
        else
        {
            _ = words.SetTextAlignment(UITextAlignment.Center);
        }

        StackPanelComponent block = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .SetHorizontalAlignment(UIAlignment.Center)
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChild(words.SetWrapMode(UITextWrapMode.Wrap));

        // A row centred under the words, each way on as wide as it is: down the block's column a button stretched to the words' width.
        if (actions.Length > 0)
        {
            _ = block.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetHorizontalAlignment(UIAlignment.Center)
                .SetSpacing(8)
                .SetWrap(true)
                .AddChildren(actions)
            );
        }

        // A grid as tall as its room, so the block can stand in the middle of a pane rather than at its top; a room shorter than the
        // block keeps its top in view, the stylesheet's centre being safe (runtime.less).
        return new ContainerComponent()
            .SetHeight(UILayoutLength.Fill())
            .AddChild(block.SetPlacement(1, 1, 24, 1));
    }

    /// <summary>
    /// What came of a press, in place of the form it ends — "Check your inbox", "Thank you": a raised panel
    /// with the mark in <paramref name="tone"/>'s colour (<paramref name="icon"/>, else the tone's own) before the title, the line
    /// under it, and the ways on from it at its far end, the safe one first. One on an empty page is <see cref="UICard.Centered"/>.
    /// </summary>
    public static SurfaceComponent Outcome(string? icon, UIMessageSeverity tone, UIPhrase title, params IVisualComponent[] actions)
    {
        PresetWords.Require(title);

        return Outcome(icon, tone, new TextComponent().SetTitle(title), null, actions);
    }

    /// <summary>The same with a line under the title — where the mail went, what happens next.</summary>
    public static SurfaceComponent Outcome(string? icon, UIMessageSeverity tone, UIPhrase title, UIPhrase? line, params IVisualComponent[] actions)
    {
        PresetWords.Require(title);
        PresetWords.RequireIfGiven(line);

        return Outcome(icon, tone, new TextComponent().SetTitle(title), line is null ? null : new ParagraphComponent().SetDescription(line), actions);
    }

    /// <summary>
    /// The same with a line of the author's — inline links, emphasis — given the note's role here.
    /// </summary>
    public static SurfaceComponent Outcome(string? icon, UIMessageSeverity tone, UIPhrase title, ParagraphComponent? line, params IVisualComponent[] actions)
    {
        PresetWords.Require(title);

        return Outcome(icon, tone, new TextComponent().SetTitle(title), line, actions);
    }

    /// <summary>
    /// The same with a title and a line the controller holds at <paramref name="titlePath"/> and <paramref name="linePath"/> — the
    /// address a mail went to — as content.
    /// </summary>
    public static SurfaceComponent BoundOutcome(string? icon, UIMessageSeverity tone, string titlePath, string? linePath, params IVisualComponent[] actions)
        => BoundOutcome(icon, tone, titlePath, linePath, UIBindingScope.Root, actions);

    /// <summary>The same, its paths read in <paramref name="scope"/>: a row's own words in an item template.</summary>
    public static SurfaceComponent BoundOutcome(string? icon, UIMessageSeverity tone, string titlePath, string? linePath, UIBindingScope scope, params IVisualComponent[] actions)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);

        if (linePath is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(linePath);

        TextComponent title = new TextComponent().BindTitle(titlePath, scope).AsContent(ITextBaseComponent.TitleProperty);
        ParagraphComponent? line = linePath is null ? null : new ParagraphComponent().BindDescription(linePath, scope).SetDescriptionPlain(true).AsContent(ITextComponent.DescriptionProperty);

        return Outcome(icon, tone, title, line, actions);
    }

    /// <summary>The raised panel round the mark and the title, the line in the note's role and the ways on at its far end.</summary>
    private static SurfaceComponent Outcome(string? icon, UIMessageSeverity tone, TextComponent title, ParagraphComponent? line, IVisualComponent[] actions)
    {
        ArgumentNullException.ThrowIfNull(actions);

        if (icon is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        // The line keeps close under the title, as one text's two lines do; the room is between the words and the ways on.
        StackPanelComponent words = UILayout.Stack(8, title
            .SetIcon(icon ?? UIMessage.GlyphOf(tone))
            .SetIconColor(UIThemeColor.FromStyle(UIMessage.ColorOf(tone)))
            .AsTitle()
            .SetTitleWrap(true)
        );

        if (line is not null)
            _ = words.AddChild(line.SetDescriptionType(UITextAppearance.Caption).Muted());

        StackPanelComponent content = UILayout.Stack(16, words);

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
    /// A page's state standing in for all of it — not found, refused, failed — as the framework's own not-found and error pages draw
    /// theirs (<see cref="StatusComponent"/>): the mark on a faint disc in <paramref name="tone"/>'s colour (<paramref name="icon"/>,
    /// else the tone's own), the title, the line under it and the ways on, the safe one first, centred. Words the controller says
    /// are <see cref="BoundStatus(string?, UIMessageSeverity, string, string?, IVisualComponent[])"/>'s; what ends a form, in the form's place, is an <see cref="Outcome(string?, UIMessageSeverity, UIPhrase, UIPhrase, IVisualComponent[])"/>.
    /// </summary>
    public static StatusComponent Status(string? icon, UIMessageSeverity tone, UIPhrase title, UIPhrase? line, params IVisualComponent[] actions)
    {
        PresetWords.Require(title);
        PresetWords.RequireIfGiven(line);

        return WithActions(new StatusComponent(StatusMark(icon, tone), UIMessage.ColorOf(tone), title, line), actions);
    }

    /// <summary>
    /// The same with a title and a line the controller holds at <paramref name="titlePath"/> and <paramref name="linePath"/> — what
    /// was refused, why it failed — as content.
    /// </summary>
    public static StatusComponent BoundStatus(string? icon, UIMessageSeverity tone, string titlePath, string? linePath, params IVisualComponent[] actions)
        => BoundStatus(icon, tone, titlePath, linePath, UIBindingScope.Root, actions);

    /// <summary>The same, its paths read in <paramref name="scope"/>: a row's own words in an item template.</summary>
    public static StatusComponent BoundStatus(string? icon, UIMessageSeverity tone, string titlePath, string? linePath, UIBindingScope scope, params IVisualComponent[] actions)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);

        if (linePath is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(linePath);

        StatusComponent status = new(StatusMark(icon, tone), UIMessage.ColorOf(tone));

        _ = status.Words.BindTitle(titlePath, scope).AsContent(ITextBaseComponent.TitleProperty);

        if (linePath is not null)
            _ = status.Words.BindDescription(linePath, scope).SetDescriptionPlain(true).AsContent(ITextComponent.DescriptionProperty);

        return WithActions(status, actions);
    }

    /// <summary>The status's glyph: the one given, else the tone's own.</summary>
    private static string StatusMark(string? icon, UIMessageSeverity tone)
    {
        if (icon is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        return icon ?? UIMessage.GlyphOf(tone);
    }

    private static StatusComponent WithActions(StatusComponent status, IVisualComponent[] actions)
    {
        ArgumentNullException.ThrowIfNull(actions);

        foreach (IVisualComponent action in actions)
            _ = status.AddAction(action);

        return status;
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
    /// The content kept to a column of <paramref name="width"/>, however wide the page — an article, a settings page, a form beside its
    /// summary — from the content's edge, or in the middle where <paramref name="centered"/>, where a header band over it stands too
    /// (<see cref="InColumn"/>).
    /// </summary>
    public static StackPanelComponent Column(UIColumnWidth width, IVisualComponent content, bool centered = false)
    {
        ArgumentNullException.ThrowIfNull(content);

        StackPanelComponent column = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetMaxWidth(UILayoutLength.Absolute(Pixels(width)))
            .AddChild(content);

        return centered ? Centre(column) : column;
    }

    /// <summary>
    /// A header band over a column of <paramref name="width"/> (<see cref="Column"/> centred): the column's width with the band's own
    /// side padding outside it, in the middle, so the band's words stand over the column's edge at every width.
    /// </summary>
    /// <remarks>
    /// The header region and the content share an axis only where the sides do not stand beside one and not the other (full-height
    /// sides, or no pinned side), and the content region keeps its scrollbar's gutter, which the header does not.
    /// </remarks>
    public static StackPanelComponent InColumn(this ContainerComponent band, UIColumnWidth width)
    {
        ArgumentNullException.ThrowIfNull(band);

        return Centre(Within(band, Pixels(width), UIResponsiveTier.Base));
    }

    /// <summary>
    /// <paramref name="band"/> no wider than <paramref name="pixels"/> and its own side padding at each width from <paramref name="from"/>,
    /// filling what it is given up to that; as wide as it is given below it.
    /// </summary>
    internal static T Within<T>(T band, double pixels, UIResponsiveTier from)
        where T : ContainerComponent<T>, IUIComponentDefinition
    {
        UIResponsive<UIThickness> padding = band.Padding ?? UIThickness.Uniform(0);

        UILayoutLength? At(UIResponsiveTier tier)
        {
            if (tier < from)
                return tier == UIResponsiveTier.Base ? UILayoutLength.Auto() : null;

            // The narrowest tier the width starts at reads the padding in force there; a wider one only where its own is written.
            UIThickness? side = tier == from ? padding.Resolve(tier) : padding.Get(tier);

            return side is UIThickness written ? UILayoutLength.Absolute(pixels + written.Left + written.Right) : null;
        }

        UIResponsive<UILayoutLength> max = new(At(UIResponsiveTier.Base) ?? UILayoutLength.Auto(), At(UIResponsiveTier.Sm), At(UIResponsiveTier.Md), At(UIResponsiveTier.Xl), At(UIResponsiveTier.Xxl));

        return band.SetWidth(UILayoutLength.Fill()).SetMaxWidth(max);
    }

    /// <summary>
    /// <paramref name="column"/> in the middle of a panel as wide as its room: a region's root is a flex column, where a child's own
    /// HorizontalAlignment moves nothing, so the panel round it does the centring.
    /// </summary>
    private static StackPanelComponent Centre<T>(T column)
        where T : VisualComponentBase<T>, IUIComponentDefinition
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .AddChild(column.SetWidth(UILayoutLength.Fill()).SetHorizontalAlignment(UIAlignment.Center));

    /// <summary>A column's width in pixels: a form's, a text's, a page that should not run to a wide screen's edges.</summary>
    internal static double Pixels(UIColumnWidth width) => width switch
    {
        UIColumnWidth.Reading => 720,
        UIColumnWidth.Form => 440,
        UIColumnWidth.Wide => 1080,
        _ => throw new ArgumentOutOfRangeException(nameof(width), width, "A column is one of the widths UIColumnWidth names.")
    };

    /// <summary>The words of a band — its name and line — written out as phrases, or bound at paths as the thing's own words.</summary>
    private readonly record struct BandWords(UIPhrase? Title, UIPhrase? Line, string? TitlePath, string? LinePath, UIBindingScope Scope = UIBindingScope.Root)
    {
        public bool HasLine => Line is not null || LinePath is not null;

        public static BandWords Bound(string titlePath, string? linePath, UIBindingScope scope)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);

            if (linePath is not null)
                ArgumentException.ThrowIfNullOrWhiteSpace(linePath);

            return new BandWords(null, null, titlePath, linePath, scope);
        }
    }
}
