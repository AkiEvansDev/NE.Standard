using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;
using Microsoft.Win32;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Application;
using NE.Standard.UI.Files;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Web.Hosting;

namespace NE.Standard.UI.Desktop.Hosting;

/// <summary>WPF control hosting a <see cref="WebView2"/> surface bound to a <see cref="DesktopWebHost"/>.</summary>
public sealed class DesktopShellControl : Border, IDisposable
{
    private const string ThemeBridgeScript = """
        (() => {
            const media = window.matchMedia("(prefers-color-scheme: dark)");
            const report = () => {
                const attr = document.documentElement?.getAttribute("data-ui-theme") ?? "auto";
                const dark = attr === "dark" || (attr !== "light" && media.matches);
                window.chrome?.webview?.postMessage(JSON.stringify({ type: "theme", dark }));
            };
            const attach = () => {
                report();
                new MutationObserver(report).observe(document.documentElement, { attributes: true, attributeFilter: ["data-ui-theme"] });
            };
            if (document.documentElement) {
                attach();
            } else {
                document.addEventListener("DOMContentLoaded", attach, { once: true });
            }
            media.addEventListener("change", report);
        })();
        """;

    private static readonly JsonSerializerOptions BridgeJsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    private static readonly HashSet<string> AllowedEditMenuCommands =
    [
        with(StringComparer.OrdinalIgnoreCase),
        "cut",
        "copy",
        "paste",
        "pasteAndMatchStyle",
        "selectAll",
        "undo",
        "redo"
    ];

    private Task<CoreWebView2Environment>? _environmentTask;
    private Task? _initializationTask;
    private TaskCompletionSource<bool>? _pendingNavigation;
    private PendingCloseRequest? _pendingCloseConfirmation;
    private DesktopToastNotifier? _toastNotifier;
    private int _nextHostRequestId;
    private bool _disposed;

    /// <summary>Initializes a new <see cref="DesktopShellControl"/> bound to <paramref name="host"/>.</summary>
    public DesktopShellControl(DesktopWebHost host)
    {
        ArgumentNullException.ThrowIfNull(host);

        Host = host;
        IsDarkTheme = host.Options.DefaultThemeMode != UIThemeMode.Light;
        DocumentTitle = host.Options.WindowTitle;

        WebView = new WebView2
        {
            AllowExternalDrop = true,
            HorizontalAlignment = HorizontalAlignment.Stretch,
            VerticalAlignment = VerticalAlignment.Stretch
        };

        ApplyGroundColors();
        Child = WebView;
    }

    /// <summary>Occurs when the active page updates its <see cref="DocumentTitle"/>.</summary>
    public event EventHandler? TitleChanged;

    /// <summary>Occurs when the effective <see cref="IsDarkTheme"/> state changes on the page.</summary>
    public event EventHandler? ThemeChanged;

    /// <summary>Occurs when a file download initiated inside the shell finishes or fails.</summary>
    public event EventHandler<DesktopDownloadCompletedEventArgs>? DownloadCompleted;

    /// <summary>Occurs when the shell displays a native Windows system toast notification.</summary>
    public event EventHandler<DesktopNotificationShownEventArgs>? SystemNotificationShown;

    internal event EventHandler? WindowActivationRequested;

    internal string? LastToastFailureReason => _toastNotifier?.LastFailureReason;

    /// <summary>Gets the backing <see cref="DesktopWebHost"/>.</summary>
    public DesktopWebHost Host { get; }

    /// <summary>Gets the underlying <see cref="WebView2"/> control.</summary>
    public WebView2 WebView { get; }

    /// <summary>Gets whether the active page currently resolves to the dark palette.</summary>
    public bool IsDarkTheme { get; private set; }

    /// <summary>Gets the latest document title reported by the page.</summary>
    public string DocumentTitle { get; private set; }

    /// <summary>Gets or sets whether the hosting desktop window is currently active and unminimized on screen.</summary>
    public bool IsSurfaceVisible
    {
        get;
        set
        {
            if (field == value)
                return;

            field = value;
            PostVisibilityState(value);
        }
    } = true;

    /// <summary>Initializes the WebView2 environment and starts the backing <see cref="DesktopWebHost"/> if needed.</summary>
    public Task EnsureInitializedAsync(CancellationToken cancellationToken = default)
    {
        ObjectDisposedException.ThrowIf(_disposed, this);
        return _initializationTask ??= InitializeCoreAsync(cancellationToken);
    }

    /// <summary>Navigates to <see cref="DesktopHostOptions.InitialRoute"/> and waits for initial document load.</summary>
    public Task OpenInitialPageAsync(CancellationToken cancellationToken = default)
        => NavigateAsync(Host.Options.InitialRoute, cancellationToken);

    /// <summary>Navigates to <paramref name="route"/> on <see cref="DesktopWebHost.BrowserBaseUri"/> and waits for navigation completion.</summary>
    public async Task NavigateAsync(string route, CancellationToken cancellationToken = default)
    {
        ObjectDisposedException.ThrowIf(_disposed, this);

        await EnsureInitializedAsync(cancellationToken).ConfigureAwait(true);

        TaskCompletionSource<bool> tcs = new(TaskCreationOptions.RunContinuationsAsynchronously);
        TaskCompletionSource<bool>? previous = Interlocked.Exchange(ref _pendingNavigation, tcs);
        _ = previous?.TrySetCanceled(CancellationToken.None);

        using CancellationTokenRegistration registration = cancellationToken.Register(static state => ((TaskCompletionSource<bool>)state!).TrySetCanceled(), tcs);

        Uri target = Host.ResolveBrowserUri(route);
        WebView.CoreWebView2.Navigate(target.AbsoluteUri);
        _ = await tcs.Task.ConfigureAwait(true);
    }

