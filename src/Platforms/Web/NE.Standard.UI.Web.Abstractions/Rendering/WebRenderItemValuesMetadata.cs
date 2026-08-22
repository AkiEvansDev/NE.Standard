using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// The item values behind a server-rendered items host, so client-side filtering, sorting and grouping can
/// read them.
/// </summary>
/// <remarks>
/// Only ever carries author-declared data: an items collection is rendered server-side exactly when it
/// resolves statically (see <c>ItemsCollectionRendererBase.ResolveItems</c> and <c>docs/PROJECT.md</c> §5),
/// and controller state never reaches that path. That is what makes it safe to sit in the cached render
/// blob, which is keyed by view and language and shared across users.
/// <para>
/// The whole item travels rather than just the properties the rules name, because <c>ItemsView</c> can
/// itself be bound — the rules can change at runtime, so which properties matter is not knowable here.
/// </para>
/// </remarks>
public sealed class WebRenderItemValuesMetadata
{
    public required UIComponentId ComponentId { get; init; }

    public required IReadOnlyList<WebRenderItemValue> Items { get; init; }

    public void Validate()
    {
        if (ComponentId.IsEmpty)
            throw new InvalidOperationException("Item values component id must not be empty.");

        ArgumentNullException.ThrowIfNull(Items);

        for (var i = 0; i < Items.Count; i++)
            Items[i].Validate();
    }
}
