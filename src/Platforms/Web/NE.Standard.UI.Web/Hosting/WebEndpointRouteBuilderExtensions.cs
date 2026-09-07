using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Application;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Web.Abstractions.Assets;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Hosting;

public static partial class WebEndpointRouteBuilderExtensions
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Information, Message = "Rendering web UI route '{Route}'.")]
        public static partial void Rendering(ILogger logger, string route);

        [LoggerMessage(EventId = 2, Level = LogLevel.Warning, Message = "Response compression is switched on but this host does not accept middleware here; call UseResponseCompression() yourself.")]
        public static partial void CompressionNotInstalled(ILogger logger);
    }

    public static Task<IEndpointRouteBuilder> MapStandardUIWebAsync(this IEndpointRouteBuilder endpoints, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(endpoints);

        cancellationToken.ThrowIfCancellationRequested();

        // The framework's own page, asset, file and content responses all sit behind this filter; the hub is a
        // different kind of endpoint and carries no body a browser could sniff.
        RouteGroupBuilder group = endpoints.MapGroup(string.Empty).AddEndpointFilter(AddNoSniffHeaderAsync);

        MapAssets(group);

        WebFileEndpoints.Map(group);
        WebContentEndpoint.Map(group);

        UseResponseCompression(endpoints);

        WebEndpointOptions options = endpoints.ServiceProvider.GetRequiredService<IOptions<WebEndpointOptions>>().Value;

        RequireAuthorization(endpoints.MapHub<WebUIHub>("/_ui/hub"), options);
        RequireAuthorization(group.MapGet("/{**route}", RenderAsync), options);

        return Task.FromResult(endpoints);
    }

    /// <summary>
    /// A framework response never leaves sniffing to the browser: the content type it declares is the one it means.
    /// </summary>
    private static async ValueTask<object?> AddNoSniffHeaderAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        context.HttpContext.Response.Headers["X-Content-Type-Options"] = "nosniff";
        return await next(context).ConfigureAwait(false);
    }

    /// <summary>
    /// Installs the compression middleware in front of everything this call maps — see <see cref="WebResponseCompressionOptions"/>.
    /// </summary>
    private static void UseResponseCompression(IEndpointRouteBuilder endpoints)
    {
        if (!endpoints.ServiceProvider.GetRequiredService<IOptions<WebResponseCompressionOptions>>().Value.Enabled)
            return;

        ILogger logger = endpoints.ServiceProvider.GetRequiredService<ILoggerFactory>()
            .CreateLogger(typeof(WebEndpointRouteBuilderExtensions));

        if (endpoints is IApplicationBuilder application)
            _ = application.UseResponseCompression();
        else
            Log.CompressionNotInstalled(logger);
    }

    private static void MapAssets(IEndpointRouteBuilder endpoints)
    {
        IWebAssetRegistry assets = endpoints.ServiceProvider.GetRequiredService<IWebAssetRegistry>();

        foreach (WebAssetDescriptor asset in assets.Assets)
        {
            if (asset.SourceKind == UIWebAssetSourceKind.Url)
                continue;

            if (string.IsNullOrWhiteSpace(asset.PublicPath))
                continue;

            _ = endpoints.MapGet(asset.PublicPath, (HttpContext http) => ServeAsset(http, asset));
        }
    }

    /// <summary>
    /// The outer gate, opt-in per <see cref="WebEndpointOptions.RequireAuthorization"/>; assets and file endpoints are left alone.
    /// </summary>
    private static void RequireAuthorization(IEndpointConventionBuilder endpoint, WebEndpointOptions options)
    {
        if (!options.RequireAuthorization)
            return;

        if (string.IsNullOrWhiteSpace(options.AuthorizationPolicy))
            _ = endpoint.RequireAuthorization();
        else
            _ = endpoint.RequireAuthorization(options.AuthorizationPolicy);
    }
    /// <summary>
    /// A request naming the current version is cached for good; one naming none, or an old one, revalidates by
    /// ETag every time — the font a stylesheet reaches is the case, and a 304 is what keeps its glyphs from
    /// blinking on every navigation.
    /// </summary>
    private static IResult ServeAsset(HttpContext http, WebAssetDescriptor asset)
    {
        var version = asset.ResolveVersion();
        var etag = string.Create(CultureInfo.InvariantCulture, $"\"{version}\"");
        var versioned = string.Equals(http.Request.Query["v"].ToString(), version, StringComparison.Ordinal);

        http.Response.Headers.ETag = etag;
        http.Response.Headers.CacheControl = versioned ? "public, max-age=31536000, immutable" : "public, no-cache";

        if (!versioned && http.Request.Headers.IfNoneMatch.Count > 0 && http.Request.Headers.IfNoneMatch.ToString().Contains(etag, StringComparison.Ordinal))
            return Results.StatusCode(StatusCodes.Status304NotModified);

        return Results.File(asset.Open(), ResolveContentType(asset.Kind), enableRangeProcessing: false);
    }

    private static string ResolveContentType(UIWebAssetKind kind)
        => kind switch
        {
            UIWebAssetKind.Css => "text/css",
            UIWebAssetKind.JavaScript => "application/javascript",
            UIWebAssetKind.HeadScript => "application/javascript",
            UIWebAssetKind.TypeScript => "application/javascript",
            UIWebAssetKind.Less => "text/css",
            UIWebAssetKind.Font => "font/woff2",
            _ => "application/octet-stream"
        };

    private static async Task<IResult> RenderAsync(
        string? route,
        HttpContext http,
        [FromServices] UIApplication application,
        [FromServices] IUIHost host,
        [FromServices] IWebAssetRegistry assets,
        [FromServices] IWebViewRenderer renderer,
        [FromServices] IWebViewRenderCache renderCache,
        [FromServices] IEnumerable<IUIStringsSource> packageStrings,
        [FromServices] ILoggerFactory loggerFactory,
        CancellationToken cancellationToken)
    {
        route = UIRoutePath.Normalize(route);

        ILogger logger = loggerFactory.CreateLogger(typeof(WebEndpointRouteBuilderExtensions));

        Log.Rendering(logger, route);

        if (IsSystemRoute(route))
            return Results.NotFound();

        UINavigationRequest navigation = new()
        {
            Route = route,
            Parameters = CreateParameters(http.Request.Query)
        };

        UserSessionInitData session = CreateSession(http, application.Sessions, clientWindowId: null);

        UIViewResolution resolution = await host.ResolveViewAsync(
            navigation,
            session,
            UIViewRequestPhase.Open,
            cancellationToken
        ).ConfigureAwait(false);

        // The shell render is the only half of a page load that can write a header, so a new session id is set here.
        AppendSessionCookie(http, application.Sessions, session.SessionId, resolution.Session.SessionId);

        WebCachedViewRender shape = await GetOrRenderViewAsync(
            resolution,
            renderer,
            renderCache,
            cancellationToken
        ).ConfigureAwait(false);

        WebHydration hydration = await WebHydration
            .PrepareAsync(host, resolution, shape, http.RequestAborted)
            .ConfigureAwait(false);

        // The shared shape carries no bound value; a page with a controller is rendered again with this session's own so the
        // browser gets the finished page, not an empty frame.
        WebCachedViewRender page = hydration.Values is null
            ? shape
            : RenderView(resolution, renderer, hydration.Values);

        WebShellContext shell = new()
        {
            ThemeMode = resolution.Session.ThemeMode,
            Theme = application.Theme,
            Assets = assets.Assets,
            Language = resolution.Session.Language,
            Content = page.Html,
            NotificationPlacement = resolution.View.Options.NotificationPlacement,
            ScrollContentOnly = resolution.View.Options.ScrollContentOnly,
            MetadataJson = page.MetadataJson,
            Strings = UIStrings.Resolve(application.Translator, resolution.Session.Language, packageStrings),
            HydrationJson = hydration.Json
        };

        return Results.Content(WebShellRenderer.Render(shell), "text/html");
    }

    private static bool IsSystemRoute(string route)
        => route.StartsWith("/.well-known/", StringComparison.Ordinal)
        || route.StartsWith($"{WebFileEndpoints.Prefix}/", StringComparison.Ordinal)
        || route.StartsWith($"{WebContentEndpoint.Prefix}/", StringComparison.Ordinal)
        || route.Equals("/favicon.ico", StringComparison.Ordinal);

    private static Dictionary<string, object?>? CreateParameters(IQueryCollection query)
    {
        if (query.Count == 0)
            return null;

        Dictionary<string, object?> parameters = new(StringComparer.Ordinal);

        foreach (KeyValuePair<string, StringValues> pair in query)
        {
            parameters[pair.Key] = pair.Value.Count switch
            {
                0 => null,
                1 => pair.Value[0],
                _ => pair.Value.ToArray()
            };
        }

        return parameters;
    }

    private static UserSessionInitData CreateSession(HttpContext http, UISessionOptions options, string? clientWindowId)
        => new()
        {
            SessionId = ReadSessionCookie(http, options),
            ConnectionId = http.Connection.Id,
            ClientWindowId = clientWindowId,
            Credential = http.User.Identity?.IsAuthenticated == true ? http.User.Identity.Name : null,
            Principal = http.User
        };

    internal static string? ReadSessionCookie(HttpContext http, UISessionOptions options)
        => http.Request.Cookies.TryGetValue(options.ClientKey, out var sessionId) && !string.IsNullOrWhiteSpace(sessionId)
            ? sessionId
            : null;

    private static void AppendSessionCookie(HttpContext http, UISessionOptions options, string? presentedSessionId, string resolvedSessionId)
    {
        // A lifetime counts from the last page load, so the cookie is written again on every one; without a lifetime, only a new id is.
        if (options.ClientKeyLifetime is null && string.Equals(presentedSessionId, resolvedSessionId, StringComparison.Ordinal))
            return;

        http.Response.Cookies.Append(options.ClientKey, resolvedSessionId, new CookieOptions
        {
            HttpOnly = true,
            IsEssential = true,
            SameSite = SameSiteMode.Lax,
            Secure = http.Request.IsHttps,
            Path = "/",
            MaxAge = options.ClientKeyLifetime
        });
    }

    internal static async ValueTask<WebCachedViewRender> GetOrRenderViewAsync(UIViewResolution resolution, IWebViewRenderer renderer, IWebViewRenderCache renderCache, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(resolution);
        ArgumentNullException.ThrowIfNull(renderer);
        ArgumentNullException.ThrowIfNull(renderCache);

        var key = WebViewCacheKeys.Create(resolution);

        WebCachedViewRender? cached = await renderCache.GetRenderAsync(key, cancellationToken).ConfigureAwait(false);

        if (cached is not null)
            return cached;

        WebCachedViewRender render = RenderView(resolution, renderer);

        await renderCache.SetRenderAsync(key, render, cancellationToken).ConfigureAwait(false);

        return render;
    }

    private static WebCachedViewRender RenderView(UIViewResolution resolution, IWebViewRenderer renderer, IWebRenderValues? values = null)
    {
        WebRenderResult render = renderer.Render(resolution, values);

        int[] initBindingIds = [.. render.Metadata.InitBindingIds.Select(static bindingId => bindingId.Value)];

        WebCachedViewRender cached = new()
        {
            Html = RenderToString(render.Content),
            MetadataJson = WebShellRenderer.SerializeMetadata(render.Metadata),
            InitBindingIds = initBindingIds
        };

        cached.Validate();

        return cached;
    }

    private static string RenderToString(IHtmlContent content)
    {
        ArgumentNullException.ThrowIfNull(content);

        using StringWriter writer = new();
        content.WriteTo(writer);
        return writer.ToString();
    }
}
