using DemoApp.Views.Base;

namespace DemoApp.Views.Layouts.Surface;

/// <summary>
/// The jobs a surface is given when a card would be the wrong answer.
/// </summary>
/// <remarks>When one region with an edge round it is the right thing, and what a card adds that this has not.</remarks>
internal sealed class SurfaceExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.surface.examples";

    protected override string ComponentRoute => "/layouts/surface";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.layouts.surface.header";
    protected override string HeaderDescription => "demo.layouts.surface.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateBarGroup(), CreateChoiceGroup(), CreateEmptyStateGroup()],
            [CreateStatsGroup(), CreateNestedGroup(), CreateAgainstCardGroup()]
            )
        );
    }

    /// <summary>
    /// A band that holds controls and belongs to the page; a card would promise bands it cannot fill.
    /// </summary>
    private static ContainerComponent CreateBarGroup()
    {
        return DemoUI.CreateExample("A band that holds controls",
            new SurfaceComponent()
                .SetPadding(UIThickness.All(12, 8, 12, 8))
                .SetContent(new ContainerComponent()
                    .SetColumn(24, UIGridUnit.Auto())
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetWrap(true)
                        .SetSpacing(8)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .AddChild(new ButtonComponent().SetType(UIButtonType.Outline).SetSize(UIButtonSize.Small).SetIcon(DemoIcons.Outline(DemoIcons.Filter)).SetTitle("All environments"))
                        .AddChild(new ButtonComponent().SetType(UIButtonType.Outline).SetSize(UIButtonSize.Small).SetIcon(DemoIcons.Outline(DemoIcons.Clock)).SetTitle("Last 7 days"))
                        .AddChild(new ButtonComponent().SetType(UIButtonType.Outline).SetSize(UIButtonSize.Small).SetIcon(DemoIcons.Outline(DemoIcons.Check)).SetTitle("Successful only"))
                        .SetPlacement(1, 1, 20, 1)
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Undo))
                        .SetTooltip("Clear the filters")
                        .SetPlacement(24, 1, 1, 1)
                    )
                )
        );
    }

    /// <summary>
    /// What <c>Tinted</c> is for: a hue mixed into the page, so three readings still look like one strip.
    /// </summary>
    private static ContainerComponent CreateStatsGroup()
    {
        return DemoUI.CreateExample("A strip of readings",
            UILayout.Row(12)
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Tinted)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Info))
                    .SetWidth(UILayoutLength.Absolute(160))
                    .SetContent(new TextComponent()
                        .SetTitle("47")
                        .SetTitleType(UITextAppearance.Display)
                        .SetDescription("Deploys this week")
                        .SetDescriptionType(UITextAppearance.Caption)
                    )
                )
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Tinted)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Danger))
                    .SetWidth(UILayoutLength.Absolute(160))
                    .SetContent(new TextComponent()
                        .SetTitle("2")
                        .SetTitleType(UITextAppearance.Display)
                        .SetDescription("Rolled back")
                        .SetDescriptionType(UITextAppearance.Caption)
                    )
                )
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Tinted)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Success))
                    .SetWidth(UILayoutLength.Absolute(160))
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
    /// <c>Clickable</c> on a tile whose whole area is the target, with a pair of styles marking the chosen one.
    /// </summary>
    private static ContainerComponent CreateChoiceGroup()
    {
        return DemoUI.CreateExample("A tile you pick",
            UILayout.Row(12)
                .AddChild(new SurfaceComponent()
                    .SetClickable(true)
                    .SetSurface(UISurfaceStyle.Background)
                    .SetWidth(UILayoutLength.Absolute(200))
                    .SetContent(new ParagraphComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                        .SetTitle("Deploy now")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("Straight to production, no gate.")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                // Tinted on the brand colour rather than merely raised: the whole ground says "picked", not "nearer".
                .AddChild(new SurfaceComponent()
                    .SetClickable(true)
                    .SetSurface(UISurfaceStyle.Tinted)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Primary))
                    .SetBorderColor(UIThemeColor.FromStyle(UIColorStyle.Primary))
                    .SetWidth(UILayoutLength.Absolute(200))
                    .SetContent(new ParagraphComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Clock))
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Primary))
                        .SetTitle("Schedule it")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("Runs at the next release window.")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddChild(new SurfaceComponent()
                    .SetClickable(true)
                    .SetSurface(UISurfaceStyle.Background)
                    .SetWidth(UILayoutLength.Absolute(200))
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
    /// Two levels: a raised panel over the page, and inside it a flat one that reads as a well.
    /// </summary>
    private static ContainerComponent CreateNestedGroup()
    {
        return DemoUI.CreateExample("A surface inside a surface",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetContent(UILayout.Stack(10)
                    .AddChild(new TextComponent()
                        .SetTitle("Release 481")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("Rolled out 4 minutes ago")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Background)
                        .SetContent(UIText.Note("`provisioner` — rolled out to Europe West, and the health check passed on every replica."))
                    )
                )
        );
    }

    /// <summary>
    /// The other thing an edge is for: saying that a region is there and has nothing in it.
    /// </summary>
    /// <remarks>The mark is its own component, not the text body's leading <c>Icon</c>, so all three pieces share one centre.</remarks>
    private static ContainerComponent CreateEmptyStateGroup()
    {
        return DemoUI.CreateExample("Nothing here yet",
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
                        .SetWidth(UILayoutLength.Absolute(320))
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        .SetHorizontalAlignment(UIAlignment.Center)
                        .SetTitle("Show archived releases")
                    )
                )
        );
    }

    /// <summary>
    /// The same content twice, so what a card adds is exactly what differs: two bands, drawn only where filled.
    /// </summary>
    private static ContainerComponent CreateAgainstCardGroup()
    {
        return DemoUI.CreateExample("Against a card",
            UILayout.Row(16)
                .AddChild(UIPage.Labelled("SurfaceComponent", new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(260))
                    .SetContent(UILayout.Stack(8)
                        .AddChild(new TextComponent()
                            .SetTitle("Request CHG-482")
                            .SetDescription("Resize db-us-east-2 to Dedicated")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                        .AddChild(new ParagraphComponent()
                            .SetDescription("Plan checked and the maintenance window booked — one approval left, and it is yours.")
                            .SetDescriptionType(UITextAppearance.Body)
                        )
                        .AddChild(new StackPanelComponent()
                            .SetOrientation(UIOrientation.Horizontal)
                            .SetSpacing(8)
                            .AddChild(new ButtonComponent()
                                .SetType(UIButtonType.Primary)
                                .SetSize(UIButtonSize.Small)
                                .SetTitle("Approve")
                            )
                            .AddChild(new ButtonComponent()
                                .SetType(UIButtonType.Ghost)
                                .SetSize(UIButtonSize.Small)
                                .SetTitle("View plan")
                            )
                        )
                    )
                    )
                )
                .AddChild(UIPage.Labelled("CardComponent", new CardComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(260))
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Request CHG-482")
                        .SetDescription("Resize db-us-east-2 to Dedicated")
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("Plan checked and the maintenance window booked — one approval left, and it is yours.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                    .SetFooter(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .AddChild(new ButtonComponent()
                            .SetType(UIButtonType.Primary)
                            .SetSize(UIButtonSize.Small)
                            .SetTitle("Approve")
                        )
                        .AddChild(new ButtonComponent()
                            .SetType(UIButtonType.Ghost)
                            .SetSize(UIButtonSize.Small)
                            .SetTitle("View plan")
                        )
                    )
                    )
                )
        );
    }
}
