using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Application;
using NE.Standard.UI.Web.Hosting;

namespace NE.Standard.UI.Desktop.Hosting;

internal sealed record DesktopRemoteApplicationDefaults(UITheme Theme, string? Icon);

/// <summary>Manages the in-process loopback <c>NE.Standard.UI.Web</c> server or remote server target backing a desktop window.</summary>
public sealed partial class DesktopWebHost : IAsyncDisposable, IDisposable
{
    internal const string LoopbackAuthCookiePrefix = "ne.desktop.auth";

    private readonly WebApplication? _webApplication;
    private readonly X509Certificate2? _serverCertificate;
    private readonly byte[]? _serverCertificateSha256;
    private readonly ServiceProvider? _remoteServices;
    private readonly ILoggerFactory? _loggerFactory;
    private readonly Lock _lifecycleSync = new();
    private Task _lifecycleQueue = Task.CompletedTask;
    private volatile Uri? _baseUri;
    private int _disposed;

    private DesktopWebHost(DesktopHostOptions options, WebApplication? webApplication, X509Certificate2? serverCertificate, string? loopbackAuthToken, ServiceProvider? remoteServices, string contentRootPath, string webRootPath)
    {
        Options = options;
        _webApplication = webApplication;
        _serverCertificate = serverCertificate;
        _serverCertificateSha256 = serverCertificate?.GetCertHash(HashAlgorithmName.SHA256);
        LoopbackAuthToken = loopbackAuthToken;
        _remoteServices = remoteServices;
        _loggerFactory = webApplication?.Services.GetService<ILoggerFactory>() ?? remoteServices?.GetService<ILoggerFactory>();
        ContentRootPath = contentRootPath;
        WebRootPath = webRootPath;
    }

    /// <summary>Gets the desktop host configuration options.</summary>
    public DesktopHostOptions Options { get; }

    internal string ContentRootPath { get; }

    internal string WebRootPath { get; }

    internal string? LoopbackAuthToken { get; }

    internal string LoopbackAuthCookieName => GetLoopbackAuthCookieName(BaseUri.Port);

    internal bool IsDisposed => Volatile.Read(ref _disposed) != 0;

    /// <summary>Gets the root service provider for the host.</summary>
    public IServiceProvider Services => _webApplication?.Services
        ?? (IServiceProvider?)_remoteServices
        ?? throw new InvalidOperationException("The desktop host services are unavailable.");

    /// <summary>Gets the active application theme.</summary>
    public UITheme ActiveTheme => Services.GetService<UIApplication>()?.Theme ?? Options.Theme;

    /// <summary>Gets the configured icon specification (<see cref="DesktopHostOptions.Icon"/> or <see cref="UIApplication.Icon"/>); <see langword="null"/> uses the framework's default mark.</summary>
    public string? ActiveIcon => Options.Icon ?? Services.GetService<UIApplication>()?.Icon ?? Services.GetService<DesktopRemoteApplicationDefaults>()?.Icon;

    /// <summary>Gets whether the host has been started and <see cref="BaseUri"/> is ready.</summary>
    public bool IsStarted => _baseUri is not null;

    /// <summary>Gets the resolved HTTPS loopback base URI (when in-process) or remote server base URI.</summary>
    public Uri BaseUri => _baseUri ?? throw new InvalidOperationException("Call StartAsync before reading BaseUri.");

    /// <summary>Gets the HTTP/2-capable loopback HTTPS URI navigated to by the embedded browser when in-process, or <see cref="BaseUri"/> when remote.</summary>
    public Uri BrowserBaseUri => BaseUri;

