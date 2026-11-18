using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.ExceptionServices;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Connections.Client;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Primitives.Json;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Serialization;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Transport;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Client;

/// <summary>Describes a file to upload from a client via <see cref="RemoteUIClientTransport.UploadFilesAsync"/>.</summary>
public sealed record UIClientUploadFile(string FileName, byte[] Content, string ContentType = "application/octet-stream");

/// <summary>Describes one uploaded file returned by <c>POST /_ne/files/upload</c>.</summary>
public sealed record UIClientUploadedFileInfo(string FileId, string FileName, string ContentType, long Size);

/// <summary>Describes an upload selection returned by <c>POST /_ne/files/upload</c>.</summary>
public sealed record UIClientUploadSelection(string SelectionId, IReadOnlyList<UIClientUploadedFileInfo> Files);

/// <summary>
/// Remote implementation of <see cref="IUIClientTransport"/> talking to an <c>NE.Standard.UI.Web</c> or <c>NE.Standard.UI.Server</c>
/// host over <c>/_ne/view</c>, <c>/_ne/hub</c>, <c>/_ne/values</c>, <c>/_ne/words</c>, <c>/_ne/session/key</c> and <c>/_ne/files</c>.
/// </summary>
public sealed class RemoteUIClientTransport : IUIClientTransport
{
    private const int LargeValueBytes = 8 * 1024;
    private const int MaxTranslateKeysPerCall = 256;
    private const int MaxTranslateKeyLength = 512;
    private static readonly JsonSerializerOptions WireOptions = CreateWireOptions();

    private readonly RemoteUIClientSession _session;
    private readonly HubConnection _hub;
    private readonly RemoteClientTranslator _translator;
    private readonly string? _initialPageId;
    private readonly long? _initialSequence;
    private readonly ServerChangeSet _initialChanges;
    private readonly Action<RemoteUIClientTransport>? _onClose;
    private readonly ConcurrentQueue<Task> _incoming;
    private readonly Lock _stateSync = new();

    private UIClientPage? _page;
    private string? _runtimeStamp;
    private string? _attachedConnectionId;
    private Task _reconnectTask = Task.CompletedTask;
    private Exception? _fatalFault;
    private bool _attached;
    private bool _closed;

    private RemoteUIClientTransport(
        RemoteUIClientSession session,
        HubConnection hub,
        ConcurrentQueue<Task> incoming,
        string route,
        string? initialAddress,
        UINavigationRequest initialNavigation,
        CompiledView view,
        bool hasController,
        string language,
        UIThemeMode? themeMode,
        UIThemeColors? themeColors,
        string? initialPageId,
        long? initialSequence,
        ServerChangeSet initialChanges,
        RemoteClientTranslator translator,
        Action<RemoteUIClientTransport>? onClose)
    {
        _session = session;
        _hub = hub;
        _incoming = incoming;
        Route = route;
        InitialAddress = initialAddress;
        InitialNavigation = initialNavigation;
        View = view;
        HasController = hasController;
        Language = language;
        ThemeMode = themeMode;
        ThemeColors = themeColors;
        ClientState = new UIClientState(IsVisible: true, session.NotificationPermission);
        _initialPageId = initialPageId;
        _initialSequence = initialSequence;
        _initialChanges = initialChanges;
        _translator = translator;
        _onClose = onClose;

        _ = _hub.On<PushedServerChangeSet, string?>("ui.changes", OnServerChangesAsync);
        _ = _hub.On<PushedCommandExecutionResult, string?>("ui.commandResult", OnServerCommandResultAsync);
        _hub.Reconnected += OnReconnectedAsync;
    }

    /// <inheritdoc />
    public string InstanceId => _hub.ConnectionId ?? _session.ClientWindowId;

    /// <inheritdoc />
    public string Route { get; }

    /// <inheritdoc />
    public string? InitialAddress { get; }

    /// <inheritdoc />
    public UINavigationRequest InitialNavigation { get; }

    /// <inheritdoc />
    public CompiledView View { get; }

    /// <inheritdoc />
    public string Language { get; private set; }

    /// <inheritdoc />
    public UIThemeMode? ThemeMode { get; private set; }

    /// <inheritdoc />
    public UIThemeColors? ThemeColors { get; private set; }

    /// <inheritdoc />
    public UIClientState ClientState { get; private set; } = UIClientState.Unreported;

    /// <inheritdoc />
    public ITranslator Translator => _translator;

    /// <inheritdoc />
    public bool HasController { get; }

    internal static async Task<RemoteUIClientTransport> ConnectAsync(
        RemoteUIClientSession session,
        string address,
        Action<RemoteUIClientTransport>? onClose,
        CancellationToken cancellationToken)
    {
        var requestPath = $"/_ne/view?address={Uri.EscapeDataString(address)}&windowId={Uri.EscapeDataString(session.ClientWindowId)}";
        if (!string.IsNullOrWhiteSpace(session.TimeZone))
            requestPath += $"&timeZone={Uri.EscapeDataString(session.TimeZone)}";

        using HttpResponseMessage response = await session.HttpClient.GetAsync(new Uri(requestPath, UriKind.Relative), cancellationToken).ConfigureAwait(false);
        var isJson = string.Equals(response.Content.Headers.ContentType?.MediaType, "application/json", StringComparison.OrdinalIgnoreCase);

        if (!response.IsSuccessStatusCode && (response.StatusCode != System.Net.HttpStatusCode.NotFound || !isJson))
            _ = response.EnsureSuccessStatusCode();

        var bytes = await response.Content.ReadAsByteArrayAsync(cancellationToken).ConfigureAwait(false);
        if (bytes.Length == 0)
            _ = response.EnsureSuccessStatusCode();

        using JsonDocument doc = JsonDocument.Parse(bytes);
        JsonElement root = doc.RootElement;

        var route = root.GetProperty("route").GetString() ?? "/";
        UINavigationRequest navigation = root.GetProperty("navigation").Deserialize<UINavigationRequest>(WireOptions) ?? new UINavigationRequest { Route = route };
        var hasController = root.GetProperty("hasController").GetBoolean();
        var language = root.GetProperty("language").GetString() ?? "en";
        var defaultLanguage = root.TryGetProperty("defaultLanguage", out JsonElement defLangEl) && defLangEl.ValueKind == JsonValueKind.String
            ? defLangEl.GetString() ?? language
            : language;
        var languages = root.TryGetProperty("languages", out JsonElement langsEl) && langsEl.ValueKind == JsonValueKind.Array
            ? langsEl.Deserialize<string[]>(WireOptions) ?? [defaultLanguage, language]
            : [defaultLanguage, language];
        UIThemeMode? themeMode = root.TryGetProperty("themeMode", out JsonElement tmEl) && tmEl.ValueKind != JsonValueKind.Null
            ? tmEl.Deserialize<UIThemeMode>(WireOptions)
            : null;
        UIThemeColors? themeColors = root.TryGetProperty("themeColors", out JsonElement tcEl) && tcEl.ValueKind != JsonValueKind.Null
            ? tcEl.Deserialize<UIThemeColors>(WireOptions)
            : null;
        var pageId = root.TryGetProperty("pageId", out JsonElement pidEl) ? pidEl.GetString() : null;
        long? sequence = root.TryGetProperty("sequence", out JsonElement seqEl) && seqEl.ValueKind == JsonValueKind.Number
            ? seqEl.GetInt64()
            : null;
        ServerChangeSet initialChanges = root.TryGetProperty("changes", out JsonElement chEl)
            ? chEl.Deserialize<ServerChangeSet>(WireOptions) ?? ServerChangeSet.Empty
            : ServerChangeSet.Empty;

        RemoteClientTranslator translator = new(defaultLanguage, languages);
        if (root.TryGetProperty("words", out JsonElement wordsEl))
            translator.LoadWords(wordsEl);

        var initialAddress = root.TryGetProperty("address", out JsonElement addrEl) && addrEl.ValueKind == JsonValueKind.String
            ? addrEl.GetString()
            : address;

        CompiledView view = CompiledViewWireSerializer.Read(root.GetProperty("view"));

        ConcurrentQueue<Task> incoming = new();
        HubConnection hub = BuildHubConnection(session, incoming);
        RemoteUIClientTransport transport = new(
            session,
            hub,
            incoming,
            route,
            initialAddress,
            navigation,
            view,
            hasController,
            language,
            themeMode,
            themeColors,
            pageId,
            sequence,
            initialChanges,
            translator,
            onClose
        );

        try
        {
            await hub.StartAsync(cancellationToken).ConfigureAwait(false);
            await transport.PrefetchViewWordsAsync(LanguageFor(translator, language), cancellationToken).ConfigureAwait(false);
            return transport;
        }
        catch
        {
            await hub.DisposeAsync().ConfigureAwait(false);
            throw;
        }
    }

