using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Card;
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
    private const string BorderGroup = nameof(SurfaceController.BorderGroup);

    public static string ViewKey => "demo.layouts.surface";

    protected override string ComponentRoute => "/layouts/surface";
    protected override string Header => "demo.layouts.surface.header";
    protected override string HeaderDescription => "demo.layouts.surface.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/catalogue", "demo.nav.screens.catalogue");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new SurfaceComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSurface($"{SurfaceGroup}.{nameof(CardSurfaceGroupContext.Surface)}")
            .BindClickable($"{SurfaceGroup}.{nameof(CardSurfaceGroupContext.Clickable)}")
            .BindPadding($"{SurfaceGroup}.{nameof(CardSurfaceGroupContext.Padding)}")
            .BindBackground($"{SurfaceGroup}.{nameof(CardSurfaceGroupContext.Background)}")
            .BindBackgroundImage($"{SurfaceGroup}.{nameof(CardSurfaceGroupContext.BackgroundImage)}")
            .BindBackgroundImageFit($"{SurfaceGroup}.{nameof(CardSurfaceGroupContext.BackgroundImageFit)}")
            .BindOverflow($"{SurfaceGroup}.{nameof(CardSurfaceGroupContext.Overflow)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
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
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(SurfaceGroup, "Surface", nameof(SurfaceController.CycleSurfaceOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(SurfaceController.CycleBorderOption))
        );

    // Paired by height: the band beside the empty state, the strip of readings beside the tiles.
    protected override IVisualComponent[] CreateExamples()
        => DemoUI.CreateColumns([CreateBarGroup(), CreateStatsGroup()], [CreateEmptyStateGroup(), CreateChoiceGroup()]);

    /// <summary>
    /// A band that holds controls and belongs to the page (a card would promise bands it cannot fill), inside a panel of its own.
    /// </summary>
    private static ContainerComponent CreateBarGroup()
    {
        return DemoUI.CreateExample("A band that holds controls",
            // Two levels: a raised panel over the page, and inside it a flat band that reads as a well.
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetContent(UILayout.Stack(10)
                    .AddChild(new TextComponent()
                        .SetTitle("Releases")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("47 this week, filtered below")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Background)
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
                    )
                )
        );
    }

    /// <summary>
    /// <c>Clickable</c> on a tile whose whole area is the target, with a pair of styles marking the chosen one.
    /// </summary>
    /// <remarks>Equal thirds of the group rather than a width each: three fixed tiles wrapped onto a second line at half the page.</remarks>
    private static ContainerComponent CreateChoiceGroup()
    {
        return DemoUI.CreateExample("A tile you pick",
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
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Primary))
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
    /// What <c>Tinted</c> is for: a hue mixed into the page, so three readings still look like one strip.
    /// </summary>
    private static ContainerComponent CreateStatsGroup()
    {
        return DemoUI.CreateExample("A strip of readings",
            UILayout.Columns(12,
                new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Tinted)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Info))
                    .SetContent(new TextComponent()
                        .SetTitle("47")
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
}
