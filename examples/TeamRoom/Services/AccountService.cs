using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;
using TeamRoom.Data;

namespace TeamRoom.Services;

/// <summary>
/// Accounts and their passwords: who may sign in, with which role, and whether an administrator has shut the door.
/// </summary>
/// <remarks>
/// A change to an account reaches the sessions it is signed in with through the framework's <see cref="IUISessions"/>, which
/// also sends the pages open under an ended session to sign in.
/// </remarks>
public sealed partial class AccountService(AppDatabase database, IUserSessionStore sessionStore, IUISessions sessions, AppEvents events, ILogger<AccountService> logger)
{
    private const int HashIterations = 100_000;
    private const int SaltSize = 16;
    private const int HashSize = 32;

    /// <summary>Wrong passwords a login may take within <see cref="FailureWindow"/> before it is held off until the window ends.</summary>
    private const int MaxFailures = 5;

    /// <summary>Past this many tracked logins the expired ones are dropped, so guesses at invented logins cannot grow the table for ever.</summary>
    private const int FailurePruneThreshold = 1024;

    /// <summary>What a throttled login is told, whether it exists or not.</summary>
    public const string TooManyAttempts = "Too many wrong passwords; try again in a few minutes.";

    /// <summary>The first administrator's login.</summary>
    public const string AdminLogin = "admin";

    /// <summary>The setting the first administrator's password is read from; outside Development nothing else makes one.</summary>
    public const string AdminPasswordSetting = "TeamRoom:AdminPassword";

    /// <summary>The first administrator's password in Development when the setting is absent: known, and said in the log.</summary>
    private const string DevelopmentAdminPassword = "admin";

    private static readonly TimeSpan FailureWindow = TimeSpan.FromMinutes(5);

    // Hashed against when the login does not exist, so an unknown login costs what a wrong password does and the timing names no one.
    private static readonly byte[] DummySalt = RandomNumberGenerator.GetBytes(SaltSize);
    private static readonly byte[] DummyHash = RandomNumberGenerator.GetBytes(HashSize);

    private readonly Lock _failuresLock = new();
    private readonly Dictionary<string, (int Count, DateTime Since)> _failures = new(StringComparer.OrdinalIgnoreCase);

    private static partial class Log
    {
        [LoggerMessage(Level = LogLevel.Warning, Message = "No accounts yet: created '{Login}' with the password '{Password}' — change it after the first sign-in.")]
        public static partial void SeededDevelopmentAdministrator(ILogger logger, string login, string password);

        [LoggerMessage(Level = LogLevel.Warning, Message = "No accounts yet: created '{Login}' with the password the '{Setting}' setting holds.")]
        public static partial void SeededAdministrator(ILogger logger, string login, string setting);

        [LoggerMessage(Level = LogLevel.Warning, Message = "No accounts yet, and no administrator made: set '{Setting}' (the environment variable '{Variable}') to the first administrator's password, at least 4 characters, and start again; its login is '{Login}'.")]
        public static partial void NoAdministrator(ILogger logger, string setting, string variable, string login);
    }

    /// <summary>
    /// The first administrator, made once on an empty database with the password <see cref="InitialAdminPassword"/> picks, and
    /// announced in the log — the password itself only when it is Development's known one.
    /// </summary>
    public void Seed(bool isDevelopment, string? configuredPassword)
    {
        using SqliteConnection connection = database.Open();

        if (Count(connection) > 0)
            return;

        if (InitialAdminPassword(isDevelopment, configuredPassword) is not { } password)
        {
            Log.NoAdministrator(logger, AdminPasswordSetting, AdminPasswordSetting.Replace(":", "__", StringComparison.Ordinal), AdminLogin);
            return;
        }

        _ = Insert(connection, AdminLogin, "Admin", AccountRoles.Admin, password);

        if (string.IsNullOrEmpty(configuredPassword))
            Log.SeededDevelopmentAdministrator(logger, AdminLogin, password);
        else
            Log.SeededAdministrator(logger, AdminLogin, AdminPasswordSetting);
    }

