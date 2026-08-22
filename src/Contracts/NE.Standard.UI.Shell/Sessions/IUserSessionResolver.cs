using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// Resolves user session context from connection initialization data.
/// </summary>
public interface IUserSessionResolver
{
    /// <summary>
    /// Resolves the user session.
    /// </summary>
    Task<IUserSessionContext> ResolveAsync(UserSessionInitData initData, CancellationToken cancellationToken = default);
}
