using System.Collections.Generic;
using DemoApp.Controllers.Indicators.Progress;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Indicators.Progress;

internal sealed class ProgressBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.indicators.progress.binding";

    protected override string ComponentRoute => "/indicators/progress";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.indicators.progress.header";
    protected override string HeaderDescription => "demo.indicators.progress.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateProgressGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {

        return CreateMainGroup(new ProgressComponent()
            .SetMinWidth(UILayoutLength.Absolute(80))
            .SetValue(40)
            .SetShowValue(true)
        );
    }

    private static ContainerComponent CreateProgressGroup()
    {
        return DemoUI.CreateGroup(nameof(ProgressBindingController.ProgressGroup), "Progress",
            content => content.AddChild(new ProgressComponent()
                .SetWidth(UILayoutLength.Absolute(280))
                .BindVariant(nameof(ProgressGroupContext.Variant), UIBindingScope.Relative)
                .BindColor(nameof(ProgressGroupContext.Color), UIBindingScope.Relative)
                .BindShowValue(nameof(ProgressGroupContext.ShowValue), UIBindingScope.Relative)
                .BindValue(nameof(ProgressGroupContext.Value), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Variant"] = nameof(ProgressBindingController.CycleVariant),
                ["Color"] = nameof(ProgressBindingController.CycleColor),
                ["Show value"] = nameof(ProgressBindingController.ToggleShowValue),
                ["Value"] = nameof(ProgressBindingController.CycleValueLevel),
                ["Simulate"] = nameof(ProgressBindingController.SimulateAsync),
            })
        );
    }
}
