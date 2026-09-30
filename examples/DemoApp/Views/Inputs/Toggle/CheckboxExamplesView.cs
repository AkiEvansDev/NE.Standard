using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.Toggle;

/// <summary>
/// A list of settings answered one at a time, and the label that makes each of them answerable.
/// </summary>
/// <remarks>
/// The same groups as the switch's page, written out rather than shared through a base over the control: every sample is shown as
/// its source, and a sample has to build the control it shows, not ask a factory for it.
/// </remarks>
internal sealed class CheckboxExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.checkbox.examples";

    protected override string ComponentRoute => "/inputs/checkbox";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.checkbox.header";
    protected override string HeaderDescription => "demo.inputs.checkbox.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateSettingsGroup(), CreateRowEndGroup(), CreateHelpGroup()], [CreateLabelGroup(), CreateAgainstRadioGroup()]));

    /// <summary>
    /// A setting whose consequence does not fit its label: the badge beside the label says it, as a tooltip, and stays out of the way.
    /// </summary>
    private static ContainerComponent CreateHelpGroup()
    {
        return DemoUI.CreateExample("A help badge beside the label",
            UILayout.Stack(12)
                .AddChild(new CheckboxComponent()
                    .SetTitle("Take automatic backups")
                    .SetHelp("Kept for fourteen days in object storage, in the server's own region.")
                    .SetValue(true)
                )
                .AddChild(new CheckboxComponent()
                    .SetTitle("Delete the snapshots with the server")
                    .SetHelp("Off, they are kept for thirty days and billed as storage.")
                    .SetValue(false)
                ),
            note: "A press on the badge shows its words and leaves the box as it was: the badge is a stop of its own, not part of the label."
        );
    }

    /// <summary>The ordinary case: a list of independent settings, each answered on its own.</summary>
    private static ContainerComponent CreateSettingsGroup()
    {
        return DemoUI.CreateExample("A list of settings",
            UILayout.Stack(12)
                .AddChild(new CheckboxComponent()
                    .SetTitle("Take automatic backups")
                    .SetValue(true)
                )
                .AddChild(new CheckboxComponent()
                    .SetTitle("Notify the on-call engineer")
                    .SetValue(true)
                )
                .AddChild(new CheckboxComponent()
                    .SetTitle("Restart the server on a failed health check")
                    .SetValue(false)
                )
                .AddChild(new CheckboxComponent()
                    .SetTitle("Keep snapshots for thirty days")
                    .SetValue(false)
                )
        );
    }

    /// <summary>
    /// The other layout a settings screen uses: the control at the far end of the row rather than in front of it.
    /// </summary>
    /// <remarks>Composed by hand, not a property: the control is as wide as itself, so the row is a grid with it in the last column.</remarks>
    private static ContainerComponent CreateRowEndGroup()
    {
        return DemoUI.CreateExample("At the far end of a row",
            new SurfaceComponent()
                .SetContent(UILayout.Stack(4)
                    .AddChild(new ContainerComponent()
                        .SetPadding(UIThickness.All(0, 6, 0, 6))
                        .SetColumn(24, UIGridUnit.Auto())
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Bell)
                            .SetTitle("Deploy notifications")
                            .SetTitleType(UITextAppearance.Body)
                            .SetDescription("Mailed to the admins on call")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(1, 1, 23, 1)
                        )
                        .AddChild(new CheckboxComponent()
                            .SetValue(true)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(24, 1, 1, 1)
                        )
                    )
                    .AddChild(new ContainerComponent()
                        .SetPadding(UIThickness.All(0, 6, 0, 6))
                        .SetColumn(24, UIGridUnit.Auto())
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.History)
                            .SetTitle("Keep snapshots")
                            .SetTitleType(UITextAppearance.Body)
                            .SetDescription("Thirty days, then they are dropped")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(1, 1, 23, 1)
                        )
                        .AddChild(new CheckboxComponent()
                            .SetValue(false)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(24, 1, 1, 1)
                        )
                    )
                ),
            note: "In front of the text the control is the row's subject; at the far end the text is, and the control only answers it."
        );
    }

    /// <summary>
    /// The label is a whole text component — icon, second line, badge, tooltip — which is what makes the question answerable.
    /// </summary>
    private static ContainerComponent CreateLabelGroup()
    {
        return DemoUI.CreateExample("The label it carries",
            UILayout.Stack(12)
                .AddChild(new CheckboxComponent()
                    .SetTitle("Take automatic backups")
                    .SetDescription("**Every night**, into the region's object storage.")
                    .SetDescriptionColor(UIThemeColor.Muted)
                    .SetValue(true)
                )
                .AddChild(new CheckboxComponent()
                    .SetIcon(DemoIcons.Shield)
                    .SetTitle("Two-factor authentication")
                    .SetDescription("Adds a *second step* when signing in from a new device.")
                    .SetDescriptionColor(UIThemeColor.Muted)
                    .SetBadgeText("Recommended")
                    .SetBadgeStyle(UIBadgeType.Success)
                    .SetValue(true)
                )
                .AddChild(new CheckboxComponent()
                    .SetIcon(DemoIcons.Alert)
                    .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                    .SetTitle("Allow public IPv4")
                    .SetDescription("**The server answers the whole internet.**")
                    .SetDescriptionColor(UIThemeColor.Muted)
                    .SetBadgeText("Dangerous")
                    .SetBadgeStyle(UIBadgeType.Danger)
                    .SetValue(false)
                )
                .AddChild(new CheckboxComponent()
                    .SetTitle("Send a weekly digest")
                    .SetTooltip("Sent on **Monday at 09:00** in the account's own timezone — see [the docs](https://docs.orvane.example/digest).")
                    .SetValue(true)
                )
        );
    }

    /// <summary>
    /// The control this one is not: one question with several answers is a radio group.
    /// </summary>
    /// <remarks>Side by side rather than stacked, or the two read as one list instead of as a choice between two controls.</remarks>
    private static ContainerComponent CreateAgainstRadioGroup()
    {
        return DemoUI.CreateExample("What it is not",
            UILayout.Row(32)
                .AddChild(UIPage.Labelled("Two checkboxes, two answers", UILayout.Stack(8)
                    .AddChild(new CheckboxComponent()
                        .SetTitle("Notify by email")
                        .SetValue(true)
                    )
                    .AddChild(new CheckboxComponent()
                        .SetTitle("Notify by chat")
                        .SetValue(true)
                    )
                    )
                )
                .AddChild(UIPage.Labelled("A radio group, exactly one", new RadioGroupComponent()
                    .SetTitle("Notify me by")
                    .SetOptions(
                    [
                        new OptionItem { Id = "email", Title = "Email" },
                        new OptionItem { Id = "chat", Title = "Chat" },
                        new OptionItem { Id = "none", Title = "Not at all" }
                    ])
                    .SetValue("email")
                    )
                ),
            note: "Building a one-of-several choice out of several checkboxes is the mistake this group exists to head off."
        );
    }
}
