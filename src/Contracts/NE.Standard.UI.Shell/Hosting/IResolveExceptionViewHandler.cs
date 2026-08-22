using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Navigation;

namespace NE.Standard.UI.Shell.Hosting;

/// <summary>
/// Handles failures that occur while resolving a UI view.
/// </summary>
public interface IResolveExceptionViewHandler
{
    /// <summary>
    /// Attempts to convert a view resolution failure into a navigation request.
    /// </summary>
    ValueTask<UINavigationRequest?> HandleAsync(ResolveExceptionViewContext context, CancellationToken cancellationToken = default);
}
