using System.Collections.Generic;
using System.Linq;
using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;

namespace DemoApp.Views.Screens;

/// <summary>
/// A chat application: its sections on a rail that is the page's whole left side — the column of icons on a wide screen, the bottom
/// navigation bar on a phone, with no drawer — the chats or the people of the one open, and the conversation of the chat pressed:
/// beside the list on a wide screen, in its place on a narrow one, with a back arrow to the list.
/// </summary>
/// <remarks>
/// The conversation is a windowed source read from its end backwards, a day header over each day, the message chosen carrying a bar
/// of its menu's frequent entries; the composer grows with its text, sends on Enter and carries files on a shelf above it.
/// </remarks>
internal sealed class ChatView : DemoScreenView, IUIViewDefinition
{
    private const string SearchId = "chat-search";

    /// <summary>The composer's form: Enter in the text area submits it, and the send button names the same one.</summary>
    private const string ComposerFormId = "chat-composer-form";

    /// <summary>The shelf's id, which the clip opens the chooser of.</summary>
    private const string AttachmentsId = "chat-attachments";

    /// <summary>The composer's panel, where dropped and pasted files land on the shelf.</summary>
    private const string ComposerPanelId = "chat-composer-panel";

    /// <summary>The wallpaper dialog's sliders, which the messages' ground copies while they are dragged.</summary>
    private const string WallpaperDimId = "chat-wallpaper-dim";
    private const string WallpaperBlurId = "chat-wallpaper-blur";

    private static readonly string[] Emoji = ["😀", "😂", "😍", "🤔", "😢", "👍", "👀", "🙏", "🎉", "🔥", "🚀", "✅"];

    /// <summary>Shown only below the wide breakpoint, where the conversation stands in the list's place.</summary>
    private static readonly UIResponsive<UIVisibility> NarrowOnly = UIResponsive<UIVisibility>.Create(UIVisibility.Visible, xl: UIVisibility.Collapsed);

    public static string ViewKey => "demo.screens.chat";

    protected override string ComponentRoute => "/screens/chat";
    protected override string Header => "demo.screens.chat.header";
    protected override string HeaderDescription => "demo.screens.chat.description";

    /// <summary>A messenger's panes are the region's height at every width, each scrolling inside itself, the composer always in sight.</summary>
    protected override bool FillsHeight => true;

    /// <summary>The rail in a padded box and nothing else, so on a phone the side is the bar rather than a drawer.</summary>
    protected override IVisualComponent? CreateLeftSide()
        => new ContainerComponent()
            .SetPadding(UIThickness.All(8, 8, 4, 16))
            .AddChild(new MenuComponent("chat-rail")
                .SetDisplay(UIMenuDisplay.Rail)
                .BindItems(nameof(ChatController.Sections))
                .OnItemClickWithItemKey(nameof(ChatController.Open))
            );

    /// <summary>A line under the chats, which ends above the bar on a phone rather than under it.</summary>
    protected override IVisualComponent? CreateFooter()
        => new ContainerComponent()
            .SetPadding(UIThickness.All(24, 8, 24, 8))
            .AsContentTree()
            .AddChild(UIText.Note("Messages are end-to-end encrypted."));

