using System;
using System.Collections.Generic;
using System.Threading;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using NE.Standard.UI.Application;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The cookie that carries the session's secret: its name, resolved once for the application, and how a response writes it.
/// </summary>
internal sealed partial class WebSessionCookie
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Warning, Message = "The session cookie went out over plain HTTP, so without Secure and the __Host- prefix. Behind a TLS proxy, call UseForwardedHeaders() so the request reads as HTTPS. Later cookies over HTTP are not logged.")]
        public static partial void WrittenOverHttp(ILogger logger);
    }

    public const string DefaultName = "ne.ui.session";

    // Over HTTPS the browser keeps a cookie so named only when it is Secure, for the whole host and with no Domain, so a sibling
    // subdomain can neither set nor shadow it.
    private const string HostPrefix = "__Host-";

    private const string SecurePrefix = "__Secure-";

    private readonly string _secureName;

    // Null in Development, where plain HTTP is the usual way to run a page and the warning would say nothing.
    private readonly ILogger? _plainHttpLogger;
    private int _plainHttpReported;

    /// <exception cref="InvalidOperationException">The configured client key carries a cookie prefix of its own.</exception>
    public WebSessionCookie(UIApplication application, IHostEnvironment? environment = null, ILogger<WebSessionCookie>? logger = null)
    {
        ArgumentNullException.ThrowIfNull(application);

        _plainHttpLogger = environment is not null && environment.IsDevelopment() ? null : logger;

        // A prefixed name over HTTP goes out without Secure, which the browser refuses to keep: every attach would reload.
        if (application.Sessions.ClientKey is { } key && (key.StartsWith(HostPrefix, StringComparison.OrdinalIgnoreCase) || key.StartsWith(SecurePrefix, StringComparison.OrdinalIgnoreCase)))
            throw new InvalidOperationException($"Sessions.ClientKey '{key}' carries a cookie prefix; name the cookie without it, and over HTTPS it goes by '{HostPrefix}' already.");

        Name = application.Sessions.ClientKey ?? NameFor(environment?.ApplicationName);
        _secureName = HostPrefix + Name;
    }

    /// <summary>The cookie's name: the configured client key, or the default followed by the application's name.</summary>
    /// <remarks>Over HTTPS the cookie goes by it under the <c>__Host-</c> prefix (<see cref="NameOn"/>).</remarks>
    public string Name { get; }

    /// <summary>The default name followed by the application's name as a cookie token — lowercase, anything else a dash.</summary>
    public static string NameFor(string? applicationName)
    {
        if (string.IsNullOrWhiteSpace(applicationName))
            return DefaultName;

        var token = new char[applicationName.Length];

        for (var i = 0; i < token.Length; i++)
        {
            var c = char.ToLowerInvariant(applicationName[i]);

            token[i] = c is (>= 'a' and <= 'z') or (>= '0' and <= '9') or '.' or '_' or '-' ? c : '-';
        }

        return $"{DefaultName}.{new string(token)}";
    }

    /// <summary>The name the cookie goes by on a request: <see cref="Name"/>, under the <c>__Host-</c> prefix over HTTPS.</summary>
    /// <remarks>Never the plain name over HTTPS: that one a sibling subdomain can set for this host, which is what the prefix refuses.</remarks>
    public string NameOn(HttpRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        return request.IsHttps ? _secureName : Name;
    }

    /// <summary>Hands the client <paramref name="secret"/>: the one session cookie the response writes.</summary>
    public void Write(HttpContext http, UISessionOptions options, string secret)
    {
        ArgumentNullException.ThrowIfNull(http);
        ArgumentNullException.ThrowIfNull(options);
        ArgumentException.ThrowIfNullOrWhiteSpace(secret);

        var name = NameOn(http.Request);

        // Silent otherwise: behind a proxy that ends TLS without forwarded headers, every reader's key would travel unmarked.
        if (!http.Request.IsHttps && _plainHttpLogger is not null && Interlocked.Exchange(ref _plainHttpReported, 1) == 0)
            Log.WrittenOverHttp(_plainHttpLogger);

        // A sign-in during a page load replaces the key that load was issued: a response carries one cookie of a name.
        RemoveWritten(http.Response, name);

        http.Response.Cookies.Append(name, secret, new CookieOptions
        {
            HttpOnly = true,
            IsEssential = true,
            SameSite = SameSiteMode.Lax,
            Secure = http.Request.IsHttps,
            Path = "/",
            MaxAge = options.ClientKeyLifetime
        });
    }

    private static void RemoveWritten(HttpResponse response, string name)
    {
        StringValues written = response.Headers.SetCookie;

        if (written.Count == 0)
            return;

        var prefix = $"{name}=";
        List<string> kept = new(written.Count);

        foreach (var cookie in written)
        {
            if (cookie is not null && !cookie.StartsWith(prefix, StringComparison.Ordinal))
                kept.Add(cookie);
        }

        if (kept.Count != written.Count)
            response.Headers.SetCookie = new StringValues([.. kept]);
    }
}
