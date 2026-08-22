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
/// The id comes from the store, never from anything the client supplies. It used to be derived from
/// <c>UserSessionInitData.Credential</c>, which the web layer filled with the literal "authenticated" or
/// "anonymous" — so every visitor shared one of two session ids, and since the id is part of
/// <c>UIRuntimeKey</c>, runtimes were kept apart only by the per-tab GUID that happened to sit beside it.
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

        // Not saved here. UIHost persists whatever a resolver returns, so the store holds the current session
        // whichever resolver is installed — and the live command check can rely on that.
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
    /// Overlays the host's principal onto the session when the application has made claims the authority.
    /// </summary>
    /// <remarks>
    /// Authoritative in both directions: an authenticated principal grants identity and refreshes roles on every
    /// request — so a role revoked in the identity provider reaches us on the next one — and the absence of an
    /// authenticated principal takes the identity away, because under this setting it means the host signed the
    /// user out. Under <see cref="UIIdentitySource.Session"/> nothing here runs and the application's own
    /// <c>SignInAsync</c> owns the session.
    /// <para>
    /// The id rotation that a change of identity calls for is not set here — <c>UIHost</c> compares what it is
    /// about to persist against what is stored, so it holds for a custom resolver too.
    /// </para>
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
}
