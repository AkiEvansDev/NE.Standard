using System;
using System.IO;
using Microsoft.Data.Sqlite;

namespace TeamRoom.Data;

/// <summary>
/// One SQLite file under the application's data directory, created with its schema the first time the application starts.
/// </summary>
/// <remarks>
/// The services call the driver synchronously on purpose: Microsoft.Data.Sqlite's async methods run synchronously anyway, and
/// every query here is a few rows out of a local file. The file keeps pictures and attachments, so it is set up to give disk
/// back: incremental auto-vacuum, which <see cref="ReclaimSpace"/> runs after media is deleted, and a WAL cut back after each
/// checkpoint rather than left at the size of the largest upload.
/// </remarks>
public sealed class AppDatabase
{
    private readonly string _connectionString;

    public AppDatabase(string dataDirectory)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(dataDirectory);

        _ = Directory.CreateDirectory(dataDirectory);

        _connectionString = new SqliteConnectionStringBuilder { DataSource = Path.Combine(dataDirectory, "teamroom.db") }.ToString();
    }

    /// <summary>The WAL is cut back to 16 MB after a checkpoint; SQLite otherwise keeps it at its largest, a whole upload's size.</summary>
    private const string JournalSizeLimit = "PRAGMA journal_size_limit = 16777216";

    public SqliteConnection Open()
    {
        SqliteConnection connection = new(_connectionString);
        connection.Open();

        // A per-connection setting, and a pooled connection may be a fresh one: set on every open, one statement with no I/O.
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = JournalSizeLimit;
        _ = command.ExecuteNonQuery();

        return connection;
    }

    /// <summary>Creates every table that is missing; an existing file is left as it is.</summary>
    public void EnsureCreated()
    {
        using SqliteConnection connection = Open();

        EnsureIncrementalVacuum(connection);

        using SqliteCommand command = connection.CreateCommand();

        command.CommandText = """
            PRAGMA journal_mode = WAL;

            CREATE TABLE IF NOT EXISTS accounts (
                id TEXT PRIMARY KEY,
                login TEXT NOT NULL UNIQUE COLLATE NOCASE,
                nickname TEXT NOT NULL,
                role TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                password_salt TEXT NOT NULL,
                is_blocked INTEGER NOT NULL DEFAULT 0,
                avatar_media_id TEXT NULL,
                background_media_id TEXT NULL,
                background_fit TEXT NULL,
                created_utc TEXT NOT NULL,
                theme_colors TEXT NULL
            );

            CREATE TABLE IF NOT EXISTS nodes (
                id TEXT PRIMARY KEY,
                parent_id TEXT NULL,
                kind TEXT NOT NULL,
                name TEXT NOT NULL,
                content TEXT NULL,
                updated_utc TEXT NOT NULL,
                updated_by TEXT NULL
            );

            CREATE TABLE IF NOT EXISTS conversations (
                id TEXT PRIMARY KEY,
                kind TEXT NOT NULL,
                title TEXT NULL,
                created_utc TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS conversation_members (
                conversation_id TEXT NOT NULL,
                account_id TEXT NOT NULL,
                last_read_message_id INTEGER NOT NULL DEFAULT 0,
                PRIMARY KEY (conversation_id, account_id)
            );

            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id TEXT NOT NULL,
                author_id TEXT NOT NULL,
                text TEXT NOT NULL,
                sent_utc TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS messages_by_conversation ON messages (conversation_id, id);

            CREATE TABLE IF NOT EXISTS attachments (
                id TEXT PRIMARY KEY,
                message_id INTEGER NOT NULL,
                media_id TEXT NOT NULL,
                file_name TEXT NOT NULL,
                content_type TEXT NOT NULL,
                size INTEGER NOT NULL,
                is_image INTEGER NOT NULL
            );

            CREATE INDEX IF NOT EXISTS attachments_by_message ON attachments (message_id);

            CREATE INDEX IF NOT EXISTS attachments_by_media ON attachments (media_id);

            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                language TEXT NOT NULL,
                theme TEXT NULL,
                is_authenticated INTEGER NOT NULL,
                user_id TEXT NULL,
                roles TEXT NOT NULL,
                permissions TEXT NOT NULL,
                pending_rotation INTEGER NOT NULL,
                created_utc TEXT NOT NULL,
                last_seen_utc TEXT NOT NULL,
                is_unclaimed INTEGER NOT NULL DEFAULT 0,
                time_zone TEXT NULL,
                theme_colors TEXT NULL
            );

            CREATE INDEX IF NOT EXISTS sessions_by_user ON sessions (user_id);

            CREATE TABLE IF NOT EXISTS media (
                id TEXT PRIMARY KEY,
                owner_id TEXT NOT NULL,
                purpose TEXT NOT NULL,
                content_type TEXT NOT NULL,
                size INTEGER NOT NULL,
                bytes BLOB NOT NULL,
                created_utc TEXT NOT NULL,
                file_name TEXT NULL
            );

            CREATE INDEX IF NOT EXISTS media_by_owner ON media (owner_id, purpose);
            """;

        _ = command.ExecuteNonQuery();

        AddColumnIfMissing(connection, "media", "file_name TEXT NULL");
        AddColumnIfMissing(connection, "messages", "edited_utc TEXT NULL");
        AddColumnIfMissing(connection, "sessions", "is_unclaimed INTEGER NOT NULL DEFAULT 0");
        AddColumnIfMissing(connection, "sessions", "time_zone TEXT NULL");
        AddColumnIfMissing(connection, "sessions", "theme_colors TEXT NULL");
        AddColumnIfMissing(connection, "accounts", "theme_colors TEXT NULL");
    }

    /// <summary>
    /// Turns incremental auto-vacuum on. A new file takes it before its first table; an older one needs the one <c>VACUUM</c>
    /// that rewrites it, run here once.
    /// </summary>
    private static void EnsureIncrementalVacuum(SqliteConnection connection)
    {
        using SqliteCommand read = connection.CreateCommand();
        read.CommandText = "PRAGMA auto_vacuum";

        // 2 is INCREMENTAL.
        if (read.ExecuteScalar() is long mode && mode == 2)
            return;

        using SqliteCommand set = connection.CreateCommand();
        set.CommandText = "PRAGMA auto_vacuum = INCREMENTAL; VACUUM;";
        _ = set.ExecuteNonQuery();
    }

    /// <summary>Gives the pages freed by deleted media back to the disk; without it the file stays at its largest.</summary>
    public static void ReclaimSpace(SqliteConnection connection)
    {
        ArgumentNullException.ThrowIfNull(connection);

        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "PRAGMA incremental_vacuum";
        _ = command.ExecuteNonQuery();
    }

    /// <summary>A column added after the table first shipped; a file created before it is brought along.</summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Security", "CA2100:Review SQL queries for security vulnerabilities", Justification = "Both parts are literals from the schema above.")]
    private static void AddColumnIfMissing(SqliteConnection connection, string table, string definition)
    {
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = $"ALTER TABLE {table} ADD COLUMN {definition}";

        try
        {
            _ = command.ExecuteNonQuery();
        }
        catch (SqliteException error) when (error.Message.Contains("duplicate column", StringComparison.OrdinalIgnoreCase))
        {
            // Already there: the table was created with it.
        }
    }

    /// <summary>A fresh key: one shape for every table, never guessable.</summary>
    public static string NewId()
        => Guid.NewGuid().ToString("N");

    /// <summary>UTC in the one form SQLite sorts and the pages read back.</summary>
    public static string Now()
        => DateTime.UtcNow.ToString("O", System.Globalization.CultureInfo.InvariantCulture);
}
