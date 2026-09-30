using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// A day input with marked days as its shared setters reach it: the days and the mode they set, and the day and a period's end those
/// must hold.
/// </summary>
public interface IMarkedDaysInputComponent : IMarkedDaysComponent
{
    /// <summary>
    /// Gets or sets the days the calendar draws marked.
    /// </summary>
    new IReadOnlyCollection<DateOnly>? MarkedDays { get; set; }

    /// <summary>
    /// Gets or sets whether only a marked day can be chosen.
    /// </summary>
    new bool? MarkedDaysOnly { get; set; }

    /// <summary>
    /// Gets the day chosen, a period's start.
    /// </summary>
    new DateOnly? Value { get; }

    /// <summary>
    /// Gets a period's end.
    /// </summary>
    DateOnly? EndValue { get; }
}

/// <summary>
/// The marked-days setters and checks <see cref="IMarkedDaysInputComponent"/> components share: with only marked days on offer, the
/// day and a period's end are among them, whichever is set last.
/// </summary>
public static class MarkedDaysComponentExtensions
{
    /// <summary>
    /// Sets the days the calendar draws marked; order and repeats do not matter. With only marked days on offer, the day and a period's
    /// end must be among them.
    /// </summary>
    public static T SetMarkedDays<T>(this T component, IEnumerable<DateOnly> days) where T : IMarkedDaysInputComponent
    {
        ArgumentNullException.ThrowIfNull(component);
        ArgumentNullException.ThrowIfNull(days);

        HashSet<DateOnly> marked = [.. days];

        ValidateMarkedDay(marked, component.MarkedDaysOnly, component.Value);
        ValidateMarkedDay(marked, component.MarkedDaysOnly, component.EndValue);

        component.MarkedDays = marked;
        return component;
    }

    /// <summary>
    /// Throws when only marked days may be chosen and the day is not one; an unset day, or the mode off, checks nothing.
    /// </summary>
    public static void ValidateMarkedDay(IReadOnlyCollection<DateOnly>? markedDays, bool? markedDaysOnly, DateOnly? day)
    {
        if (markedDaysOnly != true || day is not DateOnly value)
            return;

        if (markedDays is null || !IsMarked(markedDays, value))
            throw new ArgumentOutOfRangeException(nameof(day), day, "The date is not one of the marked days, and only a marked day can be chosen.");
    }

    /// <summary>Whether the days hold <paramref name="day"/>: a set or a list answers itself, any other collection is walked.</summary>
    public static bool IsMarked(IEnumerable<DateOnly> markedDays, DateOnly day)
    {
        ArgumentNullException.ThrowIfNull(markedDays);

        if (markedDays is ICollection<DateOnly> collection)
            return collection.Contains(day);

        if (markedDays is IReadOnlySet<DateOnly> set)
            return set.Contains(day);

        foreach (DateOnly marked in markedDays)
        {
            if (marked == day)
                return true;
        }

        return false;
    }

    /// <summary>
    /// Offers only the marked days: every other day is disabled, and the server refuses one sent anyway.
    /// </summary>
    public static T SetMarkedDaysOnly<T>(this T component) where T : IMarkedDaysInputComponent
        => component.SetMarkedDaysOnly(true);

    /// <summary>
    /// Sets whether only a marked day can be chosen; turned on, the day and a period's end must be marked days.
    /// </summary>
    public static T SetMarkedDaysOnly<T>(this T component, bool markedDaysOnly) where T : IMarkedDaysInputComponent
    {
        ArgumentNullException.ThrowIfNull(component);

        ValidateMarkedDay(component.MarkedDays, markedDaysOnly, component.Value);
        ValidateMarkedDay(component.MarkedDays, markedDaysOnly, component.EndValue);

        component.MarkedDaysOnly = markedDaysOnly;
        return component;
    }
}
