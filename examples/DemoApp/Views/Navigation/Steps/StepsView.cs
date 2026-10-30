using DemoApp.Controllers.Base;
using DemoApp.Controllers.Navigation.Steps;
using DemoApp.Views.Base;

namespace DemoApp.Views.Navigation.Steps;

/// <summary>
/// A sequence of numbered steps over a collection, one of them current by <c>SelectedKey</c> and the ones before it completed.
/// </summary>
internal sealed class StepsView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string StepsGroup = nameof(StepsController.StepsGroup);
    private const string WizardStepsId = "steps-wizard";

    public static string ViewKey => "demo.navigation.steps";

    protected override string ComponentRoute => "/navigation/steps";
    protected override string Header => "demo.navigation.steps.header";
    protected override string HeaderDescription => "demo.navigation.steps.description";
    protected override (string Route, string Title)? ComposedIn => ("/screens/checkout", "demo.nav.screens.checkout");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame
            .AddChild(new StepsComponent()
                .BindStandard()
                .BindOrientation<StepsController>(static x => x.StepsGroup.Orientation)
                .BindSpacing<StepsController>(static x => x.StepsGroup.Spacing)
                .BindItems<StepsController>(static x => x.StepsGroup.Steps)
                .BindSelectedKey<StepsController>(static x => x.StepsGroup.SelectedKey)
                .SetPlacement(1, 1, 24, 1)
            ),
            contentMinHeight: 220
        );

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(StepsGroup, "Steps")
        );

    protected override IVisualComponent[] CreateExamples()
        => DemoUI.CreateColumns([CreateWizardGroup(), CreateLockedGroup()], [CreateVerticalGroup(), CreateCommandGroup()]);

    /// <summary>
    /// A form's sections switched on the page by <c>ShownWhen</c> reading <c>SelectedKey</c>, with no round trip between steps.
    /// </summary>
    private static ContainerComponent CreateWizardGroup()
    {
        return DemoUI.CreateExample("Switching sections on the page",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Surface)
                .SetWidth(UILayoutLength.Absolute(420))
                .SetContent(UILayout.Stack(16)
                    .AddChild(new StepsComponent(WizardStepsId)
                        .SetSelectedKey("region")
                        .SetItems(
                        [
                            new TextItem { Id = "plan", Title = "Plan", Description = "4 vCPU · 16 GB" },
                            new TextItem { Id = "region", Title = "Region", Description = "Europe West" },
                            new TextItem { Id = "confirm", Title = "Confirm", Description = "Monthly invoice" }
                        ])
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(new TextComponent()
                        .SetTitle("Pro · 4 servers")
                        .SetDescription("4 vCPU · 16 GB · 240 GB NVMe each, €256 a month before VAT.")
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .ShownWhen(WizardStepsId, ISelectedKeyComponent.SelectedKeyProperty, UIComparisonOperator.Equal, "plan")
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Europe West · Amsterdam")
                        .SetDescription("Private networking across eu-west-1a and eu-west-1b.")
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .ShownWhen(WizardStepsId, ISelectedKeyComponent.SelectedKeyProperty, UIComparisonOperator.Equal, "region")
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Ready to provision")
                        .SetDescription("Invoices go out on the first of the month, net 14 days.")
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .ShownWhen(WizardStepsId, ISelectedKeyComponent.SelectedKeyProperty, UIComparisonOperator.Equal, "confirm")
                    )
                )
        );
    }

    /// <summary>
    /// Later steps start with <c>CanSelect = false</c> so the reader cannot skip ahead, and unlock as each step is completed.
    /// </summary>
    private static ContainerComponent CreateLockedGroup()
    {
        return DemoUI.CreateExample("Unlocking future steps",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Surface)
                .SetWidth(UILayoutLength.Absolute(420))
                .SetContent(UILayout.Stack(16)
                    .AddChild(new StepsComponent()
                        .BindItems<LockedStepsContext>(static x => x.Steps, UIBindingScope.Relative)
                        .BindSelectedKey<LockedStepsContext>(static x => x.SelectedKey, UIBindingScope.Relative)
                    )
                    .AddChild(UIButtons.Pair(
                        UIButtons.Ghost("Reset").OnClick(nameof(StepsController.ResetLocked)),
                        UIButtons.Primary("Advance step").OnClick(nameof(StepsController.AdvanceLocked))
                    ))
                ),
            context: nameof(StepsController.Locked)
        );
    }

    /// <summary>
    /// Vertical steps for a runbook or onboarding checklist where each step carries a longer description.
    /// </summary>
    private static ContainerComponent CreateVerticalGroup()
    {
        return DemoUI.CreateExample("Vertical steps",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Surface)
                .SetWidth(UILayoutLength.Absolute(340))
                .SetContent(new StepsComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSelectedKey("restore")
                    .SetItems(
                    [
                        new TextItem { Id = "provision", Title = "Provision standby", Description = "Two nodes in Stockholm (eu-north)." },
                        new TextItem { Id = "restore", Title = "Restore snapshot", Description = "Streaming 2026-10-25T04:00Z into the standby." },
                        new TextItem { Id = "switch", Title = "Switch DNS", Description = "Lower TTL to 60s and point db.internal." }
                    ])
                )
        );
    }

    /// <summary>
    /// <c>OnItemClickWithItemKey</c> runs a command with the chosen step's key alongside <c>SelectedKey</c>.
    /// </summary>
    private static ContainerComponent CreateCommandGroup()
    {
        return DemoUI.CreateExample("Running a command on a step",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Surface)
                .SetWidth(UILayoutLength.Absolute(420))
                .SetContent(new StepsComponent()
                    .BindItems<CommandStepsContext>(static x => x.Steps, UIBindingScope.Relative)
                    .BindSelectedKey<CommandStepsContext>(static x => x.SelectedKey, UIBindingScope.Relative)
                    .OnItemClickWithItemKey(nameof(StepsController.InspectStep))
                ),
            context: nameof(StepsController.Command)
        );
    }
}
