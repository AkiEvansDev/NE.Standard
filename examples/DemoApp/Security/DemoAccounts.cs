using System;
using System.Collections.Frozen;

namespace DemoApp.Security;

/// <summary>
/// An account the security demo can sign in as.
/// </summary>
internal sealed record DemoAccount(string UserName, string Password, FrozenSet<string> Roles, FrozenSet<string> Permissions);

/// <summary>
/// Stands in for whatever a real application authenticates against. The demo is about what a successful lookup
/// hands to <c>UIContext.SignInAsync</c>, not about how the lookup is done — so the passwords sit here in plain
/// text, which is exactly what a real one must not do.
/// </summary>
internal static class DemoAccounts
{
    public const string AdminRole = "admin";
    public const string MemberRole = "member";

    public const string ViewReportsPermission = "reports.view";
    public const string ExportReportsPermission = "reports.export";

    private static readonly DemoAccount[] All =
    [
        new("admin", "admin", Set(AdminRole, MemberRole), Set(ViewReportsPermission, ExportReportsPermission)),
        new("member", "member", Set(MemberRole), Set(ViewReportsPermission))
    ];

    public static DemoAccount? Find(string? userName, string? password)
    {
        if (string.IsNullOrWhiteSpace(userName) || string.IsNullOrWhiteSpace(password))
            return null;

        foreach (DemoAccount account in All)
        {
            if (string.Equals(account.UserName, userName.Trim(), StringComparison.OrdinalIgnoreCase)
                && string.Equals(account.Password, password, StringComparison.Ordinal))
            {
                return account;
            }
        }

        return null;
    }

    private static FrozenSet<string> Set(params string[] values)
        => FrozenSet.ToFrozenSet(values, StringComparer.Ordinal);
}
