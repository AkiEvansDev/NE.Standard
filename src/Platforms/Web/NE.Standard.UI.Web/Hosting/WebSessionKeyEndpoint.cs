using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using NE.Standard.UI.Application;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The POST a page trades a sign-in's one-time token at (<see cref="WebSessionKeys"/>), answered with the new session's cookie.
/// </summary>
/// <remarks>
/// Same origin only, as every framework POST: the cookie it writes is the session's. The request carries the cookie of the session the
/// page signed in from, which the token is bound to.
/// </remarks>
internal static class WebSessionKeyEndpoint
{
    public const string Path = "/_ne/session/key";

    // A token and its envelope: anything longer is no request this endpoint answers.
    private const int MaxBodyBytes = 1024;

    public static void Map(IEndpointRouteBuilder endpoints)
    {
        ArgumentNullException.ThrowIfNull(endpoints);

        _ = endpoints.MapPost(Path, TradeAsync).DisableAntiforgery();
    }

    private static async Task<IResult> TradeAsync(
        HttpContext http,
        [FromServices] WebSessionKeys keys,
        [FromServices] WebSessionCookie cookie,
        [FromServices] UIApplication application,
        CancellationToken cancellationToken)
    {
        if (WebRequestGuards.IsCrossSiteRequest(http))
            return Results.StatusCode(StatusCodes.Status403Forbidden);

        if (!WebRequestGuards.IsJson(http.Request.ContentType))
            return Results.StatusCode(StatusCodes.Status415UnsupportedMediaType);

        http.Response.Headers.CacheControl = "no-store";

        TradeRequest? request;
        using WebRequestGuards.LimitedStream body = new(http.Request.Body, MaxBodyBytes);

        try
        {
            request = await JsonSerializer.DeserializeAsync<TradeRequest>(body, JsonSerializerOptions.Web, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception exception) when (body.LimitExceeded && exception is not OperationCanceledException)
        {
            return WebRequestGuards.TooLarge($"A key's token is at most {MaxBodyBytes} bytes.");
        }
        catch (JsonException)
        {
            return Results.BadRequest("The body is not a token.");
        }

        // Not found whatever the reason — unknown, spent, expired, another browser's: a caller learns nothing of tokens it does not hold.
        if (keys.Redeem(request?.Token, WebClientRequest.ReadSessionId(http, cookie)) is not { } secret)
            return Results.NotFound();

        cookie.Write(http, application.Sessions, secret);

        return Results.NoContent();
    }

    private sealed class TradeRequest
    {
        public string? Token { get; init; }
    }
}
