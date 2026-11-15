using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Application;
using NE.Standard.UI.Web.Hosting;

namespace NE.Standard.UI.Desktop.Hosting;

/// <summary>Manages the in-process loopback <c>NE.Standard.UI.Web</c> server or remote server target backing a desktop window.</summary>
public sealed class DesktopWebHost : IAsyncDisposable, IDisposable
{
    private readonly WebApplication? _webApplication;
    private readonly ServiceProvider? _remoteServices;
    private readonly SemaphoreSlim _startGate = new(1, 1);
    private volatile Uri? _baseUri;
    private bool _disposed;

    private DesktopWebHost(DesktopHostOptions options, WebApplication? webApplication, ServiceProvider? remoteServices, string contentRootPath, string webRootPath)
    {
        Options = options;
        _webApplication = webApplication;
        _remoteServices = remoteServices;
        ContentRootPath = contentRootPath;
        WebRootPath = webRootPath;
    }

    /// <summary>Gets the desktop host configuration options.</summary>
    public DesktopHostOptions Options { get; }

    internal string ContentRootPath { get; }

    internal string WebRootPath { get; }

    /// <summary>Gets the root service provider for the host.</summary>
    public IServiceProvider Services => _webApplication?.Services
        ?? (IServiceProvider?)_remoteServices
        ?? throw new InvalidOperationException("The desktop host services are unavailable.");

    /// <summary>Gets the active application theme.</summary>
    public UITheme ActiveTheme => Services.GetService<UIApplication>()?.Theme ?? Options.Theme;

    /// <summary>Gets the configured icon specification (<see cref="DesktopHostOptions.Icon"/> or <see cref="UIApplication.Icon"/>); <see langword="null"/> uses the framework's default mark.</summary>
    public string? ActiveIcon => Options.Icon ?? Services.GetService<UIApplication>()?.Icon;

    /// <summary>Gets whether the host has been started and <see cref="BaseUri"/> is ready.</summary>
    public bool IsStarted => _baseUri is not null;

    /// <summary>Gets the resolved base URI of the running loopback server or remote server.</summary>
    public Uri BaseUri => _baseUri ?? throw new InvalidOperationException("Call StartAsync before reading BaseUri.");

    internal static DesktopWebHost Create(DesktopHostOptions options, Action<IServiceCollection> configureServices)
    {
        ArgumentNullException.ThrowIfNull(options);
        ArgumentNullException.ThrowIfNull(configureServices);

        var contentRoot = ResolveContentRootPath(options);
        var webRoot = ResolveWebRootPath(options, contentRoot);

        if (options.Mode == DesktopHostMode.Remote)
        {
            if (options.ServerUri is not { IsAbsoluteUri: true } remoteUri
                || (!string.Equals(remoteUri.Scheme, Uri.UriSchemeHttp, StringComparison.OrdinalIgnoreCase)
                    && !string.Equals(remoteUri.Scheme, Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase)))
            {
                throw new InvalidOperationException("DesktopHostOptions.ServerUri must be an absolute HTTP or HTTPS URI when Mode is Remote.");
            }

            ServiceCollection services = new();
            _ = services.AddSingleton(options);
            configureServices(services);
            return new DesktopWebHost(options, webApplication: null, services.BuildServiceProvider(validateScopes: true), contentRoot, webRoot);
        }

        WebApplicationBuilder builder = WebApplication.CreateBuilder(new WebApplicationOptions
        {
            ContentRootPath = contentRoot,
            WebRootPath = webRoot,
            EnvironmentName =
#if DEBUG
                Environments.Development
#else
                Environments.Production
#endif
        });

        _ = builder.Logging.ClearProviders();
        _ = builder.WebHost.ConfigureKestrel(static kestrel => kestrel.Listen(IPAddress.Loopback, 0));
        _ = builder.Services.AddSingleton(options);
        configureServices(builder.Services);

        WebApplication app = builder.Build();
        if (Directory.Exists(webRoot))
            _ = app.UseStaticFiles();

        _ = app.UseRouting();
        return new DesktopWebHost(options, app, remoteServices: null, contentRoot, webRoot);
    }

    private static string ResolveContentRootPath(DesktopHostOptions options)
    {
        var candidate = string.IsNullOrWhiteSpace(options.ContentRootPath)
            ? AppContext.BaseDirectory
            : Path.GetFullPath(options.ContentRootPath);

        return Directory.Exists(candidate) ? candidate : AppContext.BaseDirectory;
    }

    private static string ResolveWebRootPath(DesktopHostOptions options, string contentRoot)
        => string.IsNullOrWhiteSpace(options.WebRootPath)
            ? Path.Combine(contentRoot, "wwwroot")
            : Path.GetFullPath(options.WebRootPath);

    /// <summary>Starts the loopback server (when in-process) and resolves <see cref="BaseUri"/>.</summary>
    public async Task StartAsync(CancellationToken cancellationToken = default)
    {
        ObjectDisposedException.ThrowIf(_disposed, this);

        await _startGate.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            if (_baseUri is not null)
                return;

            if (_webApplication is null)
            {
                _baseUri = EnsureTrailingSlash(Options.ServerUri!);
                return;
            }

            _ = await _webApplication.MapStandardUIWebAsync(cancellationToken).ConfigureAwait(false);
            await _webApplication.StartAsync(cancellationToken).ConfigureAwait(false);

            IServer server = _webApplication.Services.GetRequiredService<IServer>();
            var boundAddress = server.Features.Get<IServerAddressesFeature>()?.Addresses.FirstOrDefault()
                ?? throw new InvalidOperationException("The in-process loopback server started without a bound address.");

            _baseUri = EnsureTrailingSlash(new Uri(boundAddress, UriKind.Absolute));
        }
        finally
        {
            _ = _startGate.Release();
        }
    }

    private static Uri EnsureTrailingSlash(Uri uri)
    {
        var text = uri.AbsoluteUri;
        return text[^1] == '/' ? uri : new Uri(text + "/", UriKind.Absolute);
    }

    /// <summary>Resolves a relative route against <see cref="BaseUri"/>.</summary>
    public Uri ResolveUri(string? route = null)
    {
        Uri baseUri = BaseUri;
        if (string.IsNullOrWhiteSpace(route) || route == "/")
            return baseUri;

        var trimmed = route[0] == '/' ? route[1..] : route;
        return new Uri(baseUri, trimmed);
    }

    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        if (_disposed)
            return;

        _disposed = true;
        if (_webApplication is not null)
        {
            if (_baseUri is not null)
                await _webApplication.StopAsync().ConfigureAwait(false);

            await _webApplication.DisposeAsync().ConfigureAwait(false);
        }

        if (_remoteServices is not null)
            await _remoteServices.DisposeAsync().ConfigureAwait(false);

        _startGate.Dispose();
    }

    /// <inheritdoc />
    public void Dispose()
    {
        if (_disposed)
            return;

        _disposed = true;
        ((IDisposable?)_webApplication)?.Dispose();
        _remoteServices?.Dispose();
        _startGate.Dispose();
    }
}
