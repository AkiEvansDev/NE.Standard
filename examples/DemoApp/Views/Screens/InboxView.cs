using System.Collections.Generic;
using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;

namespace DemoApp.Views.Screens;

/// <summary>
/// A list beside the thing chosen in it. The messages are served whole and bucketed by day; a search, a switch and a
/// select narrow them in the browser; a click opens one beside the list — in its place on a phone — where it is read as prose
/// with its toolbar, its attachments and a reply box.
/// </summary>
internal sealed class InboxView : DemoScreenView, IUIViewDefinition
{
    private const string SearchId = "inbox-search";
    private const string UnreadId = "inbox-unread";
    private const string LabelId = "inbox-label";

    public static string ViewKey => "demo.screens.inbox";

    protected override string ComponentRoute => "/screens/inbox";
    protected override string Header => "demo.screens.inbox.header";
    protected override string HeaderDescription => "demo.screens.inbox.description";

    /// <summary>"/" puts the keyboard in the search, on the page with no round trip; typed into a field, it is the field's.</summary>
    protected override IReadOnlyList<UIShortcut> CreateShortcuts()
        => [new UIShortcut("/", new FocusEffect(SearchId))];

    /// <summary>A mail client's panes are the region's height, the list and the message each scrolling inside itself.</summary>
    protected override UIResponsive<UILayoutLength>? ScreenHeight => UILayoutLength.Fill();

    protected override IVisualComponent CreateScreen()
        => UILayout.Panes(
            CreateList(),
            CreateReadingPane(),
            nameof(InboxController.Panes),
            UIPage.Empty(DemoIcons.Outline(DemoIcons.Mail), "Pick a message", "It opens here, and stays open while you narrow the list.")
        )
        .SetPadding(UIThickness.All(0, 8, 0, 0))
        .SetHeight(UILayoutLength.Fill())
        .SetPlacement(1, 1, 24, 1);

    /// <summary>The filters over the list, then the list: three rules, each active while its control holds a value.</summary>
    /// <remarks>
    /// The filters are Tonal: a toolbar over the list, not a form whose fields stack. Rows, not a stack: the list takes the pane's
    /// height under them and scrolls in it.
    /// </remarks>
    private static ContainerComponent CreateList()
        => new ContainerComponent()
            .SetRow(1, UIGridUnit.Auto())
            .AddRow(UIGridUnit.Auto())
            .AddRow(UIGridUnit.Star())
            .SetHeight(UILayoutLength.Fill())
            .AddChild(new TextInputComponent(SearchId)
                .SetAppearance(UIInputAppearance.Tonal)
                .SetSearch("Search by sender or subject")
                .SetDebounceMilliseconds(150)
                .SetPlacement(1, 1, 24, 1)
            )
            .AddChild(UILayout.Columns(12,
                    new SelectComponent(LabelId)
                        .SetAppearance(UIInputAppearance.Tonal)
                        .SetPlaceholder("Every label")
                        .SetShowClearButton()
                        .SetOptions(
                        [
                            new OptionItem { Id = InboxController.Deploys, Title = InboxController.Deploys },
                            new OptionItem { Id = InboxController.Reviews, Title = InboxController.Reviews },
                            new OptionItem { Id = InboxController.Billing, Title = InboxController.Billing },
                            new OptionItem { Id = InboxController.People, Title = InboxController.People }
                        ]),
                    new SwitchComponent(UnreadId)
                        .SetTitle("Unread only")
                        .SetVerticalAlignment(UIAlignment.Center)
                )
                .SetMargin(UIThickness.All(0, 12, 0, 12))
                .SetPlacement(1, 2, 24, 1)
            )
            .AddChild(new ItemsViewComponent()
                .BindItems(nameof(InboxController.Messages))
                .FilterBy(SearchId, IInputComponent.ValueProperty, nameof(DemoMessageItem.SearchText))
                .FilterBy(LabelId, IInputComponent.ValueProperty, nameof(DemoMessageItem.Label), UIComparisonOperator.Equal)
                .FilterBy(UnreadId, IInputComponent.ValueProperty, nameof(DemoMessageItem.Unread), UIComparisonOperator.Equal, UIComparisonOperator.Equal, true)
                .SetSelectionMode(UISelectionMode.One)
                .BindSelectedKey(nameof(InboxController.SelectedKey))
                .SetRowHoverable(true)
                .SetSpacing(2)
                .SetTemplate(new TextComponent()
                    .BindIcon(nameof(DemoMessageItem.Icon), UIBindingScope.Relative)
                    .SetIconColor(UIThemeColor.Muted)
                    .BindTitle(nameof(DemoMessageItem.Title), UIBindingScope.Relative)
                    .AsBody()
                    .BindDescription(nameof(DemoMessageItem.Description), UIBindingScope.Relative)
                    .SetDescriptionColor(UIThemeColor.Muted)
                    .BindBadgeText(nameof(DemoMessageItem.BadgeText), UIBindingScope.Relative)
                    .BindBadgeStyle(nameof(DemoMessageItem.BadgeStyle), UIBindingScope.Relative)
                    .SetBadgePlacement(UITextBadgePlacement.Trailing)
                )
                // After the template: an item event is registered on the template in hand, and the default one is replaced above.
                .OnItemClickWithItemKey(nameof(InboxController.OpenMessage))
                .ConfigureDefaultEmptyTemplate(template => _ = template
                    .SetIcon(DemoIcons.Outline(DemoIcons.Mail))
                    .SetTitle("Nothing here")
                    .SetDescription("No message matches; loosen the search or the switch.")
                    .SetWrapMode(UITextWrapMode.Wrap)
                )
                .VerticalScrollOnly()
                .SetPlacement(1, 3, 24, 1)
            );

