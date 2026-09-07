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
    public bool HasPendingChanges
    {
        get
        {
            lock (_changesLock)
                return _changes.Count > 0;
        }
    }

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

        // Fast path when there are no filters at all; authorization still runs through the same check either way.
        if (globalFilters.Length == 0 && descriptor.Filters.Length == 0)
        {
            await EnsureCommandAuthorizedAsync(descriptor, cancellationToken).ConfigureAwait(false);

            return await descriptor.Invoker.Invoke(this, parameters, cancellationToken).ConfigureAwait(false);
        }

        return await ExecuteFilteredCommandAsync(descriptor, globalFilters, parameters, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Runs the command through its filter chain: authorization, then global filters, then the controller's and command's own filters.
    /// </summary>
    /// <remarks>
    /// The authorization filter is pinned outermost (<see cref="int.MinValue"/>) so no other filter can bypass it.
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
    /// Runs the command authorization check as the first filter in the pipeline.
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

                // Most-derived first: a base-type name is an override/shadow, not a collision; only two declarations on one type collide.
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
    /// An explicit attribute on the command or its controller wins; otherwise returns <see langword="null"/> to defer to the route.
    /// </summary>
    private static bool? ResolveAllowAnonymous(Type controllerType, MethodInfo method)
    {
        if (controllerType.IsDefined(typeof(UIAllowAnonymousAttribute), inherit: true) || method.IsDefined(typeof(UIAllowAnonymousAttribute), inherit: true))
            return true;

        if (controllerType.IsDefined(typeof(UIAuthorizeAttribute), inherit: true) || method.IsDefined(typeof(UIAuthorizeAttribute), inherit: true))
            return false;

        return null;
    }

    /// <summary>
    /// Collects the filters attached to the command, controller first then method, ordered by <see cref="IUICommandFilter.Order"/>.
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
    /// Checks a command against the current session, not the snapshot taken when the connection attached.
    /// </summary>
    /// <remarks>
    /// A revoked or signed-out session must be refused immediately, not once an already-open tab reloads.
    /// </remarks>
    private async ValueTask EnsureCommandAuthorizedAsync(UICommandDescriptor command, CancellationToken cancellationToken)
    {
        // No attribute of its own: inherit the route's resolved answer (view + controller + DefaultPolicy) instead of defaulting closed.
        if (command.AllowAnonymous ?? Context.Route.AllowAnonymous)
            return;

        IUserSessionStore store = Context.Services.GetRequiredService<IUserSessionStore>();
        UserSessionState session = await store.TryGetAsync(Context.Handle.Session.SessionId, cancellationToken).ConfigureAwait(false)
            ?? throw new UnauthorizedAccessException($"Command '{command.Name}' has no live session; it was signed out or has expired.");

        if (!session.IsAuthenticated)
            throw new UnauthorizedAccessException($"Command '{command.Name}' requires authenticated session.");

        if (command.AccessRules.Length == 0)
            return;

        IUIAuthorizationService authorization = Context.Services.GetRequiredService<IUIAuthorizationService>();

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

            // Buffered unconditionally: the notifier is still installed after throwing, so skipping the buffer here would drop the change.
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