    private static long Count(SqliteConnection connection)
    {
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT COUNT(*) FROM accounts";

        return (long)command.ExecuteScalar()!;
    }

    /// <summary>
    /// The password the first administrator is made with: the configured one, when it passes the password rule; otherwise the
    /// known <c>admin</c> in Development, and none elsewhere, since a copied deployment must not come up with a known password.
    /// </summary>
    public static string? InitialAdminPassword(bool isDevelopment, string? configuredPassword)
    {
        if (!string.IsNullOrEmpty(configuredPassword))
            return PasswordError(configuredPassword) is null ? configuredPassword : null;

        return isDevelopment ? DevelopmentAdminPassword : null;
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

    /// <summary>The quick sign-in's test accounts, each made once with its login as its password; an existing login is left as it is.</summary>
    public void SeedTestAccounts()
    {
        using SqliteConnection connection = database.Open();

        foreach ((var login, var nickname, var role) in QuickSignIn.Accounts)
        {
            if (FindIdByLogin(connection, login) is null)
                _ = Insert(connection, login, nickname, role, login);
        }
    }

    private static string? FindIdByLogin(SqliteConnection connection, string login)
    {
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT id FROM accounts WHERE login = $login";
        _ = command.Parameters.AddWithValue("$login", login);

        return command.ExecuteScalar() as string;
    }

    /// <summary>
    /// The account behind a login and password, or <see langword="null"/> — a blocked account answers the same as a wrong
    /// password. A login that has failed too often lately is <paramref name="throttled"/> and not checked at all.
    /// </summary>
    public AccountRecord? Verify(string login, string password, out bool throttled)
    {
        throttled = false;

        if (string.IsNullOrWhiteSpace(login) || string.IsNullOrEmpty(password))
            return null;

        login = login.Trim();

        if (IsThrottled(login))
        {
            throttled = true;
            return null;
        }

        AccountRecord? account = Check(login, password);

        if (account is null)
            RecordFailure(login);
        else
            ClearFailures(login);

        return account;
    }

    private bool IsThrottled(string login)
    {
        lock (_failuresLock)
            return _failures.TryGetValue(login, out (int Count, DateTime Since) entry) && entry.Count >= MaxFailures && DateTime.UtcNow - entry.Since < FailureWindow;
    }

    private AccountRecord? Check(string login, string password)
    {
        using SqliteConnection connection = database.Open();
        using SqliteCommand command = connection.CreateCommand();
        command.CommandText = "SELECT password_hash, password_salt, id FROM accounts WHERE login = $login";
        _ = command.Parameters.AddWithValue("$login", login);

        using SqliteDataReader reader = command.ExecuteReader();

        var found = reader.Read();
        var expected = found ? Convert.FromHexString(reader.GetString(0)) : DummyHash;
        var salt = found ? Convert.FromHexString(reader.GetString(1)) : DummySalt;
        var actual = Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(password), salt, HashIterations, HashAlgorithmName.SHA256, HashSize);

        if (!CryptographicOperations.FixedTimeEquals(expected, actual) || !found)
            return null;

        AccountRecord? account = Find(connection, reader.GetString(2));

        return account is { IsBlocked: false } ? account : null;
    }

    private void RecordFailure(string login)
    {
        DateTime now = DateTime.UtcNow;

        lock (_failuresLock)
        {
            if (_failures.Count >= FailurePruneThreshold)
                PruneFailuresNoLock(now);

            _failures[login] = _failures.TryGetValue(login, out (int Count, DateTime Since) entry) && now - entry.Since < FailureWindow
                ? (entry.Count + 1, entry.Since)
                : (1, now);
        }
    }

