using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Security;

/// <summary>What a session's access to a route, or to a command on it, comes to.</summary>
internal enum UIRouteAccessVerdict
{
    Pass,
    SignIn,
    Forbidden
}

/// <summary>
/// The one rule a route is opened by — a page's resolution, a changed session's open pages and a command's call all ask it: an
/// anonymous route lets anyone in; any other wants a signed-in session that passes every rule it names.
/// </summary>
internal static class UIRouteAccess
{
    public static UIRouteAccessVerdict Check(UIRouteDefinition route, IUserSessionContext session, IUIAuthorizationService authorization)
        => Check(route.AllowAnonymous, route.AccessRules, session, authorization);

    public static UIRouteAccessVerdict Check(bool allowAnonymous, UIAccessRule[] rules, IUserSessionContext session, IUIAuthorizationService authorization)
    {
        if (allowAnonymous)
            return UIRouteAccessVerdict.Pass;

        if (!session.IsAuthenticated)
            return UIRouteAccessVerdict.SignIn;

        return rules.Length == 0 || authorization.IsAuthorized(session, rules) ? UIRouteAccessVerdict.Pass : UIRouteAccessVerdict.Forbidden;
    }
}
