using System;
using System.Globalization;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Extensions for working with <see cref="DateTime"/> instances.
    /// </summary>
    public static class DateTimeExtensions
    {
        /// <summary>
        /// Converts the date into a formatted string.
        /// </summary>
        public static string ToFormat(this DateTime date, string? format = null, IFormatProvider? provider = null)
            => date.ToString(format ?? GeneralConstants.DATETIME_FORMAT, provider ?? CultureInfo.InvariantCulture);

        /// <summary>
        /// Converts the date into Unix time seconds.
        /// </summary>
        public static long ToUnixTimeSeconds(this DateTime date)
            => new DateTimeOffset(date).ToUnixTimeSeconds();

        /// <summary>
        /// Converts the date into Unix time milliseconds.
        /// </summary>
        public static long ToUnixTimeMilliseconds(this DateTime date)
            => new DateTimeOffset(date).ToUnixTimeMilliseconds();

        /// <summary>
        /// Creates a <see cref="DateTime"/> from Unix time seconds.
        /// </summary>
        public static DateTime FromUnixTimeSeconds(this long seconds)
            => DateTimeOffset.FromUnixTimeSeconds(seconds).DateTime;

        /// <summary>
        /// Creates a <see cref="DateTime"/> from Unix time milliseconds.
        /// </summary>
        public static DateTime FromUnixTimeMilliseconds(this long milliseconds)
            => DateTimeOffset.FromUnixTimeMilliseconds(milliseconds).DateTime;

        /// <summary>
        /// Returns a <see cref="DateTime"/> at the start of the day.
        /// </summary>
        public static DateTime StartOfDay(this DateTime date)
            => date.Date;

        /// <summary>
        /// Returns a <see cref="DateTime"/> at the end of the day.
        /// </summary>
        public static DateTime EndOfDay(this DateTime date)
            => date.Date.AddDays(1).AddTicks(-1);

        /// <summary>
        /// Returns the first moment of the month for the given date.
        /// </summary>
        public static DateTime StartOfMonth(this DateTime date)
            => new DateTime(date.Year, date.Month, 1);

        /// <summary>
        /// Returns the last moment of the month for the given date.
        /// </summary>
        public static DateTime EndOfMonth(this DateTime date)
            => new DateTime(date.Year, date.Month, 1)
                .AddMonths(1)
                .AddTicks(-1);

        /// <summary>
        /// Removes millisecond precision from the date.
        /// </summary>
        public static DateTime TrimMilliseconds(this DateTime date)
            => date.AddTicks(-(date.Ticks % TimeSpan.TicksPerSecond));
    }
}
