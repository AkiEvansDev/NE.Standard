using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Inputs.Toggle;

/// <summary>
/// One checkbox, and every property that can be bound to it.
/// </summary>
/// <remarks><c>BadgePlacement</c> has a row that shows nothing: a toggle is as wide as its text, so both placements agree.</remarks>
internal sealed class CheckboxMainView : ToggleMainView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.checkbox.main";

    protected override string ComponentRoute => "/inputs/checkbox";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.checkbox.header";
    protected override string HeaderDescription => "demo.inputs.checkbox.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(Bind(new CheckboxComponent())));
}
