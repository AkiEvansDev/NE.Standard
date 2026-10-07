using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Application;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Sessions;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Localization;
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

        /// <summary>
        /// The sequence the render wrote in the page, on the page's first attach: the runtime it prepared sends only what moved past it.
        /// </summary>
        public long? Since { get; init; }

        /// <summary>The runtime the page's last attach was answered with, on any attach after its first.</summary>
        public string? Runtime { get; init; }

        public IReadOnlyDictionary<string, object?>? Parameters { get; init; }

        /// <summary>The time zone the browser reports it is in (<c>Intl.DateTimeFormat().resolvedOptions().timeZone</c>).</summary>
        public string? TimeZone { get; init; }

        /// <summary>What the page reports of itself as it attaches; none from a page that does not report.</summary>
        public WebUIClientStateRequest? ClientState { get; init; }
    }

    internal sealed class WebUIClientStateRequest
    {
        /// <summary>Whether the page is on screen now: <c>document.visibilityState</c> is <c>visible</c>.</summary>
        public bool Visible { get; init; } = true;

        /// <summary>What the browser lets the page show: <c>Notification.permission</c>, or unsupported where it has none.</summary>
        public UINotificationPermission NotificationPermission { get; init; }

        public UIClientState ToClientState()
            => Enum.IsDefined(NotificationPermission)
                ? new UIClientState(Visible, NotificationPermission)
                : throw new InvalidOperationException($"Notification permission '{NotificationPermission}' is not one a page reports.");
    }

    internal sealed class WebUIAttachResult
    {
        public required ServerChangeSet InitialChanges { get; init; }

        /// <summary>
        /// The page was rendered from another compile of its view, or presented no session the store holds: it reloads rather than
        /// applies anything.
        /// </summary>
        public bool Reload { get; init; }

        /// <summary>The runtime the page attached to, which its later attaches present.</summary>
        public string? Runtime { get; init; }

        /// <summary>
        /// The page held another runtime, which is gone — a restart, an eviction, a retention run out, another tab that rebuilt it — so
        /// what it shows belongs to nothing: it reloads rather than applies anything, and carries no changes.
        /// </summary>
        public bool Fresh { get; init; }
    }

    internal sealed class WebUIValueChangeRequest
    {
        public required int ComponentId { get; init; }

        public required string PropertyName { get; init; }

        [JsonConverter(typeof(UIDynamicParametersJsonConverter))]
        public object?[] DynamicParameters { get; init; } = [];

        public object? Value { get; init; }

        /// <summary>The token of a value staged beside the hub, carried instead of <see cref="Value"/> when the value is large.</summary>
        public string? ValueToken { get; init; }
    }

    internal sealed class WebUILeaveRequest
    {
        /// <summary>The address of this site the reader starts to leave for, its query and fragment included.</summary>
        public required string Target { get; init; }
    }

    internal sealed class WebUIAddressRequest
    {
        /// <summary>The query of the history entry the reader went back or forward to, read as an attach reads it.</summary>
        public IReadOnlyDictionary<string, object?>? Parameters { get; init; }
    }

    internal sealed class WebUISetThemeRequest
    {
        /// <summary>The theme the document is now in: <c>light</c>, <c>dark</c>, or <c>auto</c>.</summary>
        public required string Theme { get; init; }
    }

    internal sealed class WebUISetThemeColorsRequest
    {
        /// <summary>The colours the page puts over the application's palette, or none for the application's.</summary>
        public UIThemeColors? Colors { get; init; }
    }

    /// <summary>The stylesheet the reader's colours make, to follow the theme's; empty for the application's palette.</summary>
    internal sealed class WebUIThemeColorsResult
    {
        public required string Css { get; init; }
    }

    internal sealed class WebUISetLanguageRequest
    {
        /// <summary>The language the page switches to; one the translator lists.</summary>
        public required string Language { get; init; }
    }

    /// <summary>The language the page is now in, and the address of the words it translates by.</summary>
    internal sealed class WebUILanguageResult
    {
        public required string Language { get; init; }

        public required string Href { get; init; }
    }

    internal sealed class WebUITranslateRequest
    {
        public required string Language { get; init; }

        public string[] Keys { get; init; } = [];
    }

    /// <summary>The words asked for that the translator has, with each key's plural forms; a key left out has none.</summary>
    internal sealed class WebUITranslateResult
    {
        public required string Language { get; init; }

        public required IReadOnlyDictionary<string, string> Words { get; init; }
    }

    internal sealed class WebUIChangeSetRequest
    {
        public required WebUIValueChangeRequest[] Updates { get; init; }
    }

    internal sealed class WebUIItemWindowRequest
    {
        public required int ComponentId { get; init; }

        [JsonConverter(typeof(UIDynamicParametersJsonConverter))]
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

        [LoggerMessage(EventId = 5, Level = LogLevel.Debug, Message = "Attached web UI route '{Route}' for tab '{ClientWindowId}', connection '{ConnectionId}', runtime '{HasRuntime}', in {ElapsedMs:F1} ms with {ChangeCount} initial change(s).")]
        public static partial void Attached(ILogger logger, string route, string clientWindowId, string connectionId, bool hasRuntime, double elapsedMs, int changeCount);

        [LoggerMessage(EventId = 6, Level = LogLevel.Debug, Message = "Detached web UI SignalR connection '{ConnectionId}'.")]
        public static partial void Detached(ILogger logger, string connectionId);

        [LoggerMessage(EventId = 7, Level = LogLevel.Debug, Message = "Web UI SignalR connection '{ConnectionId}' did not have an attached runtime.")]
        public static partial void DetachSkipped(ILogger logger, string connectionId);

        [LoggerMessage(EventId = 8, Level = LogLevel.Debug, Message = "Stored theme '{Theme}' on connection '{ConnectionId}'s session.")]
        public static partial void ThemeStored(ILogger logger, string theme, string connectionId);

        [LoggerMessage(EventId = 9, Level = LogLevel.Debug, Message = "Theme '{Theme}' was not stored: connection '{ConnectionId}' presented no stored session.")]
        public static partial void ThemeNotStored(ILogger logger, string theme, string connectionId);

        [LoggerMessage(EventId = 10, Level = LogLevel.Information, Message = "Web UI route '{Route}' presented view '{PageView}' where the compile is '{View}': the page reloads.")]
        public static partial void ViewChanged(ILogger logger, string route, string pageView, string view);

        [LoggerMessage(EventId = 11, Level = LogLevel.Debug, Message = "Stored language '{Language}' on connection '{ConnectionId}'s session.")]
        public static partial void LanguageStored(ILogger logger, string language, string connectionId);

        [LoggerMessage(EventId = 12, Level = LogLevel.Debug, Message = "Language '{Language}' was not stored: connection '{ConnectionId}' presented no stored session.")]
        public static partial void LanguageNotStored(ILogger logger, string language, string connectionId);

        [LoggerMessage(EventId = 13, Level = LogLevel.Debug, Message = "Stored theme colours on connection '{ConnectionId}'s session.")]
        public static partial void ThemeColorsStored(ILogger logger, string connectionId);

        [LoggerMessage(EventId = 14, Level = LogLevel.Debug, Message = "Theme colours were not stored: connection '{ConnectionId}' presented no stored session.")]
        public static partial void ThemeColorsNotStored(ILogger logger, string connectionId);

        [LoggerMessage(EventId = 15, Level = LogLevel.Warning, Message = "An attach to route '{Route}' was refused: connection '{ConnectionId}' is already attached to another page.")]
        public static partial void SecondAttachRefused(ILogger logger, string route, string connectionId);

        [LoggerMessage(EventId = 16, Level = LogLevel.Information, Message = "Web UI route '{Route}' for tab '{ClientWindowId}' found a runtime built since the page attached: the page reloads.")]
        public static partial void RuntimeFresh(ILogger logger, string route, string clientWindowId);
    }

    private const string HandleContextItemKey = "NE.Standard.UI.Web.Handle";

    // Shared: an answer that carries nothing but the reload.
    private static readonly WebUIAttachResult ReloadResult = new()
    {
        InitialChanges = ServerChangeSet.Empty,
        Reload = true
    };

    // What one ask for words may carry: a page asks per frame for the keys its table lacked, never a whole dictionary.
    private const int MaxTranslateKeys = 256;
    private const int MaxTranslateKeyLength = 512;

    private readonly IUIHost _host;
    private readonly IWebViewRenderCache _renderCache;
    private readonly IWebViewRenderer _renderer;
    private readonly UIApplication _application;
    private readonly WebSessionCookie _sessionCookie;
    private readonly IUserSessionStore _sessions;
    private readonly WebValueStagingStore _stagedValues;
    private readonly WebOutgoingValues _outgoing;
    private readonly WebUIMetrics _metrics;
    private readonly IEnumerable<IUIStringsSource> _packageStrings;
    private readonly ILogger<WebUIHub> _logger;

    public WebUIHub(IUIHost host, IWebViewRenderCache renderCache, IWebViewRenderer renderer, UIApplication application, WebSessionCookie sessionCookie, IUserSessionStore sessions, WebValueStagingStore stagedValues, WebOutgoingValues outgoing, WebUIMetrics metrics, IEnumerable<IUIStringsSource> packageStrings, ILogger<WebUIHub> logger)
    {
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(renderCache);
        ArgumentNullException.ThrowIfNull(renderer);
        ArgumentNullException.ThrowIfNull(application);
        ArgumentNullException.ThrowIfNull(sessionCookie);
        ArgumentNullException.ThrowIfNull(sessions);
        ArgumentNullException.ThrowIfNull(stagedValues);
        ArgumentNullException.ThrowIfNull(outgoing);
        ArgumentNullException.ThrowIfNull(metrics);
        ArgumentNullException.ThrowIfNull(packageStrings);
        ArgumentNullException.ThrowIfNull(logger);

        _host = host;
        _renderCache = renderCache;
        _renderer = renderer;
        _application = application;
        _sessionCookie = sessionCookie;
        _sessions = sessions;
        _stagedValues = stagedValues;
        _outgoing = outgoing;
        _metrics = metrics;
        _packageStrings = packageStrings;
        _logger = logger;
    }

    public override Task OnConnectedAsync()
    {
        Log.ConnectionOpened(_logger, Context.ConnectionId);
        _metrics.ConnectionOpened();

        return base.OnConnectedAsync();
    }

    public async Task<WebUIAttachResult> AttachAsync(WebUIAttachRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.ClientWindowId);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Route);

        var route = UIRoutePath.Normalize(request.Route);
        var started = Stopwatch.GetTimestamp();

        Log.Attaching(_logger, route, request.ClientWindowId, Context.ConnectionId);

        UINavigationRequest navigation = new()
        {
            Route = route,
            Parameters = request.Parameters
        };

        UserSessionInitData session = CreateSession(request.ClientWindowId, request.TimeZone);

        // No session the store holds (none presented, an unknown one, one gone idle, a store emptied by a restart): one issued here
        // could never reach the browser, whose cookie only a page load writes — so the page reloads, and its render issues one.
        UIViewResolution? view = _host is UIHost host
            ? await host.ResolvePresentedViewAsync(navigation, session, Context.ConnectionAborted).ConfigureAwait(false)
            : await _host.ResolveViewAsync(navigation, session, UIViewRequestPhase.Attach, Context.ConnectionAborted).ConfigureAwait(false);

        if (view is null)
            return ReloadResult;

        // A page of another compile — the code changed under it — holds ids that address nothing here: reloaded, not fed updates.
        if (request.View is not null && !string.Equals(request.View, view.View.Fingerprint, StringComparison.Ordinal))
        {
            Log.ViewChanged(_logger, route, request.View, view.View.Fingerprint);

            return ReloadResult;
        }

        // One connection is one page: it attaches again to the runtime it holds (a full resync, a lost staged value), never to
        // another, which would leave the first kept for its whole retention.
        if (!MayAttach(view, request.ClientWindowId))
        {
            Log.SecondAttachRefused(_logger, route, Context.ConnectionId);

            throw new InvalidOperationException($"Web UI connection '{Context.ConnectionId}' is already attached to another page.");
        }

        // The resolved navigation, not the requested one: a controller must see the route it's actually running, redirects included.
        RuntimeResolution runtime = await _host.AttachRuntimeAsync(
            view,
            new UIInstance()
            {
                Id = Context.ConnectionId,
                WindowId = request.ClientWindowId,
                Navigation = view.Navigation,
                PageId = request.PageId,
                StartsFromSnapshot = true,
                ClientState = request.ClientState?.ToClientState() ?? UIClientState.Unreported
            },
            Context.ConnectionAborted
        ).ConfigureAwait(false);

        // The runtime the page held is gone, and what the page shows — fields it accepted, a dialog, unsaved work — with it: applying
        // this one's snapshot would leave a mixture, so the page reloads, and nothing is built for it.
        if (request.Runtime is not null && runtime.RuntimeId is not null && !string.Equals(request.Runtime, runtime.RuntimeId, StringComparison.Ordinal))
        {
            Context.Items[HandleContextItemKey] = runtime.Handle;
            Log.RuntimeFresh(_logger, route, request.ClientWindowId);

            return new WebUIAttachResult
            {
                InitialChanges = ServerChangeSet.Empty,
                Fresh = true
            };
        }

        // Gone after a restart cleared the cache while this page stayed open: rendered again, so its values are re-sent as on a load.
        IReadOnlyList<int> initBindingIds = await _renderCache.GetInitBindingIdsAsync(
            WebViewCacheKeys.Create(view),
            Context.ConnectionAborted
        ).ConfigureAwait(false) ?? await RenderInitBindingIdsAsync(view).ConfigureAwait(false);

        // The snapshot also marks this connection's starting point: nothing queued before it is pushed to it, everything after it is.
        ServerChangeSet initialChanges = runtime.Runtime is null
            ? ServerChangeSet.Empty
            : await runtime.Runtime.BuildAttachChangesAsync(Context.ConnectionId, [.. initBindingIds.Select(static bindingId => new UIBindingId(bindingId))], request.Since, Context.ConnectionAborted).ConfigureAwait(false);

        if (runtime.Runtime is not null)
            Context.Items[HandleContextItemKey] = runtime.Handle;

        TimeSpan elapsed = Stopwatch.GetElapsedTime(started);

        Log.Attached(_logger, route, request.ClientWindowId, Context.ConnectionId, runtime.Runtime is not null, elapsed.TotalMilliseconds, initialChanges.Updates.Length);

        return new WebUIAttachResult
        {
            InitialChanges = _outgoing.StageAttach(initialChanges, runtime.Handle.Session.SessionId, Context.ConnectionId),
            Runtime = runtime.RuntimeId
        };
    }

    /// <summary>Whether this connection may attach: one holding no handle may, one holding a handle only to that handle's runtime from its tab.</summary>
    private bool MayAttach(UIViewResolution view, string clientWindowId)
    {
        if (!Context.Items.TryGetValue(HandleContextItemKey, out var value) || value is not UIHandle held)
            return true;

        return _host is UIHost host
            ? host.NamesRuntimeOf(held, view, clientWindowId)
            : string.Equals(held.Instance.WindowId, clientWindowId, StringComparison.Ordinal);
    }

    /// <summary>
    /// Reads the session the shell render already issued; the hub cannot write a cookie, so it only ever presents one.
    /// </summary>
    /// <remarks>The connection is the one the hub's own request describes: the transport's, over the page's origin.</remarks>
    private UserSessionInitData CreateSession(string clientWindowId, string? timeZone)
    {
        HttpContext? http = Context.GetHttpContext();

        return new UserSessionInitData
        {
            SessionId = ReadSessionId(http),
            ConnectionId = Context.ConnectionId,
            ClientWindowId = clientWindowId,
            Credential = Context.User?.Identity?.IsAuthenticated == true ? Context.User.Identity.Name : null,
            Principal = Context.User,
            Connection = http is null ? UIConnectionInfo.Unknown : WebClientRequest.ReadConnection(http),
            Languages = http is null ? [] : WebClientRequest.ReadLanguages(http),
            TimeZone = timeZone
        };
    }

    /// <summary>The session the page's cookie names, or none where the connection has no request or the request no cookie.</summary>
    private string? ReadSessionId(HttpContext? http)
        => http is null ? null : WebClientRequest.ReadSessionId(http, _sessionCookie);

    private async ValueTask<IReadOnlyList<int>> RenderInitBindingIdsAsync(UIViewResolution view)
    {
        WebCachedViewRender render = await WebEndpointRouteBuilderExtensions.GetOrRenderViewAsync(view, _renderer, _renderCache, Context.ConnectionAborted).ConfigureAwait(false);

        return render.InitBindingIds ?? [];
    }

    /// <summary>Records what the page reports of itself — on screen or not, its notification permission — on its connection.</summary>
    /// <remarks>What the client says: it steers whether a notification shows on the screen or the system's, never what is allowed.</remarks>
    public async Task ReportClientStateAsync(WebUIClientStateRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        UIClientState state = request.ToClientState();

        // A page with no controller holds no handle, and nothing reads what it reports.
        if (_host is UIHost host && Context.Items.TryGetValue(HandleContextItemKey, out var value) && value is UIHandle handle)
            await host.ReportClientStateAsync(handle, state, Context.ConnectionAborted).ConfigureAwait(false);
    }

    /// <summary>
    /// Records the theme the client moved to, so the next page render starts in it; written straight to the
    /// session store since a page with no controller has no runtime.
    /// </summary>
    public async Task SetThemeAsync(WebUISetThemeRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Theme);

        UIThemeMode? mode = WebCssValues.TryReadThemeName(request.Theme, out UIThemeMode value)
            ? value
            : request.Theme == WebCssValues.RootThemeName(null) ? null : throw new InvalidOperationException($"Theme '{request.Theme}' is not light, dark or auto.");

        var sessionId = ReadSessionId(Context.GetHttpContext());
        UserSessionState? written = string.IsNullOrWhiteSpace(sessionId)
            ? null
            : await _sessions.SetThemeModeAsync(sessionId, mode, Context.ConnectionAborted).ConfigureAwait(false);

        if (written is null)
        {
            // No session to remember it in; the theme still applies for as long as the page lives.
            Log.ThemeNotStored(_logger, request.Theme, Context.ConnectionId);
            return;
        }

        Log.ThemeStored(_logger, request.Theme, Context.ConnectionId);

        await ApplyStoredSessionAsync(written).ConfigureAwait(false);
    }

    /// <summary>
    /// Makes a session the page stored its connection's — its controller told, where it has one — and reaches the session's other
    /// pages, which follow as the page did.
    /// </summary>
    private async Task ApplyStoredSessionAsync(UserSessionState written)
    {
        if (_host is not UIHost host)
            return;

        if (Context.Items.TryGetValue(HandleContextItemKey, out var value) && value is UIHandle handle)
            await host.ApplySessionChangeAsync(handle, written, Context.ConnectionAborted).ConfigureAwait(false);
        else
            await host.ReachSessionAsync(written, origin: null, originRuntime: null, Context.ConnectionAborted).ConfigureAwait(false);
    }

    /// <summary>
    /// Records the colours the page moved to, so the next page render starts in them, and answers the stylesheet they make — the
    /// one a render of the session carries.
    /// </summary>
    /// <remarks>Answered whether or not a session stored them: the page wears them for as long as it lives, as it does a theme.</remarks>
    public async Task<WebUIThemeColorsResult> SetThemeColorsAsync(WebUISetThemeColorsRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        request.Colors?.Validate();

        var sessionId = ReadSessionId(Context.GetHttpContext());
        UserSessionState? written = string.IsNullOrWhiteSpace(sessionId)
            ? null
            : await _sessions.SetThemeColorsAsync(sessionId, request.Colors, Context.ConnectionAborted).ConfigureAwait(false);

        if (written is null)
        {
            Log.ThemeColorsNotStored(_logger, Context.ConnectionId);
        }
        else
        {
            Log.ThemeColorsStored(_logger, Context.ConnectionId);

            await ApplyStoredSessionAsync(written).ConfigureAwait(false);
        }

        return new WebUIThemeColorsResult
        {
            Css = WebThemeColorsCss.For(_application.Theme, request.Colors)
        };
    }

    /// <summary>Switches the session to a language the translator lists and answers where its words are.</summary>
    /// <remarks>
    /// The next page renders in it. With a controller, this page's session is refreshed and the controller told as a command would;
    /// without one it switches all the same, as the theme does. Either way the session's other pages under a controller follow.
    /// </remarks>
    public async Task<WebUILanguageResult> SetLanguageAsync(WebUISetLanguageRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Language);

        EnsureTranslatesInto(request.Language);

        var sessionId = ReadSessionId(Context.GetHttpContext());
        UserSessionState? written = string.IsNullOrWhiteSpace(sessionId)
            ? null
            : await _sessions.SetLanguageAsync(sessionId, request.Language, Context.ConnectionAborted).ConfigureAwait(false);

        if (written is null)
        {
            // The page still switches for as long as it lives; the next render reads the session, which never heard of it.
            Log.LanguageNotStored(_logger, request.Language, Context.ConnectionId);
        }
        else
        {
            Log.LanguageStored(_logger, request.Language, Context.ConnectionId);

            await ApplyStoredSessionAsync(written).ConfigureAwait(false);
        }

        WebWordsAsset words = WebWordsEndpoint.Resolve(_application, request.Language, _packageStrings);

        return new WebUILanguageResult
        {
            Language = words.Language,
            Href = words.Href
        };
    }

    private void EnsureTranslatesInto(string language)
    {
        if (!_application.Translator.HasLanguage(language))
            throw new InvalidOperationException($"Language '{language}' is not one the application translates into.");
    }

    /// <summary>
    /// Answers the words a page's table lacked — a translator that cannot list them all, or a prefixed key missing where missing
    /// words are reported — with each key's plural forms; bounded per call, for a language the translator lists.
    /// </summary>
    public Task<WebUITranslateResult> TranslateAsync(WebUITranslateRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Language);
        ArgumentNullException.ThrowIfNull(request.Keys);

        EnsureTranslatesInto(request.Language);

        if (request.Keys.Length > MaxTranslateKeys)
            throw new InvalidOperationException($"A page asks for at most {MaxTranslateKeys} words at a time.");

        ITranslator translator = _application.Translator;
        UIWordTable table = translator.ListWords(request.Language);
        Dictionary<string, string> words = new(StringComparer.Ordinal);

        foreach (var key in request.Keys)
        {
            if (string.IsNullOrWhiteSpace(key) || key.Length > MaxTranslateKeyLength)
                continue;

            // Asked for by name, so looked up as a key whatever the prefixes; a miss is recorded where missing words are reported.
            if (translator.Translate(request.Language, key, null) is { } text && !string.Equals(text, key, StringComparison.Ordinal))
                words[key] = text;

            AddPluralForms(translator, table, request.Language, key, words);
        }

        return Task.FromResult(new WebUITranslateResult
        {
            Language = request.Language,
            Words = words
        });
    }

    /// <summary>
    /// The key's plural forms the translator has: read off its listing, and probed one by one only where it cannot list them all — a
    /// probe, since a form the language does not use is no missing word.
    /// </summary>
    private static void AddPluralForms(ITranslator translator, UIWordTable table, string language, string key, Dictionary<string, string> words)
    {
        foreach (var suffix in UIPluralRules.Forms)
        {
            var form = string.Concat(key, ".", suffix);

            if (table.Words.TryGetValue(form, out var listed))
                words[form] = listed;
            else if (!table.Complete && translator.TryTranslate(language, form, out var text))
                words[form] = text;
        }
    }

    public async Task<UICommandExecutionResult> ProcessEventAsync(UICommandRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        request.Validate();

        UIHandle handle = RequireHandle();

        UICommandExecutionResult result = await _host
            .ProcessEventAsync(handle, request, Context.ConnectionAborted)
            .ConfigureAwait(false);

        return _outgoing.Stage(result, handle.Session.SessionId, [Context.ConnectionId]);
    }

    /// <summary>A page holding unsaved work asks before it leaves: answered with what its controller does about it, never pushed.</summary>
    public async Task<UICommandExecutionResult> RequestLeaveAsync(WebUILeaveRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        UIHandle handle = RequireHandle();

        UICommandExecutionResult result = await _host
            .RequestLeaveAsync(handle, request.Target, Context.ConnectionAborted)
            .ConfigureAwait(false);

        return _outgoing.Stage(result, handle.Session.SessionId, [Context.ConnectionId]);
    }

    /// <summary>
    /// The reader went back or forward to another entry of this page's route: its controller hears the entry's parameters on the same
    /// runtime, answered and never pushed. Counted in the connection's call budget as every call is.
    /// </summary>
    public async Task<UICommandExecutionResult> NavigateInPlaceAsync(WebUIAddressRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        UIHandle handle = RequireHandle();

        UICommandExecutionResult result = await _host
            .NavigateInPlaceAsync(handle, request.Parameters, Context.ConnectionAborted)
            .ConfigureAwait(false);

        return _outgoing.Stage(result, handle.Session.SessionId, [Context.ConnectionId]);
    }

    /// <summary>The handle the attach left on this connection; a connection that never attached has none to act on.</summary>
    private UIHandle RequireHandle()
        => Context.Items.TryGetValue(HandleContextItemKey, out var value) && value is UIHandle handle
            ? handle
            : throw new InvalidOperationException($"Web UI connection '{Context.ConnectionId}' is not attached.");

    public async Task<ServerChangeSet> ProcessChangeSetAsync(WebUIChangeSetRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(request.Updates);

        UIHandle handle = RequireHandle();

        // Every update is read and every token checked before any token is taken: a token spends once, and a batch failing on its
        // last field must not have burnt its first ones' staged values.
        UIPropertyAddress[] addresses = new UIPropertyAddress[request.Updates.Length];

        for (var i = 0; i < addresses.Length; i++)
            addresses[i] = ReadAddress(handle, request.Updates[i]);

        ClientUIUpdate[] updates = new ClientUIUpdate[addresses.Length];

        for (var i = 0; i < updates.Length; i++)
            updates[i] = CreateClientValueUpdate(handle, request.Updates[i], addresses[i]);

        ServerChangeSet changes = await _host
            .ProcessChangeSetAsync(handle, new ClientChangeSet { Updates = updates }, Context.ConnectionAborted)
            .ConfigureAwait(false);

        return _outgoing.Stage(changes, handle.Session.SessionId, [Context.ConnectionId]);
    }

    /// <summary>The field an update names, once its staged value, if it has one, is known to be there for the taking.</summary>
    private UIPropertyAddress ReadAddress(UIHandle handle, WebUIValueChangeRequest update)
    {
        ArgumentNullException.ThrowIfNull(update);
        ArgumentException.ThrowIfNullOrWhiteSpace(update.PropertyName);

        if (update.ValueToken is not null && !_stagedValues.Holds(handle.Session.SessionId, update.ValueToken))
            throw new InvalidOperationException("The staged value was not found; it may have expired.");

        return new UIPropertyAddress(new UIComponentId(update.ComponentId), update.PropertyName);
    }

    private ClientValueUIUpdate CreateClientValueUpdate(UIHandle handle, WebUIValueChangeRequest update, UIPropertyAddress address)
    {
        var value = update.Value;

        // A large value was staged beside the hub by this session; one that expired or is not its own is a failed update, not null.
        if (update.ValueToken is not null && !_stagedValues.TryTake(handle.Session.SessionId, update.ValueToken, out value))
            throw new InvalidOperationException("The staged value was not found; it may have expired.");

        return new ClientValueUIUpdate
        {
            Address = address,
            DynamicParameters = update.DynamicParameters ?? [],
            Value = value
        };
    }

    public async Task<ServerChangeSet> RequestItemWindowAsync(WebUIItemWindowRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        UIHandle handle = RequireHandle();

        ServerChangeSet changes = await _host
            .RequestItemWindowAsync(handle, CreateItemWindowRequest(request), Context.ConnectionAborted)
            .ConfigureAwait(false);

        return _outgoing.Stage(changes, handle.Session.SessionId, [Context.ConnectionId]);
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
            // Clamped here, where the number comes off the wire: a hand-made call must not ask a source for its whole table.
            Count = Math.Clamp(request.Count, 1, UIItemWindowClientRequest.MaxCount),
            Mode = request.Extend ? UIItemWindowMode.Extend : UIItemWindowMode.Replace
        };
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Log.ConnectionClosed(_logger, Context.ConnectionId);
        _metrics.ConnectionClosed();

        if (exception is not null)
            Log.ConnectionClosedWithException(_logger, exception, Context.ConnectionId);

        _stagedValues.ReleaseAttach(Context.ConnectionId);

        var detached = _host.DetachRuntime(Context.ConnectionId);

        if (detached)
            Log.Detached(_logger, Context.ConnectionId);
        else
            Log.DetachSkipped(_logger, Context.ConnectionId);

        await base.OnDisconnectedAsync(exception).ConfigureAwait(false);
    }
}
