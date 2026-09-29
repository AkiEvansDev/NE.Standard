using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A button that switches one of the page's settings in place — the theme, the language: its look and the size of its glyphs.
/// </summary>
public interface ISwitcherComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Type"/>.
    /// </summary>
    static UIProperty TypeProperty { get; } = new(nameof(Type));

    /// <summary>
    /// Gets the registered property key for <see cref="Size"/>.
    /// </summary>
    static UIProperty SizeProperty { get; } = new(nameof(Size));

    /// <summary>
    /// Gets the registered property key for <see cref="IconSize"/>.
    /// </summary>
    static UIProperty IconSizeProperty { get; } = new(nameof(IconSize));

    /// <summary>
    /// Gets the button style; a quiet ghost by default, as a page header's switch is.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIButtonType.Ghost)]
    UIButtonType? Type { get; }

    /// <summary>
    /// Gets the button size — the box the glyph and the words sit in.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIButtonSize.Medium)]
    UIButtonSize? Size { get; }

    /// <summary>
    /// Gets the size the glyphs are drawn at.
    /// </summary>
    [UIComponentProperty]
    UIIconSize? IconSize { get; }
}
