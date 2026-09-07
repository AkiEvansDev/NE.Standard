using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.StackPanel;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Layouts.StackPanel;

/// <summary>
/// One line of things, and every property that can be bound to it.
/// </summary>
/// <remarks>The panel packs along the axis it runs on, so a child has nothing to align against across it; <c>Wrap</c> is read against the frame's width.</remarks>
internal sealed class StackPanelMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string StackGroup = nameof(StackPanelMainController.StackGroup);

    public static string ViewKey => "demo.layouts.stack-panel.main";

    protected override string ComponentRoute => "/layouts/stack-panel";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main];
    protected override string Header => "demo.layouts.stack-panel.header";
    protected override string HeaderDescription => "demo.layouts.stack-panel.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new StackPanelComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindOrientation($"{StackGroup}.{nameof(StackPanelGroupContext.Orientation)}")
            .BindSpacing($"{StackGroup}.{nameof(StackPanelGroupContext.Spacing)}")
            .BindWrap($"{StackGroup}.{nameof(StackPanelGroupContext.Wrap)}")
            .AddChildren(DemoUI.CreateTiles(5))
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(StackGroup, "Stack panel", nameof(StackPanelMainController.CycleStackGroupOption))
        );
}
