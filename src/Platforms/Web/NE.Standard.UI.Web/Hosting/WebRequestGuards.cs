using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// What the framework's own endpoints that take a body from the browser check before they read it.
/// </summary>
internal static class WebRequestGuards
{
    /// <summary>
    /// Refuses a request from any other origin; same-origin requests, a user's own navigation, and ones carrying neither header
    /// pass — an antiforgery token would defend these the same way, but none exists to check.
    /// </summary>
    /// <remarks>
    /// <c>same-site</c> is refused too: a sibling subdomain is sent the session's <c>Lax</c> cookie, and the Origin check below
    /// means the same origin — scheme, host and port, a port left out of either side read as its scheme's default.
    /// </remarks>
    public static bool IsCrossSiteRequest(HttpContext http)
    {
        var secFetchSite = http.Request.Headers["Sec-Fetch-Site"].ToString();

        if (!string.IsNullOrEmpty(secFetchSite))
        {
            return !string.Equals(secFetchSite, "same-origin", StringComparison.OrdinalIgnoreCase)
                && !string.Equals(secFetchSite, "none", StringComparison.OrdinalIgnoreCase);
        }

        var origin = http.Request.Headers.Origin.ToString();

        if (string.IsNullOrEmpty(origin))
            return false;

        HostString host = http.Request.Host;

        // Host and port apart, not the raw Host header: a browser drops a default port from Origin that a client may still send.
        return !Uri.TryCreate(origin, UriKind.Absolute, out Uri? originUri)
            || !string.Equals(originUri.Scheme, http.Request.Scheme, StringComparison.OrdinalIgnoreCase)
            || !string.Equals(originUri.Host, host.Host, StringComparison.OrdinalIgnoreCase)
            || originUri.Port != (host.Port ?? DefaultPort(http.Request.Scheme));
    }

    private static int DefaultPort(string scheme)
        => string.Equals(scheme, Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase) ? 443 : 80;

    /// <summary>One answer for every size limit — a file's, a session's, a staged value's — so a client reads one status.</summary>
    public static IResult TooLarge(string detail)
        => Results.Problem(detail, statusCode: StatusCodes.Status413PayloadTooLarge);

    /// <summary>
    /// Fails the read once more than <paramref name="limit"/> bytes have gone past, or once <paramref name="claim"/> cannot take
    /// the bytes that arrived, without buffering to measure it.
    /// </summary>
    /// <remarks>
    /// A refusal is an ordinary exception out of whatever reads the stream, which may wrap it; a caller tells it from any other
    /// failure by <see cref="LimitExceeded"/>, never by the exception's type.
    /// </remarks>
    public sealed class LimitedStream(Stream inner, long limit, WebSessionAllowance.Claim? claim = null) : Stream
    {
        private long _read;

        /// <summary>Gets whether a read was refused, on <c>limit</c> or on the allowance.</summary>
        public bool LimitExceeded { get; private set; }

        /// <summary>Gets whether the read failed on the session's allowance rather than on <c>limit</c>.</summary>
        public bool AllowanceSpent { get; private set; }

        public override bool CanRead => true;
        public override bool CanSeek => false;
        public override bool CanWrite => false;
        public override long Length => throw new NotSupportedException();

        public override long Position
        {
            get => _read;
            set => throw new NotSupportedException();
        }

        public override async ValueTask<int> ReadAsync(Memory<byte> buffer, CancellationToken cancellationToken = default)
        {
            var count = await inner.ReadAsync(buffer, cancellationToken).ConfigureAwait(false);

            Track(count);

            return count;
        }

        // The base class runs this overload as a synchronous Read on the pool, which a request body refuses.
        public override Task<int> ReadAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
            => ReadAsync(buffer.AsMemory(offset, count), cancellationToken).AsTask();

        public override int Read(byte[] buffer, int offset, int count)
        {
            var read = inner.Read(buffer, offset, count);

            Track(read);

            return read;
        }

        private void Track(int count)
        {
            _read += count;

            if (_read > limit)
            {
                LimitExceeded = true;
                throw new InvalidOperationException($"The body exceeds the {limit} byte limit.");
            }

            if (claim is not null && !claim.TryReserve(count))
            {
                LimitExceeded = true;
                AllowanceSpent = true;
                throw new InvalidOperationException("The body exceeds what is left of the allowance.");
            }
        }

        public override void Flush()
            => throw new NotSupportedException();

        public override long Seek(long offset, SeekOrigin origin)
            => throw new NotSupportedException();

        public override void SetLength(long value)
            => throw new NotSupportedException();

        public override void Write(byte[] buffer, int offset, int count)
            => throw new NotSupportedException();
    }
}
