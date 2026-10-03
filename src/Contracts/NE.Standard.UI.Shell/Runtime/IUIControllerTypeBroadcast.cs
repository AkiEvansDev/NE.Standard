using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Controllers;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>
/// The host's broadcast, which passes over a runtime whose controller is not of a type before posting to it, so a typed post counts
/// only the runtimes it reached.
/// </summary>
internal interface IUIControllerTypeBroadcast
{
    ValueTask<int> PostAsync(string topic, Type controllerType, Func<IUIController, Task> action, bool viewersOnly, CancellationToken cancellationToken);

    ValueTask<int> PostToUserAsync(string userId, Type controllerType, Func<IUIController, Task> action, bool viewersOnly, CancellationToken cancellationToken);
}
