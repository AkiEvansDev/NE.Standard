using System.Linq;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Paragraph;
using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.Paragraph;

/// <summary>
/// One paragraph and every property that can be bound to it — the text page's surface, plus wrapping; then what a paragraph does
/// that text content does not: run.
/// </summary>
/// <remarks>Which of the two components a piece of writing belongs in, what a clamp is for, and the inline markup.</remarks>
internal sealed class ParagraphView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ContentGroup = nameof(ParagraphController.ContentGroup);
    private const string LayoutGroup = nameof(ParagraphController.LayoutGroup);
    private const string BadgeGroup = nameof(ParagraphController.BadgeGroup);

    private const string LongMarkup = "A longer supporting description, with **emphasis** and [a link](https://docs.orvane.example) in it, long enough to wrap across several lines of a narrow column.";
    private const string LongTitle = "A title long enough to need a second line of its own";

    private static readonly (string Title, string Body)[] FeedEntries =
    [
        ("Provisioner 2.4", "**One-minute servers in Europe North**, a rewritten disk allocator and forty-one fixes. The rollout pauses itself if the error rate doubles in any region, and the thresholds are in [the rollout plan](https://docs.orvane.example/rollout)."),
        ("Provisioner 2.3", "Resizing between plans without a restart, and a snapshot before each."),
        ("Provisioner 2.2", "Server images moved into object storage in every region, which is why a new server now starts from a copy kept next to it instead of one fetched from Europe West — only the first server of an image in a region still waits for it.")
    ];

    public static string ViewKey => "demo.contents.paragraph";

    protected override string ComponentRoute => "/contents/paragraph";
    protected override string Header => "demo.contents.paragraph.header";
    protected override string HeaderDescription => "demo.contents.paragraph.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/article", "demo.nav.screens.article");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(Bind(new ParagraphComponent()).SetPlacement(1, 1, 24, 1)));

    private static ParagraphComponent Bind(ParagraphComponent paragraph)
        => paragraph
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
            .BindTextAlignment($"{LayoutGroup}.{nameof(ParagraphLayoutGroupContext.TextAlignment)}")
            .BindWrapMode($"{LayoutGroup}.{nameof(ParagraphLayoutGroupContext.WrapMode)}")
            .BindMaxLines($"{LayoutGroup}.{nameof(ParagraphLayoutGroupContext.MaxLines)}")
            .BindShowQuoteLine($"{LayoutGroup}.{nameof(ParagraphLayoutGroupContext.ShowQuoteLine)}")
            .BindQuoteLineColor($"{LayoutGroup}.{nameof(ParagraphLayoutGroupContext.QuoteLineColor)}")
            .BindTextSelectable($"{LayoutGroup}.{nameof(ParagraphLayoutGroupContext.TextSelectable)}")
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
            DemoUI.CreateOptionSection(LayoutGroup, "Layout", nameof(ParagraphController.CycleLayoutOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(ParagraphController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(ParagraphController.CycleBadgeOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => [CreateUsesGroup(), CreateQuoteGroup(), CreateClampGroup(), CreateMarkupGroup()];

    /// <summary>
    /// The jobs a paragraph is given — a notice above a form, an empty state, a note beside a setting, a release entry — and the same
    /// words in text content beside it.
    /// </summary>
    /// <remarks>
    /// The pair is what the split is about: only the description wraps, and only text content centres its glyph and badge. The four
    /// stand two to a row, each half the group: a fixed width each left a fourth alone on a row of its own.
    /// </remarks>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateExample("What it is for",
            UILayout.Stack(16,
                // Each one inside the ground it actually has, or four blocks of loose prose read as a rendering fault.
                UILayout.Columns(16,
                    new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Tinted)
                        .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .SetContent(new ParagraphComponent()
                            .SetIcon(DemoIcons.Alert)
                            .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                            .SetTitle("Environment locked")
                            .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                            .SetDescription("Changes are applied through [change requests](https://docs.orvane.example/changes). Ask an **owner** to unlock it if you need to edit anything here directly.")
                            // The sentence keeps its own colour: Muted under a Danger title falls below contrast.
                            .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.OnSurface))
                        ),
                    new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Background)
                        .SetContent(new ParagraphComponent()
                            .SetIcon(DemoIcons.Search)
                            .SetIconColor(UIThemeColor.Muted)
                            .SetTitle("No servers matched")
                            .SetDescription("Try a shorter query, or clear the *region* filter — servers stopped for **thirty days** are archived and hidden by default. [Show archived servers](https://orvane.example/servers?archived=1)")
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                ),
                UILayout.Columns(16,
                    new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Raised)
                        .SetContent(new ParagraphComponent()
                            .SetTitle("Daily backups")
                            .SetBadgeText("Recommended")
                            .SetBadgeStyle(UIBadgeType.Success)
                            .SetDescription("Every server in the account is backed up **once a day**, and each backup is kept for 30 days. Turning this off leaves backups already taken alone — see [the backup policy](https://docs.orvane.example/backups).")
                            .SetDescriptionColor(UIThemeColor.Muted)
                        ),
                    new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Raised)
                        .SetContent(new ParagraphComponent()
                            .SetIcon(DemoIcons.FileText)
                            .SetTitle("Provisioner 2.4")
                            .SetTitleType(UITextAppearance.Subtitle)
                            .SetBadgeText("12 Aug")
                            .SetBadgeStyle(UIBadgeType.Info)
                            .SetDescription("**One-minute servers in Europe North**, a rewritten disk allocator and forty-one fixes. The rollout pauses itself if the error rate doubles in any region — [full changelog](https://docs.orvane.example/releases/provisioner-2.4).")
                        )
                ),
                // A narrow width on each, in its own half: the point is how each answers a column too narrow for the words.
                UILayout.Columns(16,
                    UIPage.Labelled("The same words as text content", new TextComponent()
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle(LongTitle)
                        .SetDescription(LongMarkup)
                        .SetBadgeText("New")
                        .SetBadgeStyle(UIBadgeType.Success)
                        .SetMaxWidth(UILayoutLength.Absolute(290))
                    ),
                    UIPage.Labelled("As a paragraph", new ParagraphComponent()
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle(LongTitle)
                        .SetDescription(LongMarkup)
                        .SetBadgeText("New")
                        .SetBadgeStyle(UIBadgeType.Success)
                        .SetMaxWidth(UILayoutLength.Absolute(290))
                    )
                )
            ),
            columns: 24,
            note: "The last pair is one body in both components: only the paragraph's description runs on, and only text content centres the glyph and the badge on the block."
        );
    }

    /// <summary>
    /// A line beside the description sets it off as a quotation or a note; on a surface it makes a block.
    /// </summary>
    private static ContainerComponent CreateQuoteGroup()
    {
        return DemoUI.CreateExample("Set off by a line",
            UILayout.Columns(16,
                new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Background)
                    .SetContent(new ParagraphComponent()
                        .SetTitle("From the incident review")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetShowQuoteLine(true)
                        .SetDescription("The rollout paused itself at four percent, which is the number we had argued about for a week and never written down. It was right.")
                        .SetDescriptionColor(UIThemeColor.Muted)
                    ),
                new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetContent(new ParagraphComponent()
                        .SetShowQuoteLine(true)
                        .SetQuoteLineColor(UIThemeColor.FromStyle(UIColorStyle.Primary))
                        .SetDescription("A note with no title of its own: the line is what says it stands apart from the prose around it.")
                    ),
                new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Tinted)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Warning))
                    .SetContent(new ParagraphComponent()
                        .SetTitle("Before you continue")
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Warning))
                        .SetShowQuoteLine(true)
                        .SetQuoteLineColor(UIThemeColor.FromStyle(UIColorStyle.Warning))
                        .SetDescription("Deploys to this environment are **frozen** until Monday. The freeze lifts on its own; nobody has to be asked.")
                        .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.OnSurface))
                    )
            ),
            columns: 24
        );
    }

    /// <summary>
    /// What a clamp is for: in a list, one entry with more to say must not push the next one off the screen.
    /// </summary>
    /// <remarks>The two lists in halves of the group, each the width of a feed's column, so the clamp has a column to bite in.</remarks>
    private static ContainerComponent CreateClampGroup()
    {
        return DemoUI.CreateExample("When a run of prose must not push everything down",
            UILayout.Columns(16,
                UIPage.Labelled("Unclamped", UILayout.Stack(10)
                    .SetMaxWidth(UILayoutLength.Absolute(360))
                    .AddChildren(FeedEntries.Select(entry => new ParagraphComponent()
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle(entry.Title)
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription(entry.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    ))
                ),
                UIPage.Labelled("Two lines each", UILayout.Stack(10)
                    .SetMaxWidth(UILayoutLength.Absolute(360))
                    .AddChildren(FeedEntries.Select(entry => new ParagraphComponent()
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle(entry.Title)
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription(entry.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        // MaxLines clamps the wrapping description, an ellipsis on its last line.
                        .SetMaxLines(2)
                    ))
                )
            ),
            columns: 24
        );
    }

    /// <summary>
    /// The inline markup surviving a line break and a clamp; one sample is prose that only looks like markup.
    /// </summary>
    private static ContainerComponent CreateMarkupGroup()
    {
        return DemoUI.CreateExample("Inline markup",
            // Two columns rather than one: seven samples in one column is half a page of prose.
            UILayout.Columns(32,
                UILayout.Stack(24,
                    new ParagraphComponent()
                        .SetTitle("A link that falls across a line break")
                        .SetDescription("The rollout pauses itself if the error rate doubles in any region — the thresholds, and who is paged when one is crossed, are in [the rollout plan](https://docs.orvane.example/rollout)."),
                    new ParagraphComponent()
                        .SetTitle("Emphasis inside a sentence")
                        .SetDescription("**Provisioner 2.4** ships *incremental* resizing. The old __stop and copy__ path still works and is ~~supported~~ scheduled for removal in 2.6."),
                    new ParagraphComponent()
                        .SetTitle("Prose that only looks like markup")
                        .SetDescription(@"Retries are computed as *3 * 4* per region and written to ~~deploy_log~~, and a \* on its own is just an asterisk."),
                    new ParagraphComponent()
                        .SetTitle("Clamped, with markup in the cut part")
                        .SetDescription("**Provisioner 2.4** ships one-minute servers in Europe North, a rewritten disk allocator and forty-one fixes, of which [nine](https://docs.orvane.example/releases/provisioner-2.4) were reported by customers; the rollout pauses itself if the error rate doubles in any region.")
                        .SetMaxLines(2)
                ),
                UILayout.Stack(24,
                    new ParagraphComponent()
                        .SetTitle("A name that is a name, not prose")
                        .SetDescription("`provision.sh` runs on a new server's first boot, so a typo in it fails the provisioning run. The plan is read from `server.json`, and a code run is the one that does not nest — `**this**` stays as typed."),
                    // Built from the constants: a name spelt by hand would be a mark that silently never draws.
                    new ParagraphComponent()
                        .SetTitle("A mark standing in the sentence")
                        .SetDescription($"Green ![{DemoIcons.Check}] means every gate answered, amber ![{DemoIcons.Clock}] means one has not answered yet, "
                            + $"and red ![{DemoIcons.Alert}] means one answered no. A mark is not a word, and it is not read aloud with them: "
                            + @"!\[the bracket escaped] reads as the text it is."
                        ),
                    // A fold's text is markup of its own, folds included; nothing about it reaches the server.
                    new ParagraphComponent()
                        .SetTitle("A run the reader unfolds")
                        .SetDescription("Deploys to this environment are **frozen** until Monday. [Why?]{Europe North is being moved onto new disks after the provisioner "
                            + "rewrite, and the freeze lifts on its own. [What moving means]{Every server is snapshotted and restored onto the new disks by "
                            + "[the provisioner](https://docs.orvane.example/provisioner); nobody has to do anything by hand.} Ask an **owner** if something "
                            + "cannot wait.} Nothing else changes for you."
                        )
                )
            ),
            columns: 24
        );
    }
}
