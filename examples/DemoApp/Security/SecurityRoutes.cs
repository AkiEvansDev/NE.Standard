namespace DemoApp.Security;

/// <summary>
/// Routes of the security demo, declared once so the startup registration, the sign-in redirect and the links
/// between the pages cannot drift apart.
/// </summary>
internal static class SecurityRoutes
{
    public const string SignIn = "/security/sign-in";
    public const string Account = "/security/account";
    public const string Reports = "/security/reports";
    public const string Forbidden = "/security/forbidden";
}
