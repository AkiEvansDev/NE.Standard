using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// Represents a row-shaped input that can show a word at either end of the value — a currency sign, a unit.
/// </summary>
public interface IAffixTextInputComponent : IAffixedInputComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="PrefixText"/>.
    /// </summary>
    static UIProperty PrefixTextProperty { get; } = new UIProperty(nameof(PrefixText));

    /// <summary>
    /// Gets the registered property key for <see cref="SuffixText"/>.
    /// </summary>
    static UIProperty SuffixTextProperty { get; } = new UIProperty(nameof(SuffixText));

    /// <summary>
    /// Gets the text displayed before the value.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    string? PrefixText { get; }

    /// <summary>
    /// Gets the text displayed after the value.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    string? SuffixText { get; }
}
