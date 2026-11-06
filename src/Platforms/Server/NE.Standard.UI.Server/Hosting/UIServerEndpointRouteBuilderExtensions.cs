using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Routing;
using NE.Standard.UI.Web.Hosting;

namespace NE.Standard.UI.Server.Hosting;

/// <summary>Maps the headless API-only <c>NE.Standard</c> server endpoints (<c>/_ne/*</c> and <c>/_ne/hub</c>).</summary>
public static class UIServerEndpointRouteBuilderExtensions
{
    /// <summary>
    /// Maps <c>/_ne/view</c>, <c>/_ne/files</c>, <c>/_ne/values</c>, <c>/_ne/session/key</c>, <c>/_ne/content</c>, <c>/_ne/words</c>
    /// and <c>/_ne/hub</c> without HTML page routes or browser assets.
    /// </summary>
    public static Task<IEndpointRouteBuilder> MapStandardUIServerAsync(this IEndpointRouteBuilder endpoints, CancellationToken cancellationToken = default)
        => WebEndpointRouteBuilderExtensions.MapStandardUIServerCoreAsync(endpoints, cancellationToken);
}
