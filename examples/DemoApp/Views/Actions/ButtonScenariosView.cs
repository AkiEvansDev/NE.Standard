using System.Collections.Generic;
using DemoApp.Controllers.Actions;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Actions;

/// <summary>
/// What a button does that no property row can describe: the wait between the press and the answer.
/// </summary>
/// <remarks>Most groups are the same command wired more than one way, since none of it is visible on its own.</remarks>
internal sealed class ButtonScenariosView : DemoScenariosView, IUIViewDefinition
{
    private const string LatencyGroup = nameof(ButtonScenariosController.LatencyGroup);
    private const string GuardGroup = nameof(ButtonScenariosController.GuardGroup);
    private const string DecisionGroup = nameof(ButtonScenariosController.DecisionGroup);
    private const string ProgressGroup = nameof(ButtonScenariosController.ProgressGroup);
    private const string ConfirmGroup = nameof(ButtonScenariosController.ConfirmGroup);
    private const string ReportGroup = nameof(ButtonScenariosController.ReportGroup);
    private const string EffectGroup = nameof(ButtonScenariosController.EffectGroup);

    // Authored ids, because one button names the other in a cross-component interaction.
    private const string ApproveId = "decision-approve";
    private const string RejectId = "decision-reject";

    public static string ViewKey => "demo.actions.button.scenarios";

    protected override string ComponentRoute => "/actions/button";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.actions.button.header";
    protected override string HeaderDescription => "demo.actions.button.description";

