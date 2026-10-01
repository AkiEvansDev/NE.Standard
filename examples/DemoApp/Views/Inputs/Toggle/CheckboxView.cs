namespace DemoApp.Views.Inputs.Toggle;

/// <summary>
/// One checkbox and every property that can be bound to it; then a list of settings answered one at a time, the control at a row's
/// far end, the label that makes each answerable, and the control it is not.
/// </summary>
/// <remarks>
/// <c>BadgePlacement</c> has a row that shows nothing: a toggle is as wide as its text, so both placements agree. The switch is the
/// same component drawn differently, so its page keeps only the layout its drawing is made for and points here for the rest.
/// </remarks>
internal sealed class CheckboxView : ToggleView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.checkbox";

    protected override string ComponentRoute => "/inputs/checkbox";
    protected override string Header => "demo.inputs.checkbox.header";
    protected override string HeaderDescription => "demo.inputs.checkbox.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/sign-up", "demo.nav.screens.sign-up");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(Bind(new CheckboxComponent())));

    protected override IVisualComponent[] CreateExamples()
        // Paired by height: the two short lists side by side, then the labels beside the rows that end in the control.
        => DemoUI.CreateColumns([CreateSettingsGroup(), CreateLabelGroup()], [CreateAgainstRadioGroup(), CreateRowEndGroup()]);

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
    /// The label is a whole text component — icon, second line, badge, tooltip, help — which is what makes the question answerable.
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
                .AddChild(new CheckboxComponent()
                    .SetTitle("Delete the snapshots with the server")
                    .SetHelp("Off, they are kept for thirty days and billed as storage.")
                    .SetValue(false)
                ),
            note: "The last one carries a help badge (`SetHelp`): a press on it shows its words and leaves the box as it was, since the badge is a stop of its own and not part of the label."
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
