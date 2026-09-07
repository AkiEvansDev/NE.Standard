using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns.Models;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A component carrying text content — a title and a description, each on one line.
/// </summary>
public interface ITextComponent : ITextBaseComponent, ITextModel
{
    /// <summary>
    /// Gets the registered property key for <see cref="ITextModel.Description"/>.
    /// </summary>
    static UIProperty DescriptionProperty { get; } = new(nameof(Description));

    /// <summary>
    /// Gets the registered property key for <see cref="ITextModel.DescriptionType"/>.
    /// </summary>
    static UIProperty DescriptionTypeProperty { get; } = new(nameof(DescriptionType));

    /// <summary>
    /// Gets the registered property key for <see cref="ITextModel.DescriptionColor"/>.
    /// </summary>
    static UIProperty DescriptionColorProperty { get; } = new(nameof(DescriptionColor));

    /// <summary>
    /// Gets the registered property key for <see cref="ITextModel.TextAlignment"/>.
    /// </summary>
    static UIProperty TextAlignmentProperty { get; } = new(nameof(TextAlignment));
}
