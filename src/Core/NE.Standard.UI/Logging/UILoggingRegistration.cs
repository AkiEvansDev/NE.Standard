using System;
using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Application;

namespace NE.Standard.UI.Logging;

internal static class UILoggingRegistration
{
    private const string ConsoleLoggerProviderFullName = "Microsoft.Extensions.Logging.Console.ConsoleLoggerProvider";

    public static void Register(IServiceCollection services, UILoggingOptions logging)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(logging);

        logging.Validate();

        _ = services.AddSingleton(logging);

        var configuresFilters = logging.MinimumLevel is not null
            || logging.CategoryLevels.Count > 0
            || (logging.File.Enabled && logging.File.MinimumLevel is not null);

        if (configuresFilters || logging.File.Enabled)
            _ = services.AddLogging();

        if (configuresFilters)
            ConfigureFilters(services, logging);

        if (logging.File.Enabled)
        {
            services.TryAddEnumerable(ServiceDescriptor.Singleton<ILoggerProvider, UIFileLoggerProvider>(
                provider => new UIFileLoggerProvider(logging.File, provider.GetService<TimeProvider>())
            ));
        }

        if (logging.Console.Enabled == false)
            RemoveConsoleLoggerProvider(services);
    }

    private static void ConfigureFilters(IServiceCollection services, UILoggingOptions logging)
    {
        _ = services.PostConfigure<LoggerFilterOptions>(options =>
        {
            if (logging.MinimumLevel is { } minimumLevel)
            {
                options.MinLevel = minimumLevel;
                options.Rules.Add(new LoggerFilterRule(providerName: null, categoryName: null, logLevel: minimumLevel, filter: null));
            }

            foreach (KeyValuePair<string, LogLevel> pair in logging.CategoryLevels)
                options.Rules.Add(new LoggerFilterRule(providerName: null, categoryName: pair.Key, logLevel: pair.Value, filter: null));

            if (logging.File.Enabled && logging.File.MinimumLevel is { } fileMinimumLevel)
                options.Rules.Add(new LoggerFilterRule(providerName: typeof(UIFileLoggerProvider).FullName, categoryName: null, logLevel: fileMinimumLevel, filter: null));
        });
    }

    private static void RemoveConsoleLoggerProvider(IServiceCollection services)
    {
        for (var i = services.Count - 1; i >= 0; i--)
        {
            ServiceDescriptor descriptor = services[i];

            if (descriptor.ServiceType == typeof(ILoggerProvider)
                && string.Equals(descriptor.ImplementationType?.FullName, ConsoleLoggerProviderFullName, StringComparison.Ordinal))
            {
                services.RemoveAt(i);
            }
        }
    }
}
