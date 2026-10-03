using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;
using StringWithQualityHeaderValue = Microsoft.Net.Http.Headers.StringWithQualityHeaderValue;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// What the web edge reads off a request for the session and the connection — the page render's and the hub's alike.
/// </summary>
internal static class WebClientRequest
{
    // What a request may say at most: a user agent is kept on the page's handle, a language list is walked per new session.
    private const int MaxUserAgentLength = 512;
    private const int MaxLanguages = 8;

    /// <summary>The id of the session the request's cookie opens — SHA-256 of the secret it carries — or null where it carries none.</summary>
    public static string? ReadSessionId(HttpContext http, WebSessionCookie cookie)
        => UISessionSecret.TryToSessionId(ReadSessionSecret(http, cookie));

    /// <summary>The secret the request's cookie carries, as it is: only the edge ever holds it.</summary>
    public static string? ReadSessionSecret(HttpContext http, WebSessionCookie cookie)
        => http.Request.Cookies.TryGetValue(cookie.Name, out var secret) && !string.IsNullOrWhiteSpace(secret)
            ? secret
            : null;

    /// <summary>The connection as the request describes it, once the host's forwarded-headers handling has run.</summary>
    public static UIConnectionInfo ReadConnection(HttpContext http)
    {
        HttpRequest request = http.Request;
        var userAgent = request.Headers.UserAgent.ToString();

        return new UIConnectionInfo
        {
            RemoteAddress = http.Connection.RemoteIpAddress,
            UserAgent = userAgent.Length == 0 ? null : userAgent.Length > MaxUserAgentLength ? userAgent[..MaxUserAgentLength] : userAgent,
            // The application's root, whatever the request's own path: the hub's is /_ne/hub, a page's its route.
            BaseUri = request.Host.HasValue && Uri.TryCreate(UriHelper.BuildAbsolute(request.Scheme, request.Host, request.PathBase, "/"), UriKind.Absolute, out Uri? baseUri)
                ? baseUri
                : null
        };
    }

    /// <summary>The languages <c>Accept-Language</c> asks for, most wanted first; one refused with <c>q=0</c>, and <c>*</c>, left out.</summary>
    public static IReadOnlyList<string> ReadLanguages(HttpContext http)
    {
        if (!StringWithQualityHeaderValue.TryParseList(http.Request.Headers.AcceptLanguage, out IList<StringWithQualityHeaderValue>? parsed) || parsed.Count == 0)
            return [];

        List<(string Tag, double Quality)> wanted = [];

        foreach (StringWithQualityHeaderValue value in parsed)
        {
            var quality = value.Quality ?? 1;
            var tag = value.Value.Value;

            if (quality > 0 && !string.IsNullOrWhiteSpace(tag) && tag != "*")
                wanted.Add((tag, quality));

            if (wanted.Count == MaxLanguages)
                break;
        }

        // A stable sort: languages of one quality keep the order the client wrote them in.
        return [.. wanted.OrderByDescending(static language => language.Quality).Select(static language => language.Tag)];
    }
}
