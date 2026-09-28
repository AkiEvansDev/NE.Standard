using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using NE.Standard.UI.Application;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The HTTP half of file transfer: a multipart upload endpoint and a single-use download endpoint.
/// </summary>
internal static partial class WebFileEndpoints
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Debug, Message = "Stored an upload of {Count} file(s), {Bytes} bytes, in {ElapsedMs:F1} ms.")]
        public static partial void Uploaded(ILogger logger, int count, long bytes, double elapsedMs);

        [LoggerMessage(EventId = 2, Level = LogLevel.Debug, Message = "Serving a download of {Bytes} bytes.")]
        public static partial void Downloading(ILogger logger, long bytes);

        [LoggerMessage(EventId = 3, Level = LogLevel.Warning, Message = "Uploads reached the process-wide limit of {Limit} bytes (UIFileOptions.MaxUploadBytesTotal); uploads are refused until the store lets some go. Refusals in this burst are not logged again.")]
        public static partial void TotalReached(ILogger logger, long limit);
    }

    public const string Prefix = "/_ne/files";

    /// <summary>What a multipart body carries beyond its files — boundaries and part headers — allowed over their sizes.</summary>
    private const long MultipartOverheadBytes = 1024 * 1024;

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
        [FromServices] WebSessionAllowance uploads,
        [FromServices] WebUIMetrics metrics,
        [FromServices] ILoggerFactory loggerFactory,
        CancellationToken cancellationToken)
    {
        var started = Stopwatch.GetTimestamp();

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

        UIFileOptions limits = application.Files;

        // Bytes count as they arrive, against what the session holds and what its other uploads are still sending, so parallel
        // requests share the allowance rather than each reading it whole; and against what every session holds and sends.
        using WebSessionAllowance.Claim claim = uploads.Open(sessionId, limits.MaxUploadBytesPerSession, limits.MaxUploadBytesTotal ?? 0);

        // The store answers what one session holds but not what all of them do; every upload this process stored within the
        // retention, and the sweep's interval after it, bounds that from above.
        var storedSince = uploads.CommittedSince(DateTime.UtcNow - limits.UploadRetention - limits.CleanupInterval);

        claim.HoldElsewhere(await store.GetUploadedBytesAsync(sessionId, cancellationToken).ConfigureAwait(false), storedSince);

        var remaining = claim.Remaining;

        if (remaining <= 0)
            return Full(claim.TotalIsTighter, limits, uploads, loggerFactory);

        // Kestrel's own limit, 30 MB by default, sits below a file the options allow and fails the read with an exception rather
        // than the 413 below; raised to what this request may carry at most, the limits a client meets are the ones here.
        IHttpMaxRequestBodySizeFeature? bodyLimit = http.Features.Get<IHttpMaxRequestBodySizeFeature>();

        if (bodyLimit is { IsReadOnly: false })
            bodyLimit.MaxRequestBodySize = Math.Min(remaining, SelectionBytes(limits)) + MultipartOverheadBytes;

        var selectionId = Guid.NewGuid().ToString("N");
        List<UIUploadFile> files = [];
        var answered = false;

        try
        {
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

                if (files.Count == limits.MaxFilesPerSelection)
                    return Results.BadRequest($"A selection carries at most {limits.MaxFilesPerSelection} files.");

                var fileName = HeaderUtilities.RemoveQuotes(disposition.FileName).Value;

                if (string.IsNullOrWhiteSpace(fileName))
                    continue;

                using WebRequestGuards.LimitedStream limited = new(section.Body, limits.MaxFileSize, claim);

                UIUploadFile file;

                try
                {
                    file = await store
                        .SaveUploadAsync(sessionId, selectionId, fileName, section.ContentType, limited, cancellationToken)
                        .ConfigureAwait(false);
                }
                catch (Exception exception) when (limited.LimitExceeded && exception is not OperationCanceledException)
                {
                    // Told by the stream, not by the exception's type: a store's own failure is its error, not a size limit.
                    return limited.AllowanceSpent
                        ? Full(claim.TotalRefused, limits, uploads, loggerFactory)
                        : WebRequestGuards.TooLarge($"A file may be at most {limits.MaxFileSize} bytes.");
                }

                files.Add(file);
            }

            if (files.Count == 0)
                return Results.BadRequest("The request carried no files.");

            // Handed on once the whole selection is kept, not per file: a selection refused part-way takes its files back out of
            // the store, and bytes committed for them would count against the process-wide limit for the whole retention. Until
            // then a claim opened beside this one counts a stored file twice, which only holds it back.
            claim.Commit();
            answered = true;

            long bytes = 0;

            foreach (UIUploadFile file in files)
                bytes += file.Size;

            TimeSpan elapsed = Stopwatch.GetElapsedTime(started);
            ILogger logger = loggerFactory.CreateLogger(typeof(WebFileEndpoints));

            metrics.FileUploaded(bytes);
            Log.Uploaded(logger, files.Count, bytes, elapsed.TotalMilliseconds);

            return Results.Ok(new
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
        finally
        {
            // A selection that failed part-way was never answered, so nothing can name its files: they go now, not at the sweep.
            if (!answered && files.Count > 0)
                await store.RemoveSelectionAsync(sessionId, selectionId, CancellationToken.None).ConfigureAwait(false);
        }
    }

    /// <summary>
    /// The session the request presents and the default policy admits, or <see langword="null"/>.
    /// </summary>
    private static async Task<string?> ResolveSessionAsync(HttpContext http, CancellationToken cancellationToken)
    {
        UserSessionState? session = await http.GetAuthorizedUISessionAsync(cancellationToken).ConfigureAwait(false);

        return session?.SessionId;
    }

    /// <summary>The session's limit or the process's, whichever the upload met; the process's is reported once a burst.</summary>
    private static IResult Full(bool total, UIFileOptions limits, WebSessionAllowance uploads, ILoggerFactory loggerFactory)
    {
        if (!total)
            return WebRequestGuards.TooLarge($"A session may hold at most {limits.MaxUploadBytesPerSession} bytes of uploads at once.");

        if (uploads.ReportTotalReached())
            Log.TotalReached(loggerFactory.CreateLogger(typeof(WebFileEndpoints)), limits.MaxUploadBytesTotal ?? 0);

        return WebRequestGuards.TooLarge("The server holds as many uploads as it may; try again later.");
    }

    // Saturated rather than multiplied blind: a limit set as high as it goes must not wrap to a negative body size.
    private static long SelectionBytes(UIFileOptions limits)
        => limits.MaxFileSize > long.MaxValue / limits.MaxFilesPerSelection ? long.MaxValue - MultipartOverheadBytes : limits.MaxFileSize * limits.MaxFilesPerSelection;

    private static async Task<IResult> DownloadAsync(
        HttpContext http,
        string token,
        [FromServices] IUIFileStore store,
        [FromServices] IOptions<WebEndpointOptions> options,
        [FromServices] WebUIMetrics metrics,
        [FromServices] ILoggerFactory loggerFactory,
        CancellationToken cancellationToken)
    {
        var sessionId = await ResolveSessionAsync(http, cancellationToken).ConfigureAwait(false);

        if (sessionId is null)
            return Results.Unauthorized();

        UIStagedDownload? staged = await store.TakeDownloadAsync(sessionId, token, cancellationToken).ConfigureAwait(false);

        // Not found rather than forbidden: telling a caller a token exists but isn't theirs is telling them it exists.
        if (staged is null)
            return Results.NotFound();

        // One fetch of one session's file: nothing between here and the browser may keep a copy.
        http.Response.Headers.CacheControl = "no-store";
        http.Response.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
        {
            FileNameStar = staged.FileName
        }.ToString();

        if (options.Value.InertContent)
            WebInertContent.Apply(http.Response, staged.ContentType);

        // A stream that cannot say its length is counted as nothing rather than read twice.
        var bytes = staged.Content.CanSeek ? staged.Content.Length : 0;

        ILogger logger = loggerFactory.CreateLogger(typeof(WebFileEndpoints));

        metrics.FileDownloaded(bytes);
        Log.Downloading(logger, bytes);

        return Results.Stream(staged.Content, staged.ContentType);
    }
}
