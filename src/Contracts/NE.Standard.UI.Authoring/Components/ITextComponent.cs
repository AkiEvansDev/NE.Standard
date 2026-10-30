using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A component carrying text content — a title and a description, each on one line unless it is an <see cref="ITextWrapComponent"/>.
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

    /// <summary>
    /// Gets the registered property key for <see cref="DescriptionPlain"/>.
    /// </summary>
    static UIProperty DescriptionPlainProperty { get; } = new(nameof(DescriptionPlain));

    /// <summary>
    /// Gets whether the description is shown as written, its asterisks, brackets and braces as characters, rather than read as inline
    /// markup: words a person typed — a chat's message, an error's text from an address — bound to it; unset, it is markup.
    /// </summary>
    /// <remarks>Render-time only: the first paint and every value pushed later are written the same way.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = false)]
    bool? DescriptionPlain { get; }

    /// <summary>
    /// Gets the registered property key for <see cref="DescriptionAutolinks"/>.
    /// </summary>
    static UIProperty DescriptionAutolinksProperty { get; } = new(nameof(DescriptionAutolinks));

    /// <summary>
    /// Gets whether a bare <c>http://</c> or <c>https://</c> address in the description is a link, as <c>[words](address)</c> is;
    /// unset, it is text. <see cref="DescriptionPlain"/> wins over it.
    /// </summary>
    /// <remarks>
    /// Render-time only: the first paint and every value pushed later are read the same way. An address in a phrase's argument
    /// links too, escaped or not.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = false)]
    bool? DescriptionAutolinks { get; }

    /// <summary>
    /// Gets the registered property key for <see cref="HeadingLevel"/>.
    /// </summary>
    static UIProperty HeadingLevelProperty { get; } = new(nameof(HeadingLevel));

    /// <summary>
    /// Gets the heading level (1 through 6) the title stands at in the page's outline; unset, the title is plain text.
    /// </summary>
    /// <remarks>Render-time only: the title's element (<c>h1</c> through <c>h6</c>) is chosen when the block is drawn.</remarks>
    [UIComponentProperty(IsBindable = false)]
    int? HeadingLevel { get; }
}
