using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Application;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Primitives.Json;
using NE.Standard.UI.Serialization;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Serves the compiled view descriptor, initial hydration snapshot, session metadata and words table at <c>GET /_ne/view</c>
/// for non-HTML <c>NE.Standard.UI.Client</c> sessions.
/// </summary>
internal static partial class WebViewEndpoint
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Error, Message = "Preparing view descriptor for route '{Route}' failed.")]
        public static partial void ViewPreparationFailed(ILogger logger, Exception exception, string route);
    }

    public const string Path = "/_ne/view";

    private static readonly ConditionalWeakTable<CompiledView, CachedWireViews> WireViewCache = [];

    public static void Map(IEndpointRouteBuilder endpoints, WebEndpointOptions options)
    {
        ArgumentNullException.ThrowIfNull(endpoints);
        ArgumentNullException.ThrowIfNull(options);

        ServerEndpointCore.RequireAuthorization(endpoints.MapGet(Path, ServeAsync), options);
    }

    private static async Task<IResult> ServeAsync(
        [FromQuery] string? address,
        [FromQuery] string? windowId,
        [FromQuery] string? timeZone,
        HttpContext http,
        [FromServices] UIApplication application,
        [FromServices] IUIHost host,
        [FromServices] WebSessionCookie sessionCookie,
        [FromServices] IResolveExceptionViewHandler exceptionHandler,
        [FromServices] IEnumerable<IUIStringsSource> packageStrings,
        [FromServices] IHostEnvironment environment,
        [FromServices] ILoggerFactory loggerFactory,
        CancellationToken cancellationToken)
    {
        if (WebRequestGuards.IsCrossSiteRequest(http))
            return Results.StatusCode(StatusCodes.Status403Forbidden);

        if (!IsViewFetchRequest(http))
            return Results.NotFound();

        UINavigationRequest parsed = UINavigationAddress.Parse(string.IsNullOrWhiteSpace(address) ? "/" : address);
        var requestedRoute = UIRoutePath.Normalize(parsed.Route);

        if (ServerEndpointCore.IsSystemRoute(requestedRoute))
            return Results.NotFound();

        UINavigationRequest navigation = new()
        {
            Route = requestedRoute,
            Parameters = parsed.Parameters
        };
        var requestedAddress = UINavigationAddress.Format(navigation);

        UserSessionInitData session = new()
        {
            SessionId = WebClientRequest.ReadSessionId(http, sessionCookie),
            ConnectionId = http.Connection.Id,
            ClientWindowId = string.IsNullOrWhiteSpace(windowId) ? null : windowId,
            Credential = http.User.Identity?.IsAuthenticated == true ? http.User.Identity.Name : null,
            Principal = http.User,
            Connection = WebClientRequest.ReadConnection(http),
            Languages = WebClientRequest.ReadLanguages(http),
            TimeZone = string.IsNullOrWhiteSpace(timeZone) ? null : timeZone
        };

        UIViewResolution resolution = await host.ResolveViewAsync(navigation, session, UIViewRequestPhase.Open, cancellationToken).ConfigureAwait(false);

        ServerEndpointCore.AppendSessionCookie(http, application.Sessions, sessionCookie, resolution);

        var includeDiagnostics = environment.IsDevelopment();

        try
        {
            return await WriteViewResultAsync(resolution, requestedRoute, requestedAddress, session.ClientWindowId, application, host, sessionCookie, packageStrings, includeDiagnostics, http, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            ILogger logger = loggerFactory.CreateLogger(typeof(WebViewEndpoint));
            Log.ViewPreparationFailed(logger, exception, requestedRoute);

            UIViewResolution? errorResolution = await ServerEndpointCore
                .TryResolveErrorViewAsync(exception, navigation, session, resolution, host, exceptionHandler, http, application.Sessions, sessionCookie, cancellationToken)
                .ConfigureAwait(false);

            if (errorResolution is null)
                throw;

            return await WriteViewResultAsync(errorResolution, requestedRoute, requestedAddress, session.ClientWindowId, application, host, sessionCookie, packageStrings, includeDiagnostics, http, cancellationToken).ConfigureAwait(false);
        }
    }

    private static bool IsViewFetchRequest(HttpContext http)
    {
        var destination = http.Request.Headers["Sec-Fetch-Dest"].ToString();
        return destination.Length == 0 || destination.Equals("empty", StringComparison.OrdinalIgnoreCase);
    }

    private static async Task<IResult> WriteViewResultAsync(UIViewResolution resolution, string requestedRoute, string requestedAddress, string? clientWindowId, UIApplication application, IUIHost host, WebSessionCookie sessionCookie, IEnumerable<IUIStringsSource> packageStrings, bool includeDiagnostics, HttpContext http, CancellationToken cancellationToken)
    {
        ServerPreparedSnapshot snapshot = await ServerEndpointCore
            .PrepareSnapshotAsync(host, resolution, resolution.HasController ? WebInitialChanges.FromView(resolution.View) : [], cancellationToken, clientWindowId)
            .ConfigureAwait(false);
        var viewBytes = GetCachedViewBytes(resolution.View, includeDiagnostics);

        if (snapshot.SignedInKey is { } signedInKey)
            sessionCookie.Write(http, application.Sessions, signedInKey.Value);

        WebWordsAsset words = WebWordsEndpoint.Resolve(application, resolution.Session.Language, packageStrings);
        var standIn = !string.Equals(UIRoutePath.Normalize(resolution.Navigation.Route), requestedRoute, StringComparison.Ordinal);
        if (standIn && string.Equals(UIRoutePath.Normalize(resolution.Route.Route), application.ErrorHandling.NotFoundRoute, StringComparison.OrdinalIgnoreCase))
            http.Response.StatusCode = StatusCodes.Status404NotFound;

        http.Response.Headers.CacheControl = "private, no-store";
        http.Response.ContentType = "application/json; charset=utf-8";

        using (Utf8JsonWriter writer = new(http.Response.BodyWriter))
        {
            writer.WriteStartObject();
            writer.WriteString("route", resolution.Route.Route);

            if (standIn)
                writer.WriteString("address", requestedAddress);

            writer.WritePropertyName("navigation");
            JsonSerializer.Serialize(writer, resolution.Navigation, UIWireJson.Options);

            writer.WritePropertyName("identity");
            JsonSerializer.Serialize(writer, resolution.Route.IdentityParameters, UIWireJson.Options);

            writer.WriteBoolean("hasController", resolution.HasController);
            writer.WriteString("language", resolution.Session.Language);
            writer.WriteString("defaultLanguage", application.Translator.DefaultLanguage);
            writer.WritePropertyName("languages");
            JsonSerializer.Serialize(writer, application.Translator.Languages, UIWireJson.Options);

            if (resolution.Session.ThemeMode is { } themeMode)
            {
                writer.WritePropertyName("themeMode");
                JsonSerializer.Serialize(writer, themeMode, UIWireJson.Options);
            }

            if (resolution.Session.ThemeColors is { } themeColors)
            {
                writer.WritePropertyName("themeColors");
                JsonSerializer.Serialize(writer, themeColors, UIWireJson.Options);
            }

            if (snapshot.PageId is not null)
                writer.WriteString("pageId", snapshot.PageId);

            if (snapshot.Sequence is long sequence)
                writer.WriteNumber("sequence", sequence);

            writer.WritePropertyName("changes");
            JsonSerializer.Serialize(writer, snapshot.Changes, UIWireJson.Options);

            writer.WritePropertyName("words");
            writer.WriteRawValue(words.Bytes, skipInputValidation: true);

            writer.WritePropertyName("view");
            writer.WriteRawValue(viewBytes, skipInputValidation: true);

            writer.WriteEndObject();
            await writer.FlushAsync(cancellationToken).ConfigureAwait(false);
        }

        return Results.Empty;
    }

    private static byte[] GetCachedViewBytes(CompiledView view, bool includeDiagnostics)
        => WireViewCache.GetOrCreateValue(view).GetOrCreate(view, includeDiagnostics);

    private sealed class CachedWireViews
    {
        private byte[]? _production;
        private byte[]? _diagnostics;

        public byte[] GetOrCreate(CompiledView view, bool includeDiagnostics)
            => includeDiagnostics
                ? (_diagnostics ??= CompiledViewWireSerializer.SerializeToUtf8Bytes(view, includeDiagnostics: true))
                : (_production ??= CompiledViewWireSerializer.SerializeToUtf8Bytes(view, includeDiagnostics: false));
    }
}
