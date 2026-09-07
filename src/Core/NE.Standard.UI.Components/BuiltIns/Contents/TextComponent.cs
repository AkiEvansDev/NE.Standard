using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// Text content: an optional leading icon, a title, a description and a badge, each on one line.
/// </summary>
/// <remarks>Neither line wraps; text meant to be read is <see cref="ParagraphComponent"/>.</remarks>
[UIComponentPropertyBlock(typeof(ITextMarkAlignmentComponent))]
public abstract partial class TextComponent<T>(string? id = null) : TextComponentBase<T>(id), ITextMarkAlignmentComponent
    where T : TextComponent<T>, IUIComponentDefinition
{
}

/// <summary>
/// Text content: an optional leading icon, a title, a description and a badge, each on one line.
/// </summary>
public sealed class TextComponent(string? id = null) : TextComponent<TextComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.text";
}
