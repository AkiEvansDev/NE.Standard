namespace NE.Standard.UI.Primitives.Security;

/// <summary>
/// Decides what a route with no authorization attribute means.
/// </summary>
public enum UIAuthorizationDefault
{
    /// <summary>
    /// A route with neither <c>[UIAuthorize]</c> nor <c>[UIAllowAnonymous]</c> is open.
    /// </summary>
    Anonymous = 0,

    /// <summary>
    /// A route with neither <c>[UIAuthorize]</c> nor <c>[UIAllowAnonymous]</c> requires an authenticated
    /// session. Forgetting an attribute then closes a page rather than publishing one.
    /// </summary>
    Authenticated = 1
}
