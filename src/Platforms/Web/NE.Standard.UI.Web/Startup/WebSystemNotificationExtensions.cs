using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Web.Assets;
using NE.Standard.UI.Web.Hosting;

namespace NE.Standard.UI.Web.Startup;

/// <summary>Turns on the framework's service worker, which shows a page's system notifications on a phone too and takes their click.</summary>
public static class WebSystemNotificationExtensions
{
    /// <summary>
    /// Serves the framework's service worker at <c>/_ne/sw.js</c> and has every page reach it, as <paramref name="mode"/> says: a page
    /// registers it, or waits for the application's own worker, which imports it.
    /// </summary>
    /// <remarks>
    /// Without it a page shows its system notifications itself, which a desktop browser does and a phone's refuses — there the
    /// page shows the notification's fallback. An application that never notifies registers no worker at all.
    /// </remarks>
    public static IServiceCollection AddSystemNotifications(this IServiceCollection services, WebServiceWorkerMode mode = WebServiceWorkerMode.Framework)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentOutOfRangeException.ThrowIfEqual(mode, WebServiceWorkerMode.Off);

        _ = services.Configure<WebEndpointOptions>(options => options.ServiceWorker = mode);

        // One descriptor however often it is called: the registry refuses a key registered twice.
        if (!services.Any(static service => ReferenceEquals(service.ImplementationInstance, StandardWebAssetDescriptors.Worker)))
            _ = services.AddSingleton(StandardWebAssetDescriptors.Worker);

        return services;
    }
}
