using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The two ways a value too large for the hub travels beside it (<c>docs/VALUES.md</c> §2): POST stages a client's value, parsed
/// like the hub would and named by a token; GET fetches a staged server value by that token.
/// </summary>
internal static class WebValueEndpoint
{
    public const string Path = "/_ne/values";

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
        CancellationToken cancellationToken)
    {
        if (WebRequestGuards.IsCrossSiteRequest(http))
            return Results.StatusCode(StatusCodes.Status403Forbidden);

        // The same session and policy a file upload needs: a staged value is only ever redeemed by that session's own hub.
        UserSessionState? session = await http.GetAuthorizedUISessionAsync(cancellationToken).ConfigureAwait(false);

        if (session is null)
            return Results.Unauthorized();

        var limit = options.Value.MaxValueSize;

        if (http.Request.ContentLength > limit)
            return Results.StatusCode(StatusCodes.Status413PayloadTooLarge);

        object? value;

        try
        {
            using WebRequestGuards.LimitedStream body = new(http.Request.Body, limit);

            // The hub's own options, converters included, so the runtime cannot tell this value from one that came inline.
            value = await JsonSerializer
                .DeserializeAsync<object?>(body, hubProtocol.Value.PayloadSerializerOptions, cancellationToken)
                .ConfigureAwait(false);
        }
        catch (InvalidOperationException)
        {
            return Results.StatusCode(StatusCodes.Status413PayloadTooLarge);
        }
        catch (JsonException)
        {
            return Results.BadRequest("The body is not JSON.");
        }

        return Results.Ok(new { token = store.Stage(session.SessionId, value) });
    }

    private static async Task<IResult> ReadAsync(HttpContext http, string token, [FromServices] WebValueStagingStore store, CancellationToken cancellationToken)
    {
        UserSessionState? session = await http.GetAuthorizedUISessionAsync(cancellationToken).ConfigureAwait(false);

        if (session is null)
            return Results.Unauthorized();

        // Not found rather than forbidden: telling a caller a token exists but isn't theirs is telling them it exists.
        if (!store.TryRead(session.SessionId, token, out var json))
            return Results.NotFound();

        http.Response.Headers.CacheControl = "no-store";

        return Results.Bytes(json, "application/json");
    }
}
