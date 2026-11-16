using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Server.Kestrel.Core;
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
    private readonly X509Certificate2? _serverCertificate;
    private readonly ServiceProvider? _remoteServices;
    private readonly SemaphoreSlim _startGate = new(1, 1);
    private volatile Uri? _baseUri;
    private volatile Uri? _browserBaseUri;
    private bool _disposed;

    private DesktopWebHost(DesktopHostOptions options, WebApplication? webApplication, X509Certificate2? serverCertificate, ServiceProvider? remoteServices, string contentRootPath, string webRootPath)
    {
        Options = options;
        _webApplication = webApplication;
        _serverCertificate = serverCertificate;
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

    /// <summary>Gets the resolved HTTP base URI of the running loopback server or remote server.</summary>
    public Uri BaseUri => _baseUri ?? throw new InvalidOperationException("Call StartAsync before reading BaseUri.");

    /// <summary>Gets the HTTP/2-capable loopback HTTPS URI navigated to by the embedded browser when in-process, or <see cref="BaseUri"/> when remote.</summary>
    public Uri BrowserBaseUri => _browserBaseUri ?? throw new InvalidOperationException("Call StartAsync before reading BrowserBaseUri.");

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
            return new DesktopWebHost(options, webApplication: null, serverCertificate: null, services.BuildServiceProvider(validateScopes: true), contentRoot, webRoot);
        }

        X509Certificate2 serverCertificate = DesktopLoopbackCertificate.Instance.CreateServerCertificate();

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
        _ = builder.WebHost.ConfigureKestrel(kestrel =>
        {
            kestrel.Listen(IPAddress.Loopback, 0, static listen => listen.Protocols = HttpProtocols.Http1);
            kestrel.Listen(
                IPAddress.Loopback,
                0,
                listen =>
                {
                    listen.Protocols = HttpProtocols.Http1AndHttp2;
                    _ = listen.UseHttps(serverCertificate);
                }
            );
        });
        _ = builder.Services.AddSingleton(options);
        configureServices(builder.Services);

        WebApplication app = builder.Build();
        if (Directory.Exists(webRoot))
            _ = app.UseStaticFiles();

        _ = app.UseRouting();
        return new DesktopWebHost(options, app, serverCertificate, remoteServices: null, contentRoot, webRoot);
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

    /// <summary>Starts the loopback server (when in-process) and resolves <see cref="BaseUri"/> and <see cref="BrowserBaseUri"/>.</summary>
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
                Uri remote = EnsureTrailingSlash(Options.ServerUri!);
                _baseUri = remote;
                _browserBaseUri = remote;
                return;
            }

            _ = await _webApplication.MapStandardUIWebAsync(cancellationToken).ConfigureAwait(false);
            await _webApplication.StartAsync(cancellationToken).ConfigureAwait(false);

            IServer server = _webApplication.Services.GetRequiredService<IServer>();
            ICollection<string>? addresses = server.Features.Get<IServerAddressesFeature>()?.Addresses;
            if (addresses is null || addresses.Count == 0)
                throw new InvalidOperationException("The in-process loopback server started without bound addresses.");

            Uri? httpUri = null;
            Uri? httpsUri = null;
            foreach (var address in addresses)
            {
                if (!Uri.TryCreate(address, UriKind.Absolute, out Uri? parsed))
                    continue;

                if (string.Equals(parsed.Scheme, Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase))
                    httpsUri ??= EnsureTrailingSlash(parsed);
                else if (string.Equals(parsed.Scheme, Uri.UriSchemeHttp, StringComparison.OrdinalIgnoreCase))
                    httpUri ??= EnsureTrailingSlash(parsed);
            }

            _baseUri = httpUri ?? httpsUri ?? throw new InvalidOperationException("The in-process loopback server started without a valid HTTP address.");
            _browserBaseUri = httpsUri ?? _baseUri;
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
        => ResolveAgainst(BaseUri, route);

    /// <summary>Resolves a relative route against <see cref="BrowserBaseUri"/>.</summary>
    public Uri ResolveBrowserUri(string? route = null)
        => ResolveAgainst(BrowserBaseUri, route);

    private static Uri ResolveAgainst(Uri root, string? route)
    {
        if (string.IsNullOrWhiteSpace(route) || route == "/")
            return root;

        var trimmed = route[0] == '/' ? route[1..] : route;
        return new Uri(root, trimmed);
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

        _serverCertificate?.Dispose();

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
        _serverCertificate?.Dispose();
        _remoteServices?.Dispose();
        _startGate.Dispose();
    }
}
