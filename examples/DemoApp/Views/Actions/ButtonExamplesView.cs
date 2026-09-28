using DemoApp.Views.Base;

namespace DemoApp.Views.Actions;

/// <summary>
/// Buttons in the shapes they are actually written in.
/// </summary>
/// <remarks>Nothing here walks an enum; what is left is what a property cannot hold, such as which button of a pair is filled.</remarks>
internal sealed class ButtonExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.actions.button.examples";

    protected override string ComponentRoute => "/actions/button";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.actions.button.header";
    protected override string HeaderDescription => "demo.actions.button.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChild(CreateToolbarGroup());
        _ = container.AddChild(CreateTogglesGroup());

        _ = container.AddChildren(DemoUI.CreateColumns([CreatePairsGroup(), CreateFormGroup()], [CreateHostsGroup(), CreateChoiceGroup()]));
    }

    /// <summary>
    /// A row of icon-only buttons is a toolbar; the tooltip is the only name each control has.
    /// </summary>
    private static ContainerComponent CreateToolbarGroup()
    {
        return DemoUI.CreateExample("A toolbar",
            new SurfaceComponent()
                // A toolbar is as wide as its tools; stretched, it would be a band with icons at one end.
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetPadding(UIThickness.Uniform(6))
                .SetContent(UIButtons.Toolbar(
                    UIButtons.Icon(DemoIcons.Outline(DemoIcons.Undo), "Undo"),
                    UIButtons.Icon(DemoIcons.Outline(DemoIcons.Copy), "Duplicate"),
                    UIButtons.Icon(DemoIcons.Outline(DemoIcons.Edit), "Rename"),
                    UIButtons.Icon(DemoIcons.Outline(DemoIcons.Download), "Export"),
                    // A margin rather than a rule: the destructive tool has to be hard to reach by accident.
                    UIButtons.Icon(DemoIcons.Outline(DemoIcons.Alert), "Delete")
                        .SetType(UIButtonType.Danger)
                        .SetMargin(UIThickness.All(16, 0, 0, 0))
                    )
                ),
            columns: 24,
            note: "A bar across the top of what it acts on, so it is drawn across the page rather than in a column; the inbox under Screens wears one over the open message."
        );
    }

    /// <summary>
    /// A toggle stays down: <c>Pressed</c> makes a button one, and a press flips it without a command.
    /// </summary>
    private static ContainerComponent CreateTogglesGroup()
    {
        return DemoUI.CreateExample("Toggles that stay down",
            UILayout.Row(4,
                UIButtons.Ghost("Unread", DemoIcons.Outline(DemoIcons.Mail)).SetPressed(true),
                UIButtons.Ghost("Starred", DemoIcons.Outline(DemoIcons.Star)).SetPressed(false),
                UIButtons.Ghost("Has files", DemoIcons.Outline(DemoIcons.File)).SetPressed(false)
            ),
            columns: 24,
            note: "Pressed turns a button into a toggle: it wears the selected ground while it is down, a press flips it, and bound two-way the state goes back to the controller."
        );
    }

    /// <summary>
    /// A type says which button of the pair to press: one filled per group, the rest bare.
    /// </summary>
    private static ContainerComponent CreatePairsGroup()
    {
        return DemoUI.CreateExample("A pair, and which one is filled",
            // On a panel at one width: the rule only reads when the three pairs share a right edge.
            new SurfaceComponent()
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetContent(UILayout.Stack(16)
                    .SetWidth(UILayoutLength.Absolute(340))
                    .AddChild(UIPage.Labelled("Saving something", UIButtons.Pair(UIButtons.Ghost("Cancel"), UIButtons.Primary("Save changes"))))
                    .AddChild(UIPage.Labelled("Throwing something away", UIButtons.Pair(
                        UIButtons.Ghost("Keep it"),
                        UIButtons.Danger("Delete server", DemoIcons.Outline(DemoIcons.Alert))
                            )
                        )
                    )
                    .AddChild(UIPage.Labelled("Two ways on, one of them the usual one", UIButtons.Pair(
                        UIButtons.Secondary("Use a password"),
                        UIButtons.Primary("Sign in with SSO", DemoIcons.Outline(DemoIcons.Lock))
                            )
                        )
                    )
                    .AddChild(UIPage.Labelled("Leaving with something unsaved", UIButtons.Pair(UIButtons.Ghost("Discard"), UIButtons.Primary("Keep editing"))))
                ),
            note: "The pair at a form's foot is UIButtons.Pair: the safe answer first, the committing one last, at the far edge. The sign-up and the checkout under Screens end in one."
        );
    }

    /// <summary>
    /// Stretched, the one alignment a button has to be asked for; everywhere else it is as wide as its label.
    /// </summary>
    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateExample("Filling the thing it is in",
            new CardComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .ConfigureDefaultHeader(header => header
                    .SetTitle("Sign in")
                    .SetDescription("Continue to the admin panel")
                )
                .SetContent(UILayout.Stack(8)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Lock))
                        .SetTitle("Continue with SSO")
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                        .SetTitle("Use a password")
                    )
                    // Link is the type for a button that has to read as prose rather than as a box.
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Link)
                        .SetSize(UIButtonSize.Small)
                        .SetTitle("I cannot sign in")
                    )
                )
        );
    }

    /// <summary>
    /// The three places a button is put rather than laid out: a card's header band, its footer, and a row's end.
    /// </summary>
    private static ContainerComponent CreateHostsGroup()
    {
        return DemoUI.CreateExample("Where a button is put",
            UILayout.Stack(12)
                .SetWidth(UILayoutLength.Absolute(420))
                .AddChild(UIText.Label("In a card — its header band and its footer"))
                .AddChild(new CardComponent()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle("Release 2.4")
                        .SetDescription("Scheduled for Friday")
                    )
                    // The header's own slot, so the control acts on the card rather than on its content.
                    .SetHeaderAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Close))
                        .SetTooltip("Dismiss")
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("The rollout pauses itself if the error rate doubles in any region.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                    .SetFooter(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .AddChild(UIButtons.Primary("Approve"))
                        .AddChild(UIButtons.Ghost("View notes"))
                    )
                )
                .AddChild(UIText.Label("At the end of a row")
                    .SetMargin(UIThickness.All(0, 8, 0, 0))
                )
                .AddChild(new SurfaceComponent()
                    .SetContent(new ContainerComponent()
                        .SetColumn(24, UIGridUnit.Auto())
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Bell)
                            .SetTitle("Deploy notifications")
                            .SetDescription("Mailed to on-call")
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(1, 1, 23, 1)
                        )
                        // Small, so the button keeps the row's height instead of setting it.
                        .AddChild(new ButtonComponent()
                            .SetType(UIButtonType.Outline)
                            .SetSize(UIButtonSize.Small)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetTitle("Change")
                            .SetPlacement(24, 1, 1, 1)
                        )
                    )
                )
        );
    }

    /// <summary>
    /// The one case a button needs its whole text body: a choice between things that each need a sentence.
    /// </summary>
    private static ContainerComponent CreateChoiceGroup()
    {
        return DemoUI.CreateExample("A label with something to say",
            UILayout.Stack(8)
                .SetWidth(UILayoutLength.Absolute(380))
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Outline)
                    .SetHorizontalAlignment(UIAlignment.Stretch)
                    .SetTextAlignment(UITextAlignment.Start)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Check))
                    .SetTitle("Standard")
                    .SetDescription("2 vCPU, 4 GB memory, 80 GB disk, €18 a seat.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetBadgeText("Current")
                    .SetBadgeStyle(UIBadgeType.Surface)
                )
                // Surface, not a status colour: a badge sits on the control's fill and has to read on any ground.
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetHorizontalAlignment(UIAlignment.Stretch)
                    .SetTextAlignment(UITextAlignment.Start)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Star))
                    .SetTitle("Pro")
                    .SetDescription("4 vCPU, 16 GB memory, 240 GB disk, €64 a seat.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetBadgeText("Recommended")
                    .SetBadgeStyle(UIBadgeType.Surface)
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Outline)
                    .SetHorizontalAlignment(UIAlignment.Stretch)
                    .SetTextAlignment(UITextAlignment.Start)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Shield))
                    .SetTitle("Dedicated")
                    .SetDescription("16 vCPU, 64 GB memory, 960 GB disk, €290 a seat.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetBadgeText("Talk to us")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
        );
    }
}
