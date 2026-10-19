using System;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Abstractions.Items;

/// <summary>
/// One value a field may hold: the raw wire value (an enum member's name, <c>true</c>/<c>false</c>) and the caption
/// the page shows for it.
/// </summary>
public sealed record UIChoice
{
    /// <summary>
    /// Creates a choice from its wire value and the caption shown for it; a string is the author's text, a key with arguments a phrase.
    /// </summary>
    public UIChoice(string value, UIPhrase caption)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);
        ArgumentNullException.ThrowIfNull(caption);

        Value = value;
        Caption = caption;
    }

    /// <summary>
    /// Gets the raw wire value.
    /// </summary>
    public string Value { get; }

    /// <summary>
    /// Gets the caption the page shows for the value.
    /// </summary>
    public UIPhrase Caption { get; }
}
