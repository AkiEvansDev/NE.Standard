using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Application;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates.Server;
using StringWithQualityHeaderValue = Microsoft.Net.Http.Headers.StringWithQualityHeaderValue;

namespace NE.Standard.UI.Web.Hosting;

internal interface IServerViewInitBindingsProvider
{
    ValueTask<IReadOnlyList<int>> GetInitBindingIdsAsync(UIViewResolution resolution, CancellationToken cancellationToken);
}

internal interface IServerThemeColorsStylesheet
{
    string BuildColorsCss(UITheme theme, UIThemeColors? colors);
}

internal interface IServerRenderCacheMetrics
{
    long HeldCount { get; }

    long HeldBytes { get; }

    long? DiskBytesRead { get; }

    long? DiskBytesWritten { get; }
}

internal sealed record ServerPreparedSnapshot(string? PageId, long? Sequence, ServerChangeSet Changes, UISessionSecret? SignedInKey);

internal static class ServerByteCompression
{
    internal sealed record CompressedBytes(byte[]? Brotli, byte[]? Gzip);

    public static CompressedBytes Build(byte[] original)
    {
        ArgumentNullException.ThrowIfNull(original);

        var brotli = Compress(original, static target => new BrotliStream(target, CompressionLevel.SmallestSize, leaveOpen: true));
        var gzip = Compress(original, static target => new GZipStream(target, CompressionLevel.SmallestSize, leaveOpen: true));

        return new CompressedBytes(brotli.Length < original.Length ? brotli : null, gzip.Length < original.Length ? gzip : null);
    }

    private static byte[] Compress(byte[] original, Func<Stream, Stream> wrap)
    {
        using MemoryStream target = new();

        using (Stream compressor = wrap(target))
            compressor.Write(original);

        return target.ToArray();
    }

    public static string? ChooseEncoding(StringValues acceptEncoding, CompressedBytes compressed)
        => ChooseEncoding(acceptEncoding, compressed.Brotli, compressed.Gzip);

    public static string? ChooseEncoding(StringValues acceptEncoding, byte[]? brotliBytes, byte[]? gzipBytes)
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

        return brotli && brotliBytes is not null ? "br" : gzip && gzipBytes is not null ? "gzip" : null;
    }
}

