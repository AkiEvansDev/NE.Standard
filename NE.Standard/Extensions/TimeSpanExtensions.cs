using System;
using System.Globalization;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Extensions for working with <see cref="TimeSpan"/> instances.
    /// </summary>
    public static class TimeSpanExtensions
    {
        /// <summary>
        /// Converts the time span into a formatted string.
        /// </summary>
        public static string ToFormat(this TimeSpan span, string? format = null, IFormatProvider? provider = null)
            => span.ToString(format ?? GeneralConstants.TIMESPAN_FORMAT, provider ?? CultureInfo.InvariantCulture);

        /// <summary>
        /// Determines whether the <see cref="TimeSpan"/> is zero.
        /// </summary>
        public static bool IsZero(this TimeSpan span) => span == TimeSpan.Zero;

        /// <summary>
        /// Returns the absolute value of the time span.
        /// </summary>
        public static TimeSpan Abs(this TimeSpan span) => span.Duration();
    }
}
