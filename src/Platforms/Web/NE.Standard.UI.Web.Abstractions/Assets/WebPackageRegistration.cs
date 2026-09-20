using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;

namespace NE.Standard.UI.Web.Abstractions.Assets;

/// <summary>
/// Shared helpers for building a package's DI registration once and normalizing its glyph-icon names.
/// </summary>
public static class WebPackageRegistration
{
    /// <summary>
    /// Gets the singleton <typeparamref name="TRegistration"/> already registered, or creates one via <paramref name="create"/>.
    /// <paramref name="added"/> is true only on first creation.
    /// </summary>
    public static TRegistration GetOrAdd<TRegistration>(IServiceCollection services, Func<TRegistration> create, out bool added)
        where TRegistration : class
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(create);

        TRegistration? registration = (TRegistration?)services
            .FirstOrDefault(descriptor => descriptor.ServiceType == typeof(TRegistration))?
            .ImplementationInstance;

        added = registration is null;

        if (!added)
            return registration!;

        registration = create();
        _ = services.AddSingleton(registration);

        return registration;
    }

    /// <summary>Strips a pack's own prefix (<c>lu-</c>, <c>ms-</c>) so a glyph table stays keyed by the pack's own name.</summary>
    public static string NormalizeIconName(string name, string prefix)
        => name.StartsWith(prefix, StringComparison.Ordinal) ? name[prefix.Length..] : name;
}
