namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// How a timestamp shows its moment, in the reader's own time zone and language.
/// </summary>
public enum UITimestampFormat
{
    /// <summary>
    /// The day and the time of day: "30 Sep 2026, 14:05".
    /// </summary>
    DateTime = 0,

    /// <summary>
    /// The day alone: "30 Sep 2026".
    /// </summary>
    Date = 1,

    /// <summary>
    /// The time of day alone: "14:05".
    /// </summary>
    Time = 2,

    /// <summary>
    /// How long ago or how far ahead, kept current as time passes: "5 minutes ago", "yesterday", "in 2 hours".
    /// </summary>
    Relative = 3,
}
