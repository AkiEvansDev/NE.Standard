using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The GET behind <see cref="IUIContentAddressResolver"/>: the session from the cookie, the content from the
/// application's <see cref="IUIContentProvider"/>.
/// </summary>
internal static class WebContentEndpoint
{
    /// <summary>The path content is served under, beside the file transfer endpoints; the startup gives it to <see cref="UIContentAddress"/>.</summary>
    public const string Prefix = "/_ne/content";

    public static void Map(IEndpointRouteBuilder endpoints)
    {
        ArgumentNullException.ThrowIfNull(endpoints);

        _ = endpoints.MapGet($"{Prefix}/{{**key}}", GetAsync);
    }

    private static async Task<IResult> GetAsync(HttpContext http, string key, CancellationToken cancellationToken)
    {
        UserSessionState? session = await http.GetAuthorizedUISessionAsync(cancellationToken).ConfigureAwait(false);

        if (session is null)
            return Results.Unauthorized();

        // No provider registered is no content at all, not a configuration error surfaced to the browser.
        IUIContentProvider? provider = http.RequestServices.GetService<IUIContentProvider>();

        if (provider is null || string.IsNullOrWhiteSpace(key))
            return Results.NotFound();

        UIContent? content = await provider
            .ResolveAsync(new UIContentRequest { Session = session, Key = Uri.UnescapeDataString(key) }, cancellationToken)
            .ConfigureAwait(false);

        if (content is null)
            return Results.NotFound();

        // Private: the answer depended on who asked, so no shared cache may hand it to the next person.
        http.Response.Headers.CacheControl = content.Immutable ? "private, max-age=31536000, immutable" : "private, no-cache";

        return Results.Stream(content.Content, content.ContentType, content.FileName, enableRangeProcessing: true);
    }
}
