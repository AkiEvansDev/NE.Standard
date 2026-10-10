using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Link;
using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.Link;

/// <summary>
/// One link and every property that can be bound to it; then what a link is for, and the two things it is confused with.
/// </summary>
/// <remarks>Cleared, the <c>Url</c> row leaves the word drawn and going nowhere. A link is an address, so it is followed rather than dispatched — which is what separates it from the two.</remarks>
internal sealed class LinkView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string LinkGroup = nameof(LinkController.LinkGroup);
    private const string ContentGroup = nameof(LinkController.ContentGroup);
    private const string BadgeGroup = nameof(LinkController.BadgeGroup);

    public static string ViewKey => "demo.contents.link";

    protected override string ComponentRoute => "/contents/link";
    protected override string Header => "demo.contents.link.header";
    protected override string HeaderDescription => "demo.contents.link.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/article", "demo.nav.screens.article");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new LinkComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindUrl($"{LinkGroup}.{nameof(LinkGroupContext.Url)}")
            .BindIcon($"{ContentGroup}.{nameof(TextContentGroupContext.Icon)}")
            .BindIconColor($"{ContentGroup}.{nameof(TextContentGroupContext.IconColor)}")
            .BindIconSize($"{ContentGroup}.{nameof(TextContentGroupContext.IconSize)}")
            .BindTitle($"{ContentGroup}.{nameof(TextContentGroupContext.Title)}")
            .BindTitleType($"{ContentGroup}.{nameof(TextContentGroupContext.TitleType)}")
            .BindTitleColor($"{ContentGroup}.{nameof(TextContentGroupContext.TitleColor)}")
            .BindTooltip($"{ContentGroup}.{nameof(TextContentGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{ContentGroup}.{nameof(TextContentGroupContext.TooltipPlacement)}")
            .BindBadgePlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .BindBadgeStyle($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeStyle)}")
            .BindBadgeColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .BindBadgeFill($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeFill)}")
            .BindBadgeIcon($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .BindBadgeIconColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .BindBadgeIconSize($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .BindBadgeText($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeText)}")
            .BindBadgeTextType($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTextType)}")
            .BindBadgeTooltip($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .BindBadgeTooltipPlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}")
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(LinkGroup, "Link", nameof(LinkController.CycleLinkGroupOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(LinkController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(LinkController.CycleBadgeOption))
        );

    // The two comparisons that fit a half side by side; the sentence against its neighbour across the page, its two answers in halves.
    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateUsesGroup()], [CreateAgainstButtonGroup()]), CreateAgainstMarkupGroup()];

    /// <summary>
    /// The jobs it is given: a reference under a paragraph, an address that leaves the application, and a file.
    /// </summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateExample("What it is for",
            new SurfaceComponent()
                .SetMaxWidth(UILayoutLength.Absolute(372))
                .SetContent(UILayout.Stack(14)
                    .AddChild(new ParagraphComponent()
                        .SetTitle("Rollout paused")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("The error rate doubled in eu-west and the scheduler stopped itself.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new LinkComponent()
                        .SetTitle("The rollout plan")
                        .SetUrl("https://docs.orvane.example/rollout")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new LinkComponent()
                        // The glyph is what says the address is not one of this application's own pages.
                        .SetIcon(DemoIcons.Outline(DemoIcons.ExternalLink))
                        .SetTitle("Open the incident on the status page")
                        .SetUrl("https://status.orvane.example/incidents/4812")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new LinkComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                        .SetTitle("db-us-east-2.snapshot")
                        .SetUrl("https://orvane.example/snapshots/db-us-east-2.snapshot")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
        );
    }

    /// <summary>
    /// The pair that look the same: a Link-typed button runs a command, a link is an address the browser owns.
    /// </summary>
    private static ContainerComponent CreateAgainstButtonGroup()
    {
        return DemoUI.CreateExample("Against a Link-typed button",
            new SurfaceComponent()
                .SetMaxWidth(UILayoutLength.Absolute(372))
                .SetContent(UILayout.Stack(12)
                    .AddChild(UIText.Label("LinkComponent — an address"))
                    .AddChild(new LinkComponent()
                        .SetTitle("Read the change policy")
                        .SetUrl("https://docs.orvane.example/changes")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(UIText.Label("ButtonComponent, Type = Link — a command"))
                    .AddChild(UIButtons.Link("Request a change")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
        );
    }

    /// <summary>
    /// Inline markup, which is what to prefer inside prose; the component is for an address outside a sentence.
    /// </summary>
    private static ContainerComponent CreateAgainstMarkupGroup()
    {
        return DemoUI.CreateExample("Against a link inside a sentence",
            new SurfaceComponent()
                .SetContent(UILayout.Columns(32,
                        DemoUI.CreateLabelled("Inside the sentence", new ParagraphComponent()
                            .SetDescription("The rollout pauses itself if the error rate doubles in any region, and the thresholds are in [the rollout plan](https://docs.orvane.example/rollout).")
                            .SetDescriptionType(UITextAppearance.Body)
                        ),
                        DemoUI.CreateLabelled("Beside it", UILayout.Stack(12,
                                new ParagraphComponent()
                                    .SetDescription("The rollout pauses itself if the error rate doubles in any region.")
                                    .SetDescriptionType(UITextAppearance.Body),
                                new LinkComponent()
                                    .SetTitle("The rollout plan")
                                    .SetUrl("https://docs.orvane.example/rollout")
                                    .SetHorizontalAlignment(UIAlignment.Start)
                            )
                        )
                    )
                ),
            columns: 24
        );
    }
}
