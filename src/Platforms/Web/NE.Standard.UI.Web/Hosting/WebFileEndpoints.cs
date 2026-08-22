using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;
using NE.Standard.UI.Application;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The HTTP half of file transfer: a multipart upload endpoint and a single-use download endpoint.
/// </summary>
/// <remarks>
/// HTTP rather than the hub, because the hub carries the interface and a large transfer sharing it stalls
/// everything else — see <c>docs/FILES.md</c>. Both endpoints take their identity from the same session cookie
/// the shell render writes, resolved against <see cref="IUserSessionStore"/>, so a transfer is bound to a live
/// session the way a page request is.
/// </remarks>
internal static class WebFileEndpoints
{
    public const string Prefix = "/_ne/files";

    public static void Map(IEndpointRouteBuilder endpoints)
    {
        ArgumentNullException.ThrowIfNull(endpoints);

        _ = endpoints.MapPost($"{Prefix}/upload", UploadAsync).DisableAntiforgery();
        _ = endpoints.MapGet($"{Prefix}/{{token}}", DownloadAsync);
    }

    /// <summary>
    /// Reads a multipart body one part at a time, so an oversized file is refused while it is still arriving
    /// rather than after it has been buffered.
    /// </summary>
    private static async Task<IResult> UploadAsync(
        HttpContext http,
        [FromServices] UIApplication application,
        [FromServices] IUIFileStore store,
        [FromServices] IUserSessionStore sessions,
        CancellationToken cancellationToken)
    {
        // No session, no upload: without one there is nothing to scope the stored file to, and an unscoped
        // file is one any other client could read back.
        var sessionId = await ResolveSessionAsync(http, application, sessions, cancellationToken).ConfigureAwait(false);

        if (sessionId is null)
            return Results.Unauthorized();

        if (!MediaTypeHeaderValue.TryParse(http.Request.ContentType, out MediaTypeHeaderValue? contentType)
            || !contentType.MediaType.HasValue
            || !contentType.MediaType.Value.StartsWith("multipart/", StringComparison.OrdinalIgnoreCase))
        {
            return Results.BadRequest("Expected a multipart request.");
        }

        var boundary = HeaderUtilities.RemoveQuotes(contentType.Boundary).Value;

        if (string.IsNullOrWhiteSpace(boundary))
            return Results.BadRequest("Multipart boundary is missing.");

        var selectionId = Guid.NewGuid().ToString("N");
        List<UIUploadFile> files = [];

        MultipartReader reader = new(boundary, http.Request.Body);

        for (MultipartSection? section = await reader.ReadNextSectionAsync(cancellationToken).ConfigureAwait(false);
            section is not null;
            section = await reader.ReadNextSectionAsync(cancellationToken).ConfigureAwait(false))
        {
            if (!ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out ContentDispositionHeaderValue? disposition)
                || !disposition.FileName.HasValue)
            {
                continue;
            }

            if (files.Count == application.Files.MaxFilesPerSelection)
                return Results.BadRequest($"A selection carries at most {application.Files.MaxFilesPerSelection} files.");

            var fileName = HeaderUtilities.RemoveQuotes(disposition.FileName).Value;

            if (string.IsNullOrWhiteSpace(fileName))
                continue;

            using LimitedStream limited = new(section.Body, application.Files.MaxFileSize);

            UIUploadFile file;

            try
            {
                file = await store
                    .SaveUploadAsync(sessionId, selectionId, fileName, section.ContentType, limited, cancellationToken)
                    .ConfigureAwait(false);
            }
            catch (InvalidOperationException)
            {
                return Results.BadRequest($"A file may be at most {application.Files.MaxFileSize} bytes.");
            }

            files.Add(file);
        }

        return files.Count == 0
            ? Results.BadRequest("The request carried no files.")
            : Results.Ok(new
            {
                selectionId,
                files = files.ConvertAll(static file => new
                {
                    fileId = file.FileId,
                    fileName = file.FileName,
                    contentType = file.ContentType,
                    size = file.Size
                })
            });
    }

    /// <summary>
    /// The session the request presents, or <see langword="null"/> when it presents none the store knows.
    /// </summary>
    /// <remarks>
    /// The cookie is a claim, not a session: taking its value on trust let any caller invent an id and store
    /// files under it, with no session to sweep them with and no limit but the disk. An idle session counts as
    /// absent for the same reason <c>StoredUserSessionResolver</c> treats it so — an expired identity must not
    /// come back to life in the window between cleanup sweeps.
    /// </remarks>
    private static async Task<string?> ResolveSessionAsync(HttpContext http, UIApplication application, IUserSessionStore sessions, CancellationToken cancellationToken)
    {
        var sessionId = WebEndpointRouteBuilderExtensions.ReadSessionCookie(http, application.Sessions);

        if (string.IsNullOrWhiteSpace(sessionId))
            return null;

        UserSessionState? stored = await sessions.TryGetAsync(sessionId, cancellationToken).ConfigureAwait(false);

        if (stored is null || stored.LastSeenAtUtc + application.Sessions.IdleTimeout <= DateTime.UtcNow)
            return null;

        return sessionId;
    }

    private static async Task<IResult> DownloadAsync(
        HttpContext http,
        string token,
        [FromServices] UIApplication application,
        [FromServices] IUIFileStore store,
        [FromServices] IUserSessionStore sessions,
        CancellationToken cancellationToken)
    {
        var sessionId = await ResolveSessionAsync(http, application, sessions, cancellationToken).ConfigureAwait(false);

        if (sessionId is null)
            return Results.Unauthorized();

        UIStagedDownload? staged = await store.TakeDownloadAsync(sessionId, token, cancellationToken).ConfigureAwait(false);

        // Not found rather than forbidden for a token belonging to someone else: telling a caller that a token
        // exists but is not theirs is telling them it exists.
        if (staged is null)
            return Results.NotFound();

        http.Response.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
        {
            FileNameStar = staged.FileName
        }.ToString();

        return Results.Stream(staged.Content, staged.ContentType);
    }

    /// <summary>
    /// Fails the read once more than <paramref name="limit"/> bytes have gone past, which is what makes the
    /// size limit hold without buffering the part to measure it.
    /// </summary>
    private sealed class LimitedStream(Stream inner, long limit) : Stream
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
                throw new InvalidOperationException($"The file exceeds the {limit} byte limit.");
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
