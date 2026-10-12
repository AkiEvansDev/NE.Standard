using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A control that switches one of the page's settings in place — the theme, the language: a button for a page's head or a field for a
/// settings form, the button's look, the field's caption and appearance, and the size of its glyphs.
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
    /// Gets the registered property key for <see cref="Variant"/>.
    /// </summary>
    static UIProperty VariantProperty { get; } = new(nameof(Variant));

    /// <summary>
    /// Gets the registered property key for <see cref="Title"/>, a field's caption's key.
    /// </summary>
    static UIProperty TitleProperty { get; } = new(nameof(Title));

    /// <summary>
    /// Gets the registered property key for <see cref="Appearance"/>, a field's appearance's key.
    /// </summary>
    static UIProperty AppearanceProperty { get; } = new(nameof(Appearance));

    /// <summary>
    /// Gets whether it is a button for a page's head or a field for a settings form; decided once at render.
    /// </summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = UISwitcherVariant.Button)]
    UISwitcherVariant? Variant { get; }

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

    /// <summary>
    /// Gets the field's caption; unset, the framework's word for the setting ("Theme", "Language"). The button has none. Decided at
    /// render, as a key or the author's text: a bound caption pushed empty would leave the field unnamed.
    /// </summary>
    [Translatable]
    [UIComponentProperty(IsBindable = false)]
    UIPhrase? Title { get; }

    /// <summary>
    /// Gets how the field's box is drawn, as an input's is: <see cref="UIInputAppearance.Tonal"/> unless set. The button has its
    /// <see cref="Type"/> instead.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIInputAppearance.Tonal)]
    UIInputAppearance? Appearance { get; }
}
