using System;
using System.Collections.Generic;
using System.Threading;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Bytes each session has claimed against its limit, and every session together against one process-wide limit, counted as they
/// arrive.
/// </summary>
/// <remarks>
/// Counted as they arrive so a session's parallel requests share the limit rather than each reading it whole; process-wide too,
/// since a session costs a visitor nothing to start. In memory and per process, like the requests it counts. What a session holds outside this count — an upload store's
/// files — a claim is told once it is open (<see cref="Claim.HoldElsewhere"/>).
/// </remarks>
internal sealed class WebSessionAllowance
{
    private readonly Lock _sync = new();
    private readonly Dictionary<string, Session> _sessions = new(StringComparer.Ordinal);

    // The same two counts as a session's, over every session.
    private long _totalReserved;
    private long _totalCommitted;

    // Whether the process-wide limit's refusal was already reported; cleared by the next request that completes.
    private bool _totalReachedReported;

    // What claims handed on to a store, and when, so what every session holds there can be bounded without asking the store.
    private readonly Queue<(long AtTicks, long Bytes)> _commits = new();
    private long _commitsBytes;

    /// <summary>
    /// Opens a claim for one request of a session, against <paramref name="limit"/> bytes for the session and
    /// <paramref name="totalLimit"/> for every session together; a total of zero or less is no process-wide limit.
    /// </summary>
    public Claim Open(string sessionId, long limit, long totalLimit = 0)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentOutOfRangeException.ThrowIfNegative(limit);

