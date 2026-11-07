using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Writes the page's state into its address as a new history entry: the route stays, the query becomes <see cref="Parameters"/> — no
/// page load, no new runtime, nothing for the leave guard to ask about. An item opened, which Back closes.
/// </summary>
/// <remarks>
/// Back or Forward to an entry of the same route runs the controller's <c>OnNavigatedAsync</c> with that entry's parameters on the
/// same runtime, without a reload and without the view filters; the controller decides what a parameter gone means. A parameter the
/// route keys its runtime by (<c>route.Identity</c>) names another runtime, and going back to it loads that page.
/// </remarks>
public sealed class PushAddressEffect(IReadOnlyDictionary<string, object?>? parameters) : ClientEffect
{
    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.PushAddress;

    /// <summary>
    /// Gets the parameters the query is written from, as a <c>NavigateEffect</c>'s are: a collection repeats its key, a null is left out.
    /// </summary>
    public IReadOnlyDictionary<string, object?> Parameters { get; } = NormalizeParameters(parameters);

    internal static IReadOnlyDictionary<string, object?> NormalizeParameters(IReadOnlyDictionary<string, object?>? parameters)
    {
        IReadOnlyDictionary<string, object?> normalized = parameters ?? new Dictionary<string, object?>();

        foreach (var key in normalized.Keys)
            ArgumentException.ThrowIfNullOrWhiteSpace(key, nameof(parameters));

        return normalized;
    }
}
