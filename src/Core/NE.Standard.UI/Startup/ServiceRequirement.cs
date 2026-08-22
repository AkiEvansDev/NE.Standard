using System;
using Microsoft.Extensions.DependencyInjection;

namespace NE.Standard.UI.Startup;

internal sealed class ServiceRequirement
{
    private readonly IServiceCollection _services;

    private ServiceRequirement(IServiceCollection services)
    {
        _services = services;
    }

    public static ServiceRequirement Validate(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        return new ServiceRequirement(services);
    }

    public ServiceRequirement Required<TService>()
        where TService : class
    {
        Type serviceType = typeof(TService);

        for (var i = 0; i < _services.Count; i++)
        {
            if (_services[i].ServiceType == serviceType)
                return this;
        }

        throw new InvalidOperationException($"Required UI service '{serviceType.FullName}' is not registered.");
    }
}
