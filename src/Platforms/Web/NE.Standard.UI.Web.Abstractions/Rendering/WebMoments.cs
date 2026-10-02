using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// A moment as the server paints it before the page writes it in the reader's zone — a timestamp's, and a phrase argument's
/// (<see cref="UIMoment"/>): the instant in UTC in the page's names and the application's patterns, the ones the words table carries.
/// </summary>
/// <remarks>
/// Not the reader's zone, because one render of a view is shared by every reader of it; the page writes the same patterns in the
/// reader's zone, so at hydration only the time moves and " UTC" goes.
/// </remarks>
public static class WebMoments
{
    // A grid's column of timestamps paints one per row: the patterns and the culture's names are read once per culture and options,
    // keyed by the options' values, since the options are a mutable class an application may change between renders.
    private static readonly ConcurrentDictionary<(string Culture, bool HasOptions, bool FollowCulture, UIHourCycle HourCycle, string? Date, string? Time), MomentPaint> Paints = new();

    /// <summary>
    /// The instant in UTC in the page's names and the application's patterns, said to be UTC where it shows a clock; a relative one as
    /// the day and the time, since how long ago it was depends on when the page is read, and a relative day as the day.
    /// </summary>
    public static string FirstPaint(DateTimeOffset instant, UITimestampFormat format, CultureInfo culture, UITemporalOptions? options)
    {
        ArgumentNullException.ThrowIfNull(culture);

        MomentPaint paint = Paints.GetOrAdd(
            (culture.Name, options is not null, options?.FollowCulture ?? false, options?.HourCycle ?? default, options?.DateFormat, options?.TimeFormat),
            static (_, read) => MomentPaint.Read(read.Culture, read.Options),
            (Culture: culture, Options: options)
        );
        DateTime utc = instant.UtcDateTime;

        return format switch
        {
            UITimestampFormat.Date or UITimestampFormat.RelativeDate => WebTemporalFormat.Format(utc, paint.Date, paint.Names),
            UITimestampFormat.Time => $"{WebTemporalFormat.Format(utc, paint.Time, paint.Names)} UTC",
            _ => $"{WebTemporalFormat.Format(utc, paint.DateTime, paint.Names)} UTC"
        };
    }

    /// <summary>The patterns a first paint writes in, and the culture's names it writes with.</summary>
    private sealed record MomentPaint(string Date, string Time, string DateTime, WebTemporalCulturePack Names)
    {
        public static MomentPaint Read(CultureInfo culture, UITemporalOptions? options)
        {
            WebTemporalPatterns patterns = WebTemporalPatterns.Resolve(culture, options, ownCulture: false);

            return new MomentPaint(patterns.Date, patterns.ShortTime, patterns.DateTime(seconds: false), WebTemporalCulturePack.FromCulture(culture));
        }
    }

    /// <summary>
    /// A phrase's arguments with every moment in them — nested phrases' included — as its first paint for <paramref name="language"/>;
    /// the arguments themselves where they hold none.
    /// </summary>
    public static IReadOnlyDictionary<string, object?>? Paint(IReadOnlyDictionary<string, object?>? arguments, string language, UITemporalOptions? options)
    {
        if (arguments is null || !HoldsMoment(arguments))
            return arguments;

        return PaintArguments(arguments, WebCultures.Resolve(language), options);
    }

    private static bool HoldsMoment(IReadOnlyDictionary<string, object?> arguments)
    {
        foreach (KeyValuePair<string, object?> argument in arguments)
        {
            if (UIMoment.TryRead(argument.Value, out _) || (argument.Value is UIPhrase { Arguments: { } nested } && HoldsMoment(nested)))
                return true;
        }

        return false;
    }

    private static Dictionary<string, object?> PaintArguments(IReadOnlyDictionary<string, object?> arguments, CultureInfo culture, UITemporalOptions? options)
    {
        Dictionary<string, object?> painted = new(arguments.Count, StringComparer.Ordinal);

        foreach (KeyValuePair<string, object?> argument in arguments)
        {
            painted[argument.Key] = argument.Value switch
            {
                _ when UIMoment.TryRead(argument.Value, out UIMoment moment) => FirstPaint(moment.Instant, moment.Format, culture, options),
                UIPhrase { IsText: false, Arguments: { } nested } phrase when HoldsMoment(nested) => new UIPhrase(phrase.Key, PaintArguments(nested, culture, options)),
                _ => argument.Value
            };
        }

        return painted;
    }

    /// <summary>
    /// Arguments as the page's words mark carries them: a moment given as a <see cref="DateTimeOffset"/> or a <see cref="DateTime"/> as a
    /// <see cref="UIMoment"/>, so it travels in a moment's shape rather than as a date's text; the arguments themselves where none is.
    /// </summary>
    internal static IReadOnlyDictionary<string, object?>? ForWire(IReadOnlyDictionary<string, object?>? arguments)
    {
        if (arguments is null || !HoldsBareMoment(arguments))
            return arguments;

        Dictionary<string, object?> written = new(arguments.Count, StringComparer.Ordinal);

        foreach (KeyValuePair<string, object?> argument in arguments)
            written[argument.Key] = argument.Value is not UIMoment && UIMoment.TryRead(argument.Value, out UIMoment moment) ? moment : argument.Value;

        return written;
    }

    // A nested phrase travels by its own converter, which writes a moment's shape itself.
    private static bool HoldsBareMoment(IReadOnlyDictionary<string, object?> arguments)
    {
        foreach (KeyValuePair<string, object?> argument in arguments)
        {
            if (argument.Value is not UIMoment && UIMoment.TryRead(argument.Value, out _))
                return true;
        }

        return false;
    }
}
