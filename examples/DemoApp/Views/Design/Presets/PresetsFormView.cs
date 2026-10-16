namespace DemoApp.Views.Design.Presets;

/// <summary>The parts of a form besides its fields, and the rules the browser runs on them.</summary>
internal sealed class PresetsFormView : PresetsViewBase, IUIViewDefinition
{
    public static string ViewKey => "demo.design.presets.form";

    protected override string CurrentTabUrl => "/design/presets/form";

    protected override void DrawPresetsContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateHeading("UIForm — the parts of a form besides its fields"))
            .AddChildren(DemoUI.CreateColumns([CreateFieldGroup()], [CreateFormRowGroup()]))
            .AddChild(CreateSearchGroup());

        _ = container
            .AddChild(CreateHeading("ShownWhen, HiddenWhen, EnabledWhen — a rule run in the browser"))
            .AddChildren(DemoUI.CreateColumns([CreateShownGroup()], [CreateEnabledGroup()]));
    }
}
