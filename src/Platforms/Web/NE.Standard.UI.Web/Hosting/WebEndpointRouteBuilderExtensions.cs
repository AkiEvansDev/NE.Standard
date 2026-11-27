using System;
using System.Buffers;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO.Pipelines;
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
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Application;
using NE.Standard.UI.Compiled.Views;
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
using HeaderNames = Microsoft.Net.Http.Headers.HeaderNames;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>Maps the ASP.NET Core web shell, static assets, and live SignalR transport endpoints.</summary>
public static partial class WebEndpointRouteBuilderExtensions
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Debug, Message = "Rendering web UI route '{Route}'.")]
        public static partial void Rendering(ILogger logger, string route);

        [LoggerMessage(EventId = 3, Level = LogLevel.Error, Message = "Rendering web UI route '{Route}' failed.")]
        public static partial void RenderFailed(ILogger logger, Exception exception, string route);

        [LoggerMessage(EventId = 4, Level = LogLevel.Debug, Message = "Rendered route '{Route}' in {ElapsedMs:F1} ms: shape {ShapeMs:F1} ms, values {ValuesMs:F1} ms, page {PageMs:F1} ms, document {DocumentMs:F1} ms; {Length} characters.")]
        public static partial void Rendered(ILogger logger, string route, double elapsedMs, double shapeMs, double valuesMs, double pageMs, double documentMs, int length);
    }

    /// <summary>Everything the framework serves stands under this prefix, and the page route answers nothing beneath it.</summary>
    internal const string FrameworkPrefix = ServerEndpointCore.FrameworkPrefix;

    /// <summary>The address of the hub the client connects to.</summary>
    internal const string HubPath = ServerEndpointCore.HubPath;

    // Renders of a cache key under way, so the requests that miss one key together render it once and write its files once.
    private static readonly ConcurrentDictionary<(IWebViewRenderCache Cache, string Key), Task<WebCachedViewRender>> RendersInFlight = [];

    /// <summary>Maps all <c>NE.Standard.UI.Web</c> browser assets, SignalR hub, file/value/words endpoints, and the catch-all page shell route.</summary>
    public static Task<IEndpointRouteBuilder> MapStandardUIWebAsync(this IEndpointRouteBuilder endpoints, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(endpoints);

        cancellationToken.ThrowIfCancellationRequested();

        _ = endpoints.ServiceProvider.GetRequiredService<UIApplication>();
        _ = endpoints.ServiceProvider.GetRequiredService<WebSessionCookie>();

        RouteGroupBuilder group = endpoints.MapGroup(string.Empty).AddEndpointFilter(ServerEndpointCore.AddNoSniffHeaderAsync);

        MapAssets(group);
        MapThemeStylesheet(group);

        WebEndpointOptions options = endpoints.ServiceProvider.GetRequiredService<IOptions<WebEndpointOptions>>().Value;

        ServerEndpointCore.MapServerCoreEndpoints(endpoints, group, options, mapClientViewEndpoint: options.EnableClientViewEndpoint);
        WebManifestEndpoint.Map(group);
        ServerEndpointCore.RequireAuthorization(group.MapGet("/{**route}", RenderAsync), options);

        return Task.FromResult(endpoints);
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
    /// The theme's stylesheet (<see cref="WebThemeStylesheet"/>), served as any asset is: for good at the version a page links, else
    /// revalidated.
    /// </summary>
    private static void MapThemeStylesheet(IEndpointRouteBuilder endpoints)
    {
        UITheme theme = endpoints.ServiceProvider.GetRequiredService<UIApplication>().Theme;
        WebAssetCompression compression = endpoints.ServiceProvider.GetRequiredService<WebAssetCompression>();

        _ = endpoints.MapGet(WebThemeStylesheet.PublicPath, (HttpContext http) => ServeAsset(http, WebThemeStylesheet.Resolve(http.Request.Query["v"].ToString(), theme), compression));
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

        if (http.Request.Headers.IfNoneMatch.Count > 0 && http.Request.Headers.IfNoneMatch.ToString().Contains(etag, StringComparison.Ordinal))
            return Results.StatusCode(StatusCodes.Status304NotModified);

        if (compression.Enabled && WebAssetCompression.Compresses(asset))
        {
            http.Response.Headers.Vary = "Accept-Encoding";

            if (compression.Get(asset) is { } compressed && ServerByteCompression.ChooseEncoding(http.Request.Headers.AcceptEncoding, compressed.Brotli, compressed.Gzip) is { } encoding)
            {
                http.Response.Headers.ContentEncoding = encoding;

                return Results.Bytes(encoding == "br" ? compressed.Brotli! : compressed.Gzip!, ResolveContentType(asset.Kind));
            }
        }

        return Results.File(asset.Open(), ResolveContentType(asset.Kind), enableRangeProcessing: false);
    }

    private static string ResolveContentType(UIWebAssetKind kind)
        => kind switch
        {
            UIWebAssetKind.Css => "text/css",
            UIWebAssetKind.JavaScript => "application/javascript",
            UIWebAssetKind.HeadScript => "application/javascript",
            UIWebAssetKind.ServiceWorker => "application/javascript",
            UIWebAssetKind.TypeScript => "application/javascript",
            UIWebAssetKind.Less => "text/css",
            UIWebAssetKind.Font => "font/woff2",
            UIWebAssetKind.Icon => "image/svg+xml",
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

        // Before the session or a filter is touched: a page fetched as an image or a script by a sibling site's content would otherwise
        // run its navigation hooks as whoever views that content.
        if (IsSystemRoute(route) || !IsDocumentRequest(http))
            return Results.NotFound();

        UINavigationRequest navigation = new()
        {
            Route = route,
            Parameters = CreateParameters(http.Request.Query)
        };

        UserSessionInitData session = CreateSession(http, sessionCookie);

        UIViewResolution resolution = await host.ResolveViewAsync(navigation, session, UIViewRequestPhase.Open, cancellationToken).ConfigureAwait(false);

        ServerEndpointCore.AppendSessionCookie(http, application.Sessions, sessionCookie, resolution);

        try
        {
            return await RenderPageAsync(resolution, route, application, host, assets, renderer, renderCache, packageStrings, metrics, logger, http, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            Log.RenderFailed(logger, exception, route);

            UIViewResolution? errorResolution = await ServerEndpointCore.TryResolveErrorViewAsync(
                exception,
                navigation,
                session,
                resolution,
                host,
                exceptionHandler,
                http,
                application.Sessions,
                sessionCookie,
                cancellationToken).ConfigureAwait(false);

            if (errorResolution is null)
                throw;

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
            .PrepareAsync(host, resolution, shape, words, cancellationToken)
            .ConfigureAwait(false);

        // The controller signed in as the render built its runtime: this response hands out the new key, in place of the one it carried.
        if (hydration.SignedInKey is { } signedInKey)
            http.RequestServices.GetRequiredService<WebSessionCookie>().Write(http, application.Sessions, signedInKey.Value);

        var hydrated = Stopwatch.GetTimestamp();

        // The shared shape carries no bound value; a page with a controller is rendered again with this session's own so the
        // browser gets the finished page, not an empty frame. That render is never kept, so it goes to the response as its tree.
        IHtmlContent content;
        WebRenderMetadata? metadata = null;
        ReadOnlyMemory<byte> metadataJson = default;

        if (hydration.Values is null)
        {
            content = new Utf8HtmlContent(shape.Html);
            metadataJson = shape.MetadataJson;
        }
        else
        {
            WebRenderResult page = renderer.Render(resolution, hydration.Values);

            content = page.Content;
            metadata = page.Metadata;
        }

        var painted = Stopwatch.GetTimestamp();

        WebEndpointOptions endpointOptions = http.RequestServices.GetRequiredService<IOptions<WebEndpointOptions>>().Value;
        WebShellContext shell = new()
        {
            ThemeMode = resolution.Session.ThemeMode,
            Theme = application.Theme,
            ThemeColors = resolution.Session.ThemeColors,
            Assets = FilterAssetsForView(assets.Assets, resolution.View),
            Language = resolution.Session.Language,
            Title = TranslateTitle(application.Translator, resolution),
            Icon = endpointOptions.Icon ?? application.Icon,
            ServiceWorker = endpointOptions.ServiceWorker,
            HasManifest = endpointOptions.Manifest is not null,
            Content = content,
            FormIds = WebPageForms.Of(resolution.View),
            NotificationPlacement = resolution.View.Options.NotificationPlacement,
            NotificationWidth = resolution.View.Options.NotificationWidth,
            ScrollContentOnly = resolution.View.Options.ScrollContentOnly,
            ShellLayout = resolution.View.Options.ShellLayout,
            SideDrawers = resolution.View.Options.SideDrawers,
            LeftDrawerModal = resolution.View.Options.LeftDrawerModal,
            RightDrawerModal = resolution.View.Options.RightDrawerModal,
            BottomBar = WebViewRenderer.HasBottomBar(resolution.View),
            ContentFills = WebViewRenderer.ContentFills(resolution.View, hydration.Values),
            Metadata = metadata,
            MetadataJson = metadataJson,
            StringsJson = words.StringsJson,
            TemporalJson = words.TemporalJson,
            HydrationJsonUtf8 = hydration.JsonUtf8,
            StandInNavigation = string.Equals(UIRoutePath.Normalize(resolution.Navigation.Route), requestedRoute, StringComparison.Ordinal) ? null : resolution.Navigation
        };

        // The not-found page standing in for an address the application has not is that address's answer: a 404, not a page found.
        if (shell.StandInNavigation is not null && string.Equals(UIRoutePath.Normalize(resolution.Route.Route), application.ErrorHandling.NotFoundRoute, StringComparison.OrdinalIgnoreCase))
            http.Response.StatusCode = StatusCodes.Status404NotFound;

        return new ShellDocumentResult(shell, resolution, endpointOptions, metrics, logger, started, shaped, hydrated, painted);
    }

    /// <summary>Returns the assets required by <paramref name="view"/>, omitting add-on bundles whose components do not appear in the view.</summary>
    private static IReadOnlyList<WebAssetDescriptor> FilterAssetsForView(IReadOnlyList<WebAssetDescriptor> all, CompiledView view)
    {
        List<WebAssetDescriptor>? filtered = null;

        for (var i = 0; i < all.Count; i++)
        {
            WebAssetDescriptor asset = all[i];
            var include = asset.RequiredComponentTypes is null || view.UsesAnyComponentType(asset.RequiredComponentTypes);

            if (!include)
            {
                if (filtered is null)
                {
                    filtered = [with(all.Count - 1)];

                    for (var j = 0; j < i; j++)
                        filtered.Add(all[j]);
                }

                continue;
            }

            filtered?.Add(asset);
        }

        return filtered ?? all;
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
    private sealed class ShellDocumentResult(WebShellContext shell, UIViewResolution resolution, WebEndpointOptions options, WebUIMetrics metrics, ILogger logger, long started, long shaped, long hydrated, long painted) : IResult
    {
        public async Task ExecuteAsync(HttpContext httpContext)
        {
            ArgumentNullException.ThrowIfNull(httpContext);

            httpContext.Response.ContentType = "text/html; charset=utf-8";
            httpContext.Response.Headers.CacheControl = "private, no-cache";

            RestrictFraming(httpContext.Response, options);

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

        /// <summary>
        /// Who may frame the page: its own origin, unless the host names others — a signed-in page a sibling site frames can be steered
        /// into presses its reader never meant. <c>X-Frame-Options</c> only for the page's own origin, the one thing it can say.
        /// </summary>
        /// <remarks>
        /// Added beside whatever policy the host sent, never over it — a browser enforces each <c>Content-Security-Policy</c> header on
        /// its own, so a host's <c>script-src</c> holds on the page as well; and a host's own <c>X-Frame-Options</c> is left as it is.
        /// </remarks>
        private static void RestrictFraming(HttpResponse response, WebEndpointOptions options)
        {
            if (!options.RestrictFraming)
                return;

            if (options.FrameAncestors is { } ancestors)
            {
                response.Headers.Append(HeaderNames.ContentSecurityPolicy, $"frame-ancestors {ancestors}");
                return;
            }

            if (StringValues.IsNullOrEmpty(response.Headers.XFrameOptions))
                response.Headers.XFrameOptions = "SAMEORIGIN";

            response.Headers.Append(HeaderNames.ContentSecurityPolicy, "frame-ancestors 'self'");
        }
    }

    internal static bool IsSystemRoute(string route)
        => ServerEndpointCore.IsSystemRoute(route);

    /// <summary>
    /// Whether the browser asks for the page as a document, or as a frame where the page may be framed; a request without
    /// <c>Sec-Fetch-Dest</c> — an older browser, a test client — is taken as one.
    /// </summary>
    private static bool IsDocumentRequest(HttpContext http)
    {
        var destination = http.Request.Headers["Sec-Fetch-Dest"].ToString();

        if (destination.Length == 0 || destination.Equals("document", StringComparison.OrdinalIgnoreCase))
            return true;

        if (!destination.Equals("iframe", StringComparison.OrdinalIgnoreCase) && !destination.Equals("frame", StringComparison.OrdinalIgnoreCase))
            return false;

        WebEndpointOptions options = http.RequestServices.GetRequiredService<IOptions<WebEndpointOptions>>().Value;

        // Restricted to the page's own origin, a frame another site asks for would show nothing, its hooks run all the same.
        return !options.RestrictFraming || options.FrameAncestors is not null || !WebRequestGuards.IsCrossSiteRequest(http);
    }

    private static Dictionary<string, object?>? CreateParameters(IQueryCollection query)
    {
        if (query.Count == 0)
            return null;

        Dictionary<string, object?> parameters = [with(StringComparer.Ordinal)];

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

    internal static async ValueTask<WebCachedViewRender> GetOrRenderViewAsync(UIViewResolution resolution, IWebViewRenderer renderer, IWebViewRenderCache renderCache, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(resolution);
        ArgumentNullException.ThrowIfNull(renderer);
        ArgumentNullException.ThrowIfNull(renderCache);

        var key = WebViewCacheKeys.Create(resolution);

        WebCachedViewRender? cached = await renderCache.GetRenderAsync(key, cancellationToken).ConfigureAwait(false);

        if (cached is not null && Serves(cached, resolution))
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

            if (render is null || !Serves(render, resolution))
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

    /// <summary>Whether an entry answers the view: one without a controller is served from the page the entry carries.</summary>
    private static bool Serves(WebCachedViewRender render, UIViewResolution resolution)
        => render.HasPage || resolution.HasController;

    private static WebCachedViewRender RenderView(UIViewResolution resolution, IWebViewRenderer renderer)
    {
        WebRenderResult render = renderer.Render(resolution);

        IReadOnlyList<UIBindingId> bindingIds = render.Metadata.InitBindingIds;
        var initBindingIds = new int[bindingIds.Count];

        for (var i = 0; i < initBindingIds.Length; i++)
            initBindingIds[i] = bindingIds[i].Value;

        // A page with a controller is rendered again with its session's values, so of its shape it keeps only the init bindings.
        if (resolution.HasController)
            return WebCachedViewRender.InitBindingsOnly(initBindingIds);

        WebCachedViewRender cached = new()
        {
            Html = RenderToUtf8(render.Content),
            MetadataJson = WebShellRenderer.SerializeMetadataToUtf8(render.Metadata),
            InitBindingIds = initBindingIds
        };

        cached.Validate();

        return cached;
    }

    private static byte[] RenderToUtf8(IHtmlContent content)
    {
        ArgumentNullException.ThrowIfNull(content);

        Pipe pipe = new();

        using (WebPipeTextWriter writer = new(pipe.Writer))
        {
            content.WriteTo(writer);
            writer.Complete();
        }

        pipe.Writer.Complete();
        _ = pipe.Reader.TryRead(out ReadResult read);
        var bytes = read.Buffer.ToArray();
        pipe.Reader.Complete();
        return bytes;
    }
}
