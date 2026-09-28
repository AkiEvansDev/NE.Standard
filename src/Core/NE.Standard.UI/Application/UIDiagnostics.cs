namespace NE.Standard.UI.Application;

/// <summary>
/// The name the framework's meter and activity source go by — <c>AddMeter(UIDiagnostics.Name)</c> and
/// <c>AddSource(UIDiagnostics.Name)</c> in OpenTelemetry.
/// </summary>
/// <remarks>
/// <para>
/// The meter reports what the host holds — <c>ne.ui.runtimes</c> (the runtimes held now), <c>ne.ui.runtimes.attached</c> (the
/// pages open now), <c>ne.ui.updates.pending</c> (change sets waiting to be sent), <c>ne.ui.sessions</c> and <c>ne.ui.files</c>
/// with <c>ne.ui.files.size</c> (for the default in-memory session store and on-disk file store) — and what it did:
/// <c>ne.ui.runtimes.created</c>, <c>ne.ui.runtime.start.duration</c>, <c>ne.ui.command.duration</c> (tagged with the route
/// template and <c>ok</c> or <c>failed</c>), <c>ne.ui.flush.duration</c> and <c>ne.ui.flush.failures</c>. The web platform adds
/// its own under the same name (<c>ne.ui.web.*</c>). The process's CPU, memory and collections are the runtime's own
/// <c>System.Runtime</c> meter.
/// </para>
/// <para>
/// The activity source starts a <c>ui.command</c> span around each command. At <c>Debug</c> the log says how long each step took:
/// a compile, a resolution, an attach, a command, a change set, an item window, a flush pass, and on the web a page render, a
/// render cache read or write off the disk and a file transfer.
/// </para>
/// </remarks>
public static class UIDiagnostics
{
    /// <summary>The meter's and the activity source's name.</summary>
    public const string Name = "NE.Standard.UI";
}
