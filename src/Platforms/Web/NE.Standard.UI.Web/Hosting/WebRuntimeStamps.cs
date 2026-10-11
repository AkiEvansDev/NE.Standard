using System;
using System.Runtime.CompilerServices;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Which runtime each attached page's handle belongs to, so what is pushed to a connection names the runtime that sent it: a page
/// that went to another runtime of its route over the same connection drops what the one it left still had on its way.
/// </summary>
/// <remarks>
/// Keyed by the handle the attach made, which every push of that runtime to that page carries — its changes as the runtime's own
/// handle, a command's result as its invoker's. A handle never moves between runtimes, and the table lets it go with the handle.
/// </remarks>
internal sealed class WebRuntimeStamps
{
    private readonly ConditionalWeakTable<UIHandle, string> _runtimes = [];

    /// <summary>Records the runtime an attach answered with as its handle's.</summary>
    public void Remember(UIHandle handle, string runtimeId)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentException.ThrowIfNullOrWhiteSpace(runtimeId);

        _runtimes.AddOrUpdate(handle, runtimeId);
    }

    /// <summary>The runtime the handle was attached to, or none for a handle no attach of this hub made (a render's own).</summary>
    public string? Of(UIHandle handle)
    {
        ArgumentNullException.ThrowIfNull(handle);

        return _runtimes.TryGetValue(handle, out var runtimeId) ? runtimeId : null;
    }
}
