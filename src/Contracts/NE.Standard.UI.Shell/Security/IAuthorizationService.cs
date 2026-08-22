using System.Collections.Generic;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Shell.Security;

/// <summary>
/// Evaluates UI access rules against a user session.
/// </summary>
public interface IAuthorizationService
{
    /// <summary>
    /// Determines whether the session satisfies all required access rules.
    /// </summary>
    bool IsAuthorized(IUserSessionContext session, IReadOnlyList<UIAccessRule> rules);

    /// <summary>
    /// Determines whether the session satisfies a single access rule.
    /// </summary>
    bool IsAuthorized(IUserSessionContext session, UIAccessRule rule);
}
