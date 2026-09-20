using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Extensions;
using NE.Standard.UI.Primitives.Styling;

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

        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreatePairsGroup(), CreateFormGroup()],
            [CreateHostsGroup(), CreateChoiceGroup()]
        ));
    }

    /// <summary>
    /// A type says which button of the pair to press: one filled per group, the rest bare.
    /// </summary>
    private static ContainerComponent CreatePairsGroup()
    {
        return DemoUI.CreateGroup(null, "A pair, and which one is filled",
            // On a panel at one width: the rule only reads when the three pairs share a right edge.
            content => content.AddChild(new SurfaceComponent()
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetContent(UILayout.Stack(16)
                .SetWidth(UILayoutLength.Absolute(340))
                .AddChild(CreatePair(
                    "Saving something",
                    UIButtons.Ghost("Cancel"),
                    UIButtons.Primary("Save changes")))
                .AddChild(CreatePair(
                    "Throwing something away",
                    UIButtons.Ghost("Keep it"),
                    UIButtons.Danger("Delete workspace", DemoIcons.Outline(DemoIcons.Alert))
                ))
                .AddChild(CreatePair(
                    "Two ways on, one of them the usual one",
                    UIButtons.Secondary("Use a password"),
                    UIButtons.Primary("Sign in with SSO", DemoIcons.Outline(DemoIcons.Lock))
                ))
                .AddChild(CreatePair(
                    "Leaving with something unsaved",
                    UIButtons.Ghost("Discard"),
                    UIButtons.Primary("Keep editing")))
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "The pair at a form's foot is UIButtons.Pair: the safe answer first, the committing one last, at the far edge. The sign-up and the checkout under Screens end in one."
        );
    }

    private static StackPanelComponent CreatePair(string caption, ButtonComponent secondary, ButtonComponent primary)
        => UIPage.Labelled(caption, UIButtons.Pair(secondary, primary));

    /// <summary>
    /// A row of icon-only buttons is a toolbar; the tooltip is the only name each control has.
    /// </summary>
    private static ContainerComponent CreateToolbarGroup()
    {
        return DemoUI.CreateGroup(null, "A toolbar",
            content => content.AddChild(new SurfaceComponent()
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
                ))
                .SetPlacement(1, 1, 24, 1)
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
        return DemoUI.CreateGroup(null, "Toggles that stay down",
            content => content.AddChild(UILayout.Row(4,
                UIButtons.Ghost("Unread", DemoIcons.Outline(DemoIcons.Mail)).SetPressed(true),
                UIButtons.Ghost("Starred", DemoIcons.Outline(DemoIcons.Star)).SetPressed(false),
                UIButtons.Ghost("Has files", DemoIcons.Outline(DemoIcons.File)).SetPressed(false)
            )
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24,
            note: "Pressed turns a button into a toggle: it wears the selected ground while it is down, a press flips it, and bound two-way the state goes back to the controller."
        );
    }

    /// <summary>
    /// Stretched, the one alignment a button has to be asked for; everywhere else it is as wide as its label.
    /// </summary>
    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateGroup(null, "Filling the thing it is in",
            content => content.AddChild(new CardComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .ConfigureDefaultHeader(header => header
                    .SetTitle("Sign in")
                    .SetDescription("Continue to the deploy console")
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
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// The one case a button needs its whole text body: a choice between things that each need a sentence.
    /// </summary>
    private static ContainerComponent CreateChoiceGroup()
    {
        return DemoUI.CreateGroup(null, "A label with something to say",
            content => content.AddChild(UILayout.Stack(8)
                .SetWidth(UILayoutLength.Absolute(380))
                .AddChild(CreatePlan(DemoIcons.Check, "Standard", "Two environments, artifacts kept for 30 days.", "Current", UIBadgeType.Surface)
                    .SetType(UIButtonType.Outline)
                )
                // Surface, not a status colour: a badge sits on the control's fill and has to read on any ground.
                .AddChild(CreatePlan(DemoIcons.Star, "Team", "Ten environments, review gates and audit export.", "Recommended", UIBadgeType.Surface)
                    .SetType(UIButtonType.Primary)
                )
                .AddChild(CreatePlan(DemoIcons.Shield, "Enterprise", "Dedicated runners, SSO and a private registry.", "Talk to us", UIBadgeType.Info)
                    .SetType(UIButtonType.Outline)
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static ButtonComponent CreatePlan(string icon, string title, string description, string badge, UIBadgeType badgeStyle)
        => new ButtonComponent()
            .SetHorizontalAlignment(UIAlignment.Stretch)
            .SetTextAlignment(UITextAlignment.Start)
            .SetIcon(DemoIcons.Outline(icon))
            .SetTitle(title)
            .SetDescription(description)
            .SetDescriptionType(UITextAppearance.Caption)
            .SetBadgeText(badge)
            .SetBadgeStyle(badgeStyle)
            .SetBadgePlacement(UITextBadgePlacement.Trailing);

    /// <summary>
    /// The three places a button is put rather than laid out: a card's header band, its footer, and a row's end.
    /// </summary>
    private static ContainerComponent CreateHostsGroup()
    {
        return DemoUI.CreateGroup(null, "Where a button is put",
            content => content.AddChild(UILayout.Stack(12)
                .SetWidth(UILayoutLength.Absolute(420))
                .AddChild(DemoUI.CreateCaption("In a card — its header band and its footer"))
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
                        .AddChild(UIButtons.Ghost("View diff"))
                    )
                )
                // Small, so the button keeps the row's height instead of setting it.
                .AddChild(DemoUI.CreateCaption("At the end of a row")
                    .SetMargin(UIThickness.All(0, 8, 0, 0))
                )
                .AddChild(new SurfaceComponent()
                    .SetContent(new ContainerComponent()
                        .SetColumn(24, UIGridUnit.Auto())
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Bell)
                            .SetTitle("Deploy notifications")
                            .SetDescription("Sent to #releases")
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(1, 1, 23, 1)
                        )
                        .AddChild(new ButtonComponent()
                            .SetType(UIButtonType.Outline)
                            .SetSize(UIButtonSize.Small)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetTitle("Change")
                            .SetPlacement(24, 1, 1, 1)
                        )
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }
}