    /// <summary>
    /// "Go to a day": the dialog is the calendar, its days from the chat's first message to today, the days with messages the only
    /// ones on offer, and a press on one the whole of it.
    /// </summary>
    protected override IReadOnlyList<UIDialog> CreateDialogs()
        => [
            new UIDialog
            {
                Key = ChatController.DayKey,
                Label = "Go to a day",
                Content = UILayout.Stack(12)
                    .AsContentTree()
                    .AddChild(new ParagraphComponent()
                        .SetTitle("Go to a day")
                        .SetTitleType(UITextAppearance.Title)
                        .SetDescription("The days with messages are marked; a press on one goes there.")
                    )
                    .AddChild(new CalendarComponent()
                        .SetHorizontalAlignment(UIAlignment.Center)
                        .BindValue(nameof(ChatController.JumpDay))
                        .BindMin(nameof(ChatController.FirstDay))
                        .BindMax(nameof(ChatController.LastDay))
                        .BindMarkedDays(nameof(ChatController.MessageDays))
                        .SetMarkedDaysOnly()
                        .OnChange(nameof(ChatController.GoToDayAsync))
                    )
            },
            new UIDialog
            {
                Key = ChatController.WallpaperKey,
                Label = "Wallpaper",
                Content = UILayout.Stack(16)
                    .AsContentTree()
                    .AddChild(new ParagraphComponent()
                        .SetTitle("Wallpaper")
                        .SetTitleType(UITextAppearance.Title)
                        .SetDescription("A picture behind the messages, dimmed toward the page's ground so they read in either theme.")
                    )
                    .AddChild(new SwitchComponent()
                        .SetTitle("Show a picture")
                        .BindValue(nameof(ChatController.WallpaperShown))
                        .OnChange(nameof(ChatController.UpdateWallpaper))
                    )
                    .AddChild(new SliderComponent(WallpaperDimId)
                        .SetTitle("Dim")
                        .SetRange(0, 0.9m)
                        .SetStep(0.05m)
                        .SetShowValue()
                        .BindValue(nameof(ChatController.WallpaperDim))
                        .OnChange(nameof(ChatController.UpdateWallpaper))
                    )
                    .AddChild(new SliderComponent(WallpaperBlurId)
                        .SetTitle("Blur, pixels")
                        .SetRange(0, 32)
                        .SetStep(1)
                        .SetShowValue()
                        .BindValue(nameof(ChatController.WallpaperBlur))
                        .OnChange(nameof(ChatController.UpdateWallpaper))
                    )
            }
        ];

    protected override IVisualComponent CreateScreen()
        => new ContainerComponent()
            .AddChild(CreateList()
                .BindVisibility(nameof(ChatController.ListVisibility))
                .SetPlacement(UIResponsive<UIGridPlacement>.Create(UIGridPlacement.At(1, 1, 24, 1), xl: UIGridPlacement.At(1, 1, 9, 1)))
            )
            .AddChild(CreateConversation()
                .BindVisibility(nameof(ChatController.PaneVisibility))
                .SetPlacement(UIResponsive<UIGridPlacement>.Create(UIGridPlacement.At(1, 1, 24, 1), xl: UIGridPlacement.At(10, 1, 15, 1)))
            )
            .SetHeight(UILayoutLength.Fill())
            .SetPlacement(1, 1, 24, 1);

    /// <summary>
    /// The section's name and the folder buttons, then the chats — a search narrowing them in the browser — or the people, either
    /// taking the rest of the pane's height and scrolling in it.
    /// </summary>
    private static ContainerComponent CreateList()
        => new ContainerComponent()
            .SetRow(1, UIGridUnit.Auto())
            .AddRow(UIGridUnit.Auto())
            .AddRow(UIGridUnit.Star())
            .SetSpacing(12)
            .AddChild(new ContainerComponent()
                .SetColumn(24, UIGridUnit.Auto())
                .AddChild(UIText.Title(string.Empty)
                    .BindTitle(nameof(ChatController.Heading))
                    .SetVerticalAlignment(UIAlignment.Center)
                    .SetPlacement(1, 1, 23, 1)
                )
                .AddChild(UIButtons.Toolbar(
                        // Folder glyphs, not a bare cross and plus: at a screen's top corner a cross reads as closing the screen.
                        UIButtons.Icon(DemoIcons.Outline(DemoIcons.FolderRemove), "Remove a folder").OnClick(nameof(ChatController.RemoveFolder)),
                        UIButtons.Icon(DemoIcons.Outline(DemoIcons.FolderAdd), "Add a folder").OnClick(nameof(ChatController.AddFolder))
                    )
                    .SetVerticalAlignment(UIAlignment.Center)
                    .SetPlacement(24, 1, 1, 1)
                )
                .SetPlacement(1, 1, 24, 1)
            )
            .AddChild(new TextInputComponent(SearchId)
                .SetPlaceholder("Search chats")
                .SetPrefixIcon(DemoIcons.Search)
                .SetShowClearButton()
                .SetDebounceMilliseconds(150)
                .BindVisibility(nameof(ChatController.ChatsVisibility))
                .SetPlacement(1, 2, 24, 1)
            )
            .AddChild(new ItemsViewComponent()
                .BindItems(nameof(ChatController.Chats))
                .FilterBy(SearchId, IInputComponent.ValueProperty, nameof(DemoChatItem.SearchText))
                .SetSelectionMode(UISelectionMode.One)
                .BindSelectedKey(nameof(ChatController.SelectedKey))
                .SetRowHoverable(true)
                .SetTemplate(CreateChatRow())
                // After the template: an item event is registered on the template in hand.
                .OnItemClickWithItemKey(nameof(ChatController.OpenChatAsync))
                .ConfigureDefaultEmptyTemplate(template => _ = template
                    .SetIcon(DemoIcons.Outline(DemoIcons.MessageSquare))
                    .SetTitle("No chat matches")
                    .SetDescription("Search by a name or by the last words.")
                    .SetWrapMode(UITextWrapMode.Wrap)
                )
                .VerticalScrollOnly()
                .BindVisibility(nameof(ChatController.ChatsVisibility))
                .SetPlacement(1, 3, 24, 1)
            )
            // A person's last words are a phrase of their words and a moment, which the page keeps current and writes in its language.
            .AddChild(new ScrollContainerComponent()
                .VerticalScrollOnly()
                .AddChild(new MenuComponent()
                    .BindItems(nameof(ChatController.People))
                    .OnItemClickWithItemKey(nameof(ChatController.OpenPersonAsync))
                    .SetPlacement(1, 1, 24, 1)
                )
                .BindVisibility(nameof(ChatController.PeopleVisibility))
                .SetPlacement(1, 2, 24, 2)
            );