    private static string LanguageFor(RemoteClientTranslator translator, string language)
        => translator.HasLanguage(language) ? language : translator.DefaultLanguage;

    private static HubConnection BuildHubConnection(RemoteUIClientSession session, ConcurrentQueue<Task> incoming)
    {
        Uri hubUri = new(session.BaseAddress, "/_ne/hub");
        HubConnectionBuilder builder = new();
        void Configure(HttpConnectionOptions options)
        {
            options.HttpMessageHandlerFactory = _ => session.CreateMessageHandler();
        }

        IHubConnectionBuilder configured = session.TransportType is { } transportType
            ? builder.WithUrl(hubUri, transportType, Configure)
            : builder.WithUrl(hubUri, Configure);

        return configured
            .WithStatefulReconnect()
            .WithAutomaticReconnect()
            .AddJsonProtocol(protocol =>
            {
                UIWireJson.Apply(protocol.PayloadSerializerOptions);
                protocol.PayloadSerializerOptions.Converters.Add(new PushedServerChangeSetJsonConverter(incoming));
                protocol.PayloadSerializerOptions.Converters.Add(new PushedCommandExecutionResultJsonConverter(incoming));
                protocol.PayloadSerializerOptions.Converters.Add(new RemoteUICommandResultJsonConverter());
                protocol.PayloadSerializerOptions.Converters.Add(new UIHubClientEffectJsonConverter());
                protocol.PayloadSerializerOptions.Converters.Add(new ObjectToInferredTypesConverter());
            })
            .Build();
    }

    internal void BindPage(UIClientPage page)
        => _page = page;

    [SuppressMessage("Design", "CA1031:Do not catch general exception types", Justification = "SignalR swallows Reconnected event exceptions; capture any fatal reload fault so subsequent client calls surface it.")]
    private async Task OnReconnectedAsync(string? connectionId)
    {
        if (_closed || _page is not { } page)
            return;

        string? attachedId;
        lock (_stateSync)
            attachedId = _attachedConnectionId;

        // Stateful reconnect kept the same connection id and hub handle on the server: no re-attach or full resync is needed.
        if (connectionId is not null && string.Equals(connectionId, attachedId, StringComparison.Ordinal))
            return;

        Task previous;
        TaskCompletionSource gate = new(TaskCreationOptions.RunContinuationsAsynchronously);
        lock (_stateSync)
        {
            previous = _reconnectTask;
            _reconnectTask = gate.Task;
        }

        try
        {
            await previous.ConfigureAwait(false);
            if (_closed)
                return;

            await page.ReceivePushedAsync(new ServerChangeSet { Updates = [new ServerFullResyncUIUpdate()] }).ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            lock (_stateSync)
                _fatalFault = ex;
        }
        finally
        {
            _ = gate.TrySetResult();
        }
    }

    private async Task EnsureReadyAsync(CancellationToken cancellationToken)
    {
        Task reconnect;
        Exception? fault;

        lock (_stateSync)
        {
            reconnect = _reconnectTask;
            fault = _fatalFault;
        }

        if (!reconnect.IsCompleted)
        {
            await reconnect.WaitAsync(cancellationToken).ConfigureAwait(false);
            lock (_stateSync)
                fault = _fatalFault;
        }

        if (fault is not null)
            ExceptionDispatchInfo.Capture(fault).Throw();
    }

    private async Task OnServerChangesAsync(PushedServerChangeSet pushed, string? runtimeStamp)
    {
        try
        {
            if (!IsStaleStamp(runtimeStamp))
                await ApplyPushedChangesAsync(pushed.Changes).ConfigureAwait(false);
        }
        finally
        {
            _ = pushed.Gate.TrySetResult();
        }
    }

    private async Task ApplyPushedChangesAsync(ServerChangeSet changes)
    {
        ServerChangeSet resolved = await ResolveStagedUpdatesAsync(changes, CancellationToken.None).ConfigureAwait(false);
        await PrefetchChangeSetWordsAsync(resolved, CancellationToken.None).ConfigureAwait(false);
        if (_page is { } page)
            await page.ReceivePushedAsync(resolved).ConfigureAwait(false);
    }

    private async Task OnServerCommandResultAsync(PushedCommandExecutionResult pushed, string? runtimeStamp)
    {
        try
        {
            if (!IsStaleStamp(runtimeStamp))
                await ApplyPushedCommandResultAsync(pushed.Result).ConfigureAwait(false);
        }
        finally
        {
            _ = pushed.Gate.TrySetResult();
        }
    }

    private async Task ApplyPushedCommandResultAsync(UICommandExecutionResult result)
    {
        (UICommandExecutionResult resolved, var onlySessionKey) = await PrepareCommandResultAsync(result, CancellationToken.None).ConfigureAwait(false);
        if (onlySessionKey && resolved.Changes.Updates.Length == 0 && resolved.RequestId is null)
            return;

        if (_page is { } page)
            await page.ReceivePushedAsync(resolved).ConfigureAwait(false);
    }

    private bool IsStaleStamp(string? runtimeStamp)
        => runtimeStamp is not null && _runtimeStamp is not null && !string.Equals(runtimeStamp, _runtimeStamp, StringComparison.Ordinal);

