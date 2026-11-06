using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
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
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Primitives.Json;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Serialization;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Runtime;
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
    private static readonly JsonSerializerOptions WireOptions = CreateWireOptions();

    private readonly RemoteUIClientSession _session;
    private readonly HubConnection _hub;
    private readonly RemoteClientTranslator _translator;
    private readonly string? _initialPageId;
    private readonly long? _initialSequence;
    private readonly ServerChangeSet _initialChanges;
    private readonly Action<RemoteUIClientTransport>? _onClose;
    private readonly ConcurrentQueue<Task> _incoming;

    private UIClientPage? _page;
    private string? _runtimeStamp;
    private bool _attached;
    private bool _closed;

    private RemoteUIClientTransport(
        RemoteUIClientSession session,
        HubConnection hub,
        ConcurrentQueue<Task> incoming,
        string route,
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
        InitialNavigation = initialNavigation;
        View = view;
        HasController = hasController;
        Language = language;
        ThemeMode = themeMode;
        ThemeColors = themeColors;
        _initialPageId = initialPageId;
        _initialSequence = initialSequence;
        _initialChanges = initialChanges;
        _translator = translator;
        _onClose = onClose;

        _ = _hub.On<PushedServerChangeSet, string?>("ui.changes", OnServerChangesAsync);
        _ = _hub.On<PushedCommandExecutionResult, string?>("ui.commandResult", OnServerCommandResultAsync);
    }

    /// <inheritdoc />
    public string InstanceId => _hub.ConnectionId ?? _session.ClientWindowId;

    /// <inheritdoc />
    public string Route { get; }

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
        using HttpResponseMessage response = await session.HttpClient.GetAsync(new Uri(requestPath, UriKind.Relative), cancellationToken).ConfigureAwait(false);

        if (!response.IsSuccessStatusCode && response.StatusCode != System.Net.HttpStatusCode.NotFound)
            _ = response.EnsureSuccessStatusCode();

        var bytes = await response.Content.ReadAsByteArrayAsync(cancellationToken).ConfigureAwait(false);
        using JsonDocument doc = JsonDocument.Parse(bytes);
        JsonElement root = doc.RootElement;

        var route = root.GetProperty("route").GetString() ?? "/";
        UINavigationRequest navigation = root.GetProperty("navigation").Deserialize<UINavigationRequest>(WireOptions) ?? new UINavigationRequest { Route = route };
        var hasController = root.GetProperty("hasController").GetBoolean();
        var language = root.GetProperty("language").GetString() ?? "en";
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

        RemoteClientTranslator translator = new(language);
        if (root.TryGetProperty("words", out JsonElement wordsEl))
            translator.LoadWords(wordsEl);

        CompiledView view = CompiledViewWireSerializer.Read(root.GetProperty("view"));

        ConcurrentQueue<Task> incoming = new();
        HubConnection hub = BuildHubConnection(session, incoming);
        RemoteUIClientTransport transport = new(
            session,
            hub,
            incoming,
            route,
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

        await hub.StartAsync(cancellationToken).ConfigureAwait(false);
        return transport;
    }

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
            .AddJsonProtocol(protocol =>
            {
                UIWireJson.Apply(protocol.PayloadSerializerOptions);
                protocol.PayloadSerializerOptions.Converters.Add(new PushedServerChangeSetJsonConverter(incoming));
                protocol.PayloadSerializerOptions.Converters.Add(new PushedCommandExecutionResultJsonConverter(incoming));
                protocol.PayloadSerializerOptions.Converters.Add(new RemoteUICommandResultJsonConverter());
                protocol.PayloadSerializerOptions.Converters.Add(new RemoteClientEffectJsonConverter());
                protocol.PayloadSerializerOptions.Converters.Add(new ObjectToInferredTypesConverter());
            })
            .Build();
    }

    internal void BindPage(UIClientPage page)
        => _page = page;

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
        _page?.Receive(resolved);
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
        if (onlySessionKey && resolved.Changes.Updates.Length == 0)
            return;

        _page?.Receive(resolved);
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
            WireAttachResult firstAttach = await _hub.InvokeAsync<WireAttachResult>(
                "AttachAsync",
                new WireAttachRequest
                {
                    ClientWindowId = _session.ClientWindowId,
                    Route = InitialNavigation.Route,
                    Parameters = InitialNavigation.Parameters,
                    PageId = _initialPageId,
                    View = View.Fingerprint,
                    Since = _initialSequence
                },
                cancellationToken
            ).ConfigureAwait(false);

            _runtimeStamp = firstAttach.Runtime;
            ServerChangeSet hydrated = await ResolveStagedUpdatesAsync(_initialChanges, cancellationToken).ConfigureAwait(false);
            ServerChangeSet delta = await ResolveStagedUpdatesAsync(firstAttach.InitialChanges, cancellationToken).ConfigureAwait(false);

            return delta.Updates.Length == 0
                ? hydrated
                : hydrated.Updates.Length == 0
                    ? delta
                    : new ServerChangeSet { Updates = [.. hydrated.Updates, .. delta.Updates] };
        }

        UINavigationRequest currentNav = _page?.Navigation ?? InitialNavigation;
        WireAttachResult resyncAttach = await _hub.InvokeAsync<WireAttachResult>(
            "AttachAsync",
            new WireAttachRequest
            {
                ClientWindowId = _session.ClientWindowId,
                Route = currentNav.Route,
                Parameters = currentNav.Parameters,
                View = View.Fingerprint
            },
            cancellationToken
        ).ConfigureAwait(false);

        if (resyncAttach.Runtime is not null)
            _runtimeStamp = resyncAttach.Runtime;

        return await ResolveStagedUpdatesAsync(resyncAttach.InitialChanges, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async Task<UICommandExecutionResult> ProcessEventAsync(UICommandRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

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
            new WireCommandRequest
            {
                EventId = request.EventId,
                Action = request.Action,
                DynamicParameters = dynamicParameters,
                DynamicParametersToken = parametersToken,
                RequestId = request.RequestId
            },
            cancellationToken
        ).ConfigureAwait(false);

        await DrainIncomingAsync().ConfigureAwait(false);
        (UICommandExecutionResult resolved, _) = await PrepareCommandResultAsync(raw, cancellationToken).ConfigureAwait(false);
        return resolved;
    }

    /// <inheritdoc />
    public async Task<ServerChangeSet> ProcessChangeSetAsync(ClientChangeSet changeSet, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(changeSet);

        WireValueChangeRequest[] updates = new WireValueChangeRequest[changeSet.Updates.Length];

        for (var i = 0; i < changeSet.Updates.Length; i++)
        {
            if (changeSet.Updates[i] is not ClientValueUIUpdate update)
                throw new InvalidOperationException($"Unsupported client update type '{changeSet.Updates[i].GetType().Name}'.");

            var json = JsonSerializer.SerializeToUtf8Bytes(update.Value, WireOptions);
            if (json.Length > LargeValueBytes)
            {
                var token = await StageClientValueAsync(json, cancellationToken).ConfigureAwait(false);
                updates[i] = new WireValueChangeRequest
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
                updates[i] = new WireValueChangeRequest
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
            new WireChangeSetRequest { Updates = updates },
            cancellationToken
        ).ConfigureAwait(false);

        await DrainIncomingAsync().ConfigureAwait(false);
        return await ResolveStagedUpdatesAsync(raw, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async Task<ServerChangeSet> RequestItemWindowAsync(UIItemWindowClientRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        ServerChangeSet raw = await _hub.InvokeAsync<ServerChangeSet>(
            "RequestItemWindowAsync",
            new WireItemWindowRequest
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

        await DrainIncomingAsync().ConfigureAwait(false);
        return await ResolveStagedUpdatesAsync(raw, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async Task<UICommandExecutionResult> NavigateInPlaceAsync(IReadOnlyDictionary<string, object?>? parameters, CancellationToken cancellationToken = default)
    {
        UICommandExecutionResult raw = await _hub.InvokeAsync<UICommandExecutionResult>(
            "NavigateInPlaceAsync",
            new WireAddressRequest { Parameters = parameters },
            cancellationToken
        ).ConfigureAwait(false);

        await DrainIncomingAsync().ConfigureAwait(false);
        (UICommandExecutionResult resolved, _) = await PrepareCommandResultAsync(raw, cancellationToken).ConfigureAwait(false);
        return resolved;
    }

    /// <summary>Asks the server controller whether the page may leave for <paramref name="target"/> when holding unsaved work.</summary>
    public async Task<UICommandExecutionResult> RequestLeaveAsync(string target, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target);

        UICommandExecutionResult raw = await _hub.InvokeAsync<UICommandExecutionResult>(
            "RequestLeaveAsync",
            new WireLeaveRequest { Target = target },
            cancellationToken
        ).ConfigureAwait(false);

        await DrainIncomingAsync().ConfigureAwait(false);
        (UICommandExecutionResult resolved, _) = await PrepareCommandResultAsync(raw, cancellationToken).ConfigureAwait(false);
        return resolved;
    }

    /// <inheritdoc />
    public async Task<ServerChangeSet> FlushAsync(CancellationToken cancellationToken = default)
    {
        await DrainIncomingAsync().ConfigureAwait(false);
        return ServerChangeSet.Empty;
    }

    /// <inheritdoc />
    public async Task ReportClientStateAsync(UIClientState state, CancellationToken cancellationToken = default)
    {
        ClientState = state;
        await _hub.InvokeAsync(
            "ReportClientStateAsync",
            new WireClientStateRequest
            {
                Visible = state.IsVisible,
                NotificationPermission = state.NotificationPermission
            },
            cancellationToken
        ).ConfigureAwait(false);

        await DrainIncomingAsync().ConfigureAwait(false);
    }

    /// <inheritdoc />
    public bool SessionHolds(ClientEffect effect)
        => effect switch
        {
            SetLanguageEffect language => string.Equals(language.Language, Language, StringComparison.Ordinal),
            SetThemeEffect theme => theme.Stored || theme.Mode == ThemeMode,
            SetThemeColorsEffect colors => Equals(colors.Colors, ThemeColors),
            _ => true
        };

    /// <inheritdoc />
    public async Task ApplySettingAsync(ClientEffect setting, CancellationToken cancellationToken = default)
    {
        switch (setting)
        {
            case SetLanguageEffect language:
                WireLanguageResult langResult = await _hub.InvokeAsync<WireLanguageResult>(
                    "SetLanguageAsync",
                    new WireSetLanguageRequest { Language = language.Language },
                    cancellationToken
                ).ConfigureAwait(false);

                await FetchWordsAsync(langResult.Href, cancellationToken).ConfigureAwait(false);
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
                    new WireSetThemeRequest { Theme = themeName },
                    cancellationToken
                ).ConfigureAwait(false);

                ThemeMode = theme.Mode;
                break;

            case SetThemeColorsEffect colors:
                _ = await _hub.InvokeAsync<WireThemeColorsResult>(
                    "SetThemeColorsAsync",
                    new WireSetThemeColorsRequest { Colors = colors.Colors },
                    cancellationToken
                ).ConfigureAwait(false);

                ThemeColors = colors.Colors;
                break;

            default:
                break;
        }

        await DrainIncomingAsync().ConfigureAwait(false);
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

    /// <summary>Downloads a file from a download effect URL (<c>/_ne/files/{token}</c>) and records it on the page.</summary>
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
        _onClose?.Invoke(this);
        await _hub.DisposeAsync().ConfigureAwait(false);
    }

    private async Task DrainIncomingAsync()
    {
        await Task.Yield();
        while (_incoming.TryDequeue(out Task? pending))
        {
            await pending.ConfigureAwait(false);
            await Task.Yield();
        }
    }

    private async Task<(UICommandExecutionResult Result, bool OnlySessionKey)> PrepareCommandResultAsync(UICommandExecutionResult raw, CancellationToken cancellationToken)
    {
        ServerChangeSet changes = await ResolveStagedUpdatesAsync(raw.Changes, cancellationToken).ConfigureAwait(false);
        ClientEffect[] effects = raw.Command.Effects;
        if (effects.Length == 0)
            return (ReferenceEquals(changes, raw.Changes) ? raw : raw with { Changes = changes }, false);

        List<ClientEffect> filtered = new(effects.Length);
        var sawSessionKey = false;

        for (var i = 0; i < effects.Length; i++)
        {
            switch (effects[i])
            {
                case RemoteSessionKeyEffect sessionKey:
                    sawSessionKey = true;
                    await TradeSessionKeyAsync(sessionKey.Token, cancellationToken).ConfigureAwait(false);
                    break;

                case RemoteStoredLanguageEffect storedLanguage:
                    await FetchWordsAsync(storedLanguage.Href, cancellationToken).ConfigureAwait(false);
                    Language = storedLanguage.Language;
                    filtered.Add(new SetLanguageEffect(storedLanguage.Language));
                    break;

                case RemoteStoredThemeColorsEffect storedColors:
                    ThemeColors = storedColors.Colors;
                    filtered.Add(new SetThemeColorsEffect(storedColors.Colors));
                    break;

                case SetThemeEffect { Stored: true } storedTheme:
                    ThemeMode = storedTheme.Mode;
                    filtered.Add(storedTheme);
                    break;

                case DownloadFileEffect download:
                    _ = await DownloadFileAsync(download, cancellationToken).ConfigureAwait(false);
                    filtered.Add(download);
                    break;

                default:
                    filtered.Add(effects[i]);
                    break;
            }
        }

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
            if (changes.Updates[i] is not ServerValueUIUpdate { ValueToken: { } token } staged)
                continue;

            resolved ??= [.. changes.Updates];
            var value = await FetchStagedValueAsync(token, cancellationToken).ConfigureAwait(false);
            resolved[i] = new ServerValueUIUpdate
            {
                Address = staged.Address,
                Value = value,
                Content = staged.Content,
                ExceptInstanceId = staged.ExceptInstanceId
            };
        }

        return resolved is null ? changes : new ServerChangeSet { Updates = resolved };
    }

    private async Task<object?> FetchStagedValueAsync(string token, CancellationToken cancellationToken)
    {
        var path = $"/_ne/values/{Uri.EscapeDataString(token)}?instance={Uri.EscapeDataString(InstanceId)}";
        using HttpResponseMessage response = await _session.HttpClient.GetAsync(new Uri(path, UriKind.Relative), cancellationToken).ConfigureAwait(false);
        _ = response.EnsureSuccessStatusCode();

        var bytes = await response.Content.ReadAsByteArrayAsync(cancellationToken).ConfigureAwait(false);
        using JsonDocument doc = JsonDocument.Parse(bytes);
        return ObjectToInferredTypesConverter.ToInferredValue(doc.RootElement);
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

    private async Task TradeSessionKeyAsync(string token, CancellationToken cancellationToken)
    {
        var body = JsonSerializer.SerializeToUtf8Bytes(new { token }, WireOptions);
        using ByteArrayContent content = new(body);
        content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

        using HttpResponseMessage response = await _session.HttpClient
            .PostAsync(new Uri("/_ne/session/key", UriKind.Relative), content, cancellationToken)
            .ConfigureAwait(false);

        _ = response.EnsureSuccessStatusCode();
    }

    private async Task FetchWordsAsync(string href, CancellationToken cancellationToken)
    {
        using HttpResponseMessage response = await _session.HttpClient
            .GetAsync(RequireFrameworkPath(href), cancellationToken)
            .ConfigureAwait(false);

        _ = response.EnsureSuccessStatusCode();

        var bytes = await response.Content.ReadAsByteArrayAsync(cancellationToken).ConfigureAwait(false);
        using JsonDocument doc = JsonDocument.Parse(bytes);
        _translator.LoadWords(doc.RootElement);
    }

    private static JsonSerializerOptions CreateWireOptions()
    {
        JsonSerializerOptions options = UIWireJson.CreateOptions();
        options.Converters.Add(new RemoteUICommandResultJsonConverter());
        options.Converters.Add(new RemoteClientEffectJsonConverter());
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

    private sealed class RemoteClientTranslator(string defaultLanguage) : ITranslator
    {
        private readonly ConcurrentDictionary<string, Dictionary<string, string>> _tables = new(StringComparer.Ordinal);
        private readonly HashSet<string> _languages = new(StringComparer.Ordinal) { defaultLanguage };

        public string DefaultLanguage { get; } = defaultLanguage;

        public IReadOnlyList<string> Languages
        {
            get
            {
                lock (_languages)
                    return [.. _languages];
            }
        }

        public void LoadWords(JsonElement root)
        {
            var lang = root.TryGetProperty("language", out JsonElement langEl) ? langEl.GetString() ?? DefaultLanguage : DefaultLanguage;
            Dictionary<string, string> words = new(StringComparer.Ordinal);

            if (root.TryGetProperty("words", out JsonElement wordsEl) && wordsEl.ValueKind == JsonValueKind.Object)
            {
                foreach (JsonProperty prop in wordsEl.EnumerateObject())
                {
                    if (prop.Value.GetString() is { } val)
                        words[prop.Name] = val;
                }
            }

            _tables[lang] = words;
            lock (_languages)
                _ = _languages.Add(lang);
        }

        public string? Translate(string language, string? key)
        {
            if (string.IsNullOrEmpty(key))
                return key;

            if (_tables.TryGetValue(language, out Dictionary<string, string>? table) && table.TryGetValue(key, out var translated))
                return translated;

            if (_tables.TryGetValue(DefaultLanguage, out Dictionary<string, string>? fallback) && fallback.TryGetValue(key, out var fallbackTranslated))
                return fallbackTranslated;

            return key;
        }

        public bool TryTranslate(string language, string key, [NotNullWhen(true)] out string? words)
        {
            if (_tables.TryGetValue(language, out Dictionary<string, string>? table) && table.TryGetValue(key, out words))
                return true;

            words = null;
            return false;
        }
    }

    private sealed class RemoteSessionKeyEffect(string token) : ClientEffect
    {
        public override string Kind => "SessionKey";

        public string Token { get; } = token;
    }

    private sealed class RemoteStoredLanguageEffect(string language, string href) : ClientEffect
    {
        public override string Kind => ClientEffectKinds.SetLanguage;

        public string Language { get; } = language;

        public string Href { get; } = href;
    }

    private sealed class RemoteStoredThemeColorsEffect(UIThemeColors? colors) : ClientEffect
    {
        public override string Kind => ClientEffectKinds.SetThemeColors;

        public UIThemeColors? Colors { get; } = colors;
    }

    private sealed class RemoteClientEffectJsonConverter : JsonConverter<ClientEffect>
    {
        private static readonly ClientEffectJsonConverter Inner = new();

        public override ClientEffect? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            using JsonDocument doc = JsonDocument.ParseValue(ref reader);
            JsonElement root = doc.RootElement;

            if (root.TryGetProperty("kind", out JsonElement kindEl) && kindEl.ValueKind == JsonValueKind.String)
            {
                var kind = kindEl.GetString();
                if (string.Equals(kind, "SessionKey", StringComparison.Ordinal))
                {
                    var token = root.GetProperty("token").GetString() ?? string.Empty;
                    return new RemoteSessionKeyEffect(token);
                }

                if (string.Equals(kind, ClientEffectKinds.SetLanguage, StringComparison.Ordinal)
                    && root.TryGetProperty("href", out JsonElement hrefEl)
                    && hrefEl.ValueKind == JsonValueKind.String)
                {
                    var language = root.GetProperty("language").GetString() ?? string.Empty;
                    return new RemoteStoredLanguageEffect(language, hrefEl.GetString()!);
                }

                if (string.Equals(kind, ClientEffectKinds.SetThemeColors, StringComparison.Ordinal)
                    && root.TryGetProperty("css", out _))
                {
                    UIThemeColors? colors = root.TryGetProperty("colors", out JsonElement colorsEl) && colorsEl.ValueKind != JsonValueKind.Null
                        ? colorsEl.Deserialize<UIThemeColors>(options)
                        : null;
                    return new RemoteStoredThemeColorsEffect(colors);
                }
            }

            var rawBytes = Encoding.UTF8.GetBytes(root.GetRawText());
            Utf8JsonReader innerReader = new(rawBytes);
            _ = innerReader.Read();
            return Inner.Read(ref innerReader, typeToConvert, options);
        }

        public override void Write(Utf8JsonWriter writer, ClientEffect value, JsonSerializerOptions options)
            => Inner.Write(writer, value, options);
    }

    private sealed class WireAttachRequest
    {
        public required string ClientWindowId { get; init; }

        public required string Route { get; init; }

        public string? PageId { get; init; }

        public string? View { get; init; }

        public long? Since { get; init; }

        public string? Runtime { get; init; }

        public IReadOnlyDictionary<string, object?>? Parameters { get; init; }
    }

    private sealed class WireAttachResult
    {
        public ServerChangeSet InitialChanges { get; init; } = ServerChangeSet.Empty;

        public bool Reload { get; init; }

        public string? Runtime { get; init; }

        public long? RetentionMilliseconds { get; init; }

        public bool Fresh { get; init; }
    }

    private sealed class WireCommandRequest
    {
        public UIEventId EventId { get; init; }

        public string? Action { get; init; }

        public object?[] DynamicParameters { get; init; } = [];

        public string? DynamicParametersToken { get; init; }

        public int? RequestId { get; init; }
    }

    private sealed class WireValueChangeRequest
    {
        public required int ComponentId { get; init; }

        public required string PropertyName { get; init; }

        public object?[] DynamicParameters { get; init; } = [];

        public JsonElement? Value { get; init; }

        public string? ValueToken { get; init; }
    }

    private sealed class WireChangeSetRequest
    {
        public required WireValueChangeRequest[] Updates { get; init; }
    }

    private sealed class WireItemWindowRequest
    {
        public required int ComponentId { get; init; }

        public object?[] DynamicParameters { get; init; } = [];

        public required string Anchor { get; init; }

        public int Offset { get; init; }

        public string? Key { get; init; }

        public required int Count { get; init; }

        public bool Extend { get; init; }
    }

    private sealed class WireAddressRequest
    {
        public IReadOnlyDictionary<string, object?>? Parameters { get; init; }
    }

    private sealed class WireLeaveRequest
    {
        public required string Target { get; init; }
    }

    private sealed class WireClientStateRequest
    {
        public bool Visible { get; init; } = true;

        public UINotificationPermission NotificationPermission { get; init; }
    }

    private sealed class WireSetLanguageRequest
    {
        public required string Language { get; init; }
    }

    private sealed class WireLanguageResult
    {
        public required string Language { get; init; }

        public required string Href { get; init; }
    }

    private sealed class WireSetThemeRequest
    {
        public required string Theme { get; init; }
    }

    private sealed class WireSetThemeColorsRequest
    {
        public UIThemeColors? Colors { get; init; }
    }

    private sealed class WireThemeColorsResult
    {
        public string Css { get; init; } = string.Empty;
    }
}
