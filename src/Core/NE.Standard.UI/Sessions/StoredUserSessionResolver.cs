using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Application;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Sessions;

/// <summary>
/// Resolves the session the client presented from <see cref="IUserSessionStore"/>, issuing a new one when it
/// presented none, an unknown one, or one that has gone idle.
/// </summary>
/// <remarks>The session id always comes from the store, never from anything the client supplies.</remarks>
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
            SessionId = initData.IssueSessionId(),
            Language = NegotiateLanguage(initData.Languages),
            CreatedAtUtc = utcNow,
            LastSeenAtUtc = utcNow
        };

        session = ApplyClaims(session, initData.Principal);

        return UserSessionContext.WithSessionId(session, session.SessionId);
    }

    /// <summary>
    /// A new session's language: the first the client asks for that the translator has — as written, else its primary language
    /// (<c>en</c> for <c>en-GB</c>) — or the default where it has none of them or negotiation is off.
    /// </summary>
    private string NegotiateLanguage(IReadOnlyList<string> wanted)
    {
        ITranslator translator = _application.Translator;

        if (!_application.Localization.NegotiateLanguage)
            return translator.DefaultLanguage;

        for (var i = 0; i < wanted.Count; i++)
        {
            if (FindLanguage(translator.Languages, wanted[i]) is { } exact)
                return exact;

            var dash = wanted[i].IndexOf('-', StringComparison.Ordinal);

            if (dash > 0 && FindLanguage(translator.Languages, wanted[i][..dash]) is { } primary)
                return primary;
        }

        return translator.DefaultLanguage;
    }

    /// <summary>The translator's own spelling of a language tag, which compares without case.</summary>
    private static string? FindLanguage(IReadOnlyList<string> languages, string tag)
    {
        for (var i = 0; i < languages.Count; i++)
        {
            if (string.Equals(languages[i], tag, StringComparison.OrdinalIgnoreCase))
                return languages[i];
        }

        return null;
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

        return stored.IsIdle(_application.Sessions, utcNow) ? null : stored;
    }

    /// <summary>Overlays the host's principal onto the session when the application has made claims the authority.</summary>
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
