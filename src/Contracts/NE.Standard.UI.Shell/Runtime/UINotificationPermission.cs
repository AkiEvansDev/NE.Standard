namespace NE.Standard.UI.Shell.Runtime;

/// <summary>Whether a page's browser lets it show system notifications, as the page reports it.</summary>
/// <remarks>A fact of one browser on one device, not of the reader: the same account may be granted on one and asked on another.</remarks>
public enum UINotificationPermission
{
    /// <summary>The page shows none, or reported nothing: a browser without them, a page not served over https (localhost aside), a platform that does not report.</summary>
    Unsupported,

    /// <summary>Not asked yet: a <c>RequestNotificationPermissionEffect</c>, raised in the reader's own press, asks.</summary>
    Default,

    /// <summary>The reader allowed them.</summary>
    Granted,

    /// <summary>The reader refused them; only the browser's settings undo it, so the page says so rather than asks again.</summary>
    Denied
}
