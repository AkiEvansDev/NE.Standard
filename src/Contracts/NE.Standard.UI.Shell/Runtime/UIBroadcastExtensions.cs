using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Controllers;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>Posts through <see cref="IUIBroadcast"/> to the pages of one controller type, the others on the topic or under the user passed over.</summary>
public static class UIBroadcastExtensions
{
    /// <summary>
    /// Posts <paramref name="action"/> to every runtime subscribed to <paramref name="topic"/> whose controller is a
    /// <typeparamref name="TController"/>; answers how many it posted to.
    /// </summary>
    public static ValueTask<int> PostAsync<TController>(this IUIBroadcast broadcast, string topic, Func<TController, Task> action, UIViewers viewers = UIViewers.Connected, CancellationToken cancellationToken = default)
        where TController : class, IUIController
    {
        ArgumentNullException.ThrowIfNull(broadcast);
        ArgumentNullException.ThrowIfNull(action);

        Func<IUIController, Task> typed = Typed(action);

        return broadcast is IUIControllerTypeBroadcast host
            ? host.PostAsync(topic, typeof(TController), typed, viewers, cancellationToken)
            : broadcast.PostAsync(topic, typed, viewers, cancellationToken);
    }

    /// <summary>
    /// The action for any controller, run for a <typeparamref name="TController"/> only. The host's broadcast passes the others over
    /// before posting; one of the application's own posts to them and counts them, the check here keeping the action off them.
    /// </summary>
    private static Func<IUIController, Task> Typed<TController>(Func<TController, Task> action)
        where TController : class, IUIController
        => controller => controller is TController typed ? action(typed) : Task.CompletedTask;

    /// <summary>
    /// Posts <paramref name="action"/> to every runtime of every session signed in as <paramref name="userId"/> whose controller is a
    /// <typeparamref name="TController"/>; answers how many it posted to.
    /// </summary>
    public static ValueTask<int> PostToUserAsync<TController>(this IUIBroadcast broadcast, string userId, Func<TController, Task> action, UIViewers viewers = UIViewers.Connected, CancellationToken cancellationToken = default)
        where TController : class, IUIController
    {
        ArgumentNullException.ThrowIfNull(broadcast);
        ArgumentNullException.ThrowIfNull(action);

        Func<IUIController, Task> typed = Typed(action);

        return broadcast is IUIControllerTypeBroadcast host
            ? host.PostToUserAsync(userId, typeof(TController), typed, viewers, cancellationToken)
            : broadcast.PostToUserAsync(userId, typed, viewers, cancellationToken);
    }
}
