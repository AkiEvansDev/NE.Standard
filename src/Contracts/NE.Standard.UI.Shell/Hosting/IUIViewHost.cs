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
    Task<UIViewResolution> ResolveViewAsync(UINavigationRequest request, UserSessionInitData sessionInit, UIViewRequestPhase phase = UIViewRequestPhase.Attach, CancellationToken cancellationToken = default);

    /// <summary>
    /// Resolves the view a live connection attaches to, or <see langword="null"/> where the session it presented is not one the store
    /// holds, so that one would have to be issued — which only the request that opens the view can hand its client.
    /// </summary>
    Task<UIViewResolution?> ResolvePresentedViewAsync(UINavigationRequest request, UserSessionInitData sessionInit, CancellationToken cancellationToken = default);
}
