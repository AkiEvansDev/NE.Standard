namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// One of the viewport tiers a <see cref="UIResponsive{T}"/> value names — where each starts above the base is the platform's
/// breakpoint table (640, 768, 1280 and 1536 CSS pixels on the web).
/// </summary>
public enum UIResponsiveTier
{
    /// <summary>The narrowest viewport, where every responsive value starts; a column hidden below it is never hidden.</summary>
    Base = 0,

    Sm = 1,
    Md = 2,
    Xl = 3,
    Xxl = 4,
}
