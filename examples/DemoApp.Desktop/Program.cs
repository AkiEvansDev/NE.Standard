using System;

namespace DemoApp.Desktop;

internal static class Program
{
    [STAThread]
    private static int Main(string[] args)
        => DesktopStartupBuilder.Run<DemoAppDesktopStartup, DemoAppStartup>(args);
}