    /// <summary>
    /// A chat as a messenger lists it: the picture, the name over the last words, and when they came over what is unread.
    /// </summary>
    private static ContainerComponent CreateChatRow()
        => new ContainerComponent()
            .SetPadding(UIThickness.All(2, 6, 2, 6))
            .SetColumn(1, UIGridUnit.Auto())
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(CreateAvatar(44)
                .BindSource(nameof(DemoChatItem.Avatar), UIBindingScope.Relative)
                .BindAltText(nameof(DemoChatItem.Title), UIBindingScope.Relative)
                .SetPlacement(1, 1, 1, 1)
            )
            .AddChild(new TextComponent()
                .BindTitle(nameof(DemoChatItem.Title), UIBindingScope.Relative)
                .AsBody()
                .BindDescription(nameof(DemoChatItem.Description), UIBindingScope.Relative)
                .SetDescriptionColor(UIThemeColor.Muted)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetMargin(UIThickness.All(12, 0, 8, 0))
                .SetPlacement(2, 1, 22, 1)
            )
            .AddChild(UILayout.Stack(4,
                    new TimestampComponent()
                        .SetFormat(UITimestampFormat.Relative)
                        .BindValue(nameof(DemoChatItem.At), UIBindingScope.Relative)
                        .SetTextType(UITextAppearance.Caption)
                        .SetColor(UIThemeColor.Muted)
                        .SetHorizontalAlignment(UIAlignment.End),
                    new BadgeComponent()
                        .SetType(UIBadgeType.Primary)
                        .BindText(nameof(DemoChatItem.BadgeText), UIBindingScope.Relative)
                        .BindVisibility(nameof(DemoChatItem.UnreadVisibility), UIBindingScope.Relative)
                        .SetHorizontalAlignment(UIAlignment.End)
                )
                .SetVerticalAlignment(UIAlignment.Center)
                .SetPlacement(24, 1, 1, 1)
            );

