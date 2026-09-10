using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Indicators.Spinner;

/// <summary>
/// The three places a wait is shown, and the one question that decides between them: how much of the screen
/// is unusable while it lasts.
/// </summary>
/// <remarks>A spinner beside a word, a spinner instead of a region, and the cases where a control draws its own.</remarks>
internal sealed class SpinnerExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.indicators.spinner.examples";

    protected override string ComponentRoute => "/indicators/spinner";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.indicators.spinner.header";
    protected override string HeaderDescription => "demo.indicators.spinner.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateAgainstLoadingGroup(), CreateInlineGroup()],
            [CreateRegionGroup(), CreateAgainstProgressGroup()]
        ));
    }

    /// <summary>
    /// Beside a word: the smallest of the three, leaving everything round it readable.
    /// </summary>
    private static ContainerComponent CreateInlineGroup()
    {
        return DemoUI.CreateGroup(null, "Beside a word",
            content => content.AddChild(new SurfaceComponent()
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(14)
                    .SetWidth(UILayoutLength.Absolute(320))
                    .AddChild(new SpinnerComponent()
                        .SetLabel("Reading the manifest")
                        .SetSize(UIIconSize.Small)
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(new SpinnerComponent()
                        .SetLabel("Checking eight regions")
                        .SetColor(UIThemeColor.Muted)
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// Instead of a region: the panel and its shape are there, the content is not; the label keeps it from reading as a fault.
    /// </summary>
    private static ContainerComponent CreateRegionGroup()
    {
        return DemoUI.CreateGroup(null, "Instead of a region",
            content => content.AddChild(new CardComponent()
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
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// The case for not reaching for this component: <c>Loading</c> draws the wait inside the control's own shape.
    /// </summary>
    private static ContainerComponent CreateAgainstLoadingGroup()
    {
        return DemoUI.CreateGroup(null, "Against a control's own Loading",
            content => content.AddChild(new SurfaceComponent()
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetWidth(UILayoutLength.Absolute(320))
                    .AddChild(DemoUI.CreateCaption("The control says it"))
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetLoading(true)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                        .SetTitle("Deploying")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(DemoUI.CreateCaption("Something beside it says it"))
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
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Both of them are waiting. The top one says so inside its own shape, keeps its place in the row and stays the control you pressed; the pair below adds a second thing to look at, and a mark nobody can press."
        );
    }

    /// <summary>
    /// Which of the two to reach for is decided by whether the work knows its own total.
    /// </summary>
    private static ContainerComponent CreateAgainstProgressGroup()
    {
        return DemoUI.CreateGroup(null, "Against an indeterminate bar",
            content => content.AddChild(new SurfaceComponent()
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetWidth(UILayoutLength.Absolute(320))
                    .AddChild(DemoUI.CreateCaption("Spinner — no total, and it does not imply one"))
                    .AddChild(new SpinnerComponent()
                        .SetLabel("Waiting for the gate")
                        .SetSize(UIIconSize.Small)
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(DemoUI.CreateCaption("Progress, unset — a shape that promises a number"))
                    .AddChild(new ProgressComponent()
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }
}
