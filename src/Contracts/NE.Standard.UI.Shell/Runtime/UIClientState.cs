namespace NE.Standard.UI.Shell.Runtime;

/// <summary>What a connection's page reports of itself: whether it is on screen, and what the browser lets it show.</summary>
/// <remarks>
/// Reported as the page attaches and again as either changes; what the client says, so it steers what is shown, never what is
/// allowed. <see cref="UIHandle.ClientState"/> holds the last report.
/// </remarks>
public sealed record UIClientState(bool IsVisible, UINotificationPermission NotificationPermission)
{
    /// <summary>A page that reports nothing — a render, a platform that does not report: on screen, with no system notifications.</summary>
    public static UIClientState Unreported { get; } = new(IsVisible: true, UINotificationPermission.Unsupported);
}
