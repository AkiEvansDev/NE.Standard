using System;
using System.Globalization;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Provides extension methods for <see cref="DateTime"/> operations, 
    /// including formatting, Unix time conversions, and date boundary calculations.
    /// </summary>
    public static class DateTimeExtensions
    {
        /// <summary>
        /// Converts the <paramref name="date"/> to a string using the specified format and culture provider.
        /// </summary>
        /// <param name="date">The date to format.</param>
        /// <param name="format">The custom format string. If <c>null</c>, a default format is used.</param>
        /// <param name="provider">An optional format provider. Defaults to <see cref="CultureInfo.InvariantCulture"/> if <c>null</c>.</param>
        /// <returns>A formatted date string.</returns>
        public static string ToFormat(this DateTime date, string? format = null, IFormatProvider? provider = null)
            => date.ToString(format ?? GeneralConstants.DATETIME_FORMAT, provider ?? CultureInfo.InvariantCulture);

        /// <summary>
        /// Converts the specified <paramref name="date"/> to Unix time in seconds.
        /// </summary>
        /// <returns>The number of seconds that have elapsed since 1970-01-01T00:00:00Z (Unix epoch).</returns>
        public static long ToUnixTimeSeconds(this DateTime date)
            => new DateTimeOffset(date).ToUnixTimeSeconds();

        /// <summary>
        /// Converts the specified <paramref name="date"/> to Unix time in milliseconds.
        /// </summary>
        /// <returns>The number of milliseconds that have elapsed since 1970-01-01T00:00:00Z (Unix epoch).</returns>
        public static long ToUnixTimeMilliseconds(this DateTime date)
            => new DateTimeOffset(date).ToUnixTimeMilliseconds();

        /// <summary>
        /// Converts a Unix time value in seconds to a <see cref="DateTime"/>.
        /// </summary>
        /// <returns>A <see cref="DateTime"/> representing the specified Unix time.</returns>
        public static DateTime FromUnixTimeSeconds(this long seconds)
            => DateTimeOffset.FromUnixTimeSeconds(seconds).DateTime;

        /// <summary>
        /// Converts a Unix time value in milliseconds to a <see cref="DateTime"/>.
        /// </summary>
        /// <returns>A <see cref="DateTime"/> representing the specified Unix time.</returns>
        public static DateTime FromUnixTimeMilliseconds(this long milliseconds)
            => DateTimeOffset.FromUnixTimeMilliseconds(milliseconds).DateTime;

        /// <summary>
        /// Returns a new <see cref="DateTime"/> representing the start of the day (00:00:00.000) for the specified <paramref name="date"/>.
        /// </summary>
        /// <returns>A <see cref="DateTime"/> at the beginning of the same day.</returns>
        public static DateTime StartOfDay(this DateTime date)
            => date.Date;

        /// <summary>
        /// Returns a new <see cref="DateTime"/> representing the end of the day (23:59:59.9999999) for the specified <paramref name="date"/>.
        /// </summary>
        /// <returns>A <see cref="DateTime"/> at the end of the same day.</returns>
        public static DateTime EndOfDay(this DateTime date)
            => date.Date.AddDays(1).AddTicks(-1);

        /// <summary>
        /// Returns a new <see cref="DateTime"/> representing the first moment of the month for the specified <paramref name="date"/>.
        /// </summary>
        /// <returns>A <see cref="DateTime"/> at 00:00:00.000 on the first day of the month.</returns>
        public static DateTime StartOfMonth(this DateTime date)
            => new DateTime(date.Year, date.Month, 1);

        /// <summary>
        /// Returns a new <see cref="DateTime"/> representing the last possible moment of the month for the specified <paramref name="date"/>.
        /// </summary>
        /// <returns>A <see cref="DateTime"/> at 23:59:59.9999999 on the last day of the month.</returns>
        public static DateTime EndOfMonth(this DateTime date)
            => new DateTime(date.Year, date.Month, 1)
                .AddMonths(1)
                .AddTicks(-1);

        /// <summary>
        /// Returns a new <see cref="DateTime"/> without milliseconds (rounded down to the nearest second).
        /// </summary>
        public static DateTime TrimMilliseconds(this DateTime date)
            => date.AddTicks(-(date.Ticks % TimeSpan.TicksPerSecond));
    }
}
