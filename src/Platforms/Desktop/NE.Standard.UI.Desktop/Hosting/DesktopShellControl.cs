using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
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
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Web.Hosting;

namespace NE.Standard.UI.Desktop.Hosting;

/// <summary>WPF control hosting a <see cref="WebView2"/> surface bound to a <see cref="DesktopWebHost"/>.</summary>
public sealed class DesktopShellControl : Border, IDisposable
{
    private const int HrErrorInvalidState = unchecked((int)0x8007139F);
    private const int MaxSanitizedFileNameLength = 200;
    private const int MaxTempFileStemLength = 180;
    private const int MaxDialogExtensionLength = 32;
    private const int FileBufferSize = 64 * 1024;

    private const string ThemeBridgeScript = """
        (() => {
            if (window !== window.top) return;
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

    private static readonly TimeSpan CloseAckTimeout = TimeSpan.FromSeconds(4);

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

    private static readonly HashSet<string> ReservedDosDeviceNames =
    [
        with(StringComparer.OrdinalIgnoreCase),
        "CON",
        "PRN",
        "AUX",
        "NUL",
        "CONIN$",
        "CONOUT$",
        "COM0",
        "COM1",
        "COM2",
        "COM3",
        "COM4",
        "COM5",
        "COM6",
        "COM7",
        "COM8",
        "COM9",
        "COM\u00B9",
        "COM\u00B2",
        "COM\u00B3",
        "LPT0",
        "LPT1",
        "LPT2",
        "LPT3",
        "LPT4",
        "LPT5",
        "LPT6",
        "LPT7",
        "LPT8",
        "LPT9",
        "LPT\u00B9",
        "LPT\u00B2",
        "LPT\u00B3"
    ];

    private Task<CoreWebView2Environment>? _environmentTask;
    private Task? _initializationTask;
    private CoreWebView2? _attachedCore;
    private TaskCompletionSource<bool>? _pendingNavigation;
    private PendingCloseRequest? _pendingCloseConfirmation;
    private DesktopToastNotifier? _toastNotifier;
    private string? _resolvedUserDataFolder;
    private long _navigationEpoch;
    private int _nextHostRequestId;
    private int _nextNotificationId;
    private volatile bool _disposed;

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

    internal long NavigationEpoch => Volatile.Read(ref _navigationEpoch);

    internal TimeSpan UnsavedWorkTimeout { get; set; } = CloseAckTimeout;

    internal Func<string, string, string?>? SaveFileDialogPrompt { get; set; }

    internal Action<Uri>? NotificationNavigationHandler { get; set; }

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
        ObjectDisposedException.ThrowIf(_disposed, this);

        TaskCompletionSource<bool> tcs = new(TaskCreationOptions.RunContinuationsAsynchronously);
        TaskCompletionSource<bool>? previous = Interlocked.Exchange(ref _pendingNavigation, tcs);
        _ = previous?.TrySetCanceled(CancellationToken.None);

        using CancellationTokenRegistration registration = cancellationToken.Register(static state => ((TaskCompletionSource<bool>)state!).TrySetCanceled(), tcs);

        Uri target = Host.ResolveBrowserUri(route);
        CoreWebView2 core = WebView.CoreWebView2;
        await SeedLoopbackAuthCookieAsync(core).ConfigureAwait(true);
        ObjectDisposedException.ThrowIf(_disposed, this);
        core.Navigate(target.AbsoluteUri);
        _ = await tcs.Task.ConfigureAwait(true);
    }

    /// <summary>Executes <paramref name="javaScript"/> inside the current page and returns the JSON-encoded result.</summary>
    public async Task<string> ExecuteScriptAsync(string javaScript)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(javaScript);
        await EnsureInitializedAsync().ConfigureAwait(true);
        ObjectDisposedException.ThrowIf(_disposed, this);
        return await WebView.CoreWebView2.ExecuteScriptAsync(javaScript).ConfigureAwait(true);
    }

    /// <summary>Checks whether the active page's leave guard currently reports unsaved work or pending commits.</summary>
    public Task<bool> HasUnsavedWorkAsync()
    {
        if (_disposed || WebView.CoreWebView2 is not { } core)
            return Task.FromResult(false);

        return EvaluateUnsavedWorkAsync(
            () => core.ExecuteScriptAsync("window.__neStandardUIRuntime?.hasUnsavedCloseWork?.() ?? (window.dispatchEvent(new Event('beforeunload', { cancelable: true })) === false)"),
            UnsavedWorkTimeout
        );
    }

    internal static async Task<bool> EvaluateUnsavedWorkAsync(Func<Task<string>> executeScriptAsync, TimeSpan timeout)
    {
        ArgumentNullException.ThrowIfNull(executeScriptAsync);

        try
        {
            Task<string> scriptTask = executeScriptAsync();
            ObserveIgnoredScriptTask(scriptTask);
            var json = await scriptTask.WaitAsync(timeout).ConfigureAwait(true);
            return string.Equals(json, "true", StringComparison.Ordinal);
        }
        catch (TimeoutException)
        {
            return false;
        }
        catch
        {
            return false;
        }
    }

    private static void ObserveIgnoredScriptTask(Task task)
        => _ = task.ContinueWith(static t => _ = t.Exception, CancellationToken.None, TaskContinuationOptions.OnlyOnFaulted | TaskContinuationOptions.ExecuteSynchronously, TaskScheduler.Default);

    /// <summary>Asks the active page to settle pending values and, if unsaved work remains, opens the framework's localized leave confirmation dialog.</summary>
    public async Task<bool> ConfirmCloseAsync(CancellationToken cancellationToken = default)
    {
        if (_disposed || WebView.CoreWebView2 is null)
            return true;

        if (!await HasUnsavedWorkAsync().ConfigureAwait(true))
            return true;

        return await PromptConfirmCloseCoreAsync(cancellationToken).ConfigureAwait(true);
    }

    internal async Task<bool> PromptConfirmCloseCoreAsync(CancellationToken cancellationToken = default)
    {
        if (_disposed || WebView.CoreWebView2 is null)
            return true;

        var requestId = Interlocked.Increment(ref _nextHostRequestId);
        TaskCompletionSource ack = new(TaskCreationOptions.RunContinuationsAsynchronously);
        TaskCompletionSource<bool> completion = new(TaskCreationOptions.RunContinuationsAsynchronously);
        PendingCloseRequest current = new(requestId, ack, completion);
        PendingCloseRequest? previous = Interlocked.Exchange(ref _pendingCloseConfirmation, current);
        _ = previous?.Completion.TrySetResult(false);

        using CancellationTokenRegistration registration = cancellationToken.Register(static state => ((TaskCompletionSource<bool>)state!).TrySetResult(false), completion);

        PostBridgeObject(new ConfirmCloseBridgeMessage("confirm-close", requestId));

        using CancellationTokenSource timeoutCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        Task ackTimeout = Task.Delay(CloseAckTimeout, timeoutCts.Token);
        Task first = await Task.WhenAny(ack.Task, completion.Task, ackTimeout).ConfigureAwait(true);

        if (ReferenceEquals(first, ackTimeout))
        {
            _ = Interlocked.CompareExchange(ref _pendingCloseConfirmation, null, current);
            return !cancellationToken.IsCancellationRequested;
        }

        await timeoutCts.CancelAsync().ConfigureAwait(true);
        return await completion.Task.ConfigureAwait(true);
    }

    /// <inheritdoc />
    public void Dispose()
    {
        if (_disposed)
            return;

        _disposed = true;
        _ = _pendingNavigation?.TrySetCanceled();
        _ = Interlocked.Exchange(ref _pendingCloseConfirmation, null)?.Completion.TrySetResult(true);

        if (Interlocked.Exchange(ref _attachedCore, null) is { } core)
            DetachCoreHandlers(core);

        _toastNotifier?.Dispose();
        _toastNotifier = null;
        WebView.Dispose();
    }

    internal Task<CoreWebView2Environment> WarmEnvironmentAsync()
    {
        ObjectDisposedException.ThrowIf(_disposed, this);
        return _environmentTask ??= CreateEnvironmentAsync();
    }

    private async Task<CoreWebView2Environment> CreateEnvironmentAsync()
    {
        var userDataFolder = ResolveUserDataFolder(Host.Options);
        _ = Directory.CreateDirectory(userDataFolder);

        CoreWebView2EnvironmentOptions? environmentOptions = Host.Options.Mode == DesktopHostMode.InProcess
            ? new CoreWebView2EnvironmentOptions(additionalBrowserArguments: $"--ignore-certificate-errors-spki-list={DesktopLoopbackCertificate.Instance.SpkiSha256Base64}")
            : null;

        try
        {
            CoreWebView2Environment environment = await CoreWebView2Environment
                .CreateAsync(browserExecutableFolder: null, userDataFolder: userDataFolder, options: environmentOptions)
                .ConfigureAwait(true);
            _resolvedUserDataFolder = userDataFolder;
            return environment;
        }
        catch (COMException ex) when (string.IsNullOrWhiteSpace(Host.Options.UserDataFolder) && ex.HResult == HrErrorInvalidState)
        {
            var fallbackFolder = BuildFallbackInProcessUserDataFolder(Host.Options);
            _ = Directory.CreateDirectory(fallbackFolder);
            Host.LogHostWarning(typeof(DesktopShellControl).FullName!, $"Default WebView2 profile '{userDataFolder}' is locked with incompatible browser options; using '{fallbackFolder}'.", ex);

            CoreWebView2Environment fallbackEnvironment = await CoreWebView2Environment
                .CreateAsync(browserExecutableFolder: null, userDataFolder: fallbackFolder, options: environmentOptions)
                .ConfigureAwait(true);
            _resolvedUserDataFolder = fallbackFolder;
            return fallbackEnvironment;
        }
        catch (Exception ex)
        {
            Host.LogStartupError(typeof(DesktopShellControl).FullName!, "CreateWebView2Environment", ex);
            throw;
        }
    }

    internal static string ResolveUserDataFolder(DesktopHostOptions options)
    {
        ArgumentNullException.ThrowIfNull(options);

        if (!string.IsNullOrWhiteSpace(options.UserDataFolder))
            return Path.GetFullPath(options.UserDataFolder);

        var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        var appFolder = SanitizeWindowsFileName(options.WindowTitle, "NE.Standard");
        var modeSegment = options.Mode == DesktopHostMode.InProcess ? "inproc" : "remote";
        return Path.Combine(localAppData, appFolder, "WebView2", modeSegment);
    }

    private static string BuildFallbackInProcessUserDataFolder(DesktopHostOptions options)
    {
        var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        var appFolder = SanitizeWindowsFileName(options.WindowTitle, "NE.Standard");
        var modePrefix = options.Mode == DesktopHostMode.InProcess ? "inproc" : "remote";
        var instanceSegment = string.Create(CultureInfo.InvariantCulture, $"{modePrefix}-{Environment.ProcessId}");
        return Path.Combine(localAppData, appFolder, "WebView2", instanceSegment);
    }

    internal static string SanitizeWindowsFileName(string? rawName, string fallback = "download")
    {
        var safeFallback = string.IsNullOrWhiteSpace(fallback) ? "download" : SanitizeWindowsFileNameCore(fallback);
        if (safeFallback.Length == 0)
            safeFallback = "download";

        if (string.IsNullOrWhiteSpace(rawName))
            return safeFallback;

        var sanitized = SanitizeWindowsFileNameCore(rawName);
        return sanitized.Length == 0 ? safeFallback : sanitized;
    }

    private static string SanitizeWindowsFileNameCore(string rawName)
    {
        ReadOnlySpan<char> span = rawName.AsSpan().Trim();
        var lastSeparator = span.LastIndexOfAny('/', '\\');
        if (lastSeparator >= 0)
            span = span[(lastSeparator + 1)..];

        while (span.Length >= 2 && char.IsAsciiLetter(span[0]) && span[1] == ':')
            span = span[2..];

        if (span.IsEmpty)
            return string.Empty;

        StringBuilder builder = new(span.Length);
        for (var i = 0; i < span.Length; i++)
        {
            var ch = span[i];
            if (char.IsHighSurrogate(ch))
            {
                if (i + 1 < span.Length && char.IsLowSurrogate(span[i + 1]))
                    _ = builder.Append(ch).Append(span[++i]);
                else
                    _ = builder.Append('_');

                continue;
            }

            if (char.IsLowSurrogate(ch) || IsInvalidWindowsFileNameChar(ch))
            {
                _ = builder.Append('_');
                continue;
            }

            _ = builder.Append(ch);
        }

        var trimmed = TrimSurroundingSpacesAndTrailingDots(builder.ToString());
        if (trimmed.Length == 0)
            return string.Empty;

        if (IsReservedWindowsFileName(trimmed))
            trimmed = "_" + trimmed;

        if (trimmed.Length > MaxSanitizedFileNameLength)
            trimmed = TruncatePreservingExtension(trimmed, MaxSanitizedFileNameLength);

        return trimmed;
    }

    private static bool IsInvalidWindowsFileNameChar(char ch)
        => ch < (char)0x20 || char.IsControl(ch) || ch is '<' or '>' or ':' or '"' or '/' or '\\' or '|' or '?' or '*';

    private static string TrimSurroundingSpacesAndTrailingDots(ReadOnlySpan<char> span)
    {
        var start = 0;
        var end = span.Length;

        while (start < end && char.IsWhiteSpace(span[start]))
            start++;

        while (end > start && (span[end - 1] == '.' || char.IsWhiteSpace(span[end - 1])))
            end--;

        return start >= end ? string.Empty : span[start..end].ToString();
    }

    private static bool IsReservedWindowsFileName(string candidate)
    {
        var dotIndex = candidate.IndexOf('.', StringComparison.Ordinal);
        ReadOnlySpan<char> stem = dotIndex >= 0 ? candidate.AsSpan(0, dotIndex) : candidate.AsSpan();
        while (!stem.IsEmpty && (stem[^1] == '.' || char.IsWhiteSpace(stem[^1])))
            stem = stem[..^1];

        return !stem.IsEmpty && ReservedDosDeviceNames.GetAlternateLookup<ReadOnlySpan<char>>().Contains(stem);
    }

    private static string TruncatePreservingExtension(string fileName, int maxLength)
    {
        var ext = Path.GetExtension(fileName);
        if (ext.Length >= maxLength / 2)
            ext = string.Empty;

        var keepStemLength = maxLength - ext.Length;
        if (keepStemLength > 0 && char.IsHighSurrogate(fileName[keepStemLength - 1]))
            keepStemLength--;

        var stem = TrimSurroundingSpacesAndTrailingDots(fileName.AsSpan(0, keepStemLength));
        if (stem.Length == 0)
            stem = "_";

        return TrimSurroundingSpacesAndTrailingDots((stem + ext).AsSpan());
    }

    internal static string? TryBuildSaveDialogFilter(string? fileName, out string? defaultExtension)
    {
        defaultExtension = null;
        if (string.IsNullOrWhiteSpace(fileName))
            return null;

        var rawExtension = Path.GetExtension(fileName);
        if (string.IsNullOrWhiteSpace(rawExtension))
            return null;

        StringBuilder clean = new(rawExtension.Length);
        for (var i = 0; i < rawExtension.Length && clean.Length < MaxDialogExtensionLength; i++)
        {
            var ch = rawExtension[i];
            if (ch == '.' || char.IsWhiteSpace(ch) || IsInvalidWindowsFileNameChar(ch) || ch == ';')
                continue;

            _ = clean.Append(ch);
        }

        if (clean.Length == 0)
            return null;

        var ext = clean.ToString();
        defaultExtension = "." + ext;
        return $"*.{ext}|*.{ext}|*.*|*.*";
    }

    internal static string ResolveUniqueFilePath(string directory, string? rawFileName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(directory);

        var fullDirectory = Path.GetFullPath(directory);
        var directoryPrefix = Path.EndsInDirectorySeparator(fullDirectory)
            ? fullDirectory
            : fullDirectory + Path.DirectorySeparatorChar;
        var safeFileName = SanitizeWindowsFileName(rawFileName);

        var firstCandidate = EnsureContainedFilePath(fullDirectory, directoryPrefix, safeFileName);
        if (!File.Exists(firstCandidate))
            return firstCandidate;

        var stem = Path.GetFileNameWithoutExtension(safeFileName);
        var ext = Path.GetExtension(safeFileName);
        for (var i = 2; i < 10000; i++)
        {
            var numberedName = string.Create(CultureInfo.InvariantCulture, $"{stem} ({i}){ext}");
            var next = EnsureContainedFilePath(fullDirectory, directoryPrefix, numberedName);
            if (!File.Exists(next))
                return next;
        }

        var fallbackName = string.Create(CultureInfo.InvariantCulture, $"{stem}-{Guid.NewGuid():N}{ext}");
        return EnsureContainedFilePath(fullDirectory, directoryPrefix, fallbackName);
    }

    private static string EnsureContainedFilePath(string fullDirectory, string directoryPrefix, string candidateFileName)
    {
        var fullCandidate = Path.GetFullPath(Path.Combine(fullDirectory, candidateFileName));
        var candidateParent = Path.GetDirectoryName(fullCandidate);
        var expectedParent = Path.TrimEndingDirectorySeparator(fullDirectory);

        if (!fullCandidate.StartsWith(directoryPrefix, StringComparison.OrdinalIgnoreCase)
            || !string.Equals(candidateParent, expectedParent, StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Resolved download path escaped the configured downloads directory.");
        }

        return fullCandidate;
    }

    internal long AdvanceNavigationEpoch()
        => Interlocked.Increment(ref _navigationEpoch);

    internal Uri? TryResolveNotificationTargetUri(string? bringTo)
    {
        if (string.IsNullOrWhiteSpace(bringTo) || !Host.IsStarted)
            return null;

        if (bringTo[0] != '/' && Uri.TryCreate(bringTo, UriKind.Absolute, out Uri? absolute))
            return IsSameOrigin(absolute) && string.IsNullOrEmpty(absolute.UserInfo) ? absolute : null;

        try
        {
            return Host.ResolveBrowserUri(bringTo);
        }
        catch (ArgumentException)
        {
            return null;
        }
    }

    private bool IsSameOrigin(Uri uri)
        => Host.IsStarted && (DesktopWebHost.MatchesOrigin(uri, Host.BrowserBaseUri) || DesktopWebHost.MatchesOrigin(uri, Host.BaseUri));

    internal Action CreateNotificationActivationAction(long capturedEpoch, int hostNotificationId, int pageNotificationId, string? capturedPageEpoch, Uri? bringToUri)
        => () => DispatchOnUi(() => HandleNotificationActivatedOnUi(capturedEpoch, hostNotificationId, pageNotificationId, capturedPageEpoch, bringToUri));

    private void DispatchOnUi(Action action)
    {
        if (Dispatcher.CheckAccess())
            action();
        else
            _ = Dispatcher.InvokeAsync(action);
    }

    private void HandleNotificationActivatedOnUi(long capturedEpoch, int hostNotificationId, int pageNotificationId, string? capturedPageEpoch, Uri? bringToUri)
    {
        if (_disposed)
            return;

        WindowActivationRequested?.Invoke(this, EventArgs.Empty);

        if (Volatile.Read(ref _navigationEpoch) == capturedEpoch)
        {
            PostBridgeObject(new NotificationEventBridgeMessage("notification-clicked", hostNotificationId, pageNotificationId, capturedPageEpoch));
            return;
        }

        if (bringToUri is not null)
            NavigateToNotificationTarget(bringToUri);
    }

    private void NavigateToNotificationTarget(Uri targetUri)
    {
        if (NotificationNavigationHandler is { } handler)
        {
            handler(targetUri);
            return;
        }

        if (WebView.CoreWebView2 is { } core)
        {
            SeedLoopbackAuthCookie(core);
            core.Navigate(targetUri.AbsoluteUri);
        }
    }

    internal async Task<bool> DeliverStagedDownloadAsync(IUIFileStore store, string sessionId, Uri downloadUri, string token, string? fileName, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(store);
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentNullException.ThrowIfNull(downloadUri);
        ArgumentException.ThrowIfNullOrWhiteSpace(token);

        UIStagedDownload? staged = await store.TakeDownloadAsync(sessionId, token, cancellationToken).ConfigureAwait(true);
        if (staged is null)
            return false;

        await using (staged.ConfigureAwait(true))
        {
            var rawName = !string.IsNullOrWhiteSpace(fileName) ? fileName : staged.FileName;
            var suggestedName = SanitizeWindowsFileName(rawName);
            var initialDirectory = ResolveDownloadsDirectory(Host.Options);
            string? targetPath;

            if (Host.Options.DownloadMode == DesktopDownloadMode.Directory)
            {
                _ = Directory.CreateDirectory(initialDirectory);
                targetPath = ResolveUniqueFilePath(initialDirectory, suggestedName);
            }
            else
            {
                targetPath = (SaveFileDialogPrompt ?? ShowSaveFileDialog)(initialDirectory, suggestedName);
                if (string.IsNullOrWhiteSpace(targetPath))
                    return true;
            }

            var fullTargetPath = Path.GetFullPath(targetPath);
            try
            {
                var bytesWritten = await Task
                    .Run(() => SaveStagedDownloadAtomicallyAsync(staged, fullTargetPath, cancellationToken), cancellationToken)
                    .ConfigureAwait(true);

                if (Host.Services.GetService<WebUIMetrics>() is { } metrics)
                    metrics.FileDownloaded(bytesWritten);

                DownloadCompleted?.Invoke(this, new DesktopDownloadCompletedEventArgs(downloadUri, fullTargetPath, succeeded: true));
            }
            catch (Exception ex)
            {
                Host.LogHostWarning(typeof(DesktopShellControl).FullName!, $"Saving download '{suggestedName}' to '{fullTargetPath}' failed.", ex);
                DownloadCompleted?.Invoke(this, new DesktopDownloadCompletedEventArgs(downloadUri, fullTargetPath, succeeded: false));
            }

            return true;
        }
    }

    private static string ResolveDownloadsDirectory(DesktopHostOptions options)
    {
        if (!string.IsNullOrWhiteSpace(options.DownloadsDirectory))
            return Path.GetFullPath(options.DownloadsDirectory);

        var userProfile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
        return Path.Combine(userProfile, "Downloads");
    }

    private string? ShowSaveFileDialog(string initialDirectory, string suggestedName)
    {
        var safeSuggested = SanitizeWindowsFileName(suggestedName);
        SaveFileDialog dialog = new()
        {
            FileName = safeSuggested,
            InitialDirectory = Directory.Exists(initialDirectory) ? initialDirectory : null,
            OverwritePrompt = true
        };

        if (TryBuildSaveDialogFilter(safeSuggested, out var defaultExtension) is { } filter && defaultExtension is not null)
        {
            dialog.DefaultExt = defaultExtension;
            dialog.Filter = filter;
        }

        Window? owner = Window.GetWindow(this);
        var accepted = owner is not null ? dialog.ShowDialog(owner) : dialog.ShowDialog();
        return accepted == true && !string.IsNullOrWhiteSpace(dialog.FileName) ? dialog.FileName : null;
    }

    private static async Task<long> SaveStagedDownloadAtomicallyAsync(UIStagedDownload staged, string fullDestination, CancellationToken cancellationToken)
    {
        var directory = Path.GetDirectoryName(fullDestination);
        if (!string.IsNullOrEmpty(directory))
            _ = Directory.CreateDirectory(directory);

        var tempPath = CreateSiblingTempPath(fullDestination);
        try
        {
            long bytesWritten;
            FileStream destination = new(tempPath, FileMode.CreateNew, FileAccess.Write, FileShare.None, FileBufferSize, FileOptions.Asynchronous | FileOptions.SequentialScan);
            await using (destination.ConfigureAwait(false))
            {
                if (staged.WriteToAsync is not null)
                {
                    bytesWritten = await staged.WriteBoundedToAsync(destination, cancellationToken).ConfigureAwait(false);
                }
                else
                {
                    await staged.Content.CopyToAsync(destination, FileBufferSize, cancellationToken).ConfigureAwait(false);
                    bytesWritten = destination.Length;
                }
            }

            File.Move(tempPath, fullDestination, overwrite: true);
            return bytesWritten;
        }
        catch
        {
            TryDeleteTempFile(tempPath);
            throw;
        }
    }

    private static string CreateSiblingTempPath(string fullDestination)
    {
        var directory = Path.GetDirectoryName(fullDestination);
        var targetDir = string.IsNullOrEmpty(directory) ? "." : directory;
        var baseName = Path.GetFileName(fullDestination);
        if (baseName.Length > MaxTempFileStemLength)
        {
            var cut = char.IsHighSurrogate(baseName[MaxTempFileStemLength - 1]) ? MaxTempFileStemLength - 1 : MaxTempFileStemLength;
            baseName = baseName[..cut];
        }

        return Path.Combine(targetDir, string.Create(CultureInfo.InvariantCulture, $".{baseName}.{Guid.NewGuid():N}.tmp"));
    }

    private static void TryDeleteTempFile(string path)
    {
        try
        {
            if (File.Exists(path))
                File.Delete(path);
        }
        catch (Exception ex) when (ex is IOException or UnauthorizedAccessException)
        {
        }
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
        var hostStartAwaited = false;
        _ = hostStartTask.ContinueWith(
            t =>
            {
                AggregateException? aggregate = t.Exception;
                if (aggregate is not null && !Volatile.Read(ref hostStartAwaited) && !_disposed)
                    Host.LogStartupError(typeof(DesktopShellControl).FullName!, "StartAsync", aggregate.Flatten().InnerException ?? aggregate);
            },
            CancellationToken.None,
            TaskContinuationOptions.OnlyOnFaulted | TaskContinuationOptions.ExecuteSynchronously,
            TaskScheduler.Default
        );

        try
        {
            CoreWebView2Environment environment = await WarmEnvironmentAsync().ConfigureAwait(true);
            if (_disposed)
                return;

            await WebView.EnsureCoreWebView2Async(environment).ConfigureAwait(true);
            if (_disposed)
                return;

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

            _ = await core.AddScriptToExecuteOnDocumentCreatedAsync(ThemeBridgeScript).ConfigureAwait(true);
            if (_disposed)
                return;

            _ = await core.AddScriptToExecuteOnDocumentCreatedAsync(BuildDesktopBridgeScript(Host.Options.Mode == DesktopHostMode.InProcess, IsSurfaceVisible)).ConfigureAwait(true);
            if (_disposed)
                return;

            Volatile.Write(ref hostStartAwaited, true);
            await hostStartTask.ConfigureAwait(true);
            if (_disposed)
                return;

            await SeedLoopbackAuthCookieAsync(core).ConfigureAwait(true);
            if (_disposed)
                return;

            await GrantNotificationPermissionsAsync(core).ConfigureAwait(true);
            if (_disposed)
                return;

            var userDataFolder = _resolvedUserDataFolder ?? ResolveUserDataFolder(Host.Options);
            DesktopToastNotifier notifier = new(Host, userDataFolder);
            AttachCoreHandlers(core);
            _toastNotifier = notifier;
            _attachedCore = core;

            if (_disposed)
            {
                if (Interlocked.Exchange(ref _attachedCore, null) is { } racedCore)
                    DetachCoreHandlers(racedCore);

                Interlocked.Exchange(ref _toastNotifier, null)?.Dispose();
            }
        }
        catch (Exception ex) when (ex is not OperationCanceledException || !_disposed)
        {
            Host.LogStartupError(typeof(DesktopShellControl).FullName!, "InitializeShellControl", ex);
            throw;
        }
    }

    private async Task SeedLoopbackAuthCookieAsync(CoreWebView2 core)
    {
        if (!Host.IsStarted || Host.LoopbackAuthToken is not { } authToken)
            return;

        var authority = Host.BrowserBaseUri.GetLeftPart(UriPartial.Authority);
        List<CoreWebView2Cookie> existing = await core.CookieManager.GetCookiesAsync(authority).ConfigureAwait(true);
        for (var i = 0; i < existing.Count; i++)
        {
            if (string.Equals(existing[i].Name, Host.LoopbackAuthCookieName, StringComparison.Ordinal)
                && string.Equals(existing[i].Value, authToken, StringComparison.Ordinal))
            {
                return;
            }
        }

        SeedLoopbackAuthCookie(core);
        for (var attempt = 0; attempt < 10; attempt++)
        {
            List<CoreWebView2Cookie> updated = await core.CookieManager.GetCookiesAsync(authority).ConfigureAwait(true);
            for (var i = 0; i < updated.Count; i++)
            {
                if (string.Equals(updated[i].Name, Host.LoopbackAuthCookieName, StringComparison.Ordinal)
                    && string.Equals(updated[i].Value, authToken, StringComparison.Ordinal))
                {
                    return;
                }
            }

            await Task.Delay(10).ConfigureAwait(true);
        }
    }

    private void SeedLoopbackAuthCookie(CoreWebView2 core)
    {
        if (!Host.IsStarted || Host.LoopbackAuthToken is not { } authToken)
            return;

        CoreWebView2Cookie cookie = core.CookieManager.CreateCookie(Host.LoopbackAuthCookieName, authToken, Host.BrowserBaseUri.Host, "/");
        cookie.IsHttpOnly = true;
        cookie.IsSecure = true;
        cookie.SameSite = CoreWebView2CookieSameSiteKind.Strict;
        core.CookieManager.AddOrUpdateCookie(cookie);
    }

    private void AttachCoreHandlers(CoreWebView2 core)
    {
        core.NavigationStarting += OnNavigationStarting;
        core.ContentLoading += OnContentLoading;
        core.NavigationCompleted += OnNavigationCompleted;
        core.NewWindowRequested += OnNewWindowRequested;
        core.DocumentTitleChanged += OnDocumentTitleChanged;
        core.WebMessageReceived += OnWebMessageReceived;
        core.ContextMenuRequested += OnContextMenuRequested;
        core.DownloadStarting += OnDownloadStarting;
        core.PermissionRequested += OnPermissionRequested;
        core.NotificationReceived += OnNotificationReceived;
        core.ProcessFailed += OnProcessFailed;
    }

    private void DetachCoreHandlers(CoreWebView2 core)
    {
        core.NavigationStarting -= OnNavigationStarting;
        core.ContentLoading -= OnContentLoading;
        core.NavigationCompleted -= OnNavigationCompleted;
        core.NewWindowRequested -= OnNewWindowRequested;
        core.DocumentTitleChanged -= OnDocumentTitleChanged;
        core.WebMessageReceived -= OnWebMessageReceived;
        core.ContextMenuRequested -= OnContextMenuRequested;
        core.DownloadStarting -= OnDownloadStarting;
        core.PermissionRequested -= OnPermissionRequested;
        core.NotificationReceived -= OnNotificationReceived;
        core.ProcessFailed -= OnProcessFailed;
    }

    private static string BuildDesktopBridgeScript(bool includeLocalTransfers, bool initiallyVisible)
    {
        var initialVisibleLiteral = initiallyVisible ? "true" : "false";
        var includeTransfersLiteral = includeLocalTransfers ? "true" : "false";

        return $$"""
            (() => {
                if (window !== window.top) return;
                const webview = window.chrome?.webview;
                if (!webview) return;

                let nextId = 0;
                const pageEpoch = typeof crypto?.randomUUID === "function"
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random()}`;
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

                    if (data.type === "notification-clicked" && data.pageEpoch === pageEpoch && typeof data.pageNotificationId === "number") {
                        const onClick = notificationClicks.get(data.pageNotificationId);
                        if (onClick) {
                            notificationClicks.delete(data.pageNotificationId);
                            onClick();
                        }
                        return;
                    }

                    if (data.type === "notification-closed" && data.pageEpoch === pageEpoch && typeof data.pageNotificationId === "number") {
                        notificationClicks.delete(data.pageNotificationId);
                        return;
                    }

                    if (data.type === "confirm-close" && typeof data.requestId === "number") {
                        webview.postMessage(JSON.stringify({ type: "confirm-close-ack", requestId: data.requestId }));
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
                            pageEpoch,
                            title: request?.title ?? "",
                            body: request?.body ?? null,
                            tag: request?.tag ?? "",
                            bringTo: typeof request?.bringTo === "string" ? request.bringTo : null,
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

        if (!DesktopWebHost.MatchesOrigin(Host.BaseUri, Host.BrowserBaseUri))
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
        if (!Uri.TryCreate(e.Uri, UriKind.Absolute, out Uri? targetUri))
            return;

        if (string.Equals(targetUri.Scheme, "about", StringComparison.OrdinalIgnoreCase) || IsSameOrigin(targetUri))
            return;

        e.Cancel = true;
        if (e.IsUserInitiated)
            OpenExternalUri(targetUri);
    }

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

    private void OnContentLoading(object? sender, CoreWebView2ContentLoadingEventArgs e)
        => _ = AdvanceNavigationEpoch();

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
            _ = pending.TrySetException(new InvalidOperationException(string.Create(CultureInfo.InvariantCulture, $"WebView2 navigation failed with status '{e.WebErrorStatus}' (HTTP {e.HttpStatusCode}).")));
    }

    private void OnProcessFailed(object? sender, CoreWebView2ProcessFailedEventArgs e)
    {
        InvalidOperationException failure = new($"WebView2 process failed with kind '{e.ProcessFailedKind}'.");
        Host.LogStartupError(typeof(DesktopShellControl).FullName!, "WebView2ProcessFailed", failure);
        _ = Interlocked.Exchange(ref _pendingCloseConfirmation, null)?.Completion.TrySetResult(true);
        _ = Interlocked.Exchange(ref _pendingNavigation, null)?.TrySetException(failure);
    }

    private void OnNewWindowRequested(object? sender, CoreWebView2NewWindowRequestedEventArgs e)
    {
        e.Handled = true;
        if (!Uri.TryCreate(e.Uri, UriKind.Absolute, out Uri? targetUri))
            return;

        if (IsSameOrigin(targetUri))
        {
            CoreWebView2 core = WebView.CoreWebView2;
            SeedLoopbackAuthCookie(core);
            core.Navigate(targetUri.AbsoluteUri);
        }
        else
        {
            OpenExternalUri(targetUri);
        }
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
            if (!Uri.TryCreate(e.Source, UriKind.Absolute, out Uri? sourceUri) || !IsSameOrigin(sourceUri))
                return;

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

            if (!root.TryGetProperty("requestId", out JsonElement idProp)
                || !idProp.TryGetInt32(out var requestId)
                || requestId <= 0)
            {
                return;
            }

            if (string.Equals(type, "confirm-close-ack", StringComparison.Ordinal))
            {
                HandleConfirmCloseAck(requestId);
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
                if (!TryReadLocalUploadCandidates(root, e.AdditionalObjects, out List<WebFileEndpoints.LocalUploadCandidate>? candidates) || candidates is null)
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

    private void HandleConfirmCloseAck(int requestId)
    {
        PendingCloseRequest? pendingClose = _pendingCloseConfirmation;
        if (pendingClose is not null && pendingClose.RequestId == requestId)
            _ = pendingClose.Acknowledged.TrySetResult();
    }

    private void HandleConfirmCloseReply(int requestId, JsonElement root)
    {
        var allowClose = root.TryGetProperty("allowClose", out JsonElement allowProp) && allowProp.ValueKind == JsonValueKind.True;
        PendingCloseRequest? pendingClose = _pendingCloseConfirmation;
        if (pendingClose is not null && pendingClose.RequestId == requestId && Interlocked.CompareExchange(ref _pendingCloseConfirmation, null, pendingClose) == pendingClose)
        {
            _ = pendingClose.Acknowledged.TrySetResult();
            _ = pendingClose.Completion.TrySetResult(allowClose);
        }
    }

    private void HandleSystemNotification(int requestId, JsonElement root)
    {
        var title = root.TryGetProperty("title", out JsonElement titleProp) && titleProp.ValueKind == JsonValueKind.String ? titleProp.GetString() : null;
        var body = root.TryGetProperty("body", out JsonElement bodyProp) && bodyProp.ValueKind == JsonValueKind.String ? bodyProp.GetString() : null;
        var tag = root.TryGetProperty("tag", out JsonElement tagProp) && tagProp.ValueKind == JsonValueKind.String ? tagProp.GetString() : null;
        var bringTo = root.TryGetProperty("bringTo", out JsonElement bringToProp) && bringToProp.ValueKind == JsonValueKind.String ? bringToProp.GetString() : null;
        var pageEpoch = root.TryGetProperty("pageEpoch", out JsonElement epochProp) && epochProp.ValueKind == JsonValueKind.String ? epochProp.GetString() : null;
        var silent = root.TryGetProperty("silent", out JsonElement silentProp) && silentProp.ValueKind == JsonValueKind.True;
        var requireInteraction = root.TryGetProperty("requireInteraction", out JsonElement interactionProp) && interactionProp.ValueKind == JsonValueKind.True;

        if (string.IsNullOrWhiteSpace(body))
            body = null;

        if (string.IsNullOrWhiteSpace(tag))
            tag = null;

        if (string.IsNullOrWhiteSpace(bringTo))
            bringTo = null;

        if (string.IsNullOrWhiteSpace(title) || _toastNotifier is null)
        {
            PostBridgeReply(new BridgeReply(requestId, Handled: false));
            return;
        }

        var hostNotificationId = Interlocked.Increment(ref _nextNotificationId);
        var capturedEpoch = Volatile.Read(ref _navigationEpoch);
        Uri? bringToUri = TryResolveNotificationTargetUri(bringTo);
        Action activateAction = CreateNotificationActivationAction(capturedEpoch, hostNotificationId, requestId, pageEpoch, bringToUri);
        var completed = 0;

        void NotifyActivated()
        {
            if (Interlocked.CompareExchange(ref completed, 1, 0) != 0)
                return;

            activateAction();
        }

        void NotifyDismissed()
        {
            if (Interlocked.CompareExchange(ref completed, 1, 0) != 0)
                return;

            DispatchOnUi(() =>
            {
                if (!_disposed && Volatile.Read(ref _navigationEpoch) == capturedEpoch)
                    PostBridgeObject(new NotificationEventBridgeMessage("notification-closed", hostNotificationId, requestId, pageEpoch));
            });
        }

        var shown = _toastNotifier.TryShow(title, body, tag, silent, requireInteraction, NotifyActivated, NotifyDismissed, out Action toastDismiss);
        PostBridgeReply(new BridgeReply(requestId, Handled: shown, NotificationId: shown ? hostNotificationId : null));

        if (!shown)
            return;

        void ActivateProgrammatically()
        {
            NotifyActivated();
            toastDismiss();
        }

        SystemNotificationShown?.Invoke(this, new DesktopNotificationShownEventArgs(title, body, tag, bringToUri?.PathAndQuery, silent, requireInteraction, ActivateProgrammatically, toastDismiss));
    }

    private void PostBridgeReply(BridgeReply reply)
        => PostBridgeObject(reply);

    private static bool TryReadLocalUploadCandidates(JsonElement root, IReadOnlyList<object>? additionalObjects, out List<WebFileEndpoints.LocalUploadCandidate>? candidates)
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

        List<WebFileEndpoints.LocalUploadCandidate> resolved = [with(additionalObjects.Count)];
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
            resolved.Add(new WebFileEndpoints.LocalUploadCandidate(coreFile.Path, rawName, rawType));
            index++;
        }

        candidates = resolved;
        return true;
    }

    private async Task HandleLocalUploadAsync(int requestId, Uri sourceUri, List<WebFileEndpoints.LocalUploadCandidate> candidates)
    {
        try
        {
            var sessionId = await TryResolveAuthorizedSessionIdAsync(sourceUri, CancellationToken.None).ConfigureAwait(true);
            if (string.IsNullOrWhiteSpace(sessionId))
            {
                PostBridgeReply(new BridgeReply(requestId, Handled: false));
                return;
            }

            WebFileEndpoints.LocalUploadOutcome outcome = await WebFileEndpoints
                .RegisterLocalUploadsAsync(Host.Services, sessionId, candidates, CancellationToken.None)
                .ConfigureAwait(true);

            PostBridgeReply(new BridgeReply(requestId, Handled: outcome.Handled, SelectionId: outcome.SelectionId, Error: outcome.Error));
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

        List<CoreWebView2Cookie> rawCookies = await core.CookieManager.GetCookiesAsync(pageOrigin.GetLeftPart(UriPartial.Authority)).ConfigureAwait(true);
        if (rawCookies.Count == 0)
            return null;

        List<KeyValuePair<string, string>> cookies = [with(rawCookies.Count)];
        for (var i = 0; i < rawCookies.Count; i++)
            cookies.Add(new KeyValuePair<string, string>(rawCookies[i].Name, rawCookies[i].Value));

        return await WebSessionHttpContextExtensions
            .ResolveAuthorizedSessionIdFromCookiesAsync(Host.Services, pageOrigin, cookies, cancellationToken)
            .ConfigureAwait(true);
    }

    private async Task HandleLocalDownloadAsync(int requestId, Uri pageOrigin, Uri downloadUri, string token, string? fileName)
    {
        try
        {
            var sessionId = await TryResolveAuthorizedSessionIdAsync(pageOrigin, CancellationToken.None).ConfigureAwait(true);
            if (string.IsNullOrWhiteSpace(sessionId))
            {
                PostBridgeReply(new BridgeReply(requestId, Handled: false));
                return;
            }

            IUIFileStore store = Host.Services.GetRequiredService<IUIFileStore>();
            var handled = await DeliverStagedDownloadAsync(store, sessionId, downloadUri, token, fileName, CancellationToken.None).ConfigureAwait(true);
            PostBridgeReply(new BridgeReply(requestId, Handled: handled));
        }
        catch
        {
            PostBridgeReply(new BridgeReply(requestId, Handled: false));
        }
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

        var suggestedName = SanitizeWindowsFileName(e.ResultFilePath);
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
        void OnStateChanged(object? sender, object args)
        {
            if (operation.State == CoreWebView2DownloadState.InProgress)
                return;

            operation.StateChanged -= OnStateChanged;
            var succeeded = operation.State == CoreWebView2DownloadState.Completed;
            DownloadCompleted?.Invoke(this, new DesktopDownloadCompletedEventArgs(sourceUri, targetPath, succeeded));
        }

        operation.StateChanged += OnStateChanged;
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

            var chosenPath = (SaveFileDialogPrompt ?? ShowSaveFileDialog)(initialDirectory, suggestedName);
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

        var capturedEpoch = Volatile.Read(ref _navigationEpoch);
        var completed = 0;
        Action? toastDismissRef = null;

        void OnCloseRequested(object? closeSender, object closeArgs)
        {
            webNotification.CloseRequested -= OnCloseRequested;
            toastDismissRef?.Invoke();
        }

        void NotifyActivated()
        {
            if (Interlocked.CompareExchange(ref completed, 1, 0) != 0)
                return;

            DispatchOnUi(() =>
            {
                webNotification.CloseRequested -= OnCloseRequested;
                if (_disposed)
                    return;

                WindowActivationRequested?.Invoke(this, EventArgs.Empty);
                if (Volatile.Read(ref _navigationEpoch) == capturedEpoch)
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
                webNotification.CloseRequested -= OnCloseRequested;
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

        toastDismissRef = toastDismiss;
        webNotification.ReportShown();
        webNotification.CloseRequested += OnCloseRequested;

        void ActivateProgrammatically()
        {
            NotifyActivated();
            toastDismiss();
        }

        SystemNotificationShown?.Invoke(this, new DesktopNotificationShownEventArgs(title, body, tag, bringTo: null, silent, requireInteraction, ActivateProgrammatically, toastDismiss));
    }

    private sealed record BridgeReply(int RequestId, bool Handled, string? SelectionId = null, string? Error = null, int? NotificationId = null);

    private sealed record VisibilityBridgeMessage(string Type, bool Visible);

    private sealed record ConfirmCloseBridgeMessage(string Type, int RequestId);

    private sealed record NotificationEventBridgeMessage(string Type, int NotificationId, int PageNotificationId, string? PageEpoch);

    private sealed record PendingCloseRequest(int RequestId, TaskCompletionSource Acknowledged, TaskCompletionSource<bool> Completion);
}
