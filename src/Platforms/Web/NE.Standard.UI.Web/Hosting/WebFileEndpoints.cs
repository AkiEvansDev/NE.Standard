using System;
using System.Collections.Generic;
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
        if (WebRequestGuards.IsCrossSiteRequest(http))
            return Results.StatusCode(StatusCodes.Status403Forbidden);

        // No session, no upload: an unscoped file is readable by any client. And none from a session the app's default policy
        // wouldn't let act, or an anonymous client could fill the store.
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

            using WebRequestGuards.LimitedStream limited = new(section.Body, application.Files.MaxFileSize);

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
}
