using DemoApp.Controllers.Mechanisms;
using DemoApp.Views.Base;

namespace DemoApp.Views.Mechanisms;

/// <summary>
/// What a command does between the press and the answer: how the wait is shown, what a second press meets, progress, work that
/// leaves the page free, a failure, answers that are not state, and state kept in the address — one behaviour to a section.
/// </summary>
/// <remarks>The page is words, not samples: every title, note, button and line is a key, in each of the demo's languages.</remarks>
internal sealed class CommandsView : DemoMechanismView, IUIViewDefinition
{
    private const string Words = "demo.mechanisms.commands.";

    // Authored ids, because one button names the other in a cross-component interaction.
    private const string ApproveId = "decision-approve";
    private const string RejectId = "decision-reject";

    public static string ViewKey => "demo.mechanisms.commands";

    protected override string ComponentRoute => "/mechanisms/commands";
    protected override string Header => "demo.mechanisms.commands.header";
    protected override string HeaderDescription => "demo.mechanisms.commands.description";

    // Read across, two to a row: the wait, a second press, long work, a failure, answers that are not state, the address. The three
    // short answers stack beside the background job, as tall as they are together.
    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(
            CreateWaitGroup(),
            CreateBusyGroup(),
            CreateRepeatGroup(),
            CreateSelfOffGroup(),
            CreateDecisionGroup(),
            CreateProgressGroup(),
            CreateThrowGroup(),
            CreateRefuseGroup(),
            CreateBackgroundGroup(),
            DemoUI.CreateHalf(CreateNavigateGroup(), CreateDownloadGroup(), CreateAnnounceGroup()),
            CreateAddressGroup()
        );

    private static ContainerComponent CreateWaitGroup()
        => DemoUI.CreateExample(Words + "wait.title",
            new ButtonComponent()
                .SetType(UIButtonType.Primary)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                .SetTitle("demo.mechanisms.commands.deploy")
                .OnClickShowingLoading(nameof(CommandsController.DeployAsync)),
            note: Words + "wait.note",
            context: nameof(CommandsController.WaitGroup),
            controller: [DemoCode.Of<CommandsController>(nameof(CommandsController.WaitGroup), nameof(CommandsController.DeployAsync))],
            words: true
        );

    private static ContainerComponent CreateBusyGroup()
        => DemoUI.CreateExample(Words + "busy.title",
            new ButtonComponent()
                .SetType(UIButtonType.Primary)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                .SetTitle("demo.mechanisms.commands.deploy")
                .BindLoading(nameof(BusyGroupContext.Busy), UIBindingScope.Relative)
                .OnClick(nameof(CommandsController.DeployBoundAsync)),
            note: Words + "busy.note",
            context: nameof(CommandsController.BusyGroup),
            controller: [DemoCode.Of<BusyGroupContext>(), DemoCode.Of<CommandsController>(nameof(CommandsController.BusyGroup), nameof(CommandsController.DeployBoundAsync))],
            words: true
        );

    private static ContainerComponent CreateRepeatGroup()
        => DemoUI.CreateExample(Words + "repeat.title",
            new ButtonComponent()
                .SetType(UIButtonType.Outline)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetTitle("demo.mechanisms.commands.charge")
                .BindBadgeText(nameof(CountGroupContext.Count), UIBindingScope.Relative)
                .SetBadgeStyle(UIBadgeType.Surface)
                .OnClick(nameof(CommandsController.ChargeAsync)),
            note: Words + "repeat.note",
            context: nameof(CommandsController.RepeatGroup),
            controller: [DemoCode.Of<CountGroupContext>(), DemoCode.Of<CommandsController>(nameof(CommandsController.RepeatGroup), nameof(CommandsController.ChargeAsync))],
            words: true
        );

    private static ContainerComponent CreateSelfOffGroup()
        => DemoUI.CreateExample(Words + "self-off.title",
            new ButtonComponent()
                .SetType(UIButtonType.Primary)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetTitle("demo.mechanisms.commands.charge")
                .BindBadgeText(nameof(CountGroupContext.Count), UIBindingScope.Relative)
                .SetBadgeStyle(UIBadgeType.Surface)
                .BindEnabled(nameof(CountGroupContext.Enabled), UIBindingScope.Relative)
                .InteractBeforeClick(IVisualComponent.EnabledProperty, false)
                .OnClick(nameof(CommandsController.ChargeGuardedAsync)),
            note: Words + "self-off.note",
            context: nameof(CommandsController.SelfOffGroup),
            controller: [DemoCode.Of<CountGroupContext>(), DemoCode.Of<CommandsController>(nameof(CommandsController.SelfOffGroup), nameof(CommandsController.ChargeGuardedAsync))],
            words: true
        );

