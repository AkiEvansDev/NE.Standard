using DemoApp.Controllers.Actions;
using DemoApp.Controllers.Base;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Actions;

/// <summary>
/// One action, and every property that can be bound to it — the button's bindings plus the trailing pair.
/// </summary>
internal sealed class ActionMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ButtonGroup = nameof(ActionMainController.ButtonGroup);
    private const string ActionGroup = nameof(ActionMainController.ActionGroup);
    private const string ContentGroup = nameof(ActionMainController.ContentGroup);
    private const string LayoutGroup = nameof(ActionMainController.LayoutGroup);
    private const string BadgeGroup = nameof(ActionMainController.BadgeGroup);
    private const string BorderGroup = nameof(ActionMainController.BorderGroup);

    public static string ViewKey => "demo.actions.action.main";

    protected override string ComponentRoute => "/actions/action";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.actions.action.header";
    protected override string HeaderDescription => "demo.actions.action.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(
            DemoButtonBindings.Bind(new ActionComponent(), ButtonGroup, ContentGroup, LayoutGroup, BadgeGroup, BorderGroup)
                .BindTrailingText($"{ActionGroup}.{nameof(ActionGroupContext.TrailingText)}")
                .BindTrailingIcon($"{ActionGroup}.{nameof(ActionGroupContext.TrailingIcon)}")
                .BindShowChevron($"{ActionGroup}.{nameof(ActionGroupContext.ShowChevron)}")
                .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ButtonGroup, "Button", nameof(ActionMainController.CycleButtonOption)),
            DemoUI.CreateOptionSection(ActionGroup, "Action", nameof(ActionMainController.CycleActionOption)),
            DemoUI.CreateOptionSection(LayoutGroup, "Layout", nameof(ActionMainController.CycleLayoutOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(ActionMainController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(ActionMainController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(ActionMainController.CycleBorderOption))
        );
}
