using System;

namespace NE.Standard.UI.Desktop.Hosting;

/// <summary>Reports a system toast notification shown by <see cref="DesktopShellControl"/>.</summary>
public sealed class DesktopNotificationShownEventArgs : EventArgs
{
    private readonly Action _activate;
    private readonly Action _dismiss;

    internal DesktopNotificationShownEventArgs(string title, string? body, string? tag, bool silent, bool requireInteraction, Action activate, Action dismiss)
    {
        Title = title ?? throw new ArgumentNullException(nameof(title));
        Body = body;
        Tag = tag;
        Silent = silent;
        RequireInteraction = requireInteraction;
        _activate = activate ?? throw new ArgumentNullException(nameof(activate));
        _dismiss = dismiss ?? throw new ArgumentNullException(nameof(dismiss));
    }

    /// <summary>Gets the notification title.</summary>
    public string Title { get; }

    /// <summary>Gets the optional notification body text.</summary>
    public string? Body { get; }

    /// <summary>Gets the optional replacement tag.</summary>
    public string? Tag { get; }

    /// <summary>Gets whether notification audio is suppressed.</summary>
    public bool Silent { get; }

    /// <summary>Gets whether the notification remains on screen until user interaction.</summary>
    public bool RequireInteraction { get; }

    /// <summary>Activates the notification as if the user clicked it in the system notification center.</summary>
    public void Activate()
        => _activate();

    /// <summary>Dismisses the notification from the system notification center.</summary>
    public void Dismiss()
        => _dismiss();
}
