using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using NE.Standard.UI.Files;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Values too large for the hub, staged beside it under session-bound tokens (<c>docs/VALUES.md</c> §2): a client upload,
/// redeemed once by its hub update, or a server value fetched by the tabs it was sent to.
/// </summary>
/// <remarks>
/// In memory, since a value lives only between staging and the fetch/update that names it — both of which reach the server that
/// staged it, per SignalR's sticky sessions. A client's value is kept as the JSON it arrived as and read when it is taken: the
/// bytes are what the allowance counts, and the object graph they read into is several times larger. Each direction has an
/// allowance of its own, so a page's own values never crowd out what the reader sends.
/// </remarks>
internal sealed class WebValueStagingStore
{
    private readonly ConcurrentDictionary<string, IncomingValue> _incoming = new(StringComparer.Ordinal);
    private readonly ConcurrentDictionary<string, OutgoingValue> _outgoing = new(StringComparer.Ordinal);
    private readonly WebSessionAllowance _allowance = new();
    private readonly WebSessionAllowance _outgoingAllowance = new();

    // Every token in the order it was staged, which is the order it expires in: the retention is one for all.
    private readonly ConcurrentQueue<(DateTimeOffset ExpiresAt, string Token)> _expiries = new();
    private readonly Lock _sweepSync = new();

    // The tokens each connection's last attach staged: dead once the connection attaches again or closes.
    private readonly ConcurrentDictionary<string, string[]> _attaches = new(StringComparer.Ordinal);

    private readonly TimeProvider _time;
    private readonly JsonSerializerOptions _json;
    private readonly TimeSpan _retention;
    private readonly long _maxPerSession;
    private readonly long _maxTotal;
    private readonly long _maxOutgoingPerSession;
    private readonly long _maxOutgoingTotal;

    /// <summary>How many values are staged now, both ways, for the web meter.</summary>
    public int Count => _incoming.Count + _outgoing.Count;

    /// <summary>How many bytes the staged values hold now, both ways, for the web meter.</summary>
    public long Size
    {
        get
        {
            long size = 0;

            foreach (KeyValuePair<string, IncomingValue> entry in _incoming)
                size += entry.Value.Json.Length;

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
        _maxOutgoingPerSession = options.Value.MaxOutgoingStagedBytesPerSession;
        _maxOutgoingTotal = options.Value.MaxOutgoingStagedBytesTotal ?? 0;
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

    // Swept on the way in, not by a timer: the store only grows when something is staged. Off the queue's head, so a sweep costs
    // what expired, never every value staged.
    private void RemoveExpired(DateTimeOffset now)
    {
        lock (_sweepSync)
        {
            // One sweeper at a time, so the head peeked is the head taken.
            while (_expiries.TryPeek(out (DateTimeOffset ExpiresAt, string Token) head) && head.ExpiresAt <= now)
            {
                _ = _expiries.TryDequeue(out _);

                if (_incoming.TryRemove(head.Token, out IncomingValue incoming))
                    _allowance.Release(incoming.SessionId, incoming.Bytes);
                else
                    RemoveOutgoing(head.Token);
            }
        }
    }

    private void RemoveOutgoing(string token)
    {
        if (_outgoing.TryRemove(token, out OutgoingValue? removed))
            _outgoingAllowance.Release(removed.SessionId, removed.Bytes);
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
        _expiries.Enqueue((now + _retention, token));

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
    /// Stages the JSON of a value the server sends to the session's <paramref name="readers"/> — the instances the change set goes
    /// to — and answers the token they fetch it by; false, staging nothing, where it would cross
    /// <see cref="WebValueOptions.MaxOutgoingStagedBytesPerSession"/> or <see cref="WebValueOptions.MaxOutgoingStagedBytesTotal"/>,
    /// and the value travels inline instead.
    /// </summary>
    /// <remarks>An attach's tokens are named by <paramref name="attachOf"/>, its connection, so its next attach lets them go.</remarks>
    public bool TryStageOutgoing(string sessionId, byte[] json, IReadOnlyCollection<string> readers, string? attachOf, out string token)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentNullException.ThrowIfNull(json);
        ArgumentNullException.ThrowIfNull(readers);

        DateTimeOffset now = _time.GetUtcNow();

        RemoveExpired(now);

        token = string.Empty;
        long bytes;

        using (WebSessionAllowance.Claim claim = _outgoingAllowance.Open(sessionId, _maxOutgoingPerSession, _maxOutgoingTotal))
        {
            if (!claim.TryReserve(json.LongLength + UIAllowanceCharge.EntryBytes))
                return false;

            bytes = claim.Keep();
        }

        token = Guid.NewGuid().ToString("N");

        _outgoing[token] = new OutgoingValue(sessionId, json, now + _retention, bytes, readers);
        _expiries.Enqueue((now + _retention, token));

        if (attachOf is not null)
        {
            var staged = token;

            _ = _attaches.AddOrUpdate(attachOf, [staged], (_, held) => [.. held, staged]);
        }

        return true;
    }

    /// <summary>
    /// Lets go of the values a connection's last attach staged: once it attaches again its new snapshot carries its own, and once it
    /// closes nothing fetches them.
    /// </summary>
    public void ReleaseAttach(string connectionId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(connectionId);

        if (!_attaches.TryRemove(connectionId, out var tokens))
            return;

        foreach (var token in tokens)
            RemoveOutgoing(token);
    }

    /// <summary>
    /// Reads the JSON a token names for the session, and lets it go once every instance it was sent to has read it. A read by an
    /// instance that already read it, or names none, spends nothing: a retry of one tab must not spend another's read.
    /// </summary>
    public bool TryRead(string sessionId, string token, string? instanceId, out byte[] json)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(token);

        json = [];

        if (!_outgoing.TryGetValue(token, out OutgoingValue? staged) || !string.Equals(staged.SessionId, sessionId, StringComparison.Ordinal))
            return false;

        if (staged.ExpiresAt <= _time.GetUtcNow())
        {
            RemoveOutgoing(token);
            return false;
        }

        if (instanceId is not null && staged.ReadBy(instanceId))
            RemoveOutgoing(token);

        json = staged.Json;
        return true;
    }

    private readonly record struct IncomingValue(string SessionId, ReadOnlyMemory<byte> Json, DateTimeOffset ExpiresAt, long Bytes);

    private sealed class OutgoingValue(string sessionId, byte[] json, DateTimeOffset expiresAt, long bytes, IReadOnlyCollection<string> readers)
    {
        // The instances yet to read it; a set rather than a count, so one instance's second read is not another's.
        private readonly HashSet<string> _unread = new(readers, StringComparer.Ordinal);

        public string SessionId { get; } = sessionId;

        public byte[] Json { get; } = json;

        public DateTimeOffset ExpiresAt { get; } = expiresAt;

        /// <summary>What the value counts against the session's outgoing allowance.</summary>
        public long Bytes { get; } = bytes;

        /// <summary>Marks the instance's read, and answers whether every instance has now read it.</summary>
        public bool ReadBy(string instanceId)
        {
            lock (_unread)
                return _unread.Remove(instanceId) && _unread.Count == 0;
        }
    }
}
