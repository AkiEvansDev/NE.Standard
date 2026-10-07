using System;
using System.Collections.Generic;
using System.Runtime.ExceptionServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Runtime;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Hosting;

/// <summary>
/// The host's topics and the posts to them: which runtimes took which topic, dropped as each runtime is asked to go, and a user's
/// runtimes found the way <see cref="IUISessions"/> finds them — which a user's notification reaches too.
/// </summary>
internal sealed class UIBroadcast(UIRuntimeStore store, IServiceProvider services) : IUIBroadcast, IUIControllerTypeBroadcast, IUINotifier
{
    // One lock for the index and every post, so two posts reach every runtime they share in the same order.
    private readonly Lock _sync = new();
    private readonly Dictionary<string, HashSet<IUIRuntime>> _subscribers = new(StringComparer.Ordinal);
    // Each runtime's own topics, so its end drops them without a walk of every topic.
    private readonly Dictionary<IUIRuntime, List<string>> _topics = [];

    /// <summary>How many topics have a runtime subscribed, for a test to see that a runtime's end left nothing behind.</summary>
    internal int TopicCount
    {
        get
        {
            lock (_sync)
                return _subscribers.Count;
        }
    }

    /// <summary>Adds a topic to a runtime's; refused once the runtime was asked to go, since its topics were dropped then.</summary>
    internal void Subscribe(UIRuntimeBase runtime, string topic)
    {
        lock (_sync)
        {
            if (runtime.IsAskedToGo)
                return;

            if (!_topics.TryGetValue(runtime, out List<string>? topics))
            {
                topics = [];
                _topics.Add(runtime, topics);
            }
            else if (topics.Contains(topic))
            {
                return;
            }

            topics.Add(topic);

            if (!_subscribers.TryGetValue(topic, out HashSet<IUIRuntime>? runtimes))
            {
                runtimes = [];
                _subscribers.Add(topic, runtimes);
            }

            _ = runtimes.Add(runtime);
        }
    }

    internal void Unsubscribe(IUIRuntime runtime, string topic)
    {
        lock (_sync)
        {
            if (!_topics.TryGetValue(runtime, out List<string>? topics) || !topics.Remove(topic))
                return;

            if (topics.Count == 0)
                _ = _topics.Remove(runtime);

            RemoveSubscriberNoLock(topic, runtime);
        }
    }

    private void RemoveSubscriberNoLock(string topic, IUIRuntime runtime)
    {
        HashSet<IUIRuntime> runtimes = _subscribers[topic];
        _ = runtimes.Remove(runtime);

        if (runtimes.Count == 0)
            _ = _subscribers.Remove(topic);
    }

    /// <summary>Drops every topic a runtime took: it was asked to go.</summary>
    internal void Leave(IUIRuntime runtime)
    {
        lock (_sync)
        {
            if (!_topics.Remove(runtime, out List<string>? topics))
                return;

            for (var i = 0; i < topics.Count; i++)
                RemoveSubscriberNoLock(topics[i], runtime);
        }
    }

    /// <inheritdoc />
    public ValueTask<int> PostAsync(string topic, Func<IUIController, Task> action, UIViewers viewers = UIViewers.Connected, CancellationToken cancellationToken = default)
        => PostAsync(topic, null, action, viewers, cancellationToken);

    ValueTask<int> IUIControllerTypeBroadcast.PostAsync(string topic, Type controllerType, Func<IUIController, Task> action, UIViewers viewers, CancellationToken cancellationToken)
        => PostAsync(topic, controllerType, action, viewers, cancellationToken);

    private ValueTask<int> PostAsync(string topic, Type? controllerType, Func<IUIController, Task> action, UIViewers viewers, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(topic);
        ArgumentNullException.ThrowIfNull(action);
        cancellationToken.ThrowIfCancellationRequested();

        var posted = 0;

        lock (_sync)
        {
            if (_subscribers.TryGetValue(topic, out HashSet<IUIRuntime>? runtimes))
            {
                foreach (IUIRuntime runtime in runtimes)
                {
                    if (TryPost(runtime, controllerType, action, viewers))
                        posted++;
                }
            }
        }

        return ValueTask.FromResult(posted);
    }

    /// <summary>
    /// Queues the work on a runtime that takes it now: a started one — one still starting reads its state as it starts — whose controller
    /// is a <paramref name="controllerType"/> where one is named, and one looked at as <paramref name="viewers"/> asks, since a kept one
    /// catches up at its next attach.
    /// </summary>
    private static bool TryPost(IUIRuntime runtime, Type? controllerType, Func<IUIController, Task> action, UIViewers viewers)
    {
        if (!runtime.IsStarted || !IsLookedAt(runtime, viewers))
            return false;

        IUIController controller = runtime.Controller;

        if (controllerType is not null && !controllerType.IsInstanceOfType(controller))
            return false;

        runtime.Post(_ => action(controller));

        return true;
    }

    private static bool IsLookedAt(IUIRuntime runtime, UIViewers viewers)
        => viewers switch
        {
            UIViewers.All => true,
            UIViewers.Connected => runtime.HasViewers,
            UIViewers.Visible => runtime.HasVisibleViewers,
            _ => throw new ArgumentOutOfRangeException(nameof(viewers), viewers, "Not a UIViewers value.")
        };

