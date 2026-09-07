using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.CollapsiblePanel;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.CollapsiblePanel;

/// <summary>
/// One panel, and every property that can be bound to it.
/// </summary>
/// <remarks>Four panes because <c>Side</c> is not bindable; the viewer's own switch and the <c>Expanded</c> row may disagree.</remarks>
internal sealed class CollapsiblePanelMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string PanelGroup = nameof(CollapsiblePanelMainController.PanelGroup);
    private const string BorderGroup = nameof(CollapsiblePanelMainController.BorderGroup);

    public static string ViewKey => "demo.layouts.collapsible-panel.main";

    protected override string ComponentRoute => "/layouts/collapsible-panel";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.layouts.collapsible-panel.header";
    protected override string HeaderDescription => "demo.layouts.collapsible-panel.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(640,
            ("Left", frame => frame.AddChild(Bind(new CollapsiblePanelComponent("demo-panel-left"), UISide.Left))),
            ("Right", frame => frame.AddChild(Bind(new CollapsiblePanelComponent("demo-panel-right"), UISide.Right))),
            ("Top", frame => frame.AddChild(Bind(new CollapsiblePanelComponent("demo-panel-top"), UISide.Top))),
            ("Bottom", frame => frame.AddChild(Bind(new CollapsiblePanelComponent("demo-panel-bottom"), UISide.Bottom)))
        );

    private static CollapsiblePanelComponent Bind(CollapsiblePanelComponent panel, UISide side)
        => panel
            .SetSide(side)
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindExpanded($"{PanelGroup}.{nameof(CollapsiblePanelGroupContext.Expanded)}")
            .BindPadding($"{PanelGroup}.{nameof(CollapsiblePanelGroupContext.Padding)}")
            .BindBackground($"{PanelGroup}.{nameof(CollapsiblePanelGroupContext.Background)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            // Set rather than bound: it is what the panel holds rather than something about the panel.
            .SetContent(new ParagraphComponent()
                .SetTitle("Filters")
                .SetDescription("What the panel holds goes away with it: press the switch and only the switch is left, on the edge the panel sits on.")
                .SetDescriptionType(UITextAppearance.Body)
                .SetWrapMode(UITextWrapMode.Wrap)
            )
            .SetPlacement(1, 1, 24, 1);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(PanelGroup, "Panel", nameof(CollapsiblePanelMainController.CyclePanelOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(CollapsiblePanelMainController.CycleBorderOption))
        );
}
