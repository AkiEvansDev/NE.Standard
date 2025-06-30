using System;
using System.Globalization;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Extensions for working with <see cref="DateTime"/> instances.
    /// </summary>
    public static class DateTimeExtensions
    {
        public static string ToFormat(this DateTime date, string? format = null, IFormatProvider? provider = null)
            => date.ToString(format ?? GeneralConstants.DATETIME_FORMAT, provider ?? CultureInfo.InvariantCulture);

        public static long ToUnixTimeSeconds(this DateTime date)
            => new DateTimeOffset(date).ToUnixTimeSeconds();

        public static long ToUnixTimeMilliseconds(this DateTime date)
            => new DateTimeOffset(date).ToUnixTimeMilliseconds();

        public static DateTime FromUnixTimeSeconds(this long seconds)
            => DateTimeOffset.FromUnixTimeSeconds(seconds).DateTime;

        public static DateTime FromUnixTimeMilliseconds(this long milliseconds)
            => DateTimeOffset.FromUnixTimeMilliseconds(milliseconds).DateTime;

        public static DateTime StartOfDay(this DateTime date)
            => date.Date;

        public static DateTime EndOfDay(this DateTime date)
            => date.Date.AddDays(1).AddTicks(-1);

        public static DateTime TrimMilliseconds(this DateTime date)
            => new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute, date.Second, date.Kind);
    }
}
