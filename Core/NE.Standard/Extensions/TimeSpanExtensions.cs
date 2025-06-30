using System;
using System.Globalization;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Extensions for <see cref="TimeSpan"/> instances.
    /// </summary>
    public static class TimeSpanExtensions
    {
        public static string ToFormat(this TimeSpan span, string? format = null, IFormatProvider? provider = null)
            => span.ToString(format ?? GeneralConstants.TIMESPAN_FORMAT, provider ?? CultureInfo.InvariantCulture);

        public static bool IsZero(this TimeSpan span) => span == TimeSpan.Zero;

        public static TimeSpan Abs(this TimeSpan span) => span < TimeSpan.Zero ? span.Negate() : span;
    }
}
