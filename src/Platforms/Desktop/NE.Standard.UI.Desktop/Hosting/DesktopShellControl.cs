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
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;
using Microsoft.Win32;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Primitives.Styling;

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

    private Task? _initializationTask;
    private TaskCompletionSource<bool>? _pendingNavigation;
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

    /// <summary>Gets the backing <see cref="DesktopWebHost"/>.</summary>
    public DesktopWebHost Host { get; }

    /// <summary>Gets the underlying <see cref="WebView2"/> control.</summary>
    public WebView2 WebView { get; }

    /// <summary>Gets whether the active page currently resolves to the dark palette.</summary>
    public bool IsDarkTheme { get; private set; }

    /// <summary>Gets the latest document title reported by the page.</summary>
    public string DocumentTitle { get; private set; }

    /// <summary>Initializes the WebView2 environment and starts the backing <see cref="DesktopWebHost"/> if needed.</summary>
    public Task EnsureInitializedAsync(CancellationToken cancellationToken = default)
    {
        ObjectDisposedException.ThrowIf(_disposed, this);
        return _initializationTask ??= InitializeCoreAsync(cancellationToken);
    }

    /// <summary>Navigates to <see cref="DesktopHostOptions.InitialRoute"/> and waits for initial document load.</summary>
    public Task OpenInitialPageAsync(CancellationToken cancellationToken = default)
        => NavigateAsync(Host.Options.InitialRoute, cancellationToken);

    /// <summary>Navigates to <paramref name="route"/> on <see cref="DesktopWebHost.BaseUri"/> and waits for navigation completion.</summary>
    public async Task NavigateAsync(string route, CancellationToken cancellationToken = default)
    {
        ObjectDisposedException.ThrowIf(_disposed, this);

        await EnsureInitializedAsync(cancellationToken).ConfigureAwait(true);

        TaskCompletionSource<bool> tcs = new(TaskCreationOptions.RunContinuationsAsynchronously);
        TaskCompletionSource<bool>? previous = Interlocked.Exchange(ref _pendingNavigation, tcs);
        _ = previous?.TrySetCanceled(CancellationToken.None);

        using CancellationTokenRegistration registration = cancellationToken.Register(static state => ((TaskCompletionSource<bool>)state!).TrySetCanceled(), tcs);

        Uri target = Host.ResolveUri(route);
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

    /// <summary>Checks whether the active page's leave guard currently reports unsaved work.</summary>
    public async Task<bool> HasUnsavedWorkAsync()
    {
        if (_disposed || WebView.CoreWebView2 is null)
            return false;

        try
        {
            var json = await WebView.CoreWebView2
                .ExecuteScriptAsync("window.dispatchEvent(new Event('beforeunload', { cancelable: true })) === false")
                .ConfigureAwait(true);

            return string.Equals(json, "true", StringComparison.Ordinal);
        }
        catch
        {
            return false;
        }
    }

    /// <inheritdoc />
    public void Dispose()
    {
        if (_disposed)
            return;

        _disposed = true;
        _ = _pendingNavigation?.TrySetCanceled();
        WebView.Dispose();
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

        var userDataFolder = ResolveUserDataFolder(Host.Options);
        _ = Directory.CreateDirectory(userDataFolder);

        CoreWebView2Environment environment = await CoreWebView2Environment
            .CreateAsync(browserExecutableFolder: null, userDataFolder: userDataFolder)
            .ConfigureAwait(true);

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

        _ = await core.AddScriptToExecuteOnDocumentCreatedAsync(ThemeBridgeScript).ConfigureAwait(true);

        core.NavigationStarting += OnNavigationStarting;
        core.NavigationCompleted += OnNavigationCompleted;
        core.NewWindowRequested += OnNewWindowRequested;
        core.DocumentTitleChanged += OnDocumentTitleChanged;
        core.WebMessageReceived += OnWebMessageReceived;
        core.ContextMenuRequested += OnContextMenuRequested;
        core.DownloadStarting += OnDownloadStarting;

        await hostStartTask.ConfigureAwait(true);
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
    {
        if (!Host.IsStarted)
            return false;

        Uri baseUri = Host.BaseUri;
        return string.Equals(uri.Scheme, baseUri.Scheme, StringComparison.OrdinalIgnoreCase)
            && string.Equals(uri.Host, baseUri.Host, StringComparison.OrdinalIgnoreCase)
            && uri.Port == baseUri.Port;
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

    private void OnNavigationCompleted(object? sender, CoreWebView2NavigationCompletedEventArgs e)
    {
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
            if (root.ValueKind != JsonValueKind.Object
                || !root.TryGetProperty("type", out JsonElement typeProp)
                || !string.Equals(typeProp.GetString(), "theme", StringComparison.Ordinal)
                || !root.TryGetProperty("dark", out JsonElement darkProp)
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
        catch
        {
            // Ignore malformed messages from third-party scripts.
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

        var suggestedName = Path.GetFileName(e.ResultFilePath);
        if (string.IsNullOrWhiteSpace(suggestedName))
            suggestedName = "download";

        Uri sourceUri = Uri.TryCreate(e.DownloadOperation.Uri, UriKind.Absolute, out Uri? parsed)
            ? parsed
            : Host.BaseUri;

        var initialDirectory = ResolveDownloadsDirectory(Host.Options);

        if (Host.Options.DownloadMode == DesktopDownloadMode.Directory)
        {
            _ = Directory.CreateDirectory(initialDirectory);
            var targetPath = ResolveUniqueFilePath(initialDirectory, suggestedName);
            e.ResultFilePath = targetPath;
            TrackDownload(e.DownloadOperation, sourceUri, targetPath);
            return;
        }

        SaveFileDialog dialog = new()
        {
            FileName = suggestedName,
            InitialDirectory = Directory.Exists(initialDirectory) ? initialDirectory : null,
            OverwritePrompt = true
        };

        var extension = Path.GetExtension(suggestedName);
        if (!string.IsNullOrWhiteSpace(extension))
        {
            var cleanExt = extension.TrimStart('.');
            dialog.DefaultExt = extension;
            dialog.Filter = $"{cleanExt.ToUpperInvariant()} files (*{extension})|*{extension}|All files (*.*)|*.*";
        }

        Window? owner = Window.GetWindow(this);
        var accepted = owner is not null ? dialog.ShowDialog(owner) : dialog.ShowDialog();
        if (accepted != true || string.IsNullOrWhiteSpace(dialog.FileName))
        {
            e.Cancel = true;
            return;
        }

        e.ResultFilePath = dialog.FileName;
        TrackDownload(e.DownloadOperation, sourceUri, dialog.FileName);
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
}
