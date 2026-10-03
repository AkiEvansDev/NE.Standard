using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Writes the page's state into its address in place: the route stays, the query becomes <see cref="Parameters"/>, and the current
/// history entry is replaced — no page load, no new runtime, nothing for the leave guard to ask about. A filter or a sort.
/// </summary>
/// <remarks>
/// The address is the one a reload or a copied link arrives with, so the controller reads the same parameters back in
/// <c>OnNavigatedAsync</c>. A parameter the route keys its runtime by (<c>route.Identity</c>) names another runtime.
/// </remarks>
public sealed class ReplaceAddressEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that replaces the page's query with <paramref name="parameters"/>; none leaves the bare route.
    /// </summary>
    public ReplaceAddressEffect(IReadOnlyDictionary<string, object?>? parameters)
    {
        Parameters = parameters ?? new Dictionary<string, object?>();

        foreach (var key in Parameters.Keys)
            ArgumentException.ThrowIfNullOrWhiteSpace(key, nameof(parameters));
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.ReplaceAddress;

    /// <summary>
    /// Gets the parameters the query is written from, as a <c>NavigateEffect</c>'s are: a collection repeats its key, a null is left out.
    /// </summary>
    public IReadOnlyDictionary<string, object?> Parameters { get; }
}
