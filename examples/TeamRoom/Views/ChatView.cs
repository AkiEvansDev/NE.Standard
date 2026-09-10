using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using TeamRoom.Controllers;

namespace TeamRoom.Views;

/// <summary>
/// Conversations on the left, the open one on the right: a search over it, the feed on the reader's own background, the composer under it.
/// </summary>
public sealed class ChatView : TeamRoomView, IUIViewDefinition
{
    private const string SearchId = "chat-search";

    public static string ViewKey => "teamroom.chat";

    protected override string PageTitle => "Chat";

    protected override string PageDescription => "Rooms for everyone, and conversations for two.";

    protected override IVisualComponent CreatePage()
        => new ContainerComponent("chat-panes")
            .SetColumn(1, UIGridUnit.Absolute(260, min: 180, max: 480))
            .SetColumn(2, UIGridUnit.Auto())
            .SetOverflow(UIOverflow.Hidden)
            .SetHeight(UILayoutLength.Fill())
            .AddChild(CreateListPane().SetPlacement(1, 1, 1, 1))
            .AddChild(new GridSplitterComponent().SetPlacement(2, 1, 1, 1))
            .AddChild(CreateConversationPane().SetPlacement(3, 1, 22, 1));

    private static StackPanelComponent CreateListPane()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(8)
            .SetMargin(UIThickness.All(0, 0, 8, 0))
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
            .SetMargin(UIThickness.All(8, 0, 0, 0))
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
                .SetPlacement(1, 1, 12, 1)
            )
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
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
                .SetPlacement(13, 1, 12, 1)
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

    /// <summary>The feed on the reader's own background, anchored to its end so a new message follows on its own.</summary>
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
            .SetMaxWidth(UILayoutLength.Absolute(640))
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
                        .AddChild(new IconComponent()
                            .SetIcon(AppIcons.Outline(AppIcons.File))
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

    /// <summary>The text with its Send at the end (Enter is the same button), and a paper clip that opens the attach dialog.</summary>
    private static StackPanelComponent CreateComposer()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(8)
            .AddChild(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetIcon(AppIcons.Outline(AppIcons.Attach))
                .SetTooltip("Send a picture or files")
                .OnClick(nameof(ChatController.OpenAttach))
            )
            .AddChild(new TextInputComponent()
                .SetPlaceholder("Write a message")
                .SetFormId(ChatController.ComposerFormId)
                .BindValue(nameof(ChatController.Draft))
                .SetHorizontalAlignment(UIAlignment.Stretch)
                .SetWidth(UILayoutLength.Absolute(720))
                .SetTrailingAction(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .SetIcon(AppIcons.Outline(AppIcons.Send))
                    .SetTooltip("Send")
                    .OnSubmit(ChatController.ComposerFormId, nameof(ChatController.SendAsync))
                )
            )
            .AddChild(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetIcon(AppIcons.Outline(AppIcons.Check))
                .SetTooltip("Jump to the newest message")
                .OnClick(nameof(ChatController.JumpToNewest))
            );

    /// <summary>The attach dialog: pictures dropped or picked, any other files, the words, and Send.</summary>
    private static StackPanelComponent CreateAttachPanel()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .SetMinWidth(UILayoutLength.Absolute(420))
            .AddChild(new TextComponent().SetTitle("Send a picture or files").SetTitleType(UITextAppearance.Title).SetDescription("With a word to go with them, if you like."))
            .AddChild(new ImageInputComponent()
                .SetShape(UIImageInputShape.Picture)
                .SetMultiple(true)
                .SetPlaceholder("Drop pictures here, or pick them")
                .BindSelectionIds(nameof(ChatController.PictureSelectionIds))
            )
            .AddChild(new FileInputComponent()
                .SetTitle("Other files")
                .SetPlaceholder("Any files")
                .SetMultiple(true)
                .BindValue(nameof(ChatController.AttachmentText))
                .BindSelectionId(nameof(ChatController.AttachmentSelectionId))
            )
            .AddChild(new TextInputComponent()
                .SetTitle("Message")
                .SetPlaceholder("A word to go with it")
                .SetFormId(ChatController.ComposerFormId)
                .BindValue(nameof(ChatController.Draft))
            )
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
                .SetHorizontalAlignment(UIAlignment.End)
                .AddChild(new ButtonComponent().SetType(UIButtonType.Ghost).SetTitle("Cancel").OnClick(nameof(ChatController.CloseDialogs)))
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetIcon(AppIcons.Outline(AppIcons.Send))
                    .SetTitle("Send")
                    .OnSubmit(ChatController.ComposerFormId, nameof(ChatController.SendAsync))
                )
            );

    protected override IReadOnlyList<UIDialog> CreateDialogs()
        =>
        [
            new UIDialog
            {
                Key = ChatController.AttachDialogKey,
                Content = CreateAttachPanel()
            },
            new UIDialog
            {
                Key = ChatController.PictureDialogKey,
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
                Key = ChatController.EditDialogKey,
                CloseOnBackdrop = false,
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetMinWidth(UILayoutLength.Absolute(420))
                    .AddChild(new TextComponent().SetTitle("Edit the message").SetTitleType(UITextAppearance.Title).SetDescription("The attachments stay as they were sent."))
                    .AddChild(new TextAreaComponent().SetRows(4).BindValue(nameof(ChatController.EditText)))
                    .AddChild(CreateDialogButtons(nameof(ChatController.SaveEdit), "Save"))
            },
            new UIDialog
            {
                Key = ChatController.DeleteDialogKey,
                CloseOnBackdrop = false,
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetMinWidth(UILayoutLength.Absolute(360))
                    .AddChild(new TextComponent().SetTitle("Delete this message?").SetTitleType(UITextAppearance.Title).BindDescription(nameof(ChatController.DeleteQuestion)))
                    .AddChild(CreateDialogButtons(nameof(ChatController.DeleteMessage), "Delete", UIButtonType.Danger))
            },
            new UIDialog
            {
                Key = ChatController.NewRoomDialogKey,
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetMinWidth(UILayoutLength.Absolute(320))
                    .AddChild(new TextComponent().SetTitle("A new room").SetTitleType(UITextAppearance.Title).SetDescription("Everyone can see it and talk in it."))
                    .AddChild(new TextInputComponent().SetTitle("Name").BindValue(nameof(ChatController.NewRoomTitle)))
                    .AddChild(CreateDialogButtons(nameof(ChatController.CreateRoom), "Create"))
            },
            new UIDialog
            {
                Key = ChatController.NewDirectDialogKey,
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
                    .AddChild(CreateDialogButtons(nameof(ChatController.StartDirect), "Open"))
            }
        ];

    private static StackPanelComponent CreateDialogButtons(string command, string title, UIButtonType type = UIButtonType.Primary)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(8)
            .SetHorizontalAlignment(UIAlignment.End)
            .AddChild(new ButtonComponent().SetType(UIButtonType.Ghost).SetTitle("Cancel").OnClick(nameof(ChatController.CloseDialogs)))
            .AddChild(new ButtonComponent().SetType(type).SetTitle(title).OnClick(command));
}
