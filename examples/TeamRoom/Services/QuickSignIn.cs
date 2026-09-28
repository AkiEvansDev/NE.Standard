using TeamRoom.Data;

namespace TeamRoom.Services;

/// <summary>
/// The demo's shortcut past the password: a button per test account on the sign-in page, and the test accounts seeded beside the
/// administrator. Off unless the host turns it on — TeamRoom.Web does in Development only — since a room with it on lets anyone
/// in as anyone.
/// </summary>
public sealed class QuickSignIn
{
    /// <summary>The test accounts the shortcut offers, seeded with their login as their password.</summary>
    public static readonly (string Login, string Nickname, string Role)[] Accounts =
    [
        ("admin", "Admin", AccountRoles.Admin),
        ("robin", "Robin Hale", AccountRoles.User),
        ("sam", "Sam Ortiz", AccountRoles.User)
    ];

    /// <summary>Gets whether the sign-in page offers the test accounts.</summary>
    public bool Enabled { get; init; }
}
