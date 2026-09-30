using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// Text content: an optional leading icon, a title, a description and a badge, each on one line unless it is told to wrap.
/// </summary>
/// <remarks>
/// <c>SetWrapMode(Wrap)</c> lets the description run on, as a card's and an expander's header do by default, and <c>SetTitleWrap(true)</c>
/// the title; text clamped to a number of lines, or set off as a quotation, is <see cref="ParagraphComponent"/>.
/// </remarks>
[UIComponentPropertyBlock(typeof(ITextMarkAlignmentComponent))]
[UIComponentPropertyBlock(typeof(ITextWrapComponent))]
[UIComponentPropertyDefault(nameof(ITextWrapModel.WrapMode), nameof(DefaultWrapMode))]
public abstract partial class TextComponent<T>(string? id = null) : TextComponentBase<T>(id), ITextMarkAlignmentComponent, ITextWrapComponent
    where T : TextComponent<T>, IUIComponentDefinition
{
    // A text stands beside something and keeps its line, so nothing it is next to moves; a paragraph's description runs.
    private const UITextWrapMode DefaultWrapMode = UITextWrapMode.NoWrap;
}

/// <summary>
/// Text content: an optional leading icon, a title, a description and a badge, each on one line unless it is told to wrap.
/// </summary>
public sealed class TextComponent(string? id = null) : TextComponent<TextComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.text";
}
