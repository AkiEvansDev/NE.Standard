using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Shell.Hosting;

/// <summary>
/// Resolves authored navigation requests into compiled UI views.
/// </summary>
public interface IUIViewHost
{
    /// <summary>
    /// Resolves a view for the specified navigation request and session initialization data.
    /// </summary>
    Task<UIViewResolution> ResolveViewAsync(UINavigationRequest request, UserSessionInitData sessionInit, UIViewRequestPhase phase = UIViewRequestPhase.RuntimeAttach, CancellationToken cancellationToken = default);
}
