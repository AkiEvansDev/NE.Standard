using DemoApp.Controllers.Mechanisms;
using DemoApp.Views.Base;

namespace DemoApp.Views.Mechanisms;

/// <summary>
/// What a command does between the press and the answer: how the wait is shown, what a second press meets, progress, work that
/// leaves the page free, a failure, and answers that are not state.
/// </summary>
/// <remarks>
/// Most groups are the same command wired more than one way, since none of it is visible on its own. The page is words, not samples:
/// every title, note, button and line is a key, in each of the demo's languages.
/// </remarks>
internal sealed class CommandsView : DemoMechanismView, IUIViewDefinition
{
    private const string LatencyGroup = nameof(CommandsController.LatencyGroup);
    private const string GuardGroup = nameof(CommandsController.GuardGroup);
    private const string DecisionGroup = nameof(CommandsController.DecisionGroup);
    private const string ProgressGroup = nameof(CommandsController.ProgressGroup);
    private const string ReportGroup = nameof(CommandsController.ReportGroup);
    private const string EffectGroup = nameof(CommandsController.EffectGroup);
    private const string BackgroundGroup = nameof(CommandsController.BackgroundGroup);
    private const string Words = "demo.mechanisms.commands.";

    // Authored ids, because one button names the other in a cross-component interaction.
    private const string ApproveId = "decision-approve";
    private const string RejectId = "decision-reject";

    public static string ViewKey => "demo.mechanisms.commands";

