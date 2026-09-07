using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Contents.Paragraph;

/// <summary>
/// What a paragraph does that text content does not: run.
/// </summary>
/// <remarks>Which of the two components a piece of writing belongs in, what a clamp is for, and the inline markup.</remarks>
internal sealed class ParagraphExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string LongMarkup = "A longer supporting description, with **emphasis** and [a link](https://example.com/docs) in it, long enough to wrap across several lines of a narrow column.";
    private const string LongTitle = "A title long enough to need a second line of its own";

    private static readonly (string Title, string Body)[] FeedEntries =
    [
        ("Release 2.4", "**Incremental rollout**, a rewritten scheduler and forty-one fixes. The rollout pauses itself if the error rate doubles in any region, and the thresholds are in [the rollout plan](https://example.com/docs/rollout)."),
        ("Release 2.3", "Grouped items, empty templates and the items filter/sort pipeline."),
        ("Release 2.2", "The colour palette moved out into a package of its own, which is why every semantic name in this application is now resolved twice — once for the role and once for the theme it is being read in.")
    ];

    public static string ViewKey => "demo.contents.paragraph.examples";

    protected override string ComponentRoute => "/contents/paragraph";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.paragraph.header";
    protected override string HeaderDescription => "demo.contents.paragraph.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateUsesGroup(), CreateQuoteGroup(), CreateClampGroup()],
            [CreateAgainstContentGroup(), CreateMarkupGroup()]
        ));
    }

    /// <summary>
    /// The jobs a paragraph is given: a notice above a form, an empty state, a note beside a setting, a release entry.
    /// </summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateGroup(null, "What it is for",
            content =>
            {
                StackPanelComponent stack = DemoUI.CreateRow(16);

                _ = stack
                    .AddChild(CreateUse(UISurfaceStyle.Tinted, UIColorStyle.Danger, new ParagraphComponent()
                        .SetIcon(DemoIcons.Alert)
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .SetTitle("Environment locked")
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .SetDescription("Changes are applied through [the release pipeline](https://example.com/docs/pipeline). Ask an **owner** to unlock it if you need to edit anything here directly.")
                        // The sentence keeps its own colour: Muted under a Danger title falls below contrast.
                        .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.OnSurface))
                    ))
                    .AddChild(CreateUse(UISurfaceStyle.Background, null, new ParagraphComponent()
                        .SetIcon(DemoIcons.Search)
                        .SetIconColor(UIThemeColor.Muted)
                        .SetTitle("No builds matched")
                        .SetDescription("Try a shorter query, or clear the *environment* filter — builds older than **thirty days** are archived and hidden by default. [Show archived builds](https://example.com/builds?archived=1)")
                        .SetDescriptionColor(UIThemeColor.Muted)
                    ))
                    .AddChild(CreateUse(UISurfaceStyle.Raised, null, new ParagraphComponent()
                        .SetTitle("Require review")
                        .SetBadgeText("Recommended")
                        .SetBadgeStyle(UIBadgeType.Success)
                        .SetDescription("Every merge into the release branch waits for **one approval** from someone who did not write it. Turning this off leaves branches already in flight alone — see [the review policy](https://example.com/docs/review).")
                        .SetDescriptionColor(UIThemeColor.Muted)
                    ))
                    .AddChild(CreateUse(UISurfaceStyle.Raised, null, new ParagraphComponent()
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle("Release 2.4")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetBadgeText("12 Aug")
                        .SetBadgeStyle(UIBadgeType.Info)
                        .SetDescription("**Incremental rollout**, a rewritten scheduler and forty-one fixes. The rollout pauses itself if the error rate doubles in any region — [full changelog](https://example.com/releases/2.4).")
                    ));

                _ = content.AddChild(stack.SetPlacement(1, 1, 24, 1));
            }
        );
    }

    /// <summary>
    /// A line beside the description sets it off as a quotation or a note; on a surface it makes a block.
    /// </summary>
    private static ContainerComponent CreateQuoteGroup()
    {
        return DemoUI.CreateGroup(null, "Set off by a line",
            content =>
            {
                StackPanelComponent stack = DemoUI.CreateRow(16);

                _ = stack
                    .AddChild(CreateUse(UISurfaceStyle.Background, null, new ParagraphComponent()
                        .SetTitle("From the incident review")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetShowQuoteLine(true)
                        .SetDescription("The rollout paused itself at four percent, which is the number we had argued about for a week and never written down. It was right.")
                        .SetDescriptionColor(UIThemeColor.Muted)
                    ))
                    .AddChild(CreateUse(UISurfaceStyle.Raised, null, new ParagraphComponent()
                        .SetShowQuoteLine(true)
                        .SetQuoteLineColor(UIThemeColor.FromStyle(UIColorStyle.Primary))
                        .SetDescription("A note with no title of its own: the line is what says it stands apart from the prose around it.")
                    ))
                    .AddChild(CreateUse(UISurfaceStyle.Tinted, UIColorStyle.Warning, new ParagraphComponent()
                        .SetTitle("Before you continue")
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Warning))
                        .SetShowQuoteLine(true)
                        .SetQuoteLineColor(UIThemeColor.FromStyle(UIColorStyle.Warning))
                        .SetDescription("Deploys to this environment are **frozen** until Monday. The freeze lifts on its own; nobody has to be asked.")
                        .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.OnSurface))
                    ));

                _ = content.AddChild(stack.SetPlacement(1, 1, 24, 1));
            }
        );
    }

    // Each one inside the ground it actually has, or four blocks of loose prose read as a rendering fault.
    private static SurfaceComponent CreateUse(UISurfaceStyle surface, UIColorStyle? background, ParagraphComponent paragraph)
        => new SurfaceComponent()
            .SetSurface(surface)
            .SetBackground(background is UIColorStyle style ? UIThemeColor.FromStyle(style) : null)
            .SetWidth(UILayoutLength.Absolute(300))
            .SetVerticalAlignment(UIAlignment.Start)
            .SetContent(paragraph);

    /// <summary>
    /// What a clamp is for: in a list, one entry with more to say must not push the next one off the screen.
    /// </summary>
    private static ContainerComponent CreateClampGroup()
    {
        return DemoUI.CreateGroup(null, "When a run of prose must not push everything down",
            content => content.AddChild(DemoUI.CreateRow(16)
                .AddChild(CreateFeed("Unclamped", clamped: false))
                .AddChild(CreateFeed("Two lines each", clamped: true))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static StackPanelComponent CreateFeed(string label, bool clamped)
    {
        StackPanelComponent feed = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetVerticalAlignment(UIAlignment.Start)
            .SetSpacing(10)
            .AddChild(new TextComponent()
                .SetTitle(label)
                .SetTitleType(UITextAppearance.Overline)
                .SetTitleColor(UIThemeColor.Muted)
            );

        foreach ((var title, var body) in FeedEntries)
        {
            ParagraphComponent entry = new ParagraphComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetIcon(DemoIcons.FileText)
                .SetTitle(title)
                .SetTitleType(UITextAppearance.Subtitle)
                .SetDescription(body)
                .SetDescriptionColor(UIThemeColor.Muted);

            // MaxLines only means anything against WrapEllipsis.
            if (clamped)
            {
                _ = entry
                    .SetWrapMode(UITextWrapMode.WrapEllipsis)
                    .SetMaxLines(2);
            }

            _ = feed.AddChild(entry);
        }

        return feed;
    }

    /// <summary>
    /// The inline markup surviving a line break and a clamp; the fifth row is prose that only looks like markup.
    /// </summary>
    private static ContainerComponent CreateMarkupGroup()
    {
        return DemoUI.CreateGroup(null, "Inline markup",
            content =>
            {
                StackPanelComponent stack = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12);

                _ = stack
                    .AddChild(CreateMarkupSample("A link that falls across a line break",
                        "The rollout pauses itself if the error rate doubles in any region — the thresholds, and who is paged when one is crossed, are in [the rollout plan](https://example.com/docs/rollout)."))
                    .AddChild(CreateMarkupSample("A name that is a name, not prose",
                        "`dotnet build` runs the client build too, so a TypeScript error fails it. The parser is `UIInlineMarkup`, and a code run is the one that does not nest — `**this**` stays as typed."))
                    .AddChild(CreateMarkupSample("Emphasis inside a sentence",
                        "**Release 2.4** ships *incremental* rollout. The old __all at once__ path still works and is ~~supported~~ scheduled for removal in 2.6."))
                    // Built from the constants: a name spelt by hand would be a mark that silently never draws.
                    .AddChild(CreateMarkupSample("A mark standing in the sentence",
                        $"Green ![{DemoIcons.Check}] means every gate answered, amber ![{DemoIcons.Clock}] means one has not answered yet, "
                        + $"and red ![{DemoIcons.Alert}] means one answered no. A mark is not a word, and it is not read aloud with them: "
                        + @"!\[the bracket escaped] reads as the text it is."))
                    .AddChild(CreateMarkupSample("Prose that only looks like markup",
                        @"Retries are computed as *3 * 4* per region and written to ~~deploy_log~~, and a \* on its own is just an asterisk."))
                    // A fold's text is markup of its own, folds included; nothing about it reaches the server.
                    .AddChild(CreateMarkupSample("A run the reader unfolds",
                        "Deploys to this environment are **frozen** until Monday. [Why?]{The release branch is being re-cut after the scheduler "
                        + "rewrite, and the freeze lifts on its own. [What re-cutting means]{Every open branch is rebased onto the new base by "
                        + "[the pipeline](https://example.com/docs/pipeline); nobody has to do anything by hand.} Ask an **owner** if something "
                        + "cannot wait.} Nothing else changes for you."))
                    .AddChild(CreateMarkupSample("Clamped, with markup in the cut part",
                        "**Release 2.4** ships incremental rollout, a rewritten scheduler and forty-one fixes, of which [nine](https://example.com/releases/2.4) were reported from production.")
                        .SetWrapMode(UITextWrapMode.WrapEllipsis)
                        .SetMaxLines(2)
                    );

                _ = content.AddChild(stack.SetPlacement(1, 1, 24, 1));
            }
        );
    }

    private static ParagraphComponent CreateMarkupSample(string title, string description)
        => new ParagraphComponent()
            .SetWidth(UILayoutLength.Absolute(460))
            .SetTitle(title)
            .SetDescription(description);

    /// <summary>
    /// The pair the split is about: only the description wraps, and only text content centres its glyph and badge.
    /// </summary>
    private static ContainerComponent CreateAgainstContentGroup()
    {
        return DemoUI.CreateGroup(null, "Against text content",
            // A width on the row, so the four wrap two and two and each pair stays side by side.
            content => content.AddChild(DemoUI.CreateRow(16)
                .SetWidth(UILayoutLength.Absolute(520))
                .AddChild(DemoUI.CreateCaptionedItem("TextComponent", new TextComponent()
                    .SetIcon(DemoIcons.FileText)
                    .SetTitle(LongTitle)
                    .SetDescription(LongMarkup)
                    .SetWidth(UILayoutLength.Absolute(240))
                ))
                .AddChild(DemoUI.CreateCaptionedItem("ParagraphComponent", new ParagraphComponent()
                    .SetIcon(DemoIcons.FileText)
                    .SetTitle(LongTitle)
                    .SetDescription(LongMarkup)
                    .SetWidth(UILayoutLength.Absolute(240))
                ))
                .AddChild(DemoUI.CreateCaptionedItem("TextComponent, badge and all", new TextComponent()
                    .SetIcon(DemoIcons.FileText)
                    .SetTitle(LongTitle)
                    .SetDescription(LongMarkup)
                    .SetBadgeText("New")
                    .SetBadgeStyle(UIBadgeType.Success)
                    .SetWidth(UILayoutLength.Absolute(240))
                ))
                .AddChild(DemoUI.CreateCaptionedItem("ParagraphComponent, badge and all", new ParagraphComponent()
                    .SetIcon(DemoIcons.FileText)
                    .SetTitle(LongTitle)
                    .SetDescription(LongMarkup)
                    .SetBadgeText("New")
                    .SetBadgeStyle(UIBadgeType.Success)
                    .SetWidth(UILayoutLength.Absolute(240))
                ))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }
}
