using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// Represents a field input whose field is a single row, so a glyph can stand beside the text. A text area's
/// field is a box rather than a row and is deliberately not part of it — an icon at the start of a paragraph
/// has nowhere to be.
/// </summary>
/// <remarks>
/// These are icon names and nothing else: no size, no colour. The field decides both, so the pair always
/// matches the text it stands next to. The captioned icon with a size and a colour of its own is
/// <c>ITextBaseComponent.Icon</c>, and it belongs to the label rather than to the field.
/// </remarks>
public interface IAffixedInputComponent : IFieldInputComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="PrefixIcon"/>.
    /// </summary>
    static UIProperty PrefixIconProperty { get; } = new(nameof(PrefixIcon));

    /// <summary>
    /// Gets the registered property key for <see cref="SuffixIcon"/>.
    /// </summary>
    static UIProperty SuffixIconProperty { get; } = new(nameof(SuffixIcon));

    /// <summary>
    /// Gets the icon shown at the start of the field.
    /// </summary>
    string? PrefixIcon { get; }

    /// <summary>
    /// Gets the icon shown at the end of the field, before whatever control the input keeps there.
    /// </summary>
    string? SuffixIcon { get; }
}
