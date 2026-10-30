using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Runtime;
using NE.Standard.UI.Sessions;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Hosting;

internal sealed partial class UIHost
{
    /// <inheritdoc />
    public Task<RuntimeResolution> AttachRuntimeAsync(UIViewResolution resolution, string clientWindowId, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(resolution);
        ArgumentException.ThrowIfNullOrWhiteSpace(clientWindowId);

        resolution.Validate();

        UIInstance instance = new()
        {
            Id = Guid.NewGuid().ToString("N"),
            WindowId = clientWindowId,
            Navigation = resolution.Navigation
        };

        return AttachRuntimeAsync(resolution, instance, cancellationToken);
    }

    /// <inheritdoc />
    [SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "The runtimes the store hands back are disposed by DisposeIfAnyAsync, which logs a dispose that throws rather than rethrowing it.")]
    public async Task<RuntimeResolution> AttachRuntimeAsync(UIViewResolution resolution, UIInstance instance, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(resolution);
        ArgumentNullException.ThrowIfNull(instance);

        resolution.Validate();
        instance.Validate();

        UIHandle handle = new(instance, resolution.Session, resolution.Connection);
        var started = Stopwatch.GetTimestamp();

        Log.AttachingRuntime(_logger, resolution.Route.Route, new UISessionFingerprint(resolution.Session.SessionId), instance.WindowId, instance.Id);

        if (resolution.Route.ControllerType is null)
        {
            RuntimeResolution staticResolution = new()
            {
                ViewResolution = resolution,
                Handle = handle,
                Runtime = null
            };

            staticResolution.Validate();

            return staticResolution;
        }

        UIRuntimeKey key = CreateRuntimeKey(_application.Persistence, resolution.Route, resolution.Session.SessionId, resolution.Navigation, handle.Instance.WindowId);

        Log.RuntimeKeyResolved(_logger, _application.Persistence.Lifetime, resolution.Route.Route, new UISessionFingerprint(resolution.Session.SessionId), handle.Instance.WindowId, handle.Instance.Id, key.Identity, key.WindowId);

        await AdoptPreparedRuntimeAsync(key, handle).ConfigureAwait(false);

        var adopted = !IsRendersOwn(handle.Instance);
        var maxTotal = _application.Persistence.MaxRuntimesTotal ?? 0;

        UIRuntimeAcquireResult acquired = RuntimeStore.GetOrAdd(new UIRuntimeAcquireRequest(key, handle.Instance.Id, () => CreateRuntime(handle, resolution.Route, resolution.View), DateTime.UtcNow, ResolveFlushOptions(resolution.Route), _application.Persistence.MaxRuntimesPerSession, _application.Persistence.MaxUnclaimedRuntimesPerSession, maxTotal, adopted));

        if (acquired.Evicted is not null)
            Metrics.RuntimeEvicted(acquired.Eviction);

        // Built for a key another attach filled first, or a session or the process that filled meanwhile; never started, so disposing is all of it.
        await DisposeIfAnyAsync(acquired.Unused).ConfigureAwait(false);
        await DisposeIfAnyAsync(acquired.Evicted).ConfigureAwait(false);

        UIRuntimeEntry entry = acquired.Entry ?? throw RefuseRuntime(maxTotal);
        IUIRuntime runtime = entry.Runtime;

        try
        {
            if (acquired.Created)
            {
                if (Volatile.Read(ref _runtimesFullReported) != 0)
                    Volatile.Write(ref _runtimesFullReported, 0);

                Metrics.RuntimeCreated();

                Log.CreatedRuntime(_logger, resolution.Route.Route, handle.Instance.WindowId, handle.Instance.Id, acquired.ActiveInstances);

                try
                {
                    var starting = Stopwatch.GetTimestamp();

                    await runtime.InitializeAsync(cancellationToken).ConfigureAwait(false);
                    await runtime.StartAsync(cancellationToken).ConfigureAwait(false);

                    entry.MarkInitialized();

                    TimeSpan startElapsed = Stopwatch.GetElapsedTime(starting);

                    Metrics.RuntimeStarted(startElapsed);
                    Log.RuntimeStarted(_logger, resolution.Route.Route, startElapsed.TotalMilliseconds);
                }
                catch (Exception error)
                {
                    entry.MarkInitializationFailed(error);

                    if (RuntimeStore.Remove(key, out IUIRuntime? removed))
                        await DisposeRuntimeAsync(removed!).ConfigureAwait(false);

                    throw;
                }
            }
            else
            {
                // Waits in case the creator is still initializing, so a concurrent attach cannot use an unstarted runtime.
                await entry.Initialization.WaitAsync(cancellationToken).ConfigureAwait(false);

                Log.ReusedRuntime(_logger, resolution.Route.Route, handle.Instance.WindowId, handle.Instance.Id, acquired.Attached, acquired.ActiveInstances);

                var oldInstanceId = runtime.Handle.Instance.Id;

                if (!StringComparer.Ordinal.Equals(oldInstanceId, handle.Instance.Id))
                    Log.UpdatingRuntimeConnection(_logger, resolution.Route.Route, handle.Instance.WindowId, oldInstanceId, handle.Instance.Id);

                UpdateRuntimeConnection(runtime, handle);
            }

            await Own(runtime).NotifyAttachedAsync(handle, acquired.Created, cancellationToken).ConfigureAwait(false);

            // A connection that closed while this attach was under way may have had its disconnect handled before the store knew
            // of it; nothing would ever detach it then, and the runtime would count as connected for good.
            cancellationToken.ThrowIfCancellationRequested();
        }
        catch
        {
            ReleaseInstance(key, runtime, handle.Instance.Id);
            throw;
        }

        await DropLeftPageRuntimesAsync(key).ConfigureAwait(false);

        if (adopted)
            EndLeftPageStays(key, handle.Instance.WindowId);

        RuntimeResolution runtimeResolution = new()
        {
            ViewResolution = resolution,
            Handle = handle,
            Runtime = runtime,
            RuntimeId = entry.Id
        };

        runtimeResolution.Validate();

        TimeSpan elapsed = Stopwatch.GetElapsedTime(started);

        Log.RuntimeAttached(_logger, resolution.Route.Route, handle.Instance.WindowId, elapsed.TotalMilliseconds);

        return runtimeResolution;
    }

    private static UIRuntimeKey CreateRuntimeKey(UIPersistenceOptions persistence, UIRouteDefinition route, string sessionId, UINavigationRequest navigation, string clientWindowId)
    {
        ArgumentNullException.ThrowIfNull(persistence);
        ArgumentNullException.ThrowIfNull(route);
        ArgumentNullException.ThrowIfNull(navigation);
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(clientWindowId);

        var identity = CreateRouteIdentity(route, navigation);

        return persistence.Lifetime switch
        {
            // Per-page and per-tab share a key; DropLeftPageRuntimesAsync is what tells them apart.
            UIRuntimeLifetime.PerPage or UIRuntimeLifetime.PerWindow => new UIRuntimeKey(sessionId, route.Route, identity, clientWindowId),
            // No tab in the key: one runtime per address for the whole client.
            UIRuntimeLifetime.PerClient => new UIRuntimeKey(sessionId, route.Route, identity, null),
            _ => throw new UnreachableException()
        };
    }

    /// <summary>
    /// The part of the address past the path: the route's declared identity parameters and values, or null when it declares none.
    /// </summary>
    private static string? CreateRouteIdentity(UIRouteDefinition route, UINavigationRequest navigation)
    {
        var names = route.IdentityParameters;

        if (names.Length == 0)
            return null;

        IReadOnlyDictionary<string, object?>? parameters = navigation.Parameters;
        StringBuilder identity = new();

        for (var i = 0; i < names.Length; i++)
        {
            if (i > 0)
                _ = identity.Append('&');

            _ = identity.Append(names[i]).Append('=');

            if (parameters is not null && parameters.TryGetValue(names[i], out var value))
                AppendIdentityValue(identity, value);
        }

        return identity.ToString();
    }

    /// <summary>
    /// Appends one identity value, each escaped as the client's <c>encodeURIComponent</c> does, so a value holding <c>&amp;</c>,
    /// <c>=</c> or <c>,</c> cannot read as a different set of values.
    /// </summary>
    private static void AppendIdentityValue(StringBuilder identity, object? value)
    {
        switch (value)
        {
            case null:
                break;
            case string text:
                _ = identity.Append(Uri.EscapeDataString(text));
                break;
            case IEnumerable many:
                var first = true;

                foreach (var item in many)
                {
                    if (!first)
                        _ = identity.Append(',');

                    AppendIdentityValue(identity, item);
                    first = false;
                }

                break;
            default:
                _ = identity.Append(Uri.EscapeDataString(Convert.ToString(value, CultureInfo.InvariantCulture) ?? ""));
                break;
        }
    }

    /// <summary>
    /// Hands this attach the runtime the page render prepared for it, where there is one to hand over.
    /// </summary>
    private async Task AdoptPreparedRuntimeAsync(UIRuntimeKey key, UIHandle handle)
    {
        var pageId = handle.Instance.PageId;

        if (pageId is null || key.WindowId is null)
            return;

        UIRuntimeKey preparedKey = key with { WindowId = pageId };

        if (RuntimeStore.Rekey(preparedKey, key, out IUIRuntime? discarded))
        {
            Log.AdoptedPreparedRuntime(_logger, pageId, key.Route, key.WindowId);
            return;
        }

        if (discarded is null)
            return;

        Log.DiscardedPreparedRuntime(_logger, pageId, key.Route, key.WindowId);

        await DisposeRuntimeAsync(discarded).ConfigureAwait(false);
    }

    /// <summary>Whether an instance is a page render's own, which names its page as its window; anything else is a page someone sees.</summary>
    private static bool IsRendersOwn(UIInstance instance)
        => string.Equals(instance.WindowId, instance.PageId, StringComparison.Ordinal);

    [SuppressMessage("Reliability", "CA2025:Ensure tasks using 'IDisposable' instances complete before the instances are disposed", Justification = "The abandoned scope is disposed by that task alone; nothing else disposes it.")]
    private UIRuntime CreateRuntime(UIHandle handle, UIRouteDefinition route, CompiledView view)
    {
        Type controllerType = route.ControllerType
            ?? throw new InvalidOperationException($"Route '{route.Route}' does not declare a controller.");

        UIClientServices clientServices = ResolveClientServices();

        // A scope per runtime, gone with it: a controller's scoped dependencies (a DbContext) are its page's own, and a disposable
        // transient the root provider built would be tracked by the root until the host stops.
        AsyncServiceScope scope = _services.CreateAsyncScope();

        try
        {
            IUIController controller = CreateController(scope.ServiceProvider, controllerType);

            // Refused before a runtime is built around it, so nothing but the controller and its scope is left to let go of.
            if (controller is not IUIContextController contextController)
            {
                controller.Dispose();
                throw new InvalidOperationException($"Controller '{controller.GetType().Name}' must implement '{nameof(IUIContextController)}'.");
            }

            UIRuntime runtime = new(handle, view, controller, clientServices, _application, this);

            runtime.OwnServices(scope);
            runtime.JoinBroadcast(Broadcast);

            UIContext context = new(_logger, scope.ServiceProvider, _application.Translator, _application.ContentOrNull, route, handle, clientServices.Downloads, clientServices.Uploads, this);

            context.AttachRuntime(runtime);
            contextController.AttachContext(context);

            return runtime;
        }
        catch
        {
            // Not awaited, since the store's factory is synchronous; asynchronously all the same, because a scope holding a
            // service that is only IAsyncDisposable refuses a synchronous dispose.
            _ = DisposeAbandonedScopeAsync(scope);
            throw;
        }
    }

    private static IUIController CreateController(IServiceProvider services, Type controllerType)
    {
        var service = services.GetService(controllerType);

        if (service is not null)
        {
            return service is IUIController serviceController
                ? serviceController
                : throw new InvalidOperationException($"Registered controller '{controllerType.Name}' must implement '{nameof(IUIController)}'.");
        }

        var instance = ActivatorUtilities.CreateInstance(services, controllerType);

        return instance is IUIController controller
            ? controller
            : throw new InvalidOperationException($"Controller type '{controllerType.Name}' must implement '{nameof(IUIController)}'.");
    }

    private async Task DisposeAbandonedScopeAsync(AsyncServiceScope scope)
    {
        try
        {
            await scope.DisposeAsync().ConfigureAwait(false);
        }
        catch (Exception exception)
        {
            Log.AbandonedScopeDisposeFailed(_logger, exception);
        }
    }

    private UIFlushOptions ResolveFlushOptions(UIRouteDefinition route)
    {
        // The scheduler's own tick by default: a fixed gate would hold a runtime back past a tick set shorter than it.
        TimeSpan interval = route.FlushInterval ?? _application.Persistence.FlushSchedulerInterval;

        UIFlushOptions options = new(interval);
        options.Validate();

        return options;
    }

    private ValueTask DisposeIfAnyAsync(IUIRuntime? runtime)
        => runtime is null ? ValueTask.CompletedTask : DisposeRuntimeAsync(runtime);

    /// <summary>Disposes a runtime the host let go of, logging a failure rather than throwing it.</summary>
    /// <remarks>
    /// A controller's or a scoped service's dispose is application code: one that throws must not keep the runtimes after it from
    /// being disposed, a session's other pages from being sent away, or the operation that let it go from finishing.
    /// </remarks>
    private async ValueTask DisposeRuntimeAsync(IUIRuntime runtime)
    {
        try
        {
            await runtime.DisposeAsync().ConfigureAwait(false);
        }
        catch (Exception exception)
        {
            Log.RuntimeDisposeFailed(_logger, exception, runtime.Handle.Instance.Navigation.Route);
        }
    }

    /// <summary>
    /// The refusal of a runtime the store found no room for: the process's where its limit is reached — reported once a burst — else
    /// the session's.
    /// </summary>
    private InvalidOperationException RefuseRuntime(int maxTotal)
    {
        var processFull = RuntimeStore.IsProcessFull(maxTotal);

        Metrics.RuntimeRefused(processFull);

        if (!processFull)
            return UIRuntimeStore.SessionFull(_application.Persistence.MaxRuntimesPerSession);

        if (Interlocked.Exchange(ref _runtimesFullReported, 1) == 0)
            Log.RuntimesFull(_logger, maxTotal);

        return UIRuntimeStore.ProcessFull(maxTotal);
    }

    private void UpdateRuntimeConnection(IUIRuntime runtime, UIHandle handle)
        => Own(runtime).UpdateConnection(handle, ResolveClientServices());

    /// <summary>A runtime the store holds as its connection updater: every one of them is a <see cref="UIRuntime"/>, which the host builds.</summary>
    private static IUIRuntimeConnectionUpdater Own(IUIRuntime runtime)
        => (IUIRuntimeConnectionUpdater)runtime;

    /// <summary>Undoes an attach that failed after the store took it, in the store and on the runtime alike.</summary>
    private void ReleaseInstance(UIRuntimeKey key, IUIRuntime runtime, string instanceId)
    {
        _ = RuntimeStore.Detach(key, instanceId, DateTime.UtcNow, out _, out _);

        Own(runtime).DetachConnection(instanceId);
    }

    /// <summary>
    /// Ends the runtimes this tab left behind on other addresses, which is what <c>PerPage</c> promises.
    /// </summary>
    private async Task DropLeftPageRuntimesAsync(UIRuntimeKey key)
    {
        if (_application.Persistence.Lifetime is not UIRuntimeLifetime.PerPage || key.WindowId is null)
            return;

        IUIRuntime[] left = RuntimeStore.RemoveWindowEntriesExcept(key.SessionId, key.WindowId, key);

        if (left.Length == 0)
            return;

        Log.DroppedLeftPageRuntimes(_logger, left.Length, key.WindowId, key.Route);

        for (var i = 0; i < left.Length; i++)
            await DisposeRuntimeAsync(left[i]).ConfigureAwait(false);
    }

    /// <summary>
    /// Ends the tab's stay on every other runtime of its session: it went to this one — a switch, a load of another page, an attach
    /// answered fresh — and the background commands it raised there are cancelled. A runtime it attaches to again keeps them.
    /// </summary>
    private void EndLeftPageStays(UIRuntimeKey key, string windowId)
    {
        UIRuntime[] others = RuntimeStore.GetSessionRuntimesHoldingStaysExcept(key.SessionId, key);

        for (var i = 0; i < others.Length; i++)
            others[i].EndPageStay(windowId);
    }

    /// <inheritdoc />
    /// <remarks>
    /// Heard as a command runs. The render's own connection is the hook's handle, as it is for a render that builds a runtime: no tab,
    /// so what the hook sends goes nowhere, while what it writes is what the render reads.
    /// </remarks>
    public Task HearBeforeRenderAsync(IUIRuntime runtime, UIViewResolution resolution, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(runtime);
        ArgumentNullException.ThrowIfNull(resolution);

        if (runtime is not IUIRuntimeConnectionUpdater updater || !updater.HasSessionMoved(resolution.Session))
            return Task.CompletedTask;

        var pageId = Guid.NewGuid().ToString("N");

        UIInstance instance = new()
        {
            Id = pageId,
            WindowId = pageId,
            Navigation = resolution.Navigation,
            PageId = pageId
        };

        return updater.NotifySessionChangedAsync(new UIHandle(instance, resolution.Session, resolution.Connection), cancellationToken);
    }

    /// <inheritdoc />
    public IUIRuntime? TryGetRenderRuntime(UIViewResolution resolution)
    {
        ArgumentNullException.ThrowIfNull(resolution);

        if (resolution.Route.ControllerType is null)
            return null;

        var identity = CreateRouteIdentity(resolution.Route, resolution.Navigation);
        var sessionId = resolution.Session.SessionId;

        // PerClient puts no tab in the key, so the render can build the exact key the client will attach to. One still
        // initializing is not read: the render then attaches to it, which waits for its start.
        if (_application.Persistence.Lifetime is UIRuntimeLifetime.PerClient)
        {
            _ = RuntimeStore.TryGetStarted(new UIRuntimeKey(sessionId, resolution.Route.Route, identity, null), out IUIRuntime? shared);
            return shared;
        }

        _ = RuntimeStore.TryGetSingle(sessionId, resolution.Route.Route, identity, out IUIRuntime? single);

        return single;
    }

    /// <inheritdoc />
    public bool DetachRuntime(string instanceId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);

        var detached = RuntimeStore.Detach(instanceId, DateTime.UtcNow, out IUIRuntime? runtime, out var activeInstances);

        if (runtime is null)
        {
            Log.RuntimeDetachSkipped(_logger, instanceId);
            return false;
        }

        Own(runtime).DetachConnection(instanceId);

        UIHandle handle = runtime.Handle;

        Log.DetachedRuntime(_logger, handle.Instance.Navigation.Route, handle.Instance.WindowId, instanceId, detached, activeInstances);

        return detached;
    }

    /// <inheritdoc />
    public bool DetachRuntime(UIHandle handle)
    {
        ArgumentNullException.ThrowIfNull(handle);

        handle.Instance.Validate();

        UIRuntimeKey key = CreateRuntimeKey(handle);

        var detached = RuntimeStore.Detach(key, handle.Instance.Id, DateTime.UtcNow, out IUIRuntime? runtime, out var activeInstances);

        if (runtime is not null)
            Own(runtime).DetachConnection(handle.Instance.Id);

        Log.DetachedRuntime(_logger, handle.Instance.Navigation.Route, handle.Instance.WindowId, handle.Instance.Id, detached, activeInstances);

        return detached;
    }

    private UIRuntimeKey CreateRuntimeKey(UIHandle handle)
    {
        ArgumentNullException.ThrowIfNull(handle);

        return CreateRuntimeKey(handle, handle.Instance.Navigation);
    }

    /// <summary>The key of the runtime <paramref name="navigation"/> names on the handle's route, from the handle's session and tab.</summary>
    private UIRuntimeKey CreateRuntimeKey(UIHandle handle, UINavigationRequest navigation)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(navigation);

        handle.Instance.Validate();

        // Uses the definition, not the route string, so a route that has gone missing still yields the same key as at attach.
        UIRouteDefinition route = _application.Routes.TryGetEntry(handle.Instance.Navigation.Route, out UIRouteEntry? entry)
            ? entry.Definition
            : new UIRouteDefinition { Route = UIRoutePath.Normalize(handle.Instance.Navigation.Route), ViewKey = handle.Instance.Navigation.Route };

        return CreateRuntimeKey(_application.Persistence, route, handle.Session.SessionId, navigation, handle.Instance.WindowId);
    }

    /// <inheritdoc />
    public bool NamesRuntimeOf(UIHandle handle, UIViewResolution resolution, string clientWindowId)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(resolution);
        ArgumentException.ThrowIfNullOrWhiteSpace(clientWindowId);

        return string.Equals(handle.Instance.WindowId, clientWindowId, StringComparison.Ordinal)
            && resolution.Route.ControllerType is not null
            && CreateRuntimeKey(handle).Equals(CreateRuntimeKey(_application.Persistence, resolution.Route, resolution.Session.SessionId, resolution.Navigation, clientWindowId));
    }
}
