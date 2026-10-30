using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>An input's caption row (<see cref="ICaptionRowComponent"/>), the same for the plain and the templated input bases and a package's input.</summary>
public static class InputCaptionRow
{
    /// <summary>
    /// The input's box size at <paramref name="tier"/> where a caption stands over it — a title, an icon or a badge, written or bound by a
    /// binding that must resolve — or null: a title inside the box, or nothing to show. An optional binding (a template's) may resolve to
    /// nothing, and the caption's row is drawn only for words it has.
    /// </summary>
    public static UISize? Box<TInput>(TInput input, UIResponsiveTier tier)
        where TInput : IInputComponent, ITextBaseComponent
        => Box(input, tier, honoursInside: true);

    /// <summary>
    /// <see cref="Box{TInput}(TInput, UIResponsiveTier)"/> for an input that says whether its box takes a caption inside at all: a
    /// multi-line field's keeps it on top whatever <see cref="IFieldInputComponent.TitlePlacement"/> asks, as its renderer draws it.
    /// </summary>
    public static UISize? Box<TInput>(TInput input, UIResponsiveTier tier, bool honoursInside)
        where TInput : IInputComponent, ITextBaseComponent
    {
        if (IsTitleInside(input, honoursInside) || !ShowsCaption(input))
            return null;

        return input is ISizedInputComponent { Size: UIResponsive<UISize> size } ? size.Resolve(tier) : UISize.Medium;
    }

    /// <summary>Whether the input's caption stands inside its box: asked for, by a box that takes one.</summary>
    private static bool IsTitleInside(IInputComponent input, bool honoursInside)
        => honoursInside && input is IFieldInputComponent { TitlePlacement: UIInputTitlePlacement.Inside };

    private static bool ShowsCaption<TInput>(TInput input)
        where TInput : IInputComponent, ITextBaseComponent
        => input.Title is not null || input.Icon is not null || input.BadgeTitle is not null || input.BadgeIcon is not null
            || Binds(input, ITextBaseComponent.TitleProperty) || Binds(input, ITextBaseComponent.IconProperty)
            || Binds(input, ITextBaseComponent.BadgeTitleProperty) || Binds(input, ITextBaseComponent.BadgeIconProperty);

    private static bool Binds(IVisualComponent component, UIProperty property)
    {
        foreach (UIBinding binding in component.Bindings)
        {
            if (binding.Target.Equals(property) && !binding.Optional)
                return true;
        }

        return false;
    }
}
