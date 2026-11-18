using System;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>Configures default date and time formatting across temporal inputs and timestamps.</summary>
/// <remarks>
/// Unset, fields use <c>yyyy-MM-dd</c> and <c>HH:mm</c> while taking month/day names, AM/PM and placeholder letters from the active
/// language. A component's explicit <c>DisplayFormat</c> or <c>Culture</c> takes precedence.
/// </remarks>
public sealed class UITemporalOptions
{
    /// <summary>Gets or sets whether fields without an explicit pattern use the active culture's date and time formats instead of <c>yyyy-MM-dd</c> and <c>HH:mm</c>.</summary>
    /// <remarks>Defaults to <see langword="false"/>; <see cref="DateFormat"/> and <see cref="TimeFormat"/> still take precedence when set.</remarks>
    public bool FollowCulture { get; set; }

    /// <summary>
    /// Gets or sets how a clock counts its hours when <see cref="TimeFormat"/> is not set; default <see cref="UIHourCycle.Default"/>,
    /// the count of the pattern a field falls back on — 24 in the framework's <c>HH:mm</c>, the culture's own when it follows the culture.
    /// </summary>
    public UIHourCycle HourCycle { get; set; } = UIHourCycle.Default;

    /// <summary>
    /// Gets or sets the date pattern for every language, in the shared tokens (<see cref="UITemporalPattern"/>) — <c>dd.MM.yyyy</c>;
    /// <see langword="null"/> is the framework's <c>yyyy-MM-dd</c>, or each culture's own when it is followed.
    /// </summary>
    public string? DateFormat { get; set; }

    /// <summary>
    /// Gets or sets the time pattern for every language, to the minute — <c>HH:mm</c>; a field whose step reaches seconds shows them
    /// after the minutes. <see langword="null"/> is the framework's <c>HH:mm</c>, or each culture's own when it is followed, counted by
    /// <see cref="HourCycle"/>.
    /// </summary>
    public string? TimeFormat { get; set; }

    /// <summary>
    /// Validates the options: each pattern in the shared tokens and naming what a date or a time needs, and a time pattern that
    /// counts its hours as <see cref="HourCycle"/> says, where both are set.
    /// </summary>
    /// <exception cref="InvalidOperationException">A pattern cannot be shown, or it and the hour cycle disagree.</exception>
    public void Validate()
    {
        if (!Enum.IsDefined(HourCycle))
            throw new InvalidOperationException($"'{HourCycle}' is no hour cycle.");

        if (DateFormat is not null)
            UITemporalPattern.Validate(DateFormat, isTime: false, nameof(DateFormat));

        if (TimeFormat is null)
            return;

        UITemporalPattern.Validate(TimeFormat, isTime: true, nameof(TimeFormat));

        var twelveHour = UITemporalPattern.IsTwelveHour(TimeFormat);

        if ((HourCycle == UIHourCycle.TwentyFourHour && twelveHour) || (HourCycle == UIHourCycle.TwelveHour && !twelveHour))
            throw new InvalidOperationException($"TimeFormat '{TimeFormat}' counts its hours to {(twelveHour ? "12" : "24")}, but HourCycle is {HourCycle}; set only one of them, or make them agree.");
    }
}
