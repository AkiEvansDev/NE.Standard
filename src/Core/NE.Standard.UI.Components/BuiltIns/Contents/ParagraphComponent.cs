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
    /// Gets or sets whether the paragraph is the note under the field before it — what may be typed, what it is for — set back to
    /// start where that field's words and its message do.
    /// </summary>
    /// <remarks>Render-time only: where a note stands is how the form is built.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = false)]
    public bool? FieldNote { get; set; }

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
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.paragraph";
}
