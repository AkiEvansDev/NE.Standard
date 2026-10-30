using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Shell.Hosting;

/// <summary>
/// What a platform that draws a page on the server before its client attaches asks of the host: the web's shell render. A platform
/// whose client draws the page from the attach's changes needs none of it.
/// </summary>
public interface IUIRenderEndpoint
{
    /// <summary>The runtime a page render may read its values from, when the host can say which one this load belongs to.</summary>
    /// <remarks>
    /// Null means "render a fresh page": a render knows the session and address, not the window, so this answers only
    /// when unambiguous without it.
    /// </remarks>
    IUIRuntime? TryGetRenderRuntime(UIViewResolution resolution);

    /// <summary>
    /// Tells a kept runtime a page render is about to paint what moved in its session since it last heard, so the paint is already in
    /// it; one that heard it all is left alone.
    /// </summary>
    Task HearBeforeRenderAsync(IUIRuntime runtime, UIViewResolution resolution, CancellationToken cancellationToken = default);

    /// <summary>Takes the key a sign-in issued while a page render ran the controller's code, for that render's response to hand out.</summary>
    UISessionSecret? TakeRenderKey(UIHandle handle);
}
