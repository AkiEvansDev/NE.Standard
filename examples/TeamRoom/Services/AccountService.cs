using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;
using TeamRoom.Data;

namespace TeamRoom.Services;

/// <summary>
/// Accounts and their passwords: who may sign in, with which role, and whether an administrator has shut the door.
/// </summary>
public sealed partial class AccountService(AppDatabase database, AppEvents events, ILogger<AccountService> logger)
{
    private const int HashIterations = 100_000;
    private const int SaltSize = 16;
    private const int HashSize = 32;

    private static partial class Log
    {
        [LoggerMessage(Level = LogLevel.Warning, Message = "No accounts yet: created '{Login}' with the password '{Password}' — change it after the first sign-in.")]
        public static partial void SeededAdministrator(ILogger logger, string login, string password);
    }

    /// <summary>The first administrator, made once on an empty database and announced in the log.</summary>
    public void Seed()
    {
        using SqliteConnection connection = database.Open();

        if (Count(connection) > 0)
            return;

        _ = Insert(connection, "admin", "Admin", AccountRoles.Admin, "admin");
        Log.SeededAdministrator(logger, "admin", "admin");
    }

    private static long Count(SqliteConnection connection)
    {
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT COUNT(*) FROM accounts";

        return (long)command.ExecuteScalar()!;
    }

