namespace NE.Standard.UI.Desktop.Hosting;

/// <summary>Specifies how a desktop window connects to its <c>NE.Standard.UI.Web</c> host.</summary>
public enum DesktopHostMode
{
    /// <summary>Starts an in-process HTTPS HTTP/2 loopback web host bound to <c>127.0.0.1:0</c> for the lifetime of the application.</summary>
    InProcess,

    /// <summary>Connects directly to an external server configured on <see cref="DesktopHostOptions.ServerUri"/>.</summary>
    Remote
}
