using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
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
using NE.Standard.UI.Web.Assets;
using NE.Standard.UI.Web.Html;
using NE.Standard.UI.Web.Rendering;
using StringWithQualityHeaderValue = Microsoft.Net.Http.Headers.StringWithQualityHeaderValue;

namespace NE.Standard.UI.Web.Hosting;

public static partial class WebEndpointRouteBuilderExtensions
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Debug, Message = "Rendering web UI route '{Route}'.")]
        public static partial void Rendering(ILogger logger, string route);

        [LoggerMessage(EventId = 2, Level = LogLevel.Warning, Message = "Response compression is switched on but this host does not accept middleware here; call UseResponseCompression() yourself.")]
        public static partial void CompressionNotInstalled(ILogger logger);

        [LoggerMessage(EventId = 3, Level = LogLevel.Error, Message = "Rendering web UI route '{Route}' failed.")]
        public static partial void RenderFailed(ILogger logger, Exception exception, string route);

        [LoggerMessage(EventId = 4, Level = LogLevel.Debug, Message = "Rendered route '{Route}' in {ElapsedMs:F1} ms: shape {ShapeMs:F1} ms, values {ValuesMs:F1} ms, page {PageMs:F1} ms, document {DocumentMs:F1} ms; {Length} characters.")]
        public static partial void Rendered(ILogger logger, string route, double elapsedMs, double shapeMs, double valuesMs, double pageMs, double documentMs, int length);
    }

    /// <summary>Everything the framework serves stands under this prefix, and the page route answers nothing beneath it.</summary>
    internal const string FrameworkPrefix = "/_ne/";

    /// <summary>The address of the hub the client connects to.</summary>
    internal const string HubPath = "/_ne/hub";

    // Renders of a cache key under way, so the requests that miss one key together render it once and write its files once.
    private static readonly ConcurrentDictionary<(IWebViewRenderCache Cache, string Key), Task<WebCachedViewRender>> RendersInFlight = [];

    public static Task<IEndpointRouteBuilder> MapStandardUIWebAsync(this IEndpointRouteBuilder endpoints, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(endpoints);

        cancellationToken.ThrowIfCancellationRequested();

        // Built now rather than on the first request: a route compiled at Startup compiles here, so a view naming a command its
        // controller lacks fails the deployment, not its first visitor.
        _ = endpoints.ServiceProvider.GetRequiredService<UIApplication>();

        // The framework's own page, asset, file and content responses all sit behind this filter; the hub is a
        // different kind of endpoint and carries no body a browser could sniff.
        RouteGroupBuilder group = endpoints.MapGroup(string.Empty).AddEndpointFilter(AddNoSniffHeaderAsync);

        MapAssets(group);

        WebFileEndpoints.Map(group);
        WebValueEndpoint.Map(group);
        WebContentEndpoint.Map(group);
        WebWordsEndpoint.Map(group);

        UseResponseCompression(endpoints);

        WebEndpointOptions options = endpoints.ServiceProvider.GetRequiredService<IOptions<WebEndpointOptions>>().Value;

        HubEndpointConventionBuilder hub = endpoints.MapHub<WebUIHub>(HubPath);

        hub.Add(RefuseCrossSiteRequests);
        RequireAuthorization(hub, options);
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
        WebAssetCompression compression = endpoints.ServiceProvider.GetRequiredService<WebAssetCompression>();

        foreach (WebAssetDescriptor asset in assets.Assets)
        {
            if (asset.SourceKind == UIWebAssetSourceKind.Url)
                continue;

            if (string.IsNullOrWhiteSpace(asset.PublicPath))
                continue;

            _ = endpoints.MapGet(asset.PublicPath, (HttpContext http) => ServeAsset(http, asset, compression));
        }
    }

    /// <summary>
    /// Refuses the hub's negotiate and every transport from another origin, as the upload and the staged value are refused
    /// (<see cref="WebRequestGuards.IsCrossSiteRequest"/>).
    /// </summary>
    /// <remarks>
    /// Around the endpoint's own delegate, before SignalR's dispatcher: a WebSocket passes no CORS and needs no negotiate, and its
    /// handshake carries the session's cookie to a page on a sibling subdomain or another port.
    /// </remarks>
    private static void RefuseCrossSiteRequests(EndpointBuilder endpoint)
    {
        RequestDelegate next = endpoint.RequestDelegate ?? throw new InvalidOperationException($"The endpoint '{endpoint.DisplayName}' has no delegate to guard.");

        endpoint.RequestDelegate = http =>
        {
            if (!WebRequestGuards.IsCrossSiteRequest(http))
                return next(http);

            http.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
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
    /// A request naming the current version is cached for good; an unversioned or stale one revalidates by ETag every time, so a
    /// 304 keeps a stylesheet's font from blinking on navigation.
    /// </summary>
    private static IResult ServeAsset(HttpContext http, WebAssetDescriptor asset, WebAssetCompression compression)
    {
        var version = asset.ResolveVersion();
        var etag = string.Create(CultureInfo.InvariantCulture, $"\"{version}\"");
        var versioned = string.Equals(http.Request.Query["v"].ToString(), version, StringComparison.Ordinal);

        http.Response.Headers.ETag = etag;
        http.Response.Headers.CacheControl = versioned ? "public, max-age=31536000, immutable" : "public, no-cache";

        // A versioned request revalidates too when the browser asks, as a hard reload does: the ETag says it holds these bytes.
        if (http.Request.Headers.IfNoneMatch.Count > 0 && http.Request.Headers.IfNoneMatch.ToString().Contains(etag, StringComparison.Ordinal))
            return Results.StatusCode(StatusCodes.Status304NotModified);

        // The bytes compressed once, as the browser takes them; with Content-Encoding set, the per-response middleware leaves them be.
        if (compression.Enabled && WebAssetCompression.Compresses(asset))
        {
            http.Response.Headers.Vary = "Accept-Encoding";

            // Null when the build failed: the asset goes out as it is rather than failing the request.
            if (compression.Get(asset) is { } compressed && ChooseEncoding(http.Request.Headers.AcceptEncoding, compressed) is { } encoding)
            {
                http.Response.Headers.ContentEncoding = encoding;

                return Results.Bytes(encoding == "br" ? compressed.Brotli! : compressed.Gzip!, ResolveContentType(asset.Kind));
            }
        }

        return Results.File(asset.Open(), ResolveContentType(asset.Kind), enableRangeProcessing: false);
    }

    /// <summary>Brotli where the browser takes it, else Gzip, else none: an encoding it refused with <c>q=0</c> is not taken.</summary>
    internal static string? ChooseEncoding(StringValues acceptEncoding, WebAssetCompression.Compressed compressed)
    {
        if (!StringWithQualityHeaderValue.TryParseList(acceptEncoding, out IList<StringWithQualityHeaderValue>? accepted))
            return null;

        var brotli = false;
        var gzip = false;

        foreach (StringWithQualityHeaderValue value in accepted)
        {
            if (value.Quality is 0)
                continue;

            brotli |= value.Value.Equals("br", StringComparison.OrdinalIgnoreCase);
            gzip |= value.Value.Equals("gzip", StringComparison.OrdinalIgnoreCase);
        }

        return brotli && compressed.Brotli is not null ? "br" : gzip && compressed.Gzip is not null ? "gzip" : null;
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
        [FromServices] WebSessionCookie sessionCookie,
        [FromServices] IResolveExceptionViewHandler exceptionHandler,
        [FromServices] IWebAssetRegistry assets,
        [FromServices] IWebViewRenderer renderer,
        [FromServices] IWebViewRenderCache renderCache,
        [FromServices] IEnumerable<IUIStringsSource> packageStrings,
        [FromServices] WebUIMetrics metrics,
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

        UserSessionInitData session = CreateSession(http, sessionCookie);

        UIViewResolution resolution = await host.ResolveViewAsync(navigation, session, UIViewRequestPhase.Open, cancellationToken).ConfigureAwait(false);

        // The shell render is the only half of a page load that can write a header, so a new session's secret is set here.
        AppendSessionCookie(http, application.Sessions, sessionCookie, resolution);

        try
        {
            return await RenderPageAsync(resolution, route, application, host, assets, renderer, renderCache, packageStrings, metrics, logger, http, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            // A getter that throws while this reader's values are rendered fails the page the way a failed resolution does: the
            // error route, in place, rather than a bare 500. The handler declines the error route itself, so this cannot loop.
            Log.RenderFailed(logger, exception, route);

            UserSessionInitData current = new()
            {
                SessionId = resolution.Session.SessionId,
                ConnectionId = session.ConnectionId,
                Credential = session.Credential,
                Principal = session.Principal,
                Connection = session.Connection,
                Languages = session.Languages
            };

            UINavigationRequest? next = await exceptionHandler.HandleAsync(new ResolveExceptionViewContext
            {
                Exception = exception,
                Navigation = navigation,
                SessionInit = current,
                Session = resolution.Session,
                Route = resolution.Route
            }, cancellationToken).ConfigureAwait(false);

            if (next is null)
                throw;

            UIViewResolution errorResolution = await host.ResolveViewAsync(next, current, UIViewRequestPhase.Open, cancellationToken).ConfigureAwait(false);

            // Nothing new to write unless the session was ended while the page rendered, and the error page issued another.
            if (errorResolution.IssuedSecret is not null)
                AppendSessionCookie(http, application.Sessions, sessionCookie, errorResolution);

            return await RenderPageAsync(errorResolution, route, application, host, assets, renderer, renderCache, packageStrings, metrics, logger, http, cancellationToken).ConfigureAwait(false);
        }
    }

    private static async Task<IResult> RenderPageAsync(UIViewResolution resolution, string requestedRoute, UIApplication application, IUIHost host, IWebAssetRegistry assets, IWebViewRenderer renderer, IWebViewRenderCache renderCache, IEnumerable<IUIStringsSource> packageStrings, WebUIMetrics metrics, ILogger logger, HttpContext http, CancellationToken cancellationToken)
    {
        var started = Stopwatch.GetTimestamp();

        WebCachedViewRender shape = await GetOrRenderViewAsync(resolution, renderer, renderCache, cancellationToken).ConfigureAwait(false);

        var shaped = Stopwatch.GetTimestamp();

        WebPageWords words = WebPageWords.For(application, resolution, packageStrings);
        WebHydration hydration = await WebHydration
            .PrepareAsync(host, resolution, shape, words, http.RequestAborted)
            .ConfigureAwait(false);

        var hydrated = Stopwatch.GetTimestamp();

        // The shared shape carries no bound value; a page with a controller is rendered again with this session's own so the
        // browser gets the finished page, not an empty frame. That render is never kept, so it goes to the response as its tree.
        IHtmlContent content;
        string metadataJson;

        if (hydration.Values is null)
        {
            HtmlContentBuilder cached = new();

            _ = cached.Raw(shape.Html);
            content = cached;
            metadataJson = shape.MetadataJson;
        }
        else
        {
            WebRenderResult page = renderer.Render(resolution, hydration.Values);

            content = page.Content;
            metadataJson = WebShellRenderer.SerializeMetadata(page.Metadata);
        }

        var painted = Stopwatch.GetTimestamp();

        WebShellContext shell = new()
        {
            ThemeMode = resolution.Session.ThemeMode,
            Theme = application.Theme,
            ThemeColors = resolution.Session.ThemeColors,
            Assets = assets.Assets,
            Language = resolution.Session.Language,
            Title = TranslateTitle(application.Translator, resolution),
            Icon = http.RequestServices.GetRequiredService<IOptions<WebEndpointOptions>>().Value.Icon,
            Content = content,
            FormIds = WebPageForms.Of(resolution.View),
            NotificationPlacement = resolution.View.Options.NotificationPlacement,
            NotificationWidth = resolution.View.Options.NotificationWidth,
            ScrollContentOnly = resolution.View.Options.ScrollContentOnly,
            ShellLayout = resolution.View.Options.ShellLayout,
            SideDrawers = resolution.View.Options.SideDrawers,
            MetadataJson = metadataJson,
            StringsJson = words.StringsJson,
            HydrationJson = hydration.Json,
            StandInNavigation = string.Equals(UIRoutePath.Normalize(resolution.Navigation.Route), requestedRoute, StringComparison.Ordinal) ? null : resolution.Navigation
        };

        return new ShellDocumentResult(shell, resolution, metrics, logger, started, shaped, hydrated, painted);
    }

    /// <summary>The view's title in the session's language: a plain key, or a key filled with the view's own arguments.</summary>
    private static string? TranslateTitle(ITranslator translator, UIViewResolution resolution)
    {
        var title = resolution.View.Title;

        if (string.IsNullOrWhiteSpace(title))
            return null;

        return resolution.View.TitleArguments is { Count: > 0 } arguments
            ? translator.Translate(resolution.Session.Language, title, arguments) ?? title
            : translator.Translate(resolution.Session.Language, title) ?? title;
    }

    /// <summary>
    /// The document written straight into the response's pipe — no string of the page, which on a large page is several copies on
    /// the large object heap a request — and a page this session's values are in, so no cache may keep it.
    /// </summary>
    private sealed class ShellDocumentResult(WebShellContext shell, UIViewResolution resolution, WebUIMetrics metrics, ILogger logger, long started, long shaped, long hydrated, long painted) : IResult
    {
        public async Task ExecuteAsync(HttpContext httpContext)
        {
            ArgumentNullException.ThrowIfNull(httpContext);

            httpContext.Response.ContentType = "text/html; charset=utf-8";
            httpContext.Response.Headers.CacheControl = "private, no-cache";

            long length;

            using (WebPipeTextWriter writer = new(httpContext.Response.BodyWriter))
            {
                WebShellRenderer.Render(shell, writer);
                writer.Complete();
                length = writer.Length;
            }

            var finished = Stopwatch.GetTimestamp();
            TimeSpan elapsed = Stopwatch.GetElapsedTime(started, finished);
            var characters = (int)Math.Min(length, int.MaxValue);

            metrics.PageRendered(resolution.Route.Route, elapsed, characters);

            if (logger.IsEnabled(LogLevel.Debug))
            {
                TimeSpan shapeElapsed = Stopwatch.GetElapsedTime(started, shaped);
                TimeSpan valuesElapsed = Stopwatch.GetElapsedTime(shaped, hydrated);
                TimeSpan pageElapsed = Stopwatch.GetElapsedTime(hydrated, painted);
                TimeSpan documentElapsed = Stopwatch.GetElapsedTime(painted, finished);

                Log.Rendered(logger, resolution.Navigation.Route, elapsed.TotalMilliseconds, shapeElapsed.TotalMilliseconds, valuesElapsed.TotalMilliseconds, pageElapsed.TotalMilliseconds, documentElapsed.TotalMilliseconds, characters);
            }

            _ = await httpContext.Response.BodyWriter.FlushAsync(httpContext.RequestAborted).ConfigureAwait(false);
        }
    }

    // All of the framework's prefix, not a list of what is mapped there: an address under it that nothing answers is a 404, not a page.
    private static bool IsSystemRoute(string route)
        => route.StartsWith("/.well-known/", StringComparison.Ordinal)
        || route.StartsWith(FrameworkPrefix, StringComparison.Ordinal)
        || route.Equals(FrameworkPrefix[..^1], StringComparison.Ordinal)
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

    private static UserSessionInitData CreateSession(HttpContext http, WebSessionCookie cookie)
        => new()
        {
            SessionId = WebClientRequest.ReadSessionId(http, cookie),
            ConnectionId = http.Connection.Id,
            Credential = http.User.Identity?.IsAuthenticated == true ? http.User.Identity.Name : null,
            Principal = http.User,
            Connection = WebClientRequest.ReadConnection(http),
            Languages = WebClientRequest.ReadLanguages(http)
        };

    /// <summary>
    /// Hands the client the secret of a session the page load issued; with a lifetime, writes the presented one again, since the
    /// lifetime counts from the last page load.
    /// </summary>
    /// <remarks>
    /// The presented key is written back only as the headers go out, and only while its session is still there with no move to a new
    /// id pending: a load that overlapped another's sign-in rotation holds the old id, and its key written after the other's would put
    /// back a key whose session has ended. That load is never handed the new key either — the fixation defence.
    /// </remarks>
    private static void AppendSessionCookie(HttpContext http, UISessionOptions options, WebSessionCookie cookie, UIViewResolution resolution)
    {
        if (resolution.IssuedSecret is { } issued)
        {
            WriteSessionCookie(http, options, cookie, issued.Value);
            return;
        }

        if (options.ClientKeyLifetime is null || PresentedSecretOf(http, cookie, resolution.Session.SessionId) is not { } presented)
            return;

        var sessionId = resolution.Session.SessionId;

        http.Response.OnStarting(async () =>
        {
            IUserSessionStore store = http.RequestServices.GetRequiredService<IUserSessionStore>();

            if (await store.TryGetAsync(sessionId, http.RequestAborted).ConfigureAwait(false) is { PendingIdRotation: false })
                WriteSessionCookie(http, options, cookie, presented);
        });
    }

    private static void WriteSessionCookie(HttpContext http, UISessionOptions options, WebSessionCookie cookie, string secret)
        => http.Response.Cookies.Append(cookie.Name, secret, new CookieOptions
        {
            HttpOnly = true,
            IsEssential = true,
            SameSite = SameSiteMode.Lax,
            Secure = http.Request.IsHttps,
            Path = "/",
            MaxAge = options.ClientKeyLifetime
        });

    /// <summary>The secret the request presented, where it is the key of <paramref name="sessionId"/>.</summary>
    private static string? PresentedSecretOf(HttpContext http, WebSessionCookie cookie, string sessionId)
    {
        var presented = WebClientRequest.ReadSessionSecret(http, cookie);

        return string.Equals(UISessionSecret.TryToSessionId(presented), sessionId, StringComparison.Ordinal) ? presented : null;
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

        // One render per key however many requests miss it together: the others await the first rather than each rendering the
        // shape and writing the same files — a cold start's burst would otherwise do it once per request.
        TaskCompletionSource<WebCachedViewRender> mine = new(TaskCreationOptions.RunContinuationsAsynchronously);
        Task<WebCachedViewRender> inFlight = RendersInFlight.GetOrAdd((renderCache, key), mine.Task);

        if (!ReferenceEquals(inFlight, mine.Task))
            return await inFlight.WaitAsync(cancellationToken).ConfigureAwait(false);

        try
        {
            // A flight that finished between the miss above and this one starting has already written the entry, so it is not written again.
            WebCachedViewRender? render = await renderCache.GetRenderAsync(key, CancellationToken.None).ConfigureAwait(false);

            if (render is null)
            {
                render = RenderView(resolution, renderer);

                // Not the request's token: the requests awaiting this render must not fail because the one that started it went away.
                await renderCache.SetRenderAsync(key, render, CancellationToken.None).ConfigureAwait(false);
            }

            mine.SetResult(render);

            return render;
        }
        catch (Exception exception)
        {
            mine.SetException(exception);

            // Observed here, so a render that failed with nobody waiting on it is not reported again as an unobserved task.
            _ = mine.Task.Exception;

            throw;
        }
        finally
        {
            _ = RendersInFlight.TryRemove(new KeyValuePair<(IWebViewRenderCache, string), Task<WebCachedViewRender>>((renderCache, key), mine.Task));
        }
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