        lock (_sync)
        {
            if (!_sessions.TryGetValue(sessionId, out Session? session))
            {
                session = new Session();
                _sessions.Add(sessionId, session);
            }

            session.Claims++;

            return new Claim(this, sessionId, session, limit, totalLimit > 0 ? totalLimit : long.MaxValue);
        }
    }

    /// <summary>Lets go of bytes a claim kept past its request (<see cref="Claim.Keep"/>), once their holder lets them go.</summary>
    public void Release(string sessionId, long bytes)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        lock (_sync)
        {
            if (!_sessions.TryGetValue(sessionId, out Session? session))
                return;

            session.Reserved -= bytes;
            _totalReserved -= bytes;
            ForgetIfIdleNoLock(sessionId, session);
        }
    }

    private void ForgetIfIdleNoLock(string sessionId, Session session)
    {
        if (session.Claims == 0 && session.Reserved == 0)
            _ = _sessions.Remove(sessionId);
    }

    /// <summary>
    /// How many bytes claims handed on to a store at or after <paramref name="sinceUtc"/>: an upper bound on what the store still
    /// holds of them, when the store lets everything older go by then.
    /// </summary>
    public long CommittedSince(DateTime sinceUtc)
    {
        lock (_sync)
        {
            while (_commits.TryPeek(out (long AtTicks, long Bytes) oldest) && oldest.AtTicks < sinceUtc.Ticks)
            {
                _ = _commits.Dequeue();
                _commitsBytes -= oldest.Bytes;
            }

            return _commitsBytes;
        }
    }

    /// <summary>
    /// Answers <see langword="true"/> for the first refusal on the process-wide limit since a request last completed, so a burst
    /// of refusals is reported once rather than once a request.
    /// </summary>
    public bool ReportTotalReached()
    {
        lock (_sync)
        {
            if (_totalReachedReported)
                return false;

            _totalReachedReported = true;

            return true;
        }
    }

    internal sealed class Session
    {
        // Claimed and not handed on: bytes still arriving, or kept by the caller.
        public long Reserved;

        // Bytes handed on to a store while a claim was open; only the difference an open claim saw grow means anything.
        public long Committed;

        public int Claims;
    }

    /// <summary>One request's share of its session's allowance; disposing it lets go of whatever it neither committed nor kept.</summary>
    public sealed class Claim : IDisposable
    {
        private readonly WebSessionAllowance _owner;
        private readonly Session _session;
        private readonly long _limit;
        private readonly long _totalLimit;
        private readonly long _committedAtOpen;
        private readonly long _totalCommittedAtOpen;
        private long _heldElsewhere;
        private long _totalHeldElsewhere;
        private long _own;
        private bool _disposed;

        internal Claim(WebSessionAllowance owner, string sessionId, Session session, long limit, long totalLimit)
        {
            _owner = owner;
            SessionId = sessionId;
            _session = session;
            _limit = limit;
            _totalLimit = totalLimit;
            _committedAtOpen = session.Committed;
            _totalCommittedAtOpen = owner._totalCommitted;
        }

        /// <summary>Gets the session the claim counts against.</summary>
        public string SessionId { get; }

        /// <summary>Gets how many more bytes the session may claim now, within what the process-wide limit leaves.</summary>
        public long Remaining
        {
            get
            {
                lock (_owner._sync)
                    return Math.Min(SessionRemainingNoLock(), TotalRemainingNoLock());
            }
        }

        /// <summary>Gets whether the process-wide limit leaves less than the session's does, so it is the one a request meets.</summary>
        public bool TotalIsTighter
        {
            get
            {
                lock (_owner._sync)
                    return TotalRemainingNoLock() < SessionRemainingNoLock();
            }
        }

        /// <summary>Gets whether the last refused reservation was refused by the process-wide limit rather than the session's.</summary>
        public bool TotalRefused { get; private set; }

        // What another claim committed since this one opened may be missing from what it was told the session holds elsewhere,
        // so it counts here: a byte counted twice holds a request back, a byte missed would let one through.
        private long SessionRemainingNoLock()
            => _limit - _heldElsewhere - _session.Reserved - (_session.Committed - _committedAtOpen);

        private long TotalRemainingNoLock()
            => _totalLimit - _totalHeldElsewhere - _owner._totalReserved - (_owner._totalCommitted - _totalCommittedAtOpen);

        /// <summary>
        /// Tells the claim what the session, and every session together, hold outside this count; read after the claim opened, so
        /// nothing falls between.
        /// </summary>
        public void HoldElsewhere(long bytes, long totalBytes = 0)
        {
            lock (_owner._sync)
            {
                _heldElsewhere = bytes;
                _totalHeldElsewhere = totalBytes;
            }
        }

        /// <summary>Claims <paramref name="count"/> more bytes, or answers <see langword="false"/> when they would cross a limit.</summary>
        public bool TryReserve(long count)
        {
            lock (_owner._sync)
            {
                var session = SessionRemainingNoLock();
                var total = TotalRemainingNoLock();

                if (count > session || count > total)
                {
                    TotalRefused = total < session;
                    return false;
                }

                _session.Reserved += count;
                _owner._totalReserved += count;
                _own += count;

                return true;
            }
        }

        /// <summary>Hands what this claim holds on to the store that now keeps it, where a claim opened later reads it.</summary>
        public void Commit()
        {
            lock (_owner._sync)
            {
                _session.Reserved -= _own;
                _session.Committed += _own;
                _owner._totalReserved -= _own;
                _owner._totalCommitted += _own;
                _owner._commits.Enqueue((DateTime.UtcNow.Ticks, _own));
                _owner._commitsBytes += _own;
                _own = 0;
                _owner._totalReachedReported = false;
            }
        }

        /// <summary>
        /// Keeps what this claim holds reserved past it, and answers how many bytes, for <see cref="Release"/> when they go.
        /// </summary>
        public long Keep()
        {
            lock (_owner._sync)
            {
                var kept = _own;
                _own = 0;
                _owner._totalReachedReported = false;

                return kept;
            }
        }

        /// <inheritdoc />
        public void Dispose()
        {
            lock (_owner._sync)
            {
                if (_disposed)
                    return;

                _disposed = true;
                _session.Reserved -= _own;
                _owner._totalReserved -= _own;
                _own = 0;
                _session.Claims--;
                _owner.ForgetIfIdleNoLock(SessionId, _session);
            }
        }
    }
}
