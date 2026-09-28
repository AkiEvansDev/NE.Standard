using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Navigation;

namespace NE.Standard.UI.Controllers;

/// <summary>
/// What the runtime tells a controller about the connections that come and go, as <see cref="UIControllerBase"/> hears it.
/// </summary>
internal interface IUIControllerLifecycle
{
    /// <summary>A connection attached, carrying the navigation it arrived with.</summary>
    Task AttachedAsync(UINavigationRequest navigation, CancellationToken cancellationToken);

    /// <summary>A connection detached.</summary>
    Task DetachedAsync(CancellationToken cancellationToken);
}
