using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// Text meant to be read: a title and a description that may run to several lines.
/// </summary>
/// <remarks>No <c>IconAlignment</c>: a paragraph's glyph always sits beside the title.</remarks>
[UIComponentPropertyBlock(typeof(IParagraphComponent))]
public abstract partial class ParagraphComponent<T> : TextComponentBase<T>, IParagraphComponent
    where T : ParagraphComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes the paragraph aligned to the top of whatever it is placed in.
    /// </summary>
    protected ParagraphComponent(string? id = null) : base(id)
    {
        VerticalAlignment = UIAlignment.Start;
    }

    /// <summary>
    /// Sets the maximum number of lines the text can wrap to before truncating.
    /// </summary>
    public T SetMaxLines(int maxLines)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxLines);

        MaxLines = maxLines;
        return Self;
    }
}

/// <summary>
/// Text meant to be read: a title, and a description that may run to several lines.
/// </summary>
public sealed class ParagraphComponent(string? id = null) : ParagraphComponent<ParagraphComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.paragraph";
}
