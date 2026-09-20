using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

/// <summary>
/// Sends a change set to a runtime's attached instances, each without the values it already holds.
/// </summary>
internal static class UIChangeDelivery
{
    public static async Task SendAsync(IUIUpdateSink sink, UIHandle handle, IReadOnlyCollection<string> instanceIds, ServerChangeSet changes, CancellationToken cancellationToken)
    {
        if (!changes.HasExceptions)
        {
            await sink.SendChangesAsync(handle, instanceIds, changes, cancellationToken).ConfigureAwait(false);
            return;
        }

        List<string>? unaffected = null;

        foreach (var instanceId in instanceIds)
        {
            ServerChangeSet own = changes.For(instanceId);

            if (ReferenceEquals(own, changes))
                (unaffected ??= []).Add(instanceId);
            else if (!own.IsEmpty)
                await sink.SendChangesAsync(handle, [instanceId], own, cancellationToken).ConfigureAwait(false);
        }

        if (unaffected is not null)
            await sink.SendChangesAsync(handle, unaffected, changes, cancellationToken).ConfigureAwait(false);
    }
}
