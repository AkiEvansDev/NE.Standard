using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NE.Standard.UI.Sessions;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Startup;

/// <summary>
/// Registers where an application keeps its sessions, in its startup's <c>ConfigureServices</c>; without one the framework keeps
/// every session in memory (<see cref="UserSessionMemoryStore"/>).
/// </summary>
public static class UISessionServiceCollectionExtensions
{
    /// <summary>Keeps every session in <typeparamref name="TStore"/>, registered as a singleton.</summary>
    public static IServiceCollection AddUserSessionStore<TStore>(this IServiceCollection services)
        where TStore : class, IUserSessionStore
    {
        ArgumentNullException.ThrowIfNull(services);

        services.TryAddSingleton<TStore>();
        _ = services.Replace(ServiceDescriptor.Singleton<IUserSessionStore>(static provider => provider.GetRequiredService<TStore>()));

        return services;
    }

    /// <summary>
    /// Keeps signed-in sessions in <typeparamref name="TStore"/>, registered as a singleton, and anonymous ones in memory
    /// (<see cref="UserSessionSplitStore"/>) — a store in a database then sees no visitor who never signs in.
    /// </summary>
    public static IServiceCollection AddSignedInUserSessionStore<TStore>(this IServiceCollection services)
        where TStore : class, IUserSessionStore
    {
        ArgumentNullException.ThrowIfNull(services);

        services.TryAddSingleton<TStore>();
        services.TryAddSingleton(static provider => new UserSessionSplitStore(provider.GetRequiredService<TStore>()));
        _ = services.Replace(ServiceDescriptor.Singleton<IUserSessionStore>(static provider => provider.GetRequiredService<UserSessionSplitStore>()));

        return services;
    }
}
