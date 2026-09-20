using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Extensions;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Screens;

/// <summary>
/// A list beside the thing chosen in it. The messages are served whole and bucketed by day; a search, a switch and a
/// select narrow them in the browser; a click opens one on the right, where it is read as prose with its toolbar,
/// its attachments and a reply box.
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

    protected override IVisualComponent CreateScreen()
        => UILayout.Sidebar(CreateList(), CreateReadingPane(), sideSpan: 9, spacing: 20)
            .SetPadding(UIThickness.All(0, 8, 0, 0))
            .SetPlacement(1, 1, 24, 1);

    /// <summary>The filters over the list, then the list: three rules, each active while its control holds a value.</summary>
    private static StackPanelComponent CreateList()
        => UILayout.Stack(12,
            new TextInputComponent(SearchId)
                .SetPlaceholder("Search by sender or subject")
                .SetPrefixIcon(DemoIcons.Search)
                .SetShowClearButton()
                .SetDebounceMilliseconds(150),
            UILayout.Columns(12,
                new SelectComponent(LabelId)
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
            ),
            new ItemsViewComponent()
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
                )
        );

    /// <summary>The pane: an empty state until a row is clicked, then the message read as prose.</summary>
    private static ContainerComponent CreateReadingPane()
        => new ContainerComponent()
            .AddChild(new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Tinted)
                .SetMinHeight(UILayoutLength.Absolute(320))
                .BindVisibility(nameof(InboxController.EmptyVisibility))
                .SetContent(new TextComponent()
                    .SetIcon(DemoIcons.Outline(DemoIcons.Mail))
                    .SetIconColor(UIThemeColor.Muted)
                    .SetTitle("Pick a message")
                    .SetDescription("It opens here, and stays open while you narrow the list.")
                    .Muted()
                    .SetTextAlignment(UITextAlignment.Center)
                    .SetHorizontalAlignment(UIAlignment.Center)
                    .SetVerticalAlignment(UIAlignment.Center)
                )
            )
            .AddChild(new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetPadding(UIThickness.Uniform(20))
                .BindVisibility(nameof(InboxController.ReadingVisibility))
                .SetContent(UILayout.Stack(16,
                    UILayout.Columns(16,
                        UIText.Title(string.Empty)
                            .BindTitle(nameof(InboxController.Subject))
                            .BindDescription(nameof(InboxController.FromLine))
                            .SetDescriptionColor(UIThemeColor.Muted),
                        UIButtons.Toolbar(
                            UIButtons.Icon(DemoIcons.Outline(DemoIcons.Undo), "Reply"),
                            UIButtons.Icon(DemoIcons.Outline(DemoIcons.ArrowRight), "Forward"),
                            UIButtons.Icon(DemoIcons.Outline(DemoIcons.Mail), "Mark as unread").OnClick(nameof(InboxController.MarkUnread)),
                            UIButtons.Icon(DemoIcons.Outline(DemoIcons.Folder), "Archive").OnClick(nameof(InboxController.Archive))
                        )
                        .SetHorizontalAlignment(UIAlignment.End)
                    ),
                    new SeparatorComponent(),
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
                    new TextAreaComponent()
                        .SetAppearance(UIInputAppearance.Outline)
                        .BindPlaceholder(nameof(InboxController.ReplyPlaceholder))
                        .SetRows(3)
                        .BindValue(nameof(InboxController.Reply)),
                    UIButtons.Pair(
                        UIButtons.Ghost("Discard"),
                        UIButtons.Primary("Send", DemoIcons.Outline(DemoIcons.Send)).OnClick(nameof(InboxController.Send))
                    )
                ))
            );
}
