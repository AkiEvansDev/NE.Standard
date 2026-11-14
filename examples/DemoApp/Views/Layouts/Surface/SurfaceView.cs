using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Surface;
using DemoApp.Views.Base;

namespace DemoApp.Views.Layouts.Surface;

/// <summary>
/// One surface and every property that can be bound to it; then the jobs a surface is given when a card would be the wrong answer.
/// </summary>
/// <remarks>
/// Everything here is also on a card, which is one of these with bands added; what the bands add is shown on the card's page.
/// </remarks>
internal sealed class SurfaceView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string SurfaceGroup = nameof(SurfaceController.SurfaceGroup);
    private const string BackgroundImageGroup = nameof(SurfaceController.BackgroundImageGroup);
    private const string BorderGroup = nameof(SurfaceController.BorderGroup);

    public static string ViewKey => "demo.layouts.surface";

    protected override string ComponentRoute => "/layouts/surface";
    protected override string Header => "demo.layouts.surface.header";
    protected override string HeaderDescription => "demo.layouts.surface.description";
    protected override (string Route, string Title)? ComposedIn => ("/screens/catalogue", "demo.nav.screens.catalogue");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new SurfaceComponent()
            .BindStandard()
            .BindSurface<SurfaceController>(static x => x.SurfaceGroup.Surface)
            .BindClickable<SurfaceController>(static x => x.SurfaceGroup.Clickable)
            .BindPadding<SurfaceController>(static x => x.SurfaceGroup.Padding)
            .BindBackground<SurfaceController>(static x => x.SurfaceGroup.Background)
            .BindBackgroundImage<SurfaceController>(static x => x.BackgroundImageGroup.BackgroundImage)
            .BindBackgroundImageFit<SurfaceController>(static x => x.BackgroundImageGroup.BackgroundImageFit)
            .BindBackgroundImageDim<SurfaceController>(static x => x.BackgroundImageGroup.BackgroundImageDim)
            .BindBackgroundImageDimMode<SurfaceController>(static x => x.BackgroundImageGroup.BackgroundImageDimMode)
            .BindBackgroundImageBlur<SurfaceController>(static x => x.BackgroundImageGroup.BackgroundImageBlur)
            .BindOverflow<SurfaceController>(static x => x.SurfaceGroup.Overflow)
            .BindBorder(BorderGroup)
            // Set rather than bound: it is what the surface holds rather than something about the surface.
            .SetContent(new ParagraphComponent()
                .SetTitle("A surface")
                .SetDescription("One region and nothing around it: a fill, an edge, a radius, and a click where it is asked for.")
                .SetDescriptionType(UITextAppearance.Body)
                .SetWrapMode(UITextWrapMode.Wrap)
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 260);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(SurfaceGroup, "Surface"),
            DemoUI.CreateOptionSection(BackgroundImageGroup, "Background image"),
            DemoUI.CreateOptionSection(BorderGroup, "Border")
        );

    // Paired by height: three examples per column.
    protected override IVisualComponent[] CreateExamples()
        => DemoUI.CreateColumns([CreateBarGroup(), CreateStatsGroup(), CreateLinkGroup()], [CreateChoiceGroup(), CreateRowsGroup(), CreateEmptyStateGroup()]);

    /// <summary>
    /// A single-level toolbar band holding a title and compact filter controls on one surface row.
    /// </summary>
    private static ContainerComponent CreateBarGroup()
    {
        return DemoUI.CreateExample("Control toolbar",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Surface)
                .SetPadding(UIThickness.All(14, 10, 14, 10))
                .SetContent(UILayout.Ends(
                        new TextComponent()
                            .SetTitle("Releases")
                            .SetTitleType(UITextAppearance.Subtitle)
                            .SetBadgeTitle("48")
                            .SetBadgeVariant(UIBadgeVariant.Surface)
                            .SetBadgePlacement(UITextBadgePlacement.Inline)
                            .SetVerticalAlignment(UIAlignment.Center),
                        new StackPanelComponent()
                            .SetOrientation(UIOrientation.Horizontal)
                            .SetWrap(true)
                            .SetSpacing(6)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .AddChild(new ButtonComponent().SetVariant(UIButtonVariant.Outline).SetSize(UISize.Small).SetIcon(DemoIcons.Outline(DemoIcons.Filter)).SetTitle("Production"))
                            .AddChild(new ButtonComponent().SetVariant(UIButtonVariant.Outline).SetSize(UISize.Small).SetIcon(DemoIcons.Outline(DemoIcons.Clock)).SetTitle("7 days"))
                            .AddChild(new ButtonComponent().SetVariant(UIButtonVariant.Ghost).SetSize(UISize.Small).SetIcon(DemoIcons.Outline(DemoIcons.Undo)).SetTooltip("Reset filters"))
                    )
                ),
            note: "A single `UISurfaceStyle.Surface` strip frames inline toolbar controls without Card header/footer chrome."
        );
    }

    /// <summary>
    /// What <c>Tinted</c> is for: a hue mixed into the page, so three readings still look like one strip.
    /// </summary>
    private static ContainerComponent CreateStatsGroup()
    {
        return DemoUI.CreateExample("Tinted metric tiles",
            UILayout.Columns(12,
                new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Tinted)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Info))
                    .SetContent(new TextComponent()
                        .SetTitle("48")
                        .SetTitleType(UITextAppearance.Display)
                        .SetDescription("Deploys this week")
                        .SetDescriptionType(UITextAppearance.Caption)
                    ),
                new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Tinted)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Danger))
                    .SetContent(new TextComponent()
                        .SetTitle("2")
                        .SetTitleType(UITextAppearance.Display)
                        .SetDescription("Rolled back")
                        .SetDescriptionType(UITextAppearance.Caption)
                    ),
                new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Tinted)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Success))
                    .SetContent(new TextComponent()
                        .SetTitle("99.94%")
                        .SetTitleType(UITextAppearance.Display)
                        .SetDescription("Availability")
                        .SetDescriptionType(UITextAppearance.Caption)
                    )
            )
        );
    }

    /// <summary>
    /// <c>Url</c>: a card that is a link — its root an anchor, so it opens in a new tab, copies as an address and is followed in place with
    /// no round trip; it holds words only, and its button beside it is a link too.
    /// </summary>
    private static ContainerComponent CreateLinkGroup()
    {
        return DemoUI.CreateExample("Link surface (SetUrl)",
            UILayout.Stack(8)
                .AddChild(new CardComponent()
                    .SetUrl("/layouts/card")
                    .SetContent(new ParagraphComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                        .SetTitle("Card")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("A surface with a header and a footer band.")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddChild(new ButtonComponent().SetVariant(UIButtonVariant.Outline).SetTitle("Expander").SetUrl("/layouts/expander")),
            note: "`SetUrl` renders the root as an anchor (`<a>`); binding an `OnClick` command or nesting interactive controls inside it fails view compilation."
        );
    }

    /// <summary>
    /// <c>Clickable</c> on a tile whose whole area is the target, with a pair of styles marking the chosen one.
    /// </summary>
    /// <remarks>Equal thirds of the group rather than a width each: three fixed tiles wrapped onto a second line at half the page.</remarks>
    private static ContainerComponent CreateChoiceGroup()
    {
        return DemoUI.CreateExample("Selectable tiles",
            UILayout.Columns(12,
                new SurfaceComponent()
                    .SetClickable(true)
                    .SetSurface(UISurfaceStyle.Background)
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetContent(new ParagraphComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                        .SetTitle("Deploy now")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("Straight to production, no gate.")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    ),
                // Tinted on the brand colour rather than merely raised: the whole ground says "picked", not "nearer".
                new SurfaceComponent()
                    .SetClickable(true)
                    .SetSurface(UISurfaceStyle.Tinted)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Primary))
                    .SetBorderColor(UIThemeColor.FromStyle(UIColorStyle.Primary))
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetContent(new ParagraphComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Clock))
                        .SetIconColor(UIThemeColor.Default)
                        .SetTitle("Schedule it")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("Runs at the next release window.")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    ),
                new SurfaceComponent()
                    .SetClickable(true)
                    .SetSurface(UISurfaceStyle.Background)
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetContent(new ParagraphComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Shield))
                        .SetTitle("Stage only")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("Stops after staging, waits for approval.")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
            )
        );
    }

    /// <summary>
    /// <c>Surface</c> rows and <c>QuietHover</c>: a pinned strip with softened hover over clickable content rows.
    /// </summary>
    private static ContainerComponent CreateRowsGroup()
    {
        return DemoUI.CreateExample("Interactive rows & QuietHover",
            UILayout.Stack(4)
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Surface)
                    .SetClickable(true)
                    .SetQuietHover(true)
                    .SetBorderThickness(UIThickness.Uniform(0))
                    .SetPadding(UIThickness.All(12, 8, 12, 8))
                    .SetContent(UIText.Quote("Pinned message", "The release window moves to Thursday; staging freezes on Wednesday at noon."))
                )
                .AddChild(CreateMessageRow("Staging is green again after the cache fix", "Sun 18:40", pinned: false))
                .AddChild(new ActionComponent().SetAction("All pinned messages", icon: DemoIcons.Outline(DemoIcons.Star))),
            note: "`SetQuietHover(true)` halves the hover wash and suppresses lift on wide strips the pointer crosses often."
        );
    }

    private static SurfaceComponent CreateMessageRow(string words, string time, bool pinned)
    {
        StackPanelComponent sent = new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(4)
            .SetVerticalAlignment(UIAlignment.Center);

        if (pinned)
            _ = sent.AddChild(new IconComponent().SetIcon(DemoIcons.Star).SetSize(UISize.Small).SetColor(UIThemeColor.Muted));

        return new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Surface)
            .SetClickable(true)
            .SetBorderThickness(UIThickness.Uniform(0))
            .SetPadding(UIThickness.All(12, 8, 12, 8))
            .SetContent(UILayout.Stack(2)
                .AddChild(new TextComponent().SetTitle(words).SetTitleType(UITextAppearance.Body))
                .AddChild(sent.AddChild(new TextComponent().SetTitle(time).SetTitleType(UITextAppearance.Caption).SetTitleColor(UIThemeColor.Muted)))
            );
    }

    /// <summary>
    /// The other thing an edge is for: saying that a region is there and has nothing in it.
    /// </summary>
    /// <remarks>The mark is its own component, not the text body's leading <c>Icon</c>, so all three pieces share one centre.</remarks>
    private static ContainerComponent CreateEmptyStateGroup()
    {
        return DemoUI.CreateExample("Empty state",
            new SurfaceComponent()
                .SetPadding(UIThickness.Uniform(28))
                .SetContent(UILayout.Stack(12)
                    .SetHorizontalAlignment(UIAlignment.Center)
                    .AddChild(new IconComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Search))
                        // Width rather than Size: the size ladder goes with text and tops out at 24px.
                        .SetWidth(UILayoutLength.Absolute(40))
                        .SetColor(UIThemeColor.Muted)
                    )
                    .AddChild(new ParagraphComponent()
                        // Subtitle, not the default: at a title's size it reads as the page's own heading.
                        .SetTitle("No releases match that filter")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetTextAlignment(UITextAlignment.Center)
                        .SetDescription("Releases older than **thirty days** are archived and hidden by default.")
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetMaxWidth(UILayoutLength.Absolute(320))
                    )
                    .AddChild(new ButtonComponent()
                        .SetVariant(UIButtonVariant.Ghost)
                        .SetHorizontalAlignment(UIAlignment.Center)
                        .SetTitle("Show archived releases")
                    )
                )
        );
    }
}
