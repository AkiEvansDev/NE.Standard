using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Inputs;

namespace DemoApp.Views.Inputs.Toggle;

/// <summary>
/// The same page a checkbox has, drawn with the other of the two toggles.
/// </summary>
internal sealed class SwitchExamplesView : ToggleExamplesView<SwitchComponent>, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.switch.examples";

    protected override string ComponentRoute => "/inputs/switch";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.switch.header";
    protected override string HeaderDescription => "demo.inputs.switch.description";

    protected override string ControlPlural => "switches";

    protected override SwitchComponent Create() => new();
}
