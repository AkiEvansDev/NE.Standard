using System;
using System.Collections.Generic;
using System.Globalization;
using Microsoft.Data.Sqlite;
using TeamRoom.Data;

namespace TeamRoom.Services;

/// <summary>
/// The folder tree of text files the administrators write and everyone reads.
/// </summary>
public sealed class DocumentService(AppDatabase database, AppEvents events)
{
    /// <summary>Every node in walking order — a folder before what is under it, folders before files, names in order — which is the shape a tree is bound to.</summary>
    public IReadOnlyList<NodeRecord> ListInWalkingOrder()
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT id, parent_id, kind, name, updated_utc, updated_by FROM nodes ORDER BY kind, name COLLATE NOCASE";

        Dictionary<string, List<NodeRecord>> byParent = new(StringComparer.Ordinal);

        using (SqliteDataReader reader = command.ExecuteReader())
        {
            while (reader.Read())
            {
                NodeRecord node = new(
                    reader.GetString(0),
                    reader.IsDBNull(1) ? null : reader.GetString(1),
                    reader.GetString(2),
                    reader.GetString(3),
                    DateTime.Parse(reader.GetString(4), CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind),
                    reader.IsDBNull(5) ? null : reader.GetString(5)
                );

                var parent = node.ParentId ?? string.Empty;

                if (!byParent.TryGetValue(parent, out List<NodeRecord>? siblings))
                    byParent[parent] = siblings = [];

                siblings.Add(node);
            }
        }

        List<NodeRecord> result = [];
        Walk(byParent, string.Empty, result);

        return result;
    }

    private static void Walk(Dictionary<string, List<NodeRecord>> byParent, string parentId, List<NodeRecord> result)
    {
        if (!byParent.TryGetValue(parentId, out List<NodeRecord>? children))
            return;

        foreach (NodeRecord child in children)
        {
            result.Add(child);
            Walk(byParent, child.Id, result);
        }
    }

    public string? Create(string? parentId, string kind, string name, string authorId, out string id)
    {
        id = string.Empty;
        name = name.Trim();

        if (name.Length is 0 or > 120)
            return "A name is 1 to 120 characters.";

        using SqliteConnection connection = database.Open();

        if (parentId is not null && FindKind(connection, parentId) != NodeKinds.Folder)
            return "A node goes into a folder.";

        id = AppDatabase.NewId();

        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO nodes (id, parent_id, kind, name, content, updated_utc, updated_by)
            VALUES ($id, $parent, $kind, $name, $content, $updated, $author)
            """;
        _ = command.Parameters.AddWithValue("$id", id);
        _ = command.Parameters.AddWithValue("$parent", (object?)parentId ?? DBNull.Value);
        _ = command.Parameters.AddWithValue("$kind", kind);
        _ = command.Parameters.AddWithValue("$name", name);
        _ = command.Parameters.AddWithValue("$content", kind == NodeKinds.File ? string.Empty : DBNull.Value);
        _ = command.Parameters.AddWithValue("$updated", AppDatabase.Now());
        _ = command.Parameters.AddWithValue("$author", authorId);
        _ = command.ExecuteNonQuery();

        events.Publish(new DocumentsChanged(null));

        return null;
    }

    private static string? FindKind(SqliteConnection connection, string id)
    {
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT kind FROM nodes WHERE id = $id";
        _ = command.Parameters.AddWithValue("$id", id);

        return command.ExecuteScalar() as string;
    }

    public string? Rename(string id, string name)
    {
        name = name.Trim();

        if (name.Length is 0 or > 120)
            return "A name is 1 to 120 characters.";

        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "UPDATE nodes SET name = $name WHERE id = $id";
        _ = command.Parameters.AddWithValue("$name", name);
        _ = command.Parameters.AddWithValue("$id", id);
        _ = command.ExecuteNonQuery();

        events.Publish(new DocumentsChanged(id));

        return null;
    }

    /// <summary>Moves a node under a folder, or to the root; a folder never goes under itself.</summary>
    public string? Move(string id, string? parentId)
    {
        using SqliteConnection connection = database.Open();

        if (parentId is not null)
        {
            if (FindKind(connection, parentId) != NodeKinds.Folder)
                return "A node goes into a folder.";

            for (var cursor = parentId; cursor is not null; cursor = FindParent(connection, cursor))
            {
                if (cursor == id)
                    return "A folder cannot go inside itself.";
            }
        }

        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "UPDATE nodes SET parent_id = $parent WHERE id = $id";
        _ = command.Parameters.AddWithValue("$parent", (object?)parentId ?? DBNull.Value);
        _ = command.Parameters.AddWithValue("$id", id);
        _ = command.ExecuteNonQuery();

        events.Publish(new DocumentsChanged(null));

        return null;
    }

    private static string? FindParent(SqliteConnection connection, string id)
    {
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT parent_id FROM nodes WHERE id = $id";
        _ = command.Parameters.AddWithValue("$id", id);

        return command.ExecuteScalar() as string;
    }

    /// <summary>A node and everything under it.</summary>
    public void Delete(string id)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = """
            WITH RECURSIVE subtree(id) AS (
                SELECT $id
                UNION ALL
                SELECT nodes.id FROM nodes JOIN subtree ON nodes.parent_id = subtree.id
            )
            DELETE FROM nodes WHERE id IN (SELECT id FROM subtree)
            """;
        _ = command.Parameters.AddWithValue("$id", id);
        _ = command.ExecuteNonQuery();

        events.Publish(new DocumentsChanged(null));
    }

    /// <summary>The file's text, or <see langword="null"/> when there is no such file.</summary>
    public string? ReadContent(string id)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT content FROM nodes WHERE id = $id AND kind = $file";
        _ = command.Parameters.AddWithValue("$id", id);
        _ = command.Parameters.AddWithValue("$file", NodeKinds.File);

        return command.ExecuteScalar() as string;
    }

    /// <summary>Writes the file's text; <see langword="false"/> when there is no such file any more, so a save is never claimed for one.</summary>
    public bool SaveContent(string id, string content, string authorId)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "UPDATE nodes SET content = $content, updated_utc = $updated, updated_by = $author WHERE id = $id AND kind = $file";
        _ = command.Parameters.AddWithValue("$content", content);
        _ = command.Parameters.AddWithValue("$updated", AppDatabase.Now());
        _ = command.Parameters.AddWithValue("$author", authorId);
        _ = command.Parameters.AddWithValue("$id", id);
        _ = command.Parameters.AddWithValue("$file", NodeKinds.File);

        if (command.ExecuteNonQuery() == 0)
            return false;

        events.Publish(new DocumentsChanged(id));

        return true;
    }
}
