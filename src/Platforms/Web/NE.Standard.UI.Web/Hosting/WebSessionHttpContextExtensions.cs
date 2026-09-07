using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Application;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The session an HTTP request presents, for an application's own endpoints — the same cookie and the same idle
/// check the framework's file endpoints apply.
/// </summary>
public static class WebSessionHttpContextExtensions
{
    /// <summary>
    /// Reads the stored session behind the request's cookie, or <see langword="null"/> when it presents none the
    /// store knows or one idle past <see cref="UISessionOptions.IdleTimeout"/>.
    /// </summary>
    public static async ValueTask<UserSessionState?> GetUISessionAsync(this HttpContext http, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(http);

        UIApplication application = http.RequestServices.GetRequiredService<UIApplication>();
        var sessionId = WebEndpointRouteBuilderExtensions.ReadSessionCookie(http, application.Sessions);

        if (string.IsNullOrWhiteSpace(sessionId))
            return null;

        IUserSessionStore sessions = http.RequestServices.GetRequiredService<IUserSessionStore>();
        UserSessionState? stored = await sessions.TryGetAsync(sessionId, cancellationToken).ConfigureAwait(false);

        if (stored is null || stored.LastSeenAtUtc + application.Sessions.IdleTimeout <= DateTime.UtcNow)
            return null;

        return stored;
    }

    /// <summary>
    /// The session, when it is one the application's <see cref="UISecurityOptions.DefaultPolicy"/> lets act:
    /// under <see cref="UIAuthorizationDefault.Authenticated"/> an anonymous session answers <see langword="null"/>.
    /// </summary>
    public static async ValueTask<UserSessionState?> GetAuthorizedUISessionAsync(this HttpContext http, CancellationToken cancellationToken = default)
    {
        UserSessionState? session = await GetUISessionAsync(http, cancellationToken).ConfigureAwait(false);

        if (session is null)
            return null;

        UIApplication application = http.RequestServices.GetRequiredService<UIApplication>();

        return application.Security.DefaultPolicy == UIAuthorizationDefault.Authenticated && !session.IsAuthenticated ? null : session;
    }
}