    /// <summary>Executes <paramref name="javaScript"/> inside the current page and returns the JSON-encoded result.</summary>
    public async Task<string> ExecuteScriptAsync(string javaScript)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(javaScript);
        await EnsureInitializedAsync().ConfigureAwait(true);
        return await WebView.CoreWebView2.ExecuteScriptAsync(javaScript).ConfigureAwait(true);
    }

    /// <summary>Checks whether the active page's leave guard currently reports unsaved work or pending commits.</summary>
    public async Task<bool> HasUnsavedWorkAsync()
    {
        if (_disposed || WebView.CoreWebView2 is null)
            return false;

        try
        {
            var json = await WebView.CoreWebView2
                .ExecuteScriptAsync("window.__neStandardUIRuntime?.hasUnsavedCloseWork?.() ?? (window.dispatchEvent(new Event('beforeunload', { cancelable: true })) === false)")
                .ConfigureAwait(true);

            return string.Equals(json, "true", StringComparison.Ordinal);
        }
        catch
        {
            return false;
        }
    }

    /// <summary>Asks the active page to settle pending values and, if unsaved work remains, opens the framework's localized leave confirmation dialog.</summary>
    public async Task<bool> ConfirmCloseAsync(CancellationToken cancellationToken = default)
    {
        if (_disposed || WebView.CoreWebView2 is null)
            return true;

        if (!await HasUnsavedWorkAsync().ConfigureAwait(true))
            return true;

        var requestId = Interlocked.Increment(ref _nextHostRequestId);
        TaskCompletionSource<bool> tcs = new(TaskCreationOptions.RunContinuationsAsynchronously);
        PendingCloseRequest current = new(requestId, tcs);
        PendingCloseRequest? previous = Interlocked.Exchange(ref _pendingCloseConfirmation, current);
        _ = previous?.Completion.TrySetResult(false);

        using CancellationTokenRegistration registration = cancellationToken.Register(static state => ((TaskCompletionSource<bool>)state!).TrySetResult(false), tcs);

        PostBridgeObject(new ConfirmCloseBridgeMessage("confirm-close", requestId));
        return await tcs.Task.ConfigureAwait(true);
    }

    /// <inheritdoc />
    public void Dispose()
    {
        if (_disposed)
            return;

        _disposed = true;
        _ = _pendingNavigation?.TrySetCanceled();
        _ = Interlocked.Exchange(ref _pendingCloseConfirmation, null)?.Completion.TrySetResult(true);
        _toastNotifier?.Dispose();
        WebView.Dispose();
    }

    internal Task<CoreWebView2Environment> WarmEnvironmentAsync()
    {
        ObjectDisposedException.ThrowIf(_disposed, this);
        return _environmentTask ??= CreateEnvironmentAsync();
    }

    private Task<CoreWebView2Environment> CreateEnvironmentAsync()
    {
        var userDataFolder = ResolveUserDataFolder(Host.Options);
        _ = Directory.CreateDirectory(userDataFolder);

        CoreWebView2EnvironmentOptions? environmentOptions = Host.Options.Mode == DesktopHostMode.InProcess
            ? new CoreWebView2EnvironmentOptions(additionalBrowserArguments: $"--ignore-certificate-errors-spki-list={DesktopLoopbackCertificate.Instance.SpkiSha256Base64}")
            : null;

        return CoreWebView2Environment.CreateAsync(browserExecutableFolder: null, userDataFolder: userDataFolder, options: environmentOptions);
    }

    private static string ResolveUserDataFolder(DesktopHostOptions options)
    {
        if (!string.IsNullOrWhiteSpace(options.UserDataFolder))
            return Path.GetFullPath(options.UserDataFolder);

        var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        var appFolder = SanitizeDirectorySegment(options.WindowTitle);
        return Path.Combine(localAppData, appFolder, "WebView2");
    }

    private static string SanitizeDirectorySegment(string? rawName)
    {
        if (string.IsNullOrWhiteSpace(rawName))
            return "NE.Standard";

        var invalid = Path.GetInvalidFileNameChars();
        var chars = rawName.Trim().ToCharArray();
        for (var i = 0; i < chars.Length; i++)
        {
            if (Array.IndexOf(invalid, chars[i]) >= 0)
                chars[i] = '_';
        }

        var result = new string(chars).Trim('.');
        return string.IsNullOrWhiteSpace(result) ? "NE.Standard" : result;
    }

    private void ApplyGroundColors()
    {
        UITheme theme = Host.ActiveTheme;
        UIColorPalette palette = IsDarkTheme ? theme.Dark : theme.Light;
        System.Drawing.Color bg = palette.Background.ToColor();

        Background = new SolidColorBrush(Color.FromRgb(bg.R, bg.G, bg.B));
        WebView.DefaultBackgroundColor = System.Drawing.Color.FromArgb(255, bg.R, bg.G, bg.B);
    }

    private async Task InitializeCoreAsync(CancellationToken cancellationToken)
    {
        Task hostStartTask = Host.StartAsync(cancellationToken);
        _ = hostStartTask.ContinueWith(static t => _ = t.Exception, CancellationToken.None, TaskContinuationOptions.OnlyOnFaulted | TaskContinuationOptions.ExecuteSynchronously, TaskScheduler.Default);

        CoreWebView2Environment environment = await WarmEnvironmentAsync().ConfigureAwait(true);
        await WebView.EnsureCoreWebView2Async(environment).ConfigureAwait(true);

        CoreWebView2 core = WebView.CoreWebView2;
        core.Profile.PreferredColorScheme = Host.Options.DefaultThemeMode switch
        {
            UIThemeMode.Dark => CoreWebView2PreferredColorScheme.Dark,
            UIThemeMode.Light => CoreWebView2PreferredColorScheme.Light,
            _ => CoreWebView2PreferredColorScheme.Auto
        };

        CoreWebView2Settings settings = core.Settings;
        settings.IsStatusBarEnabled = false;
        settings.IsBuiltInErrorPageEnabled = false;
        settings.AreBrowserAcceleratorKeysEnabled = false;
        settings.IsZoomControlEnabled = false;
        settings.IsPinchZoomEnabled = false;
        settings.AreDevToolsEnabled = Host.Options.EnableDevTools;

        var userDataFolder = ResolveUserDataFolder(Host.Options);
        _toastNotifier = new DesktopToastNotifier(Host, userDataFolder);

        _ = await core.AddScriptToExecuteOnDocumentCreatedAsync(ThemeBridgeScript).ConfigureAwait(true);
        _ = await core.AddScriptToExecuteOnDocumentCreatedAsync(BuildDesktopBridgeScript(Host.Options.Mode == DesktopHostMode.InProcess, IsSurfaceVisible)).ConfigureAwait(true);

        core.NavigationStarting += OnNavigationStarting;
        core.NavigationCompleted += OnNavigationCompleted;
        core.NewWindowRequested += OnNewWindowRequested;
        core.DocumentTitleChanged += OnDocumentTitleChanged;
        core.WebMessageReceived += OnWebMessageReceived;
        core.ContextMenuRequested += OnContextMenuRequested;
        core.DownloadStarting += OnDownloadStarting;
        core.PermissionRequested += OnPermissionRequested;
        core.NotificationReceived += OnNotificationReceived;

        await hostStartTask.ConfigureAwait(true);
        await GrantNotificationPermissionsAsync(core).ConfigureAwait(true);
    }

    private static string BuildDesktopBridgeScript(bool includeLocalTransfers, bool initiallyVisible)
    {
        var initialVisibleLiteral = initiallyVisible ? "true" : "false";
        var includeTransfersLiteral = includeLocalTransfers ? "true" : "false";

        return $$"""
            (() => {
                const webview = window.chrome?.webview;
                if (!webview) return;

                let nextId = 0;
                const pending = new Map();
                const notificationClicks = new Map();

                window.__neDesktopVisible = {{initialVisibleLiteral}};

                webview.addEventListener("message", event => {
                    const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
                    if (!data || typeof data !== "object") return;

                    if (data.type === "desktop-visibility") {
                        const next = Boolean(data.visible);
                        if (window.__neDesktopVisible !== next) {
                            window.__neDesktopVisible = next;
                            document.dispatchEvent(new Event("visibilitychange"));
                        }
                        return;
                    }

                    if (data.type === "notification-clicked" && typeof data.notificationId === "number") {
                        const onClick = notificationClicks.get(data.notificationId);
                        if (onClick) {
                            notificationClicks.delete(data.notificationId);
                            onClick();
                        }
                        return;
                    }

                    if (data.type === "notification-closed" && typeof data.notificationId === "number") {
                        notificationClicks.delete(data.notificationId);
                        return;
                    }

                    if (data.type === "confirm-close" && typeof data.requestId === "number") {
                        const runtime = window.__neStandardUIRuntime;
                        if (!runtime || typeof runtime.confirmCloseAsync !== "function") {
                            const allowClose = window.dispatchEvent(new Event("beforeunload", { cancelable: true })) !== false;
                            webview.postMessage(JSON.stringify({ type: "confirm-close-reply", requestId: data.requestId, allowClose }));
                            return;
                        }
                        Promise.resolve(runtime.confirmCloseAsync()).then(
                            allowClose => webview.postMessage(JSON.stringify({ type: "confirm-close-reply", requestId: data.requestId, allowClose: Boolean(allowClose) })),
                            () => webview.postMessage(JSON.stringify({ type: "confirm-close-reply", requestId: data.requestId, allowClose: true }))
                        );
                        return;
                    }

                    if (typeof data.requestId !== "number") return;
                    const waiter = pending.get(data.requestId);
                    if (!waiter) return;
                    pending.delete(data.requestId);
                    if (data.error) waiter.reject(new Error(data.error));
                    else waiter.resolve(data);
                });

                window.__neDesktopShowNotification = (request, onClick) => new Promise(resolve => {
                    const requestId = ++nextId;
                    if (typeof onClick === "function")
                        notificationClicks.set(requestId, onClick);

                    pending.set(requestId, {
                        resolve: data => {
                            if (!data.handled) notificationClicks.delete(requestId);
                            resolve(Boolean(data.handled));
                        },
                        reject: () => {
                            notificationClicks.delete(requestId);
                            resolve(false);
                        }
                    });

                    try {
                        webview.postMessage(JSON.stringify({
                            type: "system-notification",
                            requestId,
                            title: request?.title ?? "",
                            body: request?.body ?? null,
                            tag: request?.tag ?? "",
                            silent: Boolean(request?.silent),
                            requireInteraction: Boolean(request?.requireInteraction)
                        }));
                    } catch {
                        pending.delete(requestId);
                        notificationClicks.delete(requestId);
                        resolve(false);
                    }
                });

                if ({{includeTransfersLiteral}}) {
                    if (typeof webview.postMessageWithAdditionalObjects === "function") {
                        window.__neDesktopUploadFiles = files => new Promise((resolve, reject) => {
                            const list = Array.from(files ?? []);
                            if (list.length === 0) {
                                resolve(null);
                                return;
                            }
                            const requestId = ++nextId;
                            const meta = list.map(f => ({ name: f.name ?? "", type: f.type ?? "" }));
                            pending.set(requestId, {
                                resolve: data => resolve(data.handled && data.selectionId ? { selectionId: data.selectionId } : null),
                                reject
                            });
                            try {
                                webview.postMessageWithAdditionalObjects(JSON.stringify({ type: "local-upload", requestId, files: meta }), list);
                            } catch {
                                pending.delete(requestId);
                                resolve(null);
                            }
                        });
                    }

                    window.__neDesktopDownloadFile = (requestPath, fileName) => new Promise(resolve => {
                        let url;
                        try {
                            url = new URL(requestPath, window.location.href);
                        } catch {
                            resolve(false);
                            return;
                        }
                        if (url.origin !== window.location.origin) {
                            resolve(false);
                            return;
                        }
                        const prefix = "/_ne/files/";
                        if (!url.pathname.startsWith(prefix)) {
                            resolve(false);
                            return;
                        }
                        const token = url.pathname.slice(prefix.length);
                        if (!token || token.includes("/")) {
                            resolve(false);
                            return;
                        }
                        const requestId = ++nextId;
                        pending.set(requestId, {
                            resolve: data => resolve(Boolean(data.handled)),
                            reject: () => resolve(false)
                        });
                        webview.postMessage(JSON.stringify({ type: "local-download", requestId, url: url.href, token: decodeURIComponent(token), fileName: fileName ?? "" }));
                    });
                }
            })();
            """;
    }

    private async Task GrantNotificationPermissionsAsync(CoreWebView2 core)
    {
        await core.Profile
            .SetPermissionStateAsync(CoreWebView2PermissionKind.Notifications, Host.BrowserBaseUri.GetLeftPart(UriPartial.Authority), CoreWebView2PermissionState.Allow)
            .ConfigureAwait(true);

        if (!MatchesOrigin(Host.BaseUri, Host.BrowserBaseUri))
        {
            await core.Profile
                .SetPermissionStateAsync(CoreWebView2PermissionKind.Notifications, Host.BaseUri.GetLeftPart(UriPartial.Authority), CoreWebView2PermissionState.Allow)
                .ConfigureAwait(true);
        }
    }

    private void PostVisibilityState(bool visible)
        => PostBridgeObject(new VisibilityBridgeMessage("desktop-visibility", visible));

    private void PostBridgeObject<T>(T payload)
    {
        if (_disposed || WebView.CoreWebView2 is not { } core)
            return;

        core.PostWebMessageAsJson(JsonSerializer.Serialize(payload, BridgeJsonOptions));
    }

    private void OnNavigationStarting(object? sender, CoreWebView2NavigationStartingEventArgs e)
    {
        if (!e.IsUserInitiated || !Uri.TryCreate(e.Uri, UriKind.Absolute, out Uri? targetUri))
            return;

        if (string.Equals(targetUri.Scheme, "about", StringComparison.OrdinalIgnoreCase) || IsSameOrigin(targetUri))
            return;

        e.Cancel = true;
        OpenExternalUri(targetUri);
    }

    private bool IsSameOrigin(Uri uri)
        => Host.IsStarted && (MatchesOrigin(uri, Host.BrowserBaseUri) || MatchesOrigin(uri, Host.BaseUri));

    private static bool MatchesOrigin(Uri candidate, Uri origin)
        => string.Equals(candidate.Scheme, origin.Scheme, StringComparison.OrdinalIgnoreCase)
            && string.Equals(candidate.Host, origin.Host, StringComparison.OrdinalIgnoreCase)
            && candidate.Port == origin.Port;

    private static void OpenExternalUri(Uri uri)
    {
        if (!string.Equals(uri.Scheme, Uri.UriSchemeHttp, StringComparison.OrdinalIgnoreCase)
            && !string.Equals(uri.Scheme, Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase)
            && !string.Equals(uri.Scheme, "mailto", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        _ = Process.Start(new ProcessStartInfo(uri.AbsoluteUri)
        {
            UseShellExecute = true
        });
    }

    private void OnNavigationCompleted(object? sender, CoreWebView2NavigationCompletedEventArgs e)
    {
        _ = Interlocked.Exchange(ref _pendingCloseConfirmation, null)?.Completion.TrySetResult(false);

        if (e.IsSuccess)
            PostVisibilityState(IsSurfaceVisible);

        TaskCompletionSource<bool>? pending = Interlocked.Exchange(ref _pendingNavigation, null);
        if (pending is null)
            return;

        if (e.IsSuccess || e.WebErrorStatus == CoreWebView2WebErrorStatus.OperationCanceled)
            _ = pending.TrySetResult(e.IsSuccess);
        else
            _ = pending.TrySetException(new InvalidOperationException($"WebView2 navigation failed with status '{e.WebErrorStatus}'."));
    }

    private void OnNewWindowRequested(object? sender, CoreWebView2NewWindowRequestedEventArgs e)
    {
        e.Handled = true;
        if (!Uri.TryCreate(e.Uri, UriKind.Absolute, out Uri? targetUri))
            return;

        if (IsSameOrigin(targetUri))
            WebView.CoreWebView2.Navigate(targetUri.AbsoluteUri);
        else
            OpenExternalUri(targetUri);
    }

    private void OnDocumentTitleChanged(object? sender, object e)
    {
        var title = WebView.CoreWebView2?.DocumentTitle;
        DocumentTitle = string.IsNullOrWhiteSpace(title) ? Host.Options.WindowTitle : title;
        TitleChanged?.Invoke(this, EventArgs.Empty);
    }

    private void OnWebMessageReceived(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
    {
        try
        {
            var message = e.TryGetWebMessageAsString();
            if (string.IsNullOrWhiteSpace(message))
                return;

            using JsonDocument doc = JsonDocument.Parse(message);
            JsonElement root = doc.RootElement;
            if (root.ValueKind != JsonValueKind.Object || !root.TryGetProperty("type", out JsonElement typeProp))
                return;

            var type = typeProp.GetString();
            if (string.Equals(type, "theme", StringComparison.Ordinal))
            {
                HandleThemeMessage(root);
                return;
            }

            if (!Uri.TryCreate(e.Source, UriKind.Absolute, out Uri? sourceUri)
                || !IsSameOrigin(sourceUri)
                || !root.TryGetProperty("requestId", out JsonElement idProp)
                || !idProp.TryGetInt32(out var requestId)
                || requestId <= 0)
            {
                return;
            }

            if (string.Equals(type, "confirm-close-reply", StringComparison.Ordinal))
            {
                HandleConfirmCloseReply(requestId, root);
                return;
            }

            if (string.Equals(type, "system-notification", StringComparison.Ordinal))
            {
                HandleSystemNotification(requestId, root);
                return;
            }

            if (Host.Options.Mode != DesktopHostMode.InProcess)
                return;

            if (string.Equals(type, "local-upload", StringComparison.Ordinal))
            {
                if (!TryReadLocalUploadCandidates(root, e.AdditionalObjects, out List<LocalUploadCandidate>? candidates) || candidates is null)
                {
                    PostBridgeReply(new BridgeReply(requestId, Handled: false));
                    return;
                }

                _ = HandleLocalUploadAsync(requestId, sourceUri, candidates);
            }
            else if (string.Equals(type, "local-download", StringComparison.Ordinal))
            {
                var urlText = root.TryGetProperty("url", out JsonElement urlProp) ? urlProp.GetString() : null;
                var token = root.TryGetProperty("token", out JsonElement tokenProp) ? tokenProp.GetString() : null;
                var fileName = root.TryGetProperty("fileName", out JsonElement nameProp) ? nameProp.GetString() : null;

                if (string.IsNullOrWhiteSpace(token) || !Uri.TryCreate(urlText, UriKind.Absolute, out Uri? downloadUri))
                {
                    PostBridgeReply(new BridgeReply(requestId, Handled: false));
                    return;
                }

                _ = HandleLocalDownloadAsync(requestId, sourceUri, downloadUri, token, fileName);
            }
        }
        catch
        {
            // Ignore malformed messages from page scripts.
        }
    }

    private void HandleThemeMessage(JsonElement root)
    {
        if (!root.TryGetProperty("dark", out JsonElement darkProp)
            || (darkProp.ValueKind != JsonValueKind.True && darkProp.ValueKind != JsonValueKind.False))
        {
            return;
        }

        var isDark = darkProp.GetBoolean();
        if (IsDarkTheme == isDark)
            return;

        IsDarkTheme = isDark;
        ApplyGroundColors();
        ThemeChanged?.Invoke(this, EventArgs.Empty);
    }

    private void HandleConfirmCloseReply(int requestId, JsonElement root)
    {
        var allowClose = root.TryGetProperty("allowClose", out JsonElement allowProp) && allowProp.ValueKind == JsonValueKind.True;
        PendingCloseRequest? pendingClose = _pendingCloseConfirmation;
        if (pendingClose is not null && pendingClose.RequestId == requestId && Interlocked.CompareExchange(ref _pendingCloseConfirmation, null, pendingClose) == pendingClose)
            _ = pendingClose.Completion.TrySetResult(allowClose);
    }

    private void HandleSystemNotification(int requestId, JsonElement root)
    {
        var title = root.TryGetProperty("title", out JsonElement titleProp) && titleProp.ValueKind == JsonValueKind.String ? titleProp.GetString() : null;
        var body = root.TryGetProperty("body", out JsonElement bodyProp) && bodyProp.ValueKind == JsonValueKind.String ? bodyProp.GetString() : null;
        var tag = root.TryGetProperty("tag", out JsonElement tagProp) && tagProp.ValueKind == JsonValueKind.String ? tagProp.GetString() : null;
        var silent = root.TryGetProperty("silent", out JsonElement silentProp) && silentProp.ValueKind == JsonValueKind.True;
        var requireInteraction = root.TryGetProperty("requireInteraction", out JsonElement interactionProp) && interactionProp.ValueKind == JsonValueKind.True;

        if (string.IsNullOrWhiteSpace(body))
            body = null;

        if (string.IsNullOrWhiteSpace(tag))
            tag = null;

        if (string.IsNullOrWhiteSpace(title) || _toastNotifier is null)
        {
            PostBridgeReply(new BridgeReply(requestId, Handled: false));
            return;
        }

        var completed = 0;

        void NotifyActivated()
        {
            if (Interlocked.CompareExchange(ref completed, 1, 0) != 0)
                return;

            DispatchOnUi(() =>
            {
                if (_disposed)
                    return;

                WindowActivationRequested?.Invoke(this, EventArgs.Empty);
                PostBridgeObject(new NotificationEventBridgeMessage("notification-clicked", requestId));
            });
        }

        void NotifyDismissed()
        {
            if (Interlocked.CompareExchange(ref completed, 1, 0) != 0)
                return;

            DispatchOnUi(() =>
            {
                if (!_disposed)
                    PostBridgeObject(new NotificationEventBridgeMessage("notification-closed", requestId));
            });
        }

        var shown = _toastNotifier.TryShow(title, body, tag, silent, requireInteraction, NotifyActivated, NotifyDismissed, out Action toastDismiss);
        PostBridgeReply(new BridgeReply(requestId, Handled: shown));

        if (!shown)
            return;

        void ActivateProgrammatically()
        {
            NotifyActivated();
            toastDismiss();
        }

        SystemNotificationShown?.Invoke(this, new DesktopNotificationShownEventArgs(title, body, tag, silent, requireInteraction, ActivateProgrammatically, toastDismiss));
    }

    private void PostBridgeReply(BridgeReply reply)
        => PostBridgeObject(reply);

    private void DispatchOnUi(Action action)
    {
        if (Dispatcher.CheckAccess())
            action();
        else
            _ = Dispatcher.InvokeAsync(action);
    }

    private static bool TryReadLocalUploadCandidates(JsonElement root, IReadOnlyList<object>? additionalObjects, out List<LocalUploadCandidate>? candidates)
    {
        candidates = null;
        if (additionalObjects is null
            || additionalObjects.Count == 0
            || !root.TryGetProperty("files", out JsonElement filesProp)
            || filesProp.ValueKind != JsonValueKind.Array
            || filesProp.GetArrayLength() != additionalObjects.Count)
        {
            return false;
        }

        List<LocalUploadCandidate> resolved = [with(additionalObjects.Count)];
        var index = 0;
        foreach (JsonElement item in filesProp.EnumerateArray())
        {
            if (additionalObjects[index] is not CoreWebView2File coreFile
                || string.IsNullOrWhiteSpace(coreFile.Path)
                || !File.Exists(coreFile.Path))
            {
                return false;
            }

            var rawName = item.ValueKind == JsonValueKind.Object && item.TryGetProperty("name", out JsonElement nameProp) ? nameProp.GetString() : null;
            var rawType = item.ValueKind == JsonValueKind.Object && item.TryGetProperty("type", out JsonElement typeProp) ? typeProp.GetString() : null;
            resolved.Add(new LocalUploadCandidate(coreFile.Path, rawName, rawType));
            index++;
        }

        candidates = resolved;
        return true;
    }

    private async Task HandleLocalUploadAsync(int requestId, Uri sourceUri, List<LocalUploadCandidate> candidates)
    {
        try
        {
            var sessionId = await TryResolveAuthorizedSessionIdAsync(sourceUri, CancellationToken.None).ConfigureAwait(true);
            if (string.IsNullOrWhiteSpace(sessionId))
            {
                PostBridgeReply(new BridgeReply(requestId, Handled: false));
                return;
            }

            UIApplication application = Host.Services.GetRequiredService<UIApplication>();
            UIFileOptions limits = application.Files;

            if (candidates.Count > limits.MaxFilesPerSelection)
            {
                PostBridgeReply(new BridgeReply(requestId, Handled: true, Error: $"A selection carries at most {limits.MaxFilesPerSelection} files."));
                return;
            }

            IUIFileStore store = Host.Services.GetRequiredService<IUIFileStore>();
            WebSessionAllowance allowance = Host.Services.GetRequiredService<WebSessionAllowance>();
            using WebSessionAllowance.Claim claim = allowance.Open(sessionId, limits.MaxUploadBytesPerSession, limits.MaxUploadBytesTotal ?? 0);

            var storedSince = allowance.CommittedSince(DateTime.UtcNow - limits.UploadRetention - limits.CleanupInterval);
            claim.HoldElsewhere(await store.GetUploadedBytesAsync(sessionId, CancellationToken.None).ConfigureAwait(true), storedSince);

            var selectionId = Guid.NewGuid().ToString("N");
            var totalBytes = 0L;
            var registeredCount = 0;
            var committed = false;

            try
            {
                for (var i = 0; i < candidates.Count; i++)
                {
                    LocalUploadCandidate candidate = candidates[i];
                    FileInfo info = new(candidate.Path);
                    if (!info.Exists)
                    {
                        PostBridgeReply(new BridgeReply(requestId, Handled: false));
                        return;
                    }

                    var fileLength = info.Length;
                    if (fileLength > limits.MaxFileSize)
                    {
                        PostBridgeReply(new BridgeReply(requestId, Handled: true, Error: $"A file may be at most {limits.MaxFileSize} bytes."));
                        return;
                    }

                    var fileName = WebFileEndpoints.ReduceFileName(candidate.Name) ?? WebFileEndpoints.ReduceFileName(info.Name) ?? "upload";
                    if (!claim.TryReserve(UIAllowanceCharge.Overhead(fileName) + fileLength))
                    {
                        PostBridgeReply(new BridgeReply(requestId, Handled: true, Error: "Upload quota exceeded."));
                        return;
                    }

                    var contentType = string.IsNullOrWhiteSpace(candidate.ContentType) ? null : candidate.ContentType;
                    UIUploadFile uploaded = await store
                        .RegisterLocalUploadAsync(sessionId, selectionId, candidate.Path, fileName, contentType, CancellationToken.None)
                        .ConfigureAwait(true);

                    registeredCount++;
                    totalBytes += uploaded.Size;
                }

                claim.Commit();
                committed = true;
            }
            finally
            {
                if (!committed && registeredCount > 0)
                    await store.RemoveSelectionAsync(sessionId, selectionId, CancellationToken.None).ConfigureAwait(true);
            }

            Host.Services.GetService<WebUIMetrics>()?.FileUploaded(totalBytes);
            PostBridgeReply(new BridgeReply(requestId, Handled: true, SelectionId: selectionId));
        }
        catch (Exception ex)
        {
            PostBridgeReply(new BridgeReply(requestId, Handled: true, Error: ex.Message));
        }
    }

    private async Task<string?> TryResolveAuthorizedSessionIdAsync(Uri pageOrigin, CancellationToken cancellationToken)
    {
        if (_disposed || WebView.CoreWebView2 is not { } core)
            return null;

        UIApplication application = Host.Services.GetRequiredService<UIApplication>();
        if (application.Security.IdentitySource == UIIdentitySource.Claims)
            return null;

        WebSessionCookie sessionCookie = Host.Services.GetRequiredService<WebSessionCookie>();
        var expectedName = sessionCookie.NameForScheme(string.Equals(pageOrigin.Scheme, Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase));
        List<CoreWebView2Cookie> cookies = await core.CookieManager.GetCookiesAsync(pageOrigin.GetLeftPart(UriPartial.Authority)).ConfigureAwait(true);

        string? secret = null;
        for (var i = 0; i < cookies.Count; i++)
        {
            if (string.Equals(cookies[i].Name, expectedName, StringComparison.Ordinal))
            {
                secret = cookies[i].Value;
                break;
            }
        }

        var sessionId = UISessionSecret.TryToSessionId(secret);
        if (string.IsNullOrWhiteSpace(sessionId))
            return null;

        IUserSessionStore sessions = Host.Services.GetRequiredService<IUserSessionStore>();
        UserSessionState? stored = await sessions.TryGetAsync(sessionId, cancellationToken).ConfigureAwait(true);
        if (stored is null || stored.IsIdle(application.Sessions, DateTime.UtcNow))
            return null;

        return application.Security.DefaultPolicy == UIAuthorizationDefault.Authenticated && !stored.IsAuthenticated
            ? null
            : stored.SessionId;
    }

    private async Task HandleLocalDownloadAsync(int requestId, Uri pageOrigin, Uri downloadUri, string token, string? fileName)
    {
        var sessionId = await TryResolveAuthorizedSessionIdAsync(pageOrigin, CancellationToken.None).ConfigureAwait(true);
        if (string.IsNullOrWhiteSpace(sessionId))
        {
            PostBridgeReply(new BridgeReply(requestId, Handled: false));
            return;
        }

        var suggestedName = WebFileEndpoints.ReduceFileName(fileName) ?? "download";
        var initialDirectory = ResolveDownloadsDirectory(Host.Options);
        string? targetPath;

        if (Host.Options.DownloadMode == DesktopDownloadMode.Directory)
        {
            _ = Directory.CreateDirectory(initialDirectory);
            targetPath = ResolveUniqueFilePath(initialDirectory, suggestedName);
        }
        else
        {
            targetPath = ShowSaveFileDialog(initialDirectory, suggestedName);
            if (string.IsNullOrWhiteSpace(targetPath))
            {
                IUIFileStore cancelledStore = Host.Services.GetRequiredService<IUIFileStore>();
                if (await cancelledStore.TakeDownloadAsync(sessionId, token, CancellationToken.None).ConfigureAwait(true) is { } discarded)
                    await discarded.DisposeAsync().ConfigureAwait(true);

                PostBridgeReply(new BridgeReply(requestId, Handled: true));
                return;
            }
        }

        IUIFileStore store = Host.Services.GetRequiredService<IUIFileStore>();
        var delivered = false;
        try
        {
            delivered = await Task.Run(() => store.TryDeliverDownloadAsync(sessionId, token, targetPath, CancellationToken.None)).ConfigureAwait(true);
        }
        catch
        {
            delivered = false;
        }

        if (!delivered)
        {
            if (Host.Options.DownloadMode == DesktopDownloadMode.Directory)
            {
                PostBridgeReply(new BridgeReply(requestId, Handled: false));
                return;
            }

            PostBridgeReply(new BridgeReply(requestId, Handled: true));
            DownloadCompleted?.Invoke(this, new DesktopDownloadCompletedEventArgs(downloadUri, targetPath, succeeded: false));
            return;
        }

        if (Host.Services.GetService<WebUIMetrics>() is { } metrics && File.Exists(targetPath))
            metrics.FileDownloaded(new FileInfo(targetPath).Length);

        PostBridgeReply(new BridgeReply(requestId, Handled: true));
        DownloadCompleted?.Invoke(this, new DesktopDownloadCompletedEventArgs(downloadUri, targetPath, succeeded: true));
    }

    private static string ResolveDownloadsDirectory(DesktopHostOptions options)
    {
        if (!string.IsNullOrWhiteSpace(options.DownloadsDirectory))
            return Path.GetFullPath(options.DownloadsDirectory);

        var userProfile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
        return Path.Combine(userProfile, "Downloads");
    }

    private static string ResolveUniqueFilePath(string directory, string fileName)
    {
        var candidate = Path.Combine(directory, fileName);
        if (!File.Exists(candidate))
            return candidate;

        var stem = Path.GetFileNameWithoutExtension(fileName);
        var ext = Path.GetExtension(fileName);
        for (var i = 2; i < 10000; i++)
        {
            var next = Path.Combine(directory, $"{stem} ({i}){ext}");
            if (!File.Exists(next))
                return next;
        }

        return Path.Combine(directory, $"{stem}-{Guid.NewGuid():N}{ext}");
    }

    private string? ShowSaveFileDialog(string initialDirectory, string suggestedName)
    {
        SaveFileDialog dialog = new()
        {
            FileName = suggestedName,
            InitialDirectory = Directory.Exists(initialDirectory) ? initialDirectory : null,
            OverwritePrompt = true
        };

        var extension = Path.GetExtension(suggestedName);
        if (!string.IsNullOrWhiteSpace(extension))
        {
            dialog.DefaultExt = extension;
            dialog.Filter = $"*{extension}|*{extension}|*.*|*.*";
        }

        Window? owner = Window.GetWindow(this);
        var accepted = owner is not null ? dialog.ShowDialog(owner) : dialog.ShowDialog();
        return accepted == true && !string.IsNullOrWhiteSpace(dialog.FileName) ? dialog.FileName : null;
    }

    private void OnContextMenuRequested(object? sender, CoreWebView2ContextMenuRequestedEventArgs e)
    {
        CoreWebView2ContextMenuTarget target = e.ContextMenuTarget;
        if (!target.IsEditable && !target.HasSelection)
        {
            if (!Host.Options.EnableDevTools)
            {
                e.Handled = true;
                return;
            }

            FilterContextMenuItems(e.MenuItems, allowEdit: false, allowInspect: true);
            if (e.MenuItems.Count == 0)
                e.Handled = true;

            return;
        }

        FilterContextMenuItems(e.MenuItems, allowEdit: true, allowInspect: Host.Options.EnableDevTools);
    }

    private static void FilterContextMenuItems(IList<CoreWebView2ContextMenuItem> items, bool allowEdit, bool allowInspect)
    {
        for (var i = items.Count - 1; i >= 0; i--)
        {
            CoreWebView2ContextMenuItem item = items[i];
            var keep = (allowEdit && AllowedEditMenuCommands.Contains(item.Name))
                || (allowInspect && string.Equals(item.Name, "inspectElement", StringComparison.OrdinalIgnoreCase));

            if (!keep)
                items.RemoveAt(i);
        }
    }

    private void OnDownloadStarting(object? sender, CoreWebView2DownloadStartingEventArgs e)
    {
        e.Handled = true;

        var suggestedName = Path.GetFileName(e.ResultFilePath);
        if (string.IsNullOrWhiteSpace(suggestedName))
            suggestedName = "download";

        Uri sourceUri = Uri.TryCreate(e.DownloadOperation.Uri, UriKind.Absolute, out Uri? parsed)
            ? parsed
            : Host.BrowserBaseUri;

        var initialDirectory = ResolveDownloadsDirectory(Host.Options);

        if (Host.Options.DownloadMode == DesktopDownloadMode.Directory)
        {
            _ = Directory.CreateDirectory(initialDirectory);
            var targetPath = ResolveUniqueFilePath(initialDirectory, suggestedName);
            e.ResultFilePath = targetPath;
            TrackDownload(e.DownloadOperation, sourceUri, targetPath);
            return;
        }

        CoreWebView2Deferral deferral = e.GetDeferral();
        _ = Dispatcher.InvokeAsync(() => PromptSaveDownload(e, deferral, sourceUri, initialDirectory, suggestedName));
    }

    private void TrackDownload(CoreWebView2DownloadOperation operation, Uri sourceUri, string targetPath)
    {
        operation.StateChanged += (_, _) =>
        {
            if (operation.State == CoreWebView2DownloadState.InProgress)
                return;

            var succeeded = operation.State == CoreWebView2DownloadState.Completed;
            DownloadCompleted?.Invoke(this, new DesktopDownloadCompletedEventArgs(sourceUri, targetPath, succeeded));
        };
    }

    private void PromptSaveDownload(CoreWebView2DownloadStartingEventArgs e, CoreWebView2Deferral deferral, Uri sourceUri, string initialDirectory, string suggestedName)
    {
        using (deferral)
        {
            if (_disposed)
            {
                e.Cancel = true;
                return;
            }

            var chosenPath = ShowSaveFileDialog(initialDirectory, suggestedName);
            if (string.IsNullOrWhiteSpace(chosenPath))
            {
                e.Cancel = true;
                return;
            }

            e.ResultFilePath = chosenPath;
            TrackDownload(e.DownloadOperation, sourceUri, chosenPath);
        }
    }

    private void OnPermissionRequested(object? sender, CoreWebView2PermissionRequestedEventArgs e)
    {
        if (e.PermissionKind != CoreWebView2PermissionKind.Notifications)
            return;

        if (!Uri.TryCreate(e.Uri, UriKind.Absolute, out Uri? origin) || !IsSameOrigin(origin))
            return;

        e.State = CoreWebView2PermissionState.Allow;
        e.Handled = true;
    }

    private void OnNotificationReceived(object? sender, CoreWebView2NotificationReceivedEventArgs e)
    {
        if (!Uri.TryCreate(e.SenderOrigin, UriKind.Absolute, out Uri? origin) || !IsSameOrigin(origin) || _toastNotifier is null)
            return;

        e.Handled = true;
        CoreWebView2Notification webNotification = e.Notification;

        var title = webNotification.Title;
        var body = string.IsNullOrWhiteSpace(webNotification.Body) ? null : webNotification.Body;
        var tag = string.IsNullOrWhiteSpace(webNotification.Tag) ? null : webNotification.Tag;
        var silent = webNotification.IsSilent;
        var requireInteraction = webNotification.RequiresInteraction;

        if (string.IsNullOrWhiteSpace(title))
        {
            webNotification.ReportClosed();
            return;
        }

        var completed = 0;

        void NotifyActivated()
        {
            if (Interlocked.CompareExchange(ref completed, 1, 0) != 0)
                return;

            DispatchOnUi(() =>
            {
                if (_disposed)
                    return;

                WindowActivationRequested?.Invoke(this, EventArgs.Empty);
                webNotification.ReportClicked();
                webNotification.ReportClosed();
            });
        }

        void NotifyDismissed()
        {
            if (Interlocked.CompareExchange(ref completed, 1, 0) != 0)
                return;

            DispatchOnUi(() =>
            {
                if (!_disposed)
                    webNotification.ReportClosed();
            });
        }

        var shown = _toastNotifier.TryShow(title, body, tag, silent, requireInteraction, NotifyActivated, NotifyDismissed, out Action toastDismiss);
        if (!shown)
        {
            webNotification.ReportClosed();
            return;
        }

        webNotification.ReportShown();
        webNotification.CloseRequested += (_, _) => toastDismiss();

        void ActivateProgrammatically()
        {
            NotifyActivated();
            toastDismiss();
        }

        SystemNotificationShown?.Invoke(this, new DesktopNotificationShownEventArgs(title, body, tag, silent, requireInteraction, ActivateProgrammatically, toastDismiss));
    }

    private sealed record LocalUploadCandidate(string Path, string? Name, string? ContentType);

    private sealed record BridgeReply(int RequestId, bool Handled, string? SelectionId = null, string? Error = null);

    private sealed record VisibilityBridgeMessage(string Type, bool Visible);

    private sealed record ConfirmCloseBridgeMessage(string Type, int RequestId);

    private sealed record NotificationEventBridgeMessage(string Type, int NotificationId);

    private sealed record PendingCloseRequest(int RequestId, TaskCompletionSource<bool> Completion);
}
