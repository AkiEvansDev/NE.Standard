using System;
using System.Collections.Generic;
using System.Globalization;
using Microsoft.Data.Sqlite;
using TeamRoom.Data;

namespace TeamRoom.Services;

/// <summary>
/// Rooms everyone is in, direct conversations between two people, and the messages in them.
/// </summary>
public sealed class ChatService(AppDatabase database, AccountService accounts, AppEvents events)
{
    public const string GeneralRoomId = "general";

    /// <summary>The one room that always exists.</summary>
    public void Seed()
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "INSERT OR IGNORE INTO conversations (id, kind, title, created_utc) VALUES ($id, $kind, $title, $created)";
        _ = command.Parameters.AddWithValue("$id", GeneralRoomId);
        _ = command.Parameters.AddWithValue("$kind", ConversationKinds.Room);
        _ = command.Parameters.AddWithValue("$title", "General");
        _ = command.Parameters.AddWithValue("$created", AppDatabase.Now());
        _ = command.ExecuteNonQuery();
    }

    /// <summary>
    /// What one account sees in its list: every room, and the direct conversations it is part of, each with its unread count.
    /// A room is everyone's, so membership there is created on first sight and only holds where the reader got to.
    /// </summary>
    public IReadOnlyList<ConversationRecord> ListFor(string accountId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = """
            SELECT c.id, c.kind, c.title,
                   COALESCE(m.last_read_message_id, 0),
                   (SELECT COUNT(*) FROM messages x WHERE x.conversation_id = c.id AND x.id > COALESCE(m.last_read_message_id, 0) AND x.author_id <> $me),
                   (SELECT MAX(x.id) FROM messages x WHERE x.conversation_id = c.id)
            FROM conversations c
            LEFT JOIN conversation_members m ON m.conversation_id = c.id AND m.account_id = $me
            WHERE c.kind = $room OR m.account_id IS NOT NULL
            ORDER BY c.kind DESC, COALESCE((SELECT MAX(x.id) FROM messages x WHERE x.conversation_id = c.id), 0) DESC, c.created_utc
            """;
        _ = command.Parameters.AddWithValue("$me", accountId);
        _ = command.Parameters.AddWithValue("$room", ConversationKinds.Room);

        List<(string Id, string Kind, string? Title, long LastRead, int Unread)> rows = [];

        using (SqliteDataReader reader = command.ExecuteReader())
        {
            while (reader.Read())
                rows.Add((reader.GetString(0), reader.GetString(1), reader.IsDBNull(2) ? null : reader.GetString(2), reader.GetInt64(3), (int)reader.GetInt64(4)));
        }

        List<ConversationRecord> result = [];

        foreach ((var id, var kind, var title, var lastRead, var unread) in rows)
        {
            List<string> members = Members(connection, id);

            result.Add(new ConversationRecord(id, kind, kind == ConversationKinds.Room ? title ?? id : DirectTitle(members, accountId), members, lastRead, unread));
        }

        return result;
    }

    private static List<string> Members(SqliteConnection connection, string conversationId)
    {
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT account_id FROM conversation_members WHERE conversation_id = $id";
        _ = command.Parameters.AddWithValue("$id", conversationId);

        using SqliteDataReader reader = command.ExecuteReader();
        List<string> members = [];

        while (reader.Read())
            members.Add(reader.GetString(0));

        return members;
    }

    /// <summary>A direct conversation is named after the other person; one with only yourself in it is a note to self.</summary>
    private string DirectTitle(List<string> members, string accountId)
    {
        foreach (var member in members)
        {
            if (member != accountId)
                return accounts.Find(member)?.Nickname ?? "(deleted account)";
        }

        return "Notes to self";
    }

    public ConversationRecord? Find(string conversationId, string accountId)
    {
        foreach (ConversationRecord conversation in ListFor(accountId))
        {
            if (conversation.Id == conversationId)
                return conversation;
        }

        return null;
    }

    /// <summary>Whether an account may read a conversation: every room is open, a direct one only to its two people.</summary>
    public bool IsMember(string conversationId, string accountId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = """
            SELECT 1 FROM conversations c
            WHERE c.id = $id AND (c.kind = $room OR EXISTS (SELECT 1 FROM conversation_members m WHERE m.conversation_id = c.id AND m.account_id = $me))
            """;
        _ = command.Parameters.AddWithValue("$id", conversationId);
        _ = command.Parameters.AddWithValue("$room", ConversationKinds.Room);
        _ = command.Parameters.AddWithValue("$me", accountId);

        return command.ExecuteScalar() is not null;
    }

    public string? CreateRoom(string title, out string id)
    {
        id = string.Empty;
        title = title.Trim();

        if (title.Length is 0 or > 64)
            return "A room's name is 1 to 64 characters.";

        id = AppDatabase.NewId();

        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "INSERT INTO conversations (id, kind, title, created_utc) VALUES ($id, $kind, $title, $created)";
        _ = command.Parameters.AddWithValue("$id", id);
        _ = command.Parameters.AddWithValue("$kind", ConversationKinds.Room);
        _ = command.Parameters.AddWithValue("$title", title);
        _ = command.Parameters.AddWithValue("$created", AppDatabase.Now());
        _ = command.ExecuteNonQuery();

        events.Publish(new ConversationsChanged(null));

        return null;
    }

    /// <summary>The direct conversation between two accounts, made on first use.</summary>
    public string GetOrCreateDirect(string accountId, string otherId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand find = connection.CreateCommand();
        find.CommandText = """
            SELECT c.id FROM conversations c
            WHERE c.kind = $direct
              AND EXISTS (SELECT 1 FROM conversation_members a WHERE a.conversation_id = c.id AND a.account_id = $me)
              AND EXISTS (SELECT 1 FROM conversation_members b WHERE b.conversation_id = c.id AND b.account_id = $other)
              AND (SELECT COUNT(*) FROM conversation_members m WHERE m.conversation_id = c.id) = $count
            """;
        _ = find.Parameters.AddWithValue("$direct", ConversationKinds.Direct);
        _ = find.Parameters.AddWithValue("$me", accountId);
        _ = find.Parameters.AddWithValue("$other", otherId);
        _ = find.Parameters.AddWithValue("$count", accountId == otherId ? 1 : 2);

        if (find.ExecuteScalar() is string existing)
            return existing;

        var id = AppDatabase.NewId();

        using SqliteCommand insert = connection.CreateCommand();
        insert.CommandText = "INSERT INTO conversations (id, kind, title, created_utc) VALUES ($id, $kind, NULL, $created)";
        _ = insert.Parameters.AddWithValue("$id", id);
        _ = insert.Parameters.AddWithValue("$kind", ConversationKinds.Direct);
        _ = insert.Parameters.AddWithValue("$created", AppDatabase.Now());
        _ = insert.ExecuteNonQuery();

        AddMember(connection, id, accountId);

        if (otherId != accountId)
            AddMember(connection, id, otherId);

        events.Publish(new ConversationsChanged(accountId));
        events.Publish(new ConversationsChanged(otherId));

        return id;
    }

    private static void AddMember(SqliteConnection connection, string conversationId, string accountId)
    {
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "INSERT OR IGNORE INTO conversation_members (conversation_id, account_id, last_read_message_id) VALUES ($id, $account, 0)";
        _ = command.Parameters.AddWithValue("$id", conversationId);
        _ = command.Parameters.AddWithValue("$account", accountId);
        _ = command.ExecuteNonQuery();
    }

    /// <summary>How many messages there are, and a page of them read backwards from an id — the shape a windowed feed asks for.</summary>
    public long Count(string conversationId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT COUNT(*) FROM messages WHERE conversation_id = $id";
        _ = command.Parameters.AddWithValue("$id", conversationId);

        return (long)command.ExecuteScalar()!;
    }

    /// <summary>Messages by position in the conversation, oldest first: the <paramref name="count"/> from <paramref name="offset"/>.</summary>
    public IReadOnlyList<MessageRecord> Page(string conversationId, int offset, int count)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = $"{MessageColumns} WHERE conversation_id = $id ORDER BY id LIMIT $count OFFSET $offset";
        _ = command.Parameters.AddWithValue("$id", conversationId);
        _ = command.Parameters.AddWithValue("$count", count);
        _ = command.Parameters.AddWithValue("$offset", offset);

        return ReadMessages(connection, command);
    }

    /// <summary>The zero-based position of a message in its conversation, for a jump from a search hit.</summary>
    public int IndexOf(string conversationId, long messageId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT COUNT(*) FROM messages WHERE conversation_id = $id AND id < $message";
        _ = command.Parameters.AddWithValue("$id", conversationId);
        _ = command.Parameters.AddWithValue("$message", messageId);

        return (int)(long)command.ExecuteScalar()!;
    }

    public MessageRecord? FindMessage(long messageId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = $"{MessageColumns} WHERE id = $id";
        _ = command.Parameters.AddWithValue("$id", messageId);

        List<MessageRecord> messages = ReadMessages(connection, command);

        return messages.Count == 0 ? null : messages[0];
    }

    private const string MessageColumns = "SELECT id, conversation_id, author_id, text, sent_utc, edited_utc FROM messages";

    private static List<MessageRecord> ReadMessages(SqliteConnection connection, SqliteCommand command)
    {
        List<(long Id, string Conversation, string Author, string Text, DateTime Sent, DateTime? Edited)> rows = [];

        using (SqliteDataReader reader = command.ExecuteReader())
        {
            while (reader.Read())
            {
                rows.Add((reader.GetInt64(0), reader.GetString(1), reader.GetString(2), reader.GetString(3),
                    DateTime.Parse(reader.GetString(4), CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind),
                    reader.IsDBNull(5) ? null : DateTime.Parse(reader.GetString(5), CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind)));
            }
        }

        List<MessageRecord> messages = new(rows.Count);

        foreach ((var id, var conversation, var author, var text, DateTime sent, DateTime? edited) in rows)
            messages.Add(new MessageRecord(id, conversation, author, text, sent, edited, Attachments(connection, id)));

        return messages;
    }

    /// <summary>The author's own change of wording; anyone else is refused. The attachments stay as they were sent.</summary>
    public string? Edit(long messageId, string accountId, string text, object? origin = null)
    {
        text = text.Trim();

        if (text.Length == 0)
            return "A message needs some words.";

        MessageRecord? message = FindMessage(messageId);

        if (message is null || message.AuthorId != accountId)
            return "Not your message to change.";

        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "UPDATE messages SET text = $text, edited_utc = $edited WHERE id = $id";
        _ = command.Parameters.AddWithValue("$text", text);
        _ = command.Parameters.AddWithValue("$edited", AppDatabase.Now());
        _ = command.Parameters.AddWithValue("$id", messageId);
        _ = command.ExecuteNonQuery();

        events.Publish(new MessageChanged(message.ConversationId, messageId, origin));

        return null;
    }

    /// <summary>The author takes a message back: its attachments' media go with it.</summary>
    public string? Delete(long messageId, string accountId, object? origin = null)
    {
        MessageRecord? message = FindMessage(messageId);

        if (message is null || message.AuthorId != accountId)
            return "Not your message to delete.";

        using SqliteConnection connection = database.Open();
        using SqliteTransaction transaction = connection.BeginTransaction();

        using SqliteCommand command = connection.CreateCommand();
        command.Transaction = transaction;
        command.CommandText =
            "DELETE FROM media WHERE id IN (SELECT media_id FROM attachments WHERE message_id = $id); " +
            "DELETE FROM attachments WHERE message_id = $id; DELETE FROM messages WHERE id = $id";
        _ = command.Parameters.AddWithValue("$id", messageId);
        _ = command.ExecuteNonQuery();

        transaction.Commit();

        events.Publish(new MessageDeleted(message.ConversationId, messageId, origin));

        return null;
    }

    private static List<AttachmentRecord> Attachments(SqliteConnection connection, long messageId)
    {
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT id, message_id, media_id, file_name, content_type, size, is_image FROM attachments WHERE message_id = $id ORDER BY rowid";
        _ = command.Parameters.AddWithValue("$id", messageId);

        using SqliteDataReader reader = command.ExecuteReader();
        List<AttachmentRecord> attachments = [];

        while (reader.Read())
            attachments.Add(new AttachmentRecord(reader.GetString(0), reader.GetInt64(1), reader.GetString(2), reader.GetString(3), reader.GetString(4), reader.GetInt64(5), reader.GetInt64(6) != 0));

        return attachments;
    }

    /// <summary>Posts a message with what was attached to it and tells every open page.</summary>
    public MessageRecord Send(string conversationId, string authorId, string text, IReadOnlyList<(string MediaId, string FileName, string ContentType, long Size)> attachments, object? origin = null)
    {
        using SqliteConnection connection = database.Open();
        using SqliteTransaction transaction = connection.BeginTransaction();

        using SqliteCommand insert = connection.CreateCommand();
        insert.Transaction = transaction;
        insert.CommandText = "INSERT INTO messages (conversation_id, author_id, text, sent_utc) VALUES ($conversation, $author, $text, $sent); SELECT last_insert_rowid()";
        _ = insert.Parameters.AddWithValue("$conversation", conversationId);
        _ = insert.Parameters.AddWithValue("$author", authorId);
        _ = insert.Parameters.AddWithValue("$text", text);
        _ = insert.Parameters.AddWithValue("$sent", AppDatabase.Now());

        var messageId = (long)insert.ExecuteScalar()!;

        foreach ((var mediaId, var fileName, var contentType, var size) in attachments)
        {
            using SqliteCommand attach = connection.CreateCommand();
            attach.Transaction = transaction;
            attach.CommandText = "INSERT INTO attachments (id, message_id, media_id, file_name, content_type, size, is_image) VALUES ($id, $message, $media, $name, $type, $size, $image)";
            _ = attach.Parameters.AddWithValue("$id", AppDatabase.NewId());
            _ = attach.Parameters.AddWithValue("$message", messageId);
            _ = attach.Parameters.AddWithValue("$media", mediaId);
            _ = attach.Parameters.AddWithValue("$name", fileName);
            _ = attach.Parameters.AddWithValue("$type", contentType);
            _ = attach.Parameters.AddWithValue("$size", size);
            _ = attach.Parameters.AddWithValue("$image", MediaService.IsImage(contentType) ? 1 : 0);
            _ = attach.ExecuteNonQuery();
        }

        // The author has read their own message; a room the author never opened gets its membership row here.
        using SqliteCommand read = connection.CreateCommand();
        read.Transaction = transaction;
        read.CommandText = """
            INSERT INTO conversation_members (conversation_id, account_id, last_read_message_id) VALUES ($conversation, $author, $message)
            ON CONFLICT (conversation_id, account_id) DO UPDATE SET last_read_message_id = MAX(last_read_message_id, $message)
            """;
        _ = read.Parameters.AddWithValue("$conversation", conversationId);
        _ = read.Parameters.AddWithValue("$author", authorId);
        _ = read.Parameters.AddWithValue("$message", messageId);
        _ = read.ExecuteNonQuery();

        transaction.Commit();

        MessageRecord message = FindMessage(messageId)!;

        events.Publish(new MessagePosted(conversationId, messageId, authorId, origin));

        return message;
    }

    /// <summary>The reader got this far; the unread count on their list moves with it.</summary>
    public void MarkRead(string conversationId, string accountId, long messageId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO conversation_members (conversation_id, account_id, last_read_message_id) VALUES ($conversation, $account, $message)
            ON CONFLICT (conversation_id, account_id) DO UPDATE SET last_read_message_id = MAX(last_read_message_id, $message)
            """;
        _ = command.Parameters.AddWithValue("$conversation", conversationId);
        _ = command.Parameters.AddWithValue("$account", accountId);
        _ = command.Parameters.AddWithValue("$message", messageId);
        _ = command.ExecuteNonQuery();
    }

    /// <summary>Every unread message across the account's conversations: the sidebar's number.</summary>
    public int CountUnread(string accountId)
    {
        var total = 0;

        foreach (ConversationRecord conversation in ListFor(accountId))
            total += conversation.Unread;

        return total;
    }

    /// <summary>Messages whose text carries the words, newest first — in one conversation, or in every one the account may read.</summary>
    public IReadOnlyList<MessageSearchHit> Search(string accountId, string query, string? conversationId, int limit = 50)
    {
        query = query.Trim();

        if (query.Length == 0)
            return [];

        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = """
            SELECT x.id, x.conversation_id, c.kind, c.title, x.author_id, x.text, x.sent_utc
            FROM messages x
            JOIN conversations c ON c.id = x.conversation_id
            WHERE ($conversation IS NULL OR x.conversation_id = $conversation)
              AND (c.kind = $room OR EXISTS (SELECT 1 FROM conversation_members m WHERE m.conversation_id = c.id AND m.account_id = $me))
              AND x.text LIKE $pattern ESCAPE '\'
            ORDER BY x.id DESC
            LIMIT $limit
            """;
        _ = command.Parameters.AddWithValue("$conversation", (object?)conversationId ?? DBNull.Value);
        _ = command.Parameters.AddWithValue("$room", ConversationKinds.Room);
        _ = command.Parameters.AddWithValue("$me", accountId);
        _ = command.Parameters.AddWithValue("$pattern", "%" + query.Replace("\\", "\\\\", StringComparison.Ordinal).Replace("%", "\\%", StringComparison.Ordinal).Replace("_", "\\_", StringComparison.Ordinal) + "%");
        _ = command.Parameters.AddWithValue("$limit", limit);

        List<(long Id, string Conversation, string Kind, string? Title, string Author, string Text, DateTime Sent)> rows = [];

        using (SqliteDataReader reader = command.ExecuteReader())
        {
            while (reader.Read())
            {
                rows.Add((reader.GetInt64(0), reader.GetString(1), reader.GetString(2), reader.IsDBNull(3) ? null : reader.GetString(3), reader.GetString(4), reader.GetString(5),
                    DateTime.Parse(reader.GetString(6), CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind)));
            }
        }

        List<MessageSearchHit> hits = new(rows.Count);

        foreach ((var id, var conversation, var kind, var title, var author, var text, DateTime sent) in rows)
        {
            var name = kind == ConversationKinds.Room ? title ?? conversation : DirectTitle(Members(connection, conversation), accountId);

            hits.Add(new MessageSearchHit(id, conversation, name, author, text, sent));
        }

        return hits;
    }

    /// <summary>The conversation an attachment belongs to, to decide who may open it.</summary>
    public string? ConversationOfAttachment(string mediaId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT m.conversation_id FROM attachments a JOIN messages m ON m.id = a.message_id WHERE a.media_id = $media";
        _ = command.Parameters.AddWithValue("$media", mediaId);

        return command.ExecuteScalar() as string;
    }
}
