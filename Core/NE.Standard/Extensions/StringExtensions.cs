using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Helper extensions for <see cref="string"/>.
    /// </summary>
    public static class StringExtensions
    {
        #region Conversions

        public static bool ToBool(this string? value, bool defaultValue = default)
            => bool.TryParse(value, out var result) ? result : defaultValue;

        public static bool? ToNullableBool(this string? value)
            => bool.TryParse(value, out var result) ? result : (bool?)null;

        public static byte ToByte(this string? value, byte defaultValue = default)
            => byte.TryParse(value, out var result) ? result : defaultValue;

        public static byte? ToNullableByte(this string? value)
            => byte.TryParse(value, out var result) ? result : (byte?)null;

        public static int ToInt(this string? value, int defaultValue = default)
            => int.TryParse(value, out var result) ? result : defaultValue;

        public static int? ToNullableInt(this string? value)
            => int.TryParse(value, out var result) ? result : (int?)null;

        public static long ToLong(this string? value, long defaultValue = default)
            => long.TryParse(value, out var result) ? result : defaultValue;

        public static long? ToNullableLong(this string? value)
            => long.TryParse(value, out var result) ? result : (long?)null;

        public static float ToSingle(this string? value, float defaultValue = default)
            => float.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out var result) ? result : defaultValue;

        public static float? ToNullableSingle(this string? value)
            => float.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out var result) ? result : (float?)null;

        public static double ToDouble(this string? value, double defaultValue = default)
            => double.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out var result) ? result : defaultValue;

        public static double? ToNullableDouble(this string? value)
            => double.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out var result) ? result : (double?)null;

        public static decimal ToDecimal(this string? value, decimal defaultValue = default)
            => decimal.TryParse(value?.Replace(',', '.'), NumberStyles.Number, GeneralConstants.NumberFormat, out var result) ? result : defaultValue;

        public static decimal? ToNullableDecimal(this string? value)
            => decimal.TryParse(value?.Replace(',', '.'), NumberStyles.Number, GeneralConstants.NumberFormat, out var result) ? result : (decimal?)null;

        public static DateTime ToDate(this string? value, string? format = null, IFormatProvider? provider = null, DateTime defaultValue = default)
        {
            if (string.IsNullOrWhiteSpace(value))
                return defaultValue;

            if (string.IsNullOrEmpty(format))
                return DateTime.TryParse(value, provider, DateTimeStyles.None, out var result) ? result : defaultValue;

            return DateTime.TryParseExact(value, format, provider ?? CultureInfo.InvariantCulture, DateTimeStyles.None, out var exact) ? exact : defaultValue;
        }

        public static DateTime? ToNullableDate(this string? value, string? format = null, IFormatProvider? provider = null)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            if (string.IsNullOrEmpty(format))
                return DateTime.TryParse(value, provider, DateTimeStyles.None, out var result) ? result : (DateTime?)null;

            return DateTime.TryParseExact(value, format, provider ?? CultureInfo.InvariantCulture, DateTimeStyles.None, out var exact) ? exact : (DateTime?)null;
        }

        public static TimeSpan ToTime(this string? value, string? format = null, IFormatProvider? provider = null, TimeSpan defaultValue = default)
        {
            if (string.IsNullOrWhiteSpace(value))
                return defaultValue;

            if (string.IsNullOrEmpty(format))
                return TimeSpan.TryParse(value, provider, out var result) ? result : defaultValue;

            return TimeSpan.TryParseExact(value, format, provider ?? CultureInfo.InvariantCulture, out var exact) ? exact : defaultValue;
        }

        public static TimeSpan? ToNullableTime(this string? value, string? format = null, IFormatProvider? provider = null)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            if (string.IsNullOrEmpty(format))
                return TimeSpan.TryParse(value, provider, out var result) ? result : (TimeSpan?)null;

            return TimeSpan.TryParseExact(value, format, provider ?? CultureInfo.InvariantCulture, out var exact) ? exact : (TimeSpan?)null;
        }

        #endregion

        #region String operations

        public static bool EqualsIgnoreCase(this string? value1, string? value2)
            => string.Equals(value1, value2, StringComparison.OrdinalIgnoreCase);

        public static bool ContainsIgnoreCase(this string value, string part)
            => value?.IndexOf(part, StringComparison.OrdinalIgnoreCase) >= 0;

        public static bool Search(this string value1, string value2)
        {
            var parts = value2.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            return parts.Any(p => value1.Contains(p, StringComparison.OrdinalIgnoreCase));
        }

        public static bool Search(this string value1, string value2, params char[] separator)
        {
            var parts = value2.Split(separator, StringSplitOptions.RemoveEmptyEntries);
            return parts.Any(p => value1.Contains(p, StringComparison.OrdinalIgnoreCase));
        }

        public static string UpFirst(this string value)
            => string.IsNullOrEmpty(value) ? value : char.ToUpper(value[0]) + value[1..];

        public static string LowFirst(this string value)
            => string.IsNullOrEmpty(value) ? value : char.ToLower(value[0]) + value[1..];

        public static bool IsNull(this string? value)
            => string.IsNullOrWhiteSpace(value);

        public static string Empty(this string? value1, string value2)
            => string.IsNullOrWhiteSpace(value1) ? value2 : value1;

        public static string UniqueFrom(this string value, IEnumerable<string> values)
        {
            var index = 1;
            var newValue = value;
            while (values.Any(v => v.EqualsIgnoreCase(newValue)))
            {
                newValue = $"{value}#{index}";
                index++;
            }
            return newValue;
        }

        public static bool AnyFrom(this string value, IEnumerable<string> values)
            => values.Any(v => v.EqualsIgnoreCase(value));

        public static IEnumerable<string> SmartSplit(this string data, params string[] separator)
            => data
                .Split(separator, StringSplitOptions.None)
                .Select(e => e.Trim())
                .Where(e => !string.IsNullOrEmpty(e));

        public static string ToBase64(this string data)
            => Convert.ToBase64String(Encoding.UTF8.GetBytes(data));

        public static string FromBase64(this string data)
            => Encoding.UTF8.GetString(Convert.FromBase64String(data));

        #endregion
    }
}