    internal static string GetLoopbackAuthCookieName(int port)
        => string.Create(CultureInfo.InvariantCulture, $"{LoopbackAuthCookiePrefix}.{port}");

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
            return new DesktopWebHost(options, webApplication: null, serverCertificate: null, loopbackAuthToken: null, services.BuildServiceProvider(validateScopes: true), contentRoot, webRoot);
        }

        X509Certificate2 serverCertificate = DesktopLoopbackCertificate.Instance.CreateServerCertificate();
        var loopbackAuthToken = Convert.ToHexStringLower(RandomNumberGenerator.GetBytes(32));
        var expectedTokenBytes = Encoding.ASCII.GetBytes(loopbackAuthToken);

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
        DesktopWebHost? hostRef = null;
        _ = app.Use(async (context, next) =>
        {
            var port = hostRef?._baseUri?.Port ?? context.Connection.LocalPort;
            if (!HasValidLoopbackCookie(context.Request, GetLoopbackAuthCookieName(port), expectedTokenBytes))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.Headers.CacheControl = "no-store";
                return;
            }

            await next(context).ConfigureAwait(false);
        });

        if (Directory.Exists(webRoot))
            _ = app.UseStaticFiles();

        _ = app.UseRouting();
        hostRef = new DesktopWebHost(options, app, serverCertificate, loopbackAuthToken, remoteServices: null, contentRoot, webRoot);
        return hostRef;
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

    private static bool HasValidLoopbackCookie(HttpRequest request, string cookieName, byte[] expectedTokenBytes)
    {
        if (!request.Cookies.TryGetValue(cookieName, out var presented)
            || presented is null
            || presented.Length != expectedTokenBytes.Length)
        {
            return false;
        }

        Span<byte> buffer = stackalloc byte[64];
        return Encoding.ASCII.TryGetBytes(presented, buffer, out var written)
            && written == expectedTokenBytes.Length
            && CryptographicOperations.FixedTimeEquals(buffer[..written], expectedTokenBytes);
    }

    /// <summary>Starts the loopback server (when in-process) and resolves <see cref="BaseUri"/> and <see cref="BrowserBaseUri"/>.</summary>
    public Task StartAsync(CancellationToken cancellationToken = default)
    {
        ObjectDisposedException.ThrowIf(IsDisposed, this);
        cancellationToken.ThrowIfCancellationRequested();

        Task previous;
        TaskCompletionSource gate = new(TaskCreationOptions.RunContinuationsAsynchronously);
        lock (_lifecycleSync)
        {
            ObjectDisposedException.ThrowIf(_disposed != 0, this);
            if (_baseUri is not null)
                return Task.CompletedTask;

            previous = _lifecycleQueue;
            _lifecycleQueue = gate.Task;
        }

        return StartCoreAsync(previous, gate, cancellationToken);
    }

    private async Task StartCoreAsync(Task previous, TaskCompletionSource gate, CancellationToken cancellationToken)
    {
        try
        {
            await previous.WaitAsync(cancellationToken).ConfigureAwait(false);
            ObjectDisposedException.ThrowIf(IsDisposed, this);

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
            ICollection<string>? addresses = server.Features.Get<IServerAddressesFeature>()?.Addresses;
            if (addresses is null || addresses.Count == 0)
                throw new InvalidOperationException("The in-process loopback server started without bound addresses.");

            Uri? httpsUri = null;
            foreach (var address in addresses)
            {
                if (Uri.TryCreate(address, UriKind.Absolute, out Uri? parsed)
                    && string.Equals(parsed.Scheme, Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase))
                {
                    httpsUri ??= EnsureTrailingSlash(parsed);
                }
            }

            _baseUri = httpsUri ?? throw new InvalidOperationException("The in-process loopback server started without a valid HTTPS address.");
            ObjectDisposedException.ThrowIf(IsDisposed, this);
        }
        finally
        {
            CompleteGateAfter(previous, gate);
        }
    }

    private static void CompleteGateAfter(Task previous, TaskCompletionSource gate)
    {
        if (previous.IsCompleted)
        {
            gate.SetResult();
            return;
        }

        _ = previous.ContinueWith(
            static (_, state) => ((TaskCompletionSource)state!).SetResult(),
            gate,
            CancellationToken.None,
            TaskContinuationOptions.ExecuteSynchronously,
            TaskScheduler.Default
        );
    }

    private static Uri EnsureTrailingSlash(Uri uri)
    {
        var text = uri.AbsoluteUri;
        return text[^1] == '/' ? uri : new Uri(text + "/", UriKind.Absolute);
    }

    /// <summary>Creates an <see cref="HttpClient"/> configured for <see cref="BaseUri"/>, carrying the per-process loopback credential and certificate pin when in-process.</summary>
    public HttpClient CreateHttpClient()
    {
        ObjectDisposedException.ThrowIf(IsDisposed, this);

        Uri baseUri = BaseUri;
        if (LoopbackAuthToken is null || _serverCertificateSha256 is null)
            return new HttpClient { BaseAddress = baseUri };

        CookieContainer cookies = new();
        cookies.Add(new Cookie(GetLoopbackAuthCookieName(baseUri.Port), LoopbackAuthToken, "/", baseUri.Host) { HttpOnly = true, Secure = true });

        var expectedCertHash = _serverCertificateSha256;
        SocketsHttpHandler? handler = new()
        {
            UseCookies = true,
            CookieContainer = cookies
        };
        try
        {
            handler.SslOptions.RemoteCertificateValidationCallback = (_, certificate, _, _) =>
                certificate is not null
                && CryptographicOperations.FixedTimeEquals(certificate.GetCertHash(HashAlgorithmName.SHA256), expectedCertHash);

            HttpClient client = new(handler, disposeHandler: true);
            handler = null;
            try
            {
                client.BaseAddress = baseUri;
                return client;
            }
            catch
            {
                client.Dispose();
                throw;
            }
        }
        finally
        {
            handler?.Dispose();
        }
    }

    /// <summary>Resolves a relative route against <see cref="BaseUri"/>.</summary>
    public Uri ResolveUri(string? route = null)
        => ResolveAgainst(BaseUri, route);

    /// <summary>Resolves a relative route against <see cref="BrowserBaseUri"/>.</summary>
    public Uri ResolveBrowserUri(string? route = null)
        => ResolveAgainst(BrowserBaseUri, route);

    internal static Uri ResolveAgainst(Uri root, string? route)
    {
        ArgumentNullException.ThrowIfNull(root);

        if (string.IsNullOrWhiteSpace(route) || route == "/")
            return root;

        if (ContainsControlCharacters(route) || char.IsWhiteSpace(route[0]) || char.IsWhiteSpace(route[^1]))
            throw new ArgumentException("Route must not contain control characters or surrounding whitespace.", nameof(route));

        string trimmed;
        if (route[0] == '/')
        {
            if (route.Length > 1 && (route[1] == '/' || route[1] == '\\'))
                throw new ArgumentException("Route must be a relative path on the host's origin.", nameof(route));

            trimmed = route[1..];
        }
        else
        {
            if (route[0] == '\\' || HasUriScheme(route))
                throw new ArgumentException("Route must be a relative path on the host's origin.", nameof(route));

            trimmed = route;
        }

        if (trimmed.Length == 0)
            return root;

        // RFC 3986 §4.2: a first relative segment containing ':' (such as "/urn:123" stripped to "urn:123") must carry "./" so Uri does not parse it as a scheme.
        var relative = trimmed[0] is '?' or '#' ? trimmed : "./" + trimmed;
        Uri resolved = new(root, relative);
        if (!MatchesOrigin(resolved, root)
            || !string.IsNullOrEmpty(resolved.UserInfo)
            || !resolved.AbsolutePath.StartsWith(root.AbsolutePath, StringComparison.Ordinal))
        {
            throw new ArgumentException("Route must stay on the host's origin.", nameof(route));
        }

        return resolved;
    }

    private static bool ContainsControlCharacters(string value)
    {
        for (var i = 0; i < value.Length; i++)
        {
            if (char.IsControl(value[i]))
                return true;
        }

        return false;
    }

    private static bool HasUriScheme(string route)
    {
        for (var i = 0; i < route.Length; i++)
        {
            var ch = route[i];
            if (ch is '/' or '?' or '#')
                return false;

            if (ch == ':')
                return true;
        }

        return false;
    }

    internal static bool MatchesOrigin(Uri candidate, Uri origin)
        => string.Equals(candidate.Scheme, origin.Scheme, StringComparison.OrdinalIgnoreCase)
            && string.Equals(candidate.Host, origin.Host, StringComparison.OrdinalIgnoreCase)
            && candidate.Port == origin.Port;

    internal void LogStartupError(string categoryName, string operation, Exception exception)
    {
        if (_loggerFactory is null)
            return;

        try
        {
            ILogger logger = _loggerFactory.CreateLogger(categoryName);
            LogDesktopOperationFailed(logger, operation, exception);
        }
        catch (ObjectDisposedException)
        {
        }
    }

    [LoggerMessage(EventId = 1, Level = LogLevel.Error, Message = "Desktop host operation '{Operation}' failed.")]
    private static partial void LogDesktopOperationFailed(ILogger logger, string operation, Exception exception);

    internal void LogHostWarning(string categoryName, string detail, Exception? exception = null)
    {
        if (_loggerFactory is null)
            return;

        try
        {
            ILogger logger = _loggerFactory.CreateLogger(categoryName);
            LogDesktopWarning(logger, detail, exception);
        }
        catch (ObjectDisposedException)
        {
        }
    }

    [LoggerMessage(EventId = 2, Level = LogLevel.Warning, Message = "{Detail}")]
    private static partial void LogDesktopWarning(ILogger logger, string detail, Exception? exception);

    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        if (Interlocked.Exchange(ref _disposed, 1) != 0)
            return;

        await DisposeCoreAsync().ConfigureAwait(false);
    }

    /// <inheritdoc />
    public void Dispose()
    {
        if (Interlocked.Exchange(ref _disposed, 1) != 0)
            return;

        // IDisposable bridge for synchronous Main shutdown: run off the WPF SynchronizationContext so IAsyncDisposable services tear down cleanly.
        Task.Run(DisposeCoreAsync).GetAwaiter().GetResult();
    }

    private async Task DisposeCoreAsync()
    {
        Task previous;
        TaskCompletionSource gate = new(TaskCreationOptions.RunContinuationsAsynchronously);
        lock (_lifecycleSync)
        {
            previous = _lifecycleQueue;
            _lifecycleQueue = gate.Task;
        }

        try
        {
            await previous.ConfigureAwait(false);

            if (_webApplication is not null)
            {
                if (_baseUri is not null)
                    await _webApplication.StopAsync().ConfigureAwait(false);

                await _webApplication.DisposeAsync().ConfigureAwait(false);
            }

            _serverCertificate?.Dispose();

            if (_remoteServices is not null)
                await _remoteServices.DisposeAsync().ConfigureAwait(false);
        }
        finally
        {
            gate.SetResult();
        }
    }
}
