using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A control that switches one of the page's settings in place — the theme, the language: a button for a page's head or a field for a
/// settings form, the button's look, the field's caption and skin, and the size of its glyphs.
/// </summary>
public interface ISwitcherComponent : ICaptionRowComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="ButtonVariant"/>.
    /// </summary>
    static UIProperty ButtonVariantProperty { get; } = new(nameof(ButtonVariant));

    /// <summary>
    /// Gets the registered property key for <see cref="Size"/>.
    /// </summary>
    static UIProperty SizeProperty { get; } = new(nameof(Size));

    /// <summary>The button size when unset: medium.</summary>
    static UIResponsive<UISize> DefaultSize { get; } = UISize.Medium;

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
    /// Gets the registered property key for <see cref="FieldVariant"/>.
    /// </summary>
    static UIProperty FieldVariantProperty { get; } = new(nameof(FieldVariant));

    /// <summary>
    /// Gets whether it is a button for a page's head or a field for a settings form; decided once at render.
    /// </summary>
    /// <remarks>
    /// The field draws its edge on its box, as a select does; <see cref="ButtonVariant"/>, <c>Padding</c>, <c>Background</c> and
    /// <c>BackgroundImage*</c> are the button's alone.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = UISwitcherVariant.Button)]
    UISwitcherVariant? Variant { get; }

    /// <summary>
    /// Gets the button's look; a quiet ghost by default, as a page header's switch is. Not <see cref="Variant"/>, which picks button or
    /// field.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIButtonVariant.Ghost)]
    UIButtonVariant? ButtonVariant { get; }

    /// <summary>
    /// Gets the button size — the box the glyph and the words sit in.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultSize))]
    UIResponsive<UISize>? Size { get; }

    /// <summary>
    /// Gets the size the glyphs are drawn at.
    /// </summary>
    [UIComponentProperty]
    UISize? IconSize { get; }

    /// <summary>
    /// Gets the field's caption; unset, the framework's word for the setting ("Theme", "Language"). The button has none. Decided at
    /// render, as a key or the author's text: a bound caption pushed empty would leave the field unnamed.
    /// </summary>
    [Translatable]
    [UIComponentProperty(IsBindable = false)]
    UIPhrase? Title { get; }

    /// <summary>
    /// Gets the field's skin, drawn as an input's appearance is: <see cref="UIInputAppearance.Filled"/> unless set. The button has its
    /// <see cref="ButtonVariant"/> instead.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIInputAppearance.Filled)]
    UIInputAppearance? FieldVariant { get; }
}
