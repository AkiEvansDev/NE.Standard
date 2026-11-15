using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Desktop.Hosting;

/// <summary>Configuration options for a WebView2 desktop window and its underlying web host.</summary>
public sealed class DesktopHostOptions
{
    /// <summary>Gets or sets how the desktop window connects to its web host.</summary>
    public DesktopHostMode Mode { get; set; } = DesktopHostMode.InProcess;

    /// <summary>Gets or sets the target server URI when <see cref="Mode"/> is <see cref="DesktopHostMode.Remote"/>.</summary>
    public Uri? ServerUri { get; set; }

    /// <summary>Gets or sets the initial route opened when the window starts.</summary>
    public string InitialRoute { get; set; } = "/";

    /// <summary>Gets or sets the fallback window title before a page sets its document title.</summary>
    public string WindowTitle { get; set; } = "NE.Standard";

    /// <summary>Gets or sets the window icon — a file path, a path under <c>wwwroot</c> (such as <c>/favicon.ico</c> or <c>/icon.png</c>), a <c>data:</c> URI, or <c>data:,</c> to suppress the default <c>NE</c> icon. Overrides <c>UIApplication.Icon</c>.</summary>
    public string? Icon { get; set; }

    /// <summary>Gets or sets the initial window width in device-independent pixels.</summary>
    public double InitialWidth { get; set; } = 1280;

    /// <summary>Gets or sets the initial window height in device-independent pixels.</summary>
    public double InitialHeight { get; set; } = 820;

    /// <summary>Gets or sets the minimum window width in device-independent pixels.</summary>
    public double MinWidth { get; set; } = 480;

    /// <summary>Gets or sets the minimum window height in device-independent pixels.</summary>
    public double MinHeight { get; set; } = 360;

    /// <summary>Gets or sets the fallback theme used for window chrome before an in-process <c>UIApplication</c> theme is resolved.</summary>
    public UITheme Theme { get; set; } = UIThemeDefaults.Default;

    /// <summary>Gets or sets the preferred initial theme mode when the session has not chosen one.</summary>
    public UIThemeMode DefaultThemeMode { get; set; } = UIThemeMode.Dark;

    /// <summary>Gets or sets the content root directory for the in-process web host; defaults to <see cref="AppContext.BaseDirectory"/>.</summary>
    public string? ContentRootPath { get; set; }

    /// <summary>Gets or sets the static web root directory (<c>wwwroot</c>) served by the in-process web host.</summary>
    public string? WebRootPath { get; set; }

    /// <summary>Gets or sets the directory where WebView2 stores cookies, cache, and local storage.</summary>
    public string? UserDataFolder { get; set; }

    /// <summary>Gets or sets how file downloads initiated by a page are handled.</summary>
    public DesktopDownloadMode DownloadMode { get; set; } = DesktopDownloadMode.SaveDialog;

    /// <summary>Gets or sets the target directory used when <see cref="DownloadMode"/> is <see cref="DesktopDownloadMode.Directory"/>, or the initial folder for <see cref="DesktopDownloadMode.SaveDialog"/>.</summary>
    public string? DownloadsDirectory { get; set; }

    /// <summary>Gets or sets whether browser developer tools (<c>F12</c>) are enabled.</summary>
    public bool EnableDevTools { get; set; } = DefaultEnableDevTools();

#if DEBUG
    private static bool DefaultEnableDevTools() => true;
#else
    private static bool DefaultEnableDevTools() => false;
#endif

    /// <summary>Applies command-line arguments (<c>--mode=inprocess|remote</c>, <c>--server=&lt;url&gt;</c>, <c>--route=&lt;path&gt;</c>, <c>--icon=&lt;path&gt;</c>, <c>--devtools</c>) to this options instance.</summary>
    public void ApplyCommandLine(IReadOnlyList<string>? args)
    {
        if (args is null || args.Count == 0)
            return;

        for (var i = 0; i < args.Count; i++)
        {
            var arg = args[i];
            if (string.IsNullOrWhiteSpace(arg))
                continue;

            if (TryReadSwitch(arg, args, ref i, "--server", out var serverValue) && Uri.TryCreate(serverValue, UriKind.Absolute, out Uri? serverUri))
            {
                ServerUri = serverUri;
                Mode = DesktopHostMode.Remote;
            }
            else if (TryReadSwitch(arg, args, ref i, "--mode", out var modeValue))
            {
                if (string.Equals(modeValue, "remote", StringComparison.OrdinalIgnoreCase))
                    Mode = DesktopHostMode.Remote;
                else if (string.Equals(modeValue, "inprocess", StringComparison.OrdinalIgnoreCase) || string.Equals(modeValue, "local", StringComparison.OrdinalIgnoreCase))
                    Mode = DesktopHostMode.InProcess;
            }
            else if (TryReadSwitch(arg, args, ref i, "--route", out var routeValue) && !string.IsNullOrWhiteSpace(routeValue))
            {
                InitialRoute = routeValue;
            }
            else if (TryReadSwitch(arg, args, ref i, "--icon", out var iconValue) && !string.IsNullOrWhiteSpace(iconValue))
            {
                Icon = iconValue;
            }
            else if (string.Equals(arg, "--devtools", StringComparison.OrdinalIgnoreCase))
            {
                EnableDevTools = true;
            }
        }
    }

    private static bool TryReadSwitch(string current, IReadOnlyList<string> args, ref int index, string switchName, out string value)
    {
        var prefix = switchName + "=";
        if (current.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
        {
            value = current[prefix.Length..].Trim();
            return true;
        }

        if (string.Equals(current, switchName, StringComparison.OrdinalIgnoreCase) && index + 1 < args.Count)
        {
            index++;
            value = args[index].Trim();
            return true;
        }

        value = string.Empty;
        return false;
    }
}
