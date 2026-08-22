using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
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
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Hosting;

internal sealed partial class WebUIHub : Hub
{
    internal sealed class WebUIAttachRequest
    {
        public required string ClientTabId { get; init; }

        public required string Route { get; init; }

        public IReadOnlyDictionary<string, object?>? Parameters { get; init; }
    }

    internal sealed class WebUIAttachResult
    {
        public required ServerChangeSet InitialChanges { get; init; }
    }

    internal sealed class WebUIValueChangeRequest
    {
        public required int ComponentId { get; init; }

        public required string PropertyName { get; init; }

        public object?[] DynamicParameters { get; init; } = [];

        public object? Value { get; init; }
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

        [LoggerMessage(EventId = 4, Level = LogLevel.Debug, Message = "Attaching web UI route '{Route}' for tab '{ClientTabId}' and connection '{ConnectionId}'.")]
        public static partial void Attaching(ILogger logger, string route, string clientTabId, string connectionId);

        [LoggerMessage(EventId = 5, Level = LogLevel.Debug, Message = "Attached web UI route '{Route}' for tab '{ClientTabId}', connection '{ConnectionId}', runtime '{HasRuntime}'.")]
        public static partial void Attached(ILogger logger, string route, string clientTabId, string connectionId, bool hasRuntime);

        [LoggerMessage(EventId = 6, Level = LogLevel.Debug, Message = "Detached web UI SignalR connection '{ConnectionId}'.")]
        public static partial void Detached(ILogger logger, string connectionId);

        [LoggerMessage(EventId = 7, Level = LogLevel.Debug, Message = "Web UI SignalR connection '{ConnectionId}' did not have an attached runtime.")]
        public static partial void DetachSkipped(ILogger logger, string connectionId);
    }

    private const string HandleContextItemKey = "NE.Standard.UI.Web.Handle";

    private readonly IUIHost _host;
    private readonly IWebViewRenderCache _renderCache;
    private readonly UIApplication _application;
    private readonly ILogger<WebUIHub> _logger;

    public WebUIHub(IUIHost host, IWebViewRenderCache renderCache, UIApplication application, ILogger<WebUIHub> logger)
    {
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(renderCache);
        ArgumentNullException.ThrowIfNull(application);
        ArgumentNullException.ThrowIfNull(logger);

        _host = host;
        _renderCache = renderCache;
        _application = application;
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
        ArgumentException.ThrowIfNullOrWhiteSpace(request.ClientTabId);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Route);

        var route = UIRoutePath.Normalize(request.Route);

        Log.Attaching(_logger, route, request.ClientTabId, Context.ConnectionId);

        UINavigationRequest navigation = new()
        {
            Route = route,
            Parameters = request.Parameters
        };

        UserSessionInitData session = CreateSession(request.ClientTabId);

        UIViewResolution view = await _host.ResolveViewAsync(
            navigation,
            session,
            UIViewRequestPhase.RuntimeAttach,
            Context.ConnectionAborted
        ).ConfigureAwait(false);

        // The resolved navigation, not the requested one: resolution may have redirected, and a controller
        // reading its own navigation has to see the route it is actually running plus the parameters the
        // redirect attached — the returnUrl of a refused route, the message of a failed one.
        RuntimeResolution runtime = await _host.AttachRuntimeAsync(
            view,
            new UIInstance()
            {
                Id = Context.ConnectionId,
                TabId = request.ClientTabId,
                Navigation = view.Navigation
            },
            Context.ConnectionAborted
        ).ConfigureAwait(false);

        IReadOnlyList<int> initBindingIds = await _renderCache.GetInitBindingIdsAsync(
            WebViewCacheKeys.Create(view),
            Context.ConnectionAborted
        ).ConfigureAwait(false) ?? [];

        ServerChangeSet initialChanges = await BuildInitialChangesAsync(runtime.Runtime, initBindingIds, Context.ConnectionAborted).ConfigureAwait(false);

        if (runtime.Runtime is not null)
            Context.Items[HandleContextItemKey] = runtime.Handle;

        Log.Attached(_logger, route, request.ClientTabId, Context.ConnectionId, runtime.Runtime is not null);

        return new WebUIAttachResult
        {
            InitialChanges = initialChanges
        };
    }

    private static async Task<ServerChangeSet> BuildInitialChangesAsync(IUIRuntime? runtime, IReadOnlyList<int> initBindingIds, CancellationToken cancellationToken)
    {
        if (runtime is null)
            return ServerChangeSet.Empty;

        ServerChangeSet valueChanges = await runtime.BuildInitialChangeSetAsync(
            [.. initBindingIds.Select(static bindingId => new UIBindingId(bindingId))],
            cancellationToken
        ).ConfigureAwait(false);

        IReadOnlyList<ServerCollectionChangeUIUpdate> collectionChanges = await runtime.BuildInitialCollectionChangesAsync(cancellationToken).ConfigureAwait(false);

        return collectionChanges.Count == 0
            ? valueChanges
            : new ServerChangeSet { Updates = [.. valueChanges.Updates, .. collectionChanges] };
    }

    /// <summary>
    /// Reads the session the shell render already issued. The hub cannot write a cookie — a WebSocket has no
    /// response headers — so it only ever presents one, and a missing cookie means the store issues a fresh
    /// session that this connection alone will use.
    /// </summary>
    private UserSessionInitData CreateSession(string clientTabId)
    {
        HttpContext? http = Context.GetHttpContext();

        return new UserSessionInitData
        {
            SessionId = http is null ? null : WebEndpointRouteBuilderExtensions.ReadSessionCookie(http, _application.Sessions),
            ConnectionId = Context.ConnectionId,
            ClientTabId = clientTabId,
            Credential = Context.User?.Identity?.IsAuthenticated == true ? Context.User.Identity.Name : null,
            Principal = Context.User
        };
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
    /// Reads the anchor by name. The wire carries the four fields flat rather than a nested object, because
    /// an anchor is a union and only one of its members means anything at a time.
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
