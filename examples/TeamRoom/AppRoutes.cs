namespace TeamRoom;

/// <summary>
/// Every address of the application, declared once so the registration, the sidebar and the redirects agree.
/// </summary>
public static class AppRoutes
{
    public const string Files = "/";
    public const string Chat = "/chat";
    public const string Accounts = "/accounts";
    public const string Settings = "/settings";
    public const string SignIn = "/sign-in";
    public const string Forbidden = "/forbidden";

    /// <summary>The query parameter that names the conversation a chat page shows — part of the route's identity.</summary>
    public const string ConversationParameter = "c";

    public static string ChatFor(string conversationId)
        => $"{Chat}?{ConversationParameter}={System.Uri.EscapeDataString(conversationId)}";
}
