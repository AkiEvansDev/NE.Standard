using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Shell.Services;

/// <summary>
/// Provides dialog operations for a connected UI client.
/// </summary>
public interface IUIDialogService
{
    /// <summary>
    /// Shows a dialog for the specified UI handle.
    /// </summary>
    Task<bool> ShowAsync(UIHandle handle, string dialogName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Hides a dialog for the specified UI handle.
    /// </summary>
    Task<bool> HideAsync(UIHandle handle, string dialogName, CancellationToken cancellationToken = default);
}
