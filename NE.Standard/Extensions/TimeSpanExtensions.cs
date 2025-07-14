using System;
using System.Globalization;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Provides extension methods for working with <see cref="TimeSpan"/> instances,
    /// including formatting, zero-checking, and absolute value calculation.
    /// </summary>
    public static class TimeSpanExtensions
    {
        /// <summary>
        /// Converts the specified <paramref name="span"/> to a string using the provided format and culture-specific formatting information.
        /// </summary>
        /// <param name="span">The time span to format.</param>
        /// <param name="format">The custom format string. If <c>null</c>, a default format is used.</param>
        /// <param name="provider">An optional format provider. Defaults to <see cref="CultureInfo.InvariantCulture"/> if <c>null</c>.</param>
        /// <returns>A formatted string representation of the <see cref="TimeSpan"/>.</returns>
        public static string ToFormat(this TimeSpan span, string? format = null, IFormatProvider? provider = null)
            => span.ToString(format ?? GeneralConstants.TIMESPAN_FORMAT, provider ?? CultureInfo.InvariantCulture);

        /// <summary>
        /// Determines whether the specified <paramref name="span"/> is equal to <see cref="TimeSpan.Zero"/>.
        /// </summary>
        /// <param name="span">The time span to evaluate.</param>
        /// <returns><c>true</c> if the time span is zero; otherwise, <c>false</c>.</returns>
        public static bool IsZero(this TimeSpan span) => span == TimeSpan.Zero;

        /// <summary>
        /// Returns the absolute value of the specified <paramref name="span"/> as a positive <see cref="TimeSpan"/>.
        /// </summary>
        /// <param name="span">The time span whose duration is to be calculated.</param>
        /// <returns>A <see cref="TimeSpan"/> representing the absolute value of the original span.</returns>
        public static TimeSpan Abs(this TimeSpan span) => span.Duration();
    }
}
