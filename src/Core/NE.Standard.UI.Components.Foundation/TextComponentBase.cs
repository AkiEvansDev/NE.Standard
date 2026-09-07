using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// What a title-and-description block is before it decides which of the two things it is.
/// </summary>
/// <remarks><c>TextComponent</c> adds <c>IconAlignment</c>, <c>ParagraphComponent</c> adds wrapping, so neither can be the other's parent.</remarks>
[UIComponentPropertyBlock(typeof(ITextComponent))]
public abstract partial class TextComponentBase<T> : VisualComponentBase<T>, ITextComponent
    where T : TextComponentBase<T>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes the block stretched across its column and centred in its row.
    /// </summary>
    protected TextComponentBase(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Stretch;
        VerticalAlignment = UIAlignment.Center;
    }
}