    private void PruneFailuresNoLock(DateTime now)
    {
        List<string> expired = [];

        foreach (KeyValuePair<string, (int Count, DateTime Since)> pair in _failures)
        {
            if (now - pair.Value.Since >= FailureWindow)
                expired.Add(pair.Key);
        }

        foreach (var login in expired)
            _ = _failures.Remove(login);
    }

    private void ClearFailures(string login)
    {
        lock (_failuresLock)
            _ = _failures.Remove(login);
    }

    /// <summary>The account a login names, for the quick sign-in, or <see langword="null"/>.</summary>
    public AccountRecord? FindByLogin(string login)
    {
        using SqliteConnection connection = database.Open();

        return FindIdByLogin(connection, login) is { } id ? Find(connection, id) : null;
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
        => new(reader.GetString(0), reader.GetString(1), reader.GetString(2), reader.GetString(3), reader.GetInt64(4) != 0, reader.IsDBNull(5) ? null : reader.GetString(5), reader.IsDBNull(6) ? null : reader.GetString(6), reader.IsDBNull(7) ? null : reader.GetString(7), DateTime.Parse(reader.GetString(8), CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind));

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
            return "A login is 2 to 32 letters, digits, dots, dashes or underscores.";

        if (nickname.Length == 0)
            nickname = login;

        if (NicknameError(nickname) is { } nicknameError)
            return nicknameError;

        if (PasswordError(password) is { } passwordError)
            return passwordError;

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

    /// <summary>What is wrong with a display name, or null.</summary>
    private static string? NicknameError(string nickname)
        => nickname.Length is 0 or > 48 ? "A name is 1 to 48 characters." : null;

    /// <summary>What is wrong with a password, or null.</summary>
    private static string? PasswordError(string password)
        => password.Length < 4 ? "A password is at least 4 characters." : null;

    /// <summary>
    /// Changes the role, on the account and on every session it is signed in with, since those are what a page and a command are
    /// checked against; refused when it would leave the application without an administrator.
    /// </summary>
    public async Task<string?> SetRoleAsync(string id, string role, CancellationToken cancellationToken = default)
    {
        if (WriteRole(id, role) is { } error)
            return error;

        _ = await sessions.UpdateUserSessionsAsync(id, session => session with { Roles = new HashSet<string>(StringComparer.Ordinal) { role } }, cancellationToken).ConfigureAwait(false);
        events.Publish(new AccountChanged(id, AccountChangeKind.Profile));

        return null;
    }

    private string? WriteRole(string id, string role)
    {
        if (role is not (AccountRoles.Admin or AccountRoles.User))
            return "Unknown role.";

        using SqliteConnection connection = database.Open();

        // Immediate, so two administrators demoting each other cannot both pass the check.
        using SqliteTransaction transaction = connection.BeginTransaction();

        if (role == AccountRoles.User && IsLastAdministrator(connection, id))
            return "The last administrator keeps the role.";

        Execute(connection, "UPDATE accounts SET role = $role WHERE id = $id", ("$role", role), ("$id", id));
        transaction.Commit();

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

    /// <summary>A block signs the account out everywhere, and its open pages go to the sign-in page.</summary>
    public async Task<string?> SetBlockedAsync(string id, bool blocked, CancellationToken cancellationToken = default)
    {
        if (WriteBlocked(id, blocked) is { } error)
            return error;

        if (blocked)
            _ = await sessions.EndUserSessionsAsync(id, cancellationToken).ConfigureAwait(false);

        events.Publish(new AccountChanged(id, blocked ? AccountChangeKind.Blocked : AccountChangeKind.Profile));

        return null;
    }

    private string? WriteBlocked(string id, bool blocked)
    {
        using SqliteConnection connection = database.Open();
        using SqliteTransaction transaction = connection.BeginTransaction();

        if (blocked && IsLastAdministrator(connection, id))
            return "The last administrator cannot be blocked.";

        Execute(connection, "UPDATE accounts SET is_blocked = $blocked WHERE id = $id", ("$blocked", blocked ? 1 : 0), ("$id", id));
        transaction.Commit();

        return null;
    }

    /// <summary>The account goes, and with it every session it was signed in with and the pages open under them.</summary>
    public async Task<string?> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        if (DeleteRows(id) is { } error)
            return error;

        _ = await sessions.EndUserSessionsAsync(id, cancellationToken).ConfigureAwait(false);
        events.Publish(new AccountChanged(id, AccountChangeKind.Deleted));

        return null;
    }

    private string? DeleteRows(string id)
    {
        using SqliteConnection connection = database.Open();

        using (SqliteTransaction transaction = connection.BeginTransaction())
        {
            if (IsLastAdministrator(connection, id))
                return "The last administrator cannot be deleted.";

            // The messages and the memberships stay under the account's id: a conversation keeps its past, and a direct one
            // still has two people in it, one of them now "(deleted account)".
            Execute(connection, "DELETE FROM media WHERE owner_id = $id AND purpose <> $attachment", ("$id", id), ("$attachment", MediaPurposes.Attachment));
            Execute(connection, "DELETE FROM accounts WHERE id = $id", ("$id", id));
            transaction.Commit();
        }

        AppDatabase.ReclaimSpace(connection);

        return null;
    }

    /// <summary>
    /// A new random password, shown once to the administrator who asked; every session the account had ends with the old one, and
    /// the login's wrong guesses are forgotten, since the reset is what a locked-out owner asks for.
    /// </summary>
    public async Task<string> ResetPasswordAsync(string id, CancellationToken cancellationToken = default)
    {
        var password = string.Create(10, RandomNumberGenerator.GetBytes(10), static (span, bytes) =>
        {
            const string alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";

            for (var i = 0; i < span.Length; i++)
                span[i] = alphabet[bytes[i] % alphabet.Length];
        });

        SetPassword(id, password);

        if (Find(id) is { } account)
            ClearFailures(account.Login);

        _ = await sessions.EndUserSessionsAsync(id, cancellationToken).ConfigureAwait(false);

        return password;
    }

    private void SetPassword(string id, string password)
    {
        (var hash, var salt) = HashPassword(password);

        using SqliteConnection connection = database.Open();
        Execute(connection, "UPDATE accounts SET password_hash = $hash, password_salt = $salt WHERE id = $id", ("$hash", hash), ("$salt", salt), ("$id", id));
    }

    /// <summary>
    /// The account's own change: the current password has to match first, and every other session the account is signed in
    /// with ends — a password is changed because it may be known.
    /// </summary>
    public async Task<string?> ChangePasswordAsync(string id, string current, string next, string currentSessionId, CancellationToken cancellationToken = default)
    {
        if (WritePassword(id, current, next) is { } error)
            return error;

        foreach (var sessionId in await sessionStore.FindByUserAsync(id, cancellationToken).ConfigureAwait(false))
        {
            if (sessionId != currentSessionId)
                await sessions.EndSessionAsync(sessionId, cancellationToken: cancellationToken).ConfigureAwait(false);
        }

        return null;
    }

    private string? WritePassword(string id, string current, string next)
    {
        AccountRecord? account = Find(id);

        if (account is null)
            return "The current password is wrong.";

        if (Verify(account.Login, current, out var throttled) is null)
            return throttled ? TooManyAttempts : "The current password is wrong.";

        if (PasswordError(next) is { } passwordError)
            return passwordError;

        SetPassword(id, next);

        return null;
    }

    public string? Rename(string id, string nickname)
    {
        nickname = nickname.Trim();

        if (NicknameError(nickname) is { } error)
            return error;

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
        Execute(connection, "UPDATE accounts SET background_media_id = $media, background_fit = $fit WHERE id = $id", ("$media", (object?)mediaId ?? DBNull.Value), ("$fit", (object?)fit ?? DBNull.Value), ("$id", id));
        events.Publish(new AccountChanged(id, AccountChangeKind.Profile));
    }
}
