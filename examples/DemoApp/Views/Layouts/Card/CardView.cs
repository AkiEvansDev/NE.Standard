using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.Table;
using DemoApp.Controllers.Layouts.Card;
using DemoApp.Views.Base;

namespace DemoApp.Views.Layouts.Card;

/// <summary>
/// Card preview with bound surface, background image and header properties, followed by header/body/footer slot combinations,
/// background dim and blur modes, clickable cards with nested controls, hover-revealed actions, card-level loading, and frameless inner views.
/// </summary>
internal sealed class CardView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string CardGroup = nameof(CardController.CardGroup);
    private const string BackgroundImageGroup = nameof(CardController.BackgroundImageGroup);
    private const string HeaderGroup = nameof(CardController.HeaderGroup);
    private const string HeaderTextGroup = nameof(CardController.HeaderTextGroup);
    private const string HeaderBadgeGroup = nameof(CardController.HeaderBadgeGroup);
    private const string BorderGroup = nameof(CardController.BorderGroup);
    private const string PressGroup = nameof(CardController.PressGroup);
    private const string HoverGroup = nameof(CardController.HoverGroup);
    private const string RefreshGroup = nameof(CardController.RefreshGroup);
    private const string PictureGroup = nameof(CardController.PictureGroup);

    private const string HoverCardId = "card-hover-host";
    private const string PictureDimId = "card-picture-dim";
    private const string PictureBlurId = "card-picture-blur";

    public static string ViewKey => "demo.layouts.card";

    protected override string ComponentRoute => "/layouts/card";
    protected override string Header => "demo.layouts.card.header";
    protected override string HeaderDescription => "demo.layouts.card.description";
    protected override (string Route, string Title)? ComposedIn => ("/screens/settings", "demo.nav.screens.settings");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new CardComponent()
            .BindStandard()
            .BindSurface<CardController>(static x => x.CardGroup.Surface)
            .BindClickable<CardController>(static x => x.CardGroup.Clickable)
            .BindPadding<CardController>(static x => x.CardGroup.Padding)
            .BindBackground<CardController>(static x => x.CardGroup.Background)
            .BindBackgroundImage<CardController>(static x => x.BackgroundImageGroup.BackgroundImage)
            .BindBackgroundImageFit<CardController>(static x => x.BackgroundImageGroup.BackgroundImageFit)
            .BindBackgroundImageDim<CardController>(static x => x.BackgroundImageGroup.BackgroundImageDim)
            .BindBackgroundImageDimMode<CardController>(static x => x.BackgroundImageGroup.BackgroundImageDimMode)
            .BindBackgroundImageBlur<CardController>(static x => x.BackgroundImageGroup.BackgroundImageBlur)
            .BindOverflow<CardController>(static x => x.CardGroup.Overflow)
            .BindBorder(BorderGroup)
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
                    .SetVariant(UIButtonVariant.Primary)
                    .SetSize(UISize.Small)
                    .SetTitle("Approve")
                )
                .AddChild(new ButtonComponent()
                    .SetVariant(UIButtonVariant.Ghost)
                    .SetSize(UISize.Small)
                    .SetTitle("View plan")
                )
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    private static void BindHeader(CardHeaderRegion header)
        => _ = header
            .BindTextContent(HeaderTextGroup)
            .BindDescription<CardController>(static x => x.HeaderTextGroup.Description)
            .BindDescriptionType<CardController>(static x => x.HeaderTextGroup.DescriptionType)
            .BindDescriptionColor<CardController>(static x => x.HeaderTextGroup.DescriptionColor)
            .BindTextAlignment<CardController>(static x => x.HeaderGroup.TextAlignment)
            .BindTextSelectable<CardController>(static x => x.HeaderGroup.TextSelectable)
            .BindRenamable<CardController>(static x => x.HeaderGroup.Renamable)
            .BindRenamedTitle<CardController>(static x => x.HeaderTextGroup.Title)
            .BindBadgePlacement<CardController>(static x => x.HeaderBadgeGroup.BadgePlacement)
            .BindBadgeVariant<CardController>(static x => x.HeaderBadgeGroup.BadgeVariant)
            .BindBadgeColor<CardController>(static x => x.HeaderBadgeGroup.BadgeColor)
            .BindBadgeFill<CardController>(static x => x.HeaderBadgeGroup.BadgeFill)
            .BindBadgeIcon<CardController>(static x => x.HeaderBadgeGroup.BadgeIcon)
            .BindBadgeIconColor<CardController>(static x => x.HeaderBadgeGroup.BadgeIconColor)
            .BindBadgeIconSize<CardController>(static x => x.HeaderBadgeGroup.BadgeIconSize)
            .BindBadgeTitle<CardController>(static x => x.HeaderBadgeGroup.BadgeTitle)
            .BindBadgeTitleType<CardController>(static x => x.HeaderBadgeGroup.BadgeTitleType)
            .BindBadgeTooltip<CardController>(static x => x.HeaderBadgeGroup.BadgeTooltip)
            .BindBadgeTooltipPlacement<CardController>(static x => x.HeaderBadgeGroup.BadgeTooltipPlacement);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(CardGroup, "Card"),
            DemoUI.CreateOptionSection(BackgroundImageGroup, "Background image"),
            DemoUI.CreateOptionSection(HeaderGroup, "Header layout"),
            DemoUI.CreateOptionSection(HeaderTextGroup, "Header content"),
            DemoUI.CreateOptionSection(HeaderBadgeGroup, "Header badge"),
            DemoUI.CreateOptionSection(BorderGroup, "Border")
        );

    protected override IVisualComponent[] CreateExamples()
        => [CreateShapesGroup(), CreatePicturesGroup(), CreatePressGroup(), DemoUI.CreateHalf(CreateHoverGroup(), CreateRefreshGroup()), CreateHeldGroup()];

    /// <summary>
    /// Common header, content, header-action and footer slot combinations.
    /// </summary>
    private static ContainerComponent CreateShapesGroup()
    {
        return DemoUI.CreateExample("Header, body & footer slots",
            UILayout.Row(16)
                .AddChild(new CardComponent()
                    .SetWidth(UILayoutLength.Absolute(300))
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Why Europe North runs on new disks")
                        .SetDescription("6 min read · Infrastructure")
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("Stockholm opened in 2023 on new disks from the first day, so its databases read faster than any other region's.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                )
                .AddChild(new CardComponent()
                    .SetWidth(UILayoutLength.Absolute(300))
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Robin Hale")
                        .SetDescription("Orvane Cloud staff")
                        .SetIcon(DemoImages.Avatar)
                        .SetIconShape(UIShape.Circle)
                        .SetBadgeTitle("Admin")
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
                        .SetBadgeTitle("+18%")
                        .SetBadgeVariant(UIBadgeVariant.Success)
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
                        .SetDescription("Plan checked and the maintenance window booked — one approval left.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                    .SetFooter(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .AddChild(new ButtonComponent()
                            .SetVariant(UIButtonVariant.Primary)
                            .SetSize(UISize.Small)
                            .SetTitle("Approve")
                        )
                        .AddChild(new ButtonComponent()
                            .SetVariant(UIButtonVariant.Ghost)
                            .SetSize(UISize.Small)
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
                    .SetHeaderAction(new ButtonComponent()
                        .SetVariant(UIButtonVariant.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Close))
                        .SetTooltip("Dismiss")
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("`SetHeaderAction` pins a trailing control in the header without wrapping the title.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                ),
            columns: 24,
            note: "Header and footer bands render only when populated; empty slots add neither divider lines nor padding."
        );
    }

    /// <summary>
    /// <c>BackgroundImage</c> with <c>Vignette</c> dim, even dim, and live client-mirrored dim + blur sliders (<c>InteractCopyValue</c>).
    /// </summary>
    private static ContainerComponent CreatePicturesGroup()
    {
        return DemoUI.CreateExample("Background image, dim & blur",
            UILayout.Stack(16)
                .AddChild(UILayout.Row(16)
                    .AddChild(CreatePictureCard("Northern harbour", "Vignette dim (0.9)")
                        .SetBackgroundImageDim(0.9)
                        .SetBackgroundImageDimMode(UIBackgroundDimMode.Vignette)
                    )
                    .AddChild(CreatePictureCard("Release notes", "Even dim (0.7) for full-card legibility.")
                        .SetBackgroundImageDim(0.7)
                    )
                    .AddChild(CreatePictureCard("Quiet hours", "Live dim & blur bound to the sliders below.")
                        .BindBackgroundImageDim<CardPictureGroupContext>(static x => x.Dim, UIBindingScope.Relative)
                        .BindBackgroundImageBlur<CardPictureGroupContext>(static x => x.Blur, UIBindingScope.Relative)
                        .InteractCopyValue(PictureDimId, ISurfaceComponent.BackgroundImageDimProperty)
                        .InteractCopyValue(PictureBlurId, ISurfaceComponent.BackgroundImageBlurProperty)
                    )
                )
                .AddChild(UILayout.Columns(16,
                        new SliderComponent(PictureDimId)
                            .SetTitle("Quiet hours: dim")
                            .SetRange(0, 0.9m)
                            .SetStep(0.05m)
                            .SetShowValue()
                            .BindValue<CardPictureGroupContext>(static x => x.Dim, UIBindingScope.Relative)
                            .OnChange(nameof(CardController.StorePicture)),
                        new SliderComponent(PictureBlurId)
                            .SetTitle("Quiet hours: blur (px)")
                            .SetRange(0, 32)
                            .SetStep(1)
                            .SetShowValue()
                            .BindValue<CardPictureGroupContext>(static x => x.Blur, UIBindingScope.Relative)
                            .OnChange(nameof(CardController.StorePicture))
                    )
                ),
            note: "`InteractCopyValue` mirrors slider drag updates onto the third card on the client immediately; releasing the thumb persists the value to the controller.",
            columns: 24,
            context: PictureGroup
        );
    }

    private static CardComponent CreatePictureCard(string title, string description)
        => new CardComponent()
            .SetTheme(UIThemeMode.Dark)
            .SetBackgroundImage(DemoImages.HarbourSky)
            .SetWidth(UILayoutLength.Absolute(300))
            .SetHeight(UILayoutLength.Absolute(200))
            .ConfigureDefaultHeader(header => header
                .SetTitle(title)
                .SetDescription(description)
            );

    /// <summary>
    /// Clickable card with nested button, text selection, context menu, and disabled state.
    /// </summary>
    private static ContainerComponent CreatePressGroup()
    {
        return DemoUI.CreateExample("Clickable card & nested controls",
            UILayout.Stack(16)
                .AddChild(new CardComponent()
                    .SetSurface(UISurfaceStyle.Surface)
                    .OnClick(nameof(CardController.RecordCardClick))
                    .SetContextMenu(new MenuComponent()
                        .SetItems([new MenuItem { Id = "open", Title = "Open in a new tab", Icon = DemoIcons.Outline(DemoIcons.ExternalLink) }])
                        .OnItemClick(nameof(CardController.RecordMenuClick))
                    )
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Change request · CHG-482")
                        .SetDescription("Click the card, the inner button, or right-click either")
                    )
                    .SetContent(UILayout.Stack(10)
                        .AddChild(new ParagraphComponent()
                            .SetDescription("Text inside a clickable card remains selectable, and inner controls intercept their own clicks and Tab stops.")
                            .SetDescriptionType(UITextAppearance.Body)
                        )
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(CardController.RecordButtonClick))
                            .SetVariant(UIButtonVariant.Ghost)
                            .SetSize(UISize.Small)
                            .SetHorizontalAlignment(UIAlignment.Start)
                            .SetTitle("Inner action")
                        )
                    )
                    .SetMaxWidth(UILayoutLength.Absolute(380))
                )
                .AddChild(new CardComponent()
                    .SetSurface(UISurfaceStyle.Surface)
                    .BindEnabled<CardPressGroupContext>(static x => x.Open, UIBindingScope.Relative)
                    .OnClick(nameof(CardController.PressLocked))
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Outline(DemoIcons.Lock))
                        .SetTitle("Production database")
                        .SetDescription("Changes open during the release window only.")
                    )
                    .SetMaxWidth(UILayoutLength.Absolute(300))
                ),
            note: "Clicks stop at the innermost interactive target (`ButtonComponent` before `CardComponent`), while `Enabled = false` dims the card and removes its Tab stop.",
            context: PressGroup,
            controlsBelow: true,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Lock / unlock"] = nameof(CardController.ToggleLock)
            })
        );
    }

    /// <summary>
    /// Client-side hover reveal using <c>UIVisibility.Hidden</c> + <c>InteractOnHoverStart</c> / <c>InteractOnHoverEnd</c>.
    /// </summary>
    private static ContainerComponent CreateHoverGroup()
    {
        return DemoUI.CreateExample("Hover-revealed footer actions",
            new CardComponent(HoverCardId)
                .SetSurface(UISurfaceStyle.Surface)
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
                .SetFooter(new ContainerComponent()
                    .AddChild(new TextComponent()
                        .SetTitle("Opened 6 days ago")
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.Muted)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1))
                    )
                    .AddChild(new StackPanelComponent()
                        // Hidden preserves footer height so hovering never shifts layout under the pointer.
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
                            .SetVariant(UIButtonVariant.Ghost)
                            .SetSize(UISize.Small)
                            .SetTitle("View plan")
                        )
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(CardController.ApproveChange))
                            .SetVariant(UIButtonVariant.Primary)
                            .SetSize(UISize.Small)
                            .SetTitle("Approve")
                        )
                    )
                )
                .SetMaxWidth(UILayoutLength.Absolute(380)),
            note: "`UIVisibility.Hidden` reserves layout height while invisible so revealing the buttons on hover never resizes the card.",
            context: HoverGroup
        );
    }

    /// <summary>
    /// <c>BindLoading</c> on the card itself, covering header, content and footer together during async refresh.
    /// </summary>
    private static ContainerComponent CreateRefreshGroup()
    {
        return DemoUI.CreateExample("Card-level loading state",
            new CardComponent()
                .SetSurface(UISurfaceStyle.Surface)
                .BindLoading<CardRefreshGroupContext>(static x => x.Busy, UIBindingScope.Relative)
                .ConfigureDefaultHeader(header => header
                    .SetTitle("Deploys this week")
                    .BindDescription<CardRefreshGroupContext>(static x => x.ReadAt, UIBindingScope.Relative)
                    .SetDescriptionType(UITextAppearance.Caption)
                )
                .SetContent(new TextComponent()
                    .BindTitle<CardRefreshGroupContext>(static x => x.Deploys, UIBindingScope.Relative)
                    .SetTitleType(UITextAppearance.Display)
                    .BindDescription<CardRefreshGroupContext>(static x => x.Split, UIBindingScope.Relative)
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .SetFooter(new ButtonComponent()
                    .OnClick(nameof(CardController.RefreshAsync))
                    .SetVariant(UIButtonVariant.Ghost)
                    .SetSize(UISize.Small)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
                    .SetTitle("Refresh")
                )
                .SetMaxWidth(UILayoutLength.Absolute(300)),
            note: "Binding `Loading` on `CardComponent` masks the entire panel while stale metrics are reloaded.",
            context: RefreshGroup
        );
    }

    /// <summary>
    /// Frameless <c>UIDetails.List</c>, <c>TableComponent</c> and <c>TabsComponent</c> hosted directly inside a card's content slot.
    /// </summary>
    private static ContainerComponent CreateHeldGroup()
    {
        return DemoUI.CreateExample("Frameless lists, tables & tabs inside a card",
            UILayout.Columns(16,
                new CardComponent()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Cloud)
                        .SetTitle("billing")
                        .SetDescription("Service summary")
                    )
                    .SetContent(UIDetails.List(("Region", "eu-west"), ("Replicas", "12"), ("Image", "billing:2.4.1"))),
                new CardComponent()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Cloud)
                        .SetTitle("Deployments")
                        .SetDescription("Latest four runs")
                    )
                    .SetContent(new TableComponent()
                        .SetHorizontalScroll(UIScrollMode.Auto)
                        .SetItems(DemoDeploymentRow.CreateDeployments().GetRange(0, 4))
                        .AddTextColumn("Service", nameof(DemoDeploymentRow.Service))
                        .AddTextColumn("Region", nameof(DemoDeploymentRow.Region))
                        .AddTextColumn("Status", nameof(DemoDeploymentRow.Status), UIGridUnit.Absolute(110))
                        .SetBorderThickness(UIThickness.Uniform(0))
                    ),
                new CardComponent()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Upload)
                        .SetTitle("billing · #481")
                        .SetDescription("production · eu-west")
                        .SetBadgeTitle("Healthy")
                        .SetBadgeVariant(UIBadgeVariant.Success)
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
            note: "Because `CardComponent` provides the outer border, hosted `KeyValueAction`, `Table` and `Tabs` views omit their own border (`SetBorderThickness(0)`).",
            columns: 24
        );
    }
}
