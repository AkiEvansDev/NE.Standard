using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Application;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Navigation;

namespace NE.Standard.UI.Hosting;

internal sealed class StandardResolveExceptionViewHandler : IResolveExceptionViewHandler
{
    private readonly UIApplication _application;

    public StandardResolveExceptionViewHandler(UIApplication application)
    {
        ArgumentNullException.ThrowIfNull(application);
        _application = application;
    }

    /// <inheritdoc />
    public ValueTask<UINavigationRequest?> HandleAsync(ResolveExceptionViewContext context, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(context);

        context.Validate();

        if (context.Exception is UIRouteNotFoundException notFound
            && !RouteEquals(notFound.Route, _application.ErrorHandling.NotFoundRoute)
            && TryBuildRedirect(_application, _application.ErrorHandling.NotFoundRoute, "route", context.Navigation.Route, out UINavigationRequest? notFoundRedirect))
        {
            return ValueTask.FromResult<UINavigationRequest?>(notFoundRedirect);
        }

        // A refusal is not an error page: guarded against the target route refusing its own visitors, which would otherwise loop.
        if (context.Exception is UnauthorizedAccessException
            && TryBuildRefusalRedirect(context, out UINavigationRequest? refusalRedirect))
        {
            return ValueTask.FromResult<UINavigationRequest?>(refusalRedirect);
        }

        if (context.Exception is not UnauthorizedAccessException
            && !RouteEquals(context.Route?.Route, _application.ErrorHandling.ErrorRoute)
            && TryBuildRedirect(_application, _application.ErrorHandling.ErrorRoute, UIErrorDetail.ParameterName, ResolveErrorDetail(context), out UINavigationRequest? errorRedirect))
        {
            return ValueTask.FromResult<UINavigationRequest?>(errorRedirect);
        }

        return ValueTask.FromResult<UINavigationRequest?>(null);
    }

    /// <summary>
    /// The error page's <c>message</c> parameter: the exception's own text, in-process, only when opted into detail; otherwise none, and
    /// the page shows its own words.
    /// </summary>
    private UIErrorDetail? ResolveErrorDetail(ResolveExceptionViewContext context)
        => _application.ErrorHandling.IncludeExceptionDetail ? new UIErrorDetail(context.Exception.Message) : null;

    /// <summary>
    /// Redirects to sign-in or to the forbidden page, depending on why access was refused.
    /// </summary>
    private bool TryBuildRefusalRedirect(ResolveExceptionViewContext context, [NotNullWhen(true)] out UINavigationRequest? request)
    {
        if (context.Exception is UIForbiddenAccessException)
        {
            var forbiddenRoute = _application.Security.ForbiddenRoute;

            if (forbiddenRoute is not null
                && !RouteEquals(context.Route?.Route, forbiddenRoute)
                && TryBuildRedirect(_application, forbiddenRoute, "deniedUrl", UINavigationAddress.Format(context.Navigation), out request))
            {
                return true;
            }
        }

        return TryBuildSignIn(_application, context.Route?.Route, context.Navigation, out request);
    }

    /// <summary>
    /// The sign-in page with <paramref name="page"/> as its return address — the one way a refused or ended page is sent to sign in;
    /// false with no sign-in route registered, or on the sign-in route itself, which would return to itself.
    /// </summary>
    internal static bool TryBuildSignIn(UIApplication application, string? currentRoute, UINavigationRequest page, [NotNullWhen(true)] out UINavigationRequest? request)
    {
        ArgumentNullException.ThrowIfNull(application);
        ArgumentNullException.ThrowIfNull(page);

        var signInRoute = application.Security.SignInRoute;

        if (RouteEquals(currentRoute, signInRoute))
        {
            request = null;
            return false;
        }

        return TryBuildRedirect(application, signInRoute, "returnUrl", UINavigationAddress.Format(page), out request);
    }

    [SuppressMessage("Usage", "CA2234:Pass system uri objects instead of strings", Justification = "Route paths are opaque route-table keys, not URIs.")]
    private static bool TryBuildRedirect(UIApplication application, string? targetRoute, string parameterKey, object? parameterValue, [NotNullWhen(true)] out UINavigationRequest? request)
    {
        if (targetRoute is null || !application.RouteRegistry.TryGet(targetRoute, out _))
        {
            request = null;
            return false;
        }

        request = new UINavigationRequest
        {
            Route = targetRoute,
            Parameters = parameterValue is null ? null : new Dictionary<string, object?> { [parameterKey] = parameterValue }
        };

        return true;
    }

    private static bool RouteEquals(string? a, string? b)
        => a is not null && b is not null && string.Equals(a, b, StringComparison.OrdinalIgnoreCase);
}
