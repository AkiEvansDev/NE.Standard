using DemoApp.Controllers.Base;
using DemoApp.Controllers.Indicators.Spinner;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Indicators.Spinner;

/// <summary>
/// One waiting mark, and every property that can be bound to it.
/// </summary>
internal sealed class SpinnerMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string SpinnerGroup = nameof(SpinnerMainController.SpinnerGroup);

    public static string ViewKey => "demo.indicators.spinner.main";

    protected override string ComponentRoute => "/indicators/spinner";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.indicators.spinner.header";
    protected override string HeaderDescription => "demo.indicators.spinner.description";

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
            DemoUI.CreateOptionSection(SpinnerGroup, "Spinner", nameof(SpinnerMainController.CycleSpinnerGroupOption))
        );
}
