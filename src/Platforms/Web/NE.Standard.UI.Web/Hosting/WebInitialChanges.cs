using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Everything a freshly rendered page has to be told: every bound value, and one synthetic insert per bound
/// collection; applying it twice must be a no-op, since both the shell render and the attach send it.
/// </summary>
internal static class WebInitialChanges
{
    public static async Task<ServerChangeSet> BuildAsync(IUIRuntime? runtime, IReadOnlyList<int> initBindingIds, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(initBindingIds);

        if (runtime is null)
            return ServerChangeSet.Empty;

        ServerChangeSet valueChanges = await runtime.BuildInitialChangeSetAsync(
            [.. initBindingIds.Select(static bindingId => new UIBindingId(bindingId))],
            cancellationToken
        ).ConfigureAwait(false);

        IReadOnlyList<ServerCollectionChangeUIUpdate> collectionChanges = await runtime.BuildInitialCollectionChangesAsync(cancellationToken).ConfigureAwait(false);

        return collectionChanges.Count == 0
            ? valueChanges
            : new ServerChangeSet { Updates = [.. valueChanges.Updates, .. collectionChanges] };
    }
}
