using System;
using System.Net;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>
/// What the platform knows about the connection a page came over: where it came from, what it runs in and where it was served.
/// </summary>
/// <remarks>
/// Captured when the page is rendered and each time it attaches, and read by a controller (<see cref="UIContext.Connection"/>) and
/// by view and command filters — a sign-in throttle by address, an audit line, a "your devices" page, an absolute link. Every part
/// is what the client or a proxy said, so it describes a request and never proves one.
/// </remarks>
public sealed record UIConnectionInfo
{
    /// <summary>What a platform that knows nothing of its connections answers.</summary>
    public static UIConnectionInfo Unknown { get; } = new();

    /// <summary>Gets the address the connection came from, after the host's forwarded-headers handling, when known.</summary>
    public IPAddress? RemoteAddress { get; init; }

    /// <summary>Gets what the client says it runs in — the web's <c>User-Agent</c> — when it says.</summary>
    public string? UserAgent { get; init; }

    /// <summary>Gets the address the application was served from — scheme, host and base path, ending in <c>/</c> — when known.</summary>
    /// <remarks>What an absolute link the application hands out (an invite, a password reset) is built on.</remarks>
    public Uri? BaseUri { get; init; }
}
