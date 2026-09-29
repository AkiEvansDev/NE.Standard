using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Data.Common;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;

namespace TeamRoom.Data;

/// <summary>
/// The framework's sessions kept in the application's own database, so a signed-in person stays signed in across the host's
/// restarts and the browser's; the framework's default holds them in memory and both are a sign-out.
/// </summary>
public sealed class SqliteSessionStore(AppDatabase database) : IUserSessionStore
{
    private const string Columns = "id, language, theme, is_authenticated, user_id, roles, permissions, pending_rotation, created_utc, last_seen_utc, is_unclaimed";

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
            LastSeenAtUtc = DateTime.Parse(reader.GetString(9), CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind),
            IsUnclaimed = reader.GetInt64(10) != 0
        };

    private static FrozenSet<string> Split(string joined)
        => joined.Length == 0 ? [] : joined.Split(',').ToFrozenSet(StringComparer.Ordinal);

    public async ValueTask SaveAsync(UserSessionState session, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(session);

        using SqliteConnection connection = database.Open();

        await WriteAsync(connection, session, cancellationToken).ConfigureAwait(false);
    }

    private static async Task WriteAsync(SqliteConnection connection, UserSessionState session, CancellationToken cancellationToken)
    {
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = $"""
            INSERT INTO sessions ({Columns})
            VALUES ($id, $language, $theme, $authenticated, $user, $roles, $permissions, $rotation, $created, $seen, $unclaimed)
            ON CONFLICT (id) DO UPDATE SET language = $language, theme = $theme, is_authenticated = $authenticated, user_id = $user,
                roles = $roles, permissions = $permissions, pending_rotation = $rotation, created_utc = $created, last_seen_utc = $seen,
                is_unclaimed = $unclaimed
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
        _ = command.Parameters.AddWithValue("$unclaimed", session.IsUnclaimed ? 1 : 0);
        _ = await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Reads, applies and writes in one immediate transaction, so a session removed or changed meanwhile is not written back.</summary>
    public async ValueTask<bool> TryUpdateAsync(string sessionId, Func<UserSessionState, UserSessionState> update, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentNullException.ThrowIfNull(update);

        using SqliteConnection connection = database.Open();
        using DbTransaction transaction = await connection.BeginTransactionAsync(cancellationToken).ConfigureAwait(false);

        UserSessionState? current;

        using (SqliteCommand command = connection.CreateCommand())
        {
            command.CommandText = $"SELECT {Columns} FROM sessions WHERE id = $id";
            _ = command.Parameters.AddWithValue("$id", sessionId);

            using SqliteDataReader reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);

            current = await reader.ReadAsync(cancellationToken).ConfigureAwait(false) ? Read(reader) : null;
        }

        if (current is null)
            return false;

        UserSessionState updated = update(current);

        ArgumentNullException.ThrowIfNull(updated);
        updated.Validate();

        if (!string.Equals(updated.SessionId, sessionId, StringComparison.Ordinal))
            throw new InvalidOperationException("An update cannot change the session's id.");

        // The session it was given: a language or theme it already has, nothing to write.
        if (ReferenceEquals(updated, current))
            return true;

        await WriteAsync(connection, updated, cancellationToken).ConfigureAwait(false);
        await transaction.CommitAsync(cancellationToken).ConfigureAwait(false);

        return true;
    }

    public async ValueTask<bool> TouchAsync(string sessionId, DateTime utcNow, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "UPDATE sessions SET last_seen_utc = $seen WHERE id = $id";
        _ = command.Parameters.AddWithValue("$seen", utcNow.ToString("O", CultureInfo.InvariantCulture));
        _ = command.Parameters.AddWithValue("$id", sessionId);

        return await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false) > 0;
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

    public async ValueTask<IReadOnlyList<string>> FindByUserAsync(string userId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);

        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT id FROM sessions WHERE user_id = $user AND is_authenticated <> 0";
        _ = command.Parameters.AddWithValue("$user", userId);

        using SqliteDataReader reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        List<string> found = [];

        while (await reader.ReadAsync(cancellationToken).ConfigureAwait(false))
            found.Add(reader.GetString(0));

        return found;
    }

    /// <summary>
    /// Drops every session idle past its timeout — the short unclaimed one for a session only a page render has seen — answering
    /// their ids; the dates sort as text because they are written round-trip.
    /// </summary>
    public async ValueTask<IReadOnlyList<string>> CleanupAsync(DateTime utcNow, UISessionOptions options, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(options);

        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "DELETE FROM sessions WHERE last_seen_utc < CASE WHEN is_unclaimed <> 0 THEN $unclaimedLimit ELSE $limit END RETURNING id";
        _ = command.Parameters.AddWithValue("$limit", (utcNow - options.IdleTimeout).ToString("O", CultureInfo.InvariantCulture));
        _ = command.Parameters.AddWithValue("$unclaimedLimit", (utcNow - options.UnclaimedIdleTimeout).ToString("O", CultureInfo.InvariantCulture));

        using SqliteDataReader reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        List<string> removed = [];

        while (await reader.ReadAsync(cancellationToken).ConfigureAwait(false))
            removed.Add(reader.GetString(0));

        return removed;
    }
}
