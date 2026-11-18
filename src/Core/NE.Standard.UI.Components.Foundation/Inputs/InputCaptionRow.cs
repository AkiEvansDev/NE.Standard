using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>An input's caption row (<see cref="ICaptionRowComponent"/>), the same for the plain and the templated input bases and a package's input.</summary>
public static class InputCaptionRow
{
    /// <summary>Returns the input's box size at <paramref name="tier"/> when a non-optional caption or header action stands above it, or <see langword="null"/>.</summary>
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
        if (!HasHeaderAction(input) && (IsTitleInside(input, honoursInside) || !ShowsCaption(input)))
            return null;

        return input is ISizedInputComponent { Size: UIResponsive<UISize> size } ? size.Resolve(tier) : UISize.Medium;
    }

    private static bool HasHeaderAction(IInputComponent input)
        => (input is IRegionContainerComponent { HasRegions: true } regions && regions.Regions.ContainsKey(RegionNames.HeaderAction))
            || input is IExpandableInputComponent { Expandable: true, ShowExpandButton: not false };

    /// <summary>Whether the input's caption stands inside its box: asked for, by a box that takes one.</summary>
    private static bool IsTitleInside(IInputComponent input, bool honoursInside)
        => honoursInside && input is IFieldInputComponent { TitlePlacement: UIInputTitlePlacement.Inside };

    private static bool ShowsCaption<TInput>(TInput input)
        where TInput : IInputComponent, ITextBaseComponent
        => input.Title is not null || input.Icon is not null || input.BadgeTitle is not null || input.BadgeIcon is not null
            || input.HasNonOptionalBinding(ITextBaseComponent.TitleProperty) || input.HasNonOptionalBinding(ITextBaseComponent.IconProperty)
            || input.HasNonOptionalBinding(ITextBaseComponent.BadgeTitleProperty) || input.HasNonOptionalBinding(ITextBaseComponent.BadgeIconProperty);
}
