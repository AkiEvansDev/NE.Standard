using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using NE.Standard.UI.Shell.Files;
using TeamRoom.Data;

namespace TeamRoom.Services;

/// <summary>
/// The pictures and files the application keeps — avatars, chat backgrounds, attachments — and who may fetch each:
/// the framework serves them at <see cref="IUIContentAddressResolver"/> and asks here, with the session, before answering.
/// </summary>
public sealed class MediaService(AppDatabase database, AccountService accounts, ChatService chat, IUIContentAddressResolver content) : IUIContentProvider
{
    /// <summary>The address a component names to show a stored item; a fresh id per upload, so the browser may keep it.</summary>
    public string AddressOf(string mediaId)
        => content.AddressOf(mediaId);

    public static bool IsImage(string? contentType)
        => contentType is not null && contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase);

    public string Store(string ownerId, string purpose, string contentType, byte[] bytes, string? fileName = null)
    {
        var id = AppDatabase.NewId();

        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "INSERT INTO media (id, owner_id, purpose, content_type, size, bytes, created_utc, file_name) VALUES ($id, $owner, $purpose, $type, $size, $bytes, $created, $name)";
        _ = command.Parameters.AddWithValue("$name", (object?)fileName ?? DBNull.Value);
        _ = command.Parameters.AddWithValue("$id", id);
        _ = command.Parameters.AddWithValue("$owner", ownerId);
        _ = command.Parameters.AddWithValue("$purpose", purpose);
        _ = command.Parameters.AddWithValue("$type", string.IsNullOrWhiteSpace(contentType) ? "application/octet-stream" : contentType);
        _ = command.Parameters.AddWithValue("$size", bytes.LongLength);
        _ = command.Parameters.AddWithValue("$bytes", bytes);
        _ = command.Parameters.AddWithValue("$created", AppDatabase.Now());
        _ = command.ExecuteNonQuery();

        return id;
    }

    public void Delete(string mediaId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "DELETE FROM media WHERE id = $id";
        _ = command.Parameters.AddWithValue("$id", mediaId);
        _ = command.ExecuteNonQuery();
    }

    private MediaRecord? Read(string mediaId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT id, owner_id, purpose, content_type, size, bytes, file_name FROM media WHERE id = $id";
        _ = command.Parameters.AddWithValue("$id", mediaId);

        using SqliteDataReader reader = command.ExecuteReader();

        return reader.Read()
            ? new MediaRecord(reader.GetString(0), reader.GetString(1), reader.GetString(2), reader.GetString(3), reader.GetInt64(4), (byte[])reader[5], reader.IsDBNull(6) ? null : reader.GetString(6))
            : null;
    }

    /// <summary>The name the picture was uploaded under, for a row that shows it.</summary>
    public string? NameOf(string mediaId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT file_name FROM media WHERE id = $id";
        _ = command.Parameters.AddWithValue("$id", mediaId);

        return command.ExecuteScalar() as string;
    }

    /// <summary>
    /// The rule, in one place: an avatar is anyone's to see, a background is its owner's, an attachment belongs to the
    /// people in its conversation. A blocked or deleted account gets nothing, whatever the session still says.
    /// </summary>
    public Task<UIContent?> ResolveAsync(UIContentRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (request.Session.UserId is not string accountId || accounts.Find(accountId) is not { IsBlocked: false })
            return Task.FromResult<UIContent?>(null);

        MediaRecord? media = Read(request.Key);

        if (media is null)
            return Task.FromResult<UIContent?>(null);

        var allowed = media.Purpose switch
        {
            MediaPurposes.Avatar => true,
            MediaPurposes.Background => media.OwnerId == accountId,
            MediaPurposes.Attachment => chat.ConversationOfAttachment(media.Id) is string conversationId && chat.IsMember(conversationId, accountId),
            _ => false
        };

        if (!allowed)
            return Task.FromResult<UIContent?>(null);

        return Task.FromResult<UIContent?>(new UIContent
        {
            Content = new MemoryStream(media.Bytes, writable: false),
            ContentType = media.ContentType,
            // A picture is shown where it is named; anything else is handed to the browser to save.
            FileName = IsImage(media.ContentType) ? null : AttachmentName(media.Id),
            Immutable = true
        });
    }

    private string AttachmentName(string mediaId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT file_name FROM attachments WHERE media_id = $id";
        _ = command.Parameters.AddWithValue("$id", mediaId);

        return command.ExecuteScalar() as string ?? "file";
    }
}
