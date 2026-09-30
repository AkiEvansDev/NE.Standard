using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns.Models;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A component carrying text whose description, and on request its title, may run over several lines.
/// </summary>
public interface ITextWrapComponent : ITextComponent, ITextWrapModel
{
    /// <summary>
    /// Gets the registered property key for <see cref="ITextWrapModel.WrapMode"/>.
    /// </summary>
    static UIProperty WrapModeProperty { get; } = new(nameof(WrapMode));

    /// <summary>
    /// Gets the registered property key for <see cref="ITextWrapModel.TitleWrap"/>.
    /// </summary>
    static UIProperty TitleWrapProperty { get; } = new(nameof(TitleWrap));
}
