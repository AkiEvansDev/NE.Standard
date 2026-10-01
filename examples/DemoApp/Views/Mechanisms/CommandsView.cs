using DemoApp.Controllers.Mechanisms;
using DemoApp.Views.Base;

namespace DemoApp.Views.Mechanisms;

/// <summary>
/// What a command does between the press and the answer: how the wait is shown, what a second press meets, progress, work that
/// leaves the page free, a failure, and answers that are not state.
/// </summary>
/// <remarks>Most groups are the same command wired more than one way, since none of it is visible on its own.</remarks>
internal sealed class CommandsView : DemoMechanismView, IUIViewDefinition
{
    private const string LatencyGroup = nameof(CommandsController.LatencyGroup);
    private const string GuardGroup = nameof(CommandsController.GuardGroup);
    private const string DecisionGroup = nameof(CommandsController.DecisionGroup);
    private const string ProgressGroup = nameof(CommandsController.ProgressGroup);
    private const string ReportGroup = nameof(CommandsController.ReportGroup);
    private const string EffectGroup = nameof(CommandsController.EffectGroup);
    private const string BackgroundGroup = nameof(CommandsController.BackgroundGroup);

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
        return DemoUI.CreateGroup(LatencyGroup, "Three ways to say it is running",
            content => content.AddChild(UILayout.Row(12)
                .AddChild(new ButtonComponent()
                    .OnClickShowingLoading(nameof(CommandsController.DeployAsync))
                    .SetType(UIButtonType.Primary)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                    .SetTitle("Deploy")
                    .SetDescription("One call, two interactions, nothing bound")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetTooltip("OnClickShowingLoading: InteractBeforeClick(Loading, true) and InteractAfterClick(Loading, false)")
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.DeployBoundAsync))
                    .BindLoading(nameof(ButtonLatencyGroupContext.Busy), UIBindingScope.Relative)
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                    .SetTitle("Deploy")
                    .SetDescription("Bound, and the command writes it")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetTooltip("BindLoading(Busy) — the spinner is the server's answer, not the round trip")
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.DeployAsync))
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                    .SetTitle("Deploy")
                    .SetDescription("Neither")
                    .SetDescriptionType(UITextAppearance.Caption)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Press each of them: the first two spinners are the same round trip seen from the client and from the server, and the third button is what one looks like before either has been chosen."
        );
    }

    /// <summary>
    /// Pressed repeatedly, both counters move once: the client refuses a command already in flight.
    /// </summary>
    private static ContainerComponent CreateGuardGroup()
    {
        return DemoUI.CreateGroup(GuardGroup, "Pressed twice",
            content => content.AddChild(UILayout.Row(12)
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.ChargeGuardedAsync))
                    .InteractBeforeClick(IVisualComponent.EnabledProperty, false)
                    .BindEnabled(nameof(ButtonGuardGroupContext.GuardedEnabled), UIBindingScope.Relative)
                    .SetType(UIButtonType.Primary)
                    .SetTitle("Charge card")
                    .SetDescription("Says it took the press")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .BindBadgeText(nameof(ButtonGuardGroupContext.GuardedCount), UIBindingScope.Relative)
                    .SetBadgeStyle(UIBadgeType.Surface)
                    .SetTooltip("Off before the press leaves the browser, on again when the command finishes")
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.ChargePlainAsync))
                    .SetType(UIButtonType.Outline)
                    .SetTitle("Charge card, bare")
                    .SetDescription("Refused in silence")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .BindBadgeText(nameof(ButtonGuardGroupContext.PlainCount), UIBindingScope.Relative)
                    .SetBadgeStyle(UIBadgeType.Surface)
                    .SetTooltip("The client drops the repeat and tells nobody — the count is the only proof")
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.ResetCounts))
                    .SetType(UIButtonType.Ghost)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Undo))
                    .SetTooltip("Back to zero")
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Press each three times as fast as you can. Both counters move once — the client refuses a command already in flight — but only one of the two buttons says so."
        );
    }

    /// <summary>
    /// Two buttons, two commands, only one of which may run: each press turns both off through an interaction.
    /// </summary>
    private static ContainerComponent CreateDecisionGroup()
    {
        return DemoUI.CreateGroup(DecisionGroup, "Two buttons, one decision",
            content => content.AddChild(UILayout.Row(12)
                .AddChild(new ButtonComponent(ApproveId)
                    .OnClick(nameof(CommandsController.ApproveAsync))
                    .InteractBeforeClick(IVisualComponent.EnabledProperty, false)
                    .InteractBeforeClick(RejectId, IVisualComponent.EnabledProperty, false)
                    .BindEnabled(nameof(ButtonDecisionGroupContext.Open), UIBindingScope.Relative)
                    .SetType(UIButtonType.Primary)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Check))
                    .SetTitle("Approve")
                )
                .AddChild(new ButtonComponent(RejectId)
                    .OnClick(nameof(CommandsController.RejectAsync))
                    .InteractBeforeClick(IVisualComponent.EnabledProperty, false)
                    .InteractBeforeClick(ApproveId, IVisualComponent.EnabledProperty, false)
                    .BindEnabled(nameof(ButtonDecisionGroupContext.Open), UIBindingScope.Relative)
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Close))
                    .SetTitle("Reject")
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
                    .SetTooltip("Open the request again")
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "One press turns both of them off before it leaves the browser, which a server-side flag could not do in time. The rule itself is still the server's: each command checks that the request is open, so a second press that gets through changes nothing."
        );
    }

    /// <summary>
    /// One command, five writes, arriving over the push channel while it is still awaiting.
    /// </summary>
    private static ContainerComponent CreateProgressGroup()
    {
        return DemoUI.CreateGroup(ProgressGroup, "Progress, while it is still running",
            content => content.AddChild(UILayout.Row(12)
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.ProvisionAsync))
                    // Bound only: the spinner reports the server's progress, not the round trip.
                    .BindLoading(nameof(ButtonProgressGroupContext.Busy), UIBindingScope.Relative)
                    .SetType(UIButtonType.Primary)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
                    .SetTitle("Provision")
                )
                .AddChild(new BadgeComponent()
                    .SetVerticalAlignment(UIAlignment.Center)
                    .BindText(nameof(ButtonProgressGroupContext.Stage), UIBindingScope.Relative)
                    .BindType(nameof(ButtonProgressGroupContext.StageStyle), UIBindingScope.Relative)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "One command, five writes, arriving while it is still awaiting: a long command does not have to be silent until it returns."
        );
    }

    /// <summary>
    /// A background command: answered at once, its result pushed when it ends, so the tab is not held while it runs.
    /// </summary>
    private static ContainerComponent CreateBackgroundGroup()
    {
        return DemoUI.CreateGroup(BackgroundGroup, "A long job that leaves the page free",
            content => content.AddChild(UILayout.Stack(12)
                .AddChild(UILayout.Row(12)
                    .AddChild(new ButtonComponent()
                        .OnClickShowingLoading(nameof(CommandsController.BackUpAsync))
                        .SetType(UIButtonType.Primary)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                        .SetTitle("Back up")
                        .SetTooltip("[UICommand(ConcurrencyMode = Background)] — six seconds, and the spinner ends when its pushed result arrives")
                    )
                    .AddChild(new ButtonComponent()
                        .OnClick(nameof(CommandsController.CancelBackup))
                        .SetType(UIButtonType.Ghost)
                        .SetTitle("Cancel")
                    )
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Note for the log")
                    .BindValue(nameof(ButtonBackgroundGroupContext.Note), UIBindingScope.Relative)
                )
                .AddChild(new TextComponent()
                    .SetTitle("The server holds")
                    .AsBody()
                    .BindDescription(nameof(ButtonBackgroundGroupContext.Note), UIBindingScope.Relative)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Press Back up, then type a note and leave the field: the line under it is the server's copy, and it changes while the backup still runs. Cancel reaches the backup the same way."
        );
    }

    /// <summary>
    /// A command that throws still answers: the left button gets the framework's notification, the right returns an effect.
    /// </summary>
    private static ContainerComponent CreateFailureGroup()
    {
        return DemoUI.CreateGroup(ReportGroup, "When it fails",
            content => content.AddChild(UILayout.Row(12)
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.FailUnhandled))
                    .SetType(UIButtonType.Outline)
                    .SetTitle("Throw")
                    .SetDescription("Reported by the framework")
                    .SetDescriptionType(UITextAppearance.Caption)
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.FailReported))
                    .SetType(UIButtonType.Outline)
                    .SetTitle("Refuse, in its own words")
                    .SetDescription("Reported by the command")
                    .SetDescriptionType(UITextAppearance.Caption)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "A command that throws still has to answer. The left button reports nothing itself and gets the framework's own notification; the right one takes the reporting over."
        );
    }

    /// <summary>
    /// The two answers that are not state: a page to go to and a file to keep, neither of which could be a binding.
    /// </summary>
    private static ContainerComponent CreateEffectGroup()
    {
        return DemoUI.CreateGroup(EffectGroup, "Answering with something other than state",
            content => content.AddChild(UILayout.Row(12)
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.GoToButton))
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.ArrowRight))
                    .SetTitle("Go to the button's page")
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(CommandsController.DownloadReportAsync))
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                    .SetTitle("Download the report")
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "A page to go to and a file to keep: neither changes anything the controller holds, so neither could have been a binding. A question before something that cannot be undone is such an answer too, a dialog the view owns: the dialog page asks one."
        );
    }
}
