using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Text that is allowed to run: the same title and description as <see cref="ITextModel"/>, plus how it wraps
/// and how many lines it may take.
/// </summary>
public interface IParagraphModel : ITextModel
{
    /// <summary>
    /// Gets the text wrapping behavior.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IParagraphComponent), DefaultValue = UITextWrapMode.Wrap)]
    UITextWrapMode? WrapMode { get; }

    /// <summary>
    /// Gets the maximum number of rendered text lines.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IParagraphComponent), DefaultValue = null, GenerateSetter = false)]
    int? MaxLines { get; }

    /// <summary>Whether a line stands beside the description, the way a quotation is set off; the description moves in behind it.</summary>
    [UIComponentProperty(Contract = typeof(IParagraphComponent), DefaultValue = false)]
    bool? ShowQuoteLine { get; }

    /// <summary>The quote line's colour; unset, a faint line in the text's own colour.</summary>
    [UIComponentProperty(Contract = typeof(IParagraphComponent), DefaultValue = null)]
    UIThemeColor? QuoteLineColor { get; }
}
