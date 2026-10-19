using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>How a platform hands a page the key of the session its sign-in moved to a new id; the platform registers its own.</summary>
/// <remarks>
/// Only the platform's edge holds a key, so the host passes it on the moment it issues one; with none registered, a sign-in moves
/// the session and hands nobody its key.
/// </remarks>
public interface IUISessionKeyHandover
{
    /// <summary>
    /// Hands the page of <paramref name="handle"/> the new session's key, its handle already moved to the new id; only a client still
    /// presenting <paramref name="previousSessionId"/>, the page's own until the sign-in, may take it.
    /// </summary>
    Task HandOverAsync(UIHandle handle, UISessionSecret key, string previousSessionId, CancellationToken cancellationToken);
}
