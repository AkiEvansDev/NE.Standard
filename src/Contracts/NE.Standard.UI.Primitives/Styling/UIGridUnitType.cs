namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines the unit type used by grid layout measurements.
/// </summary>
public enum UIGridUnitType
{
    /// <summary>
    /// A proportional share of the remaining available space.
    /// </summary>
    Star = 0,

    /// <summary>
    /// A fixed size expressed in device-independent units.
    /// </summary>
    Absolute = 1,

    /// <summary>
    /// Sized to fit its content, optionally bounded by a minimum and/or maximum.
    /// </summary>
    Auto = 2
}
