using System.Diagnostics.CodeAnalysis;

namespace NE.Standard.UI.Primitives.Text;

/// <summary>
/// One run of text with the styles and link that apply to it, a mark standing alone when <see cref="Icon"/> is set, or a
/// fold when <see cref="Fold"/> is set — its caption, with the run's <see cref="Text"/> holding the folded markup unparsed.
/// </summary>
[SuppressMessage("Design", "CA1054:URI-like parameters should not be strings", Justification = "The value is written verbatim as a link target and has already been checked by UIInlineMarkup.IsSafeUrl; it is routinely a fragment or a relative path, which Uri does not model without a base.")]
[SuppressMessage("Design", "CA1056:URI-like properties should not be strings", Justification = "Same as the constructor parameter above.")]
public readonly record struct UIInlineSegment(string Text, UIInlineStyles Styles, string? Url, string? Icon = null, string? Fold = null)
{
    /// <summary>
    /// Whether the run is plain text with no link — the case a renderer can write out directly.
    /// </summary>
    public bool IsPlain => Styles == UIInlineStyles.None && Url is null && Icon is null && Fold is null;

    /// <summary>
    /// Whether the run is a mark rather than words; its <see cref="Text"/> is always empty.
    /// </summary>
    public bool IsIcon => Icon is not null;

    /// <summary>
    /// Whether the run is a fold: <see cref="Fold"/> is the caption the reader presses, <see cref="Text"/> the markup it unfolds.
    /// </summary>
    public bool IsFold => Fold is not null;
}
