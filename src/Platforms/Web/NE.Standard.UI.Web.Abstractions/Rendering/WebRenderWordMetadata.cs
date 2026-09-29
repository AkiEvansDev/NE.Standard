using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// A translatable value the page was rendered with rather than bound to — a key or a <see cref="UIPhrase"/> — so a language
/// switch writes it again in place.
/// </summary>
public sealed class WebRenderWordMetadata
{
    /// <summary>Gets the component whose instances show the value.</summary>
    public required UIComponentId ComponentId { get; init; }

    /// <summary>Gets the property definition the value is written by, as the page's metadata names it.</summary>
    public required string PropertyId { get; init; }

    /// <summary>
    /// Gets the keys of the rows the value belongs to, outermost first — only the inner rows' for a value read off an item inside a
    /// template, which the page matches from the innermost; empty for a value every instance of the component shares.
    /// </summary>
    public IReadOnlyList<object?> DynamicParameters { get; init; } = [];

    /// <summary>Gets the key, a <see cref="string"/> or a <see cref="UIPhrase"/>.</summary>
    public required object Key { get; init; }

    /// <summary>Refuses a word with no component, property or key.</summary>
    public void Validate()
    {
        if (ComponentId.IsEmpty)
            throw new InvalidOperationException("Word component id is required.");

        ArgumentException.ThrowIfNullOrWhiteSpace(PropertyId);
        ArgumentNullException.ThrowIfNull(DynamicParameters);

        if (Key is not (string or UIPhrase))
            throw new InvalidOperationException("A word's key is a string or a phrase.");
    }
}
