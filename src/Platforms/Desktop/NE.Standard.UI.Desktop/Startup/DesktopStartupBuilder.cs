using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Desktop.Hosting;
using NE.Standard.UI.Startup;

namespace NE.Standard.UI.Desktop.Startup;

/// <summary>Represents a configured and built WebView2 desktop host.</summary>
public sealed class DesktopBuiltHost : IAsyncDisposable, IDisposable
{
    internal DesktopBuiltHost(DesktopWebHost webHost)
    {
        WebHost = webHost;
    }

    /// <summary>Gets the underlying <see cref="DesktopWebHost"/>.</summary>
    public DesktopWebHost WebHost { get; }

    /// <summary>Gets the root service provider.</summary>
    public IServiceProvider Services => WebHost.Services;

    /// <summary>Gets the desktop host options.</summary>
    public DesktopHostOptions Options => WebHost.Options;

    /// <summary>Starts the underlying host so <see cref="DesktopWebHost.BaseUri"/> is ready.</summary>
    public Task StartAsync(CancellationToken cancellationToken = default)
        => WebHost.StartAsync(cancellationToken);

    /// <summary>Creates a new <see cref="DesktopShellControl"/> bound to <see cref="WebHost"/>.</summary>
    public DesktopShellControl CreateShellControl()
        => new(WebHost);

    /// <summary>Creates a new <see cref="DesktopWindow"/> bound to <see cref="WebHost"/>.</summary>
    public DesktopWindow CreateWindow()
        => new(WebHost);

    /// <inheritdoc />
    public ValueTask DisposeAsync()
        => WebHost.DisposeAsync();

    /// <inheritdoc />
    public void Dispose()
        => WebHost.Dispose();
}

/// <summary>Builds and runs WebView2 desktop applications configured via <see cref="DesktopStartupBase{TStartup}"/>.</summary>
public static class DesktopStartupBuilder
{
    /// <summary>Builds a <see cref="DesktopBuiltHost"/> from <typeparamref name="TDesktopStartup"/> and <typeparamref name="TStartup"/>.</summary>
    public static DesktopBuiltHost Build<TDesktopStartup, TStartup>(IReadOnlyList<string>? args = null, Action<DesktopHostOptions>? configureOptions = null, Action<IServiceCollection>? configureServices = null)
        where TDesktopStartup : DesktopStartupBase<TStartup>, new()
        where TStartup : UIStartupBase, new()
    {
        (UITheme startupTheme, var startupIcon) = DesktopStartupBase<TStartup>.ReadShellDefaults();
        DesktopRemoteApplicationDefaults remoteDefaults = new(startupTheme, startupIcon);

        TDesktopStartup startup = new();
        DesktopHostOptions options = new()
        {
            Theme = startupTheme
        };
        startup.ConfigureHost(options);
        options.ApplyCommandLine(args);
        configureOptions?.Invoke(options);

        DesktopWebHost webHost = DesktopWebHost.Create(
            options,
            services =>
            {
                startup.ConfigureDesktop(services, options, remoteDefaults);
                configureServices?.Invoke(services);
            }
        );

        return new DesktopBuiltHost(webHost);
    }

    /// <summary>Builds and runs a WebView2 desktop application window for <typeparamref name="TDesktopStartup"/> and <typeparamref name="TStartup"/>.</summary>
    public static int Run<TDesktopStartup, TStartup>(IReadOnlyList<string>? args = null, Action<DesktopHostOptions>? configureOptions = null, Action<IServiceCollection>? configureServices = null)
        where TDesktopStartup : DesktopStartupBase<TStartup>, new()
        where TStartup : UIStartupBase, new()
    {
        using DesktopBuiltHost host = Build<TDesktopStartup, TStartup>(args, configureOptions, configureServices);

        // Warm Kestrel and WebView2 environment in parallel while WPF creates and lays out the window HWND.
        _ = ObserveStartupTask(host.StartAsync(), host.WebHost, "StartAsync");

        System.Windows.Application app = System.Windows.Application.Current ?? new System.Windows.Application
        {
            ShutdownMode = ShutdownMode.OnMainWindowClose
        };

        DesktopWindow window = host.CreateWindow();
        _ = ObserveStartupTask(window.ShellControl.WarmEnvironmentAsync(), host.WebHost, "WarmEnvironmentAsync");
        window.Loaded += (_, _) => _ = ObserveStartupTask(window.ShellControl.OpenInitialPageAsync(), host.WebHost, "OpenInitialPageAsync");
        return app.Run(window);
    }

    internal static Task ObserveStartupTask(Task task, DesktopWebHost host, string operation)
    {
        ArgumentNullException.ThrowIfNull(task);
        ArgumentNullException.ThrowIfNull(host);
        ArgumentException.ThrowIfNullOrWhiteSpace(operation);

        return task.ContinueWith(
            t =>
            {
                AggregateException? aggregate = t.Exception;
                if (aggregate is null)
                    return;

                Exception root = aggregate.Flatten().InnerException ?? aggregate;
                if (root is OperationCanceledException && host.IsDisposed)
                    return;

                host.LogStartupError(typeof(DesktopStartupBuilder).FullName!, operation, root);
            },
            CancellationToken.None,
            TaskContinuationOptions.OnlyOnFaulted | TaskContinuationOptions.ExecuteSynchronously,
            TaskScheduler.Default
        );
    }
}