    protected override string ComponentRoute => "/mechanisms/commands";
    protected override string Header => "demo.mechanisms.commands.header";
    protected override string HeaderDescription => "demo.mechanisms.commands.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        // Seven groups: the two short answers stacked beside the long job, as tall together, so the failure does not stand alone.
        _ = container
            .AddChildren(DemoUI.CreateColumns([CreateLatencyGroup(), CreateDecisionGroup()], [CreateGuardGroup(), CreateProgressGroup()]))
            .AddChild(DemoUI.CreateHalf(CreateEffectGroup(), CreateFailureGroup()))
            .AddChild(CreateBackgroundGroup());
    }

    /// <summary>
    /// One command, three views of it: a pair of interactions, a bound property, and neither.
    /// </summary>
    private static ContainerComponent CreateLatencyGroup()
    {
        return DemoUI.CreateGroup(LatencyGroup, Words + "latency.title",
            content => content.AddChild(UILayout.Row(12)
                .AddChild(new ButtonComponent()
                    .OnClickShowingLoading(nameof(CommandsController.DeployAsync))
                    .SetType(UIButtonType.Primary)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                    .SetTitle(Words + "latency.deploy")
                    .SetDescription(Words + "latency.interactions")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetTooltip(Words + "latency.interactions.tooltip")
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.DeployBoundAsync))
                    .BindLoading(nameof(ButtonLatencyGroupContext.Busy), UIBindingScope.Relative)
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                    .SetTitle(Words + "latency.deploy")
                    .SetDescription(Words + "latency.bound")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetTooltip(Words + "latency.bound.tooltip")
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.DeployAsync))
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                    .SetTitle(Words + "latency.deploy")
                    .SetDescription(Words + "latency.neither")
                    .SetDescriptionType(UITextAppearance.Caption)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: Words + "latency.note",
            words: true
        );
    }

    /// <summary>
    /// Pressed repeatedly, both counters move once: the client refuses a command already in flight.
    /// </summary>
    private static ContainerComponent CreateGuardGroup()
    {
        return DemoUI.CreateGroup(GuardGroup, Words + "guard.title",
            content => content.AddChild(UILayout.Row(12)
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.ChargeGuardedAsync))
                    .InteractBeforeClick(IVisualComponent.EnabledProperty, false)
                    .BindEnabled(nameof(ButtonGuardGroupContext.GuardedEnabled), UIBindingScope.Relative)
                    .SetType(UIButtonType.Primary)
                    .SetTitle(Words + "guard.guarded")
                    .SetDescription(Words + "guard.guarded.description")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .BindBadgeText(nameof(ButtonGuardGroupContext.GuardedCount), UIBindingScope.Relative)
                    .SetBadgeStyle(UIBadgeType.Surface)
                    .SetTooltip(Words + "guard.guarded.tooltip")
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.ChargePlainAsync))
                    .SetType(UIButtonType.Outline)
                    .SetTitle(Words + "guard.plain")
                    .SetDescription(Words + "guard.plain.description")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .BindBadgeText(nameof(ButtonGuardGroupContext.PlainCount), UIBindingScope.Relative)
                    .SetBadgeStyle(UIBadgeType.Surface)
                    .SetTooltip(Words + "guard.plain.tooltip")
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.ResetCounts))
                    .SetType(UIButtonType.Ghost)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Undo))
                    .SetTooltip(Words + "guard.reset")
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: Words + "guard.note",
            words: true
        );
    }

    /// <summary>
    /// Two buttons, two commands, only one of which may run: each press turns both off through an interaction.
    /// </summary>
    private static ContainerComponent CreateDecisionGroup()
    {
        return DemoUI.CreateGroup(DecisionGroup, Words + "decision.title",
            content => content.AddChild(UILayout.Row(12)
                .AddChild(new ButtonComponent(ApproveId)
                    .OnClick(nameof(CommandsController.ApproveAsync))
                    .InteractBeforeClick(IVisualComponent.EnabledProperty, false)
                    .InteractBeforeClick(RejectId, IVisualComponent.EnabledProperty, false)
                    .BindEnabled(nameof(ButtonDecisionGroupContext.Open), UIBindingScope.Relative)
                    .SetType(UIButtonType.Primary)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Check))
                    .SetTitle(Words + "decision.approve")
                )
                .AddChild(new ButtonComponent(RejectId)
                    .OnClick(nameof(CommandsController.RejectAsync))
                    .InteractBeforeClick(IVisualComponent.EnabledProperty, false)
                    .InteractBeforeClick(ApproveId, IVisualComponent.EnabledProperty, false)
                    .BindEnabled(nameof(ButtonDecisionGroupContext.Open), UIBindingScope.Relative)
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Close))
                    .SetTitle(Words + "decision.reject")
                )
                .AddChild(new BadgeComponent()
                    .SetVerticalAlignment(UIAlignment.Center)
                    .BindText(nameof(ButtonDecisionGroupContext.Outcome), UIBindingScope.Relative)
                    .BindType(nameof(ButtonDecisionGroupContext.OutcomeStyle), UIBindingScope.Relative)
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.ReopenRequest))
                    .SetType(UIButtonType.Ghost)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Undo))
                    .SetTooltip(Words + "decision.reopen")
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: Words + "decision.note",
            words: true
        );
    }

    /// <summary>
    /// One command, five writes, arriving over the push channel while it is still awaiting.
    /// </summary>
    private static ContainerComponent CreateProgressGroup()
    {
        return DemoUI.CreateGroup(ProgressGroup, Words + "progress.title",
            content => content.AddChild(UILayout.Row(12)
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.ProvisionAsync))
                    // Bound only: the spinner reports the server's progress, not the round trip.
                    .BindLoading(nameof(ButtonProgressGroupContext.Busy), UIBindingScope.Relative)
                    .SetType(UIButtonType.Primary)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
                    .SetTitle(Words + "progress.provision")
                )
                .AddChild(new BadgeComponent()
                    .SetVerticalAlignment(UIAlignment.Center)
                    .BindText(nameof(ButtonProgressGroupContext.Stage), UIBindingScope.Relative)
                    .BindType(nameof(ButtonProgressGroupContext.StageStyle), UIBindingScope.Relative)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: Words + "progress.note",
            words: true
        );
    }

    /// <summary>
    /// A background command: answered at once, its result pushed when it ends, so the tab is not held while it runs.
    /// </summary>
    private static ContainerComponent CreateBackgroundGroup()
    {
        return DemoUI.CreateGroup(BackgroundGroup, Words + "background.title",
            content => content.AddChild(UILayout.Stack(12)
                .AddChild(UILayout.Row(12)
                    .AddChild(new ButtonComponent()
                        .OnClickShowingLoading(nameof(CommandsController.BackUpAsync))
                        .SetType(UIButtonType.Primary)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                        .SetTitle(Words + "background.back-up")
                        .SetTooltip(Words + "background.back-up.tooltip")
                    )
                    .AddChild(new ButtonComponent()
                        .OnClick(nameof(CommandsController.CancelBackup))
                        .SetType(UIButtonType.Ghost)
                        .SetTitle(Words + "background.cancel")
                    )
                )
                .AddChild(new TextInputComponent()
                    .SetTitle(Words + "background.note-field")
                    .BindValue(nameof(ButtonBackgroundGroupContext.Note), UIBindingScope.Relative)
                )
                .AddChild(new TextComponent()
                    .SetTitle(Words + "background.server-holds")
                    .AsBody()
                    .BindDescription(nameof(ButtonBackgroundGroupContext.Note), UIBindingScope.Relative)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: Words + "background.note",
            words: true
        );
    }

    /// <summary>
    /// A command that throws still answers: the left button gets the framework's notification, the right returns an effect.
    /// </summary>
    private static ContainerComponent CreateFailureGroup()
    {
        return DemoUI.CreateGroup(ReportGroup, Words + "failure.title",
            content => content.AddChild(UILayout.Row(12)
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.FailUnhandled))
                    .SetType(UIButtonType.Outline)
                    .SetTitle(Words + "failure.throw")
                    .SetDescription(Words + "failure.throw.description")
                    .SetDescriptionType(UITextAppearance.Caption)
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.FailReported))
                    .SetType(UIButtonType.Outline)
                    .SetTitle(Words + "failure.refuse")
                    .SetDescription(Words + "failure.refuse.description")
                    .SetDescriptionType(UITextAppearance.Caption)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: Words + "failure.note",
            words: true
        );
    }

    /// <summary>
    /// The two answers that are not state: a page to go to and a file to keep, neither of which could be a binding.
    /// </summary>
    private static ContainerComponent CreateEffectGroup()
    {
        return DemoUI.CreateGroup(EffectGroup, Words + "effect.title",
            content => content.AddChild(UILayout.Row(12)
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.GoToButton))
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.ArrowRight))
                    .SetTitle(Words + "effect.go")
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.DownloadReportAsync))
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                    .SetTitle(Words + "effect.download")
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: Words + "effect.note",
            words: true
        );
    }
}
