using System;
using System.Collections.Frozen;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Application;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Sessions;

/// <summary>
/// Resolves the session the client presented from <see cref="IUserSessionStore"/>, issuing a new one when it
/// presented none, an unknown one, or one that has gone idle.
/// </summary>
/// <remarks>
/// The session id always comes from the store, never from anything the client supplies.
/// </remarks>
internal sealed class StoredUserSessionResolver : IUserSessionResolver
{
    private readonly IUserSessionStore _store;
    private readonly UIApplication _application;
    private readonly IUserClaimsMapper _claims;

    public StoredUserSessionResolver(IUserSessionStore store, UIApplication application, IUserClaimsMapper claims)
    {
        ArgumentNullException.ThrowIfNull(store);
        ArgumentNullException.ThrowIfNull(application);
        ArgumentNullException.ThrowIfNull(claims);

        _store = store;
        _application = application;
        _claims = claims;
    }

    /// <inheritdoc />
    public async Task<IUserSessionContext> ResolveAsync(UserSessionInitData initData, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(initData);

        DateTime utcNow = DateTime.UtcNow;
        UserSessionState? stored = await TryLoadAsync(initData.SessionId, utcNow, cancellationToken).ConfigureAwait(false);

        // Not saved here: UIHost persists whatever a resolver returns.
        UserSessionState session = stored ?? new UserSessionState
        {
            SessionId = CreateSessionId(),
            Language = _application.Translator.DefaultLanguage,
            CreatedAtUtc = utcNow,
            LastSeenAtUtc = utcNow
        };

        session = ApplyClaims(session, initData.Principal);

        return new UserSessionContext(
            session.SessionId,
            session.Language,
            session.ThemeMode,
            session.IsAuthenticated,
            session.UserId,
            session.Roles,
            session.Permissions
        );
    }

    /// <summary>
    /// Loads a presented session, treating one that has gone idle as absent — so an expired identity is not
    /// resurrected in the window between cleanup sweeps.
    /// </summary>
    private async ValueTask<UserSessionState?> TryLoadAsync(string? sessionId, DateTime utcNow, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(sessionId))
            return null;

        UserSessionState? stored = await _store.TryGetAsync(sessionId, cancellationToken).ConfigureAwait(false);

        if (stored is null)
            return null;

        return stored.LastSeenAtUtc + _application.Sessions.IdleTimeout <= utcNow ? null : stored;
    }

    /// <summary>
    /// Issues an unguessable session id — a predictable one is a session-fixation invitation.
    /// </summary>
    private static string CreateSessionId()
        => Convert.ToHexString(RandomNumberGenerator.GetBytes(16));

    /// <summary>
    /// Overlays the host's principal onto the session when the application has made claims the authority.
    /// </summary>
    /// <remarks>
    /// Authoritative in both directions: an authenticated principal refreshes roles on every request and its absence signs
    /// the user out; does nothing under <see cref="UIIdentitySource.Session"/>.
    /// </remarks>
    private UserSessionState ApplyClaims(UserSessionState session, ClaimsPrincipal? principal)
    {
        if (_application.Security.IdentitySource != UIIdentitySource.Claims)
            return session;

        UserClaimsIdentity identity = principal is null
            ? UserClaimsIdentity.Anonymous
            : _claims.Map(principal);

        if (!identity.IsAuthenticated)
        {
            return session.IsAuthenticated
                ? session with { IsAuthenticated = false, UserId = null, Roles = FrozenSet<string>.Empty, Permissions = FrozenSet<string>.Empty }
                : session;
        }

        return session with
        {
            IsAuthenticated = true,
            UserId = identity.UserId,
            Roles = identity.Roles,
            Permissions = identity.Permissions
        };
    }
}
