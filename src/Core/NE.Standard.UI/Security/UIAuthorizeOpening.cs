using System;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Security;

/// <summary>
/// Finds a <c>[UIAuthorize]</c> that a <c>[UIAllowAnonymous]</c> quietly opens: the anonymous one wins, so what asked for an identity
/// would take anyone. The command's override chain and the route's type chain both ask it.
/// </summary>
internal static class UIAuthorizeOpening
{
    /// <summary>
    /// Walks <paramref name="member"/> up its chain (<paramref name="up"/>) to the first level carrying <c>[UIAllowAnonymous]</c>; true
    /// where a level at or below it carries <c>[UIAuthorize]</c>. One declared above a lower level's <c>[UIAuthorize]</c> opens it on
    /// purpose and stands.
    /// </summary>
    public static bool TryFind<TMember>(TMember member, Func<TMember, TMember?> up, [NotNullWhen(true)] out TMember? authorizing, [NotNullWhen(true)] out TMember? opening)
        where TMember : MemberInfo
    {
        authorizing = null;

        for (TMember? level = member; level is not null; level = up(level))
        {
            if (authorizing is null && level.IsDefined(typeof(UIAuthorizeAttribute), inherit: false))
                authorizing = level;

            if (!level.IsDefined(typeof(UIAllowAnonymousAttribute), inherit: false))
                continue;

            opening = level;
            return authorizing is not null;
        }

        opening = null;
        return false;
    }
}