    /// <inheritdoc />
    public TController Controller<TController>() where TController : class
        => throw new NotSupportedException("Controller<TController>() is only available on in-process transports.");

    /// <inheritdoc />
    public async Task<ServerChangeSet> BuildAttachChangesAsync(UIBindingId[] bindingIds, CancellationToken cancellationToken = default)
    {
        if (!_attached)
        {
            _attached = true;
            UIHubAttachResult firstAttach = await _hub.InvokeAsync<UIHubAttachResult>(
                "AttachAsync",
                new UIHubAttachRequest
                {
                    ClientWindowId = _session.ClientWindowId,
                    Route = InitialNavigation.Route,
                    Parameters = InitialNavigation.Parameters,
                    PageId = _initialPageId,
                    View = View.Fingerprint,
                    Since = _initialSequence,
                    TimeZone = _session.TimeZone,
                    ClientState = UIHubClientStateRequest.FromClientState(ClientState)
                },
                cancellationToken
            ).ConfigureAwait(false);

            if (firstAttach.Reload)
                throw new InvalidOperationException($"The server requested a page reload for '{Route}' before the hub attached; reopen the page.");

            RecordAttached(firstAttach.Runtime);
            ServerChangeSet hydrated = await ResolveStagedUpdatesAsync(_initialChanges, cancellationToken).ConfigureAwait(false);
            ServerChangeSet delta = await ResolveStagedUpdatesAsync(firstAttach.InitialChanges, cancellationToken).ConfigureAwait(false);
            ServerChangeSet combined = delta.Updates.Length == 0
                ? hydrated
                : hydrated.Updates.Length == 0
                    ? delta
                    : new ServerChangeSet { Updates = [.. hydrated.Updates, .. delta.Updates] };

            await PrefetchChangeSetWordsAsync(combined, cancellationToken).ConfigureAwait(false);
            return combined;
        }

        UINavigationRequest currentNav = _page?.Navigation ?? InitialNavigation;
        UIHubAttachResult resyncAttach = await InvokeResyncAttachAsync(currentNav, cancellationToken).ConfigureAwait(false);

        if (resyncAttach.Fresh)
        {
            _page?.ResetForFreshRuntime();
            _runtimeStamp = null;
            resyncAttach = await InvokeResyncAttachAsync(currentNav, cancellationToken).ConfigureAwait(false);
        }

        RecordAttached(resyncAttach.Runtime ?? _runtimeStamp);
        ServerChangeSet resynced = await ResolveStagedUpdatesAsync(resyncAttach.InitialChanges, cancellationToken).ConfigureAwait(false);
        await PrefetchChangeSetWordsAsync(resynced, cancellationToken).ConfigureAwait(false);
        return resynced;
    }

    private void RecordAttached(string? runtimeStamp)
    {
        _runtimeStamp = runtimeStamp;
        lock (_stateSync)
        {
            _attachedConnectionId = _hub.ConnectionId;
            _fatalFault = null;
        }
    }

    private async Task<UIHubAttachResult> InvokeResyncAttachAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        UIHubAttachResult result = await _hub.InvokeAsync<UIHubAttachResult>(
            "AttachAsync",
            new UIHubAttachRequest
            {
                ClientWindowId = _session.ClientWindowId,
                Route = navigation.Route,
                Parameters = navigation.Parameters,
                View = View.Fingerprint,
                Runtime = _runtimeStamp,
                TimeZone = _session.TimeZone,
                ClientState = UIHubClientStateRequest.FromClientState(ClientState)
            },
            cancellationToken
        ).ConfigureAwait(false);

        if (result.Reload)
            throw new InvalidOperationException($"The server requested a page reload for '{navigation.Route}'; reopen the page.");

