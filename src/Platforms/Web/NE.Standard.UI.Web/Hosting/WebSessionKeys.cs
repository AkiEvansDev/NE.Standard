using System;
using System.Buffers.Text;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The one-time tokens a page trades for the key its sign-in moved its session to (<see cref="WebSessionKeyEndpoint"/>): pushed to the
/// page that signed in, good for a minute, spent once.
/// </summary>
/// <remarks>
/// Kept under SHA-256 of the token, the key sealed with a pad derived from it, so the table opens no session without the token; neither
/// is ever logged. Held in the process, as a staged value is: the page trades it with the server its connection is on. Bound to the
/// session the page signed in from: only a request still carrying that session's cookie — the signing page's browser — trades it.
/// </remarks>
internal sealed partial class WebSessionKeys : IUISessionKeyHandover
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Debug, Message = "Handing connection '{InstanceId}' its signed-in session's key failed; the session goes unused.")]
        public static partial void HandOverFailed(ILogger logger, Exception exception, string instanceId);
    }

    /// <summary>How long a page has to trade its token: the push and one request, on the slowest connection worth waiting for.</summary>
    public static readonly TimeSpan Lifetime = TimeSpan.FromMinutes(1);

    private const int TokenBytes = 32;

    private static readonly byte[] PadInfo = "ne.ui.session-key"u8.ToArray();

    private readonly ConcurrentDictionary<string, Entry> _entries = new(StringComparer.Ordinal);
    private readonly IUIUpdateSink _updates;
    private readonly TimeProvider _time;
    private readonly ILogger<WebSessionKeys> _logger;

    public WebSessionKeys(IUIUpdateSink updates, TimeProvider time, ILogger<WebSessionKeys> logger)
    {
        ArgumentNullException.ThrowIfNull(updates);
        ArgumentNullException.ThrowIfNull(time);
        ArgumentNullException.ThrowIfNull(logger);

        _updates = updates;
        _time = time;
        _logger = logger;
    }

    /// <summary>Pushes the page a token for the key, ahead of its command's answer: a page load that answer starts waits for the trade.</summary>
    public async Task HandOverAsync(UIHandle handle, UISessionSecret key, string previousSessionId, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(key);

        UICommandExecutionResult result = new()
        {
            Command = UICommandResult.Ok([new WebSessionKeyEffect(Issue(key, previousSessionId))]),
            Changes = ServerChangeSet.Empty
        };

        try
        {
            await _updates.SendCommandResultAsync(handle, result, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception exception) when (exception is not OperationCanceledException || !cancellationToken.IsCancellationRequested)
        {
            Log.HandOverFailed(_logger, exception, handle.Instance.Id);
        }
    }

    /// <summary>
    /// Issues a token for the key, good once for <see cref="Lifetime"/> to a request presenting <paramref name="boundSessionId"/>.
    /// </summary>
    public string Issue(UISessionSecret key, string boundSessionId)
    {
        ArgumentNullException.ThrowIfNull(key);
        ArgumentException.ThrowIfNullOrWhiteSpace(boundSessionId);

        DateTimeOffset now = _time.GetUtcNow();

        Sweep(now);

        var token = RandomNumberGenerator.GetBytes(TokenBytes);

        _entries[Index(token)] = new Entry(Seal(Encoding.UTF8.GetBytes(key.Value), token), boundSessionId, now + Lifetime);

        return Base64Url.EncodeToString(token);
    }

    /// <summary>Lets go of every token past its lifetime: the table holds what a minute of sign-ins left, never more.</summary>
    private void Sweep(DateTimeOffset now)
    {
        foreach (KeyValuePair<string, Entry> entry in _entries)
        {
            if (entry.Value.ExpiresAt <= now)
                _ = _entries.TryRemove(entry);
        }
    }

    private static string Index(byte[] token)
        => Convert.ToHexStringLower(SHA256.HashData(token));

    /// <summary>XORs the bytes with a pad only the token derives: sealing and opening are the one step.</summary>
    private static byte[] Seal(byte[] bytes, byte[] token)
    {
        var pad = HKDF.DeriveKey(HashAlgorithmName.SHA256, token, bytes.Length, salt: null, info: PadInfo);
        var sealedBytes = new byte[bytes.Length];

        for (var i = 0; i < bytes.Length; i++)
            sealedBytes[i] = (byte)(bytes[i] ^ pad[i]);

        return sealedBytes;
    }

    /// <summary>
    /// The key a token was issued for, the token spent; none for one unknown, spent or expired, or presented without the session it is
    /// bound to — which leaves it to the browser it was issued for.
    /// </summary>
    public string? Redeem(string? token, string? presentedSessionId)
    {
        if (!TryDecode(token, out var bytes))
            return null;

        var index = Index(bytes);

        if (!_entries.TryGetValue(index, out Entry? entry) || !string.Equals(entry.BoundSessionId, presentedSessionId, StringComparison.Ordinal))
            return null;

        // Spent by whoever removes it first, so two trades of one token answer once.
        if (!_entries.TryRemove(KeyValuePair.Create(index, entry)) || entry.ExpiresAt <= _time.GetUtcNow())
            return null;

        return Encoding.UTF8.GetString(Seal(entry.SealedKey, bytes));
    }

    private static bool TryDecode(string? token, [NotNullWhen(true)] out byte[]? bytes)
    {
        bytes = null;

        if (token is null || token.Length != Base64Url.GetEncodedLength(TokenBytes) || !Base64Url.IsValid(token))
            return false;

        bytes = Base64Url.DecodeFromChars(token);

        return bytes.Length == TokenBytes;
    }

    private sealed record Entry(byte[] SealedKey, string BoundSessionId, DateTimeOffset ExpiresAt);
}
