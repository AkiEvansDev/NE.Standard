using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Text;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// One picture a <see cref="ShowImageEffect"/> shows: its address, and the words under it.
/// </summary>
public sealed class UILightboxImage
{
    /// <summary>
    /// Creates a picture from its address — a path of this site, http(s) or an image data URL — and, optionally, the words under it,
    /// the author's text or a phrase.
    /// </summary>
    /// <exception cref="ArgumentException">No picture may be fetched from <paramref name="source"/> (<see cref="UIUrlSafety.IsSafeImageSource"/>).</exception>
    [JsonConstructor]
    public UILightboxImage(string source, UIPhrase? caption = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(source);

        if (!UIUrlSafety.IsSafeImageSource(source))
            throw new ArgumentException($"No picture may be fetched from '{source}': a path of this site, http(s) or an image data URL is.", nameof(source));

        Source = source;
        Caption = caption;
    }

    /// <summary>Gets the picture's address.</summary>
    public string Source { get; }

    /// <summary>Gets the words under the picture, or <see langword="null"/> for none.</summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public UIPhrase? Caption { get; }

    /// <summary>Gets what a screen reader says for the picture; <see langword="null"/> says the caption, else nothing.</summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public UIPhrase? AltText { get; init; }
}
