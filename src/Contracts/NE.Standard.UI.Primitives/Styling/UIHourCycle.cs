namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// How a clock counts its hours where neither the field nor the application writes a time pattern of its own.
/// </summary>
public enum UIHourCycle
{
    /// <summary>
    /// The count of the pattern a field falls back on: from 0 to 23 in the framework's own <c>HH:mm</c>; where the culture is
    /// followed, the culture's own — 14:05 in Russian, 2:05 PM in American English.
    /// </summary>
    Default = 0,

    /// <summary>
    /// From 0 to 23, whatever the language: 14:05.
    /// </summary>
    TwentyFourHour = 1,

    /// <summary>
    /// From 1 to 12 with AM or PM, whatever the language: 2:05 PM.
    /// </summary>
    TwelveHour = 2,
}
