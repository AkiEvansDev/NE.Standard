using System;
using System.Collections.Frozen;
using System.Data.Common;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using TeamRoom.Data;

namespace TeamRoom.Services;

/// <summary>
/// The pictures and files the application keeps — avatars, chat backgrounds, attachments — and who may fetch each:
/// the framework serves them at <see cref="IUIContentAddressResolver"/> and asks here, with the session, before answering.
/// </summary>
/// <remarks>
/// The bytes stream in and out of the row through <see cref="SqliteBlob"/>: an upload is never held in memory whole, and neither is
/// a download, however many range requests a video's seeking makes.
/// </remarks>
public sealed class MediaService(AppDatabase database, AccountService accounts, ChatService chat, IUIContentAddressResolver content) : IUIContentProvider
{
    /// <summary>The largest single attachment; the framework's own upload limit is larger.</summary>
    public const long MaxAttachmentBytes = 25 * 1024 * 1024;

    /// <summary>How much one account may keep in attachments altogether.</summary>
    public const long MaxAttachmentBytesPerAccount = 512 * 1024 * 1024;

    /// <summary>The address a component names to show a stored item; a fresh id per upload, so the browser may keep it.</summary>
    public string AddressOf(string mediaId)
        => content.AddressOf(mediaId);

    // Raster types only: the type is what the browser declared, and an SVG is a document that can carry script, so anything
    // else is kept and handed out as a file rather than shown as a picture.
    private static readonly FrozenSet<string> RasterTypes = FrozenSet.Create(StringComparer.OrdinalIgnoreCase, "image/png", "image/jpeg", "image/gif", "image/webp", "image/avif", "image/bmp");

    public static bool IsImage(string? contentType)
    {
        if (contentType is null)
            return false;

        var parameters = contentType.IndexOf(';', StringComparison.Ordinal);

        return RasterTypes.Contains((parameters < 0 ? contentType : contentType[..parameters]).Trim());
    }

    /// <summary>
    /// Keeps <paramref name="size"/> bytes read from <paramref name="source"/>: the row is made with room for them, and they are
    /// copied straight into it.
    /// </summary>
    public async Task<string> StoreAsync(string ownerId, string purpose, string contentType, Stream source, long size, string? fileName = null, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(source);

        var id = AppDatabase.NewId();

        using SqliteConnection connection = database.Open();
        using DbTransaction transaction = await connection.BeginTransactionAsync(cancellationToken).ConfigureAwait(false);

        using (SqliteCommand command = connection.CreateCommand())
        {
            command.CommandText = """
                INSERT INTO media (id, owner_id, purpose, content_type, size, bytes, created_utc, file_name)
                VALUES ($id, $owner, $purpose, $type, $size, zeroblob($size), $created, $name);
                SELECT last_insert_rowid()
                """;
            _ = command.Parameters.AddWithValue("$id", id);
            _ = command.Parameters.AddWithValue("$owner", ownerId);
            _ = command.Parameters.AddWithValue("$purpose", purpose);
            _ = command.Parameters.AddWithValue("$type", string.IsNullOrWhiteSpace(contentType) ? "application/octet-stream" : contentType);
            _ = command.Parameters.AddWithValue("$size", size);
            _ = command.Parameters.AddWithValue("$created", AppDatabase.Now());
            _ = command.Parameters.AddWithValue("$name", (object?)fileName ?? DBNull.Value);

            var rowId = (long)(await command.ExecuteScalarAsync(cancellationToken).ConfigureAwait(false))!;

            SqliteBlob blob = new(connection, "media", "bytes", rowId);

            await using (blob.ConfigureAwait(false))
                await source.CopyToAsync(blob, cancellationToken).ConfigureAwait(false);
        }

        await transaction.CommitAsync(cancellationToken).ConfigureAwait(false);

        return id;
    }

    /// <summary>How many bytes an account keeps for one purpose — what a quota is checked against.</summary>
    public long UsedBy(string ownerId, string purpose)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT COALESCE(SUM(size), 0) FROM media WHERE owner_id = $owner AND purpose = $purpose";
        _ = command.Parameters.AddWithValue("$owner", ownerId);
        _ = command.Parameters.AddWithValue("$purpose", purpose);

        return (long)command.ExecuteScalar()!;
    }

    public void Delete(string mediaId)
    {
        using SqliteConnection connection = database.Open();

        using (SqliteCommand command = connection.CreateCommand())
        {
            command.CommandText = "DELETE FROM media WHERE id = $id";
            _ = command.Parameters.AddWithValue("$id", mediaId);
            _ = command.ExecuteNonQuery();
        }

        AppDatabase.ReclaimSpace(connection);
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
            Content = OpenContent(media.RowId),
            ContentType = media.ContentType,
            // A picture is shown where it is named; anything else is handed to the browser to save.
            FileName = IsImage(media.ContentType) ? null : AttachmentName(media.Id),
            Immutable = true
        });
    }

    private MediaRecord? Read(string mediaId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT id, rowid, owner_id, purpose, content_type, size, file_name FROM media WHERE id = $id";
        _ = command.Parameters.AddWithValue("$id", mediaId);

        using SqliteDataReader reader = command.ExecuteReader();

        return reader.Read()
            ? new MediaRecord(reader.GetString(0), reader.GetInt64(1), reader.GetString(2), reader.GetString(3), reader.GetString(4), reader.GetInt64(5), reader.IsDBNull(6) ? null : reader.GetString(6))
            : null;
    }

    /// <summary>
    /// The row's bytes as a seekable stream that owns its connection, so the response reads them in pieces and closing it lets go.
    /// </summary>
    /// <remarks>
    /// The open blob holds a read snapshot until the response ends: the WAL cannot be checkpointed past it meanwhile, which a
    /// download of a few seconds costs nothing and a stalled one only delays.
    /// </remarks>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "The connection and the blob belong to the returned stream, which the response disposes; a failure disposes them here.")]
    private MediaStream OpenContent(long rowId)
    {
        SqliteConnection connection = database.Open();

        try
        {
            return new MediaStream(connection, new SqliteBlob(connection, "media", "bytes", rowId, readOnly: true));
        }
        catch
        {
            connection.Dispose();
            throw;
        }
    }

    private string AttachmentName(string mediaId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT file_name FROM attachments WHERE media_id = $id";
        _ = command.Parameters.AddWithValue("$id", mediaId);

        return command.ExecuteScalar() as string ?? "file";
    }

    /// <summary>A read-only view of one blob that closes the connection it was opened on when it is disposed.</summary>
    private sealed class MediaStream(SqliteConnection connection, SqliteBlob blob) : Stream
    {
        public override bool CanRead => true;

        public override bool CanSeek => true;

        public override bool CanWrite => false;

        public override long Length => blob.Length;

        public override long Position
        {
            get => blob.Position;
            set => blob.Position = value;
        }

        public override int Read(byte[] buffer, int offset, int count)
            => blob.Read(buffer, offset, count);

        public override int Read(Span<byte> buffer)
            => blob.Read(buffer);

        public override long Seek(long offset, SeekOrigin origin)
            => blob.Seek(offset, origin);

        public override void Flush()
        {
        }

        public override void SetLength(long value)
            => throw new NotSupportedException();

        public override void Write(byte[] buffer, int offset, int count)
            => throw new NotSupportedException();

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                blob.Dispose();
                connection.Dispose();
            }

            base.Dispose(disposing);
        }
    }
}
