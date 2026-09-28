using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

/// <summary>
/// Sends a change set to a runtime's attached instances, each as <see cref="IUIRuntime.ChangesFor"/> gives it: without what its
/// snapshot or its own write already holds.
/// </summary>
internal static class UIChangeDelivery
{
    public static async Task SendAsync(IUIUpdateSink sink, IUIRuntime runtime, UIHandle handle, IReadOnlyCollection<string> instanceIds, ServerChangeSet changes, CancellationToken cancellationToken)
    {
        List<string>? unaffected = null;

        foreach (var instanceId in instanceIds)
        {
            ServerChangeSet own = runtime.ChangesFor(instanceId, changes);

            if (ReferenceEquals(own, changes))
                (unaffected ??= []).Add(instanceId);
            else if (!own.IsEmpty)
                await sink.SendChangesAsync(handle, [instanceId], own, cancellationToken).ConfigureAwait(false);
        }

        if (unaffected is not null)
            await sink.SendChangesAsync(handle, unaffected, changes, cancellationToken).ConfigureAwait(false);
    }
}
