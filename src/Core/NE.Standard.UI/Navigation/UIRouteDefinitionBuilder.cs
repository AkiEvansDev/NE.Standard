using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Threading;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Security;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Filters;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Views;

namespace NE.Standard.UI.Navigation;

/// <summary>
/// Builds route metadata for a UI view route.
/// </summary>
public sealed class UIRouteDefinitionBuilder
{
    private readonly record struct RouteAttributeDefaults
    {
        public required bool AllowAnonymous { get; init; }
        public required UIAccessRule[] AccessRules { get; init; }
        public required IUIViewFilter[] ViewFilters { get; init; }
        public required UIViewCompilationMode ViewCompilationMode { get; init; }
        public required UIControllerUpdateMode ControllerUpdateMode { get; init; }
        public required int FlushIntervalMilliseconds { get; init; }
    }

    private readonly string _route;
    private readonly string _viewKey;
    private readonly Type _viewType;
    private readonly Type? _controllerType;
    private readonly Func<IServiceProvider, IUIView> _factory;

    private bool? _allowAnonymous;
    private List<UIAccessRule>? _accessRules;
    private string[]? _identityParameters;

    private UIViewCompilationMode? _viewCompilationMode;
    private UIControllerUpdateMode? _controllerUpdateMode;
    private int? _flushIntervalMilliseconds;

    private UIRouteDefinitionBuilder(string route, string viewKey, Type viewType, Type? controllerType, Func<IServiceProvider, IUIView> factory)
    {
        _route = UIRoutePath.Normalize(route);
        _viewKey = ValidateViewKey(viewKey);
        _viewType = viewType;
        _controllerType = controllerType;
        _factory = factory;
    }

