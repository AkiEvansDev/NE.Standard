using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Runtime;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Hosting;

/// <summary>
/// The host's topics and the posts to them: which runtimes took which topic, dropped as each runtime is asked to go, and a user's
/// runtimes found the way <see cref="IUISessions"/> finds them.
/// </summary>
internal sealed class UIBroadcast(UIRuntimeStore store, IServiceProvider services) : IUIBroadcast, IUIControllerTypeBroadcast
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
    public ValueTask<int> PostAsync(string topic, Func<IUIController, Task> action, bool viewersOnly = true, CancellationToken cancellationToken = default)
        => PostAsync(topic, null, action, viewersOnly, cancellationToken);

    ValueTask<int> IUIControllerTypeBroadcast.PostAsync(string topic, Type controllerType, Func<IUIController, Task> action, bool viewersOnly, CancellationToken cancellationToken)
        => PostAsync(topic, controllerType, action, viewersOnly, cancellationToken);

    private ValueTask<int> PostAsync(string topic, Type? controllerType, Func<IUIController, Task> action, bool viewersOnly, CancellationToken cancellationToken)
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
                    if (TryPost(runtime, controllerType, action, viewersOnly))
                        posted++;
                }
            }
        }

        return ValueTask.FromResult(posted);
    }

    /// <summary>
    /// Queues the work on a runtime that takes it now: a started one — one still starting reads its state as it starts — whose controller
    /// is a <paramref name="controllerType"/> where one is named, and, where <paramref name="viewersOnly"/>, one a page looks at, since a
    /// kept one catches up at its next attach.
    /// </summary>
    private static bool TryPost(IUIRuntime runtime, Type? controllerType, Func<IUIController, Task> action, bool viewersOnly)
    {
        if (!runtime.IsStarted || (viewersOnly && !runtime.HasViewers))
            return false;

        IUIController controller = runtime.Controller;

        if (controllerType is not null && !controllerType.IsInstanceOfType(controller))
            return false;

        runtime.Post(_ => action(controller));

        return true;
    }

    /// <inheritdoc />
    public ValueTask<int> PostToUserAsync(string userId, Func<IUIController, Task> action, bool viewersOnly = true, CancellationToken cancellationToken = default)
        => PostToUserAsync(userId, null, action, viewersOnly, cancellationToken);

    ValueTask<int> IUIControllerTypeBroadcast.PostToUserAsync(string userId, Type controllerType, Func<IUIController, Task> action, bool viewersOnly, CancellationToken cancellationToken)
        => PostToUserAsync(userId, controllerType, action, viewersOnly, cancellationToken);

    private async ValueTask<int> PostToUserAsync(string userId, Type? controllerType, Func<IUIController, Task> action, bool viewersOnly, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);
        ArgumentNullException.ThrowIfNull(action);

        IReadOnlyList<string> sessions = await services.GetRequiredService<IUserSessionStore>().FindByUserAsync(userId, cancellationToken).ConfigureAwait(false);
        List<IUIRuntime> runtimes = [];

        // Read off each session's own index, as a session's end reads it; posted outside the store's lock.
        for (var i = 0; i < sessions.Count; i++)
        {
            UIRuntimeKey[] keys = store.GetSessionKeys(sessions[i]);

            for (var k = 0; k < keys.Length; k++)
            {
                if (store.TryGet(keys[k], out IUIRuntime? runtime))
                    runtimes.Add(runtime!);
            }
        }

        var posted = 0;

        lock (_sync)
        {
            for (var i = 0; i < runtimes.Count; i++)
            {
                if (TryPost(runtimes[i], controllerType, action, viewersOnly))
                    posted++;
            }
        }

        return posted;
    }
}
