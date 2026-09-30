using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.Text;

/// <summary>
/// The component every other text-bearing control is made of, seen where it actually appears.
/// </summary>
/// <remarks>The same body rendered as somebody else's header, label or caption, plus the cases the two alignments disagree about.</remarks>
internal sealed class TextExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string Description = "Adds a second step when signing in from a new device.";

    /// <summary>A description too long for one line of a narrow column, so where it wraps and where it is cut shows.</summary>
    private const string LongDescription = "A blind priestess. She does not see faces, but she hears a lie before it is finished, and the city's guilds pay her to sit in on every contract.";

    public static string ViewKey => "demo.contents.text.examples";

    protected override string ComponentRoute => "/contents/text";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.text.header";
    protected override string HeaderDescription => "demo.contents.text.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        // Not every other one: the six hosts are most of a page by themselves, and they take the full width.
        _ = container.AddChild(CreateHostsGroup());

        _ = container.AddChildren(DemoUI.CreateColumns([CreateSwappedRolesGroup(), CreateAlignmentEdgesGroup(), CreateLongTextGroup()], [CreatePictureIconGroup(), CreateFoldGroup()]));
    }

    /// <summary>
    /// The same four properties set six times: on the text alone, and on five components that each own a text body inside.
    /// </summary>
    private static ContainerComponent CreateHostsGroup()
    {
        return DemoUI.CreateExample("The same body, worn by five controls",
            // Across rather than down: six hosts in a column is a page of its own, and the point is that they match.
            UILayout.Row(24)
                // Wide enough that a header does not ellipsise, which would read as a difference between hosts.
                .AddChild(UIPage.Labelled("On its own", new TextComponent()
                        .SetIcon(DemoIcons.Shield)
                        .SetTitle("Two-factor authentication")
                        .SetDescription(Description)
                        .SetBadgeText("Recommended")
                        .SetBadgeStyle(UIBadgeType.Info)
                    )
                    .SetWidth(UILayoutLength.Absolute(590))
                )
                .AddChild(UIPage.Labelled("As a card's header", new CardComponent()
                        .ConfigureDefaultHeader(header => header
                            .SetIcon(DemoIcons.Shield)
                            .SetTitle("Two-factor authentication")
                            .SetDescription(Description)
                            .SetBadgeText("Recommended")
                            .SetBadgeStyle(UIBadgeType.Info)
                        )
                        .SetContent(UIText.Note("The card gives it a band and a rule; the body inside is unchanged."))
                    )
                    .SetWidth(UILayoutLength.Absolute(590))
                )
                .AddChild(UIPage.Labelled("As an expander's header", new ExpanderComponent()
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
                    .SetWidth(UILayoutLength.Absolute(590))
                )
                .AddChild(UIPage.Labelled("As a button's label", new ButtonComponent()
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
                    )
                    .SetWidth(UILayoutLength.Absolute(590))
                )
                .AddChild(UIPage.Labelled("As a row that points somewhere", new ActionComponent()
                        .SetIcon(DemoIcons.Shield)
                        .SetTitle("Two-factor authentication")
                        .SetDescription(Description)
                        .SetBadgeText("Recommended")
                        .SetBadgeStyle(UIBadgeType.Info)
                    )
                    .SetWidth(UILayoutLength.Absolute(590))
                )
                // The one host that does not carry the whole body: a field's caption has no description.
                .AddChild(UIPage.Labelled("As an input's caption — no description", new TextInputComponent()
                        .SetIcon(DemoIcons.Shield)
                        .SetTitle("Two-factor authentication")
                        .SetBadgeText("Recommended")
                        .SetBadgeStyle(UIBadgeType.Info)
                        .SetValue("robin@orvane.example")
                    )
                    .SetWidth(UILayoutLength.Absolute(590))
                ),
            columns: 24,
            note: "One body, one set of four properties, six hosts: what differs between the tiles belongs to the host, never to the text."
        );
    }

    /// <summary>
    /// The two slots are two positions, not two importances: an Overline title over a Subtitle description
    /// lets the category lead while the name carries the weight.
    /// </summary>
    /// <remarks>The icon goes to <c>Content</c> alignment, since Title alignment would pin it to the small line.</remarks>
    private static ContainerComponent CreateSwappedRolesGroup()
    {
        return DemoUI.CreateExample("When the small line comes first",
            UILayout.Row(16)
                .AddChild(new CardComponent()
                    .SetWidth(UILayoutLength.Absolute(260))
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
                    )
                )
                .AddChild(new CardComponent()
                    .SetWidth(UILayoutLength.Absolute(260))
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
        );
    }

    /// <summary>
    /// The two alignments where the answer is not obvious: no title, one line, and an inline badge.
    /// </summary>
    private static ContainerComponent CreateAlignmentEdgesGroup()
    {
        // One to a line at the group's width: a fixed width cut the lines short with the column's room to spare.
        return DemoUI.CreateExample("Alignment, where it is not obvious",
            UILayout.Stack(16)
                .AddChild(new TextComponent()
                    .SetIcon(DemoIcons.Shield)
                    .SetIconAlignment(UITextIconAlignment.Title)
                    .SetDescription("Icon Title, no title — the glyph stands on this line.")
                )
                .AddChild(new TextComponent()
                    .SetIcon(DemoIcons.Shield)
                    .SetIconAlignment(UITextIconAlignment.Content)
                    .SetDescription("Icon Content, no title — the glyph centred on the block.")
                )
                .AddChild(new TextComponent()
                    .SetBadgeAlignment(UITextBadgeAlignment.Title)
                    .SetBadgePlacement(UITextBadgePlacement.Trailing)
                    .SetBadgeText("Review")
                    .SetBadgeStyle(UIBadgeType.Warning)
                    .SetTitle("Badge Title, one line")
                )
                .AddChild(new TextComponent()
                    .SetBadgeAlignment(UITextBadgeAlignment.Content)
                    .SetBadgePlacement(UITextBadgePlacement.Trailing)
                    .SetBadgeText("Review")
                    .SetBadgeStyle(UIBadgeType.Warning)
                    .SetTitle("Badge Content, one line")
                )
        );
    }

    /// <summary>
    /// A long line in a narrow column: a text keeps its description to one line unless asked to wrap, and its title unless asked to run
    /// on; a card's and an expander's header are prose and wrap by themselves.
    /// </summary>
    private static ContainerComponent CreateLongTextGroup()
    {
        return DemoUI.CreateExample("Long text in a narrow column",
            UILayout.Stack(16)
                .SetWidth(UILayoutLength.Absolute(280))
                .AddChild(UIPage.Labelled("A text, as it comes", new TextComponent()
                        .SetTitle("Sister Ilse of the Lantern Quarter")
                        .SetDescription(LongDescription)
                    )
                )
                .AddChild(UIPage.Labelled("SetWrapMode(Wrap)", new TextComponent()
                        .SetTitle("Sister Ilse of the Lantern Quarter")
                        .SetDescription(LongDescription)
                        .SetWrapMode(UITextWrapMode.Wrap)
                    )
                )
                .AddChild(UIPage.Labelled("SetTitleWrap(true)", new TextComponent()
                        .SetTitle("Sister Ilse of the Lantern Quarter, keeper of the Hall of Oaths")
                        .SetTitleWrap(true)
                        .SetDescription(LongDescription)
                        .SetWrapMode(UITextWrapMode.Wrap)
                    )
                )
                .AddChild(UIPage.Labelled("A card's header", new CardComponent()
                        .ConfigureDefaultHeader(header => header
                            .SetTitle("Sister Ilse")
                            .SetDescription(LongDescription)
                        )
                        .SetContent(UIText.Note("The header's description wraps by itself."))
                    )
                )
                .AddChild(UIPage.Labelled("An expander's header", new ExpanderComponent()
                        .SetCollapsed()
                        .ConfigureDefaultHeader(header => header
                            .SetTitle("Sister Ilse")
                            .SetDescription(LongDescription)
                        )
                        .SetContent(UIText.Note("So does this one, beside the chevron."))
                    )
                ),
            note: "A text's description is a label's second line, one line unless SetWrapMode(Wrap) lets it run on; its title runs on only with SetTitleWrap(true). A card's and an expander's header description is prose, and wraps with nothing set. Narrow the window to a phone's width to see the same at the page's own size."
        );
    }

    /// <summary>
    /// The same <c>Icon</c> property carrying a picture instead of a glyph name.
    /// </summary>
    /// <remarks>With no size given, text content draws the picture as a square the height of the block.</remarks>
    private static ContainerComponent CreatePictureIconGroup()
    {
        // One to a line at the group's width: a fixed width cut the lines short with the column's room to spare.
        return DemoUI.CreateExample("An icon that is a picture",
            UILayout.Stack(16)
                .AddChild(new TextComponent()
                    .SetIcon(DemoImages.Avatar)
                    .SetTitle("Robin Hale")
                    .SetDescription("A square photograph, no size given: a tile the block's height.")
                )
                .AddChild(new TextComponent()
                    .SetIcon(DemoImages.SunsetRuins)
                    .SetTitle("A landscape")
                    .SetDescription("Wider than it is tall, in the same square tile.")
                )
                .AddChild(new TextComponent()
                    .SetIcon(DemoImages.Logo)
                    .SetTitle("A size given")
                    .SetDescription("The picture obeys it, like a glyph — no tile, no square.")
                    .SetIconSize(UIIconSize.Medium)
                )
                // A line that is already coloured does not get muted on top: it would fall below contrast.
                .AddChild(new TextComponent()
                    .SetIcon(DemoImages.Mask(DemoImages.Mark))
                    .SetTitle("Tinted picture")
                    .SetDescription("Written mask: — a monochrome SVG follows the text's colour.")
                    .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                    .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.OnSurface))
                )
        );
    }

    /// <summary>
    /// The inline markup's fold in a one-line description: the caption sits in the line, and the text it opens takes a line of its own.
    /// </summary>
    private static ContainerComponent CreateFoldGroup()
    {
        return DemoUI.CreateExample("A line with more behind it",
            new TextComponent()
                .SetWidth(UILayoutLength.Absolute(470))
                .SetIcon(DemoIcons.Shield)
                .SetTitle("Two-factor authentication")
                .SetDescription("Adds a second step when signing in from a new device. [Which devices count?]{A browser that has not signed in "
                    + "for **thirty days**, or any device after the password changes.}")
        );
    }
}
