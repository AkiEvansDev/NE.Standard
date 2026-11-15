using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Interop;
using NE.Colors;

namespace NE.Standard.UI.Desktop.Hosting;

internal static partial class DesktopDwmWindowHelper
{
    private const int DwmwaUseImmersiveDarkMode = 20;
    private const int DwmwaWindowCornerPreference = 33;
    private const int DwmwaCaptionColor = 35;
    private const int DwmwaTextColor = 36;
    private const int DwmwcpRound = 2;

    public static void ApplyWindowChrome(Window window, bool isDark, ColorVariant captionColor, ColorVariant textColor)
    {
        var hwnd = new WindowInteropHelper(window).Handle;
        if (hwnd == 0)
            return;

        var darkFlag = isDark ? 1 : 0;
        var cornerPreference = DwmwcpRound;
        var captionColorRef = ToColorRef(captionColor);
        var textColorRef = ToColorRef(textColor);

        _ = DwmSetWindowAttribute(hwnd, DwmwaUseImmersiveDarkMode, ref darkFlag, sizeof(int));
        _ = DwmSetWindowAttribute(hwnd, DwmwaWindowCornerPreference, ref cornerPreference, sizeof(int));
        _ = DwmSetWindowAttribute(hwnd, DwmwaCaptionColor, ref captionColorRef, sizeof(int));
        _ = DwmSetWindowAttribute(hwnd, DwmwaTextColor, ref textColorRef, sizeof(int));
    }

    private static int ToColorRef(ColorVariant variant)
    {
        System.Drawing.Color color = variant.ToColor();
        return color.R | (color.G << 8) | (color.B << 16);
    }

    [LibraryImport("dwmapi.dll")]
    [DefaultDllImportSearchPaths(DllImportSearchPath.System32)]
    private static partial int DwmSetWindowAttribute(nint hwnd, int dwAttribute, ref int pvAttribute, int cbAttribute);
}