    private static string ValidateViewKey(string viewKey)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(viewKey);
        return viewKey;
    }

    internal static UIRouteDefinitionBuilder Create<TView>(string route, Func<IServiceProvider, TView>? factory = null)
        where TView : IUIView, IUIViewDefinition
    {
        Func<IServiceProvider, IUIView> mappedFactory = factory is null
            ? _ => CreateView<TView>()
            : services => factory(services);

        return new UIRouteDefinitionBuilder(route, TView.ViewKey, typeof(TView), controllerType: null, mappedFactory);
    }

    internal static UIRouteDefinitionBuilder Create<TView, TController>(string route, Func<IServiceProvider, TView>? factory = null)
        where TView : IUIView, IUIViewDefinition
        where TController : IUIController, IUIContextController
    {
        Func<IServiceProvider, IUIView> mappedFactory = factory is null
            ? _ => CreateView<TView>()
            : services => factory(services);

        return new UIRouteDefinitionBuilder(route, TView.ViewKey, typeof(TView), typeof(TController), mappedFactory);
    }

    private static TView CreateView<TView>()
        where TView : IUIView
    {
        try
        {
            return Activator.CreateInstance<TView>();
        }
        catch (MissingMethodException exception)
        {
            throw new InvalidOperationException($"View type '{typeof(TView).Name}' must have a public parameterless constructor or be registered with a custom factory.", exception);
        }
    }

    /// <summary>
    /// Allows the route to be resolved without an authenticated session.
    /// </summary>
    public UIRouteDefinitionBuilder AllowAnonymous(bool value = true)
    {
        _allowAnonymous = value;
        return this;
    }

    /// <summary>
    /// Adds an access rule that must be satisfied before the route can be resolved.
    /// </summary>
    /// <remarks>
    /// Replaces the rules the view's and controller's attributes carry, and closes the route to an anonymous session whatever the
    /// default policy says; only an explicit <see cref="AllowAnonymous"/> on the route opens it again, rules and all.
    /// </remarks>
    public UIRouteDefinitionBuilder Require(UIAccessRule rule)
    {
        ArgumentNullException.ThrowIfNull(rule);

        rule.Validate();

        _accessRules ??= [];
        _accessRules.Add(rule);

        return this;
    }

    /// <summary>
    /// Declares which navigation parameters are part of the route's address, and therefore separate one
    /// page of it from another.
    /// </summary>
    public UIRouteDefinitionBuilder Identity(params string[] parameters)
    {
        ArgumentNullException.ThrowIfNull(parameters);

        for (var i = 0; i < parameters.Length; i++)
            ArgumentException.ThrowIfNullOrWhiteSpace(parameters[i]);

        _identityParameters = [.. parameters];

        return this;
    }

    /// <summary>
    /// Sets the view compilation mode for the route.
    /// </summary>
    public UIRouteDefinitionBuilder CompilationMode(UIViewCompilationMode mode)
    {
        _viewCompilationMode = mode;
        return this;
    }

    /// <summary>
    /// Sets the controller update mode and uses the runtime default flush interval.
    /// </summary>
    public UIRouteDefinitionBuilder ControllerUpdates(UIControllerUpdateMode mode)
    {
        _controllerUpdateMode = mode;
        _flushIntervalMilliseconds = -1;

        return this;
    }

    /// <summary>
    /// Sets the controller update mode and route-specific flush interval.
    /// </summary>
    public UIRouteDefinitionBuilder ControllerUpdates(UIControllerUpdateMode mode, TimeSpan interval)
    {
        if (interval <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(interval), interval, "Flush interval must be greater than zero.");

        var milliseconds = interval.TotalMilliseconds;

        if (milliseconds > int.MaxValue)
            throw new ArgumentOutOfRangeException(nameof(interval), interval, "Flush interval is too large.");

        _controllerUpdateMode = mode;
        _flushIntervalMilliseconds = checked((int)milliseconds);

        return this;
    }

    internal UIRouteEntry Build(IServiceProvider services, UISecurityOptions security, Action<CompiledView, Type>? compiled = null)
    {
        ArgumentNullException.ThrowIfNull(services);

        ArgumentNullException.ThrowIfNull(security);

        RouteAttributeDefaults defaults = ReadAttributeDefaults(_viewType, _controllerType, security);

        UIViewCompilationMode viewMode = _viewCompilationMode ?? defaults.ViewCompilationMode;

        UIViewFactory viewFactory = new(services, _viewType, _factory, _controllerType, compiled);

        Func<CompiledView> getView = CreateViewGetter(viewMode, viewFactory);

        UIRouteDefinition definition = new()
        {
            Route = _route,
            ViewKey = _viewKey,
            ControllerType = _controllerType,

            IdentityParameters = _identityParameters ?? [],

            // A rule the route requires closes it, whatever the attributes or the default policy say: an open route never reads its rules.
            AllowAnonymous = _allowAnonymous ?? (_accessRules is null && defaults.AllowAnonymous),
            AccessRules = _accessRules is null ? defaults.AccessRules : [.. _accessRules],
            ViewFilters = defaults.ViewFilters,

            ViewCompilationMode = viewMode,
            ControllerUpdateMode = _controllerUpdateMode ?? defaults.ControllerUpdateMode,
            FlushIntervalMilliseconds = _flushIntervalMilliseconds ?? defaults.FlushIntervalMilliseconds
        };

        definition.Validate();

        return new UIRouteEntry
        {
            Definition = definition,
            GetView = getView
        };
    }

    private static RouteAttributeDefaults ReadAttributeDefaults(Type viewType, Type? controllerType, UISecurityOptions security)
    {
        ArgumentNullException.ThrowIfNull(viewType);

        if (!typeof(IUIView).IsAssignableFrom(viewType))
            throw new ArgumentException($"View type '{viewType.Name}' must implement '{nameof(IUIView)}'.", nameof(viewType));

        if (controllerType is not null && !typeof(IUIController).IsAssignableFrom(controllerType))
            throw new ArgumentException($"Controller type '{controllerType.Name}' must implement '{nameof(IUIController)}'.", nameof(controllerType));

        UIViewRuntimeAttribute? viewRuntime = viewType.GetCustomAttribute<UIViewRuntimeAttribute>(inherit: true);
        UIControllerRuntimeAttribute? controllerRuntime = controllerType?.GetCustomAttribute<UIControllerRuntimeAttribute>(inherit: true);

        ValidateControllerRuntimeAttribute(controllerRuntime);

        return new RouteAttributeDefaults
        {
            AllowAnonymous = ResolveAllowAnonymous(viewType, controllerType, security),

            AccessRules = controllerType is null
                ? UIAccessRule.FromAttributes(viewType.GetCustomAttributes<UIAuthorizeAttribute>(inherit: true))
                : UIAccessRule.FromAttributes(
                    viewType.GetCustomAttributes<UIAuthorizeAttribute>(inherit: true),
                    controllerType.GetCustomAttributes<UIAuthorizeAttribute>(inherit: true)
                ),

            ViewFilters = ReadViewFilters(viewType, controllerType),

            ViewCompilationMode = viewRuntime?.CompilationMode ?? UIViewCompilationMode.Startup,
            ControllerUpdateMode = controllerRuntime?.UpdateMode ?? UIControllerUpdateMode.Batch,
            FlushIntervalMilliseconds = controllerRuntime?.FlushIntervalMilliseconds ?? -1
        };
    }

    private static void ValidateControllerRuntimeAttribute(UIControllerRuntimeAttribute? attribute)
    {
        if (attribute is null)
            return;

        if (attribute.FlushIntervalMilliseconds == 0)
            throw new InvalidOperationException("Controller flush interval must be greater than zero.");

        if (attribute.FlushIntervalMilliseconds < -1)
            throw new InvalidOperationException("Controller flush interval must be -1 or greater than zero.");
    }

    /// <summary>
    /// An explicit attribute always wins; only a route carrying neither falls back to the application policy.
    /// </summary>
    private static bool ResolveAllowAnonymous(Type viewType, Type? controllerType, UISecurityOptions security)
    {
        EnsureAuthorizeNotOpened(viewType);

        if (controllerType is not null)
        {
            EnsureAuthorizeNotOpened(controllerType);
            EnsurePairNotOpened(viewType, controllerType);
            EnsurePairNotOpened(controllerType, viewType);
        }

        if (viewType.IsDefined(typeof(UIAllowAnonymousAttribute), inherit: true) || controllerType?.IsDefined(typeof(UIAllowAnonymousAttribute), inherit: true) == true)
            return true;

        if (viewType.IsDefined(typeof(UIAuthorizeAttribute), inherit: true) || controllerType?.IsDefined(typeof(UIAuthorizeAttribute), inherit: true) == true)
            return false;

        return security.DefaultPolicy == UIAuthorizationDefault.Anonymous;
    }

    /// <summary>
    /// Refuses a type whose <c>[UIAuthorize]</c> a <c>[UIAllowAnonymous]</c> of its own or of a base type would quietly open: the
    /// anonymous one wins, so the route would take anyone. One a derived type declares above a base's <c>[UIAuthorize]</c> opens
    /// it on purpose and stands.
    /// </summary>
    private static void EnsureAuthorizeNotOpened(Type type)
    {
        if (!UIAuthorizeOpening.TryFind(type, static level => level.BaseType, out Type? authorizing, out Type? level))
            return;

        var message = ReferenceEquals(authorizing, level)
            ? $"'{level.FullName}' carries both [UIAuthorize] and [UIAllowAnonymous]; the anonymous one wins and its route would take anyone. Keep one."
            : $"'{authorizing.FullName}' carries [UIAuthorize], but [UIAllowAnonymous] on its base '{level.FullName}' wins and its route would take anyone. Remove one, or declare [UIAllowAnonymous] on the type that means it.";

        throw new InvalidOperationException(message);
    }

    /// <summary>
    /// Refuses a route whose one type opens it while the other asks for an identity: the anonymous one wins, so every command
    /// without an attribute of its own would run for anyone.
    /// </summary>
    private static void EnsurePairNotOpened(Type opening, Type authorizing)
    {
        if (!opening.IsDefined(typeof(UIAllowAnonymousAttribute), inherit: true))
            return;

        // A type opening itself over its base's [UIAuthorize] is open, not asking.
        if (!authorizing.IsDefined(typeof(UIAuthorizeAttribute), inherit: true) || authorizing.IsDefined(typeof(UIAllowAnonymousAttribute), inherit: true))
            return;

        throw new InvalidOperationException($"'{opening.FullName}' carries [UIAllowAnonymous] and '{authorizing.FullName}' carries [UIAuthorize]; the anonymous one wins and the route would take anyone, its commands included. If the page is meant to be public, put [UIAllowAnonymous] on '{authorizing.Name}' too; otherwise take it off '{opening.Name}'.");
    }

    /// <summary>
    /// Collects the view filters attached to the route, view first then controller, ordered by <see cref="IUIFilter{TContext}.Order"/>.
    /// </summary>
    private static IUIViewFilter[] ReadViewFilters(Type viewType, Type? controllerType)
    {
        List<IUIViewFilter> filters = [];

        AddViewFilters(filters, viewType);

        if (controllerType is not null)
            AddViewFilters(filters, controllerType);

        return filters.Count == 0
            ? []
            : [.. filters.OrderBy(static filter => filter.Order)];
    }

    private static void AddViewFilters(List<IUIViewFilter> filters, Type type)
    {
        foreach (Attribute attribute in type.GetCustomAttributes(inherit: true).OfType<Attribute>())
        {
            if (attribute is IUIViewFilter filter)
                filters.Add(filter);
            else if (attribute is IUIViewFilterFactory factory)
                filters.Add(new UIViewFilterFactoryAdapter(factory));
        }
    }
    private static Func<CompiledView> CreateViewGetter(UIViewCompilationMode mode, UIViewFactory factory)
    {
        return mode switch
        {
            UIViewCompilationMode.Startup => CreateStartupGetter(factory),
            UIViewCompilationMode.Lazy => CreateLazyGetter(factory),
            _ => throw new UnreachableException()
        };
    }

    private static Func<CompiledView> CreateStartupGetter(UIViewFactory factory)
    {
        CompiledView view = factory.Compile();

        return () => view;
    }

    /// <summary>Compiles the view on its first open, once, however many opens race to it.</summary>
    /// <remarks>
    /// Not a <see cref="Lazy{T}"/>: under <see cref="LazyThreadSafetyMode.ExecutionAndPublication"/> it keeps a failed compile's
    /// exception and throws it on every later open, so a failure that would pass on a retry closed the route until a restart.
    /// </remarks>
    private static Func<CompiledView> CreateLazyGetter(UIViewFactory factory)
    {
        CompiledView? compiled = null;
        Lock sync = new();

        return () =>
        {
            if (Volatile.Read(ref compiled) is { } view)
                return view;

            lock (sync)
                return compiled ??= factory.Compile();
        };
    }
}
