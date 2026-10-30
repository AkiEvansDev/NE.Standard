using System.Collections.Generic;
using System.Linq;
using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;

namespace DemoApp.Views.Screens;

/// <summary>
/// A chat application: its sections on a rail that is the page's whole left side — the column of icons on a wide screen, the bottom
/// navigation bar on a phone, with no drawer — the chats or the people of the one open, and the conversation of the chat pressed:
/// beside the list from the medium width (<see cref="UILayout.Panes"/>), in its place on a phone, with a back arrow to the list.
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

    // The composer panel accepts dropped and pasted files onto the shelf via UIForm.Composer.
    // Dropped and pasted files land anywhere on the composer panel, which UIForm.Composer wires to the shelf.

    /// <summary>The wallpaper dialog's sliders, which the messages' ground copies while they are dragged.</summary>
    private const string WallpaperDimId = "chat-wallpaper-dim";
    private const string WallpaperBlurId = "chat-wallpaper-blur";

    /// <summary>A message's words on each side, which the menu's Copy reads on the page.</summary>
    private const string TheirTextId = "chat-their-text";
    private const string MyTextId = "chat-my-text";

    private static readonly string[] Emoji = ["😀", "😂", "😍", "🤔", "😢", "👍", "👀", "🙏", "🎉", "🔥", "🚀", "✅"];

    public static string ViewKey => "demo.screens.chat";

    protected override string ComponentRoute => "/screens/chat";
    protected override string Header => "demo.screens.chat.header";
    protected override string HeaderDescription => "demo.screens.chat.description";

    // The rail takes the sidebar's place, so the header leads with Back: the browser's own, or Home where the tab has nothing of the
    // site behind it.
    protected override IVisualComponent? CreateHeader()
        => DemoUI.CreateHeader(Header, HeaderDescription, UIIconButtons.Back().InteractOn(EventNames.Click, new NavigateBackEffect("/")));

    /// <summary>A messenger's panes are the region's height at every width, each scrolling inside itself, the composer always in sight.</summary>
    protected override UIResponsive<UILayoutLength>? ScreenHeight => UILayoutLength.Fill();

    /// <summary>The rail in a padded box and nothing else, so on a phone the side is the bar rather than a drawer.</summary>
    protected override IVisualComponent? CreateLeftSide()
        => new ContainerComponent()
            .SetPadding(UIThickness.All(8, 8, 4, 16))
            .AddChild(new MenuComponent("chat-rail")
                .SetDisplay(UIMenuDisplay.Rail)
                .BindItems<ChatController>(static x => x.Sections)
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
    /// ones on offer, and a press on one the whole of it; "Wallpaper": the picture behind the messages, which follows its controls as
    /// they move.
    /// </summary>
    protected override IReadOnlyList<UIDialog> CreateDialogs()
    {
        UIDialog[] dialogs =
        [
            UIDialogs.Create(
                ChatController.DayKey,
                "Go to a day",
                UILayout.Stack(12,
                UIText.Note("The days with messages are marked; a press on one goes there."),
                new CalendarComponent()
                    .SetHorizontalAlignment(UIAlignment.Center)
                    .BindValue<ChatController>(static x => x.JumpDay)
                    .BindMin<ChatController>(static x => x.FirstDay)
                    .BindMax<ChatController>(static x => x.LastDay)
                    .BindMarkedDays<ChatController>(static x => x.MessageDays)
                    .SetMarkedDaysOnly()
                    .OnChange(nameof(ChatController.GoToDayAsync))
                )
            ),
            UIDialogs.Create(
                ChatController.WallpaperKey,
                "Wallpaper",
                UILayout.Stack(16,
                UIText.Note("A picture behind the messages, dimmed and blurred in the browser as the sliders move."),
                new SwitchComponent()
                    .SetTitle("Show a picture")
                    .BindValue<ChatController>(static x => x.WallpaperShown)
                    .OnChange(nameof(ChatController.UpdateWallpaper)),
                new SliderComponent(WallpaperDimId)
                    .SetTitle("Dim")
                    .SetRange(0, 0.9m)
                    .SetStep(0.05m)
                    .SetShowValue()
                    .BindValue<ChatController>(static x => x.WallpaperDim)
                    .OnChange(nameof(ChatController.UpdateWallpaper)),
                new SliderComponent(WallpaperBlurId)
                    .SetTitle("Blur, pixels")
                    .SetRange(0, 32)
                    .SetStep(1)
                    .SetShowValue()
                    .BindValue<ChatController>(static x => x.WallpaperBlur)
                    .OnChange(nameof(ChatController.UpdateWallpaper))
                )
            )
        ];

        // The screen's words are its content, the dialogs' too.
        foreach (UIDialog dialog in dialogs)
            _ = ((StackPanelComponent)dialog.Content).AsContentTree();

        return dialogs;
    }

    protected override IVisualComponent CreateScreen()
        => UILayout.Panes(CreateList(), CreateConversation(), nameof(ChatController.Panes))
            .SetPadding(UIThickness.All(0, 8, 0, 0))
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
            .SetHeight(UILayoutLength.Fill())
            .AddChild(UIPage.BoundHeader(
                    UIHeaderSize.Pane,
                    null,
                    nameof(ChatController.Heading),
                    null,
                    // Folder glyphs, not a bare cross and plus: at a screen's top corner a cross reads as closing the screen.
                    UIButtons.Icon(DemoIcons.Outline(DemoIcons.FolderRemove), "Remove a folder").OnClick(nameof(ChatController.RemoveFolder)),
                    UIButtons.Icon(DemoIcons.Outline(DemoIcons.FolderAdd), "Add a folder").OnClick(nameof(ChatController.AddFolder))
                )
                .SetPlacement(1, 1, 24, 1)
            )
            // Filled: a lone search over the list, nothing stacked under it.
            .AddChild(new TextInputComponent(SearchId)
                .SetAppearance(UIInputAppearance.Filled)
                .SetSearch("Search chats")
                .SetDebounceMilliseconds(150)
                .BindVisibility<ChatController>(static x => x.ChatsVisibility)
                .SetMargin(UIThickness.All(0, 12, 0, 12))
                .SetPlacement(1, 2, 24, 1)
            )
            .AddChild(new ItemsViewComponent()
                .BindItems<ChatController>(static x => x.Chats)
                .FilterBy(SearchId, IInputComponent.ValueProperty, nameof(DemoChatItem.SearchText))
                .SetSelectionMode(UISelectionMode.One)
                .BindSelectedKey<ChatController>(static x => x.SelectedKey)
                .SetRowHoverable(true)
                .SetSpacing(2)
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
                .BindVisibility<ChatController>(static x => x.ChatsVisibility)
                .SetPlacement(1, 3, 24, 1)
            )
            // A person's last words are a phrase of their words and a moment, which the page keeps current and writes in its language.
            .AddChild(new ScrollContainerComponent()
                .VerticalScrollOnly()
                .AddChild(new MenuComponent()
                    .BindItems<ChatController>(static x => x.People)
                    .OnItemClickWithItemKey(nameof(ChatController.OpenPersonAsync))
                    .SetPlacement(1, 1, 24, 1)
                )
                .BindVisibility<ChatController>(static x => x.PeopleVisibility)
                .SetMargin(UIThickness.All(0, 12, 0, 0))
                .SetPlacement(1, 2, 24, 2)
            );

    /// <summary>
    /// A chat as a messenger lists it: the picture, the name over the last words, and when they came over what is unread.
    /// </summary>
    private static ContainerComponent CreateChatRow()
        => UILayout.Ends(
                UIText.BoundPerson(nameof(DemoChatItem.Avatar), nameof(DemoChatItem.Title), nameof(DemoChatItem.Description), UIBindingScope.Relative),
                UILayout.Stack(4,
                    new TimestampComponent()
                        .SetFormat(UITimestampFormat.Relative)
                        .BindValue<DemoChatItem>(static x => x.At, UIBindingScope.Relative)
                        .SetTextType(UITextAppearance.Caption)
                        .SetColor(UIThemeColor.Muted)
                        .SetHorizontalAlignment(UIAlignment.End),
                    new BadgeComponent()
                        .SetVariant(UIBadgeVariant.Primary)
                        .BindTitle<DemoChatItem>(static x => x.BadgeTitle, UIBindingScope.Relative)
                        .BindVisibility<DemoChatItem>(static x => x.UnreadVisibility, UIBindingScope.Relative)
                        .SetHorizontalAlignment(UIAlignment.End)
                )
            )
            .SetPadding(UIThickness.All(2, 6, 2, 6));

    /// <summary>The open chat: who it is with, its messages read from the end, and the composer.</summary>
    private static SurfaceComponent CreateConversation()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Surface)
            .SetPadding(UIThickness.Uniform(0))
            // Rows, not a stack: the messages take what the header and the composer leave, so the composer never drops out of sight.
            .SetContent(new ContainerComponent()
                .SetRow(1, UIGridUnit.Auto())
                .AddRow(UIGridUnit.Star())
                .AddRow(UIGridUnit.Auto())
                .AddChild(CreateConversationHeader().SetPlacement(1, 1, 24, 1))
                .AddChild(CreateWallpaper().SetPlacement(1, 2, 24, 1))
                .AddChild(CreateComposer().SetPlacement(1, 3, 24, 1))
            );

    /// <summary>The back arrow on a phone, the picture, the name and who they are, and the conversation's own menu.</summary>
    private static ContainerComponent CreateConversationHeader()
        => UIPage.BoundHeader(
                UIHeaderSize.Pane,
                UILayout.Row(4,
                    UIIconButtons.Back().OnClick(nameof(ChatController.Back)).ShownBelow(UIResponsiveTier.Md),
                    new ImageComponent()
                        .BindSource<ChatController>(static x => x.OpenAvatar)
                        .SetShape(UIShape.Circle)
                        .SetWidth(UILayoutLength.Absolute(32))
                        .SetHeight(UILayoutLength.Absolute(32))
                        .SetVerticalAlignment(UIAlignment.Center)
                ),
                nameof(ChatController.OpenName),
                nameof(ChatController.OpenStatus),
                // On a phone the menu holds it: the name needs the room.
                UIButtons.Icon(DemoIcons.Outline(DemoIcons.Calendar), "Go to a day")
                    .InteractOn(EventNames.Click, new OpenDialogEffect(ChatController.DayKey))
                    .ShownFrom(UIResponsiveTier.Md),
                UIIconButtons.More(ChatController.ConversationMenu()).OnItemClickWithItemKey(nameof(ChatController.ConversationActionAsync))
            )
            .SetPadding(UIThickness.All(12, 10, 12, 10));

    /// <summary>
    /// The reader's wallpaper behind the messages and the pinned bar, evenly dimmed and blurred as the wallpaper dialog says; the browser
    /// draws both, so a slider's step is the value and nothing else.
    /// </summary>
    /// <remarks>
    /// The dim and the blur follow the dialog's sliders on the page while they are dragged, with no round trip; the bindings carry what
    /// the controller stores once a slider is let go. Its own edges are the lines under the header and over the composer: a separator
    /// keeps air around its line, which would stand as a band of the panel's ground between the line and the picture.
    /// </remarks>
    private static ContainerComponent CreateWallpaper()
        => new ContainerComponent()
            .SetRow(1, UIGridUnit.Auto())
            .AddRow(UIGridUnit.Star())
            .SetBorderThickness(UIThickness.All(0, 1, 0, 1))
            .SetBorderColor(UIThemeColor.Border)
            .BindBackgroundImage<ChatController>(static x => x.WallpaperImage)
            .BindBackgroundImageDim<ChatController>(static x => x.WallpaperDimShare)
            .BindBackgroundImageBlur<ChatController>(static x => x.WallpaperBlurLength)
            .InteractCopyValue(WallpaperDimId, ISurfaceComponent.BackgroundImageDimProperty)
            .InteractCopyValue(WallpaperBlurId, ISurfaceComponent.BackgroundImageBlurProperty)
            .AddChild(CreatePinnedBar().SetPlacement(1, 1, 24, 1))
            .AddChild(CreateMessages().SetPlacement(1, 2, 24, 1));

    /// <summary>
    /// The conversation's pinned message, a raised bar in the row above the messages: the rows scrolled up pass under it without showing
    /// above its top edge.
    /// </summary>
    private static SurfaceComponent CreatePinnedBar()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Surface)
            .SetVerticalAlignment(UIAlignment.Start)
            // As wide as the messages' column under it, and centred with it in a wide pane.
            .SetHorizontalAlignment(UIAlignment.Center)
            .SetWidth(UILayoutLength.Fill())
            .SetMaxWidth(UILayoutLength.Absolute(760))
            .SetMargin(UIThickness.All(16, 8, 16, 0))
            .SetPadding(UIThickness.All(12, 6, 12, 6))
            .SetContent(new ParagraphComponent()
                .SetTitle("Pinned")
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.Primary)
                .SetDescription("The release moves to Thursday, 10:30; the checklist is in the files.")
                .SetMaxLines(1)
            );

    /// <summary>
    /// The messages, a window of thirty read from the end: theirs on the page's ground with the author's name in a group, the reader's
    /// own tinted at the far side; a day header over each day's first message, which opens the calendar on that day.
    /// </summary>
    private static ItemsViewComponent CreateMessages()
        => new ItemsViewComponent(ChatController.ConversationId)
            .BindSource<ChatController>(static x => x.Conversation)
            .SetWindowSize(30)
            .SetTemplateKeyProperty(nameof(DemoChatMessage.Side))
            .SetFallbackTemplateKey(DemoChatMessage.Theirs)
            .AddTemplateVariant(DemoChatMessage.Theirs, CreateBubble(UISurfaceStyle.Background, UIAlignment.Start, TheirTextId))
            .AddTemplateVariant(DemoChatMessage.Mine, CreateBubble(UISurfaceStyle.Tinted, UIAlignment.End, MyTextId))
            .SetGroupTemplate(CreateDayHeader())
            .VerticalScrollOnly()
            .AnchorToEnd()
            // Messages differ in height and side: rows of grey bars where older ones will land would read as messages of their own.
            .SetLoadingLook(UIItemsLoadingLook.Indicator)
            // A bubble is its own card: the row its bar stands over takes no wash across the conversation's width.
            .SetSelectionStyle(new UISelectionStyle(null, null, null, null, ActionBarBackground: UIThemeColor.Transparent))
            .SetSpacing(6)
            .SetPadding(UIThickness.All(16, 8, 16, 8))
            // A conversation reads as a column in a wide pane, its bar at the pane's edge rather than beside the bubbles.
            .SetContentMaxWidth(760);

    /// <summary>
    /// A message on its side of the conversation, its author over it in a group and its time under it; its own menu behind a right
    /// click or a long press, and the menu's frequent entries in a bar above it once it is chosen. Copy runs on the page, every other
    /// entry is the controller's.
    /// </summary>
    private static SurfaceComponent CreateBubble(UISurfaceStyle surface, UIAlignment side, string textId)
        => new SurfaceComponent()
            .SetSurface(surface)
            .SetPadding(UIThickness.All(12, 6, 12, 4))
            .SetMaxWidth(UILayoutLength.Absolute(420))
            .SetHorizontalAlignment(side)
            .SetContextMenu(new MenuComponent()
                .BindItems<DemoChatMessage>(static x => x.Actions, UIBindingScope.Relative)
                .OnItemClick(nameof(ChatController.MessageAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(DemoChatMessage.Id)))
                // The words the bubble shows are the copy: its description line, not the author over it.
                .OnItemClick(DemoChatMessage.CopyAction, CopyToClipboardEffect.ValueOf(textId))
                .OnItemClick(DemoChatMessage.CopyAction, new ShowNotificationEffect("Copied.", UIColorStyle.Info))
            )
            .SetActionBar(side == UIAlignment.End ? UIActionBarAlignment.End : UIActionBarAlignment.Start)
            .SetContent(UILayout.Stack(2,
                    // A paragraph's body, so a long message wraps rather than ending in an ellipsis; its words are the reader's to copy,
                    // though a row's are not by default (a long press on a phone stays the menu's).
                    new ParagraphComponent(textId)
                        .SetTextSelectable(true)
                        .BindTitle<DemoChatMessage>(static x => x.Author, UIBindingScope.Relative)
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.Primary)
                        .BindDescription<DemoChatMessage>(static x => x.Text, UIBindingScope.Relative)
                        // What a person typed, as typed: an asterisk or a bracket in it is no markup.
                        .SetDescriptionPlain(true)
                        .SetDescriptionType(UITextAppearance.Body),
                    CreatePhotos(),
                    CreateFiles(),
                    new TimestampComponent()
                        .SetFormat(UITimestampFormat.Time)
                        .BindValue<DemoChatMessage>(static x => x.Sent, UIBindingScope.Relative)
                        .SetTextType(UITextAppearance.Caption)
                        .SetColor(UIThemeColor.Muted)
                        .SetHorizontalAlignment(UIAlignment.End)
                )
            );

    /// <summary>
    /// The photos sent with a message, small squares in a wrap: a press on one shows it full size among the message's others, on the
    /// page alone — its arrows, ← and → or a swipe walk them, not the photos of other messages.
    /// </summary>
    private static ItemsViewComponent CreatePhotos()
        => new ItemsViewComponent()
            .BindItems<DemoChatMessage>(static x => x.Photos, UIBindingScope.Relative)
            .BindVisibility<DemoChatMessage>(static x => x.PhotosVisibility, UIBindingScope.Relative)
            .SetOrientation(UIOrientation.Horizontal)
            .SetLayoutType(UIItemsLayoutType.Wrap)
            .SetSpacing(4)
            .SetMargin(UIThickness.All(0, 4, 0, 2))
            .SetTemplate(new SurfaceComponent()
                .SetPadding(UIThickness.Uniform(0))
                .SetBorderRadius(UICornerRadius.Uniform(6))
                .SetContent(new ImageComponent()
                    .BindSource<DemoChatPhoto>(static x => x.Source, UIBindingScope.Relative)
                    .BindAltText<DemoChatPhoto>(static x => x.Title, UIBindingScope.Relative)
                    .SetFit(UIImageFit.Cover)
                    .SetBorderRadius(UICornerRadius.Uniform(6))
                    .SetWidth(UILayoutLength.Absolute(88))
                    .SetHeight(UILayoutLength.Absolute(88))
                )
                .OnClickShowImage(amongRows: true)
            );

    /// <summary>
    /// The files sent with a message, tiles in a wrap — the kind's glyph, the name on two lines, the size — as the composer's shelf
    /// draws a file; a press on one opens it.
    /// </summary>
    private static ItemsViewComponent CreateFiles()
        => new ItemsViewComponent()
            .BindItems<DemoChatMessage>(static x => x.Files, UIBindingScope.Relative)
            .BindVisibility<DemoChatMessage>(static x => x.FilesVisibility, UIBindingScope.Relative)
            .SetOrientation(UIOrientation.Horizontal)
            .SetLayoutType(UIItemsLayoutType.Wrap)
            .SetSpacing(4)
            .SetMargin(UIThickness.All(0, 4, 0, 2))
            .SetTemplate(new DefaultFileTemplate()
                .OnClick(nameof(ChatController.OpenFile), UIAction.ArgRelative("name", nameof(FileItem.FileName)))
            );

    /// <summary>
    /// The day on a pill in the middle, as a messenger heads it — "Today", "Yesterday", else the date — drawn from the day's first
    /// message; the group key names the day to the command.
    /// </summary>
    /// <remarks>Neutral, a hairline and the panel's fill over the wallpaper: a heading of the list, not a message, so no brand colour.</remarks>
    private static SurfaceComponent CreateDayHeader()
        => new SurfaceComponent()
            .SetBorderRadius(UICornerRadius.Uniform(999))
            .SetPadding(UIThickness.All(10, 2, 10, 2))
            .SetMargin(UIThickness.All(0, 10, 0, 4))
            .SetHorizontalAlignment(UIAlignment.Center)
            .OnClick(nameof(ChatController.ShowDay), UIAction.ArgGroupKey("day"))
            .SetContent(new TimestampComponent()
                .BindValue<DemoChatMessage>(static x => x.Sent, UIBindingScope.Relative)
                .SetFormat(UITimestampFormat.RelativeDate)
                .SetTextType(UITextAppearance.Caption)
                .SetColor(UIThemeColor.Muted)
            );

    /// <summary>
    /// The composer: the files waiting on a shelf above the text — not on the page until one is attached — and a text area that grows
    /// to six rows, sends on Enter and breaks the line on Shift+Enter, with the emoji, the clip and the quick replies before the text
    /// and Send after it — below the medium width the clip and the quick replies in a row under the text, at its start and its end, the
    /// emoji and Send beside it.
    /// </summary>
    private static SurfaceComponent CreateComposer()
        => UIForm.Composer(
            new TextAreaComponent(ChatController.ComposerId)
                .SetFormId(ComposerFormId)
                .SetPlaceholder("Write a message, or @ to mention")
                .SetSubmitOnEnter()
                .BindValue<ChatController>(static x => x.Draft)
                .AddTrigger("@")
                .BindTriggerItems<ChatController>(static x => x.MentionItems)
                .OnTriggerSearch(nameof(ChatController.SearchMentions))
                // In the press itself, not from a command: a browser opens a chooser only inside the reader's own gesture.
                .AddLeadingAction(UIIconButtons.Attach().InteractOn(EventNames.Click, new OpenPickerEffect(AttachmentsId)))
                // In the field, as a messenger's: it stays beside the words on a phone.
                .AddLeadingAction(CreateEmojiPanel(), inField: true)
                // On a phone at the end of the row under the text, under Send, where the thumb is; beside the text at its start.
                .AddLeadingAction(CreateQuickReplies(), belowAt: UIAlignment.End)
                .AddTrailingAction(UIIconButtons.Send().OnSubmitShowingLoading(ComposerFormId, nameof(ChatController.SendAsync)), inField: true),
            new FileInputComponent(AttachmentsId)
                .SetMaxFileSize(5 * 1024 * 1024)
                .BindSelectionIds<ChatController>(static x => x.AttachmentIds),
            UIText.BoundQuote(nameof(ChatController.ReplyAuthor), nameof(ChatController.ReplyText), closeCommand: nameof(ChatController.CancelReply))
                .BindVisibility<ChatController>(static x => x.ReplyVisibility)
        );

    /// <summary>
    /// The composer's emoji: a tile's press puts its emoji at the caret on the page itself — no round trip, and the draft's own undo
    /// takes it back.
    /// </summary>
    private static FlyoutComponent CreateEmojiPanel()
        => new FlyoutComponent()
            .SetPopupPlacement(UIPopupPlacement.TopStart)
            .SetAnchor(new ButtonComponent()
                .SetVariant(UIButtonVariant.Ghost)
                .SetIcon(DemoIcons.Outline(DemoIcons.Emoji))
                .SetTooltip("Emoji")
            )
            .SetContent(new ItemsViewComponent()
                .SetItems([.. Emoji.Select(static emoji => new TextItem { Id = emoji, Title = emoji, IsContent = true })])
                .SetLayoutType(UIItemsLayoutType.Wrap)
                .SetSpacing(2)
                .SetWidth(UILayoutLength.Absolute(236))
                .SetTemplate(new ButtonComponent()
                    .SetVariant(UIButtonVariant.Ghost)
                    .BindTitle<TextItem>(static x => x.Title, UIBindingScope.Relative)
                    .InteractOn(EventNames.Click, InsertTextEffect.CurrentItemKey(ChatController.ComposerId))
                )
            );

    /// <summary>
    /// The composer's quick replies: each entry inserts its words at the caret on the page, with no round trip and the draft untouched
    /// otherwise.
    /// </summary>
    private static SplitButtonComponent CreateQuickReplies()
    {
        SplitButtonComponent replies = new SplitButtonComponent()
            .SetMode(UISplitButtonMode.Menu)
            .SetVariant(UIButtonVariant.Ghost)
            .SetIcon(DemoIcons.Outline(DemoIcons.Bolt))
            .SetTooltip("Quick replies")
            .SetPopupPlacement(UIPopupPlacement.TopStart)
            .SetItems(ChatController.QuickReplies());

        foreach (KeyValuePair<string, string> reply in ChatController.QuickReplyWords)
            _ = replies.OnItemClick(reply.Key, InsertTextEffect.Literal(ChatController.ComposerId, reply.Value));

        return replies;
    }
}
