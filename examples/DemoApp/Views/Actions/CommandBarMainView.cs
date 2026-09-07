using DemoApp.Controllers.Actions;
using DemoApp.Controllers.Base;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Actions;

/// <summary>
/// One command bar, and every property that can be bound to it.
/// </summary>
/// <remarks>The bar has four rows; the rest step one of its buttons. <c>Wrap</c> is read with the Standard section's <c>Width</c>.</remarks>
internal sealed class CommandBarMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string BarGroup = nameof(CommandBarMainController.BarGroup);

    public static string ViewKey => "demo.actions.command-bar.main";

    protected override string ComponentRoute => "/actions/command-bar";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.actions.command-bar.header";
    protected override string HeaderDescription => "demo.actions.command-bar.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new CommandBarComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindOrientation($"{BarGroup}.{nameof(CommandBarGroupContext.Orientation)}")
            .BindWrap($"{BarGroup}.{nameof(CommandBarGroupContext.Wrap)}")
            .BindSpacing($"{BarGroup}.{nameof(CommandBarGroupContext.Spacing)}")
            .BindGroupSeparator($"{BarGroup}.{nameof(CommandBarGroupContext.GroupSeparator)}")
            .BindItems($"{BarGroup}.{nameof(CommandBarGroupContext.Commands)}")
            .OnItemClickWithItemKey(nameof(CommandBarMainController.Press))
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(BarGroup, "Command bar", nameof(CommandBarMainController.CycleBarGroupOption))
        );
}
