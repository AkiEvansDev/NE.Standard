using System.Collections.Generic;
using System.Security.Claims;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// Provides client connection data used to initialize a user session.
/// </summary>
public sealed class UserSessionInitData
{
    /// <summary>Gets the id of the session the client presented, when it has one.</summary>
    /// <remarks>
    /// The id the client's secret opens (<see cref="UISessionSecret.ToSessionId"/>), computed where the platform reads the key; null or
    /// unknown means a new session is issued, keeping the id unguessable rather than derived from anything the client controls.
    /// </remarks>
    public string? SessionId { get; init; }

    /// <summary>
    /// Gets the client connection id.
    /// </summary>
    public string? ConnectionId { get; init; }

    /// <summary>
    /// Gets the client's id for the window the request came from, when the platform knows it.
    /// </summary>
    public string? ClientWindowId { get; init; }

    /// <summary>Gets the authentication credential supplied by the client.</summary>
    /// <remarks>
    /// An opaque host-supplied token, never an identity or the source of the session id; prefer
    /// <see cref="Principal"/>, which the shipped resolver maps.
    /// </remarks>
    public string? Credential { get; init; }

    /// <summary>Gets the principal the host authenticated, when it authenticates at all.</summary>
    /// <remarks>Only read when <c>UISecurityOptions.IdentitySource</c> is <c>Claims</c>.</remarks>
    public ClaimsPrincipal? Principal { get; init; }

    /// <summary>Gets what the platform knows about the connection the request came over.</summary>
    public UIConnectionInfo Connection { get; init; } = UIConnectionInfo.Unknown;

    /// <summary>Gets the languages the client asks for, most wanted first — the web's <c>Accept-Language</c>.</summary>
    /// <remarks>What a new session's language is negotiated from (<c>UILocalizationOptions.NegotiateLanguage</c>).</remarks>
    public IReadOnlyList<string> Languages { get; init; } = [];

    /// <summary>Gets the time zone the client reports it is in, an IANA id, when it reports one.</summary>
    /// <remarks>Kept on the session (<see cref="UserSessionState.TimeZone"/>) when the host knows the zone; a page render reports none.</remarks>
    public string? TimeZone { get; init; }

    /// <summary>Gets the secret of the id <see cref="IssueSessionId"/> issued, for the platform to hand the client.</summary>
    public UISessionSecret? IssuedSecret { get; private set; }

    /// <summary>Issues the id a new session takes; every later call in the request answers the same one.</summary>
    /// <remarks>
    /// A resolver issuing a session takes its id from here: the platform hands the client the secret behind it, and an id a
    /// resolver made up itself is one no client is ever handed.
    /// </remarks>
    public string IssueSessionId()
        => (IssuedSecret ??= UISessionSecret.New()).SessionId;
}