internal static partial class ServerEndpointCore
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 2, Level = LogLevel.Warning, Message = "Response compression is switched on but this host does not accept middleware here; call UseResponseCompression() yourself.")]
        public static partial void CompressionNotInstalled(ILogger logger);
    }

    internal const string FrameworkPrefix = "/_ne/";
    internal const string HubPath = "/_ne/hub";

    public static Task<IEndpointRouteBuilder> MapStandardUIServerCoreAsync(IEndpointRouteBuilder endpoints, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(endpoints);

        cancellationToken.ThrowIfCancellationRequested();

        _ = endpoints.ServiceProvider.GetRequiredService<UIApplication>();
        _ = endpoints.ServiceProvider.GetRequiredService<WebSessionCookie>();

        RouteGroupBuilder group = endpoints.MapGroup(string.Empty).AddEndpointFilter(AddNoSniffHeaderAsync);
        WebEndpointOptions options = endpoints.ServiceProvider.GetRequiredService<IOptions<WebEndpointOptions>>().Value;

        MapServerCoreEndpoints(endpoints, group, options, mapClientViewEndpoint: true);

        return Task.FromResult(endpoints);
    }

    public static async ValueTask<object?> AddNoSniffHeaderAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        context.HttpContext.Response.Headers["X-Content-Type-Options"] = "nosniff";
        return await next(context).ConfigureAwait(false);
    }

    public static void MapServerCoreEndpoints(IEndpointRouteBuilder endpoints, RouteGroupBuilder group, WebEndpointOptions options, bool mapClientViewEndpoint)
    {
        if (mapClientViewEndpoint)
            WebViewEndpoint.Map(group, options);

        WebFileEndpoints.Map(group);
        WebValueEndpoint.Map(group);
        WebSessionKeyEndpoint.Map(group);
        WebContentEndpoint.Map(group);
        WebWordsEndpoint.Map(group);

        UseResponseCompression(endpoints);

        HubEndpointConventionBuilder hub = endpoints.MapHub<WebUIHub>(HubPath, static hubOptions => hubOptions.AllowStatefulReconnects = true);

        hub.Add(RefuseCrossSiteRequests);
        RequireAuthorization(hub, options);
    }

    private static void UseResponseCompression(IEndpointRouteBuilder endpoints)
    {
        if (!endpoints.ServiceProvider.GetRequiredService<IOptions<WebResponseCompressionOptions>>().Value.Enabled)
            return;

        if (endpoints is IApplicationBuilder application)
        {
            _ = application.UseResponseCompression();
            return;
        }

        ILogger logger = endpoints.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("NE.Standard.UI.Web.Hosting.WebEndpointRouteBuilderExtensions");
        Log.CompressionNotInstalled(logger);
    }

    public static void RefuseCrossSiteRequests(EndpointBuilder endpoint)
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

    public static void RequireAuthorization(IEndpointConventionBuilder endpoint, WebEndpointOptions options)
    {
        if (!options.RequireAuthorization)
            return;

        if (string.IsNullOrWhiteSpace(options.AuthorizationPolicy))
            _ = endpoint.RequireAuthorization();
        else
            _ = endpoint.RequireAuthorization(options.AuthorizationPolicy);
    }

    public static bool IsSystemRoute(string route)
        => route.StartsWith("/.well-known/", StringComparison.Ordinal)
        || route.StartsWith(FrameworkPrefix, StringComparison.Ordinal)
        || route.Equals(FrameworkPrefix[..^1], StringComparison.Ordinal)
        || route.Equals("/favicon.ico", StringComparison.Ordinal);

    public static void AppendSessionCookie(HttpContext http, UISessionOptions options, WebSessionCookie cookie, UIViewResolution resolution)
    {
        if (resolution.IssuedSecret is { } issued)
        {
            cookie.Write(http, options, issued.Value);
            return;
        }

        if (options.ClientKeyLifetime is null || PresentedSecretOf(http, cookie, resolution.Session.SessionId) is not { } presented)
            return;

        var sessionId = resolution.Session.SessionId;

        http.Response.OnStarting(async () =>
        {
            IUserSessionStore store = http.RequestServices.GetRequiredService<IUserSessionStore>();

            if (await store.TryGetAsync(sessionId, http.RequestAborted).ConfigureAwait(false) is { PendingIdRotation: false })
                cookie.Write(http, options, presented);
        });
    }

    private static string? PresentedSecretOf(HttpContext http, WebSessionCookie cookie, string sessionId)
    {
        var presented = WebClientRequest.ReadSessionSecret(http, cookie);

        return string.Equals(UISessionSecret.TryToSessionId(presented), sessionId, StringComparison.Ordinal) ? presented : null;
    }

    public static async Task<UIViewResolution?> TryResolveErrorViewAsync(Exception exception, UINavigationRequest navigation, UserSessionInitData session, UIViewResolution failedResolution, IUIHost host, IResolveExceptionViewHandler exceptionHandler, HttpContext http, UISessionOptions sessionOptions, WebSessionCookie sessionCookie, CancellationToken cancellationToken)
    {
        UserSessionInitData current = new()
        {
            SessionId = failedResolution.Session.SessionId,
            ConnectionId = session.ConnectionId,
            ClientWindowId = session.ClientWindowId,
            Credential = session.Credential,
            Principal = session.Principal,
            Connection = session.Connection,
            Languages = session.Languages,
            TimeZone = session.TimeZone
        };

        UINavigationRequest? next = await exceptionHandler.HandleAsync(new ResolveExceptionViewContext
        {
            Exception = exception,
            Navigation = navigation,
            SessionInit = current,
            Session = failedResolution.Session,
            Route = failedResolution.Route
        }, cancellationToken).ConfigureAwait(false);

        if (next is null)
            return null;

        UIViewResolution errorResolution = await host.ResolveViewAsync(next, current, UIViewRequestPhase.Open, cancellationToken).ConfigureAwait(false);

        if (errorResolution.IssuedSecret is not null)
            AppendSessionCookie(http, sessionOptions, sessionCookie, errorResolution);

        return errorResolution;
    }

    public static async Task<ServerPreparedSnapshot> PrepareSnapshotAsync(IUIHost host, UIViewResolution resolution, IReadOnlyList<int> initBindingIds, CancellationToken cancellationToken, string? clientWindowId = null)
    {
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(resolution);
        ArgumentNullException.ThrowIfNull(initBindingIds);

        if (!resolution.HasController)
            return new ServerPreparedSnapshot(PageId: null, Sequence: null, ServerChangeSet.Empty, SignedInKey: null);

        IUIRuntime? existing = host.TryGetRenderRuntime(resolution, clientWindowId);

        if (existing is not null)
        {
            await host.HearBeforeRenderAsync(existing, resolution, cancellationToken).ConfigureAwait(false);
            UIRenderSnapshot existingSnapshot = await WebInitialChanges.BuildAsync(existing, pageId: null, initBindingIds, cancellationToken).ConfigureAwait(false);

            return new ServerPreparedSnapshot(PageId: null, existingSnapshot.Sequence, existingSnapshot.Changes, SignedInKey: null);
        }

        var pageId = Guid.NewGuid().ToString("N");
        UIInstance instance = new()
        {
            Id = pageId,
            WindowId = pageId,
            Navigation = resolution.Navigation,
            PageId = pageId
        };

        RuntimeResolution runtime = await host.AttachRuntimeAsync(resolution, instance, cancellationToken).ConfigureAwait(false);

        try
        {
            UISessionSecret? signedInKey = host.TakeRenderKey(runtime.Handle);
            UIRenderSnapshot preparedSnapshot = await WebInitialChanges.BuildAsync(runtime.Runtime, pageId, initBindingIds, cancellationToken).ConfigureAwait(false);

            return new ServerPreparedSnapshot(pageId, preparedSnapshot.Sequence, preparedSnapshot.Changes, signedInKey);
        }
        finally
        {
            _ = host.DetachRuntime(runtime.Handle);
        }
    }
}
