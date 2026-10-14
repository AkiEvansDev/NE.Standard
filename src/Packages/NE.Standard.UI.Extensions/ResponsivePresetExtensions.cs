using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>A component shown on one side of a breakpoint only: a Back a phone needs beside a tree a desktop shows, a drawer's toggle.</summary>
public static class ResponsivePresetExtensions
{
    /// <summary>Shown below <paramref name="tier"/> and collapsed from it on.</summary>
    public static T ShownBelow<T>(this T component, UIResponsiveTier tier) where T : VisualComponentBase<T>, IUIComponentDefinition
        => component.SetVisibility(Split(tier, UIVisibility.Visible, UIVisibility.Collapsed));

    /// <summary>Collapsed below <paramref name="tier"/> and shown from it on.</summary>
    public static T ShownFrom<T>(this T component, UIResponsiveTier tier) where T : VisualComponentBase<T>, IUIComponentDefinition
        => component.SetVisibility(Split(tier, UIVisibility.Collapsed, UIVisibility.Visible));

    private static UIResponsive<UIVisibility> Split(UIResponsiveTier tier, UIVisibility below, UIVisibility from)
        => tier switch
        {
            UIResponsiveTier.Sm => UIResponsive<UIVisibility>.Create(below, sm: from),
            UIResponsiveTier.Md => UIResponsive<UIVisibility>.Create(below, md: from),
            UIResponsiveTier.Xl => UIResponsive<UIVisibility>.Create(below, xl: from),
            UIResponsiveTier.Xxl => UIResponsive<UIVisibility>.Create(below, xxl: from),
            _ => throw new System.ArgumentOutOfRangeException(nameof(tier), tier, "Nothing is below the base tier.")
        };
}
