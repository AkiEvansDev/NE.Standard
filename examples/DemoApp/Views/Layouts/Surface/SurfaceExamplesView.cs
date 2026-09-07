using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

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
        ));
    }

    /// <summary>
    /// A band that holds controls and belongs to the page; a card would promise bands it cannot fill.
    /// </summary>
    private static ContainerComponent CreateBarGroup()
    {
        return DemoUI.CreateGroup(null, "A band that holds controls",
            content => content.AddChild(new SurfaceComponent()
                .SetPadding(UIThickness.All(12, 8, 12, 8))
                .SetContent(new ContainerComponent()
                    .SetColumn(24, UIGridUnit.Auto())
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .AddChild(CreateChip(DemoIcons.Filter, "All environments"))
                        .AddChild(CreateChip(DemoIcons.Clock, "Last 7 days"))
                        .AddChild(CreateChip(DemoIcons.Check, "Successful only"))
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
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static ButtonComponent CreateChip(string icon, string title)
        => new ButtonComponent()
            .SetType(UIButtonType.Outline)
            .SetSize(UIButtonSize.Small)
            .SetIcon(DemoIcons.Outline(icon))
            .SetTitle(title);

    /// <summary>
    /// What <c>Tinted</c> is for: a hue mixed into the page, so three readings still look like one strip.
    /// </summary>
    private static ContainerComponent CreateStatsGroup()
    {
        return DemoUI.CreateGroup(null, "A strip of readings",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(12)
                .SetWrap(true)
                .AddChild(CreateStat("47", "Deploys this week", UIColorStyle.Info))
                .AddChild(CreateStat("2", "Rolled back", UIColorStyle.Danger))
                .AddChild(CreateStat("99.94%", "Availability", UIColorStyle.Success))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static SurfaceComponent CreateStat(string value, string label, UIColorStyle style)
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Tinted)
            .SetBackground(UIThemeColor.FromStyle(style))
            .SetWidth(UILayoutLength.Absolute(160))
            .SetContent(new TextComponent()
                .SetTitle(value)
                .SetTitleType(UITextAppearance.Display)
                .SetDescription(label)
                .SetDescriptionType(UITextAppearance.Caption)
            );

    /// <summary>
    /// <c>Clickable</c> on a tile whose whole area is the target, with a pair of styles marking the chosen one.
    /// </summary>
    private static ContainerComponent CreateChoiceGroup()
    {
        return DemoUI.CreateGroup(null, "A tile you pick",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(12)
                .SetWrap(true)
                .AddChild(CreateTile(DemoIcons.Upload, "Deploy now", "Straight to production, no gate.", chosen: false))
                .AddChild(CreateTile(DemoIcons.Clock, "Schedule it", "Runs at the next release window.", chosen: true))
                .AddChild(CreateTile(DemoIcons.Shield, "Stage only", "Stops after staging, waits for approval.", chosen: false))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    // Tinted on the brand colour rather than merely raised: the whole ground says "picked", not "nearer".
    private static SurfaceComponent CreateTile(string icon, string title, string description, bool chosen)
        => new SurfaceComponent()
            .SetClickable(true)
            .SetSurface(chosen ? UISurfaceStyle.Tinted : UISurfaceStyle.Background)
            .SetBackground(chosen ? UIThemeColor.FromStyle(UIColorStyle.Primary) : null)
            .SetBorderColor(chosen ? UIThemeColor.FromStyle(UIColorStyle.Primary) : null)
            .SetWidth(UILayoutLength.Absolute(200))
            .SetContent(new ParagraphComponent()
                .SetIcon(DemoIcons.Outline(icon))
                .SetIconColor(chosen ? UIThemeColor.FromStyle(UIColorStyle.Primary) : null)
                .SetTitle(title)
                .SetTitleType(UITextAppearance.Subtitle)
                .SetDescription(description)
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.Muted)
            );

    /// <summary>
    /// Two levels: a raised panel over the page, and inside it a flat one that reads as a well.
    /// </summary>
    private static ContainerComponent CreateNestedGroup()
    {
        return DemoUI.CreateGroup(null, "A surface inside a surface",
            content => content.AddChild(new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(10)
                    .AddChild(new TextComponent()
                        .SetTitle("Build 481")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("Finished 4 minutes ago")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Background)
                        .SetContent(new ParagraphComponent()
                            .SetDescription("`dotnet test` — 452 passed, 0 failed. Artifacts uploaded to the staging registry.")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// The other thing an edge is for: saying that a region is there and has nothing in it.
    /// </summary>
    /// <remarks>The mark is its own component, not the text body's leading <c>Icon</c>, so all three pieces share one centre.</remarks>
    private static ContainerComponent CreateEmptyStateGroup()
    {
        return DemoUI.CreateGroup(null, "Nothing here yet",
            content => content.AddChild(new SurfaceComponent()
                .SetPadding(UIThickness.Uniform(28))
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetHorizontalAlignment(UIAlignment.Center)
                    .AddChild(new IconComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Search))
                        // Width rather than Size: the size ladder goes with text and tops out at 24px.
                        .SetWidth(UILayoutLength.Absolute(40))
                        .SetColor(UIThemeColor.Muted)
                    )
                    .AddChild(new ParagraphComponent()
                        // Subtitle, not the default: at a title's size it reads as the page's own heading.
                        .SetTitle("No builds match that filter")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetTextAlignment(UITextAlignment.Center)
                        .SetDescription("Builds older than **thirty days** are archived and hidden by default.")
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetWidth(UILayoutLength.Absolute(320))
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        .SetHorizontalAlignment(UIAlignment.Center)
                        .SetTitle("Show archived builds")
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// The same content twice, so what a card adds is exactly what differs: two bands, drawn only where filled.
    /// </summary>
    private static ContainerComponent CreateAgainstCardGroup()
    {
        return DemoUI.CreateGroup(null, "Against a card",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(16)
                .SetWrap(true)
                .AddChild(DemoUI.CreateCaptionedItem("SurfaceComponent", new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(260))
                    .SetContent(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Vertical)
                        .SetSpacing(8)
                        .AddChild(CreateSampleHeading())
                        .AddChild(CreateSampleBody())
                        .AddChild(CreateSampleFooter())
                    )
                ))
                .AddChild(DemoUI.CreateCaptionedItem("CardComponent", new CardComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(260))
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Web Portal · #482")
                        .SetDescription("Fix circular progress anti-aliasing")
                    )
                    .SetContent(CreateSampleBody())
                    .SetFooter(CreateSampleFooter())
                ))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static TextComponent CreateSampleHeading()
        => new TextComponent()
            .SetTitle("Web Portal · #482")
            .SetDescription("Fix circular progress anti-aliasing")
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted);

    private static ParagraphComponent CreateSampleBody()
        => new ParagraphComponent()
            .SetDescription("All checks passed. Two approvals, no requested changes — ready to merge.")
            .SetDescriptionType(UITextAppearance.Body);

    private static StackPanelComponent CreateSampleFooter()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(8)
            .AddChild(new ButtonComponent()
                .SetType(UIButtonType.Primary)
                .SetSize(UIButtonSize.Small)
                .SetTitle("Merge")
            )
            .AddChild(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetSize(UIButtonSize.Small)
                .SetTitle("View diff")
            );
}
