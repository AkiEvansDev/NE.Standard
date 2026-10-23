using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A component that may draw a field's caption row over its box — a titled input, a switcher drawn as a field, a panel led by one —
/// beside which a thing with no caption stands level with the box (<see cref="UIFieldBoxes"/>).
/// </summary>
public interface ICaptionRowComponent : IVisualComponent
{
    /// <summary>The size of the box its caption row stands over at <paramref name="tier"/>, or null where it draws none there.</summary>
    UIInputSize? CaptionRowBox(UIResponsiveTier tier);
}
