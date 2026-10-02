using DemoApp.Controllers.Base;
using DemoApp.Controllers.Indicators.Spinner;
using DemoApp.Views.Base;

namespace DemoApp.Views.Indicators.Spinner;

/// <summary>
/// One waiting mark and every property that can be bound to it; then the three places a wait is shown, and the one question
/// that decides between them: how much of the screen is unusable while it lasts.
/// </summary>
/// <remarks>A spinner beside a word, a spinner instead of a region, and the case where a control draws its own. Whether to reach for a bar instead is decided by whether the work knows its own total: Progress's "known or not" shows that.</remarks>
internal sealed class SpinnerView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string SpinnerGroup = nameof(SpinnerController.SpinnerGroup);

    public static string ViewKey => "demo.indicators.spinner";

    protected override string ComponentRoute => "/indicators/spinner";
    protected override string Header => "demo.indicators.spinner.header";
    protected override string HeaderDescription => "demo.indicators.spinner.description";
    protected override (string Route, string Label)? ComposedIn => ("/mechanisms/commands", "demo.nav.mechanisms.commands");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new SpinnerComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindLabel($"{SpinnerGroup}.{nameof(SpinnerGroupContext.Label)}")
            .BindSize($"{SpinnerGroup}.{nameof(SpinnerGroupContext.Size)}")
            .BindColor($"{SpinnerGroup}.{nameof(SpinnerGroupContext.Color)}")
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(SpinnerGroup, "Spinner", nameof(SpinnerController.CycleSpinnerGroupOption))
        );

    protected override IVisualComponent[] CreateExamples()
        // The comparison beside the region and the inline mark stacked, as tall together: paired, the inline mark stood alone.
        => [CreateAgainstLoadingGroup(), DemoUI.CreateHalf(CreateRegionGroup(), CreateInlineGroup())];

    /// <summary>
    /// The case for not reaching for this component: <c>Loading</c> draws the wait inside the control's own shape.
    /// </summary>
    private static ContainerComponent CreateAgainstLoadingGroup()
    {
        return DemoUI.CreateExample("Against a control's own Loading",
            new SurfaceComponent()
                .SetMaxWidth(UILayoutLength.Absolute(352))
                .SetContent(UILayout.Stack(12)
                    .AddChild(UIText.Label("The control says it"))
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetLoading(true)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                        .SetTitle("Deploying")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(UIText.Label("Something beside it says it"))
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(10)
                        .AddChild(new ButtonComponent()
                            .SetType(UIButtonType.Primary)
                            .SetEnabled(false)
                            .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                            .SetTitle("Deploy")
                        )
                        // Not Muted: a mark that says "wait" must not be the faintest thing on the row.
                        .AddChild(new SpinnerComponent()
                            .SetVerticalAlignment(UIAlignment.Center)
                        )
                    )
                ),
            note: "Both of them are waiting. The top one says so inside its own shape, keeps its place in the row and stays the control you pressed; the pair below adds a second thing to look at, and a mark nobody can press."
        );
    }

    /// <summary>
    /// Instead of a region: the panel and its shape are there, the content is not; the label keeps it from reading as a fault.
    /// </summary>
    private static ContainerComponent CreateRegionGroup()
    {
        return DemoUI.CreateExample("Instead of a region",
            new CardComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetWidth(UILayoutLength.Absolute(340))
                .ConfigureDefaultHeader(header => header
                    .SetTitle("Deploys this week")
                    .SetDescription("Reading the last thirty days")
                )
                .SetContent(new ContainerComponent()
                    .SetMinHeight(UILayoutLength.Absolute(120))
                    .AddChild(new SpinnerComponent()
                        .SetLabel("Reading")
                        .SetSize(UIIconSize.Large)
                        .SetColor(UIThemeColor.Muted)
                        .SetHorizontalAlignment(UIAlignment.Center)
                        .SetVerticalAlignment(UIAlignment.Center)
                    )
                )
        );
    }

    /// <summary>
    /// Beside a word: the smallest of the three, leaving everything round it readable.
    /// </summary>
    private static ContainerComponent CreateInlineGroup()
    {
        return DemoUI.CreateExample("Beside a word",
            new SurfaceComponent()
                .SetMaxWidth(UILayoutLength.Absolute(352))
                .SetContent(UILayout.Stack(14)
                    .AddChild(new SpinnerComponent()
                        .SetLabel("Reading metrics")
                        .SetSize(UIIconSize.Small)
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(new SpinnerComponent()
                        .SetLabel("Checking five regions")
                        .SetColor(UIThemeColor.Muted)
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
        );
    }
}
