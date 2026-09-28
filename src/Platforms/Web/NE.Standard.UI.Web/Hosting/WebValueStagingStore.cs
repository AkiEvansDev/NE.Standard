using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Values too large for the hub, staged beside it under session-bound tokens (<c>docs/VALUES.md</c> §2): a client upload,
/// redeemed once by its hub update, or a server value fetched by the tabs it was sent to.
/// </summary>
/// <remarks>
/// In memory, since a value lives only between staging and the fetch/update that names it — both of which reach the server that
/// staged it, per SignalR's sticky sessions. A client's value is kept as the JSON it arrived as and read when it is taken: the
/// bytes are what the allowance counts, and the object graph they read into is several times larger.
/// </remarks>
internal sealed class WebValueStagingStore
{
    private readonly ConcurrentDictionary<string, IncomingValue> _incoming = new(StringComparer.Ordinal);
    private readonly ConcurrentDictionary<string, OutgoingValue> _outgoing = new(StringComparer.Ordinal);
    private readonly WebSessionAllowance _allowance = new();
    private readonly TimeProvider _time;
    private readonly JsonSerializerOptions _json;
    private readonly TimeSpan _retention;
    private readonly long _maxPerSession;
    private readonly long _maxTotal;

    /// <summary>How many values are staged now, both ways, for the web meter.</summary>
    public int Count => _incoming.Count + _outgoing.Count;

    /// <summary>How many bytes the staged values hold now, both ways, for the web meter.</summary>
    public long Size
    {
        get
        {
            long size = 0;

            foreach (KeyValuePair<string, IncomingValue> entry in _incoming)
                size += entry.Value.Bytes;

            foreach (KeyValuePair<string, OutgoingValue> entry in _outgoing)
                size += entry.Value.Json.Length;

            return size;
        }
    }

    public WebValueStagingStore(IOptions<WebValueOptions> options, IOptions<JsonHubProtocolOptions> hubProtocol, TimeProvider time)
    {
        ArgumentNullException.ThrowIfNull(options);
        ArgumentNullException.ThrowIfNull(hubProtocol);
        ArgumentNullException.ThrowIfNull(time);

        options.Value.Validate();

        _time = time;
        // The hub's own options, converters included, so the runtime cannot tell a staged value from one that came inline.
        _json = hubProtocol.Value.PayloadSerializerOptions;
        _retention = options.Value.StagingRetention;
        _maxPerSession = options.Value.MaxStagedBytesPerSession;
        _maxTotal = options.Value.MaxStagedBytesTotal ?? 0;
    }

    /// <summary>
    /// Opens the claim a client's value is read under: its bytes count against the session's
    /// <see cref="WebValueOptions.MaxStagedBytesPerSession"/> and <see cref="WebValueOptions.MaxStagedBytesTotal"/> as they
    /// arrive, and stay counted while the value is staged.
    /// </summary>
    public WebSessionAllowance.Claim Open(string sessionId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        // Swept first, so a session whose values expired is not held back by them.
        RemoveExpired(_time.GetUtcNow());

        return _allowance.Open(sessionId, _maxPerSession, _maxTotal);
    }

    // Swept on the way in, not by a timer: the store only grows when something is staged.
    private void RemoveExpired(DateTimeOffset now)
    {
        foreach (KeyValuePair<string, IncomingValue> entry in _incoming)
        {
            if (entry.Value.ExpiresAt <= now && _incoming.TryRemove(entry.Key, out IncomingValue removed))
                _allowance.Release(removed.SessionId, removed.Bytes);
        }

        foreach (KeyValuePair<string, OutgoingValue> entry in _outgoing)
        {
            if (entry.Value.ExpiresAt <= now)
                _ = _outgoing.TryRemove(entry.Key, out _);
        }
    }

    /// <summary>
    /// Stages the JSON of a value a client uploaded under <paramref name="claim"/>, and returns the token its hub update redeems.
    /// </summary>
    public string Stage(WebSessionAllowance.Claim claim, ReadOnlyMemory<byte> json)
    {
        ArgumentNullException.ThrowIfNull(claim);

        DateTimeOffset now = _time.GetUtcNow();

        RemoveExpired(now);

        var token = Guid.NewGuid().ToString("N");

        _incoming[token] = new IncomingValue(claim.SessionId, json, now + _retention, claim.Keep());

        return token;
    }

    /// <summary>Whether this refusal on <see cref="WebValueOptions.MaxStagedBytesTotal"/> is the first of its burst, the one to report.</summary>
    public bool ReportTotalReached()
        => _allowance.ReportTotalReached();

    /// <summary>
    /// Whether a token can be taken by the session now: staged by it, not expired. A batch checks every token before taking any,
    /// so a bad one fails without spending the good ones.
    /// </summary>
    public bool Holds(string sessionId, string token)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(token);

        return _incoming.TryGetValue(token, out IncomingValue staged)
            && string.Equals(staged.SessionId, sessionId, StringComparison.Ordinal)
            && staged.ExpiresAt > _time.GetUtcNow();
    }

    /// <summary>
    /// Takes the value a token names, once, when the token belongs to the session and has not expired.
    /// </summary>
    public bool TryTake(string sessionId, string token, out object? value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(token);

        value = null;

        if (!_incoming.TryGetValue(token, out IncomingValue staged))
            return false;

        // Another session's token is left where it is: a guess must not be able to spend it.
        if (!string.Equals(staged.SessionId, sessionId, StringComparison.Ordinal))
            return false;

        if (!_incoming.TryRemove(token, out staged))
            return false;

        _allowance.Release(staged.SessionId, staged.Bytes);

        if (staged.ExpiresAt <= _time.GetUtcNow())
            return false;

        value = JsonSerializer.Deserialize<object?>(staged.Json.Span, _json);
        return true;
    }

    /// <summary>
    /// Stages the JSON of a value the server sends to <paramref name="readers"/> tabs of a session, and returns the token they fetch it by.
    /// </summary>
    public string StageOutgoing(string sessionId, byte[] json, int readers)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentNullException.ThrowIfNull(json);

        DateTimeOffset now = _time.GetUtcNow();

        RemoveExpired(now);

        var token = Guid.NewGuid().ToString("N");

        _outgoing[token] = new OutgoingValue(sessionId, json, now + _retention, Math.Max(1, readers));

        return token;
    }

    /// <summary>
    /// Reads the JSON a token names for the session, and lets it go once every tab it was sent to has read it.
    /// </summary>
    public bool TryRead(string sessionId, string token, out byte[] json)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(token);

        json = [];

        if (!_outgoing.TryGetValue(token, out OutgoingValue? staged) || !string.Equals(staged.SessionId, sessionId, StringComparison.Ordinal))
            return false;

        if (staged.ExpiresAt <= _time.GetUtcNow())
        {
            _ = _outgoing.TryRemove(token, out _);
            return false;
        }

        if (Interlocked.Decrement(ref staged.Readers) <= 0)
            _ = _outgoing.TryRemove(token, out _);

        json = staged.Json;
        return true;
    }

    private readonly record struct IncomingValue(string SessionId, ReadOnlyMemory<byte> Json, DateTimeOffset ExpiresAt, long Bytes);

    private sealed class OutgoingValue(string sessionId, byte[] json, DateTimeOffset expiresAt, int readers)
    {
        public string SessionId { get; } = sessionId;

        public byte[] Json { get; } = json;

        public DateTimeOffset ExpiresAt { get; } = expiresAt;

        // A field, not a property: the count is decremented in place by every tab that reads it.
        public int Readers = readers;
    }
}
