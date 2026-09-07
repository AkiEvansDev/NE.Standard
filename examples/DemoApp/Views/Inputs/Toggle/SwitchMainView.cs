using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Inputs.Toggle;

/// <summary>
/// One switch, and every property that can be bound to it — the checkbox's page over the other drawing.
/// </summary>
internal sealed class SwitchMainView : ToggleMainView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.switch.main";

    protected override string ComponentRoute => "/inputs/switch";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.switch.header";
    protected override string HeaderDescription => "demo.inputs.switch.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(Bind(new SwitchComponent())));
}
