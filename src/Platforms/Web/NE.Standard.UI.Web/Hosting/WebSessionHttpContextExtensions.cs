using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Application;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Sessions;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The session an HTTP request presents, for an application's own endpoints — the same cookie and the same idle
/// check the framework's file endpoints apply — and its end, for a host's own sign-out.
/// </summary>
public static class WebSessionHttpContextExtensions
{
    /// <summary>
    /// Reads the stored session behind the request's cookie, or <see langword="null"/> when it presents none the
    /// store knows or one idle past its timeout (<see cref="UserSessionState.IsIdle"/>).
    /// </summary>
    /// <remarks>
    /// Under <see cref="UIIdentitySource.Claims"/> the identity is the request's principal, as a page render's is, but nothing is
    /// saved: the store is corrected by the next render or attach, and a host's sign-out holds here at once.
    /// </remarks>
    public static async ValueTask<UserSessionState?> GetUISessionAsync(this HttpContext http, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(http);

        UIApplication application = http.RequestServices.GetRequiredService<UIApplication>();
        var sessionId = WebClientRequest.ReadSessionId(http, http.RequestServices.GetRequiredService<WebSessionCookie>());

        if (string.IsNullOrWhiteSpace(sessionId))
            return null;

        IUserSessionStore sessions = http.RequestServices.GetRequiredService<IUserSessionStore>();
        UserSessionState? stored = await sessions.TryGetAsync(sessionId, cancellationToken).ConfigureAwait(false);

        if (stored is null || stored.IsIdle(application.Sessions, DateTime.UtcNow))
            return null;

        return application.Security.IdentitySource == UIIdentitySource.Claims
            ? StoredUserSessionResolver.ApplyClaims(stored, http.User, application.Security, http.RequestServices.GetRequiredService<IUserClaimsMapper>())
            : stored;
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

    /// <summary>
    /// Ends the session behind the request's cookie as <see cref="IUISessions.EndSessionAsync"/> ends one: its record and uploads go, and
    /// every page open under it is sent to sign in; a request presenting none ends nothing.
    /// </summary>
    /// <remarks>
    /// For a host's own sign-out under <see cref="UIIdentitySource.Claims"/>: a page's connection keeps the principal it connected with
    /// and a command is checked against the store, so without it an open page goes on acting as the user who signed out.
    /// </remarks>
    public static Task EndUISessionAsync(this HttpContext http, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(http);

        var sessionId = WebClientRequest.ReadSessionId(http, http.RequestServices.GetRequiredService<WebSessionCookie>());

        return string.IsNullOrWhiteSpace(sessionId)
            ? Task.CompletedTask
            : http.RequestServices.GetRequiredService<IUISessions>().EndSessionAsync(sessionId, except: null, cancellationToken);
    }
}
