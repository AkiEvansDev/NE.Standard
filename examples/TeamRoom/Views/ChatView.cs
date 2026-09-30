using System.Collections.Generic;
using TeamRoom.Controllers;
using TeamRoom.Services;

namespace TeamRoom.Views;

/// <summary>
/// Conversations on the left, the open one on the right: a search over it, the feed on the reader's own background, the composer under it.
/// </summary>
public sealed class ChatView : TeamRoomView, IUIViewDefinition
{
    private const string SearchId = "chat-search";

    /// <summary>The emoji panel's tiles: each row's key is the emoji the tile puts at the composer's caret.</summary>
    private static readonly string[] Emoji =
    [
        "😀", "😂", "🙂", "😉", "😍", "🤔", "😅", "😢", "😮", "😎",
        "👍", "👎", "👏", "🙏", "💪", "👀", "🎉", "🔥", "✅", "❌",
        "❤️", "💡", "☕", "🚀"
    ];

    public static string ViewKey => "teamroom.chat";

    protected override string PageTitle => "Chat";

    protected override string PageDescription => "Rooms for everyone, and conversations for two.";

    // Side by side from the medium width up, where the shell's sides stop folding into drawers; below it one above the other, the
    // list as tall as its rows and the conversation taking the page's width and the height left, with no splitter to drag.
    protected override IVisualComponent CreatePage()
        => new ContainerComponent("chat-panes")
            .SetColumn(1, UIGridUnit.Absolute(260, min: 180, max: 480))
            .SetColumn(2, UIGridUnit.Auto())
            .SetRow(1, UIGridUnit.Auto())
            .AddRow(UIGridUnit.Star())
            .SetOverflow(UIOverflow.Hidden)
            .SetHeight(UILayoutLength.Fill())
            .AddChild(CreateListPane().SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 1, 2)))
            .AddChild(new GridSplitterComponent()
                .SetVisibility(UIResponsive<UIVisibility>.Create(UIVisibility.Collapsed, md: UIVisibility.Visible))
                .SetPlacement(2, 1, 1, 2)
            )
            .AddChild(CreateConversationPane().SetPlacement(1, 2, 24, 1, md: UIGridPlacement.At(3, 1, 22, 2)));

    private static StackPanelComponent CreateListPane()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(8)
            .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.All(0, 0, 0, 8), md: UIThickness.All(0, 0, 8, 0)))
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(4)
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .SetSize(UIButtonSize.Small)
                    .SetIcon(AppIcons.Outline(AppIcons.Room))
                    .SetTitle("Room")
                    .SetTooltip("A new room for everyone")
                    .OnClick(nameof(ChatController.OpenNewRoom))
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .SetSize(UIButtonSize.Small)
                    .SetIcon(AppIcons.Outline(AppIcons.Direct))
                    .SetTitle("Direct")
                    .SetTooltip("A conversation with one person")
                    .OnClick(nameof(ChatController.OpenNewDirect))
                )
            )
            .AddChild(new MenuComponent("chat-conversations")
                .BindItems(nameof(ChatController.Conversations))
            );

    /// <summary>Four rows: the title band, what a search found, the feed taking the rest, the composer.</summary>
    private static ContainerComponent CreateConversationPane()
        => new ContainerComponent()
            .SetRow(1, UIGridUnit.Auto())
            .AddRow(UIGridUnit.Auto())
            .AddRow(UIGridUnit.Star())
            .AddRow(UIGridUnit.Auto())
            .SetOverflow(UIOverflow.Hidden)
            .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.Uniform(0), md: UIThickness.All(8, 0, 0, 0)))
            .AddChild(CreateConversationHeader().SetMargin(UIThickness.All(0, 0, 0, 8)).SetPlacement(1, 1, 24, 1))
            .AddChild(CreateHits().SetMargin(UIThickness.All(0, 0, 0, 8)).SetPlacement(1, 2, 24, 1))
            .AddChild(CreateFeed().SetPlacement(1, 3, 24, 1))
            .AddChild(CreateComposer().SetMargin(UIThickness.All(0, 8, 0, 0)).SetPlacement(1, 4, 24, 1));

    private static ContainerComponent CreateConversationHeader()
        => new ContainerComponent()
            .AddRow(UIGridUnit.Auto())
            .AddChild(new TextComponent()
                .BindTitle(nameof(ChatController.Title))
                .SetTitleType(UITextAppearance.Subtitle)
                .BindDescription(nameof(ChatController.Subtitle))
                .SetDescriptionType(UITextAppearance.Caption)
                .SetPlacement(1, 1, 24, 1, xl: UIGridPlacement.At(1, 1, 12, 1))
            )
            // Under the title below the extra-large width, where half the conversation holds neither; the switch wraps under the field when
            // the two do not fit.
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
                .SetWrap(true)
                .SetHorizontalAlignment(UIAlignment.End)
                .AddChild(new TextInputComponent(SearchId)
                    .SetType(UITextInputType.Search)
                    .SetPlaceholder("Search messages")
                    .SetPrefixIcon(AppIcons.Outline(AppIcons.Search))
                    .SetShowClearButton()
                    .SetDebounceMilliseconds(300)
                    .SetWidth(UILayoutLength.Absolute(260))
                    .BindValue(nameof(ChatController.SearchText))
                    .OnChange(nameof(ChatController.Search))
                )
                .AddChild(new SwitchComponent()
                    .SetTitle("Everywhere")
                    .BindValue(nameof(ChatController.SearchEverywhere))
                    .OnChange(nameof(ChatController.ToggleEverywhere))
                    .SetVerticalAlignment(UIAlignment.Center)
                )
                .SetPlacement(1, 2, 24, 1, xl: UIGridPlacement.At(13, 1, 12, 1))
            );

    /// <summary>What the search found, above the feed; a hit is a row that jumps.</summary>
    private static CardComponent CreateHits()
        => new CardComponent()
            .BindVisibility(nameof(ChatController.HitsVisibility))
            .ConfigureDefaultHeader(static header => header
                .SetIcon(AppIcons.Outline(AppIcons.Search))
                .SetTitle("Found")
                .BindDescription(nameof(ChatController.HitsSummary))
            )
            .SetHeaderAction(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetSize(UIButtonSize.Small)
                .SetIcon(AppIcons.Outline(AppIcons.Close))
                .SetTooltip("Close the search")
                .OnClick(nameof(ChatController.ClearSearch))
            )
            .SetContent(new ItemsViewComponent()
                .BindItems(nameof(ChatController.Hits))
                .VerticalScrollOnly()
                .SetMaxHeight(UILayoutLength.Absolute(220))
                .SetSpacing(2)
                .SetTemplate(new ActionComponent()
                    .SetShowChevron(true)
                    .BindTitle(nameof(SearchHitItem.Text), UIBindingScope.Relative)
                    .BindDescription(nameof(SearchHitItem.Where), UIBindingScope.Relative)
                    .OnClick(nameof(ChatController.JumpToHitAsync), UIAction.ArgCurrentItemKey("id"))
                )
            );

    /// <summary>
    /// The feed on the reader's own background, anchored to its end so a new message follows on its own; each day is headed by its
    /// date, and the header opens the calendar that jumps to another.
    /// </summary>
    private static SurfaceComponent CreateFeed()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Background)
            .SetPadding(UIThickness.Uniform(0))
            .SetOverflow(UIOverflow.Hidden)
            .BindBackgroundImage(nameof(ChatController.BackgroundSource))
            .BindBackgroundImageFit(nameof(ChatController.BackgroundFit))
            .SetHeight(UILayoutLength.Fill())
            .SetVerticalAlignment(UIAlignment.Stretch)
            .SetContent(new ItemsViewComponent(ChatController.FeedId)
                .BindSource(nameof(ChatController.Messages))
                .SetWindowSize(40)
                .VerticalScrollOnly()
                .AnchorToEnd()
                .SetSpacing(6)
                .SetHeight(UILayoutLength.Fill())
                .SetTemplateKeyProperty(nameof(MessageItem.Side))
                .SetFallbackTemplateKey(MessageItem.TheirsSide)
                .AddTemplateVariant(MessageItem.TheirsSide, CreateMessage(mine: false))
                .AddTemplateVariant(MessageItem.MineSide, CreateMessage(mine: true))
                .SetGroupTemplate(CreateDayHeader())
                .SetPlacement(1, 1, 24, 1)
            );

    /// <summary>
    /// A day's date on a small raised pill in the middle of the feed, drawn from the day's first message in the window: the page writes
    /// it in the reader's zone and language. Pressed, it opens the jump calendar on that day.
    /// </summary>
    /// <remarks>The pill stands in a grid cell of its own: a header's root takes the feed's width, a grid child only its content's.</remarks>
    private static ContainerComponent CreateDayHeader()
        => new ContainerComponent()
            .SetMargin(UIThickness.Symmetric(0, 4))
            .AddChild(new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetClickable(true)
                .SetPadding(UIThickness.Symmetric(12, 2))
                .SetBorderThickness(UIThickness.Uniform(0))
                .SetBorderRadius(UICornerRadius.Uniform(12))
                .SetHorizontalAlignment(UIAlignment.Center)
                .OnClick(nameof(ChatController.OpenDays), UIAction.ArgGroupKey("day"))
                .SetContent(new TimestampComponent()
                    .SetFormat(UITimestampFormat.Date)
                    .BindValue(nameof(MessageItem.SentAt), UIBindingScope.Relative)
                    .SetTextType(UITextAppearance.Caption)
                )
                .SetPlacement(1, 1, 24, 1)
            );

    /// <summary>One message: the picture of who said it, the name and the time, the text, and what was attached.</summary>
    private static StackPanelComponent CreateMessage(bool mine)
    {
        StackPanelComponent bubble = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(4)
            .SetPadding(UIThickness.Symmetric(12, 8))
            .SetBackground(UIThemeColor.FromStyle(mine ? UIColorStyle.Primary : UIColorStyle.Surface))
            .SetBorderRadius(UICornerRadius.Uniform(12))
            // The feed's width below the extra-large breakpoint, where 640 runs past a narrow column and keeps the attachments from wrapping.
            .SetMaxWidth(UIResponsive<UILayoutLength>.Create(UILayoutLength.Fill(), xl: UILayoutLength.Absolute(640)))
            .AddChild(CreateMessageHeader(mine))
            .AddChild(new ParagraphComponent()
                .BindDescription(nameof(MessageItem.Text), UIBindingScope.Relative)
                .SetDescriptionType(UITextAppearance.Body)
                .SetDescriptionColor(UIThemeColor.FromStyle(mine ? UIColorStyle.OnPrimary : UIColorStyle.OnSurface))
                .SetWrapMode(UITextWrapMode.Wrap)
            )
            .AddChild(new ItemsViewComponent()
                .BindItems(nameof(MessageItem.Attachments), UIBindingScope.Relative)
                .BindVisibility(nameof(MessageItem.AttachmentsVisibility), UIBindingScope.Relative)
                .SetLayoutType(UIItemsLayoutType.Wrap)
                .SetSpacing(8)
                .SetTemplateKeyProperty(nameof(AttachmentItem.Kind))
                .SetFallbackTemplateKey(AttachmentItem.FileKind)
                .AddTemplateVariant(AttachmentItem.ImageKind, new SurfaceComponent()
                    .SetClickable(true)
                    .SetPadding(UIThickness.Uniform(0))
                    .SetBorderThickness(UIThickness.Uniform(0))
                    .SetBorderRadius(UICornerRadius.Uniform(8))
                    .SetOverflow(UIOverflow.Hidden)
                    .SetWidth(UILayoutLength.Absolute(120))
                    .SetHeight(UILayoutLength.Absolute(120))
                    .OnClick(nameof(ChatController.OpenPicture), UIAction.ArgCurrentItemKey("id"))
                    .SetContent(new ImageComponent()
                        .BindSource(nameof(AttachmentItem.Address), UIBindingScope.Relative)
                        .BindAltText(nameof(AttachmentItem.Name), UIBindingScope.Relative)
                        .SetFit(UIImageFit.Cover)
                        .SetWidth(UILayoutLength.Absolute(120))
                        .SetHeight(UILayoutLength.Absolute(120))
                    )
                )
                // A square of the picture's own size: the name across the top and a file's glyph where the picture would be, the whole
                // square pressed to fetch it.
                .AddTemplateVariant(AttachmentItem.FileKind, new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetClickable(true)
                    .SetPadding(UIThickness.Uniform(8))
                    .SetBorderThickness(UIThickness.Uniform(0))
                    .SetBorderRadius(UICornerRadius.Uniform(8))
                    .SetOverflow(UIOverflow.Hidden)
                    .SetWidth(UILayoutLength.Absolute(120))
                    .SetHeight(UILayoutLength.Absolute(120))
                    .OnClick(nameof(ChatController.DownloadAttachment), UIAction.ArgCurrentItemKey("id"))
                    .SetContent(new ContainerComponent()
                        .SetRow(1, UIGridUnit.Auto())
                        .AddRow(UIGridUnit.Star())
                        .SetHeight(UILayoutLength.Fill())
                        // Two lines at most: a name longer than the square is cut rather than pushing the glyph out of it.
                        .AddChild(new ParagraphComponent()
                            .BindTitle(nameof(AttachmentItem.Name), UIBindingScope.Relative)
                            .SetTitleType(UITextAppearance.Caption)
                            .SetMaxLines(2)
                            .SetPlacement(1, 1, 24, 1)
                        )
                        // The framework's glyph for the file's kind, as the shelf above the composer shows it before it is sent.
                        .AddChild(new IconComponent()
                            .BindIcon(nameof(AttachmentItem.Glyph), UIBindingScope.Relative)
                            .SetSize(UIIconSize.Large)
                            .SetColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                            .SetHorizontalAlignment(UIAlignment.Center)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(1, 2, 24, 1)
                        )
                    )
                )
            );

        if (mine)
            _ = bubble.SetContextMenu(CreateMessageMenu());

        StackPanelComponent row = new StackPanelComponent(mine ? ChatController.MineRowId : ChatController.TheirsRowId)
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(8)
            .SetHorizontalAlignment(mine ? UIAlignment.End : UIAlignment.Start);

        if (!mine)
        {
            _ = row.AddChild(new ImageComponent()
                .BindSource(nameof(MessageItem.Avatar), UIBindingScope.Relative)
                .SetFallbackSource(AppImages.DefaultAvatar)
                .SetFit(UIImageFit.Cover)
                .SetCornerRadius(UICornerRadius.Uniform(16))
                .SetWidth(UILayoutLength.Absolute(32))
                .SetHeight(UILayoutLength.Absolute(32))
                .SetVerticalAlignment(UIAlignment.Start)
            );
        }

        return row.AddChild(bubble);
    }

    /// <summary>
    /// The name and the time on one line, the time at the far edge: both take their own width (the first and last columns), and the
    /// star columns between them hold whatever room the bubble's text leaves, so a short message still shows the whole name.
    /// </summary>
    private static ContainerComponent CreateMessageHeader(bool mine)
        => new ContainerComponent()
            .SetColumn(1, UIGridUnit.Auto())
            .SetColumn(UIGridPlacement.GridColumns, UIGridUnit.Auto())
            .AddChild(new TextComponent()
                .BindTitle(nameof(MessageItem.Author), UIBindingScope.Relative)
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.FromStyle(mine ? UIColorStyle.OnPrimary : UIColorStyle.Primary))
                .SetPlacement(1, 1, 1, 1)
            )
            .AddChild(new TextComponent()
                .BindTitle(nameof(MessageItem.Time), UIBindingScope.Relative)
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                .SetMargin(UIThickness.All(12, 0, 0, 0))
                .SetPlacement(UIGridPlacement.GridColumns, 1, 1, 1)
            );

    /// <summary>An own message's right click: Edit opens the words in a dialog, Delete asks first. The entry says what, the row says which.</summary>
    private static MenuComponent CreateMessageMenu()
        => new MenuComponent()
            .SetItems([
                new MenuItem { Id = ChatController.EditAction, Title = "Edit", Icon = AppIcons.Outline(AppIcons.Rename) },
                new MenuItem { Id = ChatController.DeleteAction, Title = "Delete", Icon = AppIcons.Outline(AppIcons.Delete) }
            ])
            .OnItemClick(nameof(ChatController.MessageAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(MessageItem.Id)));

    /// <summary>
    /// The pictures and files waiting to go, then the text: a paper clip and the emoji panel at its start, Send at its end (Enter is the same
    /// button, Shift+Enter a new line), and the jump to the newest message beside it.
    /// </summary>
    /// <remarks>A grid, not a row: the last button takes what it needs and the field the rest, so the composer ends where the feed does.</remarks>
    private static ContainerComponent CreateComposer()
        => new ContainerComponent()
            .SetRow(1, UIGridUnit.Auto())
            .AddRow(UIGridUnit.Auto())
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(CreateAttachmentShelf().SetPlacement(1, 1, 24, 1))
            // A box a row tall that grows with its text: Enter sends and the caret stays for the next message, Shift+Enter breaks the line.
            .AddChild(new TextAreaComponent(ChatController.ComposerId)
                .SetPlaceholder("Write a message")
                .SetFormId(ChatController.ComposerFormId)
                .SetRows(1)
                .SetAutoGrow(6)
                .SetSubmitOnEnter()
                .BindValue(nameof(ChatController.Draft))
                .SetMargin(UIThickness.All(0, 0, 8, 0))
                // In the press itself: a browser opens a file chooser only inside the reader's own gesture.
                .AddLeadingAction(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .SetIcon(AppIcons.Outline(AppIcons.Attach))
                    .SetTooltip("Attach pictures or files")
                    .InteractOn(EventNames.Click, new OpenPickerEffect(ChatController.AttachmentsId))
                )
                .AddLeadingAction(CreateEmojiPanel())
                .AddTrailingAction(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .SetIcon(AppIcons.Outline(AppIcons.Send))
                    .SetTooltip("Send")
                    .OnSubmit(ChatController.ComposerFormId, nameof(ChatController.SendAsync))
                )
                .SetPlacement(1, 2, 23, 1)
            )
            .AddChild(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetIcon(AppIcons.Outline(AppIcons.Newest))
                .SetTooltip("Jump to the newest message")
                .OnClick(nameof(ChatController.JumpToNewest))
                .SetPlacement(24, 2, 1, 1)
            );

    /// <summary>
    /// The pictures and files picked for the next message as a row of squares — a picture its thumbnail, a file its kind's glyph and
    /// its name — and nothing on the page while there are none: the clip opens its chooser, and a file dropped or a picture pasted on
    /// the composer lands here too. One over the attachment limit is refused on its validation line before it uploads; Send takes
    /// the handles and empties it.
    /// </summary>
    private static ImageInputComponent CreateAttachmentShelf()
        => new ImageInputComponent(ChatController.AttachmentsId)
            .SetShape(UIImageInputShape.Shelf)
            // Any file, as a message carries: the shelf draws what is no picture as a file.
            .SetAccept(string.Empty)
            .SetDropTargetId(ChatController.ComposerId)
            .SetMaxFileSize(MediaService.MaxAttachmentBytes)
            .BindSelectionIds(nameof(ChatController.AttachmentSelectionIds));

    /// <summary>The emoji panel opening from a button at the composer's start: a tile puts its emoji where the caret stands.</summary>
    private static FlyoutComponent CreateEmojiPanel()
    {
        List<TextItem> tiles = new(Emoji.Length);

        foreach (var emoji in Emoji)
            tiles.Add(new TextItem { Id = emoji, Title = emoji });

        return new FlyoutComponent()
            .SetAnchor(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetIcon(AppIcons.Outline(AppIcons.Emoji))
                .SetTooltip("Emoji")
            )
            .SetContent(new ItemsViewComponent()
                .SetItems(tiles)
                .SetLayoutType(UIItemsLayoutType.Wrap)
                .SetSpacing(2)
                .SetWidth(UILayoutLength.Absolute(260))
                .SetTemplate(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                    .InteractOn(EventNames.Click, InsertTextEffect.CurrentItemKey(ChatController.ComposerId))
                )
            );
    }

    protected override IReadOnlyList<UIDialog> CreateDialogs()
        =>
        [
            new UIDialog
            {
                Key = ChatController.PictureDialogKey,
                Label = "Picture",
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(8)
                    .AddChild(new ImageComponent()
                        .BindSource(nameof(ChatController.OpenedPictureSource))
                        .BindAltText(nameof(ChatController.OpenedPictureName))
                        .SetFit(UIImageFit.Contain)
                        .SetMaxWidth(UILayoutLength.Absolute(1100))
                        .SetMaxHeight(UILayoutLength.Absolute(720))
                    )
                    .AddChild(new TextComponent()
                        .BindTitle(nameof(ChatController.OpenedPictureName))
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                    )
            },
            new UIDialog
            {
                Key = ChatController.DaysDialogKey,
                Label = "Jump to a day",
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new TextComponent().SetTitle("Jump to a day").SetTitleType(UITextAppearance.Title).SetDescription("The days with messages are marked."))
                    .AddChild(new CalendarComponent()
                        .SetMarkedDaysOnly()
                        .BindMarkedDays(nameof(ChatController.MessageDays))
                        .BindValue(nameof(ChatController.JumpDay))
                        .OnChange(nameof(ChatController.JumpToDayAsync))
                    )
            },
            new UIDialog
            {
                Key = ChatController.EditDialogKey,
                Label = "Edit message",
                CloseOnBackdrop = false,
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetMinWidth(UILayoutLength.Absolute(420))
                    .AddChild(new TextComponent().SetTitle("Edit the message").SetTitleType(UITextAppearance.Title).SetDescription("The attachments stay as they were sent."))
                    .AddChild(new TextAreaComponent().SetRows(4).BindValue(nameof(ChatController.EditText)))
                    .AddChild(CreateDialogButtons(nameof(ChatController.CloseDialogs), nameof(ChatController.SaveEdit), "Save"))
            },
            new UIDialog
            {
                Key = ChatController.DeleteDialogKey,
                Label = "Delete message",
                CloseOnBackdrop = false,
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetMinWidth(UILayoutLength.Absolute(360))
                    .AddChild(new TextComponent().SetTitle("Delete this message?").SetTitleType(UITextAppearance.Title).BindDescription(nameof(ChatController.DeleteQuestion)))
                    .AddChild(CreateDialogButtons(nameof(ChatController.CloseDialogs), nameof(ChatController.DeleteMessage), "Delete", UIButtonType.Danger))
            },
            new UIDialog
            {
                Key = ChatController.NewRoomDialogKey,
                Label = "New room",
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetMinWidth(UILayoutLength.Absolute(320))
                    .AddChild(new TextComponent().SetTitle("A new room").SetTitleType(UITextAppearance.Title).SetDescription("Everyone can see it and talk in it."))
                    .AddChild(new TextInputComponent().SetTitle("Name").BindValue(nameof(ChatController.NewRoomTitle)))
                    .AddChild(CreateDialogButtons(nameof(ChatController.CloseDialogs), nameof(ChatController.CreateRoom), "Create"))
            },
            new UIDialog
            {
                Key = ChatController.NewDirectDialogKey,
                Label = "A direct conversation",
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetMinWidth(UILayoutLength.Absolute(320))
                    .AddChild(new TextComponent().SetTitle("A direct conversation").SetTitleType(UITextAppearance.Title).SetDescription("Only the two of you read it."))
                    .AddChild(new SelectComponent()
                        .SetTitle("With")
                        .SetPlaceholder("Pick a person")
                        .BindOptions(nameof(ChatController.People))
                        .BindValue(nameof(ChatController.DirectTarget))
                    )
                    .AddChild(CreateDialogButtons(nameof(ChatController.CloseDialogs), nameof(ChatController.StartDirect), "Open"))
            }
        ];
}
