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
        CancellationToken cancellationToken)
    {
        if (IsCrossSiteRequest(http))
            return Results.StatusCode(StatusCodes.Status403Forbidden);

        // No session, no upload: an unscoped file is one any other client could read back. And no upload from a session the
        // application's default policy would not let act, or an anonymous client could fill the store from the sign-in page.
        var sessionId = await ResolveSessionAsync(http, cancellationToken).ConfigureAwait(false);

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
    /// Refuses a cross-site upload while leaving same-origin requests, and requests carrying neither header, alone —
    /// an antiforgery token would defend this the same way, but the endpoint carries none to check.
    /// </summary>
    private static bool IsCrossSiteRequest(HttpContext http)
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
    /// The session the request presents and the default policy admits, or <see langword="null"/>.
    /// </summary>
    private static async Task<string?> ResolveSessionAsync(HttpContext http, CancellationToken cancellationToken)
    {
        UserSessionState? session = await http.GetAuthorizedUISessionAsync(cancellationToken).ConfigureAwait(false);

        return session?.SessionId;
    }

    private static async Task<IResult> DownloadAsync(
        HttpContext http,
        string token,
        [FromServices] IUIFileStore store,
        CancellationToken cancellationToken)
    {
        var sessionId = await ResolveSessionAsync(http, cancellationToken).ConfigureAwait(false);

        if (sessionId is null)
            return Results.Unauthorized();

        UIStagedDownload? staged = await store.TakeDownloadAsync(sessionId, token, cancellationToken).ConfigureAwait(false);

        // Not found rather than forbidden: telling a caller a token exists but isn't theirs is telling them it exists.
        if (staged is null)
            return Results.NotFound();

        http.Response.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
        {
            FileNameStar = staged.FileName
        }.ToString();

        return Results.Stream(staged.Content, staged.ContentType);
    }

    /// <summary>
    /// Fails the read once more than <paramref name="limit"/> bytes have gone past, without buffering to measure it.
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
