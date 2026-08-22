using System;
using System.Collections.Generic;
using System.Diagnostics;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Security;

internal sealed class StandardAuthorizationService : IAuthorizationService
{
    /// <inheritdoc />
    public bool IsAuthorized(IUserSessionContext session, IReadOnlyList<UIAccessRule> rules)
    {
        ArgumentNullException.ThrowIfNull(session);
        ArgumentNullException.ThrowIfNull(rules);

        for (var i = 0; i < rules.Count; i++)
        {
            if (!IsAuthorized(session, rules[i]))
                return false;
        }

        return true;
    }

    /// <inheritdoc />
    public bool IsAuthorized(IUserSessionContext session, UIAccessRule rule)
    {
        ArgumentNullException.ThrowIfNull(session);
        ArgumentNullException.ThrowIfNull(rule);

        rule.Validate();

        return IsAuthorized(session.Roles, rule.Roles, rule.RolesMode) && IsAuthorized(session.Permissions, rule.Permissions, rule.PermissionsMode);
    }

    private static bool IsAuthorized(IReadOnlySet<string> actual, IReadOnlyList<string>? required, UIAccessMode mode)
    {
        ArgumentNullException.ThrowIfNull(actual);

        if (required is null)
            return true;

        if (required.Count == 0)
            return true;

        return mode switch
        {
            UIAccessMode.Any => HasAny(actual, required),
            UIAccessMode.All => HasAll(actual, required),
            _ => throw new UnreachableException()
        };
    }

    private static bool HasAny(IReadOnlySet<string> actual, IReadOnlyList<string> required)
    {
        for (var i = 0; i < required.Count; i++)
        {
            if (actual.Contains(required[i]))
                return true;
        }

        return false;
    }

    private static bool HasAll(IReadOnlySet<string> actual, IReadOnlyList<string> required)
    {
        for (var i = 0; i < required.Count; i++)
        {
            if (!actual.Contains(required[i]))
                return false;
        }

        return true;
    }
}
