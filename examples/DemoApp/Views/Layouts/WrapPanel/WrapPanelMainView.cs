using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.WrapPanel;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Layouts.WrapPanel;

/// <summary>
/// One wrapping panel, and every property that can be bound to it.
/// </summary>
/// <remarks>Unlike a stack panel told to wrap, it sizes what it holds by the column span each child claims, out of twenty-four.</remarks>
internal sealed class WrapPanelMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string WrapGroup = nameof(WrapPanelMainController.WrapGroup);

    public static string ViewKey => "demo.layouts.wrap-panel.main";

    protected override string ComponentRoute => "/layouts/wrap-panel";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main];
    protected override string Header => "demo.layouts.wrap-panel.header";
    protected override string HeaderDescription => "demo.layouts.wrap-panel.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new WrapPanelComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSpacing($"{WrapGroup}.{nameof(WrapPanelGroupContext.Spacing)}")
            .BindLineSpacing($"{WrapGroup}.{nameof(WrapPanelGroupContext.LineSpacing)}")
            // Two columns of twenty-four: near-square tiles, and twenty of them do not fill the second row.
            .AddChildren(DemoUI.CreateSpannedTiles(20, 2))
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(WrapGroup, "Wrap panel", nameof(WrapPanelMainController.CycleWrapGroupOption))
        );
}
