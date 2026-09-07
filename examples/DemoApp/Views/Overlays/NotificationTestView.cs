using DemoApp.Controllers.Overlays;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Overlays;

/// <summary>
/// A toast says how something went; the line on the page says what it left behind. Four things that push one.
/// </summary>
/// <remarks>A notification has no component: a command returns an effect and the client builds the host on demand, in the corner the view asks for.</remarks>
internal sealed class NotificationTestView : DemoTestView, IUIViewDefinition
{
    private const string DeployGroup = nameof(NotificationTestController.DeployGroup);
    private const string JobGroup = nameof(NotificationTestController.JobGroup);
    private const string StackGroup = nameof(NotificationTestController.StackGroup);
    private const string WrapGroup = nameof(NotificationTestController.WrapGroup);

    public static string ViewKey => "demo.overlays.notification.test";

    /// <summary>The demo's shell, plus the top corner for the toasts: placement is the view's, so this page is the one that shows the other corner.</summary>
    public override UIViewOptions Options => new()
    {
        StickyHeader = true,
        ScrollContentOnly = true,
        NotificationPlacement = UINotificationPlacement.Top
    };

    protected override string ComponentRoute => "/overlays/notification";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Test];
    protected override string Header => "demo.overlays.notification.header";
    protected override string HeaderDescription => "demo.overlays.notification.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateDeployGroup(), CreateStackGroup()],
            [CreateJobGroup(), CreateWrapGroup()]
        ));
    }

    /// <summary>Each target keeps the line its last deploy left; the toast is the moment, the line is the record.</summary>
    private static ContainerComponent CreateDeployGroup()
    {
        return DemoUI.CreateGroup(DeployGroup, "A command says how it went",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(DeployGroupContext.Staging), UIBindingScope.Relative)
                )
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(DeployGroupContext.Production), UIBindingScope.Relative)
                )
                .AddChild(DemoUI.CreateRow(8)
                    .AddChild(CreateButton("Deploy to staging", nameof(NotificationTestController.DeployStaging), UIButtonType.Primary))
                    .AddChild(CreateButton("Deploy to production", nameof(NotificationTestController.DeployProduction), UIButtonType.Outline))
                )
            ),
            contentMinHeight: 160,
            note: "Production takes every other build: the odd ones fail their health check, and a warning and a failure come in one result."
        );
    }

    /// <summary>The button waits for its own round trip, and the toast comes at the end of it.</summary>
    private static ContainerComponent CreateJobGroup()
    {
        return DemoUI.CreateGroup(JobGroup, "A job reports when it is done",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(JobGroupContext.LastRun), UIBindingScope.Relative)
                )
                .AddChild(new ButtonComponent()
                    .OnClickWithLoading(nameof(NotificationTestController.RunMigrationAsync))
                    .SetType(UIButtonType.Primary)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetTitle("Run the migration")
                )
            ),
            contentMinHeight: 140,
            note: "An async command: the effect rides on the result, so nothing shows until the work has actually finished; OnClickWithLoading keeps the button waiting meanwhile."
        );
    }

    /// <summary>Three in one result, and one more at a time: the host stacks them and each keeps its own timer.</summary>
    private static ContainerComponent CreateStackGroup()
    {
        return DemoUI.CreateGroup(StackGroup, "Several at once",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(StackGroupContext.Pushed), UIBindingScope.Relative)
                )
                .AddChild(DemoUI.CreateRow(8)
                    .AddChild(CreateButton("Three in one result", nameof(NotificationTestController.NotifyThree), UIButtonType.Outline))
                    .AddChild(CreateButton("One more", nameof(NotificationTestController.NotifyOneMore), UIButtonType.Outline))
                )
            ),
            contentMinHeight: 140
        );
    }

    private static ContainerComponent CreateWrapGroup()
    {
        return DemoUI.CreateGroup(WrapGroup, "A message that wraps",
            content => content.AddChild(CreateButton("Show", nameof(NotificationTestController.NotifyLong), UIButtonType.Outline)),
            contentMinHeight: 100,
            note: "The host keeps a toast to one column's width; a long message wraps inside it rather than widening it."
        );
    }

    private static ButtonComponent CreateButton(string title, string command, UIButtonType type)
        => new ButtonComponent()
            .OnClick(command)
            .SetType(type)
            .SetHorizontalAlignment(UIAlignment.Start)
            .SetTitle(title);
}
