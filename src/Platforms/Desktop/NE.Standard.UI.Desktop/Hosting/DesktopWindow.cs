using System;
using System.ComponentModel;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using NE.Standard.UI.Abstractions.Styling.Theme;

namespace NE.Standard.UI.Desktop.Hosting;

/// <summary>Native Windows desktop window hosting a <see cref="DesktopShellControl"/> with theme-synchronized DWM window chrome.</summary>
public sealed class DesktopWindow : Window
{
    private WindowState _restoreWindowState = WindowState.Normal;
    private bool _hasActivatedOnce;
    private bool _restoredByNotification;
    private bool _closeConfirmed;
    private bool _checkingUnsavedClose;

    /// <summary>Initializes a new <see cref="DesktopWindow"/> backed by <paramref name="host"/>.</summary>
    public DesktopWindow(DesktopWebHost host)
    {
        ArgumentNullException.ThrowIfNull(host);

        Host = host;
        ShellControl = new DesktopShellControl(host);

        DesktopHostOptions options = host.Options;
        Title = options.WindowTitle;
        Width = options.InitialWidth;
        Height = options.InitialHeight;
        MinWidth = options.MinWidth;
        MinHeight = options.MinHeight;
        WindowStartupLocation = WindowStartupLocation.CenterScreen;
        Content = ShellControl;

        if (DesktopIconLoader.Resolve(host) is { } windowIcon)
            Icon = windowIcon;

        ApplyWindowChrome();

        SourceInitialized += OnWindowSourceInitialized;
        Activated += OnWindowActivated;
        Deactivated += OnWindowDeactivated;
        StateChanged += OnWindowStateChanged;
        IsVisibleChanged += OnWindowIsVisibleChanged;
        PreviewKeyDown += OnWindowPreviewKeyDown;
        Closing += OnWindowClosing;
        Closed += OnWindowClosed;

        ShellControl.TitleChanged += OnShellTitleChanged;
        ShellControl.ThemeChanged += OnShellThemeChanged;
        ShellControl.WindowActivationRequested += OnShellWindowActivationRequested;
    }

    /// <summary>Gets the backing <see cref="DesktopWebHost"/>.</summary>
    public DesktopWebHost Host { get; }

    /// <summary>Gets the <see cref="DesktopShellControl"/> hosted inside this window.</summary>
    public DesktopShellControl ShellControl { get; }

    internal bool AllowForegroundActivation { get; set; } = true;

    private void ApplyWindowChrome()
    {
        UITheme theme = Host.ActiveTheme;
        var isDark = ShellControl.IsDarkTheme;
        UIColorPalette palette = isDark ? theme.Dark : theme.Light;

        System.Drawing.Color bg = palette.Background.ToColor();
        Background = new SolidColorBrush(Color.FromRgb(bg.R, bg.G, bg.B));

        DesktopDwmWindowHelper.ApplyWindowChrome(this, isDark, palette.Surface, palette.OnSurface);
    }

    private void OnWindowSourceInitialized(object? sender, EventArgs e)
    {
        ApplyWindowChrome();
        SyncShellSurfaceVisibility();
    }

    private void SyncShellSurfaceVisibility()
        => ShellControl.IsSurfaceVisible = IsVisible
            && WindowState != WindowState.Minimized
            && (IsActive || _restoredByNotification || (!_hasActivatedOnce && !ShowActivated));

    private void OnWindowActivated(object? sender, EventArgs e)
    {
        _hasActivatedOnce = true;
        SyncShellSurfaceVisibility();
    }

    private void OnWindowDeactivated(object? sender, EventArgs e)
    {
        _restoredByNotification = false;
        SyncShellSurfaceVisibility();
    }

    private void OnWindowStateChanged(object? sender, EventArgs e)
    {
        if (WindowState == WindowState.Minimized)
            _restoredByNotification = false;
        else
            _restoreWindowState = WindowState;

        SyncShellSurfaceVisibility();
    }

    private void OnWindowIsVisibleChanged(object sender, DependencyPropertyChangedEventArgs e)
        => SyncShellSurfaceVisibility();

    private void OnWindowPreviewKeyDown(object sender, KeyEventArgs e)
    {
        if (e.Key == Key.F12 && Host.Options.EnableDevTools && ShellControl.WebView.CoreWebView2 is { } core)
        {
            e.Handled = true;
            core.OpenDevToolsWindow();
        }
    }

    private void OnWindowClosing(object? sender, CancelEventArgs e)
    {
        if (_closeConfirmed || ShellControl.WebView.CoreWebView2 is null)
            return;

        e.Cancel = true;
        if (_checkingUnsavedClose)
            return;

        _checkingUnsavedClose = true;
        _ = ConfirmAndCloseAsync();
    }

    private async Task ConfirmAndCloseAsync()
    {
        try
        {
            var hasUnsaved = await ShellControl.HasUnsavedWorkAsync().ConfigureAwait(true);
            if (hasUnsaved)
            {
                if (WindowState == WindowState.Minimized)
                    WindowState = _restoreWindowState;

                _ = ShellControl.WebView.Focus();

                var allowClose = await ShellControl.PromptConfirmCloseCoreAsync().ConfigureAwait(true);
                if (!allowClose)
                {
                    _checkingUnsavedClose = false;
                    return;
                }
            }

            _closeConfirmed = true;
            Close();
        }
        catch
        {
            _closeConfirmed = true;
            Close();
        }
    }

    private void OnWindowClosed(object? sender, EventArgs e)
    {
        ShellControl.TitleChanged -= OnShellTitleChanged;
        ShellControl.ThemeChanged -= OnShellThemeChanged;
        ShellControl.WindowActivationRequested -= OnShellWindowActivationRequested;
        ShellControl.Dispose();
    }

    private void OnShellTitleChanged(object? sender, EventArgs e)
        => Title = ShellControl.DocumentTitle;

    private void OnShellThemeChanged(object? sender, EventArgs e)
        => ApplyWindowChrome();

    private void OnShellWindowActivationRequested(object? sender, EventArgs e)
    {
        if (!IsVisible)
            Show();

        if (WindowState == WindowState.Minimized)
            WindowState = _restoreWindowState;

        _restoredByNotification = true;

        if (AllowForegroundActivation)
        {
            _ = Activate();
            DesktopDwmWindowHelper.BringToForeground(this);
        }

        SyncShellSurfaceVisibility();
        _ = ShellControl.WebView.Focus();
    }
}
