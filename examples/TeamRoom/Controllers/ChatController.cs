using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using TeamRoom.Data;
using TeamRoom.Services;

namespace TeamRoom.Controllers;

/// <summary>One file or picture under a message: shown inline when it is a picture, offered to save otherwise.</summary>
public sealed partial class AttachmentItem : RecursiveObservable, IBindableItem
{
    public const string ImageKind = "image";
    public const string FileKind = "file";

    [RecursiveMember(false)]
    public required string Id { get; init; }

    [RecursiveMember]
    public partial string Name { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Address { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Kind { get; set; } = FileKind;

    [RecursiveMember]
    public partial string SizeText { get; set; } = string.Empty;
}

/// <summary>A message as the feed shows it: who, when, what, and which side of the feed it sits on.</summary>
public sealed partial class MessageItem : RecursiveObservable, IBindableItem
{
    public const string MineSide = "mine";
    public const string TheirsSide = "theirs";

    [RecursiveMember(false)]
    public required string Id { get; init; }

    /// <summary>Whose it is, so a change of name or picture reaches the rows already in the window.</summary>
    [RecursiveMember(false)]
    public string AuthorId { get; init; } = string.Empty;

    [RecursiveMember]
    public partial string Author { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string? Avatar { get; set; }

    [RecursiveMember]
    public partial string Time { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Text { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Side { get; set; } = TheirsSide;

    [RecursiveMember]
    public partial UIVisibility AttachmentsVisibility { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember(false)]
    public RecursiveCollection<AttachmentItem> Attachments { get; } = [];
}

/// <summary>One message a search found: where it is, who said it, and the text to read before jumping.</summary>
public sealed partial class SearchHitItem : RecursiveObservable, IBindableItem
{
    [RecursiveMember(false)]
    public required string Id { get; init; }

    [RecursiveMember]
    public partial string Where { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Text { get; set; } = string.Empty;

    [RecursiveMember(false)]
    public string ConversationId { get; init; } = string.Empty;
}

/// <summary>
/// The conversation read from its end backwards, a window at a time; a message that lands while the reader is at the end is appended.
/// </summary>
public sealed class MessageSource : UIItemSourceBase<MessageItem>
{
    private ChatService? _chat;
    private string _conversationId = string.Empty;
    private Func<MessageRecord, MessageItem>? _shape;
    private Action<long>? _read;

    /// <summary>Reads the conversation; <paramref name="read"/> is told the newest message when a window reaches it.</summary>
    public void Attach(ChatService chat, string conversationId, Func<MessageRecord, MessageItem> shape, Action<long> read)
    {
        _chat = chat;
        _conversationId = conversationId;
        _shape = shape;
        _read = read;
    }

    /// <summary>Whether the source reads a conversation: the account may read the one the page is on.</summary>
    public bool IsAttached => _chat is not null;

    /// <summary>Whether the window the reader holds has this message.</summary>
    public bool Holds(string key)
        => Find(key) is not null;

    /// <summary>Which side of the feed a held message sits on, or <see langword="null"/> when it is not in the window.</summary>
    public string? SideOf(string key)
        => Find(key)?.Side;

    public void Receive(MessageRecord message)
    {
        if (_shape is null)
            return;

        // Only into the window the reader is holding: a new message must not pull them away from where they are reading.
        if (!HasMoreAfter)
            Append(_shape(message));
        else if (TotalCount is int total)
            TotalCount = total + 1;
    }

    /// <summary>A held message's words changed: the item is rewritten in place, so the row stays where the reader has it.</summary>
    public void Refresh(MessageRecord message)
    {
        if (_shape is null || Find(message.Id.ToString(CultureInfo.InvariantCulture)) is not { } item)
            return;

        MessageItem shaped = _shape(message);

        item.Text = shaped.Text;
        item.Time = shaped.Time;
    }

    /// <summary>A message is gone; the window and the count follow.</summary>
    public void Drop(long messageId)
        => _ = Remove(messageId.ToString(CultureInfo.InvariantCulture));

    protected override Task<UIItemWindow<MessageItem>> GetWindowAsync(UIItemWindowRequest request, CancellationToken cancellationToken)
    {
        if (_chat is null || _shape is null)
            return Task.FromResult(new UIItemWindow<MessageItem>([]) { Offset = 0, TotalCount = 0 });

        var total = (int)_chat.Count(_conversationId);

        var start = request.Anchor.Kind switch
        {
            UIItemAnchorKind.Start => 0,
            UIItemAnchorKind.End => total - request.Count,
            UIItemAnchorKind.Offset => request.Anchor.Offset,
            UIItemAnchorKind.Before => IndexOf(request.Anchor.Key!) - request.Count,
            UIItemAnchorKind.After => IndexOf(request.Anchor.Key!) + 1,
            _ => 0
        };

        start = Math.Clamp(start, 0, Math.Max(0, total - 1));

        IReadOnlyList<MessageRecord> page = _chat.Page(_conversationId, start, request.Count);
        MessageItem[] items = new MessageItem[page.Count];

        for (var i = 0; i < page.Count; i++)
            items[i] = _shape(page[i]);

        // Only a window that reaches the end: one read ahead of the viewer in the middle of the feed is not read by them yet.
        if (page.Count > 0 && start + items.Length >= total)
            _read?.Invoke(page[^1].Id);

        return Task.FromResult(new UIItemWindow<MessageItem>(items)
        {
            Offset = start,
            TotalCount = total,
            HasMoreBefore = start > 0,
            HasMoreAfter = start + items.Length < total
        });
    }

    private int IndexOf(string key)
        => _chat is null || !long.TryParse(key, NumberStyles.Integer, CultureInfo.InvariantCulture, out var id) ? 0 : _chat.IndexOf(_conversationId, id);
}

/// <summary>
/// The conversations on the left, one of them open on the right: its messages, a search over them, and the composer.
/// Which one is open is part of the address, so two tabs on two rooms are two pages and two tabs on one room are one.
/// </summary>
public sealed partial class ChatController : TeamRoomController
{
    public const string FeedId = "chat-feed";
    public const string MineRowId = "chat-message-mine";
    public const string TheirsRowId = "chat-message-theirs";
    public const string ComposerFormId = "chat-composer";
    public const string NewRoomDialogKey = "chat-new-room";
    public const string NewDirectDialogKey = "chat-new-direct";
    public const string AttachDialogKey = "chat-attach";
    public const string PictureDialogKey = "chat-picture";
    public const string EditDialogKey = "chat-edit";
    public const string DeleteDialogKey = "chat-delete";
    public const string EditAction = "edit";
    public const string DeleteAction = "delete";
    private const int WindowSize = 40;
    private const string DeletedAccount = "(deleted account)";

    private string _conversationId = ChatService.GeneralRoomId;

    /// <summary>The search hit the window was last opened on, so a reconnect with the same address does not pull the reader back to it.</summary>
    private long? _jumpedTo;

    // The newest message a window read while someone looked marked read, so a read of older messages writes nothing.
    private long _readThrough;
    private readonly Dictionary<string, AccountRecord?> _people = new(StringComparer.Ordinal);

    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Conversations { get; } = [];

    [RecursiveMember]
    public partial string Title { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Subtitle { get; set; } = string.Empty;

    [RecursiveMember(false)]
    public MessageSource Messages { get; } = new();

    [RecursiveMember]
    public partial string Draft { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string? AttachmentSelectionId { get; set; }

    /// <summary>What the picker shows — the file names — cleared with the selection once the message is away.</summary>
    [RecursiveMember]
    public partial string? AttachmentText { get; set; }

    /// <summary>The pictures picked for the next message: one upload handle each, in the order they were chosen.</summary>
    [RecursiveMember]
    public partial IReadOnlyList<string>? PictureSelectionIds { get; set; }

    /// <summary>The picture opened from the feed, at its full size, and the name it was sent under.</summary>
    [RecursiveMember]
    public partial string? OpenedPictureSource { get; set; }

    [RecursiveMember]
    public partial string? OpenedPictureName { get; set; }

    /// <summary>The message under the menu: its new words while the edit dialog is up, the question while the delete one is.</summary>
    private long _menuMessageId;

    [RecursiveMember]
    public partial string EditText { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string DeleteQuestion { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string SearchText { get; set; } = string.Empty;

    [RecursiveMember]
    public partial bool SearchEverywhere { get; set; }

    [RecursiveMember]
    public partial UIVisibility HitsVisibility { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial string HitsSummary { get; set; } = string.Empty;

    [RecursiveMember(false)]
    public RecursiveCollection<SearchHitItem> Hits { get; } = [];

    [RecursiveMember]
    public partial string? BackgroundSource { get; set; }

    [RecursiveMember]
    public partial UIImageFit BackgroundFit { get; set; } = UIImageFit.Cover;

    [RecursiveMember]
    public partial string NewRoomTitle { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string? DirectTarget { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<OptionItem> People { get; } = [];

    protected override async Task OnAccountReadyAsync(CancellationToken cancellationToken)
    {
        if (Context.Handle.Instance.Navigation.TryGetParameter(AppRoutes.ConversationParameter, out var requested)
            && !string.IsNullOrWhiteSpace(requested))
        {
            _conversationId = requested;
        }

        ApplyBackground();
        LoadConversations();
        LoadPeople();

        if (!ChatStore.IsMember(_conversationId, AccountId))
        {
            Title = "Not yours to read";
            Subtitle = "Pick a conversation on the left.";
            return;
        }

        Messages.Attach(ChatStore, _conversationId, Shape, ReadThrough);

        _jumpedTo = JumpTarget(Context.Handle.Instance.Navigation);

        await Messages.LoadWindowAsync(_jumpedTo is long messageId ? WindowEndingOn(messageId) : new UIItemWindowRequest(UIItemAnchor.End, WindowSize), cancellationToken).ConfigureAwait(false);

        // Not read yet: a render may prepare this page for nobody; the attach, when someone looks, marks it.
        RefreshUnread();
    }

    /// <summary>
    /// Someone opened the page: what it shows is read now, including what arrived while nobody looked. A kept runtime navigated to
    /// again from a search hit moves its window to the hit first.
    /// </summary>
    protected override async Task OnAttachedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(navigation);

        if (!Messages.IsAttached)
            return;

        if (JumpTarget(navigation) is long messageId && messageId != _jumpedTo)
        {
            _jumpedTo = messageId;

            await Messages.LoadWindowAsync(WindowEndingOn(messageId), cancellationToken).ConfigureAwait(false);
        }

        MarkRead();
        RefreshUnread();
    }

    private void ApplyBackground()
    {
        BackgroundSource = Account.BackgroundMediaId is null ? null : MediaStore.AddressOf(Account.BackgroundMediaId);
        BackgroundFit = Enum.TryParse(Account.BackgroundFit, out UIImageFit fit) ? fit : UIImageFit.Cover;
    }

    private void LoadConversations()
    {
        Conversations.Clear();

        foreach (ConversationRecord conversation in ChatStore.ListFor(AccountId))
        {
            var current = conversation.Id == _conversationId;

            Conversations.Add(new MenuItem
            {
                Id = conversation.Id,
                Title = conversation.Title,
                Icon = AppIcons.Outline(conversation.Kind == ConversationKinds.Room ? AppIcons.Room : AppIcons.Direct),
                Url = AppRoutes.ChatFor(conversation.Id),
                Selected = current,
                BadgeText = conversation.Unread == 0 || current ? null : conversation.Unread.ToString(CultureInfo.InvariantCulture),
                BadgeStyle = UIBadgeType.Primary
            });

            if (current)
            {
                Title = conversation.Title;
                Subtitle = conversation.Kind == ConversationKinds.Room ? "A room everyone is in" : "A conversation between the two of you";
            }
        }
    }

    /// <summary>Who a direct conversation can be started with; it changes only when an account does.</summary>
    private void LoadPeople()
    {
        People.Clear();

        foreach (AccountRecord account in AccountStore.ListActive())
        {
            if (account.Id != AccountId)
                People.Add(new OptionItem { Id = account.Id, Title = account.Nickname, Description = account.Login });
        }
    }

    /// <summary>The message a search hit opened the page on, when the address names one of this conversation's.</summary>
    private long? JumpTarget(UINavigationRequest navigation)
        => navigation.TryGetParameter(AppRoutes.MessageParameter, out var requested)
            && long.TryParse(requested, NumberStyles.Integer, CultureInfo.InvariantCulture, out var messageId)
            && ChatStore.FindMessage(messageId) is { } message
            && message.ConversationId == _conversationId
                ? messageId
                : null;

    /// <summary>
    /// A window whose last row is the message: the feed is anchored to its end, so that row is the one in view. Near the start the
    /// window is shorter rather than running past the message.
    /// </summary>
    private UIItemWindowRequest WindowEndingOn(long messageId)
    {
        var index = ChatStore.IndexOf(_conversationId, messageId);

        return new(UIItemAnchor.At(Math.Max(0, index - WindowSize + 1)), Math.Min(WindowSize, index + 1));
    }

    private MessageItem Shape(MessageRecord message)
    {
        AccountRecord? author = Person(message.AuthorId);

        MessageItem item = new()
        {
            Id = message.Id.ToString(CultureInfo.InvariantCulture),
            AuthorId = message.AuthorId,
            Author = author?.Nickname ?? DeletedAccount,
            Avatar = AvatarOf(author),
            Time = message.SentUtc.ToLocalTime().ToString("d MMM HH:mm", CultureInfo.InvariantCulture) + (message.EditedUtc is null ? string.Empty : " · edited"),
            Text = message.Text,
            Side = message.AuthorId == AccountId ? MessageItem.MineSide : MessageItem.TheirsSide,
            AttachmentsVisibility = message.Attachments.Count == 0 ? UIVisibility.Collapsed : UIVisibility.Visible
        };

        foreach (AttachmentRecord attachment in message.Attachments)
        {
            item.Attachments.Add(new AttachmentItem
            {
                Id = attachment.Id,
                Name = attachment.FileName,
                Address = MediaStore.AddressOf(attachment.MediaId),
                Kind = attachment.IsImage ? AttachmentItem.ImageKind : AttachmentItem.FileKind,
                SizeText = SizeText(attachment.Size)
            });
        }

        return item;
    }

    private AccountRecord? Person(string accountId)
    {
        if (!_people.TryGetValue(accountId, out AccountRecord? account))
            _people[accountId] = account = AccountStore.Find(accountId);

        return account;
    }

    private string? AvatarOf(AccountRecord? author)
        => author?.AvatarMediaId is null ? null : MediaStore.AddressOf(author.AvatarMediaId);

    private static string SizeText(long size)
        => size switch
        {
            < 1024 => string.Create(CultureInfo.InvariantCulture, $"{size} B"),
            < 1024 * 1024 => string.Create(CultureInfo.InvariantCulture, $"{size / 1024d:0.#} KB"),
            _ => string.Create(CultureInfo.InvariantCulture, $"{size / (1024d * 1024d):0.#} MB")
        };

    /// <summary>
    /// The reader has the newest message in front of them, so the count on the sidebar goes to zero — on this page now, and on the
    /// account's other pages through the event, since a runtime kept for its window keeps the count it last drew.
    /// </summary>
    private void MarkRead()
    {
        if (Messages.Items.Count == 0 || !long.TryParse(Messages.Items[^1].Id, NumberStyles.Integer, CultureInfo.InvariantCulture, out var last))
            return;

        ChatStore.MarkRead(_conversationId, AccountId, last);
        Events.Publish(new MessagesRead(AccountId));
    }

    /// <summary>
    /// The newest message reached by a window read while someone looks: opened on an older message, the feed is read once the
    /// reader scrolls down to its end, not only as far as the window the page opened with.
    /// </summary>
    private void ReadThrough(long messageId)
    {
        if (!HasViewers || messageId <= _readThrough)
            return;

        _readThrough = messageId;
        ChatStore.MarkRead(_conversationId, AccountId, messageId);
        Events.Publish(new MessagesRead(AccountId));
    }

    protected override void OnAppEvent(AppEvent appEvent)
    {
        switch (appEvent)
        {
            // Another runtime's message — another person's, or this account's from another page — lands in the feed, and the
            // conversation moves to the top of the list.
            case MessagePosted posted when posted.ConversationId == _conversationId && posted.Reaches(AccountId) && !ReferenceEquals(posted.Origin, this):
                Push(() =>
                {
                    if (ChatStore.FindMessage(posted.MessageId) is { } message)
                    {
                        Messages.Receive(message);

                        // Read only while someone looks: a runtime kept after its tab left marks nothing, and the next attach marks what
                        // the page shows then.
                        if (HasViewers)
                        {
                            MarkRead();
                            // The base counted before this page marked the message read; count again, or a "1" would sit on the sidebar until the next event.
                            RefreshUnread();
                        }
                    }

                    LoadConversations();
                });
                break;

            case MessagePosted posted when posted.Reaches(AccountId):
                Push(LoadConversations);
                break;

            case MessageChanged changed when changed.ConversationId == _conversationId && !ReferenceEquals(changed.Origin, this):
                Push(() =>
                {
                    if (ChatStore.FindMessage(changed.MessageId) is { } message)
                        Messages.Refresh(message);
                });
                break;

            case MessageDeleted deleted when deleted.ConversationId == _conversationId && !ReferenceEquals(deleted.Origin, this):
                Push(() =>
                {
                    Messages.Drop(deleted.MessageId);
                    LoadConversations();
                });
                break;

            case MessageDeleted deleted when deleted.Reaches(AccountId):
                Push(LoadConversations);
                break;

            case ConversationsChanged changed when changed.Reaches(AccountId):
                Push(LoadConversations);
                break;

            // The base already re-read the account; a runtime lives on across reloads, so the background follows here rather than at the next page.
            case AccountChanged changed:
                Push(() =>
                {
                    _ = _people.Remove(changed.AccountId);

                    if (changed.AccountId == AccountId)
                        ApplyBackground();

                    RefreshAuthor(changed.AccountId);
                    LoadConversations();
                    LoadPeople();
                });
                break;

            default:
                break;
        }
    }

    /// <summary>The rows already in the window carry the author's name and picture; a change of either is written into them.</summary>
    private void RefreshAuthor(string accountId)
    {
        AccountRecord? author = Person(accountId);

        foreach (MessageItem item in Messages.Items)
        {
            if (item.AuthorId != accountId)
                continue;

            item.Author = author?.Nickname ?? DeletedAccount;
            item.Avatar = AvatarOf(author);
        }
    }

    [UICommand]
    public async Task<UICommandResult> SendAsync(CancellationToken cancellationToken)
    {
        if (!ChatStore.IsMember(_conversationId, AccountId))
            return Refuse("This conversation is not yours.");

        var text = Draft.Trim();

        // The pictures first, then the files: the order the panel shows them.
        List<UIUploadFile> files = [];

        List<string?> selectionIds = [.. PictureSelectionIds ?? [], AttachmentSelectionId];

        foreach (var selectionId in selectionIds)
        {
            if (string.IsNullOrWhiteSpace(selectionId))
                continue;

            UIUploadSelection selection = await Context.Uploads.GetSelectionAsync(Context.Handle, selectionId, cancellationToken).ConfigureAwait(false);
            files.AddRange(selection.Files);
        }

        if (AttachmentLimitError(files) is { } limitError)
            return Refuse(limitError);

        List<(string MediaId, string FileName, string ContentType, long Size)> attachments = [];
        MessageRecord? message = null;

        try
        {
            foreach (UIUploadFile file in files)
            {
                UIUploadedFile upload = await Context.Uploads.OpenAsync(Context.Handle, file.FileId, cancellationToken: cancellationToken).ConfigureAwait(false);

                await using (upload.ConfigureAwait(false))
                {
                    var contentType = string.IsNullOrWhiteSpace(file.ContentType) ? "application/octet-stream" : file.ContentType;
                    var mediaId = await MediaStore.StoreAsync(AccountId, MediaPurposes.Attachment, contentType, upload.Content, file.Size, file.FileName, cancellationToken).ConfigureAwait(false);

                    attachments.Add((mediaId, file.FileName, contentType, file.Size));
                }
            }

            if (text.Length == 0 && attachments.Count == 0)
                return UICommandResult.Ok();

            message = ChatStore.Send(_conversationId, AccountId, text, attachments, origin: this);
        }
        finally
        {
            // Each file commits on its own, so one stored before a later one failed would stay counted against the quota with no
            // message to delete it by.
            if (message is null)
            {
                foreach ((var mediaId, _, _, _) in attachments)
                    MediaStore.Delete(mediaId);
            }
        }

        Draft = string.Empty;
        AttachmentSelectionId = null;
        AttachmentText = null;
        PictureSelectionIds = null;

        // The event told every other page; this one appends its own message here, inside the command.
        Messages.Receive(message);

        return UICommandResult.Ok([new CloseDialogEffect(AttachDialogKey)]);
    }

    /// <summary>What keeps the files from being sent — one too large, or the account's share used up — or null.</summary>
    private string? AttachmentLimitError(List<UIUploadFile> files)
    {
        long total = 0;

        foreach (UIUploadFile file in files)
        {
            if (file.Size > MediaService.MaxAttachmentBytes)
                return $"{file.FileName} is larger than {SizeText(MediaService.MaxAttachmentBytes)}.";

            total += file.Size;
        }

        if (total > 0 && MediaStore.UsedBy(AccountId, MediaPurposes.Attachment) + total > MediaService.MaxAttachmentBytesPerAccount)
            return $"Your attachments would pass {SizeText(MediaService.MaxAttachmentBytesPerAccount)}; delete older messages with files first.";

        return null;
    }

    [UICommand]
    public static UICommandResult OpenAttach()
        => UICommandResult.Ok([new OpenDialogEffect(AttachDialogKey)]);

    /// <summary>A file's square was clicked: the browser fetches it, named as it was sent.</summary>
    [UICommand]
    public UICommandResult DownloadAttachment(string id)
    {
        AttachmentItem? attachment = FindAttachment(id);

        if (attachment is null)
            return Refuse("That file is not in the feed any more.");

        return UICommandResult.Ok([new DownloadFileEffect(attachment.Address, attachment.Name)]);
    }

    /// <summary>A square in the feed was clicked: the picture opens at its full size, by the attachment's id the row carries.</summary>
    [UICommand]
    public UICommandResult OpenPicture(string id)
    {
        AttachmentItem? attachment = FindAttachment(id);

        if (attachment is null)
            return Refuse("That picture is not in the feed any more.");

        OpenedPictureSource = attachment.Address;
        OpenedPictureName = attachment.Name;

        return UICommandResult.Ok([new OpenDialogEffect(PictureDialogKey)]);
    }

    /// <summary>The menu on an own message: Edit opens the words in a dialog, Delete asks first.</summary>
    [UICommand]
    public UICommandResult MessageAction(string action, string id)
    {
        if (!long.TryParse(id, NumberStyles.Integer, CultureInfo.InvariantCulture, out var messageId) || ChatStore.FindMessage(messageId) is not { } message)
            return Refuse("That message is gone.");

        if (message.AuthorId != AccountId)
            return Refuse("Only your own messages.");

        _menuMessageId = messageId;

        switch (action)
        {
            case EditAction:
                EditText = message.Text;
                return UICommandResult.Ok([new OpenDialogEffect(EditDialogKey)]);

            case DeleteAction:
                DeleteQuestion = message.Text.Length > 80 ? message.Text[..80] + "…" : message.Text;
                return UICommandResult.Ok([new OpenDialogEffect(DeleteDialogKey)]);

            default:
                return Refuse("Unknown action.");
        }
    }

    [UICommand]
    public UICommandResult SaveEdit()
    {
        var error = ChatStore.Edit(_menuMessageId, AccountId, EditText, origin: this);

        if (error is not null)
            return Refuse(error);

        if (ChatStore.FindMessage(_menuMessageId) is { } message)
            Messages.Refresh(message);

        EditText = string.Empty;

        return UICommandResult.Ok([new CloseDialogEffect(EditDialogKey)]);
    }

    [UICommand]
    public UICommandResult DeleteMessage()
    {
        var error = ChatStore.Delete(_menuMessageId, AccountId, origin: this);

        if (error is not null)
            return Refuse(error);

        Messages.Drop(_menuMessageId);

        return UICommandResult.Ok([new CloseDialogEffect(DeleteDialogKey)]);
    }

    private AttachmentItem? FindAttachment(string id)
    {
        foreach (MessageItem message in Messages.Items)
        {
            foreach (AttachmentItem attachment in message.Attachments)
            {
                if (attachment.Id == id)
                    return attachment;
            }
        }

        return null;
    }

    [UICommand]
    public void Search()
    {
        var query = SearchText.Trim();

        Hits.Clear();

        if (query.Length == 0)
        {
            HitsVisibility = UIVisibility.Collapsed;
            HitsSummary = string.Empty;
            return;
        }

        IReadOnlyList<MessageSearchHit> hits = ChatStore.Search(AccountId, query, SearchEverywhere ? null : _conversationId);

        foreach (MessageSearchHit hit in hits)
        {
            Hits.Add(new SearchHitItem
            {
                Id = hit.MessageId.ToString(CultureInfo.InvariantCulture),
                ConversationId = hit.ConversationId,
                Where = $"{Person(hit.AuthorId)?.Nickname ?? DeletedAccount} · {hit.ConversationTitle} · {hit.SentUtc.ToLocalTime().ToString("d MMM HH:mm", CultureInfo.InvariantCulture)}",
                Text = hit.Text
            });
        }

        HitsSummary = hits.Count == 0 ? "Nothing found." : hits.Count == 1 ? "One message" : string.Create(CultureInfo.InvariantCulture, $"{hits.Count} messages");
        HitsVisibility = UIVisibility.Visible;
    }

    [UICommand]
    public void ToggleEverywhere()
        => Search();

    [UICommand]
    public void ClearSearch()
    {
        SearchText = string.Empty;
        Search();
    }

    /// <summary>A hit in this conversation scrolls into view; one elsewhere opens that conversation on it.</summary>
    [UICommand]
    public async Task<UICommandResult> JumpToHitAsync(string id, CancellationToken cancellationToken)
    {
        SearchHitItem? hit = null;

        foreach (SearchHitItem candidate in Hits)
        {
            if (candidate.Id == id)
                hit = candidate;
        }

        if (hit is null)
            return UICommandResult.Ok();

        if (hit.ConversationId != _conversationId)
        {
            return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest
            {
                Route = AppRoutes.Chat,
                Parameters = new Dictionary<string, object?> { [AppRoutes.ConversationParameter] = hit.ConversationId, [AppRoutes.MessageParameter] = id }
            })]);
        }

        if (!Messages.Holds(id))
        {
            var index = ChatStore.IndexOf(_conversationId, long.Parse(id, CultureInfo.InvariantCulture));

            await Messages.LoadWindowAsync(new UIItemWindowRequest(UIItemAnchor.At(Math.Max(0, index - (WindowSize / 2))), WindowSize), cancellationToken).ConfigureAwait(false);
        }

        // Each side is its own template, so the row to scroll to is named by the side the message sits on.
        var rowId = Messages.SideOf(id) == MessageItem.MineSide ? MineRowId : TheirsRowId;

        return UICommandResult.Ok([new ScrollToEffect(rowId, ScrollToBehavior.Smooth, ScrollToBlock.Center, id)]);
    }

    [UICommand]
    public UICommandResult OpenNewRoom()
    {
        NewRoomTitle = string.Empty;

        return UICommandResult.Ok([new OpenDialogEffect(NewRoomDialogKey)]);
    }

    [UICommand]
    public UICommandResult CreateRoom()
    {
        var error = ChatStore.CreateRoom(NewRoomTitle, out var id);

        if (error is not null)
            return Refuse(error);

        return UICommandResult.Ok([new CloseDialogEffect(NewRoomDialogKey), new NavigateEffect(new UINavigationRequest { Route = AppRoutes.ChatFor(id) })]);
    }

    [UICommand]
    public UICommandResult OpenNewDirect()
    {
        DirectTarget = null;

        return UICommandResult.Ok([new OpenDialogEffect(NewDirectDialogKey)]);
    }

    [UICommand]
    public UICommandResult StartDirect()
    {
        if (string.IsNullOrWhiteSpace(DirectTarget) || AccountStore.Find(DirectTarget) is not { IsBlocked: false })
            return Refuse("Pick someone first.");

        var id = ChatStore.GetOrCreateDirect(AccountId, DirectTarget);

        return UICommandResult.Ok([new CloseDialogEffect(NewDirectDialogKey), new NavigateEffect(new UINavigationRequest { Route = AppRoutes.ChatFor(id) })]);
    }

    [UICommand]
    public static UICommandResult CloseDialogs()
        => UICommandResult.Ok([
            new CloseDialogEffect(NewRoomDialogKey), new CloseDialogEffect(NewDirectDialogKey), new CloseDialogEffect(AttachDialogKey),
            new CloseDialogEffect(EditDialogKey), new CloseDialogEffect(DeleteDialogKey)
        ]);

    [UICommand]
    public static UICommandResult JumpToNewest()
        => UICommandResult.Ok([new ScrollEffect(FeedId, ScrollPosition.End)]);
}
