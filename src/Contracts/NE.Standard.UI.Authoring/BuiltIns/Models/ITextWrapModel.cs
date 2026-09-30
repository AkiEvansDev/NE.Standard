using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Text whose lines may run on: whether the description wraps, and whether the title does too.
/// </summary>
public interface ITextWrapModel : ITextModel
{
    /// <summary>
    /// Gets whether the description wraps onto further lines or keeps one line and ends in an ellipsis; unset, a paragraph's and a
    /// header's wrap and a text's keeps its line.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextWrapComponent), DefaultValue = UITextWrapMode.Wrap)]
    UITextWrapMode? WrapMode { get; }

    /// <summary>
    /// Whether the title runs on to further lines too: a heading in prose (an article's headline, a dialog's question, a card's
    /// flavour line) that must not lose its end. Unset, the title keeps one line and ends in an ellipsis, as every interface heading does.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextWrapComponent), DefaultValue = false)]
    bool? TitleWrap { get; }
}
