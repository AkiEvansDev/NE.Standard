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

        ApplyWindowChrome();

        SourceInitialized += OnWindowSourceInitialized;
        PreviewKeyDown += OnWindowPreviewKeyDown;
        Closing += OnWindowClosing;
        Closed += OnWindowClosed;

        ShellControl.TitleChanged += OnShellTitleChanged;
        ShellControl.ThemeChanged += OnShellThemeChanged;
    }

    /// <summary>Gets the backing <see cref="DesktopWebHost"/>.</summary>
    public DesktopWebHost Host { get; }

    /// <summary>Gets the <see cref="DesktopShellControl"/> hosted inside this window.</summary>
    public DesktopShellControl ShellControl { get; }

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
        => ApplyWindowChrome();

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
                MessageBoxResult answer = MessageBox.Show(
                    this,
                    "This page has unsaved changes. Are you sure you want to close the window?",
                    Title,
                    MessageBoxButton.OKCancel,
                    MessageBoxImage.Warning
                );

                if (answer != MessageBoxResult.OK)
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
        ShellControl.Dispose();
    }

    private void OnShellTitleChanged(object? sender, EventArgs e)
        => Title = ShellControl.DocumentTitle;

    private void OnShellThemeChanged(object? sender, EventArgs e)
        => ApplyWindowChrome();
}