    /// <summary>
    /// Neither dismissal switch is left on: an irreversible question must not be answered by a stray click.
    /// </summary>
    protected override IReadOnlyList<UIDialog> CreateDialogs()
        => [
            new UIDialog
            {
                Key = ButtonScenariosController.ConfirmKey,
                CloseOnBackdrop = false,
                CloseOnEscape = false,
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(16)
                    .AddChild(new ParagraphComponent()
                        .SetIcon(DemoIcons.Alert)
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .SetTitle("Delete this workspace?")
                        .SetTitleType(UITextAppearance.Title)
                        .SetDescription("Everything in **payments-staging** goes with it — builds, artifacts and the deploy history. This cannot be undone.")
                        .SetWidth(UILayoutLength.Absolute(360))
                    )
                    // The safe answer comes first, where a reader's muscle memory expects "Cancel".
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .SetHorizontalAlignment(UIAlignment.End)
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(ButtonScenariosController.CancelDelete))
                            .SetType(UIButtonType.Ghost)
                            .SetTitle("Keep it")
                        )
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(ButtonScenariosController.ConfirmDelete))
                            .SetType(UIButtonType.Danger)
                            .SetIcon(DemoIcons.Outline(DemoIcons.Alert))
                            .SetTitle("Delete workspace")
                        )
                    )
            }
        ];

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateLatencyGroup(), CreateDecisionGroup(), CreateConfirmGroup(), CreateEffectGroup()],
            [CreateGuardGroup(), CreateProgressGroup(), CreateFailureGroup()]
        ));
    }

    /// <summary>
    /// One command, three views of it: a pair of interactions, a bound property, and neither.
    /// </summary>
    private static ContainerComponent CreateLatencyGroup()
    {
        return DemoUI.CreateGroup(LatencyGroup, "Three ways to say it is running",
            content => content.AddChild(DemoUI.CreateRow()
                .AddChild(new ButtonComponent()
                    .OnClickWithLoading(nameof(ButtonScenariosController.DeployAsync))
                    .SetType(UIButtonType.Primary)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                    .SetTitle("Deploy")
                    .SetDescription("One call, two interactions, nothing bound")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetTooltip("OnClickWithLoading: InteractBeforeClick(Loading, true) and InteractAfterClick(Loading, false)")
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ButtonScenariosController.DeployBoundAsync))
                    .BindLoading(nameof(ButtonLatencyGroupContext.Busy), UIBindingScope.Relative)
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                    .SetTitle("Deploy")
                    .SetDescription("Bound, and the command writes it")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetTooltip("BindLoading(Busy) — the spinner is the server's answer, not the round trip")
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ButtonScenariosController.DeployAsync))
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
            content => content.AddChild(DemoUI.CreateRow()
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ButtonScenariosController.ChargeGuardedAsync))
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
                    .OnClick(nameof(ButtonScenariosController.ChargePlainAsync))
                    .SetType(UIButtonType.Outline)
                    .SetTitle("Charge card, bare")
                    .SetDescription("Refused in silence")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .BindBadgeText(nameof(ButtonGuardGroupContext.PlainCount), UIBindingScope.Relative)
                    .SetBadgeStyle(UIBadgeType.Surface)
                    .SetTooltip("The client drops the repeat and tells nobody — the count is the only proof")
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ButtonScenariosController.ResetCounts))
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
            content => content.AddChild(DemoUI.CreateRow()
                .AddChild(new ButtonComponent(ApproveId)
                    .OnClick(nameof(ButtonScenariosController.ApproveAsync))
                    .InteractBeforeClick(IVisualComponent.EnabledProperty, false)
                    .InteractBeforeClick(RejectId, IVisualComponent.EnabledProperty, false)
                    .BindEnabled(nameof(ButtonDecisionGroupContext.Open), UIBindingScope.Relative)
                    .SetType(UIButtonType.Primary)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Check))
                    .SetTitle("Approve")
                )
                .AddChild(new ButtonComponent(RejectId)
                    .OnClick(nameof(ButtonScenariosController.RejectAsync))
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
                    .BindStyle(nameof(ButtonDecisionGroupContext.OutcomeStyle), UIBindingScope.Relative)
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ButtonScenariosController.ReopenRequest))
                    .SetType(UIButtonType.Ghost)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Undo))
                    .SetTooltip("Open the request again")
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "One press turns both of them off before it leaves the browser, which a server-side flag could not: it would arrive a round trip after the second press."
        );
    }

    /// <summary>
    /// One command, five writes, arriving over the push channel while it is still awaiting.
    /// </summary>
    private static ContainerComponent CreateProgressGroup()
    {
        return DemoUI.CreateGroup(ProgressGroup, "Progress, while it is still running",
            content => content.AddChild(DemoUI.CreateRow()
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ButtonScenariosController.RunPipelineAsync))
                    // Bound only: the spinner reports the server's progress, not the round trip.
                    .BindLoading(nameof(ButtonProgressGroupContext.Busy), UIBindingScope.Relative)
                    .SetType(UIButtonType.Primary)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
                    .SetTitle("Run pipeline")
                )
                .AddChild(new BadgeComponent()
                    .SetVerticalAlignment(UIAlignment.Center)
                    .BindText(nameof(ButtonProgressGroupContext.Stage), UIBindingScope.Relative)
                    .BindStyle(nameof(ButtonProgressGroupContext.StageStyle), UIBindingScope.Relative)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "One command, five writes, arriving while it is still awaiting: a long command does not have to be silent until it returns."
        );
    }

    /// <summary>
    /// A question the button asks first; the dialog is the view's, opened by an effect the button knows nothing of.
    /// </summary>
    private static ContainerComponent CreateConfirmGroup()
    {
        return DemoUI.CreateGroup(ConfirmGroup, "Something that cannot be undone",
            content => content.AddChild(DemoUI.CreateRow()
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ButtonScenariosController.AskToDelete))
                    .BindEnabled(nameof(ButtonConfirmGroupContext.Present), UIBindingScope.Relative)
                    .SetType(UIButtonType.Danger)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Alert))
                    .SetTitle("Delete workspace")
                    .BindDescription(nameof(ButtonConfirmGroupContext.Workspace), UIBindingScope.Relative)
                    .SetDescriptionType(UITextAppearance.Caption)
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ButtonScenariosController.RestoreWorkspace))
                    .SetType(UIButtonType.Ghost)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Undo))
                    .SetTitle("Put it back")
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "The question is a dialog the view owns and an effect opens, so the button knows nothing about it and the same command can be reached from a menu later."
        );
    }

    /// <summary>
    /// A command that throws still answers: the left button gets the framework's notification, the right returns an effect.
    /// </summary>
    private static ContainerComponent CreateFailureGroup()
    {
        return DemoUI.CreateGroup(ReportGroup, "When it fails",
            content => content.AddChild(DemoUI.CreateRow()
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ButtonScenariosController.FailUnhandled))
                    .SetType(UIButtonType.Outline)
                    .SetTitle("Throw")
                    .SetDescription("Reported by the framework")
                    .SetDescriptionType(UITextAppearance.Caption)
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ButtonScenariosController.FailReported))
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
            content => content.AddChild(DemoUI.CreateRow()
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ButtonScenariosController.GoToExamples))
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.ArrowRight))
                    .SetTitle("Go to Examples")
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ButtonScenariosController.DownloadReportAsync))
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                    .SetTitle("Download the report")
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "A page to go to and a file to keep: neither changes anything the controller holds, so neither could have been a binding."
        );
    }
}
