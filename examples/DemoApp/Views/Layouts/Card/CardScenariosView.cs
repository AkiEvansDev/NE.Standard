using System.Collections.Generic;
using DemoApp.Controllers.Layouts.Card;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.Card;

/// <summary>
/// What a card does that a property row cannot say: where a click lands, how a set of them behaves as a
/// choice, and what covering the whole panel while it re-reads looks like.
/// </summary>
internal sealed class CardScenariosView : DemoScenariosView, IUIViewDefinition
{
    private const string ClickGroup = nameof(CardScenariosController.ClickGroup);
    private const string HoverGroup = nameof(CardScenariosController.HoverGroup);
    private const string SelectionGroup = nameof(CardScenariosController.SelectionGroup);
    private const string RefreshGroup = nameof(CardScenariosController.RefreshGroup);

    private const string HoverCardId = "card-hover-host";

    public static string ViewKey => "demo.layouts.card.scenarios";

    protected override string ComponentRoute => "/layouts/card";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.layouts.card.header";
    protected override string HeaderDescription => "demo.layouts.card.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateClickGroup(), CreateSelectionGroup()],
            [CreateHoverGroup(), CreateRefreshGroup()]
        ));
    }

    /// <summary>
    /// Hover interactions write <c>Visible</c> on a panel the pointer is not over, entirely on the client.
    /// </summary>
    /// <remarks>The row must keep its height with the panel hidden, or the card resizes and moves the pointer off itself.</remarks>
    private static ContainerComponent CreateHoverGroup()
    {
        return DemoUI.CreateGroup(HoverGroup, "What can be done to it, while the pointer is on it",
            content => content.AddChild(new CardComponent(HoverCardId)
                .SetSurface(UISurfaceStyle.Raised)
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.Outline(DemoIcons.Check))
                    .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Success))
                    .SetTitle("Web Portal · #482")
                    .SetDescription("Fix circular progress anti-aliasing")
                )
                .SetContent(new ParagraphComponent()
                    .SetDescription("All checks passed. Two approvals, no requested changes.")
                    .SetDescriptionType(UITextAppearance.Body)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                // Nothing wraps these two: a footer is a container, so they are placed in its own columns.
                .SetFooter(new ContainerComponent()
                    .AddChild(new TextComponent()
                        .SetTitle("Opened 6 days ago")
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.Muted)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetPlacement(1, 1, 12, 1)
                    )
                    // Written on the panel: the id names the watched component, the property lands on this one.
                    .AddChild(new StackPanelComponent()
                        // Hidden, not Collapsed: the footer keeps the buttons' room, so the card's height never changes.
                        .SetVisibility(UIVisibility.Hidden)
                        .InteractOnHoverStart(HoverCardId, IVisualComponent.VisibilityProperty, UIVisibility.Visible)
                        .InteractOnHoverEnd(HoverCardId, IVisualComponent.VisibilityProperty, UIVisibility.Hidden)
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(4)
                        .SetHorizontalAlignment(UIAlignment.End)
                        .SetPlacement(13, 1, 12, 1)
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(CardScenariosController.ViewDiff))
                            .SetType(UIButtonType.Ghost)
                            .SetSize(UIButtonSize.Small)
                            .SetTitle("View diff")
                        )
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(CardScenariosController.MergeRequest))
                            .SetType(UIButtonType.Primary)
                            .SetSize(UIButtonSize.Small)
                            .SetTitle("Merge")
                        )
                    )
                )
                .SetWidth(UILayoutLength.Absolute(380))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Move the pointer onto the card. The reveal happens on the client alone, and the card keeps its height because the buttons are Hidden rather than Collapsed — a card that resized would move the pointer off itself."
        );
    }

    /// <summary>
    /// Three targets in one card: the pipeline stops at the innermost component that handles the event.
    /// </summary>
    private static ContainerComponent CreateClickGroup()
    {
        return DemoUI.CreateGroup(ClickGroup, "Where the press lands",
            content => content.AddChild(new CardComponent()
                .SetClickable(true)
                .SetSurface(UISurfaceStyle.Raised)
                .OnClick(nameof(CardScenariosController.RecordCardClick))
                .SetContextMenu(new MenuComponent()
                    .SetItems([new MenuItem { Id = "open", Title = "Open in a new tab", Icon = DemoIcons.Outline(DemoIcons.ExternalLink) }])
                    .OnItemClick(nameof(CardScenariosController.RecordMenuClick))
                )
                .ConfigureDefaultHeader(header => header
                    .SetTitle("Web Portal · #482")
                    .SetDescription("Click the card, the button, or right-click either")
                )
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(10)
                    .AddChild(new ParagraphComponent()
                        .SetDescription("Selecting this sentence works too, which it did not while a card that was not clickable was made inert to keep its own click clean.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                    .AddChild(new ButtonComponent()
                        .OnClick(nameof(CardScenariosController.RecordButtonClick))
                        .SetType(UIButtonType.Outline)
                        .SetSize(UIButtonSize.Small)
                        .SetHorizontalAlignment(UIAlignment.Start)
                        .SetTitle("A button inside it")
                    )
                )
                .SetWidth(UILayoutLength.Absolute(380))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Press the card, then the button inside it, then right-click it: a card that guards its own press must not leave its whole subtree deaf."
        );
    }

    /// <summary>
    /// One command for the three, told apart by the literal each card carries.
    /// </summary>
    private static ContainerComponent CreateSelectionGroup()
    {
        return DemoUI.CreateGroup(SelectionGroup, "One of several",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(12)
                .SetWrap(true)
                .AddChild(CreateChoice(
                    CardSelectionGroupContext.NowId,
                    nameof(CardSelectionGroupContext.NowSurface),
                    DemoIcons.Upload,
                    "Deploy now",
                    "Straight to production, no gate."
                ))
                .AddChild(CreateChoice(
                    CardSelectionGroupContext.ScheduleId,
                    nameof(CardSelectionGroupContext.ScheduleSurface),
                    DemoIcons.Clock,
                    "Schedule it",
                    "Runs at the next release window."
                ))
                .AddChild(CreateChoice(
                    CardSelectionGroupContext.StageId,
                    nameof(CardSelectionGroupContext.StageSurface),
                    DemoIcons.Shield,
                    "Stage only",
                    "Stops after staging, waits for approval."
                ))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Three cards and one command, told apart by the literal each card carries — the shape a list of rows uses, written by hand because three cards are not a collection."
        );
    }

    private static CardComponent CreateChoice(string id, string surfacePath, string icon, string title, string description)
        => new CardComponent()
            .SetClickable(true)
            .BindSurface(surfacePath, UIBindingScope.Relative)
            .OnClickLiteral(nameof(CardScenariosController.SelectPlan), new KeyValuePair<string, object?>("plan", id))
            .ConfigureDefaultHeader(header => header
                .SetIcon(DemoIcons.Outline(icon))
                .SetTitle(title)
            )
            .SetContent(new ParagraphComponent()
                .SetDescription(description)
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.Muted)
            )
            .SetWidth(UILayoutLength.Absolute(210));

    /// <summary>
    /// <c>Loading</c> on a panel rather than a control: it covers header, content and footer together.
    /// </summary>
    private static ContainerComponent CreateRefreshGroup()
    {
        return DemoUI.CreateGroup(RefreshGroup, "A panel that re-reads itself",
            content => content.AddChild(new CardComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .BindLoading(nameof(CardRefreshGroupContext.Busy), UIBindingScope.Relative)
                .ConfigureDefaultHeader(header => header
                    .SetTitle("Deploys this week")
                    .BindDescription(nameof(CardRefreshGroupContext.ReadAt), UIBindingScope.Relative)
                    .SetDescriptionType(UITextAppearance.Caption)
                )
                .SetContent(new TextComponent()
                    .BindTitle(nameof(CardRefreshGroupContext.Deploys), UIBindingScope.Relative)
                    .SetTitleType(UITextAppearance.Display)
                    .BindDescription(nameof(CardRefreshGroupContext.Split), UIBindingScope.Relative)
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .SetFooter(new ButtonComponent()
                    .OnClick(nameof(CardScenariosController.RefreshAsync))
                    // No InteractBeforeClick: the card's own Loading already covers this button.
                    .SetType(UIButtonType.Ghost)
                    .SetSize(UIButtonSize.Small)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
                    .SetTitle("Read again")
                )
                .SetWidth(UILayoutLength.Absolute(300))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Loading sits on the panel rather than on the button: while the reading is stale there is nothing on the card worth pressing."
        );
    }
}
