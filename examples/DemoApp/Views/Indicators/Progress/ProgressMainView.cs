using DemoApp.Controllers.Base;
using DemoApp.Controllers.Indicators.Progress;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Indicators.Progress;

/// <summary>
/// One reading, and every property that can be bound to it.
/// </summary>
/// <remarks>An unset <c>Value</c> is indeterminate rather than empty; <c>Min</c> and <c>Max</c> are the window it is read against.</remarks>
internal sealed class ProgressMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ProgressGroup = nameof(ProgressMainController.ProgressGroup);

    public static string ViewKey => "demo.indicators.progress.main";

    protected override string ComponentRoute => "/indicators/progress";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.indicators.progress.header";
    protected override string HeaderDescription => "demo.indicators.progress.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ProgressComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindLabel($"{ProgressGroup}.{nameof(ProgressGroupContext.Label)}")
            .BindValue($"{ProgressGroup}.{nameof(ProgressGroupContext.Value)}")
            .BindMin($"{ProgressGroup}.{nameof(ProgressGroupContext.Min)}")
            .BindMax($"{ProgressGroup}.{nameof(ProgressGroupContext.Max)}")
            .BindVariant($"{ProgressGroup}.{nameof(ProgressGroupContext.Variant)}")
            .BindColor($"{ProgressGroup}.{nameof(ProgressGroupContext.Color)}")
            .BindShowValue($"{ProgressGroup}.{nameof(ProgressGroupContext.ShowValue)}")
            .BindValueUnit($"{ProgressGroup}.{nameof(ProgressGroupContext.ValueUnit)}")
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ProgressGroup, "Progress", nameof(ProgressMainController.CycleProgressGroupOption))
        );
}
