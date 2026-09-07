using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Application;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Sessions;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Hosting;

internal sealed partial class WebUIHub : Hub
{
    internal sealed class WebUIAttachRequest
    {
        public required string ClientWindowId { get; init; }

        public required string Route { get; init; }

        /// <summary>
        /// The id the shell render put in the page, when it prepared a runtime; presenting it hands that same runtime back.
        /// </summary>
        public string? PageId { get; init; }

        /// <summary>The fingerprint of the compile the page was rendered from, when the page carries one.</summary>
        public string? View { get; init; }

        public IReadOnlyDictionary<string, object?>? Parameters { get; init; }
    }

    internal sealed class WebUIAttachResult
    {
        public required ServerChangeSet InitialChanges { get; init; }

        /// <summary>The page was rendered from another compile of its view: it reloads rather than applies anything.</summary>
        public bool Reload { get; init; }
    }

    internal sealed class WebUIValueChangeRequest
    {
        public required int ComponentId { get; init; }

        public required string PropertyName { get; init; }

        public object?[] DynamicParameters { get; init; } = [];

        public object? Value { get; init; }
    }

    internal sealed class WebUISetThemeRequest
    {
        /// <summary>The theme the document is now in: <c>light</c>, <c>dark</c>, or <c>auto</c>.</summary>
        public required string Theme { get; init; }
    }

    internal sealed class WebUIChangeSetRequest
    {
        public required WebUIValueChangeRequest[] Updates { get; init; }
    }

    internal sealed class WebUIItemWindowRequest
    {
        public required int ComponentId { get; init; }

        public object?[] DynamicParameters { get; init; } = [];

        public required string Anchor { get; init; }

        public int Offset { get; init; }

        public string? Key { get; init; }

        public required int Count { get; init; }

