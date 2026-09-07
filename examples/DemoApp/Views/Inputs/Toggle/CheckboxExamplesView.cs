using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Inputs;

namespace DemoApp.Views.Inputs.Toggle;

/// <summary>
/// A list of settings answered one at a time, and the label that makes each of them answerable.
/// </summary>
internal sealed class CheckboxExamplesView : ToggleExamplesView<CheckboxComponent>, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.checkbox.examples";

    protected override string ComponentRoute => "/inputs/checkbox";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.checkbox.header";
    protected override string HeaderDescription => "demo.inputs.checkbox.description";

    protected override string ControlPlural => "checkboxes";

    protected override CheckboxComponent Create() => new();
}
