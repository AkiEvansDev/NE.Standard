using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Application;
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
            && TryBuildRedirect(_application.ErrorHandling.NotFoundRoute, "route", context.Navigation.Route, out UINavigationRequest? notFoundRedirect))
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
            && TryBuildRedirect(_application.ErrorHandling.ErrorRoute, "message", ResolveErrorMessage(context), out UINavigationRequest? errorRedirect))
        {
            return ValueTask.FromResult<UINavigationRequest?>(errorRedirect);
        }

        return ValueTask.FromResult<UINavigationRequest?>(null);
    }

    /// <summary>
    /// Resolves the error page's <c>message</c> parameter: the raw exception text only when opted into detail.
    /// </summary>
    private string ResolveErrorMessage(ResolveExceptionViewContext context)
    {
        if (_application.ErrorHandling.IncludeExceptionDetail)
            return context.Exception.Message;

        var language = context.Session?.Language ?? _application.Translator.DefaultLanguage;
        return _application.Translator.Translate(language, _application.ErrorHandling.ErrorPageMessage) ?? _application.ErrorHandling.ErrorPageMessage;
    }

    /// <summary>
    /// Redirects to sign-in or to the forbidden page, depending on why access was refused.
    /// </summary>
    private bool TryBuildRefusalRedirect(ResolveExceptionViewContext context, [NotNullWhen(true)] out UINavigationRequest? request)
    {
        var signInRoute = _application.Security.SignInRoute;

        if (context.Exception is UIForbiddenAccessException)
        {
            var forbiddenRoute = _application.Security.ForbiddenRoute;

            if (forbiddenRoute is not null
                && !RouteEquals(context.Route?.Route, forbiddenRoute)
                && TryBuildRedirect(forbiddenRoute, "deniedUrl", context.Navigation.Route, out request))
            {
                return true;
            }
        }

        if (!RouteEquals(context.Route?.Route, signInRoute)
            && TryBuildRedirect(signInRoute, "returnUrl", context.Navigation.Route, out request))
        {
            return true;
        }

        request = null;
        return false;
    }

    [SuppressMessage("Usage", "CA2234:Pass system uri objects instead of strings", Justification = "Route paths are opaque route-table keys, not URIs.")]
    private bool TryBuildRedirect(string? targetRoute, string parameterKey, string parameterValue, [NotNullWhen(true)] out UINavigationRequest? request)
    {
        if (targetRoute is null || !_application.RouteRegistry.TryGet(targetRoute, out _))
        {
            request = null;
            return false;
        }

        request = new UINavigationRequest
        {
            Route = targetRoute,
            Parameters = new Dictionary<string, object?> { [parameterKey] = parameterValue }
        };

        return true;
    }

    private static bool RouteEquals(string? a, string? b)
        => a is not null && b is not null && string.Equals(a, b, StringComparison.OrdinalIgnoreCase);
}
