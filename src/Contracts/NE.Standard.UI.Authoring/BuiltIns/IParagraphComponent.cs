using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns.Models;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A component carrying text that is allowed to run over several lines.
/// </summary>
public interface IParagraphComponent : ITextComponent, IParagraphModel
{
    /// <summary>
    /// Gets the registered property key for <see cref="IParagraphModel.WrapMode"/>.
    /// </summary>
    static UIProperty WrapModeProperty { get; } = new(nameof(WrapMode));

    /// <summary>
    /// Gets the registered property key for <see cref="IParagraphModel.MaxLines"/>.
    /// </summary>
    static UIProperty MaxLinesProperty { get; } = new(nameof(MaxLines));

    static UIProperty ShowQuoteLineProperty { get; } = new(nameof(ShowQuoteLine));

    static UIProperty QuoteLineColorProperty { get; } = new(nameof(QuoteLineColor));
}