    private static string Insert(SqliteConnection connection, string login, string nickname, string role, string password)
    {
        var id = AppDatabase.NewId();
        (var hash, var salt) = HashPassword(password);

        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO accounts (id, login, nickname, role, password_hash, password_salt, is_blocked, created_utc)
            VALUES ($id, $login, $nickname, $role, $hash, $salt, 0, $created)
            """;
        _ = command.Parameters.AddWithValue("$id", id);
        _ = command.Parameters.AddWithValue("$login", login);
        _ = command.Parameters.AddWithValue("$nickname", nickname);
        _ = command.Parameters.AddWithValue("$role", role);
        _ = command.Parameters.AddWithValue("$hash", hash);
        _ = command.Parameters.AddWithValue("$salt", salt);
        _ = command.Parameters.AddWithValue("$created", AppDatabase.Now());
        _ = command.ExecuteNonQuery();

        return id;
    }

    private static (string Hash, string Salt) HashPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(password), salt, HashIterations, HashAlgorithmName.SHA256, HashSize);

        return (Convert.ToHexString(hash), Convert.ToHexString(salt));
    }

    /// <summary>The account behind a login and password, or <see langword="null"/> — a blocked account answers the same as a wrong password.</summary>
    public AccountRecord? Verify(string login, string password)
    {
        if (string.IsNullOrWhiteSpace(login) || string.IsNullOrEmpty(password))
            return null;

        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT password_hash, password_salt, id FROM accounts WHERE login = $login";
        _ = command.Parameters.AddWithValue("$login", login.Trim());

        using SqliteDataReader reader = command.ExecuteReader();

        if (!reader.Read())
            return null;

        var expected = Convert.FromHexString(reader.GetString(0));
        var salt = Convert.FromHexString(reader.GetString(1));
        var actual = Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(password), salt, HashIterations, HashAlgorithmName.SHA256, HashSize);

        if (!CryptographicOperations.FixedTimeEquals(expected, actual))
            return null;

        AccountRecord? account = Find(connection, reader.GetString(2));

        return account is { IsBlocked: false } ? account : null;
    }

    public AccountRecord? Find(string id)
    {
        using SqliteConnection connection = database.Open();

        return Find(connection, id);
    }

    private static AccountRecord? Find(SqliteConnection connection, string id)
    {
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = $"{SelectColumns} WHERE id = $id";
        _ = command.Parameters.AddWithValue("$id", id);

        using SqliteDataReader reader = command.ExecuteReader();

        return reader.Read() ? Read(reader) : null;
    }

    private const string SelectColumns = "SELECT id, login, nickname, role, is_blocked, avatar_media_id, background_media_id, background_fit, created_utc FROM accounts";

    private static AccountRecord Read(SqliteDataReader reader)
        => new(
            reader.GetString(0),
            reader.GetString(1),
            reader.GetString(2),
            reader.GetString(3),
            reader.GetInt64(4) != 0,
            reader.IsDBNull(5) ? null : reader.GetString(5),
            reader.IsDBNull(6) ? null : reader.GetString(6),
            reader.IsDBNull(7) ? null : reader.GetString(7),
            DateTime.Parse(reader.GetString(8), CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind)
        );

    public IReadOnlyList<AccountRecord> List()
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = $"{SelectColumns} ORDER BY created_utc";

        using SqliteDataReader reader = command.ExecuteReader();
        List<AccountRecord> accounts = [];

        while (reader.Read())
            accounts.Add(Read(reader));

        return accounts;
    }

    /// <summary>Every account but the blocked ones: who a message can be sent to.</summary>
    public IReadOnlyList<AccountRecord> ListActive()
    {
        List<AccountRecord> active = [];

        foreach (AccountRecord account in List())
        {
            if (!account.IsBlocked)
                active.Add(account);
        }

        return active;
    }

    /// <summary>A new account, or the reason there is none.</summary>
    public string? Create(string login, string nickname, string password, string role, out string id)
    {
        id = string.Empty;
        login = login.Trim();
        nickname = nickname.Trim();

        if (login.Length is < 2 or > 32 || !IsLogin(login))
            return "A login is 2 to 32 letters, digits, dots or dashes.";

        if (nickname.Length == 0)
            nickname = login;

        if (password.Length < 4)
            return "A password is at least 4 characters.";

        if (role is not (AccountRoles.Admin or AccountRoles.User))
            return "Unknown role.";

        using SqliteConnection connection = database.Open();

        try
        {
            id = Insert(connection, login, nickname, role, password);
        }
        catch (SqliteException error) when (error.SqliteErrorCode == 19)
        {
            return $"'{login}' is taken.";
        }

        events.Publish(new AccountChanged(id, AccountChangeKind.Profile));

        return null;
    }

    private static bool IsLogin(string login)
    {
        foreach (var c in login)
        {
            if (!char.IsAsciiLetterOrDigit(c) && c is not ('.' or '-' or '_'))
                return false;
        }

        return true;
    }

    /// <summary>Changes the role; refused when it would leave the application without an administrator.</summary>
    public string? SetRole(string id, string role)
    {
        if (role is not (AccountRoles.Admin or AccountRoles.User))
            return "Unknown role.";

        using SqliteConnection connection = database.Open();

        if (role == AccountRoles.User && IsLastAdministrator(connection, id))
            return "The last administrator keeps the role.";

        Execute(connection, "UPDATE accounts SET role = $role WHERE id = $id", ("$role", role), ("$id", id));
        events.Publish(new AccountChanged(id, AccountChangeKind.Profile));

        return null;
    }

    private static bool IsLastAdministrator(SqliteConnection connection, string id)
    {
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT COUNT(*) FROM accounts WHERE role = $admin AND is_blocked = 0 AND id <> $id";
        _ = command.Parameters.AddWithValue("$admin", AccountRoles.Admin);
        _ = command.Parameters.AddWithValue("$id", id);

        return (long)command.ExecuteScalar()! == 0 && Find(connection, id) is { IsAdmin: true };
    }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Security", "CA2100:Review SQL queries for security vulnerabilities", Justification = "Every caller passes a literal; the values travel as parameters.")]
    private static void Execute(SqliteConnection connection, string sql, params (string Name, object Value)[] parameters)
    {
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = sql;

        foreach ((var name, var value) in parameters)
            _ = command.Parameters.AddWithValue(name, value);

        _ = command.ExecuteNonQuery();
    }

    public string? SetBlocked(string id, bool blocked)
    {
        using SqliteConnection connection = database.Open();

        if (blocked && IsLastAdministrator(connection, id))
            return "The last administrator cannot be blocked.";

        Execute(connection, "UPDATE accounts SET is_blocked = $blocked WHERE id = $id", ("$blocked", blocked ? 1 : 0), ("$id", id));
        events.Publish(new AccountChanged(id, blocked ? AccountChangeKind.Blocked : AccountChangeKind.Profile));

        return null;
    }

    public string? Delete(string id)
    {
        using SqliteConnection connection = database.Open();

        if (IsLastAdministrator(connection, id))
            return "The last administrator cannot be deleted.";

        // The messages stay under the author's id: a conversation does not lose its past when a member goes.
        Execute(connection, "DELETE FROM conversation_members WHERE account_id = $id", ("$id", id));
        Execute(connection, "DELETE FROM media WHERE owner_id = $id AND purpose <> $attachment", ("$id", id), ("$attachment", MediaPurposes.Attachment));
        Execute(connection, "DELETE FROM accounts WHERE id = $id", ("$id", id));
        events.Publish(new AccountChanged(id, AccountChangeKind.Deleted));

        return null;
    }

    /// <summary>A new random password, shown once to the administrator who asked.</summary>
    public string ResetPassword(string id)
    {
        var password = string.Create(10, RandomNumberGenerator.GetBytes(10), static (span, bytes) =>
        {
            const string alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";

            for (var i = 0; i < span.Length; i++)
                span[i] = alphabet[bytes[i] % alphabet.Length];
        });

        SetPassword(id, password);

        return password;
    }

    /// <summary>The account's own change from its settings row: the person is signed in, which is the check.</summary>
    public string? SetOwnPassword(string id, string next)
    {
        if (next.Length < 4)
            return "A password is at least 4 characters.";

        SetPassword(id, next);

        return null;
    }

    private void SetPassword(string id, string password)
    {
        (var hash, var salt) = HashPassword(password);

        using SqliteConnection connection = database.Open();
        Execute(connection, "UPDATE accounts SET password_hash = $hash, password_salt = $salt WHERE id = $id", ("$hash", hash), ("$salt", salt), ("$id", id));
    }

    /// <summary>The account's own change: the current password has to match first.</summary>
    public string? ChangePassword(string id, string current, string next)
    {
        AccountRecord? account = Find(id);

        if (account is null || Verify(account.Login, current) is null)
            return "The current password is wrong.";

        if (next.Length < 4)
            return "A password is at least 4 characters.";

        SetPassword(id, next);

        return null;
    }

    public string? Rename(string id, string nickname)
    {
        nickname = nickname.Trim();

        if (nickname.Length is 0 or > 48)
            return "A name is 1 to 48 characters.";

        using SqliteConnection connection = database.Open();
        Execute(connection, "UPDATE accounts SET nickname = $nickname WHERE id = $id", ("$nickname", nickname), ("$id", id));
        events.Publish(new AccountChanged(id, AccountChangeKind.Profile));

        return null;
    }

    public void SetAvatar(string id, string? mediaId)
    {
        using SqliteConnection connection = database.Open();
        Execute(connection, "UPDATE accounts SET avatar_media_id = $media WHERE id = $id", ("$media", (object?)mediaId ?? DBNull.Value), ("$id", id));
        events.Publish(new AccountChanged(id, AccountChangeKind.Profile));
    }

    public void SetBackground(string id, string? mediaId, string? fit)
    {
        using SqliteConnection connection = database.Open();
        Execute(connection, "UPDATE accounts SET background_media_id = $media, background_fit = $fit WHERE id = $id",
            ("$media", (object?)mediaId ?? DBNull.Value), ("$fit", (object?)fit ?? DBNull.Value), ("$id", id));
        events.Publish(new AccountChanged(id, AccountChangeKind.Profile));
    }
}
