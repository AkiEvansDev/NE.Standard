using System;
using System.Collections.Concurrent;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Application;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Sessions;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Controllers;

/// <summary>
/// Base class for UI controllers with recursive state tracking, command discovery and authorization.
/// </summary>
public abstract partial class UIControllerBase : RecursiveObservable, IUIController, IUIContextController
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Error, Message = "UI runtime operation '{Operation}' failed.")]
        public static partial void RuntimeOperationFailed(ILogger logger, Exception exception, string operation);

        [LoggerMessage(EventId = 2, Level = LogLevel.Error, Message = "UI controller change notifier failed.")]
        public static partial void ChangeNotifierFailed(ILogger logger, Exception exception);
    }

    private static readonly ConcurrentDictionary<Type, FrozenDictionary<string, UICommandDescriptor>> CommandCache = new();

    private readonly Lock _changesLock = new();
    private readonly List<RecursiveChange> _changes = [];

    private UIContext? _context;
    private Action<RecursiveChange>? _changeNotifier;

    /// <inheritdoc />
    public UIContext Context => _context ?? throw new InvalidOperationException("Controller context is not attached.");

    /// <summary>
    /// Gets whether the controller has completed initialization.
    /// </summary>
    protected bool IsInitialized { get; private set; }

    /// <summary>
    /// Gets whether the controller has been disposed.
    /// </summary>
    protected bool IsDisposed { get; private set; }

    /// <inheritdoc />
    public void AttachContext(UIContext context)
    {
        ThrowIfDisposed();
        ArgumentNullException.ThrowIfNull(context);

        if (_context is not null)
            throw new InvalidOperationException("Controller context is already attached.");

        context.Validate();

        _context = context;

        ResetNotifier();
    }

    /// <inheritdoc />
    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureContextAttached();

        if (IsInitialized)
            throw new InvalidOperationException("Controller is already initialized.");

        await OnInitializeAsync(cancellationToken).ConfigureAwait(false);

        IsInitialized = true;
        ResetNotifier();
    }

    /// <summary>
    /// Runs controller-specific initialization logic after the runtime context is attached.
    /// </summary>
    protected virtual Task OnInitializeAsync(CancellationToken cancellationToken)
        => Task.CompletedTask;

    /// <inheritdoc />
    public int DrainChanges(ICollection<RecursiveChange> destination)
    {
        ThrowIfDisposed();
        ArgumentNullException.ThrowIfNull(destination);

        lock (_changesLock)
        {
            var count = _changes.Count;

            for (var i = 0; i < _changes.Count; i++)
                destination.Add(_changes[i]);

            _changes.Clear();

            return count;
        }
    }

    /// <inheritdoc />
    public void SetChangeNotifier(Action<RecursiveChange>? notify)
    {
        ThrowIfDisposed();

        lock (_changesLock)
        {
            _changeNotifier = notify;

            if (notify is not null)
                _changes.Clear();
        }

        ResetNotifier();
    }

    /// <inheritdoc />
    public IUICommandMetadata GetCommandMetadata(string command)
    {
        ThrowIfDisposed();
        EnsureContextAttached();

        ArgumentException.ThrowIfNullOrWhiteSpace(command);

        FrozenDictionary<string, UICommandDescriptor> commands = CommandCache.GetOrAdd(GetType(), BuildCommandCache);

        if (!commands.TryGetValue(command, out UICommandDescriptor? descriptor))
            throw new InvalidOperationException($"Command '{command}' was not found on controller '{GetType().Name}'.");

        return descriptor;
    }

    /// <inheritdoc />
    public async Task<UICommandResult> ExecuteCommandAsync(string command, IReadOnlyDictionary<string, object?>? parameters, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureContextAttached();

        ArgumentException.ThrowIfNullOrWhiteSpace(command);

        FrozenDictionary<string, UICommandDescriptor> commands = CommandCache.GetOrAdd(GetType(), BuildCommandCache);

        if (!commands.TryGetValue(command, out UICommandDescriptor? descriptor))
            throw new InvalidOperationException($"Command '{command}' was not found on controller '{GetType().Name}'.");

        IUICommandFilter[] globalFilters = Context.Services.GetRequiredService<UIApplication>().CommandFilters;

        // The pipeline is only built when there is something in it. Authorization is the same call either way,
        // so there is one implementation of "is this allowed" and the fast path is what it always was.
        if (globalFilters.Length == 0 && descriptor.Filters.Length == 0)
        {
            await EnsureCommandAuthorizedAsync(descriptor, cancellationToken).ConfigureAwait(false);

            return await descriptor.Invoker.Invoke(this, parameters, cancellationToken).ConfigureAwait(false);
        }

        return await ExecuteFilteredCommandAsync(descriptor, globalFilters, parameters, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Runs the command inside its filter chain: the built-in authorization check, then the application's
    /// global filters, then the ones attached to the controller and the command.
    /// </summary>
    /// <remarks>
    /// The authorization filter is pinned outermost (<see cref="int.MinValue"/>) rather than merely first in
    /// the list, and that is a security property, not tidiness: an application filter running before it could
    /// short-circuit with a successful result and never reach the check. The cost is that a filter cannot wrap
    /// the refusal either — translating one into something friendlier belongs in the failure notification, not
    /// here.
    /// </remarks>
    private async Task<UICommandResult> ExecuteFilteredCommandAsync(UICommandDescriptor descriptor, IUICommandFilter[] globalFilters, IReadOnlyDictionary<string, object?>? parameters, CancellationToken cancellationToken)
    {
        UICommandFilterContext context = new(
            descriptor,
            parameters ?? FrozenDictionary<string, object?>.Empty,
            Context.Handle,
            Context.Route,
            Context.Services
        );

        IUICommandFilter[] filters =
        [
            new AuthorizationCommandFilter(this),
            .. globalFilters,
            .. descriptor.Filters
        ];

        Func<Task> next = async () =>
        {
            context.Result = await descriptor.Invoker.Invoke(this, parameters, cancellationToken).ConfigureAwait(false);
            context.MarkInvoked();
        };

        for (var i = filters.Length - 1; i >= 0; i--)
        {
            IUICommandFilter filter = filters[i];
            Func<Task> inner = next;

            next = () => filter.InvokeAsync(context, inner);
        }

        await next().ConfigureAwait(false);

        return context.Result
            ?? throw new InvalidOperationException($"A command filter short-circuited '{descriptor.Name}' without leaving a result.");
    }

    /// <summary>
    /// The command access check as the first filter rather than a special case beside the pipeline, so there is
    /// one place where "is this command allowed" is decided.
    /// </summary>
    private sealed class AuthorizationCommandFilter(UIControllerBase controller) : IUICommandFilter
    {
        public int Order => int.MinValue;

        public async Task InvokeAsync(UICommandFilterContext context, Func<Task> next)
        {
            ArgumentNullException.ThrowIfNull(context);
            ArgumentNullException.ThrowIfNull(next);

            await controller.EnsureCommandAuthorizedAsync((UICommandDescriptor)context.Command, CancellationToken.None).ConfigureAwait(false);

            await next().ConfigureAwait(false);
        }
    }

    private static FrozenDictionary<string, UICommandDescriptor> BuildCommandCache(Type controllerType)
    {
        const BindingFlags Flags = BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.DeclaredOnly;

        Dictionary<string, UICommandDescriptor> commands = new(StringComparer.Ordinal);
        Dictionary<string, Type> declaringTypes = new(StringComparer.Ordinal);

        for (Type? current = controllerType; current is not null && current != typeof(UIControllerBase) && current != typeof(object); current = current.BaseType)
        {
            MethodInfo[] methods = current.GetMethods(Flags);

            for (var i = 0; i < methods.Length; i++)
            {
                MethodInfo method = methods[i];

                if (method.IsSpecialName)
                    continue;

                UICommandAttribute? attribute = method.GetCustomAttribute<UICommandAttribute>(inherit: true);

                if (attribute is null)
                    continue;

                var commandName = string.IsNullOrWhiteSpace(attribute.Name)
                    ? method.Name
                    : attribute.Name;

                // The walk runs most-derived first, so a name already taken by a type further down is an
                // override or a `new` shadow of the same command — C# resolves that call to the derived member
                // and so does this. Reading the attribute with inherit:true means an override sees the base's
                // attribute too, which is why this has to be tolerated rather than reported. Only two
                // declarations on one type are a genuine collision.
                if (declaringTypes.TryGetValue(commandName, out Type? owner))
                {
                    if (!ReferenceEquals(owner, current))
                        continue;

                    throw new InvalidOperationException($"Command '{commandName}' is declared more than once on controller '{current.Name}'.");
                }

                commands.Add(commandName, new UICommandDescriptor
                {
                    Name = commandName,
                    Invoker = UICommandInvoker.Create(controllerType, method, commandName),
                    AllowAnonymous = ResolveAllowAnonymous(controllerType, method),
                    AccessRules = BuildAccessRules(controllerType, method),
                    Filters = ReadCommandFilters(controllerType, method),
                    ConcurrencyMode = attribute.ConcurrencyMode
                });

                declaringTypes.Add(commandName, current);
            }
        }

        return commands.ToFrozenDictionary(StringComparer.Ordinal);
    }

    /// <summary>
    /// An explicit attribute on the command or its controller always wins; a command carrying neither returns
    /// <see langword="null"/> and takes the answer from the route it runs on.
    /// </summary>
    /// <remarks>
    /// Mirrors <c>UIRouteDefinitionBuilder.ResolveAllowAnonymous</c>. Deferred rather than decided here because
    /// the command cache is static per controller type, while the answer belongs to the route — the same
    /// controller can sit behind routes whose views are annotated differently.
    /// </remarks>
    private static bool? ResolveAllowAnonymous(Type controllerType, MethodInfo method)
    {
        if (controllerType.IsDefined(typeof(UIAllowAnonymousAttribute), inherit: true) || method.IsDefined(typeof(UIAllowAnonymousAttribute), inherit: true))
            return true;

        if (controllerType.IsDefined(typeof(UIAuthorizeAttribute), inherit: true) || method.IsDefined(typeof(UIAuthorizeAttribute), inherit: true))
            return false;

        return null;
    }

    /// <summary>
    /// Collects the filters attached to the command, controller first then method, ordered by
    /// <see cref="IUICommandFilter.Order"/> — a stable sort, so equal orders keep that attachment order.
    /// </summary>
    private static IUICommandFilter[] ReadCommandFilters(Type controllerType, MethodInfo method)
    {
        List<IUICommandFilter> filters = [];

        AddCommandFilters(filters, controllerType.GetCustomAttributes(inherit: true));
        AddCommandFilters(filters, method.GetCustomAttributes(inherit: true));

        return filters.Count == 0
            ? []
            : [.. filters.OrderBy(static filter => filter.Order)];
    }

    private static void AddCommandFilters(List<IUICommandFilter> filters, object[] attributes)
    {
        for (var i = 0; i < attributes.Length; i++)
        {
            if (attributes[i] is IUICommandFilter filter)
                filters.Add(filter);
            else if (attributes[i] is IUICommandFilterFactory factory)
                filters.Add(new UICommandFilterFactoryAdapter(factory));
        }
    }

    private static UIAccessRule[] BuildAccessRules(Type controllerType, MethodInfo method)
        => UIAccessRule.FromAttributes(
            controllerType.GetCustomAttributes<UIAuthorizeAttribute>(inherit: true),
            method.GetCustomAttributes<UIAuthorizeAttribute>(inherit: true)
        );

    /// <summary>
    /// Checks a command against the session as it is <em>now</em>, not as it was when this connection attached.
    /// </summary>
    /// <remarks>
    /// The handle's session is a snapshot refreshed only on attach, so a sign-out or a revoked role would keep
    /// working on an already-open tab until the page reloaded — the direction of that mistake grants access
    /// rather than denying it. The store is therefore the authority here, and a session it no longer holds is
    /// refused. An anonymous command never reads it, so the common path costs nothing.
    /// </remarks>
    private async ValueTask EnsureCommandAuthorizedAsync(UICommandDescriptor command, CancellationToken cancellationToken)
    {
        // A command with no attribute of its own inherits the route's answer, which has already folded in the
        // view, the controller and the application's DefaultPolicy — so one setting governs pages and the
        // commands on them, instead of commands silently defaulting to closed on an open application.
        if (command.AllowAnonymous ?? Context.Route.AllowAnonymous)
            return;

        IUserSessionStore store = Context.Services.GetRequiredService<IUserSessionStore>();
        UserSessionState session = await store.TryGetAsync(Context.Handle.Session.SessionId, cancellationToken).ConfigureAwait(false)
            ?? throw new UnauthorizedAccessException($"Command '{command.Name}' has no live session; it was signed out or has expired.");

        if (!session.IsAuthenticated)
            throw new UnauthorizedAccessException($"Command '{command.Name}' requires authenticated session.");

        if (command.AccessRules.Length == 0)
            return;

        IAuthorizationService authorization = Context.Services.GetRequiredService<IAuthorizationService>();

        if (!authorization.IsAuthorized(new UserSessionContext(session.SessionId, session.Language, session.ThemeMode, session.IsAuthenticated, session.UserId, session.Roles, session.Permissions), command.AccessRules))
            throw new UIForbiddenAccessException($"Command '{command.Name}' is not authorized.");
    }

    /// <inheritdoc />
    public virtual Task<RuntimeExceptionResult> HandleRuntimeExceptionAsync(RuntimeExceptionContext context, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureContextAttached();

        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(context.Exception);
        ArgumentException.ThrowIfNullOrWhiteSpace(context.Operation);

        Log.RuntimeOperationFailed(Context.Logger, context.Exception, context.Operation);

        return Task.FromResult(RuntimeExceptionResult.Empty);
    }

    /// <inheritdoc />
    protected override void OnNotify(RecursiveChange change)
    {
        ArgumentNullException.ThrowIfNull(change);

        Action<RecursiveChange>? notifier;

        lock (_changesLock)
        {
            notifier = _changeNotifier;

            if (notifier is null)
            {
                _changes.Add(change);
                return;
            }
        }

        try
        {
            notifier(change);
        }
        catch (Exception exception)
        {
            TryLogChangeNotifierFailure(exception);

            // Buffered unconditionally: the notifier is still installed after it throws, so a "re-buffer only
            // if nobody is listening" guard would drop the change outright and leave the client silently out
            // of sync. The next drain ships it instead.
            lock (_changesLock)
                _changes.Add(change);
        }
    }

    private void TryLogChangeNotifierFailure(Exception exception)
    {
        try
        {
            if (_context is not null)
                Log.ChangeNotifierFailed(_context.Logger, exception);
        }
        catch { }
    }

    /// <inheritdoc />
    public void Dispose()
    {
        Dispose(disposing: true);
        GC.SuppressFinalize(this);
    }

    /// <summary>
    /// Releases controller resources.
    /// </summary>
    protected virtual void Dispose(bool disposing)
    {
        if (IsDisposed)
            return;

        if (disposing)
        {
            SetChangeNotifier(null);
            OnDispose();
        }

        IsDisposed = true;
    }

    /// <summary>
    /// Releases managed resources owned by derived controllers.
    /// </summary>
    protected virtual void OnDispose() { }

    /// <summary>
    /// Throws when the controller has been disposed.
    /// </summary>
    protected void ThrowIfDisposed()
        => ObjectDisposedException.ThrowIf(IsDisposed, this);

    /// <summary>
    /// Throws when the runtime context is not attached.
    /// </summary>
    protected void EnsureContextAttached()
    {
        if (_context is null)
            throw new InvalidOperationException("Controller context is not attached.");
    }
}
