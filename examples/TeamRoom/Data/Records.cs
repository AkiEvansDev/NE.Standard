using System;
using System.Collections.Generic;

namespace TeamRoom.Data;

public static class AccountRoles
{
    public const string Admin = "admin";
    public const string User = "user";
}

public sealed record AccountRecord(
    string Id,
    string Login,
    string Nickname,
    string Role,
    bool IsBlocked,
    string? AvatarMediaId,
    string? BackgroundMediaId,
    string? BackgroundFit,
    DateTime CreatedUtc
)
{
    public bool IsAdmin => Role == AccountRoles.Admin;
}

public static class NodeKinds
{
    public const string Folder = "folder";
    public const string File = "file";
}

/// <summary>A folder or a text file; the content travels only when one file is read.</summary>
public sealed record NodeRecord(string Id, string? ParentId, string Kind, string Name, DateTime UpdatedUtc, string? UpdatedBy);

public static class ConversationKinds
{
    public const string Room = "room";
    public const string Direct = "direct";
}

/// <summary>A conversation as one account sees it: its own name for it, and how much of it that account has not read.</summary>
public sealed record ConversationRecord(string Id, string Kind, string Title, IReadOnlyList<string> MemberIds, long LastReadMessageId, int Unread);

public sealed record MessageRecord(long Id, string ConversationId, string AuthorId, string Text, DateTime SentUtc, DateTime? EditedUtc, IReadOnlyList<AttachmentRecord> Attachments);

public sealed record AttachmentRecord(string Id, long MessageId, string MediaId, string FileName, string ContentType, long Size, bool IsImage);

/// <summary>One message a search found, with enough around it to show and to jump to.</summary>
public sealed record MessageSearchHit(long MessageId, string ConversationId, string ConversationTitle, string AuthorId, string Text, DateTime SentUtc);

public static class MediaPurposes
{
    public const string Avatar = "avatar";
    public const string Background = "background";
    public const string Attachment = "attachment";
}

public sealed record MediaRecord(string Id, string OwnerId, string Purpose, string ContentType, long Size, byte[] Bytes, string? FileName);
