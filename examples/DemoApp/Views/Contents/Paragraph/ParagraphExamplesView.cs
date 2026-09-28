using System.Linq;
using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.Paragraph;

/// <summary>
/// What a paragraph does that text content does not: run.
/// </summary>
/// <remarks>Which of the two components a piece of writing belongs in, what a clamp is for, and the inline markup.</remarks>
internal sealed class ParagraphExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string LongMarkup = "A longer supporting description, with **emphasis** and [a link](https://docs.orvane.example) in it, long enough to wrap across several lines of a narrow column.";
    private const string LongTitle = "A title long enough to need a second line of its own";

    private static readonly (string Title, string Body)[] FeedEntries =
    [
        ("Provisioner 2.4", "**One-minute servers in Europe North**, a rewritten disk allocator and forty-one fixes. The rollout pauses itself if the error rate doubles in any region, and the thresholds are in [the rollout plan](https://docs.orvane.example/rollout)."),
        ("Provisioner 2.3", "Resizing between plans without a restart, and a snapshot before each."),
        ("Provisioner 2.2", "Server images moved into object storage in every region, which is why a new server now starts from a copy kept next to it instead of one fetched from Europe West — only the first server of an image in a region still waits for it.")
    ];

    public static string ViewKey => "demo.contents.paragraph.examples";

    protected override string ComponentRoute => "/contents/paragraph";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.paragraph.header";
    protected override string HeaderDescription => "demo.contents.paragraph.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChild(CreateUsesGroup());
        _ = container.AddChild(CreateQuoteGroup());

        _ = container.AddChildren(DemoUI.CreateColumns([CreateClampGroup()], [CreateAgainstContentGroup()]));

        _ = container.AddChild(CreateMarkupGroup());
    }

    /// <summary>
    /// The jobs a paragraph is given: a notice above a form, an empty state, a note beside a setting, a release entry.
    /// </summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateExample("What it is for",
            // Each one inside the ground it actually has, or four blocks of loose prose read as a rendering fault.
            UILayout.Row(16)
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Tinted)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Danger))
                    .SetWidth(UILayoutLength.Absolute(290))
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetContent(new ParagraphComponent()
                        .SetIcon(DemoIcons.Alert)
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .SetTitle("Environment locked")
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .SetDescription("Changes are applied through [change requests](https://docs.orvane.example/changes). Ask an **owner** to unlock it if you need to edit anything here directly.")
                        // The sentence keeps its own colour: Muted under a Danger title falls below contrast.
                        .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.OnSurface))
                    )
                )
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Background)
                    .SetWidth(UILayoutLength.Absolute(290))
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetContent(new ParagraphComponent()
                        .SetIcon(DemoIcons.Search)
                        .SetIconColor(UIThemeColor.Muted)
                        .SetTitle("No servers matched")
                        .SetDescription("Try a shorter query, or clear the *region* filter — servers stopped for **thirty days** are archived and hidden by default. [Show archived servers](https://orvane.example/servers?archived=1)")
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(290))
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetContent(new ParagraphComponent()
                        .SetTitle("Daily backups")
                        .SetBadgeText("Recommended")
                        .SetBadgeStyle(UIBadgeType.Success)
                        .SetDescription("Every server in the account is backed up **once a day**, and each backup is kept for 30 days. Turning this off leaves backups already taken alone — see [the backup policy](https://docs.orvane.example/backups).")
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(290))
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetContent(new ParagraphComponent()
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle("Provisioner 2.4")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetBadgeText("12 Aug")
                        .SetBadgeStyle(UIBadgeType.Info)
                        .SetDescription("**One-minute servers in Europe North**, a rewritten disk allocator and forty-one fixes. The rollout pauses itself if the error rate doubles in any region — [full changelog](https://docs.orvane.example/releases/provisioner-2.4).")
                    )
                ),
            columns: 24
        );
    }

    /// <summary>
    /// A line beside the description sets it off as a quotation or a note; on a surface it makes a block.
    /// </summary>
    private static ContainerComponent CreateQuoteGroup()
    {
        return DemoUI.CreateExample("Set off by a line",
            UILayout.Row(16)
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Background)
                    .SetWidth(UILayoutLength.Absolute(290))
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetContent(new ParagraphComponent()
                        .SetTitle("From the incident review")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetShowQuoteLine(true)
                        .SetDescription("The rollout paused itself at four percent, which is the number we had argued about for a week and never written down. It was right.")
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(290))
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetContent(new ParagraphComponent()
                        .SetShowQuoteLine(true)
                        .SetQuoteLineColor(UIThemeColor.FromStyle(UIColorStyle.Primary))
                        .SetDescription("A note with no title of its own: the line is what says it stands apart from the prose around it.")
                    )
                )
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Tinted)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Warning))
                    .SetWidth(UILayoutLength.Absolute(290))
                    .SetVerticalAlignment(UIAlignment.Start)
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
    private static ContainerComponent CreateClampGroup()
    {
        return DemoUI.CreateExample("When a run of prose must not push everything down",
            UILayout.Row(16)
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetSpacing(10)
                    .AddChild(new TextComponent()
                        .SetTitle("Unclamped")
                        .SetTitleType(UITextAppearance.Overline)
                        .SetTitleColor(UIThemeColor.Muted)
                    )
                    .AddChildren(FeedEntries.Select(entry => new ParagraphComponent()
                        .SetWidth(UILayoutLength.Absolute(280))
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle(entry.Title)
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription(entry.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    ))
                )
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetSpacing(10)
                    .AddChild(new TextComponent()
                        .SetTitle("Two lines each")
                        .SetTitleType(UITextAppearance.Overline)
                        .SetTitleColor(UIThemeColor.Muted)
                    )
                    .AddChildren(FeedEntries.Select(entry => new ParagraphComponent()
                        .SetWidth(UILayoutLength.Absolute(280))
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle(entry.Title)
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription(entry.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        // MaxLines clamps the wrapping description, an ellipsis on its last line.
                        .SetMaxLines(2)
                    ))
                )
        );
    }

    /// <summary>
    /// The pair the split is about: only the description wraps, and only text content centres its glyph and badge.
    /// </summary>
    private static ContainerComponent CreateAgainstContentGroup()
    {
        return DemoUI.CreateExample("Against text content",
            // A width on the row, so the four wrap two and two and each pair stays side by side.
            UILayout.Row(16)
                .SetWidth(UILayoutLength.Absolute(520))
                .AddChild(UIPage.Labelled("TextComponent", new TextComponent()
                    .SetIcon(DemoIcons.FileText)
                    .SetTitle(LongTitle)
                    .SetDescription(LongMarkup)
                    .SetWidth(UILayoutLength.Absolute(240))
                    )
                )
                .AddChild(UIPage.Labelled("ParagraphComponent", new ParagraphComponent()
                    .SetIcon(DemoIcons.FileText)
                    .SetTitle(LongTitle)
                    .SetDescription(LongMarkup)
                    .SetWidth(UILayoutLength.Absolute(240))
                    )
                )
                .AddChild(UIPage.Labelled("TextComponent, badge and all", new TextComponent()
                    .SetIcon(DemoIcons.FileText)
                    .SetTitle(LongTitle)
                    .SetDescription(LongMarkup)
                    .SetBadgeText("New")
                    .SetBadgeStyle(UIBadgeType.Success)
                    .SetWidth(UILayoutLength.Absolute(240))
                    )
                )
                .AddChild(UIPage.Labelled("ParagraphComponent, badge and all", new ParagraphComponent()
                    .SetIcon(DemoIcons.FileText)
                    .SetTitle(LongTitle)
                    .SetDescription(LongMarkup)
                    .SetBadgeText("New")
                    .SetBadgeStyle(UIBadgeType.Success)
                    .SetWidth(UILayoutLength.Absolute(240))
                    )
                )
        );
    }

    /// <summary>
    /// The inline markup surviving a line break and a clamp; the fifth row is prose that only looks like markup.
    /// </summary>
    private static ContainerComponent CreateMarkupGroup()
    {
        return DemoUI.CreateExample("Inline markup",
            // Across rather than down: seven samples in one column is half a page of prose.
            UILayout.Row(24)
                .AddChild(new ParagraphComponent()
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetWidth(UILayoutLength.Absolute(390))
                    .SetTitle("A link that falls across a line break")
                    .SetDescription("The rollout pauses itself if the error rate doubles in any region — the thresholds, and who is paged when one is crossed, are in [the rollout plan](https://docs.orvane.example/rollout).")
                )
                .AddChild(new ParagraphComponent()
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetWidth(UILayoutLength.Absolute(390))
                    .SetTitle("A name that is a name, not prose")
                    .SetDescription("`provision.sh` runs on a new server's first boot, so a typo in it fails the provisioning run. The plan is read from `server.json`, and a code run is the one that does not nest — `**this**` stays as typed.")
                )
                .AddChild(new ParagraphComponent()
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetWidth(UILayoutLength.Absolute(390))
                    .SetTitle("Emphasis inside a sentence")
                    .SetDescription("**Provisioner 2.4** ships *incremental* resizing. The old __stop and copy__ path still works and is ~~supported~~ scheduled for removal in 2.6.")
                )
                // Built from the constants: a name spelt by hand would be a mark that silently never draws.
                .AddChild(new ParagraphComponent()
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetWidth(UILayoutLength.Absolute(390))
                    .SetTitle("A mark standing in the sentence")
                    .SetDescription($"Green ![{DemoIcons.Check}] means every gate answered, amber ![{DemoIcons.Clock}] means one has not answered yet, "
                        + $"and red ![{DemoIcons.Alert}] means one answered no. A mark is not a word, and it is not read aloud with them: "
                        + @"!\[the bracket escaped] reads as the text it is."
                    )
                )
                .AddChild(new ParagraphComponent()
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetWidth(UILayoutLength.Absolute(390))
                    .SetTitle("Prose that only looks like markup")
                    .SetDescription(@"Retries are computed as *3 * 4* per region and written to ~~deploy_log~~, and a \* on its own is just an asterisk.")
                )
                // A fold's text is markup of its own, folds included; nothing about it reaches the server.
                .AddChild(new ParagraphComponent()
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetWidth(UILayoutLength.Absolute(390))
                    .SetTitle("A run the reader unfolds")
                    .SetDescription("Deploys to this environment are **frozen** until Monday. [Why?]{Europe North is being moved onto new disks after the provisioner "
                        + "rewrite, and the freeze lifts on its own. [What moving means]{Every server is snapshotted and restored onto the new disks by "
                        + "[the provisioner](https://docs.orvane.example/provisioner); nobody has to do anything by hand.} Ask an **owner** if something "
                        + "cannot wait.} Nothing else changes for you."
                    )
                )
                .AddChild(new ParagraphComponent()
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetWidth(UILayoutLength.Absolute(390))
                    .SetTitle("Clamped, with markup in the cut part")
                    .SetDescription("**Provisioner 2.4** ships one-minute servers in Europe North, a rewritten disk allocator and forty-one fixes, of which [nine](https://docs.orvane.example/releases/provisioner-2.4) were reported by customers.")
                    .SetMaxLines(2)
                ),
            columns: 24
        );
    }
}
