using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
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
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreatePairsGroup(), CreateFormGroup(), CreateToolbarGroup()],
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
                .SetContent(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(16)
                .SetWidth(UILayoutLength.Absolute(340))
                .AddChild(CreatePair(
                    "Saving something",
                    new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetTitle("Cancel"),
                    new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetTitle("Save changes")
                ))
                .AddChild(CreatePair(
                    "Throwing something away",
                    new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetTitle("Keep it"),
                    new ButtonComponent()
                        .SetType(UIButtonType.Danger)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Alert))
                        .SetTitle("Delete workspace")
                ))
                .AddChild(CreatePair(
                    "Two ways on, one of them the usual one",
                    new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        .SetTitle("Use a password"),
                    new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Lock))
                        .SetTitle("Sign in with SSO")
                ))
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static StackPanelComponent CreatePair(string caption, ButtonComponent secondary, ButtonComponent primary)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(6)
            .AddChild(new TextComponent()
                .SetTitle(caption)
                .SetTitleType(UITextAppearance.Overline)
                .SetTitleColor(UIThemeColor.Muted)
            )
            // The safe answer first and the committing one last, pushed to the far edge like a footer's pair.
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetHorizontalAlignment(UIAlignment.End)
                .SetSpacing(8)
                .AddChild(secondary)
                .AddChild(primary)
            );

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
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(2)
                    .AddChild(CreateTool(DemoIcons.Undo, "Undo"))
                    .AddChild(CreateTool(DemoIcons.Copy, "Duplicate"))
                    .AddChild(CreateTool(DemoIcons.Edit, "Rename"))
                    .AddChild(CreateTool(DemoIcons.Download, "Export"))
                    // A margin rather than a rule: the destructive tool has to be hard to reach by accident.
                    .AddChild(CreateTool(DemoIcons.Alert, "Delete", UIButtonType.Danger)
                        .SetMargin(UIThickness.All(16, 0, 0, 0))
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static ButtonComponent CreateTool(string icon, string tooltip, UIButtonType type = UIButtonType.Ghost)
        => new ButtonComponent()
            .SetType(type)
            .SetIcon(DemoIcons.Outline(icon))
            .SetTooltip(tooltip);

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
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(8)
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
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
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
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
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
                        .AddChild(new ButtonComponent()
                            .SetType(UIButtonType.Primary)
                            .SetTitle("Approve")
                        )
                        .AddChild(new ButtonComponent()
                            .SetType(UIButtonType.Ghost)
                            .SetTitle("View diff")
                        )
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
