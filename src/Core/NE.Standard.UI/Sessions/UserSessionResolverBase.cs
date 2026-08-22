using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Sessions;

/// <summary>
/// Base class for resolving validated user session contexts from client initialization data.
/// </summary>
public abstract class UserSessionResolverBase : IUserSessionResolver
{
    /// <inheritdoc />
    public async Task<IUserSessionContext> ResolveAsync(UserSessionInitData initData, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(initData);

        UserSessionContext session = await ResolveCoreAsync(initData, cancellationToken).ConfigureAwait(false);

        ValidateSession(session);

        return session;
    }

    /// <summary>
    /// Resolves a concrete user session context.
    /// </summary>
    protected abstract Task<UserSessionContext> ResolveCoreAsync(UserSessionInitData initData, CancellationToken cancellationToken);

    private static void ValidateSession(UserSessionContext session)
    {
        ArgumentNullException.ThrowIfNull(session);
        ArgumentException.ThrowIfNullOrWhiteSpace(session.SessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(session.Language);
        ArgumentNullException.ThrowIfNull(session.Roles);
        ArgumentNullException.ThrowIfNull(session.Permissions);
    }

    /// <summary>
    /// Creates an unauthenticated user session context, deriving its session id from
    /// <paramref name="initData"/>.
    /// </summary>
    protected static UserSessionContext Anonymous(UserSessionInitData initData, string language = "en", UIThemeMode themeMode = UIThemeMode.Auto)
    {
        ArgumentNullException.ThrowIfNull(initData);

        return UserSessionContext.Anonymous(ResolveSessionId(initData), language, themeMode);
    }

    /// <summary>
    /// Creates an authenticated user session context, deriving its session id from
    /// <paramref name="initData"/>.
    /// </summary>
    protected static UserSessionContext Authenticated(UserSessionInitData initData, string language = "en", UIThemeMode themeMode = UIThemeMode.Auto, string? userId = null, IReadOnlySet<string>? roles = null, IReadOnlySet<string>? permissions = null)
    {
        ArgumentNullException.ThrowIfNull(initData);

        return UserSessionContext.Authenticated(ResolveSessionId(initData), language, themeMode, userId, roles, permissions);
    }

    /// <summary>
    /// Resolves the session id from the one the client presented, the connection id, or a generated value.
    /// </summary>
    /// <remarks>
    /// Deliberately never derived from <c>Credential</c>. That used to be the first choice, and with the web
    /// layer filling it with a literal it gave every visitor the same session id — which then went into the
    /// runtime key.
    /// </remarks>
    protected static string ResolveSessionId(UserSessionInitData initData)
    {
        ArgumentNullException.ThrowIfNull(initData);

        if (!string.IsNullOrWhiteSpace(initData.SessionId))
            return initData.SessionId;

        return !string.IsNullOrWhiteSpace(initData.ConnectionId)
            ? initData.ConnectionId
            : Guid.NewGuid().ToString("N");
    }
}
