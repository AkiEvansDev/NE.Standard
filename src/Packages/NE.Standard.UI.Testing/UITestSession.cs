using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Security.Claims;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Testing;

/// <summary>The session a page is opened in: who is signed in, in which language and time zone.</summary>
/// <remarks>
/// Stored in the application's own session store before the page is opened and presented as a browser presents its cookie, so the
/// application's resolver, authorization and filters read it as they read a real one; under claims as the identity source the same
/// user travels as the host's principal.
/// </remarks>
public sealed class UITestSession
{
    private const string AuthenticationType = "NE.Standard.UI.Testing";

    internal UITestSession()
    {
    }

    /// <summary>Gets the signed-in user's id, or <see langword="null"/> for an anonymous session.</summary>
    public string? UserId { get; private set; }

    /// <summary>Gets the signed-in user's roles.</summary>
    public IReadOnlySet<string> Roles { get; private set; } = FrozenSet<string>.Empty;

    /// <summary>Gets the signed-in user's permissions.</summary>
    public IReadOnlySet<string> Permissions { get; private set; } = FrozenSet<string>.Empty;

    /// <summary>Gets the session's language, or <see langword="null"/> for the application's default.</summary>
    public string? Language { get; private set; }

    /// <summary>Gets the time zone the client reports, an IANA id, or <see langword="null"/> for none.</summary>
    public string? TimeZone { get; private set; }

    /// <summary>Signs the session in as <paramref name="userId"/> with the given roles and permissions.</summary>
    public UITestSession SignIn(string userId, IEnumerable<string>? roles = null, IEnumerable<string>? permissions = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);

        UserId = userId;
        Roles = roles is null ? [] : FrozenSet.ToFrozenSet(roles, StringComparer.Ordinal);
        Permissions = permissions is null ? [] : FrozenSet.ToFrozenSet(permissions, StringComparer.Ordinal);

        return this;
    }

    /// <summary>Opens the session in <paramref name="language"/>.</summary>
    public UITestSession InLanguage(string language)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(language);

        Language = language;
        return this;
    }

    /// <summary>Opens the session with the client reporting <paramref name="timeZone"/>, an IANA id.</summary>
    public UITestSession InTimeZone(string timeZone)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(timeZone);

        TimeZone = timeZone;
        return this;
    }

    /// <summary>Whether anything was said about the session; an untouched one is issued by the application as a first visit's is.</summary>
    internal bool IsDescribed => UserId is not null || Language is not null;

    /// <summary>The session as the store keeps it, under a new id.</summary>
    internal UserSessionState ToState(string defaultLanguage)
    {
        DateTime now = DateTime.UtcNow;

        return new UserSessionState
        {
            SessionId = UISessionSecret.New().SessionId,
            Language = Language ?? defaultLanguage,
            TimeZone = TimeZone,
            IsAuthenticated = UserId is not null,
            UserId = UserId,
            Roles = Roles,
            Permissions = Permissions,
            CreatedAtUtc = now,
            LastSeenAtUtc = now
        };
    }

    /// <summary>The signed-in user as a host's authentication would hand it over; read only under claims as the identity source.</summary>
    internal ClaimsPrincipal? ToPrincipal(string permissionClaimType)
    {
        if (UserId is null)
            return null;

        List<Claim> claims = [new Claim(ClaimTypes.NameIdentifier, UserId), new Claim(ClaimTypes.Name, UserId)];

        foreach (var role in Roles)
            claims.Add(new Claim(ClaimTypes.Role, role));

        foreach (var permission in Permissions)
            claims.Add(new Claim(permissionClaimType, permission));

        return new ClaimsPrincipal(new ClaimsIdentity(claims, AuthenticationType));
    }
}
