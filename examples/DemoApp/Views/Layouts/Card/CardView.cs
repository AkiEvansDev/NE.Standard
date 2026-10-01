using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.Table;
using DemoApp.Controllers.Layouts.Card;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Regions;

namespace DemoApp.Views.Layouts.Card;

/// <summary>
/// One card and every property that can be bound to it; then the shapes a card is written in, what it does that a property row
/// cannot say — where a press lands, what the pointer reveals, what covering the whole panel looks like — and what it holds.
/// </summary>
/// <remarks>
/// The content and footer regions are set rather than bound: they are what the card holds, not something about it. What a card
/// adds to a surface is shown here, once, for both pages.
/// </remarks>
internal sealed class CardView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string CardGroup = nameof(CardController.CardGroup);
    private const string HeaderGroup = nameof(CardController.HeaderGroup);
    private const string HeaderTextGroup = nameof(CardController.HeaderTextGroup);
    private const string HeaderBadgeGroup = nameof(CardController.HeaderBadgeGroup);
    private const string BorderGroup = nameof(CardController.BorderGroup);
    private const string PressGroup = nameof(CardController.PressGroup);
    private const string HoverGroup = nameof(CardController.HoverGroup);
    private const string RefreshGroup = nameof(CardController.RefreshGroup);

    private const string HoverCardId = "card-hover-host";

    public static string ViewKey => "demo.layouts.card";

    protected override string ComponentRoute => "/layouts/card";
    protected override string Header => "demo.layouts.card.header";
    protected override string HeaderDescription => "demo.layouts.card.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/settings", "demo.nav.screens.settings");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new CardComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSurface($"{CardGroup}.{nameof(CardSurfaceGroupContext.Surface)}")
            .BindClickable($"{CardGroup}.{nameof(CardSurfaceGroupContext.Clickable)}")
            .BindPadding($"{CardGroup}.{nameof(CardSurfaceGroupContext.Padding)}")
            .BindBackground($"{CardGroup}.{nameof(CardSurfaceGroupContext.Background)}")
            .BindBackgroundImage($"{CardGroup}.{nameof(CardSurfaceGroupContext.BackgroundImage)}")
            .BindBackgroundImageFit($"{CardGroup}.{nameof(CardSurfaceGroupContext.BackgroundImageFit)}")
            .BindOverflow($"{CardGroup}.{nameof(CardSurfaceGroupContext.Overflow)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .ConfigureDefaultHeader(BindHeader)
            .SetContent(new ParagraphComponent()
                .SetDescription("Plan checked and the maintenance window booked — one approval left, and it is yours.")
                .SetDescriptionType(UITextAppearance.Body)
                .SetWrapMode(UITextWrapMode.Wrap)
            )
            .SetFooter(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetSize(UIButtonSize.Small)
                    .SetTitle("Approve")
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .SetSize(UIButtonSize.Small)
                    .SetTitle("View plan")
                )
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    /// <summary>
    /// The header's own bindings; a region is bound by its full path like anything else.
    /// </summary>
    private static void BindHeader(CardHeaderRegion header)
        => _ = header
            .BindIcon($"{HeaderTextGroup}.{nameof(TextContentGroupContext.Icon)}")
            .BindIconColor($"{HeaderTextGroup}.{nameof(TextContentGroupContext.IconColor)}")
            .BindIconSize($"{HeaderTextGroup}.{nameof(TextContentGroupContext.IconSize)}")
            .BindTitle($"{HeaderTextGroup}.{nameof(TextContentGroupContext.Title)}")
            .BindTitleType($"{HeaderTextGroup}.{nameof(TextContentGroupContext.TitleType)}")
            .BindTitleColor($"{HeaderTextGroup}.{nameof(TextContentGroupContext.TitleColor)}")
            .BindTooltip($"{HeaderTextGroup}.{nameof(TextContentGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{HeaderTextGroup}.{nameof(TextContentGroupContext.TooltipPlacement)}")
            .BindDescription($"{HeaderTextGroup}.{nameof(TextContentGroupContext.Description)}")
            .BindDescriptionType($"{HeaderTextGroup}.{nameof(TextContentGroupContext.DescriptionType)}")
            .BindDescriptionColor($"{HeaderTextGroup}.{nameof(TextContentGroupContext.DescriptionColor)}")
            .BindTextAlignment($"{HeaderGroup}.{nameof(TextLayoutGroupContext.TextAlignment)}")
            .BindTextSelectable($"{HeaderGroup}.{nameof(SelectableTextLayoutGroupContext.TextSelectable)}")
            .BindBadgePlacement($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .BindBadgeStyle($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeStyle)}")
            .BindBadgeColor($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .BindBadgeIcon($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .BindBadgeIconColor($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .BindBadgeIconSize($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .BindBadgeText($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeText)}")
            .BindBadgeTextType($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTextType)}")
            .BindBadgeTooltip($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .BindBadgeTooltipPlacement($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}");

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(CardGroup, "Card", nameof(CardController.CycleCardOption)),
            DemoUI.CreateOptionSection(HeaderGroup, "Layout", nameof(CardController.CycleHeaderOption)),
            DemoUI.CreateOptionSection(HeaderTextGroup, "Content", nameof(CardController.CycleHeaderTextOption)),
            DemoUI.CreateOptionSection(HeaderBadgeGroup, "Badge", nameof(CardController.CycleHeaderBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(CardController.CycleBorderOption))
        );

    // The press beside the two short behaviours stacked, as tall together; the three-way comparison and the held content across the page.
    protected override IVisualComponent[] CreateExamples()
        => [CreateShapesGroup(), CreatePressGroup(), DemoUI.CreateHalf(CreateHoverGroup(), CreateRefreshGroup()), CreateBandsGroup(), CreateHeldGroup()];

    /// <summary>
    /// The shapes a card is actually written in — an article, a person, a reading, a request waiting on someone, and one a control
    /// in its header acts on: which of the three regions a kind of content belongs in.
    /// </summary>
    private static ContainerComponent CreateShapesGroup()
    {
        return DemoUI.CreateExample("What a card holds",
            UILayout.Row(16)
                .AddChild(new CardComponent()
                    .SetWidth(UILayoutLength.Absolute(300))
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Why Europe North runs on new disks")
                        .SetDescription("6 min read · Infrastructure")
                    )
                    // A paragraph rather than a text component: a card's body is prose, and text content keeps one line.
                    .SetContent(new ParagraphComponent()
                        .SetDescription("Stockholm opened in 2023 on new disks from the first day, so its databases read faster than any other region's, and the older regions now move over one server at a time.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                )
                .AddChild(new CardComponent()
                    .SetWidth(UILayoutLength.Absolute(300))
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Robin Hale")
                        .SetDescription("Orvane Cloud staff")
                        // The same Icon property carrying a picture, which with no size given fills the header's height.
                        .SetIcon(DemoImages.Avatar)
                        .SetBadgeText("Admin")
                    )
                    .SetContent(UILayout.Stack(8)
                        .AddChild(new TextComponent().SetIcon(DemoIcons.Mail).SetTitle("robin@orvane.example").SetTitleType(UITextAppearance.Caption))
                        .AddChild(new TextComponent().SetIcon(DemoIcons.Clock).SetTitle("UTC+2 · usually online 9-17").SetTitleType(UITextAppearance.Caption))
                    )
                )
                .AddChild(new CardComponent()
                    .SetWidth(UILayoutLength.Absolute(300))
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Deploys this week")
                        .SetBadgeText("+18%")
                        .SetBadgeStyle(UIBadgeType.Success)
                    )
                    .SetContent(new TextComponent()
                        .SetTitle("47")
                        .SetTitleType(UITextAppearance.Display)
                        .SetDescription("12 to production, 35 to staging")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddChild(new CardComponent()
                    .SetWidth(UILayoutLength.Absolute(300))
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Change request · CHG-482")
                        .SetDescription("Resize db-us-east-2 to Dedicated")
                        .SetIcon(DemoIcons.Check)
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Success))
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("Plan checked and the maintenance window booked — one approval left, and it is yours.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                    // The footer is where what you can do about the card goes, as one row of answers.
                    .SetFooter(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .AddChild(new ButtonComponent()
                            .SetType(UIButtonType.Primary)
                            .SetSize(UIButtonSize.Small)
                            .SetTitle("Approve")
                        )
                        .AddChild(new ButtonComponent()
                            .SetType(UIButtonType.Ghost)
                            .SetSize(UIButtonSize.Small)
                            .SetTitle("View plan")
                        )
                    )
                )
                .AddChild(new CardComponent()
                    .SetWidth(UILayoutLength.Absolute(300))
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Release 483")
                        .SetDescription("Scheduled for Friday")
                    )
                    // The header's own slot: what it does is close this card, not act on its content.
                    .SetHeaderAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Close))
                        .SetTooltip("Dismiss")
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("The header keeps its own text on one line and the control takes only what it needs.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                ),
            columns: 24
        );
    }

    /// <summary>
    /// Three targets in one card, where the pipeline stops at the innermost component that handles the event; and a clickable card
    /// switched off: no pointer press, no Tab stop, and read as unavailable.
    /// </summary>
    private static ContainerComponent CreatePressGroup()
    {
        return DemoUI.CreateExample("Where the press lands",
            UILayout.Stack(16)
                .AddChild(new CardComponent()
                    .SetClickable(true)
                    .SetSurface(UISurfaceStyle.Raised)
                    .OnClick(nameof(CardController.RecordCardClick))
                    .SetContextMenu(new MenuComponent()
                        .SetItems([new MenuItem { Id = "open", Title = "Open in a new tab", Icon = DemoIcons.Outline(DemoIcons.ExternalLink) }])
                        .OnItemClick(nameof(CardController.RecordMenuClick))
                    )
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Change request · CHG-482")
                        .SetDescription("Click the card, the button, or right-click either")
                    )
                    .SetContent(UILayout.Stack(10)
                        .AddChild(new ParagraphComponent()
                            .SetDescription("Selecting this sentence works too, which it did not while a card that was not clickable was made inert to keep its own click clean.")
                            .SetDescriptionType(UITextAppearance.Body)
                        )
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(CardController.RecordButtonClick))
                            .SetType(UIButtonType.Outline)
                            .SetSize(UIButtonSize.Small)
                            .SetHorizontalAlignment(UIAlignment.Start)
                            .SetTitle("A button inside it")
                        )
                    )
                    .SetWidth(UILayoutLength.Absolute(380))
                )
                .AddChild(new CardComponent()
                    .SetClickable(true)
                    .SetSurface(UISurfaceStyle.Raised)
                    .BindEnabled(nameof(CardPressGroupContext.Open), UIBindingScope.Relative)
                    .OnClick(nameof(CardController.PressLocked))
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Outline(DemoIcons.Lock))
                        .SetTitle("Production database")
                        .SetDescription("Changes open during the release window only.")
                    )
                    .SetWidth(UILayoutLength.Absolute(300))
                ),
            note: "Press the card, then the button inside it, then right-click it: a card that guards its own press must not leave its whole subtree deaf. From the keyboard, Tab stops on the card and then on the button; Enter or Space presses whichever holds the focus. The locked card is dimmed, a press does nothing and Tab passes it by; unlock it and it takes the focus and Enter or Space like any other clickable card.",
            context: PressGroup,
            // Below rather than beside: at half the page a column of 220 left the card too narrow for its title.
            controlsBelow: true,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Lock / unlock"] = nameof(CardController.ToggleLock)
            })
        );
    }

    /// <summary>
    /// <c>Loading</c> on a panel rather than a control: it covers header, content and footer together.
    /// </summary>
    private static ContainerComponent CreateRefreshGroup()
    {
        return DemoUI.CreateExample("A panel that re-reads itself",
            new CardComponent()
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
                    .OnClick(nameof(CardController.RefreshAsync))
                    // No InteractBeforeClick: the card's own Loading already covers this button.
                    .SetType(UIButtonType.Ghost)
                    .SetSize(UIButtonSize.Small)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
                    .SetTitle("Read again")
                )
                .SetWidth(UILayoutLength.Absolute(300)),
            note: "Loading sits on the panel rather than on the button: while the reading is stale there is nothing on the card worth pressing.",
            context: RefreshGroup
        );
    }

    /// <summary>
    /// Hover interactions write <c>Visible</c> on a panel the pointer is not over, entirely on the client.
    /// </summary>
    /// <remarks>The row must keep its height with the panel hidden, or the card resizes and moves the pointer off itself.</remarks>
    private static ContainerComponent CreateHoverGroup()
    {
        return DemoUI.CreateExample("What can be done to it, while the pointer is on it",
            new CardComponent(HoverCardId)
                .SetSurface(UISurfaceStyle.Raised)
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.Outline(DemoIcons.Check))
                    .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Success))
                    .SetTitle("Change request · CHG-482")
                    .SetDescription("Resize db-us-east-2 to Dedicated")
                )
                .SetContent(new ParagraphComponent()
                    .SetDescription("Plan checked and the maintenance window booked.")
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
                        .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1))
                    )
                    // Written on the panel: the id names the watched component, the property lands on this one.
                    .AddChild(new StackPanelComponent()
                        // Hidden, not Collapsed: the footer keeps the buttons' room, so the card's height never changes.
                        .SetVisibility(UIVisibility.Hidden)
                        .InteractOnHoverStart(HoverCardId, IVisualComponent.VisibilityProperty, UIVisibility.Visible)
                        .InteractOnHoverEnd(HoverCardId, IVisualComponent.VisibilityProperty, UIVisibility.Hidden)
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetWrap(true)
                        .SetSpacing(4)
                        .SetHorizontalAlignment(UIAlignment.End)
                        .SetPlacement(1, 2, 24, 1, md: UIGridPlacement.At(13, 1, 12, 1))
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(CardController.ViewPlan))
                            .SetType(UIButtonType.Ghost)
                            .SetSize(UIButtonSize.Small)
                            .SetTitle("View plan")
                        )
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(CardController.ApproveChange))
                            .SetType(UIButtonType.Primary)
                            .SetSize(UIButtonSize.Small)
                            .SetTitle("Approve")
                        )
                    )
                )
                .SetWidth(UILayoutLength.Absolute(380)),
            note: "Move the pointer onto the card. The reveal happens on the client alone, and the card keeps its height because the buttons are Hidden rather than Collapsed — a card that resized would move the pointer off itself.",
            context: HoverGroup
        );
    }

    /// <summary>
    /// The same content as a surface and as a card, so what a card adds is exactly what differs: two bands, drawn only where filled.
    /// </summary>
    private static ContainerComponent CreateBandsGroup()
    {
        // Across the page: the comparison reads side by side, where at half the page the three stood one under another.
        return DemoUI.CreateExample("What a card adds to a surface",
            UILayout.Row(16)
                .AddChild(UIPage.Labelled("SurfaceComponent", new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Raised)
                        .SetWidth(UILayoutLength.Absolute(260))
                        .SetContent(UILayout.Stack(8)
                            .AddChild(new TextComponent()
                                .SetTitle("Request CHG-482")
                                .SetDescription("Resize db-us-east-2 to Dedicated")
                                .SetDescriptionType(UITextAppearance.Caption)
                                .SetDescriptionColor(UIThemeColor.Muted)
                            )
                            .AddChild(new ParagraphComponent()
                                .SetDescription("Plan checked and the maintenance window booked — one approval left, and it is yours.")
                                .SetDescriptionType(UITextAppearance.Body)
                            )
                            .AddChild(new StackPanelComponent()
                                .SetOrientation(UIOrientation.Horizontal)
                                .SetSpacing(8)
                                .AddChild(new ButtonComponent()
                                    .SetType(UIButtonType.Primary)
                                    .SetSize(UIButtonSize.Small)
                                    .SetTitle("Approve")
                                )
                                .AddChild(new ButtonComponent()
                                    .SetType(UIButtonType.Ghost)
                                    .SetSize(UIButtonSize.Small)
                                    .SetTitle("View plan")
                                )
                            )
                        )
                    )
                )
                .AddChild(UIPage.Labelled("CardComponent", new CardComponent()
                        .SetSurface(UISurfaceStyle.Raised)
                        .SetWidth(UILayoutLength.Absolute(260))
                        .ConfigureDefaultHeader(header => header
                            .SetTitle("Request CHG-482")
                            .SetDescription("Resize db-us-east-2 to Dedicated")
                        )
                        .SetContent(new ParagraphComponent()
                            .SetDescription("Plan checked and the maintenance window booked — one approval left, and it is yours.")
                            .SetDescriptionType(UITextAppearance.Body)
                        )
                        .SetFooter(new StackPanelComponent()
                            .SetOrientation(UIOrientation.Horizontal)
                            .SetSpacing(8)
                            .AddChild(new ButtonComponent()
                                .SetType(UIButtonType.Primary)
                                .SetSize(UIButtonSize.Small)
                                .SetTitle("Approve")
                            )
                            .AddChild(new ButtonComponent()
                                .SetType(UIButtonType.Ghost)
                                .SetSize(UIButtonSize.Small)
                                .SetTitle("View plan")
                            )
                        )
                    )
                )
                .AddChild(UIPage.Labelled("A card with no header text and no footer", new CardComponent()
                        .SetWidth(UILayoutLength.Absolute(260))
                        .SetHeaderAction(new ButtonComponent()
                            .SetType(UIButtonType.Ghost)
                            .SetIcon(DemoIcons.Outline(DemoIcons.Close))
                            .SetTooltip("Dismiss")
                        )
                        .SetContent(new ParagraphComponent()
                            .SetDescription("A region is drawn only where there is something to draw, and a band that is nothing but a control keeps neither the rule nor the room a header would take.")
                            .SetDescriptionType(UITextAppearance.Body)
                        )
                    )
                ),
            columns: 24
        );
    }

    /// <summary>
    /// A card as the frame of something with an edge of its own: the card draws the edge, so what it holds draws none and runs to
    /// its sides.
    /// </summary>
    private static ContainerComponent CreateHeldGroup()
    {
        // Equal thirds with the preset's air between them: placed by hand, the three cards stood edge to edge.
        return DemoUI.CreateExample("In a card",
            UILayout.Columns(16,
                new CardComponent()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Cloud)
                        .SetTitle("billing")
                        .SetDescription("What the panel reads off the service")
                    )
                    // UIDetails.List: no action column and no edge of its own, since a summary is read, not operated.
                    .SetContent(UIDetails.List(("Region", "eu-west"), ("Replicas", "12"), ("Image", "billing:2.4.1"))),
                new CardComponent()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Cloud)
                        .SetTitle("Deployments")
                        .SetDescription("The four the card has room to summarise.")
                    )
                    .SetContent(new TableComponent()
                        .SetHorizontalScroll(UIScrollMode.Auto)
                        .SetItems(DemoDeploymentRow.CreateDeployments().GetRange(0, 4))
                        .AddTextColumn("Service", nameof(DemoDeploymentRow.Service))
                        .AddTextColumn("Region", nameof(DemoDeploymentRow.Region))
                        .AddTextColumn("Status", nameof(DemoDeploymentRow.Status), UIGridUnit.Absolute(110))
                        .SetBorderThickness(UIThickness.Uniform(0))
                    ),
                // A card with more than one face: the strip sits in the content band, under the header that names the whole.
                new CardComponent()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Upload)
                        .SetTitle("billing · #481")
                        .SetDescription("production · eu-west")
                        .SetBadgeText("Healthy")
                        .SetBadgeStyle(UIBadgeType.Success)
                    )
                    .SetContent(new TabsComponent()
                        .AddTab("log", "Log", new ParagraphComponent()
                            .SetDescription("12:04:11  pull     ok\n12:04:12  migrate  ok\n12:04:19  start    ok in 7.1s\n12:04:26  health   12 of 12 passed")
                            .SetDescriptionType(UITextAppearance.Caption)
                        )
                        .AddTab("snapshots", "Snapshots", UILayout.Stack(10)
                            .AddChild(new LinkComponent()
                                .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                                .SetTitle("billing-db-before-481.snap · 14.2 GB")
                                .SetUrl("https://orvane.example/snapshots/billing-db-before-481.snap")
                                .SetHorizontalAlignment(UIAlignment.Start)
                            )
                            .AddChild(new LinkComponent()
                                .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                                .SetTitle("billing-481.config.json · 212 KB")
                                .SetUrl("https://orvane.example/snapshots/billing-481.config.json")
                                .SetHorizontalAlignment(UIAlignment.Start)
                            )
                        )
                        .AddTab("timing", "Timing", UILayout.Stack(10)
                            .AddChild(new ProgressComponent().SetValue(100).SetColor(UIThemeColor.FromStyle(UIColorStyle.Success)))
                            .AddChild(new TextComponent()
                                .SetTitle("41 s end to end")
                                .SetDescription("pull 1 s · migrate 7 s · start 12 s · health check 21 s")
                                .SetDescriptionType(UITextAppearance.Caption)
                                .SetDescriptionColor(UIThemeColor.Muted)
                            )
                        )
                    )
            ),
            note: "A key-value list, a table and a tab strip, each a card's content: the card draws the edge, so none of them draws its own, and their rows run to the card's sides.",
            columns: 24
        );
    }
}
