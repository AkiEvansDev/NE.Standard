using DemoApp.Controllers.Actions;
using DemoApp.Controllers.Base;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Actions;

/// <summary>
/// One button, and every property that can be bound to it, through <see cref="DemoButtonBindings"/>.
/// </summary>
/// <remarks><c>SubmitFormId</c> has no row: there is no form on this page for it to name.</remarks>
internal sealed class ButtonMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ButtonGroup = nameof(ButtonMainController.ButtonGroup);
    private const string ContentGroup = nameof(ButtonMainController.ContentGroup);
    private const string LayoutGroup = nameof(ButtonMainController.LayoutGroup);
    private const string BadgeGroup = nameof(ButtonMainController.BadgeGroup);
    private const string BorderGroup = nameof(ButtonMainController.BorderGroup);

    public static string ViewKey => "demo.actions.button.main";

    protected override string ComponentRoute => "/actions/button";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.actions.button.header";
    protected override string HeaderDescription => "demo.actions.button.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(
            DemoButtonBindings.Bind(new ButtonComponent(), ButtonGroup, ContentGroup, LayoutGroup, BadgeGroup, BorderGroup)
                .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ButtonGroup, "Button", nameof(ButtonMainController.CycleButtonOption)),
            DemoUI.CreateOptionSection(LayoutGroup, "Layout", nameof(ButtonMainController.CycleLayoutOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(ButtonMainController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(ButtonMainController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(ButtonMainController.CycleBorderOption))
        );
}
