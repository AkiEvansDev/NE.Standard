using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using Microsoft.Extensions.Options;
using NE.Standard.UI.Application;

namespace NE.Standard.UI.Web.Logging;

internal static class UIConsoleLoggerRegistration
{
    private const string ConsoleLoggerProviderFullName = "Microsoft.Extensions.Logging.Console.ConsoleLoggerProvider";

    public static void RegisterDefaults(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddOptions<SimpleConsoleFormatterOptions>();
        services.TryAddEnumerable(ServiceDescriptor.Singleton<ConsoleFormatter, UIConsoleFormatter>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IPostConfigureOptions<ConsoleLoggerOptions>, UIConsoleLoggerOptionsSetup>());
    }

    public static void EnsureConsoleProviderIfEnabled(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        if (!IsConsoleExplicitlyEnabled(services))
            return;

        if (!HasConsoleLoggerProvider(services))
            _ = services.AddLogging(static logging => logging.AddConsole());

        RegisterDefaults(services);
    }

    private static bool IsConsoleExplicitlyEnabled(IServiceCollection services)
    {
        for (var i = services.Count - 1; i >= 0; i--)
        {
            if (services[i].ServiceType == typeof(UILoggingOptions) && services[i].ImplementationInstance is UILoggingOptions options)
                return options.Console.Enabled == true;
        }

        return false;
    }

    private static bool HasConsoleLoggerProvider(IServiceCollection services)
    {
        for (var i = 0; i < services.Count; i++)
        {
            ServiceDescriptor descriptor = services[i];

            if (descriptor.ServiceType == typeof(ILoggerProvider)
                && string.Equals(descriptor.ImplementationType?.FullName, ConsoleLoggerProviderFullName, StringComparison.Ordinal))
            {
                return true;
            }
        }

        return false;
    }

    private sealed class UIConsoleLoggerOptionsSetup(IServiceProvider services) : IPostConfigureOptions<ConsoleLoggerOptions>
    {
        public void PostConfigure(string? name, ConsoleLoggerOptions options)
        {
            if (!string.IsNullOrEmpty(options.FormatterName)
                && !string.Equals(options.FormatterName, ConsoleFormatterNames.Simple, StringComparison.OrdinalIgnoreCase))
            {
                return;
            }

            IConfiguration? configuration = services.GetService<IConfiguration>();

            if (!string.IsNullOrEmpty(configuration?["Logging:Console:FormatterName"]))
                return;

            options.FormatterName = UIConsoleFormatter.FormatterName;
        }
    }
}