    private static ContainerComponent CreateDecisionGroup()
        => DemoUI.CreateExample(Words + "decision.title",
            UILayout.Row(12)
                .AddChild(new ButtonComponent(ApproveId)
                    .SetType(UIButtonType.Primary)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Check))
                    .SetTitle("demo.mechanisms.commands.decision.approve")
                    .BindEnabled(nameof(DecisionGroupContext.Open), UIBindingScope.Relative)
                    .InteractBeforeClick(IVisualComponent.EnabledProperty, false)
                    .InteractBeforeClick(RejectId, IVisualComponent.EnabledProperty, false)
                    .OnClick(nameof(CommandsController.ApproveAsync))
                )
                .AddChild(new ButtonComponent(RejectId)
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Close))
                    .SetTitle("demo.mechanisms.commands.decision.reject")
                    .BindEnabled(nameof(DecisionGroupContext.Open), UIBindingScope.Relative)
                    .InteractBeforeClick(IVisualComponent.EnabledProperty, false)
                    .InteractBeforeClick(ApproveId, IVisualComponent.EnabledProperty, false)
                    .OnClick(nameof(CommandsController.RejectAsync))
                )
                .AddChild(new BadgeComponent()
                    .SetVerticalAlignment(UIAlignment.Center)
                    .BindText(nameof(DecisionGroupContext.Outcome), UIBindingScope.Relative)
                    .BindType(nameof(DecisionGroupContext.OutcomeStyle), UIBindingScope.Relative)
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Undo))
                    .SetTooltip("demo.mechanisms.commands.decision.reopen")
                    .OnClick(nameof(CommandsController.ReopenRequest))
                ),
            note: Words + "decision.note",
            context: nameof(CommandsController.DecisionGroup),
            controller: [DemoCode.Of<DecisionGroupContext>(), DemoCode.Of<CommandsController>(nameof(CommandsController.DecisionGroup), nameof(CommandsController.ApproveAsync), nameof(CommandsController.RejectAsync), nameof(CommandsController.ReopenRequest))],
            words: true
        );

    private static ContainerComponent CreateProgressGroup()
        => DemoUI.CreateExample(Words + "progress.title",
            UILayout.Row(12)
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
                    .SetTitle("demo.mechanisms.commands.progress.provision")
                    // Bound only: the spinner reports the server's progress, not the round trip.
                    .BindLoading(nameof(ProgressGroupContext.Busy), UIBindingScope.Relative)
                    .OnClick(nameof(CommandsController.ProvisionAsync))
                )
                .AddChild(new BadgeComponent()
                    .SetVerticalAlignment(UIAlignment.Center)
                    .BindText(nameof(ProgressGroupContext.Stage), UIBindingScope.Relative)
                    .BindType(nameof(ProgressGroupContext.StageStyle), UIBindingScope.Relative)
                ),
            note: Words + "progress.note",
            context: nameof(CommandsController.ProgressGroup),
            controller: [DemoCode.Of<ProgressGroupContext>(), DemoCode.Of<CommandsController>("ProvisioningStages", nameof(CommandsController.ProgressGroup), nameof(CommandsController.ProvisionAsync))],
            words: true
        );

    private static ContainerComponent CreateBackgroundGroup()
        => DemoUI.CreateExample(Words + "background.title",
            UILayout.Stack(12)
                .AddChild(UILayout.Row(12)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                        .SetTitle("demo.mechanisms.commands.background.back-up")
                        .OnClickShowingLoading(nameof(CommandsController.BackUpAsync))
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetTitle("demo.mechanisms.commands.background.cancel")
                        .OnClick(nameof(CommandsController.CancelBackup))
                    )
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("demo.mechanisms.commands.background.note-field")
                    .BindValue(nameof(BackgroundGroupContext.Note), UIBindingScope.Relative)
                )
                .AddChild(new TextComponent()
                    .SetTitle("demo.mechanisms.commands.background.server-holds")
                    .AsBody()
                    .BindDescription(nameof(BackgroundGroupContext.Note), UIBindingScope.Relative)
                ),
            note: Words + "background.note",
            context: nameof(CommandsController.BackgroundGroup),
            controller: [DemoCode.Of<BackgroundGroupContext>(), DemoCode.Of<CommandsController>(nameof(CommandsController.BackgroundGroup), nameof(CommandsController.BackUpAsync), nameof(CommandsController.CancelBackup))],
            words: true
        );

    private static ContainerComponent CreateAddressGroup()
        => DemoUI.CreateExample(Words + "address.title",
            UILayout.Row(12)
                .AddChild(new SelectComponent()
                    .SetWidth(UILayoutLength.Absolute(160))
                    .SetOptions(
                    [
                        new OptionItem { Id = AddressGroupContext.Starter, Title = "demo.mechanisms.commands.address.starter" },
                        new OptionItem { Id = AddressGroupContext.Standard, Title = "demo.mechanisms.commands.address.standard" },
                        new OptionItem { Id = AddressGroupContext.Pro, Title = "demo.mechanisms.commands.address.pro" }
                    ])
                    .BindValue(nameof(AddressGroupContext.Plan), UIBindingScope.Relative)
                    .OnChange(nameof(CommandsController.ChoosePlan))
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.ArrowRight))
                    .SetTitle("demo.mechanisms.commands.address.next")
                    .OnClick(nameof(CommandsController.NextStep))
                )
                .AddChild(new BadgeComponent()
                    .SetVerticalAlignment(UIAlignment.Center)
                    .BindText(nameof(AddressGroupContext.StepLine), UIBindingScope.Relative)
                ),
            note: Words + "address.note",
            columns: 24,
            context: nameof(CommandsController.AddressGroup),
            controller: [DemoCode.Of<AddressGroupContext>(), DemoCode.Of<CommandsController>(nameof(CommandsController.AddressGroup), "OnNavigatedAsync", nameof(CommandsController.ChoosePlan), nameof(CommandsController.NextStep), "Query")],
            words: true
        );

    private static ContainerComponent CreateThrowGroup()
        => DemoUI.CreateExample(Words + "throw.title",
            new ButtonComponent()
                .SetType(UIButtonType.Outline)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetTitle("demo.mechanisms.commands.throw.release")
                .OnClick(nameof(CommandsController.FailUnhandled)),
            note: Words + "throw.note",
            context: nameof(CommandsController.ThrowGroup),
            controller: [DemoCode.Of<CommandsController>(nameof(CommandsController.ThrowGroup), nameof(CommandsController.FailUnhandled))],
            words: true
        );

    private static ContainerComponent CreateRefuseGroup()
        => DemoUI.CreateExample(Words + "refuse.title",
            new ButtonComponent()
                .SetType(UIButtonType.Outline)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetTitle("demo.mechanisms.commands.throw.release")
                .OnClick(nameof(CommandsController.FailReported)),
            note: Words + "refuse.note",
            context: nameof(CommandsController.RefuseGroup),
            controller: [DemoCode.Of<CommandsController>(nameof(CommandsController.RefuseGroup), nameof(CommandsController.FailReported))],
            words: true
        );

    private static ContainerComponent CreateNavigateGroup()
        => DemoUI.CreateExample(Words + "navigate.title",
            new ButtonComponent()
                .SetType(UIButtonType.Outline)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetIcon(DemoIcons.Outline(DemoIcons.ArrowRight))
                .SetTitle("demo.mechanisms.commands.navigate.go")
                .OnClick(nameof(CommandsController.GoToButton)),
            note: Words + "navigate.note",
            context: nameof(CommandsController.NavigateGroup),
            controller: [DemoCode.Of<CommandsController>(nameof(CommandsController.NavigateGroup), nameof(CommandsController.GoToButton))],
            words: true
        );

    private static ContainerComponent CreateDownloadGroup()
        => DemoUI.CreateExample(Words + "download.title",
            new ButtonComponent()
                .SetType(UIButtonType.Outline)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                .SetTitle("demo.mechanisms.commands.download.report")
                .OnClick(nameof(CommandsController.DownloadReportAsync)),
            note: Words + "download.note",
            context: nameof(CommandsController.DownloadGroup),
            controller: [DemoCode.Of<CommandsController>(nameof(CommandsController.DownloadGroup), nameof(CommandsController.DownloadReportAsync))],
            words: true
        );

    private static ContainerComponent CreateAnnounceGroup()
        => DemoUI.CreateExample(Words + "announce.title",
            new ButtonComponent()
                .SetType(UIButtonType.Outline)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetIcon(DemoIcons.Outline(DemoIcons.MessageSquare))
                .SetTitle("demo.mechanisms.commands.announce.save")
                .OnClick(nameof(CommandsController.SaveQuietly)),
            note: Words + "announce.note",
            context: nameof(CommandsController.AnnounceGroup),
            controller: [DemoCode.Of<CommandsController>(nameof(CommandsController.AnnounceGroup), nameof(CommandsController.SaveQuietly))],
            words: true
        );
}
