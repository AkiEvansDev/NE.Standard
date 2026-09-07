using System;
using System.Collections.Frozen;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Sessions;

namespace TeamRoom.Data;

/// <summary>
/// The framework's sessions kept in the application's own database, so a signed-in person stays signed in across the host's
/// restarts and the browser's; the framework's default holds them in memory and both are a sign-out.
/// </summary>
public sealed class SqliteSessionStore(AppDatabase database) : IUserSessionStore
{
    private const string Columns = "id, language, theme, is_authenticated, user_id, roles, permissions, pending_rotation, created_utc, last_seen_utc";

    public async ValueTask<UserSessionState?> TryGetAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = $"SELECT {Columns} FROM sessions WHERE id = $id";
        _ = command.Parameters.AddWithValue("$id", sessionId);

        using SqliteDataReader reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);

        return await reader.ReadAsync(cancellationToken).ConfigureAwait(false) ? Read(reader) : null;
    }

    private static UserSessionState Read(SqliteDataReader reader)
        => new()
        {
            SessionId = reader.GetString(0),
            Language = reader.GetString(1),
            ThemeMode = reader.IsDBNull(2) ? null : Enum.Parse<UIThemeMode>(reader.GetString(2)),
            IsAuthenticated = reader.GetInt64(3) != 0,
            UserId = reader.IsDBNull(4) ? null : reader.GetString(4),
            Roles = Split(reader.GetString(5)),
            Permissions = Split(reader.GetString(6)),
            PendingIdRotation = reader.GetInt64(7) != 0,
            CreatedAtUtc = DateTime.Parse(reader.GetString(8), CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind),
            LastSeenAtUtc = DateTime.Parse(reader.GetString(9), CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind)
        };

    private static FrozenSet<string> Split(string joined)
        => joined.Length == 0 ? [] : joined.Split(',').ToFrozenSet(StringComparer.Ordinal);

    public async ValueTask SaveAsync(UserSessionState session, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(session);

        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = $"""
            INSERT INTO sessions ({Columns})
            VALUES ($id, $language, $theme, $authenticated, $user, $roles, $permissions, $rotation, $created, $seen)
            ON CONFLICT (id) DO UPDATE SET language = $language, theme = $theme, is_authenticated = $authenticated, user_id = $user,
                roles = $roles, permissions = $permissions, pending_rotation = $rotation, created_utc = $created, last_seen_utc = $seen
            """;
        _ = command.Parameters.AddWithValue("$id", session.SessionId);
        _ = command.Parameters.AddWithValue("$language", session.Language);
        _ = command.Parameters.AddWithValue("$theme", session.ThemeMode is { } theme ? theme.ToString() : DBNull.Value);
        _ = command.Parameters.AddWithValue("$authenticated", session.IsAuthenticated ? 1 : 0);
        _ = command.Parameters.AddWithValue("$user", (object?)session.UserId ?? DBNull.Value);
        _ = command.Parameters.AddWithValue("$roles", string.Join(',', session.Roles));
        _ = command.Parameters.AddWithValue("$permissions", string.Join(',', session.Permissions));
        _ = command.Parameters.AddWithValue("$rotation", session.PendingIdRotation ? 1 : 0);
        _ = command.Parameters.AddWithValue("$created", session.CreatedAtUtc.ToString("O", CultureInfo.InvariantCulture));
        _ = command.Parameters.AddWithValue("$seen", session.LastSeenAtUtc.ToString("O", CultureInfo.InvariantCulture));
        _ = await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
    }

    public async ValueTask RemoveAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "DELETE FROM sessions WHERE id = $id";
        _ = command.Parameters.AddWithValue("$id", sessionId);
        _ = await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Drops every session idle past the timeout; the dates sort as text because they are written round-trip.</summary>
    public async ValueTask<int> CleanupAsync(DateTime utcNow, TimeSpan idleTimeout, CancellationToken cancellationToken = default)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "DELETE FROM sessions WHERE last_seen_utc < $limit";
        _ = command.Parameters.AddWithValue("$limit", (utcNow - idleTimeout).ToString("O", CultureInfo.InvariantCulture));

        return await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
    }
}
