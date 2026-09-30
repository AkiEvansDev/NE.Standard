using System;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>
/// The application's dates and times where a field says nothing of its own: whether they follow the culture, how a clock counts its
/// hours, and a date or time pattern for every language. Unset, every field shows the framework's own <c>yyyy-MM-dd</c> and
/// <c>HH:mm</c>; the page's language still supplies the month and day names, AM and PM, and the placeholder's letters.
/// </summary>
/// <remarks>
/// A temporal field's own <c>DisplayFormat</c> wins over all of it, and a field that names its own <c>Culture</c> follows that
/// culture's patterns as <see cref="FollowCulture"/> would. A timestamp's day and time are written in the same patterns, in the
/// reader's zone; only a relative one ("5 minutes ago") is the browser's own words for the page's language.
/// </remarks>
public sealed class UITemporalOptions
{
    /// <summary>
    /// Gets or sets whether a field with no pattern of its own shows its culture's date and time patterns (<c>dd.MM.yyyy</c> in
    /// Russian, <c>M/d/yyyy</c> and <c>h:mm tt</c> in American English) rather than the framework's <c>yyyy-MM-dd</c> and
    /// <c>HH:mm</c>; default <see langword="false"/>. <see cref="DateFormat"/> and <see cref="TimeFormat"/> still win where set.
    /// </summary>
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