        public bool Extend { get; init; }
    }

    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Debug, Message = "Web UI SignalR connection opened '{ConnectionId}'.")]
        public static partial void ConnectionOpened(ILogger logger, string connectionId);

        [LoggerMessage(EventId = 2, Level = LogLevel.Debug, Message = "Web UI SignalR connection closed '{ConnectionId}'.")]
        public static partial void ConnectionClosed(ILogger logger, string connectionId);

        [LoggerMessage(EventId = 3, Level = LogLevel.Debug, Message = "Web UI SignalR connection closed '{ConnectionId}' with exception.")]
        public static partial void ConnectionClosedWithException(ILogger logger, Exception exception, string connectionId);

        [LoggerMessage(EventId = 4, Level = LogLevel.Debug, Message = "Attaching web UI route '{Route}' for tab '{ClientWindowId}' and connection '{ConnectionId}'.")]
        public static partial void Attaching(ILogger logger, string route, string clientWindowId, string connectionId);

        [LoggerMessage(EventId = 5, Level = LogLevel.Debug, Message = "Attached web UI route '{Route}' for tab '{ClientWindowId}', connection '{ConnectionId}', runtime '{HasRuntime}'.")]
        public static partial void Attached(ILogger logger, string route, string clientWindowId, string connectionId, bool hasRuntime);

        [LoggerMessage(EventId = 6, Level = LogLevel.Debug, Message = "Detached web UI SignalR connection '{ConnectionId}'.")]
        public static partial void Detached(ILogger logger, string connectionId);

        [LoggerMessage(EventId = 7, Level = LogLevel.Debug, Message = "Web UI SignalR connection '{ConnectionId}' did not have an attached runtime.")]
        public static partial void DetachSkipped(ILogger logger, string connectionId);

        [LoggerMessage(EventId = 8, Level = LogLevel.Debug, Message = "Stored theme '{Theme}' on session '{SessionId}'.")]
        public static partial void ThemeStored(ILogger logger, string theme, string sessionId);

        [LoggerMessage(EventId = 9, Level = LogLevel.Debug, Message = "Theme '{Theme}' was not stored: connection '{ConnectionId}' presented no session.")]
        public static partial void ThemeNotStored(ILogger logger, string theme, string connectionId);

        [LoggerMessage(EventId = 10, Level = LogLevel.Information, Message = "Web UI route '{Route}' presented view '{PageView}' where the compile is '{View}': the page reloads.")]
        public static partial void ViewChanged(ILogger logger, string route, string pageView, string view);
    }

    private const string HandleContextItemKey = "NE.Standard.UI.Web.Handle";

    private readonly IUIHost _host;
    private readonly IWebViewRenderCache _renderCache;
    private readonly IWebViewRenderer _renderer;
    private readonly UIApplication _application;
    private readonly IUserSessionStore _sessions;
    private readonly ILogger<WebUIHub> _logger;

    public WebUIHub(IUIHost host, IWebViewRenderCache renderCache, IWebViewRenderer renderer, UIApplication application, IUserSessionStore sessions, ILogger<WebUIHub> logger)
    {
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(renderCache);
        ArgumentNullException.ThrowIfNull(renderer);
        ArgumentNullException.ThrowIfNull(application);
        ArgumentNullException.ThrowIfNull(sessions);
        ArgumentNullException.ThrowIfNull(logger);

        _host = host;
        _renderCache = renderCache;
        _renderer = renderer;
        _application = application;
        _sessions = sessions;
        _logger = logger;
    }

    public override Task OnConnectedAsync()
    {
        Log.ConnectionOpened(_logger, Context.ConnectionId);

        return base.OnConnectedAsync();
    }

    public async Task<WebUIAttachResult> AttachAsync(WebUIAttachRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.ClientWindowId);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Route);

        var route = UIRoutePath.Normalize(request.Route);

        Log.Attaching(_logger, route, request.ClientWindowId, Context.ConnectionId);

        UINavigationRequest navigation = new()
        {
            Route = route,
            Parameters = request.Parameters
        };

        UserSessionInitData session = CreateSession(request.ClientWindowId);

        UIViewResolution view = await _host.ResolveViewAsync(
            navigation,
            session,
            UIViewRequestPhase.Attach,
            Context.ConnectionAborted
        ).ConfigureAwait(false);

        // A page of another compile — the code changed under it — holds ids that address nothing here: reloaded, not fed updates.
        if (request.View is not null && !string.Equals(request.View, view.View.Fingerprint, StringComparison.Ordinal))
        {
            Log.ViewChanged(_logger, route, request.View, view.View.Fingerprint);

            return new WebUIAttachResult
            {
                InitialChanges = ServerChangeSet.Empty,
                Reload = true
            };
        }

        // The resolved navigation, not the requested one: a controller must see the route it's actually running, redirects included.
        RuntimeResolution runtime = await _host.AttachRuntimeAsync(
            view,
            new UIInstance()
            {
                Id = Context.ConnectionId,
                WindowId = request.ClientWindowId,
                Navigation = view.Navigation,
                PageId = request.PageId
            },
            Context.ConnectionAborted
        ).ConfigureAwait(false);

        // Gone after a restart cleared the cache while this page stayed open: rendered again, so its values are re-sent as on a load.
        IReadOnlyList<int> initBindingIds = await _renderCache.GetInitBindingIdsAsync(
            WebViewCacheKeys.Create(view),
            Context.ConnectionAborted
        ).ConfigureAwait(false) ?? await RenderInitBindingIdsAsync(view).ConfigureAwait(false);

        ServerChangeSet initialChanges = await WebInitialChanges.BuildAsync(runtime.Runtime, initBindingIds, Context.ConnectionAborted).ConfigureAwait(false);

        if (runtime.Runtime is not null)
            Context.Items[HandleContextItemKey] = runtime.Handle;

        Log.Attached(_logger, route, request.ClientWindowId, Context.ConnectionId, runtime.Runtime is not null);

        return new WebUIAttachResult
        {
            InitialChanges = initialChanges
        };
    }

    private async ValueTask<IReadOnlyList<int>> RenderInitBindingIdsAsync(UIViewResolution view)
    {
        WebCachedViewRender render = await WebEndpointRouteBuilderExtensions.GetOrRenderViewAsync(view, _renderer, _renderCache, Context.ConnectionAborted).ConfigureAwait(false);

        return render.InitBindingIds ?? [];
    }

    /// <summary>
    /// Reads the session the shell render already issued; the hub cannot write a cookie, so it only ever presents one.
    /// </summary>
    private UserSessionInitData CreateSession(string clientWindowId)
    {
        HttpContext? http = Context.GetHttpContext();

        return new UserSessionInitData
        {
            SessionId = http is null ? null : WebEndpointRouteBuilderExtensions.ReadSessionCookie(http, _application.Sessions),
            ConnectionId = Context.ConnectionId,
            ClientWindowId = clientWindowId,
            Credential = Context.User?.Identity?.IsAuthenticated == true ? Context.User.Identity.Name : null,
            Principal = Context.User
        };
    }

    /// <summary>
    /// Records the theme the client moved to, so the next page render starts in it; written straight to the
    /// session store since a page with no controller has no runtime.
    /// </summary>
    public async Task SetThemeAsync(WebUISetThemeRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Theme);

        UIThemeMode? mode = WebCssValues.TryReadThemeName(request.Theme, out UIThemeMode value) ? value : null;

        HttpContext? http = Context.GetHttpContext();
        var sessionId = http is null ? null : WebEndpointRouteBuilderExtensions.ReadSessionCookie(http, _application.Sessions);

        if (string.IsNullOrWhiteSpace(sessionId))
        {
            // No cookie means no session to remember it in; the theme still applies for as long as the page lives.
            Log.ThemeNotStored(_logger, request.Theme, Context.ConnectionId);
            return;
        }

        var stored = await _sessions.SetThemeModeAsync(sessionId, mode, Context.ConnectionAborted).ConfigureAwait(false);

        if (stored)
            Log.ThemeStored(_logger, request.Theme, sessionId);
    }

    public async Task<UICommandExecutionResult> ProcessEventAsync(UICommandRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        request.Validate();

        if (!Context.Items.TryGetValue(HandleContextItemKey, out var value) || value is not UIHandle handle)
            throw new InvalidOperationException($"Web UI connection '{Context.ConnectionId}' is not attached.");

        return await _host
            .ProcessEventAsync(handle, request, Context.ConnectionAborted)
            .ConfigureAwait(false);
    }

    public async Task<ServerChangeSet> ProcessChangeSetAsync(WebUIChangeSetRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(request.Updates);

        if (!Context.Items.TryGetValue(HandleContextItemKey, out var value) || value is not UIHandle handle)
            throw new InvalidOperationException($"Web UI connection '{Context.ConnectionId}' is not attached.");

        ClientChangeSet changeSet = new() { Updates = [.. request.Updates.Select(CreateClientValueUpdate)] };

        return await _host
            .ProcessChangeSetAsync(handle, changeSet, Context.ConnectionAborted)
            .ConfigureAwait(false);
    }

    private static ClientValueUIUpdate CreateClientValueUpdate(WebUIValueChangeRequest update)
    {
        ArgumentNullException.ThrowIfNull(update);
        ArgumentException.ThrowIfNullOrWhiteSpace(update.PropertyName);

        return new ClientValueUIUpdate
        {
            Address = new UIPropertyAddress(new UIComponentId(update.ComponentId), update.PropertyName),
            DynamicParameters = update.DynamicParameters ?? [],
            Value = update.Value
        };
    }

    public async Task<ServerChangeSet> RequestItemWindowAsync(WebUIItemWindowRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (!Context.Items.TryGetValue(HandleContextItemKey, out var value) || value is not UIHandle handle)
            throw new InvalidOperationException($"Web UI connection '{Context.ConnectionId}' is not attached.");

        return await _host
            .RequestItemWindowAsync(handle, CreateItemWindowRequest(request), Context.ConnectionAborted)
            .ConfigureAwait(false);
    }

    /// <summary>
    /// Reads the anchor by name; the wire carries the four fields flat since an anchor is a union of one meaningful member.
    /// </summary>
    private static UIItemWindowClientRequest CreateItemWindowRequest(WebUIItemWindowRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Anchor);

        if (!Enum.TryParse(request.Anchor, ignoreCase: true, out UIItemAnchorKind kind) || !Enum.IsDefined(kind))
            throw new InvalidOperationException($"Item window anchor '{request.Anchor}' is not supported.");

        UIItemAnchor anchor = kind switch
        {
            UIItemAnchorKind.Start => UIItemAnchor.Start,
            UIItemAnchorKind.End => UIItemAnchor.End,
            UIItemAnchorKind.Offset => UIItemAnchor.At(request.Offset),
            UIItemAnchorKind.Before => UIItemAnchor.Before(request.Key ?? throw new InvalidOperationException("A 'Before' anchor needs an item key.")),
            UIItemAnchorKind.After => UIItemAnchor.After(request.Key ?? throw new InvalidOperationException("An 'After' anchor needs an item key.")),
            _ => throw new UnreachableException()
        };

        return new UIItemWindowClientRequest
        {
            ComponentId = new UIComponentId(request.ComponentId),
            DynamicParameters = request.DynamicParameters ?? [],
            Anchor = anchor,
            Count = request.Count,
            Mode = request.Extend ? UIItemWindowMode.Extend : UIItemWindowMode.Replace
        };
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Log.ConnectionClosed(_logger, Context.ConnectionId);

        if (exception is not null)
            Log.ConnectionClosedWithException(_logger, exception, Context.ConnectionId);

        var detached = _host.DetachRuntime(Context.ConnectionId);

        if (detached)
            Log.Detached(_logger, Context.ConnectionId);
        else
            Log.DetachSkipped(_logger, Context.ConnectionId);

        await base.OnDisconnectedAsync(exception).ConfigureAwait(false);
    }
}
