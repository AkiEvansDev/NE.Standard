using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// What a title-and-description block is before it decides which of the two things it is.
/// </summary>
/// <remarks><c>TextComponent</c> adds <c>IconAlignment</c>, <c>ParagraphComponent</c> a clamp and a quote line, so neither can be the other's parent.</remarks>
[UIComponentPropertyBlock(typeof(ITextComponent))]
[UIComponentPropertyDefault(nameof(VerticalAlignment), nameof(DefaultVerticalAlignment))]
public abstract partial class TextComponentBase<T>(string? id = null) : VisualComponentBase<T>(id), ITextComponent
    where T : TextComponentBase<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<UIAlignment> DefaultVerticalAlignment = UIAlignment.Center;
}
