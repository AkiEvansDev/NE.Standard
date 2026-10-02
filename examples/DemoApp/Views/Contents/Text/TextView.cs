using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Text;
using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.Text;

/// <summary>
/// One text component and every property that can be bound to it; then the component every other text-bearing control is made of,
/// seen where it actually appears.
/// </summary>
/// <remarks>The same body rendered as somebody else's header, label or caption, plus the cases the two alignments disagree about.</remarks>
internal sealed class TextView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ContentGroup = nameof(TextController.ContentGroup);
    private const string LayoutGroup = nameof(TextController.LayoutGroup);
    private const string BadgeGroup = nameof(TextController.BadgeGroup);

    // Short enough that a host at half the page (a row, with its badge and chevron) shows it whole.
    private const string Description = "Asked on a new device.";

    /// <summary>A description too long for one line of a narrow column, so where it wraps and where it is cut shows.</summary>
    private const string LongDescription = "A blind priestess. She does not see faces, but she hears a lie before it is finished, and the city's guilds pay her to sit in on every contract.";

    public static string ViewKey => "demo.contents.text";

    protected override string ComponentRoute => "/contents/text";
    protected override string Header => "demo.contents.text.header";
    protected override string HeaderDescription => "demo.contents.text.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/inbox", "demo.nav.screens.inbox");

    // Neither alignment is bindable, so both are drawn; the pair is set together rather than crossed.
    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(320,
            ("Content — the glyph and the badge stand for the whole block",
                frame => frame.AddChild(Bind(new TextComponent())
                    .SetIconAlignment(UITextIconAlignment.Content)
                    .SetBadgeAlignment(UITextBadgeAlignment.Content)
                    .SetPlacement(1, 1, 24, 1)
                )),
            ("Title — the glyph and the badge mark the title",
                frame => frame.AddChild(Bind(new TextComponent())
                    .SetIconAlignment(UITextIconAlignment.Title)
                    .SetBadgeAlignment(UITextBadgeAlignment.Title)
                    .SetPlacement(1, 1, 24, 1)
                ))
        );

    private static TextComponent Bind(TextComponent text)
        => text
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindIcon($"{ContentGroup}.{nameof(TextContentGroupContext.Icon)}")
            .BindIconColor($"{ContentGroup}.{nameof(TextContentGroupContext.IconColor)}")
            .BindIconSize($"{ContentGroup}.{nameof(TextContentGroupContext.IconSize)}")
            .BindTitle($"{ContentGroup}.{nameof(TextContentGroupContext.Title)}")
            .BindTitleType($"{ContentGroup}.{nameof(TextContentGroupContext.TitleType)}")
            .BindTitleColor($"{ContentGroup}.{nameof(TextContentGroupContext.TitleColor)}")
            .BindTooltip($"{ContentGroup}.{nameof(TextContentGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{ContentGroup}.{nameof(TextContentGroupContext.TooltipPlacement)}")
            .BindDescription($"{ContentGroup}.{nameof(TextContentGroupContext.Description)}")
            .BindDescriptionType($"{ContentGroup}.{nameof(TextContentGroupContext.DescriptionType)}")
            .BindDescriptionColor($"{ContentGroup}.{nameof(TextContentGroupContext.DescriptionColor)}")
            .BindTextAlignment($"{LayoutGroup}.{nameof(TextLayoutGroupContext.TextAlignment)}")
            .BindTextSelectable($"{LayoutGroup}.{nameof(SelectableTextLayoutGroupContext.TextSelectable)}")
            .BindBadgePlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .BindBadgeStyle($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeStyle)}")
            .BindBadgeColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .BindBadgeIcon($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .BindBadgeIconColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .BindBadgeIconSize($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .BindBadgeText($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeText)}")
            .BindBadgeTextType($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTextType)}")
            .BindBadgeTooltip($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .BindBadgeTooltipPlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}");

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(LayoutGroup, "Layout", nameof(TextController.CycleLayoutOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(TextController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(TextController.CycleBadgeOption))
        );

    // Every group across the page, its samples side by side inside it: no half-page column stands beside a taller one. A picture as the
    // icon is the Icon page's, which shows it on a text body too.
    protected override IVisualComponent[] CreateExamples()
        => [CreateHostsGroup(), CreatePartsGroup(), CreateLongTextGroup(), CreateFoldGroup()];

    /// <summary>
    /// The same four properties set six times: on the text alone, and on five components that each own a text body inside.
    /// </summary>
    /// <remarks>
    /// Two columns of three rather than six down: six hosts in a column is a page of its own, and the point is that they match. Halves
    /// only from xl (the split's tier, not the equal columns' md), where a half is wide enough that a header does not ellipsise, which
    /// would read as a difference between hosts.
    /// </remarks>
    private static ContainerComponent CreateHostsGroup()
    {
        return DemoUI.CreateExample("The same body, worn by five controls",
            UILayout.Split(
                UILayout.Stack(24,
                    DemoUI.CreateLabelled("On its own", new TextComponent()
                        .SetIcon(DemoIcons.Shield)
                        .SetTitle("Two-factor authentication")
                        .SetDescription(Description)
                        .SetBadgeText("Recommended")
                        .SetBadgeStyle(UIBadgeType.Info)
                    ),
                    DemoUI.CreateLabelled("As a card's header", new CardComponent()
                        .ConfigureDefaultHeader(header => header
                            .SetIcon(DemoIcons.Shield)
                            .SetTitle("Two-factor authentication")
                            .SetDescription(Description)
                            .SetBadgeText("Recommended")
                            .SetBadgeStyle(UIBadgeType.Info)
                        )
                        .SetContent(UIText.Note("The card gives it a band and a rule; the body inside is unchanged."))
                    ),
                    DemoUI.CreateLabelled("As an expander's header", new ExpanderComponent()
                        .SetCollapsed()
                        .ConfigureDefaultHeader(header => header
                            .SetIcon(DemoIcons.Shield)
                            .SetTitle("Two-factor authentication")
                            .SetDescription(Description)
                            .SetBadgeText("Recommended")
                            .SetBadgeStyle(UIBadgeType.Info)
                        )
                        .SetContent(UIText.Note("And the expander adds a chevron, which is its own and not the text's."))
                    )
                ),
                UILayout.Stack(24,
                    DemoUI.CreateLabelled("As a button's label", new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                        .SetTextAlignment(UITextAlignment.Start)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Shield))
                        .SetTitle("Two-factor authentication")
                        .SetDescription(Description)
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetBadgeText("Recommended")
                        .SetBadgeStyle(UIBadgeType.Info)
                        .SetBadgePlacement(UITextBadgePlacement.Trailing)
                    ),
                    DemoUI.CreateLabelled("As a row that points somewhere", new ActionComponent()
                        .SetIcon(DemoIcons.Shield)
                        .SetTitle("Two-factor authentication")
                        .SetDescription(Description)
                        .SetBadgeText("Recommended")
                        .SetBadgeStyle(UIBadgeType.Info)
                    ),
                    // The one host that does not carry the whole body: a field's caption has no description.
                    DemoUI.CreateLabelled("As an input's caption — no description", new TextInputComponent()
                        .SetIcon(DemoIcons.Shield)
                        .SetTitle("Two-factor authentication")
                        .SetBadgeText("Recommended")
                        .SetBadgeStyle(UIBadgeType.Info)
                        .SetValue("robin@orvane.example")
                    )
                ),
                sideSpan: 12
            ),
            columns: 24,
            note: "One body, one set of four properties, six hosts: what differs between the tiles belongs to the host, never to the text."
        );
    }

    /// <summary>
    /// Where the parts go: the two slots are two positions, not two importances, and the two alignments answer differently where the
    /// answer is not obvious — no title, one line, an inline badge.
    /// </summary>
    /// <remarks>
    /// The swapped cards put the icon at <c>Content</c> alignment, since Title alignment would pin it to the small line. The edges
    /// stand one to a line at their half's width: a fixed width cut the lines short with the column's room to spare.
    /// </remarks>
    private static ContainerComponent CreatePartsGroup()
    {
        return DemoUI.CreateExample("Where the parts go",
            UILayout.Columns(24,
                DemoUI.CreateLabelled("The small line first — an Overline title over a Subtitle description", UILayout.Row(16,
                        new CardComponent()
                            .SetWidth(UILayoutLength.Absolute(220))
                            .ConfigureDefaultHeader(header => header
                                .SetIcon(DemoImages.Logo)
                                .SetIconAlignment(UITextIconAlignment.Content)
                                .SetTitle("Managed databases")
                                .SetTitleType(UITextAppearance.Overline)
                                .SetTitleColor(UIThemeColor.Muted)
                                .SetDescription("PostgreSQL")
                                .SetDescriptionType(UITextAppearance.Subtitle)
                                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.OnSurface))
                            )
                            .SetContent(new ParagraphComponent()
                                .SetDescription("A database we keep patched and back up for you, nightly.")
                                .SetDescriptionType(UITextAppearance.Caption)
                                .SetDescriptionColor(UIThemeColor.Muted)
                            ),
                        new CardComponent()
                            .SetWidth(UILayoutLength.Absolute(220))
                            .ConfigureDefaultHeader(header => header
                                .SetIcon(DemoIcons.Shield)
                                .SetIconAlignment(UITextIconAlignment.Content)
                                .SetTitle("Beta")
                                .SetTitleType(UITextAppearance.Overline)
                                .SetTitleColor(UIThemeColor.Muted)
                                .SetDescription("Object storage")
                                .SetDescriptionType(UITextAppearance.Subtitle)
                                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.OnSurface))
                            )
                            .SetContent(new ParagraphComponent()
                                .SetDescription("Buckets for backups and files, in Europe North first.")
                                .SetDescriptionType(UITextAppearance.Caption)
                                .SetDescriptionColor(UIThemeColor.Muted)
                            )
                    )
                ),
                DemoUI.CreateLabelled("The alignments, where the answer is not obvious", UILayout.Stack(16,
                        new TextComponent()
                            .SetIcon(DemoIcons.Shield)
                            .SetIconAlignment(UITextIconAlignment.Title)
                            .SetDescription("Icon Title, no title — the glyph stands on this line."),
                        new TextComponent()
                            .SetIcon(DemoIcons.Shield)
                            .SetIconAlignment(UITextIconAlignment.Content)
                            .SetDescription("Icon Content, no title — the glyph centred on the block."),
                        new TextComponent()
                            .SetBadgeAlignment(UITextBadgeAlignment.Title)
                            .SetBadgePlacement(UITextBadgePlacement.Trailing)
                            .SetBadgeText("Review")
                            .SetBadgeStyle(UIBadgeType.Warning)
                            .SetTitle("Badge Title, one line"),
                        new TextComponent()
                            .SetBadgeAlignment(UITextBadgeAlignment.Content)
                            .SetBadgePlacement(UITextBadgePlacement.Trailing)
                            .SetBadgeText("Review")
                            .SetBadgeStyle(UIBadgeType.Warning)
                            .SetTitle("Badge Content, one line")
                    )
                )
            ),
            columns: 24
        );
    }

    /// <summary>
    /// A long line in a narrow column: a text keeps its description to one line unless asked to wrap, and its title unless asked to run
    /// on; a card's and an expander's header are prose and wrap by themselves.
    /// </summary>
    /// <remarks>Three narrow columns across the group rather than one down half of it: each is the narrow column the group is about.</remarks>
    private static ContainerComponent CreateLongTextGroup()
    {
        return DemoUI.CreateExample("Long text in a narrow column",
            UILayout.Columns(24,
                UILayout.Stack(16,
                    DemoUI.CreateLabelled("A text, as it comes", new TextComponent()
                        .SetTitle("Sister Ilse of the Lantern Quarter")
                        .SetDescription(LongDescription)
                    ),
                    DemoUI.CreateLabelled("SetWrapMode(Wrap)", new TextComponent()
                        .SetTitle("Sister Ilse of the Lantern Quarter")
                        .SetDescription(LongDescription)
                        .SetWrapMode(UITextWrapMode.Wrap)
                    )
                ),
                UILayout.Stack(16,
                    DemoUI.CreateLabelled("SetTitleWrap(true)", new TextComponent()
                        .SetTitle("Sister Ilse of the Lantern Quarter, keeper of the Hall of Oaths")
                        .SetTitleWrap(true)
                        .SetDescription(LongDescription)
                        .SetWrapMode(UITextWrapMode.Wrap)
                    ),
                    DemoUI.CreateLabelled("An expander's header", new ExpanderComponent()
                        .SetCollapsed()
                        .ConfigureDefaultHeader(header => header
                            .SetTitle("Sister Ilse")
                            .SetDescription(LongDescription)
                        )
                        .SetContent(UIText.Note("The header's description wraps by itself, beside the chevron."))
                    )
                ),
                DemoUI.CreateLabelled("A card's header", new CardComponent()
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Sister Ilse")
                        .SetDescription(LongDescription)
                    )
                    .SetContent(UIText.Note("The header's description wraps by itself."))
                )
            ),
            columns: 24,
            note: "A text's description is a label's second line, one line unless SetWrapMode(Wrap) lets it run on; its title runs on only with SetTitleWrap(true). A card's and an expander's header description is prose, and wraps with nothing set. Narrow the window to a phone's width to see the same at the page's own size."
        );
    }

    /// <summary>
    /// The inline markup's fold in a one-line description: the caption sits in the line, and the text it opens takes a line of its own.
    /// </summary>
    private static ContainerComponent CreateFoldGroup()
    {
        return DemoUI.CreateExample("A line with more behind it",
            new TextComponent()
                .SetMaxWidth(UILayoutLength.Absolute(470))
                .SetIcon(DemoIcons.Shield)
                .SetTitle("Two-factor authentication")
                .SetDescription("Adds a second step when signing in from a new device. [Which devices count?]{A browser that has not signed in "
                    + "for **thirty days**, or any device after the password changes.}"),
            columns: 24
        );
    }
}
