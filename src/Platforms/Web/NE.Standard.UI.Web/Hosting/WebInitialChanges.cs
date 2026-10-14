using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Everything a freshly rendered page must be told: every bound value, plus one synthetic insert per bound collection. Applying
/// it twice must be a no-op, since an attach that does not start from the render sends it again.
/// </summary>
internal static class WebInitialChanges
{
    /// <summary>
    /// The page's change set; for the runtime the render prepared (<paramref name="pageId"/>), read in one hold with the sequence it
    /// stands at, which the page's first attach presents.
    /// </summary>
    public static async Task<UIRenderSnapshot> BuildAsync(IUIRuntime? runtime, string? pageId, IReadOnlyList<int> initBindingIds, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(initBindingIds);

        if (runtime is null)
            return new UIRenderSnapshot { Changes = ServerChangeSet.Empty };

        UIBindingId[] bindingIds = ToBindingIds(initBindingIds);

        if (pageId is not null)
            return await runtime.BuildRenderSnapshotAsync(pageId, bindingIds, cancellationToken).ConfigureAwait(false);

        ServerChangeSet valueChanges = await runtime.BuildInitialChangeSetAsync(bindingIds, cancellationToken).ConfigureAwait(false);
        IReadOnlyList<ServerCollectionChangeUIUpdate> collectionChanges = await runtime.BuildInitialCollectionChangesAsync(cancellationToken).ConfigureAwait(false);

        return new UIRenderSnapshot
        {
            Changes = collectionChanges.Count == 0 ? valueChanges : new ServerChangeSet { Updates = [.. valueChanges.Updates, .. collectionChanges] }
        };
    }

    /// <summary>The init bindings as the runtime takes them, from the numbers the render cache keeps.</summary>
    public static UIBindingId[] ToBindingIds(IReadOnlyList<int> initBindingIds)
    {
        ArgumentNullException.ThrowIfNull(initBindingIds);

        UIBindingId[] bindingIds = new UIBindingId[initBindingIds.Count];

        for (var i = 0; i < bindingIds.Length; i++)
            bindingIds[i] = new UIBindingId(initBindingIds[i]);

        return bindingIds;
    }
}