    /// <inheritdoc />
    public ValueTask<int> PostToUserAsync(string userId, Func<IUIController, Task> action, UIViewers viewers = UIViewers.Connected, CancellationToken cancellationToken = default)
        => PostToUserAsync(userId, null, action, viewers, cancellationToken);

    ValueTask<int> IUIControllerTypeBroadcast.PostToUserAsync(string userId, Type controllerType, Func<IUIController, Task> action, UIViewers viewers, CancellationToken cancellationToken)
        => PostToUserAsync(userId, controllerType, action, viewers, cancellationToken);

    private async ValueTask<int> PostToUserAsync(string userId, Type? controllerType, Func<IUIController, Task> action, UIViewers viewers, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);
        ArgumentNullException.ThrowIfNull(action);

        List<IUIRuntime> runtimes = [];

        foreach (List<IUIRuntime> session in await FindUserSessionsAsync(userId, cancellationToken).ConfigureAwait(false))
            runtimes.AddRange(session);

        var posted = 0;

        lock (_sync)
        {
            for (var i = 0; i < runtimes.Count; i++)
            {
                if (TryPost(runtimes[i], controllerType, action, viewers))
                    posted++;
            }
        }

        return posted;
    }

    /// <summary>The runtimes of each session signed in as <paramref name="userId"/>, one list a session.</summary>
    private async ValueTask<List<List<IUIRuntime>>> FindUserSessionsAsync(string userId, CancellationToken cancellationToken)
    {
        IReadOnlyList<string> sessions = await services.GetRequiredService<IUserSessionStore>().FindByUserAsync(userId, cancellationToken).ConfigureAwait(false);
        List<List<IUIRuntime>> found = new(sessions.Count);

        // Read off each session's own index, as a session's end reads it; used outside the store's lock.
        for (var i = 0; i < sessions.Count; i++)
        {
            UIRuntimeKey[] keys = store.GetSessionKeys(sessions[i]);
            List<IUIRuntime> runtimes = new(keys.Length);

            for (var k = 0; k < keys.Length; k++)
            {
                if (store.TryGet(keys[k], out IUIRuntime? runtime))
                    runtimes.Add(runtime!);
            }

            found.Add(runtimes);
        }

        return found;
    }

    /// <inheritdoc />
    public async ValueTask<int> NotifyUserAsync(string userId, ShowSystemNotificationEffect notification, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);
        ArgumentNullException.ThrowIfNull(notification);

        if (notification.Action is not null)
            throw new ArgumentException("A notification sent to a user offers no action: its command would belong to one page's runtime, and it reaches pages of any. Give it an Address instead.", nameof(notification));

        ClientEffect[] effects = [notification];
        ExceptionDispatchInfo? failure = null;
        var sent = 0;

        foreach (List<IUIRuntime> session in await FindUserSessionsAsync(userId, cancellationToken).ConfigureAwait(false))
        {
            foreach ((UIRuntimeBase runtime, List<UIHandle> pages) in PickSessionPages(session, notification.When))
            {
                try
                {
                    await runtime.SendEffectsToAsync(pages, effects, cancellationToken).ConfigureAwait(false);
                    sent += pages.Count;
                }
                catch (Exception exception) when (exception is not OperationCanceledException || !cancellationToken.IsCancellationRequested)
                {
                    // A page whose connection is gone, or a runtime ending, must not keep it from the user's other pages.
                    failure ??= ExceptionDispatchInfo.Capture(exception);
                }
            }
        }

        failure?.Throw();

        return sent;
    }

    /// <summary>
    /// The pages of one session a notification goes to, by runtime, picked as a runtime's send to all picks them
    /// (<see cref="UIRuntimeBase.GetsSystemNotification"/>), so it sounds once.
    /// </summary>
    private static List<(UIRuntimeBase Runtime, List<UIHandle> Pages)> PickSessionPages(List<IUIRuntime> session, UINotificationWhen when)
    {
        List<UIHandle> pages = [];
        List<UIRuntimeBase> owners = [];

        for (var i = 0; i < session.Count; i++)
        {
            if (session[i] is not UIRuntimeBase { IsStarted: true } runtime)
                continue;

            foreach (UIHandle page in runtime.ViewerHandles)
            {
                pages.Add(page);
                owners.Add(runtime);
            }
        }

        List<(UIRuntimeBase Runtime, List<UIHandle> Pages)> picked = [];
        UIHandle? shower = UIRuntimeBase.PickSystemNotificationPage(pages, except: null, when);

        for (var i = 0; i < pages.Count; i++)
        {
            if (UIRuntimeBase.GetsSystemNotification(pages[i], when, shower))
                AddPage(picked, owners[i], pages[i]);
        }

        return picked;
    }

    private static void AddPage(List<(UIRuntimeBase Runtime, List<UIHandle> Pages)> picked, UIRuntimeBase runtime, UIHandle page)
    {
        for (var i = 0; i < picked.Count; i++)
        {
            if (ReferenceEquals(picked[i].Runtime, runtime))
            {
                picked[i].Pages.Add(page);
                return;
            }
        }

        picked.Add((runtime, [page]));
    }
}