    /// <summary>
    /// The open message: its subject and its toolbar — on a phone after the way back to the list, the browser's Back, which opening
    /// it pushed — and under them, scrolling, the message read as prose, its attachments and a reply box.
    /// </summary>
    private static SurfaceComponent CreateReadingPane()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Raised)
            .SetPadding(UIThickness.Uniform(0))
            .SetHeight(UILayoutLength.Fill())
            // Rows, not a stack: the message scrolls under its header, which stays in sight.
            .SetContent(new ContainerComponent()
                .SetRow(1, UIGridUnit.Auto())
                .AddRow(UIGridUnit.Star())
                .AddChild(CreateReadingHeader().SetPadding(UIThickness.All(12, 10, 12, 10)).SetPlacement(1, 1, 24, 1))
                .AddChild(new ScrollContainerComponent()
                    .VerticalScrollOnly()
                    .SetBorderThickness(UIThickness.All(0, 1, 0, 0))
                    .SetBorderColor(UIThemeColor.Border)
                    .AddChild(CreateMessage().SetPlacement(1, 1, 24, 1))
                    .SetPlacement(1, 2, 24, 1)
                )
            );

    private static ContainerComponent CreateReadingHeader()
        => UIPage.BoundHeader(
            UIHeaderSize.Pane,
            UIIconButtons.Back().InteractOn(EventNames.Click, new NavigateBackEffect("/screens/inbox")).ShownBelow(UIResponsiveTier.Md),
            nameof(InboxController.Subject),
            null,
            UIButtons.Icon(DemoIcons.Outline(DemoIcons.Undo), "Reply"),
            UIButtons.Icon(DemoIcons.Outline(DemoIcons.ArrowRight), "Forward"),
            UIButtons.Icon(DemoIcons.Outline(DemoIcons.Mail), "Mark as unread").OnClick(nameof(InboxController.MarkUnread)),
            UIButtons.Icon(DemoIcons.Outline(DemoIcons.Folder), "Archive").OnClick(nameof(InboxController.Archive))
        );

    private static StackPanelComponent CreateMessage()
        => UILayout.Stack(16,
                UIText.Note(string.Empty).BindDescription(nameof(InboxController.FromLine)),
                UIText.Paragraph(string.Empty).BindDescription(nameof(InboxController.Body)),
                UIText.Paragraph(string.Empty)
                    .BindDescription(nameof(InboxController.Quote))
                    .SetShowQuoteLine(true)
                    .SetDescriptionColor(UIThemeColor.Muted)
                    .BindVisibility(nameof(InboxController.QuoteVisibility)),
                new ItemsViewComponent()
                    .BindItems(nameof(InboxController.Attachments))
                    .SetLayoutType(UIItemsLayoutType.Wrap)
                    .SetSpacing(8)
                    .BindVisibility(nameof(InboxController.AttachmentsVisibility))
                    .SetTemplate(new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Tinted)
                        .SetPadding(UIThickness.All(10, 6, 10, 6))
                        .SetContent(new TextComponent()
                            .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                            .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                            .AsCaption()
                        )
                    ),
                new SeparatorComponent(),
                // Tonal: the reading pane already frames the reply, and Send is its own button.
                new TextAreaComponent()
                    .SetAppearance(UIInputAppearance.Tonal)
                    .BindPlaceholder(nameof(InboxController.ReplyPlaceholder))
                    .SetRows(3)
                    .BindValue(nameof(InboxController.Reply)),
                UIButtons.Pair(
                    UIButtons.Ghost("Discard"),
                    UIButtons.Primary("Send", DemoIcons.Outline(DemoIcons.Send)).OnClick(nameof(InboxController.Send))
                )
            )
            // At the header's 12 on the sides, so the subject and the message start on one line.
            .SetPadding(UIThickness.All(12, 20, 12, 20));
}
