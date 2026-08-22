using System;
using System.Collections.Generic;
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
    }

    public static Task<IEndpointRouteBuilder> MapStandardUIWebAsync(this IEndpointRouteBuilder endpoints, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(endpoints);

        cancellationToken.ThrowIfCancellationRequested();

        MapAssets(endpoints);

        WebFileEndpoints.Map(endpoints);

        WebEndpointOptions options = endpoints.ServiceProvider.GetRequiredService<IOptions<WebEndpointOptions>>().Value;

        RequireAuthorization(endpoints.MapHub<WebUIHub>("/_ui/hub"), options);
        RequireAuthorization(endpoints.MapGet("/{**route}", RenderAsync), options);

        return Task.FromResult(endpoints);
    }

    /// <summary>
    /// The outer gate, opt-in: the framework's own rules decide per route and per command, and they are the
    /// ones that know an anonymous page when they see one — so this is off unless an application is entirely
    /// behind a login. Assets and the file endpoints are left alone: the first are static, the second carry
    /// their own session check.
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

    private static void MapAssets(IEndpointRouteBuilder endpoints)
    {
        IWebAssetRegistry assets = endpoints.ServiceProvider.GetRequiredService<IWebAssetRegistry>();

        foreach (WebAssetDescriptor asset in assets.Assets)
        {
            if (asset.SourceKind == UIWebAssetSourceKind.Url)
                continue;

            if (string.IsNullOrWhiteSpace(asset.PublicPath))
                continue;

            _ = endpoints.MapGet(asset.PublicPath, () =>
            {
                Stream stream = asset.Open();

                return Results.File(
                    stream,
                    ResolveContentType(asset.Kind),
                    enableRangeProcessing: false
                );
            });
        }
    }

    private static string ResolveContentType(UIWebAssetKind kind)
        => kind switch
        {
            UIWebAssetKind.Css => "text/css",
            UIWebAssetKind.JavaScript => "application/javascript",
            UIWebAssetKind.TypeScript => "application/javascript",
            UIWebAssetKind.Less => "text/css",
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

        UserSessionInitData session = CreateSession(http, application.Sessions, clientTabId: null);

        UIViewResolution resolution = await host.ResolveViewAsync(
            navigation,
            session,
            UIViewRequestPhase.ShellRender,
            cancellationToken
        ).ConfigureAwait(false);

        // The shell render is the only half of a page load that can write a header, so this is where a new
        // session id reaches the browser — the hub then reads the same cookie off its own negotiate request.
        AppendSessionCookie(http, application.Sessions, session.SessionId, resolution.Session.SessionId);

        WebCachedViewRender render = await GetOrRenderViewAsync(
            resolution,
            renderer,
            renderCache,
            cancellationToken
        ).ConfigureAwait(false);

        WebShellContext shell = new()
        {
            ThemeMode = resolution.Session.ThemeMode,
            Theme = application.Theme,
            Assets = assets.Assets,
            Language = resolution.Session.Language,
            Content = render.Html,
            NotificationPlacement = resolution.View.Options.NotificationPlacement,
            MetadataJson = render.MetadataJson
        };

        return Results.Content(WebShellRenderer.Render(shell), "text/html");
    }

    private static bool IsSystemRoute(string route)
        => route.StartsWith("/.well-known/", StringComparison.Ordinal)
        || route.StartsWith($"{WebFileEndpoints.Prefix}/", StringComparison.Ordinal)
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

    private static UserSessionInitData CreateSession(HttpContext http, UISessionOptions options, string? clientTabId)
        => new()
        {
            SessionId = ReadSessionCookie(http, options),
            ConnectionId = http.Connection.Id,
            ClientTabId = clientTabId,
            Credential = http.User.Identity?.IsAuthenticated == true ? http.User.Identity.Name : null,
            Principal = http.User
        };

    internal static string? ReadSessionCookie(HttpContext http, UISessionOptions options)
        => http.Request.Cookies.TryGetValue(options.ClientKey, out var sessionId) && !string.IsNullOrWhiteSpace(sessionId)
            ? sessionId
            : null;

    private static void AppendSessionCookie(HttpContext http, UISessionOptions options, string? presentedSessionId, string resolvedSessionId)
    {
        if (string.Equals(presentedSessionId, resolvedSessionId, StringComparison.Ordinal))
            return;

        http.Response.Cookies.Append(options.ClientKey, resolvedSessionId, new CookieOptions
        {
            HttpOnly = true,
            IsEssential = true,
            SameSite = SameSiteMode.Lax,
            Secure = http.Request.IsHttps,
            Path = "/"
        });
    }

    private static async ValueTask<WebCachedViewRender> GetOrRenderViewAsync(UIViewResolution resolution, IWebViewRenderer renderer, IWebViewRenderCache renderCache, CancellationToken cancellationToken)
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

    private static WebCachedViewRender RenderView(UIViewResolution resolution, IWebViewRenderer renderer)
    {
        WebRenderResult render = renderer.Render(resolution);

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
