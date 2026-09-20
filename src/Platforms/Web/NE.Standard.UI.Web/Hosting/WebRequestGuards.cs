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
    /// Refuses a cross-site request; same-origin requests, and ones carrying neither header, pass — an antiforgery token would
    /// defend these the same way, but none exists to check.
    /// </summary>
    public static bool IsCrossSiteRequest(HttpContext http)
    {
        var secFetchSite = http.Request.Headers["Sec-Fetch-Site"].ToString();

        if (!string.IsNullOrEmpty(secFetchSite))
            return string.Equals(secFetchSite, "cross-site", StringComparison.OrdinalIgnoreCase);

        var origin = http.Request.Headers["Origin"].ToString();

        if (string.IsNullOrEmpty(origin))
            return false;

        return !Uri.TryCreate(origin, UriKind.Absolute, out Uri? originUri)
            || !string.Equals(originUri.Scheme, http.Request.Scheme, StringComparison.OrdinalIgnoreCase)
            || !string.Equals(originUri.Authority, http.Request.Host.Value, StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Fails the read once more than <paramref name="limit"/> bytes have gone past, without buffering to measure it.
    /// </summary>
    public sealed class LimitedStream(Stream inner, long limit) : Stream
    {
        private long _read;

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
                throw new InvalidOperationException($"The body exceeds the {limit} byte limit.");
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
