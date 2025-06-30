using System;
using Microsoft.Extensions.DependencyInjection;

namespace NE.Standard.Logging
{
    /// <summary>
    /// Service collection extensions for NE logger.
    /// </summary>
    public static class NeLoggingServiceCollectionExtensions
    {
        public static IServiceCollection AddConsoleNeLogger<T>(this IServiceCollection services)
            where T : class
        {
            services.AddSingleton<INeLogger<T>, ConsoleLogger<T>>();
            return services;
        }

        public static IServiceCollection AddFileNeLogger<T>(this IServiceCollection services, string directory, int retentionDays = 7)
            where T : class
        {
            services.AddSingleton<INeLogger<T>>(sp => new FileLogger<T>(directory, retentionDays));
            return services;
        }
    }
}