        return result;
    }

    /// <inheritdoc />
    public async Task<UICommandExecutionResult> ProcessEventAsync(UICommandRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        await EnsureReadyAsync(cancellationToken).ConfigureAwait(false);

        string? parametersToken = null;
        var dynamicParameters = request.DynamicParameters;

        if (dynamicParameters.Length > 0)
        {
            var json = JsonSerializer.SerializeToUtf8Bytes(dynamicParameters, WireOptions);
            if (json.Length > LargeValueBytes)
            {
                parametersToken = await StageClientValueAsync(json, cancellationToken).ConfigureAwait(false);
                dynamicParameters = [];
            }
        }

        UICommandExecutionResult raw = await _hub.InvokeAsync<UICommandExecutionResult>(
            "ProcessEventAsync",
            new UIHubCommandRequest
            {
                EventId = request.EventId,
                Action = request.Action,
                DynamicParameters = dynamicParameters,
                DynamicParametersToken = parametersToken,
                RequestId = request.RequestId
            },
            cancellationToken
        ).ConfigureAwait(false);

        await DrainIncomingAsync(cancellationToken).ConfigureAwait(false);
        (UICommandExecutionResult resolved, _) = await PrepareCommandResultAsync(raw, cancellationToken).ConfigureAwait(false);
        return resolved;
    }

    /// <inheritdoc />
    public async Task<ServerChangeSet> ProcessChangeSetAsync(ClientChangeSet changeSet, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(changeSet);

        await EnsureReadyAsync(cancellationToken).ConfigureAwait(false);

        UIHubValueChangeRequest[] updates = new UIHubValueChangeRequest[changeSet.Updates.Length];

        for (var i = 0; i < changeSet.Updates.Length; i++)
        {
            if (changeSet.Updates[i] is not ClientValueUIUpdate update)
                throw new InvalidOperationException($"Unsupported client update type '{changeSet.Updates[i].GetType().Name}'.");

            var json = JsonSerializer.SerializeToUtf8Bytes(update.Value, WireOptions);
            if (json.Length > LargeValueBytes)
            {
                var token = await StageClientValueAsync(json, cancellationToken).ConfigureAwait(false);
                updates[i] = new UIHubValueChangeRequest
                {
                    ComponentId = update.Address.Component.Id.Value,
                    PropertyName = update.Address.Property.Name,
                    DynamicParameters = update.Address.Component.DynamicParameters,
                    ValueToken = token
                };
            }
            else
            {
                using JsonDocument doc = JsonDocument.Parse(json);
                updates[i] = new UIHubValueChangeRequest
                {
                    ComponentId = update.Address.Component.Id.Value,
                    PropertyName = update.Address.Property.Name,
                    DynamicParameters = update.Address.Component.DynamicParameters,
                    Value = doc.RootElement.Clone()
                };
            }
        }

        ServerChangeSet raw = await _hub.InvokeAsync<ServerChangeSet>(
            "ProcessChangeSetAsync",
            new UIHubChangeSetRequest { Updates = updates },
            cancellationToken
        ).ConfigureAwait(false);

        await DrainIncomingAsync(cancellationToken).ConfigureAwait(false);
        ServerChangeSet resolved = await ResolveStagedUpdatesAsync(raw, cancellationToken).ConfigureAwait(false);
        await PrefetchChangeSetWordsAsync(resolved, cancellationToken).ConfigureAwait(false);
        return resolved;
    }

    /// <inheritdoc />
    public async Task<ServerChangeSet> RequestItemWindowAsync(UIItemWindowClientRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        await EnsureReadyAsync(cancellationToken).ConfigureAwait(false);

        ServerChangeSet raw = await _hub.InvokeAsync<ServerChangeSet>(
            "RequestItemWindowAsync",
            new UIHubItemWindowRequest
            {
                ComponentId = request.ComponentId.Value,
                DynamicParameters = request.DynamicParameters,
                Anchor = request.Anchor.Kind.ToString(),
                Offset = request.Anchor.Offset,
                Key = request.Anchor.Key,
                Count = request.Count,
                Extend = request.Mode == UIItemWindowMode.Extend
            },
            cancellationToken
        ).ConfigureAwait(false);

        await DrainIncomingAsync(cancellationToken).ConfigureAwait(false);
        ServerChangeSet resolved = await ResolveStagedUpdatesAsync(raw, cancellationToken).ConfigureAwait(false);
        await PrefetchChangeSetWordsAsync(resolved, cancellationToken).ConfigureAwait(false);
        return resolved;
    }

    /// <inheritdoc />
    public async Task<UICommandExecutionResult> NavigateInPlaceAsync(IReadOnlyDictionary<string, object?>? parameters, CancellationToken cancellationToken = default)
    {
        await EnsureReadyAsync(cancellationToken).ConfigureAwait(false);

        UICommandExecutionResult raw = await _hub.InvokeAsync<UICommandExecutionResult>(
            "NavigateInPlaceAsync",
            new UIHubAddressRequest { Parameters = parameters },
            cancellationToken
        ).ConfigureAwait(false);

        await DrainIncomingAsync(cancellationToken).ConfigureAwait(false);
        (UICommandExecutionResult resolved, _) = await PrepareCommandResultAsync(raw, cancellationToken).ConfigureAwait(false);
        return resolved;
    }

    /// <summary>Asks the server controller whether the page may leave for <paramref name="target"/> when holding unsaved work.</summary>
    public async Task<UICommandExecutionResult> RequestLeaveAsync(string target, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target);

        await EnsureReadyAsync(cancellationToken).ConfigureAwait(false);

        UICommandExecutionResult raw = await _hub.InvokeAsync<UICommandExecutionResult>(
            "RequestLeaveAsync",
            new UIHubLeaveRequest { Target = target },
            cancellationToken
        ).ConfigureAwait(false);

        await DrainIncomingAsync(cancellationToken).ConfigureAwait(false);
        (UICommandExecutionResult resolved, _) = await PrepareCommandResultAsync(raw, cancellationToken).ConfigureAwait(false);
        return resolved;
    }

    /// <inheritdoc />
    public async Task<ServerChangeSet> FlushAsync(CancellationToken cancellationToken = default)
    {
        await EnsureReadyAsync(cancellationToken).ConfigureAwait(false);
        await DrainIncomingAsync(cancellationToken).ConfigureAwait(false);
        return ServerChangeSet.Empty;
    }

    /// <inheritdoc />
    public async Task ReportClientStateAsync(UIClientState state, CancellationToken cancellationToken = default)
    {
        await EnsureReadyAsync(cancellationToken).ConfigureAwait(false);

        ClientState = state;
        await _hub.InvokeAsync(
            "ReportClientStateAsync",
            new UIHubClientStateRequest
            {
                Visible = state.IsVisible,
                NotificationPermission = state.NotificationPermission
            },
            cancellationToken
        ).ConfigureAwait(false);

        await DrainIncomingAsync(cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public bool SessionHolds(ClientEffect effect)
        => UISessionSettings.Holds(effect, Language, ThemeMode, ThemeColors);

    /// <inheritdoc />
    public async Task ApplySettingAsync(ClientEffect setting, CancellationToken cancellationToken = default)
    {
        await EnsureReadyAsync(cancellationToken).ConfigureAwait(false);

        switch (setting)
        {
            case SetLanguageEffect language:
                UIHubLanguageResult langResult = await _hub.InvokeAsync<UIHubLanguageResult>(
                    "SetLanguageAsync",
                    new UIHubSetLanguageRequest { Language = language.Language },
                    cancellationToken
                ).ConfigureAwait(false);

                await FetchWordsAsync(langResult.Href, langResult.Language, cancellationToken).ConfigureAwait(false);
                Language = langResult.Language;
                break;

            case SetThemeEffect theme:
                var themeName = theme.Mode switch
                {
                    UIThemeMode.Light => "light",
                    UIThemeMode.Dark => "dark",
                    _ => "auto"
                };

                await _hub.InvokeAsync(
                    "SetThemeAsync",
                    new UIHubSetThemeRequest { Theme = themeName },
                    cancellationToken
                ).ConfigureAwait(false);

                ThemeMode = theme.Mode;
                break;

            case SetThemeColorsEffect colors:
                _ = await _hub.InvokeAsync<UIHubThemeColorsResult>(
                    "SetThemeColorsAsync",
                    new UIHubSetThemeColorsRequest { Colors = colors.Colors },
                    cancellationToken
                ).ConfigureAwait(false);

                ThemeColors = colors.Colors;
                break;

            default:
                break;
        }

        await DrainIncomingAsync(cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Uploads one or more files to <c>POST /_ne/files/upload</c> and returns the stored selection descriptor.</summary>
    [SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "MultipartFormDataContent owns and disposes its added HttpContent parts.")]
    public async Task<UIClientUploadSelection> UploadFilesAsync(IReadOnlyList<UIClientUploadFile> files, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(files);

        using MultipartFormDataContent multipart = new();
        for (var i = 0; i < files.Count; i++)
        {
            UIClientUploadFile file = files[i];
            ByteArrayContent part = new(file.Content);
            part.Headers.ContentType = MediaTypeHeaderValue.Parse(file.ContentType);
            multipart.Add(part, "files", file.FileName);
        }

        using HttpResponseMessage response = await _session.HttpClient
            .PostAsync(new Uri("/_ne/files/upload", UriKind.Relative), multipart, cancellationToken)
            .ConfigureAwait(false);

        _ = response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsByteArrayAsync(cancellationToken).ConfigureAwait(false);
        return JsonSerializer.Deserialize<UIClientUploadSelection>(json, WireOptions)
            ?? throw new InvalidOperationException("Upload response was empty.");
    }

    /// <summary>Downloads a file from a framework download effect URL (<c>/_ne/files/{token}</c>) and records it on the page.</summary>
    public async Task<UIClientDownload> DownloadFileAsync(DownloadFileEffect effect, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(effect);

        using HttpResponseMessage response = await _session.HttpClient
            .GetAsync(RequireFrameworkPath(effect.RequestPath), cancellationToken)
            .ConfigureAwait(false);

        _ = response.EnsureSuccessStatusCode();

        var bytes = await response.Content.ReadAsByteArrayAsync(cancellationToken).ConfigureAwait(false);
        var contentType = response.Content.Headers.ContentType?.MediaType ?? "application/octet-stream";
        var fileName = response.Content.Headers.ContentDisposition?.FileNameStar
            ?? response.Content.Headers.ContentDisposition?.FileName?.Trim('"')
            ?? effect.FileName
            ?? "download";

        UIClientDownload download = new(fileName, contentType, bytes);
        _page?.Receive(download);
        return download;
    }

    private static Uri RequireFrameworkPath(string path)
        => !string.IsNullOrWhiteSpace(path) && path.StartsWith("/_ne/", StringComparison.Ordinal)
            ? new Uri(path, UriKind.Relative)
            : throw new InvalidOperationException($"Refusing non-framework request path '{path}'.");

    /// <inheritdoc />
    public async Task CloseAsync(CancellationToken cancellationToken = default)
    {
        if (_closed)
            return;

        _closed = true;
        _hub.Reconnected -= OnReconnectedAsync;
        _page?.CancelPendingCommands(new OperationCanceledException("The client page closed before the background command completed."));
        _onClose?.Invoke(this);
        await _hub.DisposeAsync().ConfigureAwait(false);
    }

    private async Task DrainIncomingAsync(CancellationToken cancellationToken)
    {
        await Task.Yield();
        while (_incoming.TryDequeue(out Task? pending))
        {
            await pending.ConfigureAwait(false);
            await Task.Yield();
        }

        await FlushQueuedWordRequestsAsync(cancellationToken).ConfigureAwait(false);
    }

    private async Task<(UICommandExecutionResult Result, bool OnlySessionKey)> PrepareCommandResultAsync(UICommandExecutionResult raw, CancellationToken cancellationToken)
    {
        ClientEffect[] effects = raw.Command.Effects;
        var sawSessionKey = false;

        // Rotate the session cookie BEFORE resolving staged tokens: SignInAsync replaced the old session id in the server store.
        for (var i = 0; i < effects.Length; i++)
        {
            if (effects[i] is UISessionKeyWireEffect sessionKey)
            {
                sawSessionKey = true;
                await TradeSessionKeyAsync(sessionKey.Token, cancellationToken).ConfigureAwait(false);
            }
        }

        ServerChangeSet changes = await ResolveStagedUpdatesAsync(raw.Changes, cancellationToken).ConfigureAwait(false);
        if (effects.Length == 0)
        {
            await PrefetchChangeSetWordsAsync(changes, cancellationToken).ConfigureAwait(false);
            return (ReferenceEquals(changes, raw.Changes) ? raw : raw with { Changes = changes }, false);
        }

        List<ClientEffect> filtered = [with(effects.Length)];

        for (var i = 0; i < effects.Length; i++)
        {
            switch (effects[i])
            {
                case UISessionKeyWireEffect:
                    break;

                case UIStoredLanguageWireEffect storedLanguage:
                    await FetchWordsAsync(storedLanguage.Href, storedLanguage.Language, cancellationToken).ConfigureAwait(false);
                    Language = storedLanguage.Language;
                    filtered.Add(new SetLanguageEffect(storedLanguage.Language));
                    break;

                case UIStoredThemeColorsWireEffect storedColors:
                    ThemeColors = storedColors.Colors;
                    filtered.Add(new SetThemeColorsEffect(storedColors.Colors));
                    break;

                case SetThemeEffect { Stored: true } storedTheme:
                    ThemeMode = storedTheme.Mode;
                    filtered.Add(storedTheme);
                    break;

                default:
                    filtered.Add(effects[i]);
                    break;
            }
        }

        await PrefetchChangeSetWordsAsync(changes, cancellationToken).ConfigureAwait(false);
        await PrefetchEffectsWordsAsync(filtered, cancellationToken).ConfigureAwait(false);

        UICommandResult command = raw.Command.Success
            ? UICommandResult.Ok([.. filtered])
            : UICommandResult.Fail(raw.Command.Error!, [.. filtered]);

        return (raw with { Command = command, Changes = changes }, sawSessionKey && filtered.Count == 0);
    }

    private async Task<ServerChangeSet> ResolveStagedUpdatesAsync(ServerChangeSet changes, CancellationToken cancellationToken)
    {
        ServerUIUpdate[]? resolved = null;

        for (var i = 0; i < changes.Updates.Length; i++)
        {
            switch (changes.Updates[i])
            {
                case ServerValueUIUpdate { ValueToken: { } token } staged:
                    resolved ??= [.. changes.Updates];
                    var value = await FetchStagedValueAsync(token, cancellationToken).ConfigureAwait(false);
                    resolved[i] = new ServerValueUIUpdate
                    {
                        Address = staged.Address,
                        Value = value,
                        Content = staged.Content,
                        ExceptInstanceId = staged.ExceptInstanceId
                    };
                    break;

                case ServerCollectionChangeUIUpdate { ItemsToken: { } itemsToken } stagedCollection:
                    resolved ??= [.. changes.Updates];
                    var bytes = await FetchStagedBytesAsync(itemsToken, cancellationToken).ConfigureAwait(false);
                    ServerCollectionItemChange[] items = JsonSerializer.Deserialize<ServerCollectionItemChange[]>(bytes, WireOptions) ?? [];
                    resolved[i] = new ServerCollectionChangeUIUpdate
                    {
                        Action = stagedCollection.Action,
                        Component = stagedCollection.Component,
                        Items = items,
                        Trimmed = stagedCollection.Trimmed
                    };
                    break;

                default:
                    break;
            }
        }

        return resolved is null ? changes : new ServerChangeSet { Updates = resolved };
    }

    private async Task<object?> FetchStagedValueAsync(string token, CancellationToken cancellationToken)
    {
        var bytes = await FetchStagedBytesAsync(token, cancellationToken).ConfigureAwait(false);
        using JsonDocument doc = JsonDocument.Parse(bytes);
        return ObjectToInferredTypesConverter.ToInferredValue(doc.RootElement);
    }

    private async Task<byte[]> FetchStagedBytesAsync(string token, CancellationToken cancellationToken)
    {
        var path = $"/_ne/values/{Uri.EscapeDataString(token)}?instance={Uri.EscapeDataString(InstanceId)}";
        using HttpResponseMessage response = await _session.HttpClient.GetAsync(new Uri(path, UriKind.Relative), cancellationToken).ConfigureAwait(false);
        _ = response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsByteArrayAsync(cancellationToken).ConfigureAwait(false);
    }

    private async Task<string> StageClientValueAsync(byte[] json, CancellationToken cancellationToken)
    {
        using ByteArrayContent content = new(json);
        content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

        using HttpResponseMessage response = await _session.HttpClient
            .PostAsync(new Uri("/_ne/values", UriKind.Relative), content, cancellationToken)
            .ConfigureAwait(false);

        _ = response.EnsureSuccessStatusCode();

        var responseBytes = await response.Content.ReadAsByteArrayAsync(cancellationToken).ConfigureAwait(false);
        using JsonDocument doc = JsonDocument.Parse(responseBytes);
        return doc.RootElement.GetProperty("token").GetString()
            ?? throw new InvalidOperationException("Value staging endpoint returned no token.");
    }

    private Task TradeSessionKeyAsync(string token, CancellationToken cancellationToken)
    {
        var body = JsonSerializer.SerializeToUtf8Bytes(new { token }, WireOptions);
        return _session.TradeSessionKeyAsync(body, cancellationToken);
    }

    private async Task FetchWordsAsync(string href, string language, CancellationToken cancellationToken)
    {
        using HttpResponseMessage response = await _session.HttpClient
            .GetAsync(RequireFrameworkPath(href), cancellationToken)
            .ConfigureAwait(false);

        _ = response.EnsureSuccessStatusCode();

        var bytes = await response.Content.ReadAsByteArrayAsync(cancellationToken).ConfigureAwait(false);
        using JsonDocument doc = JsonDocument.Parse(bytes);
        _translator.LoadWords(doc.RootElement);
        await PrefetchViewWordsAsync(LanguageFor(_translator, language), cancellationToken).ConfigureAwait(false);
    }

    private async Task PrefetchViewWordsAsync(string language, CancellationToken cancellationToken)
    {
        if (!_translator.NeedsRemoteLookup(language))
            return;

        HashSet<string> candidates = [with(StringComparer.Ordinal)];
        CollectPhraseOrPlainKey(View.Title, plainAllowed: true, language, candidates);

        if (View.TitleArguments is not null)
        {
            foreach (var arg in View.TitleArguments.Values)
                CollectValueWordKeys(arg, plainAllowed: false, language, candidates, depth: 0);
        }

        foreach (CompiledDialog dialog in View.Dialogs)
            CollectValueWordKeys(dialog.AccessibleName, plainAllowed: true, language, candidates, depth: 0);

        foreach (UIComponentState state in View.State.All)
        {
            foreach (CompiledUIPropertyValue slot in state.All)
            {
                if (!slot.IsBind && slot.Value is not null)
                    CollectValueWordKeys(slot.Value, slot.IsTranslatable && !slot.IsContent, language, candidates, depth: 0);
            }
        }

        foreach (CompiledUIValidationRule rule in View.Validations.All)
            CollectValueWordKeys(rule.Message, plainAllowed: true, language, candidates, depth: 0);

        await FetchMissingWordsCoreAsync(language, candidates, cancellationToken).ConfigureAwait(false);
    }

    private async Task PrefetchChangeSetWordsAsync(ServerChangeSet changes, CancellationToken cancellationToken)
    {
        var language = LanguageFor(_translator, Language);
        if (!_translator.NeedsRemoteLookup(language))
            return;

        HashSet<string> candidates = [with(StringComparer.Ordinal)];
        for (var i = 0; i < changes.Updates.Length; i++)
        {
            switch (changes.Updates[i])
            {
                case ServerValueUIUpdate valueUpdate:
                    var translatable = !valueUpdate.Content
                        && View.State.TryGetValue(valueUpdate.Address.Component.Id, valueUpdate.Address.Property, out CompiledUIPropertyValue? compiled)
                        && compiled.IsTranslatable
                        && !compiled.IsContent;
                    CollectValueWordKeys(valueUpdate.Value, translatable, language, candidates, depth: 0);
                    break;

                case ServerValidationUIUpdate validationUpdate:
                    CollectValueWordKeys(validationUpdate.Message, !validationUpdate.Content, language, candidates, depth: 0);
                    break;

                case ServerCollectionChangeUIUpdate collectionUpdate:
                    for (var j = 0; j < collectionUpdate.Items.Length; j++)
                        CollectValueWordKeys(collectionUpdate.Items[j].Item, plainAllowed: true, language, candidates, depth: 0);
                    break;

                default:
                    break;
            }
        }

        await FlushQueuedWordRequestsIntoAsync(language, candidates, cancellationToken).ConfigureAwait(false);
    }

    private async Task PrefetchEffectsWordsAsync(List<ClientEffect> effects, CancellationToken cancellationToken)
    {
        var language = LanguageFor(_translator, Language);
        if (!_translator.NeedsRemoteLookup(language))
            return;

        HashSet<string> candidates = [with(StringComparer.Ordinal)];
        for (var i = 0; i < effects.Count; i++)
        {
            switch (effects[i])
            {
                case ShowNotificationEffect toast:
                    CollectValueWordKeys(toast.Message, plainAllowed: true, language, candidates, depth: 0);
                    CollectValueWordKeys(toast.Action?.Title, plainAllowed: true, language, candidates, depth: 0);
                    break;

                case ShowSystemNotificationEffect systemToast:
                    CollectValueWordKeys(systemToast.Title, plainAllowed: true, language, candidates, depth: 0);
                    CollectValueWordKeys(systemToast.Body, plainAllowed: true, language, candidates, depth: 0);
                    break;

                case AnnounceEffect announce:
                    CollectValueWordKeys(announce.Message, plainAllowed: true, language, candidates, depth: 0);
                    break;

                default:
                    break;
            }
        }

        await FlushQueuedWordRequestsIntoAsync(language, candidates, cancellationToken).ConfigureAwait(false);
    }

    private async Task FlushQueuedWordRequestsAsync(CancellationToken cancellationToken)
    {
        foreach ((var language, HashSet<string> queued) in _translator.TakeQueuedRequests())
            await FetchMissingWordsCoreAsync(language, queued, cancellationToken).ConfigureAwait(false);
    }

    private async Task FlushQueuedWordRequestsIntoAsync(string language, HashSet<string> candidates, CancellationToken cancellationToken)
    {
        foreach ((var queuedLang, HashSet<string> queued) in _translator.TakeQueuedRequests())
        {
            if (string.Equals(queuedLang, language, StringComparison.Ordinal))
                candidates.UnionWith(queued);
            else
                await FetchMissingWordsCoreAsync(queuedLang, queued, cancellationToken).ConfigureAwait(false);
        }

        await FetchMissingWordsCoreAsync(language, candidates, cancellationToken).ConfigureAwait(false);
    }

    private void CollectValueWordKeys(object? value, bool plainAllowed, string language, HashSet<string> candidates, int depth)
    {
        if (value is null || depth > 5)
            return;

        switch (value)
        {
            case string text:
                if (plainAllowed)
                    CollectPhraseOrPlainKey(text, plainAllowed: true, language, candidates);
                return;

            case UIPhrase { IsText: true } authorText:
                if (plainAllowed)
                    CollectPhraseOrPlainKey(authorText.Key, plainAllowed: true, language, candidates);
                return;

            case UIPhrase phrase:
                CollectPhraseOrPlainKey(phrase.Key, plainAllowed: false, language, candidates);
                if (phrase.Arguments is not null)
                {
                    foreach (var arg in phrase.Arguments.Values)
                        CollectValueWordKeys(arg, plainAllowed: true, language, candidates, depth + 1);
                }

                return;

            case UIValidationMessage validationMessage:
                CollectValueWordKeys(validationMessage.Message, plainAllowed: true, language, candidates, depth + 1);
                return;

            case IReadOnlyDictionary<string, object?> dict:
                if ((dict.ContainsKey("key") || dict.ContainsKey("text"))
                    && dict.Count <= 2
                    && CompiledViewWireSerializer.CoerceWireValue(typeof(UIPhrase), dict) is UIPhrase coerced)
                {
                    CollectValueWordKeys(coerced, plainAllowed, language, candidates, depth + 1);
                    return;
                }

                var itemContent = (dict.TryGetValue("isContent", out var icLower) && icLower is true)
                    || (dict.TryGetValue("IsContent", out var icUpper) && icUpper is true);

                foreach (var entry in dict.Values)
                    CollectValueWordKeys(entry, plainAllowed && !itemContent, language, candidates, depth + 1);
                return;

            case IEnumerable sequence:
                foreach (var element in sequence)
                    CollectValueWordKeys(element, plainAllowed, language, candidates, depth + 1);
                return;

            default:
                return;
        }
    }

    private void CollectPhraseOrPlainKey(string? key, bool plainAllowed, string language, HashSet<string> candidates)
    {
        if (_translator.ShouldAskServer(language, key, plain: plainAllowed))
            _ = candidates.Add(key);
    }

    private async Task FetchMissingWordsCoreAsync(string language, HashSet<string> candidates, CancellationToken cancellationToken)
    {
        if (candidates.Count == 0 || _closed)
            return;

        List<string> toAsk = _translator.ClaimUnasked(language, candidates);
        if (toAsk.Count == 0)
            return;

        for (var offset = 0; offset < toAsk.Count; offset += MaxTranslateKeysPerCall)
        {
            var count = Math.Min(MaxTranslateKeysPerCall, toAsk.Count - offset);
            var batch = toAsk.GetRange(offset, count).ToArray();
            UIHubTranslateResult answer = await _hub.InvokeAsync<UIHubTranslateResult>(
                "TranslateAsync",
                new UIHubTranslateRequest
                {
                    Language = language,
                    Keys = batch
                },
                cancellationToken
            ).ConfigureAwait(false);

            _translator.MergeTranslations(answer.Language, answer.Words);
        }
    }

    private static JsonSerializerOptions CreateWireOptions()
    {
        JsonSerializerOptions options = UIWireJson.CreateOptions();
        options.Converters.Add(new RemoteUICommandResultJsonConverter());
        options.Converters.Add(new UIHubClientEffectJsonConverter());
        options.Converters.Add(new ObjectToInferredTypesConverter());
        return options;
    }

    private sealed record PushedServerChangeSet(ServerChangeSet Changes, TaskCompletionSource Gate);

    private sealed record PushedCommandExecutionResult(UICommandExecutionResult Result, TaskCompletionSource Gate);

    private sealed class PushedServerChangeSetJsonConverter(ConcurrentQueue<Task> incoming) : JsonConverter<PushedServerChangeSet>
    {
        public override PushedServerChangeSet? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            ServerChangeSet changes = JsonSerializer.Deserialize<ServerChangeSet>(ref reader, options) ?? ServerChangeSet.Empty;
            TaskCompletionSource gate = new(TaskCreationOptions.RunContinuationsAsynchronously);
            incoming.Enqueue(gate.Task);
            return new PushedServerChangeSet(changes, gate);
        }

        public override void Write(Utf8JsonWriter writer, PushedServerChangeSet value, JsonSerializerOptions options)
            => JsonSerializer.Serialize(writer, value.Changes, options);
    }

    private sealed class PushedCommandExecutionResultJsonConverter(ConcurrentQueue<Task> incoming) : JsonConverter<PushedCommandExecutionResult>
    {
        public override PushedCommandExecutionResult? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            UICommandExecutionResult result = JsonSerializer.Deserialize<UICommandExecutionResult>(ref reader, options)
                ?? throw new JsonException("Pushed command execution result was null.");
            TaskCompletionSource gate = new(TaskCreationOptions.RunContinuationsAsynchronously);
            incoming.Enqueue(gate.Task);
            return new PushedCommandExecutionResult(result, gate);
        }

        public override void Write(Utf8JsonWriter writer, PushedCommandExecutionResult value, JsonSerializerOptions options)
            => JsonSerializer.Serialize(writer, value.Result, options);
    }

    private sealed class RemoteUICommandResultJsonConverter : JsonConverter<UICommandResult>
    {
        public override UICommandResult? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Null)
                return null;

            using JsonDocument doc = JsonDocument.ParseValue(ref reader);
            JsonElement root = doc.RootElement;

            var success = !root.TryGetProperty("success", out JsonElement successEl)
                || successEl.ValueKind != JsonValueKind.False;

            var error = root.TryGetProperty("error", out JsonElement errEl) && errEl.ValueKind == JsonValueKind.String
                ? errEl.GetString()
                : null;

            ClientEffect[]? effects = root.TryGetProperty("effects", out JsonElement effectsEl) && effectsEl.ValueKind == JsonValueKind.Array
                ? effectsEl.Deserialize<ClientEffect[]>(options)
                : null;

            return success
                ? UICommandResult.Ok(effects)
                : UICommandResult.Fail(error ?? "Command failed.", effects);
        }

        public override void Write(Utf8JsonWriter writer, UICommandResult value, JsonSerializerOptions options)
        {
            writer.WriteStartObject();
            writer.WriteBoolean("success", value.Success);
            writer.WritePropertyName("effects");
            JsonSerializer.Serialize(writer, value.Effects, options);
            if (value.Error is not null)
                writer.WriteString("error", value.Error);
            writer.WriteEndObject();
        }
    }

    private sealed class RemoteClientTranslator : ITranslator
    {
        private readonly ConcurrentDictionary<string, LoadedWordTable> _tables = new(StringComparer.Ordinal);
        private readonly List<string> _languages = [];
        private readonly HashSet<string> _languageSet = [with(StringComparer.Ordinal)];
        private readonly Dictionary<string, HashSet<string>> _queuedRequests = [with(StringComparer.Ordinal)];
        private readonly Lock _sync = new();

        public RemoteClientTranslator(string defaultLanguage, IEnumerable<string> languages)
        {
            DefaultLanguage = defaultLanguage;
            AddLanguage(defaultLanguage);
            foreach (var lang in languages)
                AddLanguage(lang);
        }

        public string DefaultLanguage { get; }

        public IReadOnlyList<string> Languages
        {
            get
            {
                lock (_sync)
                    return [.. _languages];
            }
        }

        public bool HasLanguage(string language)
        {
            lock (_sync)
                return _languageSet.Contains(language);
        }

        private void AddLanguage(string language)
        {
            if (string.IsNullOrWhiteSpace(language))
                return;

            lock (_sync)
            {
                if (_languageSet.Add(language))
                    _languages.Add(language);
            }
        }

        public void LoadWords(JsonElement root)
        {
            var lang = root.TryGetProperty("language", out JsonElement langEl) ? langEl.GetString() ?? DefaultLanguage : DefaultLanguage;
            var complete = !root.TryGetProperty("complete", out JsonElement compEl) || compEl.ValueKind != JsonValueKind.False;
            var report = root.TryGetProperty("report", out JsonElement repEl) && repEl.ValueKind == JsonValueKind.True;
            var prefixes = root.TryGetProperty("prefixes", out JsonElement prefEl) && prefEl.ValueKind == JsonValueKind.Array
                ? ReadStringArray(prefEl)
                : [];

            ConcurrentDictionary<string, string> words = new(StringComparer.Ordinal);
            if (root.TryGetProperty("words", out JsonElement wordsEl) && wordsEl.ValueKind == JsonValueKind.Object)
            {
                foreach (JsonProperty prop in wordsEl.EnumerateObject())
                {
                    if (prop.Value.GetString() is { } val)
                        words[prop.Name] = val;
                }
            }

            _tables[lang] = new LoadedWordTable(words, complete, prefixes, report);
            AddLanguage(lang);
        }

        private static string[] ReadStringArray(JsonElement arrayElement)
        {
            List<string> items = [with(arrayElement.GetArrayLength())];
            foreach (JsonElement item in arrayElement.EnumerateArray())
            {
                if (item.ValueKind == JsonValueKind.String && item.GetString() is { } text)
                    items.Add(text);
            }

            return [.. items];
        }

        public bool NeedsRemoteLookup(string language)
            => _tables.TryGetValue(language, out LoadedWordTable? table) && (!table.Complete || table.ReportMissing);

        public bool ShouldAskServer(string language, [NotNullWhen(true)] string? key, bool plain)
        {
            if (string.IsNullOrWhiteSpace(key) || key.Length > MaxTranslateKeyLength)
                return false;

            if (!_tables.TryGetValue(language, out LoadedWordTable? table))
                return false;

            if (plain && !HasKeyPrefix(table.Prefixes, key))
                return false;

            if (table.Words.ContainsKey(key) || table.Asked.ContainsKey(key))
                return false;

            return !table.Complete || (table.ReportMissing && table.Prefixes.Length > 0 && HasKeyPrefix(table.Prefixes, key));
        }

        public List<string> ClaimUnasked(string language, IEnumerable<string> candidates)
        {
            List<string> claimed = [];
            if (!_tables.TryGetValue(language, out LoadedWordTable? table))
                return claimed;

            foreach (var key in candidates)
            {
                if (!table.Words.ContainsKey(key) && table.Asked.TryAdd(key, 0))
                    claimed.Add(key);
            }

            return claimed;
        }

        public void MergeTranslations(string language, IReadOnlyDictionary<string, string> words)
        {
            if (!_tables.TryGetValue(language, out LoadedWordTable? table))
                return;

            foreach (KeyValuePair<string, string> entry in words)
                table.Words[entry.Key] = entry.Value;
        }

        public List<(string Language, HashSet<string> Keys)> TakeQueuedRequests()
        {
            lock (_sync)
            {
                if (_queuedRequests.Count == 0)
                    return [];

                List<(string, HashSet<string>)> taken = [with(_queuedRequests.Count)];
                foreach (KeyValuePair<string, HashSet<string>> entry in _queuedRequests)
                    taken.Add((entry.Key, entry.Value));

                _queuedRequests.Clear();
                return taken;
            }
        }

        public string? Translate(string language, string? key)
        {
            if (string.IsNullOrWhiteSpace(key))
                return key;

            var targetLanguage = HasLanguage(language) ? language : DefaultLanguage;
            if (_tables.TryGetValue(targetLanguage, out LoadedWordTable? table) && !HasKeyPrefix(table.Prefixes, key))
                return key;

            return LookupKey(targetLanguage, key, probe: false) ?? key;
        }

        public bool TryTranslate(string language, string key, [NotNullWhen(true)] out string? words)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                words = null;
                return false;
            }

            var targetLanguage = HasLanguage(language) ? language : DefaultLanguage;
            words = LookupKey(targetLanguage, key, probe: true);
            return words is not null;
        }

        public string? Translate(string language, string? key, IReadOnlyDictionary<string, object?>? arguments)
        {
            if (string.IsNullOrWhiteSpace(key))
                return key;

            var targetLanguage = HasLanguage(language) ? language : DefaultLanguage;
            var template = UIWords.TryReadCount(arguments, out var count)
                ? LookupPlural(targetLanguage, key, count)
                : LookupKey(targetLanguage, key, probe: false) ?? key;

            return UIWords.Format(
                template,
                arguments,
                nested => (nested.IsText ? Translate(targetLanguage, nested.Key) : Translate(targetLanguage, nested.Key, nested.Arguments)) ?? nested.Key
            );
        }

        private string LookupPlural(string language, string key, double count)
        {
            var form = UIPluralRules.FormKey(key, UIPluralRules.Select(language, count));
            if (LookupKey(language, form, probe: true) is { } exact)
                return exact;

            var other = UIPluralRules.FormKey(key, UIPluralCategory.Other);
            if (LookupKey(language, other, probe: true) is { } fallbackOther)
                return fallbackOther;

            return LookupKey(language, key, probe: false) ?? key;
        }

        private string? LookupKey(string language, string key, bool probe)
        {
            if (_tables.TryGetValue(language, out LoadedWordTable? table))
            {
                if (table.Words.TryGetValue(key, out var translated))
                    return translated;

                if (!probe && ShouldAskServer(language, key, plain: false))
                    QueueKey(language, key);
            }

            if (!string.Equals(language, DefaultLanguage, StringComparison.Ordinal)
                && _tables.TryGetValue(DefaultLanguage, out LoadedWordTable? fallback)
                && fallback.Words.TryGetValue(key, out var fallbackTranslated))
            {
                return fallbackTranslated;
            }

            return null;
        }

        private void QueueKey(string language, string key)
        {
            lock (_sync)
            {
                if (!_queuedRequests.TryGetValue(language, out HashSet<string>? set))
                {
                    set = [with(StringComparer.Ordinal)];
                    _queuedRequests[language] = set;
                }

                _ = set.Add(key);
            }
        }

        private static bool HasKeyPrefix(string[] prefixes, string value)
        {
            if (prefixes.Length == 0)
                return true;

            for (var i = 0; i < prefixes.Length; i++)
            {
                if (value.StartsWith(prefixes[i], StringComparison.Ordinal))
                    return true;
            }

            return false;
        }

        private sealed record LoadedWordTable(
            ConcurrentDictionary<string, string> Words,
            bool Complete,
            string[] Prefixes,
            bool ReportMissing)
        {
            public ConcurrentDictionary<string, byte> Asked { get; } = new(StringComparer.Ordinal);
        }
    }
}
