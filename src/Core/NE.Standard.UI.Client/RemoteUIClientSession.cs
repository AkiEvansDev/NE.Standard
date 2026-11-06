using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Connections;

namespace NE.Standard.UI.Client;

/// <summary>
/// Represents a remote client session (such as a desktop WPF window or test client) talking to an <c>NE.Standard.UI.Web</c>
/// or <c>NE.Standard.UI.Server</c> host over HTTP and SignalR.
/// </summary>
public sealed class RemoteUIClientSession : IAsyncDisposable, IDisposable
{
    private readonly Func<HttpMessageHandler>? _handlerFactory;
    private readonly List<RemoteUIClientTransport> _transports = [];
    private bool _disposed;

    /// <summary>Initializes a new remote client session for <paramref name="baseAddress"/>.</summary>
    [SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "HttpClient owns and disposes the message handler created by CreateMessageHandler.")]
    public RemoteUIClientSession(Uri baseAddress, Func<HttpMessageHandler>? handlerFactory = null, HttpTransportType? transportType = null)
    {
        ArgumentNullException.ThrowIfNull(baseAddress);

        BaseAddress = baseAddress;
        _handlerFactory = handlerFactory;
        TransportType = transportType;
        ClientWindowId = Guid.NewGuid().ToString("N");
        Cookies = new CookieContainer();
        HttpClient = new HttpClient(CreateMessageHandler(), disposeHandler: true)
        {
            BaseAddress = baseAddress
        };
    }

    /// <summary>Gets the base address of the server.</summary>
    public Uri BaseAddress { get; }

    /// <summary>Gets the client window identifier shared across pages opened in this session window.</summary>
    public string ClientWindowId { get; }

    /// <summary>Gets the cookie container holding the session cookie across HTTP and SignalR requests.</summary>
    public CookieContainer Cookies { get; }

    /// <summary>Gets the HTTP client configured with this session's base address and cookies.</summary>
    public HttpClient HttpClient { get; }

    /// <summary>Gets the optional SignalR HTTP transport type override.</summary>
    public HttpTransportType? TransportType { get; }

    /// <summary>Opens a remote <see cref="UIClientPage"/> for <paramref name="address"/> and attaches it to the server hub.</summary>
    public async Task<UIClientPage> OpenPageAsync(string address = "/", IUIClientStorageProvider? storage = null, CancellationToken cancellationToken = default)
    {
        ObjectDisposedException.ThrowIf(_disposed, this);
        ArgumentException.ThrowIfNullOrWhiteSpace(address);

        RemoteUIClientTransport transport = await RemoteUIClientTransport
            .ConnectAsync(this, address, RemoveTransport, cancellationToken)
            .ConfigureAwait(false);

        lock (_transports)
            _transports.Add(transport);

        try
        {
            UIClientPage page = new(transport, storage);
            transport.BindPage(page);
            await page.StartAsync(cancellationToken).ConfigureAwait(false);
            return page;
        }
        catch
        {
            await transport.CloseAsync(CancellationToken.None).ConfigureAwait(false);
            throw;
        }
    }

    [SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "DelegatingHandler owns and disposes the inner HttpMessageHandler.")]
    internal HttpMessageHandler CreateMessageHandler()
    {
        HttpMessageHandler inner = _handlerFactory is not null
            ? _handlerFactory()
            : new SocketsHttpHandler { UseCookies = false, AllowAutoRedirect = false };

        return new CookieTrackingHandler(Cookies, BaseAddress, inner);
    }

    private void RemoveTransport(RemoteUIClientTransport transport)
    {
        lock (_transports)
            _ = _transports.Remove(transport);
    }

    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        if (_disposed)
            return;

        _disposed = true;

        RemoteUIClientTransport[] active;
        lock (_transports)
        {
            active = [.. _transports];
            _transports.Clear();
        }

        for (var i = 0; i < active.Length; i++)
            await active[i].CloseAsync(CancellationToken.None).ConfigureAwait(false);

        HttpClient.Dispose();
    }

    /// <inheritdoc />
    public void Dispose()
    {
        if (_disposed)
            return;

        _disposed = true;
        HttpClient.Dispose();
    }

    private sealed class CookieTrackingHandler(CookieContainer cookies, Uri baseAddress, HttpMessageHandler innerHandler) : DelegatingHandler(innerHandler)
    {
        private readonly Lock _sync = new();

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Uri requestUri = request.RequestUri is null
                ? baseAddress
                : request.RequestUri.IsAbsoluteUri ? request.RequestUri : new Uri(baseAddress, request.RequestUri);

            if (!IsSameOrigin(baseAddress, requestUri))
                throw new InvalidOperationException($"Refusing to send session request to foreign origin '{requestUri.GetLeftPart(UriPartial.Authority)}'.");

            lock (_sync)
            {
                var cookieHeader = cookies.GetCookieHeader(requestUri);
                if (!string.IsNullOrEmpty(cookieHeader))
                {
                    _ = request.Headers.Remove("Cookie");
                    _ = request.Headers.TryAddWithoutValidation("Cookie", cookieHeader);
                }
            }

            HttpResponseMessage response = await base.SendAsync(request, cancellationToken).ConfigureAwait(false);

            if (response.Headers.TryGetValues("Set-Cookie", out IEnumerable<string>? setCookieHeaders))
            {
                lock (_sync)
                {
                    foreach (var header in setCookieHeaders)
                        cookies.SetCookies(requestUri, header);
                }
            }

            return response;
        }

        private static bool IsSameOrigin(Uri expected, Uri candidate)
            => Uri.Compare(expected, candidate, UriComponents.SchemeAndServer, UriFormat.Unescaped, StringComparison.OrdinalIgnoreCase) == 0;
    }
}
