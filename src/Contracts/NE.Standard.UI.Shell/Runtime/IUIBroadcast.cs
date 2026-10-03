using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Controllers;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>
/// Hands work to the pages open on a topic or under a user, from anywhere in an application — another page's command, a hosted
/// service, a timer, a webhook.
/// </summary>
/// <remarks>
/// Each runtime reached runs the work as <see cref="IUIRuntimeAccess.Post"/> runs it: queued and returned from at once, under the
/// runtime's lock, one at a time in the order it was posted — every runtime of a topic in the same order — and a failure goes to that
/// controller's exception handler. A runtime no page looks at now (<see cref="IUIRuntimeAccess.HasViewers"/>) is passed over unless
/// <c>viewersOnly</c> is <see langword="false"/>, and catches up when a page next attaches to it. Reaches the runtimes of this process
/// only; answers how many it posted to.
/// </remarks>
public interface IUIBroadcast
{
    /// <summary>Posts <paramref name="action"/> to every runtime subscribed to <paramref name="topic"/> through <see cref="UIContext.Subscribe"/>.</summary>
    ValueTask<int> PostAsync(string topic, Func<IUIController, Task> action, bool viewersOnly = true, CancellationToken cancellationToken = default);

    /// <summary>Posts <paramref name="action"/> to every runtime of every session signed in as <paramref name="userId"/>, whatever its route.</summary>
    ValueTask<int> PostToUserAsync(string userId, Func<IUIController, Task> action, bool viewersOnly = true, CancellationToken cancellationToken = default);
}
