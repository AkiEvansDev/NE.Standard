using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns.Models;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A component carrying text that is allowed to run over several lines, clamped to a number of them and set off as a quotation.
/// </summary>
public interface IParagraphComponent : ITextWrapComponent, IParagraphModel
{
    /// <summary>
    /// Gets the registered property key for <see cref="IParagraphModel.MaxLines"/>.
    /// </summary>
    static UIProperty MaxLinesProperty { get; } = new(nameof(MaxLines));

    static UIProperty ShowQuoteLineProperty { get; } = new(nameof(ShowQuoteLine));

    static UIProperty QuoteLineColorProperty { get; } = new(nameof(QuoteLineColor));
}
