using System.Collections.Generic;
using DemoApp.Controllers.Indicators.Spinner;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Indicators.Spinner;

internal sealed class SpinnerBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.indicators.spinner.binding";

    protected override string ComponentRoute => "/indicators/spinner";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.indicators.spinner.header";
    protected override string HeaderDescription => "demo.indicators.spinner.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateSpinnerGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(new SpinnerComponent());

    private static ContainerComponent CreateSpinnerGroup()
    {
        return DemoUI.CreateGroup(nameof(SpinnerBindingController.SpinnerGroup), "Spinner",
            content => content.AddChild(new SpinnerComponent()
                .BindSize(nameof(SpinnerGroupContext.Size), UIBindingScope.Relative)
                .BindColor(nameof(SpinnerGroupContext.Color), UIBindingScope.Relative)
                .BindLabel(nameof(SpinnerGroupContext.Label), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Size"] = nameof(SpinnerBindingController.CycleSize),
                ["Color"] = nameof(SpinnerBindingController.CycleColor),
                ["Label"] = nameof(SpinnerBindingController.ToggleLabel),
            })
        );
    }
}
