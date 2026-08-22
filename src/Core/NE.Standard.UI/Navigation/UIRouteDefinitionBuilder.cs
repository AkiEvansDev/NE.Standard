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
using NE.Standard.UI.Shell.Controllers;
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
    public UIRouteDefinitionBuilder Require(UIAccessRule rule)
    {
        ArgumentNullException.ThrowIfNull(rule);

        rule.Validate();

        _accessRules ??= [];
        _accessRules.Add(rule);

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

    internal UIRouteEntry Build(IServiceProvider services, UISecurityOptions security)
    {
        ArgumentNullException.ThrowIfNull(services);

        ArgumentNullException.ThrowIfNull(security);

        RouteAttributeDefaults defaults = ReadAttributeDefaults(_viewType, _controllerType, security);

        UIViewCompilationMode viewMode = _viewCompilationMode ?? defaults.ViewCompilationMode;

        UIViewFactory viewFactory = new(services, _viewType, _factory, _controllerType);

        Func<CompiledView> getView = CreateViewGetter(viewMode, viewFactory);

        UIRouteDefinition definition = new()
        {
            Route = _route,
            ViewKey = _viewKey,
            ControllerType = _controllerType,

            AllowAnonymous = _allowAnonymous ?? defaults.AllowAnonymous,
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

    /// <summary>
    /// An explicit attribute always wins; only a route carrying neither falls back to the application policy.
    /// </summary>
    private static bool ResolveAllowAnonymous(Type viewType, Type? controllerType, UISecurityOptions security)
    {
        if (viewType.IsDefined(typeof(UIAllowAnonymousAttribute), inherit: true) || controllerType?.IsDefined(typeof(UIAllowAnonymousAttribute), inherit: true) == true)
            return true;

        if (viewType.IsDefined(typeof(UIAuthorizeAttribute), inherit: true) || controllerType?.IsDefined(typeof(UIAuthorizeAttribute), inherit: true) == true)
            return false;

        return security.DefaultPolicy == UIAuthorizationDefault.Anonymous;
    }

    /// <summary>
    /// Collects the view filters attached to the route, view first then controller, ordered by
    /// <see cref="IUIViewFilter.Order"/> — a stable sort, so equal orders keep that attachment order.
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

    private static void ValidateControllerRuntimeAttribute(UIControllerRuntimeAttribute? attribute)
    {
        if (attribute is null)
            return;

        if (attribute.FlushIntervalMilliseconds == 0)
            throw new InvalidOperationException("Controller flush interval must be greater than zero.");

        if (attribute.FlushIntervalMilliseconds < -1)
            throw new InvalidOperationException("Controller flush interval must be -1 or greater than zero.");
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

    private static Func<CompiledView> CreateLazyGetter(UIViewFactory factory)
    {
        Lazy<CompiledView> lazy = new(
            factory.Compile,
            LazyThreadSafetyMode.ExecutionAndPublication
        );

        return () => lazy.Value;
    }
}
