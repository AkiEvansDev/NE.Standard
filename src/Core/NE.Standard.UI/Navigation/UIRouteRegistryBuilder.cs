using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Views;

namespace NE.Standard.UI.Navigation;

/// <summary>
/// Builds a registry of UI routes.
/// </summary>
public sealed class UIRouteRegistryBuilder
{
    private readonly List<UIRouteDefinitionBuilder> _builders = [];

    /// <summary>
    /// Registers a view route.
    /// </summary>
    public UIRouteRegistryBuilder Route<TView>(string route)
        where TView : IUIView, IUIViewDefinition
        => Route<TView>(route, factory: null);

    /// <summary>
    /// Registers a view route and configures its route metadata.
    /// </summary>
    public UIRouteRegistryBuilder Route<TView>(string route, Action<UIRouteDefinitionBuilder>? configure)
        where TView : IUIView, IUIViewDefinition
        => Route<TView>(route, factory: null, configure);

    /// <summary>
    /// Registers a view route using a service-provider-based view factory.
    /// </summary>
    public UIRouteRegistryBuilder Route<TView>(string route, Func<IServiceProvider, TView>? factory, Action<UIRouteDefinitionBuilder>? configure = null)
        where TView : IUIView, IUIViewDefinition
    {
        UIRouteDefinitionBuilder builder = UIRouteDefinitionBuilder.Create(route, factory);

        configure?.Invoke(builder);

        _builders.Add(builder);

        return this;
    }

    /// <summary>
    /// Registers a controller-backed view route.
    /// </summary>
    public UIRouteRegistryBuilder Route<TView, TController>(string route)
        where TView : IUIView, IUIViewDefinition
        where TController : IUIController, IUIContextController
        => Route<TView, TController>(route, factory: null, configure: null);

    /// <summary>
    /// Registers a controller-backed view route and configures its route metadata.
    /// </summary>
    public UIRouteRegistryBuilder Route<TView, TController>(string route, Action<UIRouteDefinitionBuilder>? configure)
        where TView : IUIView, IUIViewDefinition
        where TController : IUIController, IUIContextController
        => Route<TView, TController>(route, factory: null, configure);

    /// <summary>
    /// Registers a controller-backed view route using a service-provider-based view factory.
    /// </summary>
    public UIRouteRegistryBuilder Route<TView, TController>(string route, Func<IServiceProvider, TView>? factory, Action<UIRouteDefinitionBuilder>? configure = null)
        where TView : IUIView, IUIViewDefinition
        where TController : IUIController, IUIContextController
    {
        UIRouteDefinitionBuilder builder = UIRouteDefinitionBuilder.Create<TView, TController>(route, factory);

        configure?.Invoke(builder);

        _builders.Add(builder);

        return this;
    }

    internal UIRouteRegistry Build(IServiceProvider services, UISecurityOptions security)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(security);

        UIRouteEntry[] entries = new UIRouteEntry[_builders.Count];

        for (var i = 0; i < _builders.Count; i++)
            entries[i] = _builders[i].Build(services, security);

        return new UIRouteRegistry(entries);
    }
}
