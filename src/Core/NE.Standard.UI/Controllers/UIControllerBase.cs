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
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Application;
using NE.Standard.UI.Filters;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Security;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Filters;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Controllers;

/// <summary>
/// Base class for UI controllers with recursive state tracking, command discovery and authorization.
/// </summary>
public abstract partial class UIControllerBase : RecursiveObservable, IUIController, IUIContextController, IUIControllerLifecycle
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Error, Message = "UI runtime operation '{Operation}' failed on route '{Route}', tab '{ClientWindowId}', user '{UserId}'.")]
        public static partial void RuntimeOperationFailed(ILogger logger, Exception exception, string operation, string route, string clientWindowId, string? userId);

        [LoggerMessage(EventId = 3, Level = LogLevel.Debug, Message = "UI runtime operation '{Operation}' on route '{Route}' was refused to user '{UserId}': {Reason}")]
        public static partial void RuntimeOperationRefused(ILogger logger, string operation, string route, string? userId, string reason);

        [LoggerMessage(EventId = 2, Level = LogLevel.Error, Message = "UI controller change notifier failed.")]
        public static partial void ChangeNotifierFailed(ILogger logger, Exception exception);
    }

    private static readonly ConcurrentDictionary<Type, FrozenDictionary<string, UICommandDescriptor>> CommandCache = new();

    // The filters each controller type declares on itself, for the framework's own commands, which no method declares.
    private static readonly ConcurrentDictionary<Type, IUICommandFilter[]> ControllerFilterCache = new();

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

    /// <summary>
    /// Gets whether a page is attached to this controller's runtime now — a connection someone looks at.
    /// </summary>
    public bool HasViewers => _context is not null && _context.Runtime.HasViewers;

    /// <summary>
    /// Gets whether a page attached to this controller's runtime is on screen now, as its page last reported — where none is, a
    /// system notification reaches the reader and a toast would not.
    /// </summary>
    public bool HasVisibleViewers => _context is not null && _context.Runtime.HasVisibleViewers;

    /// <summary>
    /// Runs with the navigation a page shows the runtime at — the place to read a parameter that shapes what the page shows, first
    /// paint included.
    /// </summary>
    /// <remarks>
    /// Runs for the page render that builds the runtime, after <see cref="OnInitializeAsync"/> and before the render reads the values it
    /// paints; and for every attach, before <see cref="OnAttachedAsync"/> and in the same turn, so the attach is answered with what
    /// both wrote. The attach of the tab whose own render built the runtime skips it, the render having run it with that navigation —
    /// unless another page's navigation ran since. A render that paints a runtime already running (a kept one) does not run it: that
    /// runtime may be another tab's; the attach that follows does. Runs in a command's turn, between exclusive commands — at an attach or
    /// a render as posted work does; going back or forward within the page as an exclusive command does. Either way outside the runtime's
    /// lock, as a command's body, so it may await <c>Context.Runtime.InvokeAsync</c>.
    /// <see cref="UIContext.Handle"/> is the page's connection, the render's own in a render.
    /// </remarks>
    protected virtual Task OnNavigatedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
        => Task.CompletedTask;

    /// <summary>Runs each time a connection attaches — a new tab, a reload, a navigation that finds the runtime again.</summary>
    /// <remarks>
    /// Given the navigation it arrived with. Runs as posted work does, between exclusive commands as a command's body runs, after the first attach's
    /// <see cref="OnInitializeAsync"/> and after <see cref="OnNavigatedAsync"/>; what it writes is in the page the attach is answered
    /// with, but not in the page the render painted — a parameter that shapes the first paint belongs in <see cref="OnNavigatedAsync"/>.
    /// <see cref="UIContext.Handle"/> is the attaching connection.
    /// </remarks>
    protected virtual Task OnAttachedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
        => Task.CompletedTask;

    /// <summary>
    /// Runs each time a connection detaches — a tab closed, reloaded or navigated away; <see cref="HasViewers"/> already counts
    /// it gone.
    /// </summary>
    /// <remarks>
    /// Queued and run as posted work is, between exclusive commands as a command's body runs, since a closing connection waits for
    /// nobody; what it writes flushes to the pages still attached.
    /// </remarks>
    protected virtual Task OnDetachedAsync(CancellationToken cancellationToken)
        => Task.CompletedTask;

    /// <summary>Runs when the session moves to another language, so text the controller composed itself can be composed again.</summary>
    /// <remarks>
    /// Once per change, wherever it was made. Raised by a command's <see cref="UIContext.UpdateSessionAsync"/> — inline, before the
    /// update returns — or by the page's language switcher, as a command runs; a switch made on another of the session's pages
    /// reaches this runtime as a command runs where a page shows it, and where none did, before the next page render paints it or at
    /// its next attach, before <see cref="OnNavigatedAsync"/>. <see cref="UIContext.Handle"/> is a connection of this runtime (a
    /// render's own, before a paint), its session already in the new language, and
    /// <paramref name="previousLanguage"/> the one the controller last heard. Bound keys and phrases need nothing: the page
    /// re-translates them.
    /// </remarks>
    protected virtual Task OnLanguageChangedAsync(string previousLanguage, CancellationToken cancellationToken)
        => Task.CompletedTask;

    /// <summary>
    /// Runs when the session moves to another theme mode — the page's theme switcher, a <c>SetThemeEffect</c>, or a command's
    /// <see cref="UIContext.UpdateSessionAsync"/>.
    /// </summary>
    /// <remarks>
    /// Reached as <see cref="OnLanguageChangedAsync"/> is, once per change; <see cref="UIContext.Handle"/>'s session is already in the
    /// new mode (<see langword="null"/> following the platform's preference), <paramref name="previousMode"/> the one the controller
    /// last heard. The place to keep the mode on the reader's account, as the language hook keeps the language; the way back is the
    /// sign-in command writing the account's mode into the session (<c>UpdateSessionAsync</c>, beside its language), which the
    /// navigation a sign-in ends in renders.
    /// </remarks>
    protected virtual Task OnThemeChangedAsync(UIThemeMode? previousMode, CancellationToken cancellationToken)
        => Task.CompletedTask;

    /// <summary>
    /// Runs when a page of this runtime reports another notification permission — the reader answered a
    /// <c>RequestNotificationPermissionEffect</c>, or changed it in the browser's settings.
    /// </summary>
    /// <remarks>
    /// Run as posted work is, between exclusive commands, so the page's report waits for no turn; <see cref="UIContext.Handle"/> is
    /// that page's connection, and <see cref="UIContext.NotificationPermission"/> what it reported last. The permission a page attaches with is read there, in
    /// <see cref="OnAttachedAsync"/>: this runs only for a change after it.
    /// </remarks>
    protected virtual Task OnNotificationPermissionChangedAsync(UINotificationPermission previous, CancellationToken cancellationToken)
        => Task.CompletedTask;

    /// <summary>
    /// Runs when <see cref="HasVisibleViewers"/> flips: a page of this runtime came on screen where none was, or the last one left
    /// it — the moment to mark read what arrived while nobody looked.
    /// </summary>
    /// <remarks>
    /// Per runtime, not per tab: one tab of it giving way to another on screen is no flip. Raised by a page's report, by an attach (in
    /// its turn, after <see cref="OnAttachedAsync"/>) and by a detach, and run as posted work is, between exclusive commands; a flip
    /// and its flip back before it ran reach it not at all. <paramref name="wasVisible"/> is what it last heard, and
    /// <see cref="HasVisibleViewers"/> already the new state; <see cref="UIContext.Handle"/> is the page that reported or attached.
    /// </remarks>
    protected virtual Task OnVisibilityChangedAsync(bool wasVisible, CancellationToken cancellationToken)
        => Task.CompletedTask;

    /// <summary>Gets whether the page holds work its reader has not saved; the controller sets and clears it itself.</summary>
    /// <remarks>
    /// Part of the page's state, per runtime: it reaches the page with its first render, at every attach and as it changes. While it is
    /// true, a leave the page starts — a press on one of its links, a menu's entry or a breadcrumb, or a <c>NavigateEffect</c> — asks
    /// <see cref="OnLeaveRequestedAsync"/> instead of leaving, and closing or reloading the tab asks the browser's own question. A command
    /// that clears it and answers with a <c>NavigateEffect</c> leaves without being asked again.
    /// </remarks>
    [RecursiveMember]
    public partial bool HoldsUnsavedWork { get; protected set; }

    /// <summary>Lets go of the page's unsaved work: its session ended, so nothing the page holds can be saved any more.</summary>
    internal void ReleaseUnsavedWork()
        => HoldsUnsavedWork = false;

    /// <summary>Runs when the reader starts to leave a page that holds unsaved work: what the answer's effects do is what happens.</summary>
    /// <remarks>
    /// <paramref name="target"/> is the address of this site the reader leaves for, as the page named it. The effects run on the page
    /// that asked, as a command's do — the page's own dialog (Save / Don't save / Cancel), say, whose commands clear
    /// <see cref="HoldsUnsavedWork"/> and answer <c>new NavigateEffect(target)</c>; a <c>NavigateEffect</c> this answers itself is
    /// followed without asking again. Unless overridden, the framework's own dialog asks "Leave without saving?"
    /// (<see cref="ConfirmLeaveEffect"/>). Runs in a command's turn, as an exclusive command does; <see cref="UIContext.Handle"/> is the
    /// asking page's connection.
    /// </remarks>
    protected virtual Task<UICommandResult> OnLeaveRequestedAsync(string target, CancellationToken cancellationToken)
        => Task.FromResult(UICommandResult.Ok([new ConfirmLeaveEffect(target)]));

    Task IUIControllerLifecycle.NavigatedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        ThrowIfDisposed();
        ArgumentNullException.ThrowIfNull(navigation);

        return OnNavigatedAsync(navigation, cancellationToken);
    }

    Task IUIControllerLifecycle.AttachedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        ThrowIfDisposed();
        ArgumentNullException.ThrowIfNull(navigation);

        return OnAttachedAsync(navigation, cancellationToken);
    }

    Task IUIControllerLifecycle.DetachedAsync(CancellationToken cancellationToken)
    {
        ThrowIfDisposed();

        return OnDetachedAsync(cancellationToken);
    }

    Task IUIControllerLifecycle.LanguageChangedAsync(string previousLanguage, CancellationToken cancellationToken)
    {
        ThrowIfDisposed();
        ArgumentException.ThrowIfNullOrWhiteSpace(previousLanguage);

        return OnLanguageChangedAsync(previousLanguage, cancellationToken);
    }

    Task IUIControllerLifecycle.ThemeChangedAsync(UIThemeMode? previousMode, CancellationToken cancellationToken)
    {
        ThrowIfDisposed();

        return OnThemeChangedAsync(previousMode, cancellationToken);
    }

    Task IUIControllerLifecycle.NotificationPermissionChangedAsync(UINotificationPermission previous, CancellationToken cancellationToken)
    {
        ThrowIfDisposed();

        return OnNotificationPermissionChangedAsync(previous, cancellationToken);
    }

    Task IUIControllerLifecycle.VisibilityChangedAsync(bool wasVisible, CancellationToken cancellationToken)
    {
        ThrowIfDisposed();

        return OnVisibilityChangedAsync(wasVisible, cancellationToken);
    }

    Task<UICommandResult> IUIControllerLifecycle.LeaveRequestedAsync(string target, CancellationToken cancellationToken)
    {
        ThrowIfDisposed();
        ArgumentException.ThrowIfNullOrWhiteSpace(target);

        return OnLeaveRequestedAsync(target, cancellationToken);
    }

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

    /// <summary>Whether a controller type declares the named command, its commands read (and a malformed one refused) once per type.</summary>
    internal static bool DeclaresCommand(Type controllerType, string command)
        => CommandsOf(controllerType).ContainsKey(command);

    /// <summary>The command a controller type declares under the name, or null; the view compiler checks an event's arguments against it.</summary>
    internal static UICommandDescriptor? FindCommand(Type controllerType, string command)
        => CommandsOf(controllerType).GetValueOrDefault(command);

    /// <summary>The commands a controller type declares, read once per type.</summary>
    private static FrozenDictionary<string, UICommandDescriptor> CommandsOf(Type controllerType)
        => CommandCache.GetOrAdd(controllerType, BuildCommandCache);

    /// <summary>Whether the element pressed to run the command shows it is working (<see cref="UICommandAttribute.ShowsPending"/>); the view compiler asks.</summary>
    internal static bool ShowsPending(Type controllerType, string command)
        => !CommandsOf(controllerType).TryGetValue(command, out UICommandDescriptor? descriptor) || descriptor.ShowsPending;

    /// <inheritdoc />
    public IUICommandMetadata GetCommandMetadata(string command)
    {
        ThrowIfDisposed();
        EnsureContextAttached();

        return GetRequiredDescriptor(command);
    }

    /// <summary>The descriptor of a command this controller declares; one it does not is refused.</summary>
    private UICommandDescriptor GetRequiredDescriptor(string command)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(command);

        return CommandsOf(GetType()).TryGetValue(command, out UICommandDescriptor? descriptor)
            ? descriptor
            : throw new InvalidOperationException($"Command '{command}' was not found on controller '{GetType().Name}'.");
    }

    /// <inheritdoc />
    public async Task<UICommandResult> ExecuteCommandAsync(string command, IReadOnlyDictionary<string, object?>? parameters, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureContextAttached();

        UICommandDescriptor descriptor = GetRequiredDescriptor(command);

        IUICommandFilter[] globalFilters = Context.Services.GetRequiredService<UIApplication>().CommandFilters;

        // Fast path when there are no filters at all; authorization still runs through the same check either way.
        if (globalFilters.Length == 0 && descriptor.Filters.Length == 0)
        {
            await EnsureCommandAuthorizedAsync(descriptor, cancellationToken).ConfigureAwait(false);

            return await descriptor.Invoker.Invoke(this, parameters, cancellationToken).ConfigureAwait(false);
        }

        return await ExecuteFilteredCommandAsync(descriptor, descriptor.OrderedFilters(globalFilters), parameters, token => descriptor.Invoker.Invoke(this, parameters, token), cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Runs a command the framework raises for itself (<c>UIBuiltInCommands</c>: a tab's move or pin) as a declared command runs: its
    /// session checked against the route, through the application's command filters and the controller's own; its body is the
    /// framework's.
    /// </summary>
    /// <remarks>No method declares it, so no method's filter holds; one the controller declares holds for every command it runs.</remarks>
    internal async Task<UICommandResult> ExecuteBuiltInCommandAsync(IUICommandMetadata command, IReadOnlyDictionary<string, object?> parameters, Func<CancellationToken, Task<UICommandResult>> body, CancellationToken cancellationToken)
    {
        ThrowIfDisposed();
        EnsureContextAttached();

        ArgumentNullException.ThrowIfNull(command);
        ArgumentNullException.ThrowIfNull(body);

        IUICommandFilter[] globalFilters = Context.Services.GetRequiredService<UIApplication>().CommandFilters;
        IUICommandFilter[] controllerFilters = ControllerFilterCache.GetOrAdd(GetType(), ReadControllerFilters);

        if (globalFilters.Length == 0 && controllerFilters.Length == 0)
        {
            await EnsureCommandAuthorizedAsync(command, cancellationToken).ConfigureAwait(false);

            return await body(cancellationToken).ConfigureAwait(false);
        }

        // A stable sort, as a declared command's run orders them: filters of one order keep global then controller.
        return await ExecuteFilteredCommandAsync(command, [.. globalFilters.Concat(controllerFilters).OrderBy(static filter => filter.Order)], parameters, body, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>The filters a controller type declares on itself, ordered: the ones every command of it passes.</summary>
    private static IUICommandFilter[] ReadControllerFilters(Type controllerType)
    {
        List<IUICommandFilter> filters = [];

        AddCommandFilters(filters, controllerType.GetCustomAttributes(inherit: true));

        return filters.Count == 0
            ? []
            : [.. filters.OrderBy(static filter => filter.Order)];
    }

    /// <summary>
    /// Runs the command through its filter chain: ordered by <see cref="IUIFilter{TContext}.Order"/>, ties broken global then
    /// controller then command.
    /// </summary>
    /// <remarks>The authorization filter is pinned outermost so no other filter can bypass it.</remarks>
    private async Task<UICommandResult> ExecuteFilteredCommandAsync(IUICommandMetadata command, IUICommandFilter[] filters, IReadOnlyDictionary<string, object?>? parameters, Func<CancellationToken, Task<UICommandResult>> body, CancellationToken cancellationToken)
    {
        UICommandFilterContext context = new(command, parameters ?? FrozenDictionary<string, object?>.Empty, Context.Handle, Context.Route, Context.Services)
        {
            CancellationToken = cancellationToken
        };

        Func<Task> chain = UIFilterChain.Fold(filters, context, async () =>
        {
            context.Result = await body(cancellationToken).ConfigureAwait(false);
            context.MarkInvoked();
        });

        await new AuthorizationCommandFilter(this).InvokeAsync(context, chain).ConfigureAwait(false);

        return context.Result
            ?? throw new InvalidOperationException($"A command filter short-circuited '{command.Name}' without leaving a result.");
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

            await controller.EnsureCommandAuthorizedAsync(context.Command, context.CancellationToken).ConfigureAwait(false);

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
                    AllowAnonymous = ResolveAllowAnonymous(method, commandName),
                    AccessRules = BuildAccessRules(method),
                    Filters = ReadCommandFilters(controllerType, method),
                    ConcurrencyMode = attribute.ConcurrencyMode,
                    ShowsPending = attribute.ShowsPending,
                    MaxConcurrent = attribute.MaxConcurrent >= 1
                        ? attribute.MaxConcurrent
                        : throw new InvalidOperationException($"Command '{commandName}' on controller '{current.Name}' allows {attribute.MaxConcurrent} concurrent runs; at least one is needed.")
                });

                declaringTypes.Add(commandName, current);
            }
        }

        return commands.ToFrozenDictionary(StringComparer.Ordinal);
    }

    /// <summary>
    /// An explicit attribute on the command itself wins; otherwise returns <see langword="null"/> to defer to the route.
    /// </summary>
    /// <remarks>
    /// The controller's own attributes reach the command through the route, which folds them in: read here as well, they would
    /// override a route that <c>Require</c> or <c>AllowAnonymous</c> settled the other way.
    /// </remarks>
    private static bool? ResolveAllowAnonymous(MethodInfo method, string commandName)
    {
        EnsureAuthorizeNotOpened(method, commandName);

        if (method.IsDefined(typeof(UIAllowAnonymousAttribute), inherit: true))
            return true;

        if (method.IsDefined(typeof(UIAuthorizeAttribute), inherit: true))
            return false;

        return null;
    }

    /// <summary>
    /// Refuses a command whose <c>[UIAuthorize]</c> a <c>[UIAllowAnonymous]</c> of its own declaration or of one it overrides would
    /// quietly open: the anonymous one wins, so it would run for anyone. One an override declares above a base's <c>[UIAuthorize]</c>
    /// opens it on purpose and stands.
    /// </summary>
    private static void EnsureAuthorizeNotOpened(MethodInfo method, string commandName)
    {
        if (!UIAuthorizeOpening.TryFind(method, OverriddenMethod, out MethodInfo? authorizing, out MethodInfo? level))
            return;

        var message = ReferenceEquals(authorizing, level)
            ? $"Command '{commandName}' on '{level.DeclaringType?.FullName}' carries both [UIAuthorize] and [UIAllowAnonymous]; the anonymous one wins and it would run for anyone. Keep one."
            : $"Command '{commandName}' carries [UIAuthorize] on '{authorizing.DeclaringType?.FullName}.{authorizing.Name}', but [UIAllowAnonymous] on the declaration it overrides, '{level.DeclaringType?.FullName}.{level.Name}', wins and it would run for anyone. Remove one, or declare [UIAllowAnonymous] on the override that means it.";

        throw new InvalidOperationException(message);
    }

    /// <summary>The declaration an override overrides, the next one up its chain; null for a method that overrides nothing.</summary>
    private static MethodInfo? OverriddenMethod(MethodInfo method)
    {
        // A method that starts its own slot — not virtual, or new — is its own base definition.
        if (method.GetBaseDefinition().DeclaringType == method.DeclaringType)
            return null;

        const BindingFlags DeclaredInstance = BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.DeclaredOnly;
        Type[] parameters = Array.ConvertAll(method.GetParameters(), static parameter => parameter.ParameterType);

        for (Type? type = method.DeclaringType?.BaseType; type is not null; type = type.BaseType)
        {
            if (type.GetMethod(method.Name, DeclaredInstance, binder: null, parameters, modifiers: null) is { IsVirtual: true } overridden)
                return overridden;
        }

        return null;
    }

    /// <summary>
    /// Collects the filters attached to the command, controller first then method, ordered by <see cref="IUIFilter{TContext}.Order"/>.
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

    /// <summary>The command's own rules; the controller's are the route's, which <c>Require</c> may have replaced.</summary>
    private static UIAccessRule[] BuildAccessRules(MethodInfo method)
        => UIAccessRule.FromAttributes(method.GetCustomAttributes<UIAuthorizeAttribute>(inherit: true));

    /// <summary>Checks a command against the current session, not the snapshot taken when the connection attached.</summary>
    /// <remarks>A revoked or signed-out session must be refused immediately, not once an already-open tab reloads.</remarks>
    private async ValueTask EnsureCommandAuthorizedAsync(IUICommandMetadata command, CancellationToken cancellationToken)
    {
        // No attribute of its own: inherit the route's resolved answer (view + controller + DefaultPolicy) instead of defaulting closed.
        if (command.AllowAnonymous ?? Context.Route.AllowAnonymous)
            return;

        IUserSessionStore store = Context.Services.GetRequiredService<IUserSessionStore>();
        UserSessionState? session = await store.TryGetAsync(Context.Handle.Session.SessionId, cancellationToken).ConfigureAwait(false);

        // Idle past its timeout is gone, as every other reader of the store takes it: the sweep has only not reached it yet.
        if (session is null || session.IsIdle(Context.Services.GetRequiredService<UIApplication>().Sessions, DateTime.UtcNow))
            throw new UnauthorizedAccessException($"Command '{command.Name}' has no live session; it was signed out or has expired.");

        IUIAuthorizationService authorization = Context.Services.GetRequiredService<IUIAuthorizationService>();
        UIRouteAccessVerdict verdict = UIRouteAccess.Check(allowAnonymous: false, command is UICommandDescriptor descriptor ? descriptor.AccessRules : [.. command.AccessRules], session, authorization);

        // The route's rules as well as the command's: a role the page needs, revoked while the page stays open, must stop its
        // commands too. An anonymous route's rules are not the page's either, so they do not hold here.
        if (verdict == UIRouteAccessVerdict.Pass)
            verdict = UIRouteAccess.Check(Context.Route, session, authorization);

        if (verdict == UIRouteAccessVerdict.SignIn)
            throw new UnauthorizedAccessException($"Command '{command.Name}' requires authenticated session.");

        if (verdict == UIRouteAccessVerdict.Forbidden)
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

        // A command the session's rules refuse is answered to the reader and is the application working as meant: a debug line,
        // not an error with a stack trace.
        if (context.Exception is UnauthorizedAccessException refusal)
            Log.RuntimeOperationRefused(Context.Logger, context.Operation, Context.Route.Route, Context.Handle.Session.UserId, refusal.Message);
        else
            Log.RuntimeOperationFailed(Context.Logger, context.Exception, context.Operation, Context.Route.Route, Context.Handle.Instance.WindowId, Context.Handle.Session.UserId);

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
        catch
        {
            // A logger that throws must not turn a failure already recovered from into a new one.
        }
    }

    /// <inheritdoc />
    public void Dispose()
    {
        Dispose(disposing: true);
        GC.SuppressFinalize(this);
    }

    /// <summary>
    /// Releases what the controller owns: an override disposes its own fields when <paramref name="disposing"/> and the controller is
    /// not <see cref="IsDisposed"/> yet, then calls the base — the .NET pattern, the one the analyzers' CA2213 reads.
    /// </summary>
    protected virtual void Dispose(bool disposing)
    {
        if (IsDisposed)
            return;

        if (disposing)
            SetChangeNotifier(null);

        IsDisposed = true;
    }

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
