using DemoApp.Controllers.Overlays;
using DemoApp.Views.Base;

namespace DemoApp.Views.Overlays;

/// <summary>
/// A toast says how something went; the line on the page says what it left behind. Four things that push one.
/// </summary>
/// <remarks>
/// A notification has no component: a command returns an effect and the client builds the host on demand, in the corner the view asks
/// for. The page is words, not samples: every title, note, button and line is a key, in each of the demo's languages.
/// </remarks>
internal sealed class NotificationTestView : DemoTestView, IUIViewDefinition
{
    private const string DeployGroup = nameof(NotificationTestController.DeployGroup);
    private const string JobGroup = nameof(NotificationTestController.JobGroup);
    private const string StackGroup = nameof(NotificationTestController.StackGroup);
    private const string WrapGroup = nameof(NotificationTestController.WrapGroup);
    private const string Words = "demo.overlays.notification.";

    public static string ViewKey => "demo.overlays.notification.test";

    /// <summary>The demo's shell, plus the top corner for the toasts: placement is the view's, so this page is the one that shows the other corner.</summary>
    public override UIViewOptions Options => base.Options with { NotificationPlacement = UINotificationPlacement.Top };

    protected override string ComponentRoute => "/overlays/notification";
    protected override string Header => "demo.overlays.notification.header";
    protected override string HeaderDescription => "demo.overlays.notification.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateDeployGroup(), CreateStackGroup()], [CreateJobGroup(), CreateWrapGroup()]));

    /// <summary>Each target keeps the line its last deploy left; the toast is the moment, the line is the record.</summary>
    private static ContainerComponent CreateDeployGroup()
    {
        return DemoUI.CreateGroup(DeployGroup, Words + "deploy.title",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(DeployGroupContext.Staging), UIBindingScope.Relative)
                )
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(DeployGroupContext.Production), UIBindingScope.Relative)
                )
                .AddChild(UILayout.Row(8)
                    .AddChild(CreateButton(Words + "deploy.staging", nameof(NotificationTestController.DeployStaging), UIButtonType.Primary))
                    .AddChild(CreateButton(Words + "deploy.production", nameof(NotificationTestController.DeployProduction), UIButtonType.Outline))
                )
            ),
            note: Words + "deploy.note",
            words: true
        );
    }

    /// <summary>The button waits for its own round trip, and the toast comes at the end of it.</summary>
    private static ContainerComponent CreateJobGroup()
    {
        return DemoUI.CreateGroup(JobGroup, Words + "job.title",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(JobGroupContext.LastRun), UIBindingScope.Relative)
                )
                .AddChild(new ButtonComponent()
                    .OnClickShowingLoading(nameof(NotificationTestController.RunMigrationAsync))
                    .SetType(UIButtonType.Primary)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetTitle(Words + "job.run")
                )
            ),
            note: Words + "job.note",
            words: true
        );
    }

    /// <summary>Three in one result, and one more at a time: the host stacks them and each keeps its own timer.</summary>
    private static ContainerComponent CreateStackGroup()
    {
        return DemoUI.CreateGroup(StackGroup, Words + "stack.title",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(StackGroupContext.Pushed), UIBindingScope.Relative)
                )
                .AddChild(UILayout.Row(8)
                    .AddChild(CreateButton(Words + "stack.three", nameof(NotificationTestController.NotifyThree), UIButtonType.Outline))
                    .AddChild(CreateButton(Words + "stack.one-more", nameof(NotificationTestController.NotifyOneMore), UIButtonType.Outline))
                )
            ),
            words: true
        );
    }

    private static ContainerComponent CreateWrapGroup()
    {
        return DemoUI.CreateGroup(WrapGroup, Words + "wrap.title",
            content => content.AddChild(CreateButton(Words + "wrap.show", nameof(NotificationTestController.NotifyLong), UIButtonType.Outline)),
            note: Words + "wrap.note",
            words: true
        );
    }

    private static ButtonComponent CreateButton(string title, string command, UIButtonType type)
        => new ButtonComponent()
            .OnClick(command)
            .SetType(type)
            .SetHorizontalAlignment(UIAlignment.Start)
            .SetTitle(title);
}
