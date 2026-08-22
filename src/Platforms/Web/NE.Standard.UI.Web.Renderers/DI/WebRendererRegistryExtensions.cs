using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Actions;
using NE.Standard.UI.Web.Renderers.Contents;
using NE.Standard.UI.Web.Renderers.Indicators;
using NE.Standard.UI.Web.Renderers.Inputs;
using NE.Standard.UI.Web.Renderers.Items;
using NE.Standard.UI.Web.Renderers.Layouts;
using NE.Standard.UI.Web.Renderers.Navigation;
using NE.Standard.UI.Web.Renderers.Regions;

namespace NE.Standard.UI.Web.Renderers.DI;

public static class WebRendererRegistryExtensions
{
    public static IServiceCollection AddStandardRenderers(this IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, ContainerComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, StackPanelComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, WrapPanelComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, ScrollContainerComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, CardComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, CardHeaderRegionRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, ExpanderComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, ExpanderHeaderRegionRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, FlyoutComponentRenderer>());

        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, BadgeComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, TextComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, SeparatorComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, LinkComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, IconComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, ImageComponentRenderer>());

        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, ButtonComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, ActionComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, BreadcrumbsComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, BreadcrumbItemComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, MenuComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, MenuItemComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, TabsComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, TabHeaderComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, TabsViewComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, TabItemComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, ButtonContentRegionRenderer>());

        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, SpinnerComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, ProgressComponentRenderer>());

        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, ItemsViewComponentRenderer>());

        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, TextInputComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, CheckboxComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, SwitchComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, RadioGroupComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, SelectComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, SearchComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, SliderComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, DateInputComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, TimeInputComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, DateTimeInputComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, NumberInputComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, TextAreaComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, FileInputComponentRenderer>());

        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, CommandBarComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, KeyValueActionComponentRenderer>());

        AddDefaultTemplateAliases(services);

        return services;
    }

    // A default template is a distinct component type with no renderer of its own — it is an alias onto an
    // existing one. Registering through TryAddEnumerable is also the extension point a plugin package uses to
    // contribute its own renderer without touching this list.
    private static void AddDefaultTemplateAliases(IServiceCollection services)
    {
        _ = services.AddSingleton<IWebComponentRenderer>(
            _ => new WebComponentRendererAlias(DefaultTextTemplate.ComponentTypeKey, new TextComponentRenderer()));

        _ = services.AddSingleton<IWebComponentRenderer>(
            _ => new WebComponentRendererAlias(DefaultEmptyTemplate.ComponentTypeKey, new TextComponentRenderer()));

        _ = services.AddSingleton<IWebComponentRenderer>(
            _ => new WebComponentRendererAlias(DefaultKeyTemplate.ComponentTypeKey, new TextComponentRenderer()));

        _ = services.AddSingleton<IWebComponentRenderer>(
            _ => new WebComponentRendererAlias(DefaultValueTemplate.ComponentTypeKey, new TextComponentRenderer()));

        _ = services.AddSingleton<IWebComponentRenderer>(
            _ => new WebComponentRendererAlias(DefaultGroupTemplate.ComponentTypeKey, new SeparatorComponentRenderer()));

        _ = services.AddSingleton<IWebComponentRenderer>(
            _ => new WebComponentRendererAlias(DefaultButtonTemplate.ComponentTypeKey, new ButtonComponentRenderer()));

        _ = services.AddSingleton<IWebComponentRenderer>(
            _ => new WebComponentRendererAlias(DefaultActionTemplate.ComponentTypeKey, new ButtonComponentRenderer()));

        _ = services.AddSingleton<IWebComponentRenderer>(
            _ => new WebComponentRendererAlias(DefaultMenuItemTemplate.ComponentTypeKey, new MenuItemComponentRenderer()));

        _ = services.AddSingleton<IWebComponentRenderer>(
            _ => new WebComponentRendererAlias(DefaultTabItemTemplate.ComponentTypeKey, new TabItemComponentRenderer()));

        _ = services.AddSingleton<IWebComponentRenderer>(
            _ => new WebComponentRendererAlias(DefaultBreadcrumbItemTemplate.ComponentTypeKey, new BreadcrumbItemComponentRenderer()));

        // The row template is a node that is never actually rendered: KeyValueAction composes its row from the
        // key/value/action variants instead. The alias exists so the compiler still resolves the slot.
        _ = services.AddSingleton<IWebComponentRenderer>(
            _ => new WebComponentRendererAlias(DefaultRowTemplate.ComponentTypeKey, new ContainerComponentRenderer()));
    }
}
