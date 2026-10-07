using System;
using System.IO;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using NE.Standard.UI.Files;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The two ways a value too large for the hub travels beside it (<c>docs/VALUES.md</c> §2): POST stages a client's value, parsed
/// like the hub would and named by a token; GET fetches a staged server value by that token.
/// </summary>
internal static partial class WebValueEndpoint
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Warning, Message = "Staged values reached the process-wide limit of {Limit} bytes (WebValueOptions.MaxStagedBytesTotal); values are refused until some are taken or expire. Refusals in this burst are not logged again.")]
        public static partial void TotalReached(ILogger logger, long limit);
    }

    public const string Path = "/_ne/values";

    /// <summary>
    /// The most a request's declared length reserves before its bytes arrive: the allowance counts bytes as they are read, so a
    /// buffer sized to a declared 16 MB would hold memory no allowance has counted while the body trickles in.
    /// </summary>
    internal const int MaxPresizeBytes = 64 * 1024;

    public static void Map(IEndpointRouteBuilder endpoints)
    {
        ArgumentNullException.ThrowIfNull(endpoints);

        _ = endpoints.MapPost(Path, StageAsync).DisableAntiforgery();
        _ = endpoints.MapGet($"{Path}/{{token}}", ReadAsync);
    }

    private static async Task<IResult> StageAsync(
        HttpContext http,
        [FromServices] WebValueStagingStore store,
        [FromServices] IOptions<WebValueOptions> options,
        [FromServices] IOptions<JsonHubProtocolOptions> hubProtocol,
        [FromServices] ILoggerFactory loggerFactory,
        CancellationToken cancellationToken)
    {
        if (WebRequestGuards.IsCrossSiteRequest(http))
            return Results.StatusCode(StatusCodes.Status403Forbidden);

        // JSON only: a text/plain body is a request any page may send without asking, and this one carries the session's cookie.
        if (!IsJsonContentType(http.Request.ContentType))
            return Results.StatusCode(StatusCodes.Status415UnsupportedMediaType);

        // The same session and policy a file upload needs: a staged value is only ever redeemed by that session's own hub.
        UserSessionState? session = await http.GetAuthorizedUISessionAsync(cancellationToken).ConfigureAwait(false);

        if (session is null)
            return Results.Unauthorized();

        var limit = options.Value.MaxValueSize;

        if (http.Request.ContentLength > limit)
            return TooLarge(limit);

        // The session's staged values, and the ones arriving beside this one, share one allowance.
        using WebSessionAllowance.Claim claim = store.Open(session.SessionId);

        if (http.Request.ContentLength > claim.Remaining || claim.Remaining <= 0)
            return Full(claim.TotalIsTighter, store, options.Value, loggerFactory);

        // The entry before its bytes: a one-byte value holds a token, a slot and an array all the same.
        if (!claim.TryReserve(UIAllowanceCharge.EntryBytes))
            return Full(claim.TotalRefused, store, options.Value, loggerFactory);

        byte[] json;
        using WebRequestGuards.LimitedStream body = new(http.Request.Body, limit, claim);

        try
        {
            json = await ReadBodyAsync(body, http.Request.ContentLength, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception exception) when (body.LimitExceeded && exception is not OperationCanceledException)
        {
            return body.AllowanceSpent ? Full(claim.TotalRefused, store, options.Value, loggerFactory) : TooLarge(limit);
        }

        // Checked here, read when the hub takes it: a body that is not JSON is this request's error, not a later hub call's.
        if (!IsJson(json, hubProtocol.Value.PayloadSerializerOptions))
            return Results.BadRequest("The body is not JSON.");

        return Results.Ok(new { token = store.Stage(claim, json) });
    }

    private static bool IsJsonContentType(string? contentType)
        => MediaTypeHeaderValue.TryParse(contentType, out MediaTypeHeaderValue? parsed)
            && parsed.MediaType.Equals("application/json", StringComparison.OrdinalIgnoreCase);

    private static IResult TooLarge(long limit)
        => WebRequestGuards.TooLarge($"A value may be at most {limit} bytes.");

    /// <summary>The session's allowance or the process's, whichever the value met: a full process is the server's state, not the request's fault.</summary>
    private static IResult Full(bool total, WebValueStagingStore store, WebValueOptions options, ILoggerFactory loggerFactory)
    {
        if (!total)
            return SessionFull(options);

        if (store.ReportTotalReached())
            Log.TotalReached(loggerFactory.CreateLogger(typeof(WebValueEndpoint)), options.MaxStagedBytesTotal ?? 0);

        return Results.Problem("The server holds as many staged values as it may; try again shortly.", statusCode: StatusCodes.Status503ServiceUnavailable);
    }

    private static IResult SessionFull(WebValueOptions options)
        => WebRequestGuards.TooLarge($"A session may have at most {options.MaxStagedBytesPerSession} bytes of values staged at once.");

    /// <summary>The whole body, sized from its declared length up to <see cref="MaxPresizeBytes"/> so a small one is read into its array once.</summary>
    private static async Task<byte[]> ReadBodyAsync(Stream body, long? contentLength, CancellationToken cancellationToken)
    {
        using MemoryStream buffer = new(InitialCapacity(contentLength));

        await body.CopyToAsync(buffer, cancellationToken).ConfigureAwait(false);

        return buffer.Length == buffer.Capacity ? buffer.GetBuffer() : buffer.ToArray();
    }

    /// <summary>The buffer a body starts in: its declared length, never more than <see cref="MaxPresizeBytes"/>.</summary>
    internal static int InitialCapacity(long? contentLength)
        => contentLength is long length and > 0 ? (int)Math.Min(length, MaxPresizeBytes) : 0;

    /// <summary>Whether the bytes are one JSON value the hub's options read, walked token by token rather than built into objects.</summary>
    private static bool IsJson(ReadOnlySpan<byte> json, JsonSerializerOptions options)
    {
        Utf8JsonReader reader = new(json, new JsonReaderOptions
        {
            AllowTrailingCommas = options.AllowTrailingCommas,
            CommentHandling = options.ReadCommentHandling,
            MaxDepth = options.MaxDepth
        });

        try
        {
            while (reader.Read())
            {
            }

            return reader.TokenType != JsonTokenType.None;
        }
        catch (JsonException)
        {
            return false;
        }
    }

    /// <summary>Serves a staged server value; <paramref name="instance"/> names the tab reading it, so its read is its own.</summary>
    private static async Task<IResult> ReadAsync(HttpContext http, string token, [FromQuery] string? instance, [FromServices] WebValueStagingStore store, CancellationToken cancellationToken)
    {
        UserSessionState? session = await http.GetAuthorizedUISessionAsync(cancellationToken).ConfigureAwait(false);

        if (session is null)
            return Results.Unauthorized();

        // Not found rather than forbidden: telling a caller a token exists but isn't theirs is telling them it exists.
        if (!store.TryRead(session.SessionId, token, instance, out var json))
            return Results.NotFound();

        http.Response.Headers.CacheControl = "no-store";

        return Results.Bytes(json, "application/json");
    }
}