    /// <summary>The open chat: who it is with, its messages read from the end, and the composer.</summary>
    private static SurfaceComponent CreateConversation()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Raised)
            .SetPadding(UIThickness.Uniform(0))
            .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.Uniform(0), xl: UIThickness.All(20, 0, 0, 0)))
            // Rows, not a stack: the messages take what the header and the composer leave, so the composer never drops out of sight.
            .SetContent(new ContainerComponent()
                .SetRow(1, UIGridUnit.Auto())
                .AddRow(UIGridUnit.Star())
                .AddRow(UIGridUnit.Auto())
                .AddChild(CreateConversationHeader().SetPlacement(1, 1, 24, 1))
                .AddChild(CreateWallpaper().SetPlacement(1, 2, 24, 1))
                .AddChild(CreateComposer().SetPlacement(1, 3, 24, 1))
            );

    /// <summary>The back arrow on a narrow screen, the picture, the name over who they are, and the conversation's own menu.</summary>
    private static ContainerComponent CreateConversationHeader()
        => new ContainerComponent()
            .SetPadding(UIThickness.All(12, 10, 12, 10))
            .SetColumn(1, UIGridUnit.Auto())
            .SetColumn(2, UIGridUnit.Auto())
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(UIButtons.Icon(DemoIcons.Outline(DemoIcons.ArrowBack), "Back to the chats")
                .OnClick(nameof(ChatController.Back))
                .SetVisibility(NarrowOnly)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetMargin(UIThickness.All(0, 0, 8, 0))
                .SetPlacement(1, 1, 1, 1)
            )
            .AddChild(CreateAvatar(40)
                .BindSource(nameof(ChatController.OpenAvatar))
                .BindAltText(nameof(ChatController.OpenName))
                .SetPlacement(2, 1, 1, 1)
            )
            .AddChild(new TextComponent()
                .BindTitle(nameof(ChatController.OpenName))
                .AsBody()
                .BindDescription(nameof(ChatController.OpenStatus))
                .SetDescriptionColor(UIThemeColor.Muted)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetMargin(UIThickness.All(12, 0, 8, 0))
                .SetPlacement(3, 1, 21, 1)
            )
            .AddChild(UILayout.Row(4,
                    // On a phone the menu holds it: the name needs the room.
                    UIButtons.Icon(DemoIcons.Outline(DemoIcons.Calendar), "Go to a day")
                        .OnClick(nameof(ChatController.OpenDayPicker))
                        .SetVisibility(UIResponsive<UIVisibility>.Create(UIVisibility.Collapsed, md: UIVisibility.Visible)),
                    // The "⋮" says it opens a menu by itself, so it draws no chevron after it.
                    new SplitButtonComponent()
                        .SetMode(UISplitButtonMode.Menu)
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.MoreVertical))
                        .SetShowChevron(false)
                        .SetTooltip("More")
                        .SetItems(ChatController.ConversationMenu())
                        .OnItemClickWithItemKey(nameof(ChatController.ConversationActionAsync))
                )
                .SetVerticalAlignment(UIAlignment.Center)
                .SetPlacement(24, 1, 1, 1)
            );

    /// <summary>
    /// The reader's wallpaper behind the messages alone, evenly dimmed in the theme's ground so the words read in either theme, and
    /// blurred as the wallpaper dialog says; the browser draws both, so a slider's step is the value and nothing else.
    /// </summary>
    /// <remarks>
    /// The dim and the blur follow the dialog's sliders on the page while they are dragged, with no round trip; the bindings carry what
    /// the controller stores once a slider is let go. Its own edges are the lines under the header and over the composer: a separator
    /// keeps air around its line, which would stand as a band of the panel's ground between the line and the picture.
    /// </remarks>
    private static ContainerComponent CreateWallpaper()
        => new ContainerComponent()
            .SetBorderThickness(UIThickness.All(0, 1, 0, 1))
            .SetBorderColor(UIThemeColor.Border)
            .BindBackgroundImage(nameof(ChatController.WallpaperImage))
            .BindBackgroundImageDim(nameof(ChatController.WallpaperDimShare))
            .BindBackgroundImageBlur(nameof(ChatController.WallpaperBlurLength))
            .InteractCopyValue(WallpaperDimId, ISurfaceComponent.BackgroundImageDimProperty)
            .InteractCopyValue(WallpaperBlurId, ISurfaceComponent.BackgroundImageBlurProperty)
            .AddChild(CreateMessages().SetPlacement(1, 1, 24, 1));

    /// <summary>
    /// The messages, a window of thirty read from the end: theirs on the page's ground with the author's name in a group, the reader's
    /// own tinted at the far side; a day header over each day's first message, which opens the calendar on that day.
    /// </summary>
    private static ItemsViewComponent CreateMessages()
        => new ItemsViewComponent(ChatController.ConversationId)
            .BindSource(nameof(ChatController.Conversation))
            .SetWindowSize(30)
            .SetTemplateKeyProperty(nameof(DemoChatMessage.Side))
            .SetFallbackTemplateKey(DemoChatMessage.Theirs)
            .AddTemplateVariant(DemoChatMessage.Theirs, CreateBubble(UISurfaceStyle.Background, UIAlignment.Start))
            .AddTemplateVariant(DemoChatMessage.Mine, CreateBubble(UISurfaceStyle.Tinted, UIAlignment.End))
            .SetGroupTemplate(CreateDayHeader())
            .VerticalScrollOnly()
            .AnchorToEnd()
            .SetSpacing(6)
            .SetMargin(UIThickness.All(16, 8, 16, 8));

    /// <summary>
    /// A message on its side of the conversation, its author over it in a group and its time under it; its own menu behind a right
    /// click or a long press, and the menu's frequent entries in a bar above it once it is chosen.
    /// </summary>
    private static SurfaceComponent CreateBubble(UISurfaceStyle surface, UIAlignment side)
        => new SurfaceComponent()
            .SetSurface(surface)
            .SetPadding(UIThickness.All(12, 6, 12, 4))
            .SetMaxWidth(UILayoutLength.Absolute(420))
            .SetHorizontalAlignment(side)
            .SetContextMenu(new MenuComponent()
                .BindItems(nameof(DemoChatMessage.Actions), UIBindingScope.Relative)
                .OnItemClick(nameof(ChatController.MessageAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(DemoChatMessage.Id)))
            )
            .SetActionBar(side == UIAlignment.End ? UIActionBarAlignment.End : UIActionBarAlignment.Start)
            .SetContent(UILayout.Stack(2,
                    // A paragraph's body, so a long message wraps rather than ending in an ellipsis; its words are the reader's to copy,
                    // though a row's are not by default (a long press on a phone stays the menu's).
                    new ParagraphComponent()
                        .SetTextSelectable(true)
                        .BindTitle(nameof(DemoChatMessage.Author), UIBindingScope.Relative)
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.Primary)
                        .BindDescription(nameof(DemoChatMessage.Text), UIBindingScope.Relative)
                        .SetDescriptionType(UITextAppearance.Body),
                    new TimestampComponent()
                        .SetFormat(UITimestampFormat.Time)
                        .BindValue(nameof(DemoChatMessage.Sent), UIBindingScope.Relative)
                        .SetTextType(UITextAppearance.Caption)
                        .SetColor(UIThemeColor.Muted)
                        .SetHorizontalAlignment(UIAlignment.End)
                )
            );

    /// <summary>
    /// The day on a pill in the middle, as a messenger heads it — "Today", "Yesterday", else the date — drawn from the day's first
    /// message; the group key names the day to the command.
    /// </summary>
    /// <remarks>Neutral, a hairline and no fill over the conversation's ground: a heading of the list, not a message, so no brand colour.</remarks>
    private static SurfaceComponent CreateDayHeader()
        => new SurfaceComponent()
            .SetClickable(true)
            .SetBackground(UIThemeColor.Transparent)
            .SetBorderRadius(UICornerRadius.Uniform(999))
            .SetPadding(UIThickness.All(10, 2, 10, 2))
            .SetMargin(UIThickness.All(0, 10, 0, 4))
            .SetHorizontalAlignment(UIAlignment.Center)
            .OnClick(nameof(ChatController.ShowDay), UIAction.ArgGroupKey("day"))
            .SetContent(new TimestampComponent()
                .BindValue(nameof(DemoChatMessage.Sent), UIBindingScope.Relative)
                .SetFormat(UITimestampFormat.RelativeDate)
                .SetTextType(UITextAppearance.Caption)
                .SetColor(UIThemeColor.Muted)
            );

    /// <summary>
    /// The composer: the files waiting on a shelf above the text — not on the page until one is attached — and a text area that grows
    /// to six rows, sends on Enter and breaks the line on Shift+Enter, with the clip, the emoji and the quick replies before the text
    /// and Send after it.
    /// </summary>
    private static ContainerComponent CreateComposer()
        => new ContainerComponent(ComposerPanelId)
            .SetPadding(UIThickness.All(8, 8, 8, 8))
            .AddChild(UILayout.Stack(8,
                    new ImageInputComponent(AttachmentsId)
                        .SetShape(UIImageInputShape.Shelf)
                        // Empty: any file, a picture shown as its thumbnail and anything else as its kind's glyph.
                        .SetAccept(string.Empty)
                        .SetMaxFileSize(5 * 1024 * 1024)
                        .SetDropTargetId(ComposerPanelId)
                        .BindSelectionIds(nameof(ChatController.AttachmentIds)),
                    new TextAreaComponent(ChatController.ComposerId)
                        .SetFormId(ComposerFormId)
                        .SetAppearance(UIInputAppearance.Ghost)
                        .SetPlaceholder("Write a message")
                        .SetRows(1)
                        .SetAutoGrow(6)
                        .SetSubmitOnEnter()
                        .BindValue(nameof(ChatController.Draft))
                        // In the press itself, not from a command: a browser opens a chooser only inside the reader's own gesture.
                        .AddLeadingAction(new ButtonComponent()
                            .SetType(UIButtonType.Ghost)
                            .SetIcon(DemoIcons.Outline(DemoIcons.Attach))
                            .SetTooltip("Attach files")
                            .InteractOn(EventNames.Click, new OpenPickerEffect(AttachmentsId))
                        )
                        // A tile's press puts its emoji at the caret on the page itself: no round trip, and the draft's own undo takes it back.
                        .AddLeadingAction(new FlyoutComponent()
                            .SetFlyoutPlacement(UIPopupPlacement.TopStart)
                            .SetAnchor(new ButtonComponent()
                                .SetType(UIButtonType.Ghost)
                                .SetIcon(DemoIcons.Outline(DemoIcons.Emoji))
                                .SetTooltip("Emoji")
                            )
                            .SetContent(new ItemsViewComponent()
                                .SetItems([.. Emoji.Select(static emoji => new TextItem { Id = emoji, Title = emoji, IsContent = true })])
                                .SetLayoutType(UIItemsLayoutType.Wrap)
                                .SetSpacing(2)
                                .SetWidth(UILayoutLength.Absolute(236))
                                .SetTemplate(new ButtonComponent()
                                    .SetType(UIButtonType.Ghost)
                                    .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                                    .InteractOn(EventNames.Click, InsertTextEffect.CurrentItemKey(ChatController.ComposerId))
                                )
                            )
                        )
                        // A quick reply is the controller's words, so its command answers with the text to insert rather than rewriting the draft.
                        .AddLeadingAction(new SplitButtonComponent()
                            .SetMode(UISplitButtonMode.Menu)
                            .SetType(UIButtonType.Ghost)
                            .SetIcon(DemoIcons.Outline(DemoIcons.Bolt))
                            .SetTooltip("Quick replies")
                            .SetItems(ChatController.QuickReplies())
                            .OnItemClickWithItemKey(nameof(ChatController.InsertQuickReply))
                        )
                        .AddTrailingAction(new ButtonComponent()
                            .SetType(UIButtonType.Ghost)
                            .SetIcon(DemoIcons.Outline(DemoIcons.Send))
                            .SetTooltip("Send")
                            .OnSubmit(ComposerFormId, nameof(ChatController.SendAsync))
                        )
                )
                .SetPlacement(1, 1, 24, 1)
            );

    /// <summary>A face, or a name's initials, in a circle: its shape squares the box and crops the picture rather than fitting it.</summary>
    private static ImageComponent CreateAvatar(double size)
        => new ImageComponent()
            .SetShape(UIImageShape.Circle)
            .SetWidth(UILayoutLength.Absolute(size))
            .SetHeight(UILayoutLength.Absolute(size))
            .SetVerticalAlignment(UIAlignment.Center);
}
