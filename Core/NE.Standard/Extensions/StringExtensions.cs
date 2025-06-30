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
        #region TryConversions

        /// <summary>
        /// Tries to convert the string to a <see cref="bool"/>.
        /// </summary>
        public static bool TryToBool(this string? value, out bool result)
            => bool.TryParse(value, out result);

        /// <summary>
        /// Tries to convert the string to a <see cref="byte"/>.
        /// </summary>
        public static bool TryToByte(this string? value, out byte result)
            => byte.TryParse(value, out result);

        /// <summary>
        /// Tries to convert the string to a <see cref="short"/>.
        /// </summary>
        public static bool TryToShort(this string? value, out short result)
            => short.TryParse(value, out result);

        /// <summary>
        /// Tries to convert the string to an <see cref="int"/>.
        /// </summary>
        public static bool TryToInt(this string? value, out int result)
            => int.TryParse(value, out result);

        /// <summary>
        /// Tries to convert the string to a <see cref="long"/>.
        /// </summary>
        public static bool TryToLong(this string? value, out long result)
            => long.TryParse(value, out result);

        /// <summary>
        /// Tries to convert the string to a <see cref="float"/>.
        /// </summary>
        public static bool TryToFloat(this string? value, out float result)
            => float.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out result);

        /// <summary>
        /// Tries to convert the string to a <see cref="double"/>.
        /// </summary>
        public static bool TryToDouble(this string? value, out double result)
            => double.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out result);

        /// <summary>
        /// Tries to convert the string to a <see cref="decimal"/>.
        /// </summary>
        public static bool TryToDecimal(this string? value, out decimal result)
            => decimal.TryParse(value?.Replace(',', '.'), NumberStyles.Number, GeneralConstants.NumberFormat, out result);

        /// <summary>
        /// Tries to convert the string to a <see cref="DateTime"/> using the provided format.
        /// </summary>
        public static bool TryToDate(this string? value, out DateTime result, string? format = null, IFormatProvider? provider = null)
            => DateTime.TryParseExact(value, format ?? GeneralConstants.DATETIME_FORMAT, provider ?? CultureInfo.InvariantCulture, DateTimeStyles.None, out result);

        /// <summary>
        /// Tries to convert the string to a <see cref="TimeSpan"/> using the provided format.
        /// </summary>
        public static bool TryToTime(this string? value, out TimeSpan result, string? format = null, IFormatProvider? provider = null)
            => TimeSpan.TryParseExact(value, format ?? GeneralConstants.TIMESPAN_FORMAT, provider ?? CultureInfo.InvariantCulture, out result);

        /// <summary>
        /// Tries to convert the string to an enum of specified type.
        /// </summary>
        public static bool TryToEnum<T>(this string? value, out T result) where T : struct, Enum
            => Enum.TryParse(value, out result);

        #endregion

        #region Conversions

        /// <summary>
        /// Converts the string to a <see cref="bool"/> value or returns the specified default.
        /// </summary>
        public static bool ToBool(this string? value, bool defaultValue = default)
            => bool.TryParse(value, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="bool"/>.
        /// </summary>
        public static bool? ToNullableBool(this string? value)
            => bool.TryParse(value, out var result) ? result : (bool?)null;

        /// <summary>
        /// Converts the string to a <see cref="byte"/> value or returns the specified default.
        /// </summary>
        public static byte ToByte(this string? value, byte defaultValue = default)
            => byte.TryParse(value, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="byte"/>.
        /// </summary>
        public static byte? ToNullableByte(this string? value)
            => byte.TryParse(value, out var result) ? result : (byte?)null;

        /// <summary>
        /// Converts the string to a <see cref="short"/> value or returns the specified default.
        /// </summary>
        public static short ToShort(this string? value, short defaultValue = default)
            => short.TryParse(value, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="short"/>.
        /// </summary>
        public static short? ToNullableShort(this string? value)
            => short.TryParse(value, out var result) ? result : (short?)null;

        /// <summary>
        /// Converts the string to an <see cref="int"/> value or returns the specified default.
        /// </summary>
        public static int ToInt(this string? value, int defaultValue = default)
            => int.TryParse(value, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="int"/>.
        /// </summary>
        public static int? ToNullableInt(this string? value)
            => int.TryParse(value, out var result) ? result : (int?)null;

        /// <summary>
        /// Converts the string to a <see cref="long"/> value or returns the specified default.
        /// </summary>
        public static long ToLong(this string? value, long defaultValue = default)
            => long.TryParse(value, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="long"/>.
        /// </summary>
        public static long? ToNullableLong(this string? value)
            => long.TryParse(value, out var result) ? result : (long?)null;

        /// <summary>
        /// Converts the string to a <see cref="float"/> value or returns the specified default.
        /// </summary>
        public static float ToFloat(this string? value, float defaultValue = default)
            => float.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="float"/>.
        /// </summary>
        public static float? ToNullableFloat(this string? value)
            => float.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out var result) ? result : (float?)null;

        /// <summary>
        /// Converts the string to a <see cref="double"/> value or returns the specified default.
        /// </summary>
        public static double ToDouble(this string? value, double defaultValue = default)
            => double.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="double"/>.
        /// </summary>
        public static double? ToNullableDouble(this string? value)
            => double.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out var result) ? result : (double?)null;

        /// <summary>
        /// Converts the string to a <see cref="decimal"/> value or returns the specified default.
        /// </summary>
        public static decimal ToDecimal(this string? value, decimal defaultValue = default)
            => decimal.TryParse(value?.Replace(',', '.'), NumberStyles.Number, GeneralConstants.NumberFormat, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="decimal"/>.
        /// </summary>
        public static decimal? ToNullableDecimal(this string? value)
            => decimal.TryParse(value?.Replace(',', '.'), NumberStyles.Number, GeneralConstants.NumberFormat, out var result) ? result : (decimal?)null;

        /// <summary>
        /// Converts the string to a <see cref="DateTime"/> using the provided format.
        /// </summary>
        public static DateTime ToDate(this string? value, string? format = null, IFormatProvider? provider = null, DateTime defaultValue = default)
        {
            if (string.IsNullOrWhiteSpace(value))
                return defaultValue;

            return DateTime.TryParseExact(value, format ?? GeneralConstants.DATETIME_FORMAT, provider ?? CultureInfo.InvariantCulture, DateTimeStyles.None, out var exact) ? exact : defaultValue;
        }

        /// <summary>
        /// Converts the string to a nullable <see cref="DateTime"/> using the provided format.
        /// </summary>
        public static DateTime? ToNullableDate(this string? value, string? format = null, IFormatProvider? provider = null)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            return DateTime.TryParseExact(value, format ?? GeneralConstants.DATETIME_FORMAT, provider ?? CultureInfo.InvariantCulture, DateTimeStyles.None, out var exact) ? exact : (DateTime?)null;
        }

        /// <summary>
        /// Converts the string to a <see cref="TimeSpan"/> using the provided format.
        /// </summary>
        public static TimeSpan ToTime(this string? value, string? format = null, IFormatProvider? provider = null, TimeSpan defaultValue = default)
        {
            if (string.IsNullOrWhiteSpace(value))
                return defaultValue;

            return TimeSpan.TryParseExact(value, format ?? GeneralConstants.TIMESPAN_FORMAT, provider ?? CultureInfo.InvariantCulture, out var exact) ? exact : defaultValue;
        }

        /// <summary>
        /// Converts the string to a nullable <see cref="TimeSpan"/> using the provided format.
        /// </summary>
        public static TimeSpan? ToNullableTime(this string? value, string? format = null, IFormatProvider? provider = null)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            return TimeSpan.TryParseExact(value, format ?? GeneralConstants.TIMESPAN_FORMAT, provider ?? CultureInfo.InvariantCulture, out var exact) ? exact : (TimeSpan?)null;
        }

        /// <summary>
        /// Converts the string to the specified enumeration value.
        /// </summary>
        public static object ToEnum(this string value, Type enumType)
            => Enum.Parse(enumType ?? throw new ArgumentNullException(nameof(enumType)), value);

        /// <summary>
        /// Converts the string to the specified enumeration value.
        /// </summary>
        public static T ToEnum<T>(this string value) where T : struct, Enum
            => (T)Enum.Parse(typeof(T), value);

        #endregion

        #region String operations

        /// <summary>
        /// Compares two strings ignoring case.
        /// </summary>
        public static bool EqualsIgnoreCase(this string? value1, string? value2)
            => string.Equals(value1, value2, StringComparison.OrdinalIgnoreCase);

        /// <summary>
        /// Determines whether the string contains the specified part ignoring case.
        /// </summary>
        public static bool ContainsIgnoreCase(this string? value, string part)
            => value?.IndexOf(part, StringComparison.OrdinalIgnoreCase) >= 0;

        /// <summary>
        /// Determines whether any word from <paramref name="value2"/> occurs in <paramref name="value1"/>.
        /// </summary>
        public static bool Search(this string value1, string value2)
        {
            var parts = value2.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            return parts.Any(p => value1.Contains(p, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Determines whether any token from <paramref name="value2"/> occurs in <paramref name="value1"/> using custom separators.
        /// </summary>
        public static bool Search(this string value1, string value2, params string[] separator)
        {
            var parts = value2.Split(separator, StringSplitOptions.RemoveEmptyEntries);
            return parts.Any(p => value1.Contains(p, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Capitalizes the first character of the string.
        /// </summary>
        public static string UpFirst(this string value)
            => string.IsNullOrEmpty(value) ? value : char.ToUpper(value[0]) + value[1..];

        /// <summary>
        /// Lowercases the first character of the string.
        /// </summary>
        public static string LowFirst(this string value)
            => string.IsNullOrEmpty(value) ? value : char.ToLower(value[0]) + value[1..];

        /// <summary>
        /// Checks whether the string is null or whitespace.
        /// </summary>
        public static bool IsNull(this string? value)
            => string.IsNullOrWhiteSpace(value);

        /// <summary>
        /// Returns <paramref name="value2"/> if <paramref name="value1"/> is null or whitespace.
        /// </summary>
        public static string Empty(this string? value1, string value2)
            => string.IsNullOrWhiteSpace(value1) ? value2 : value1;

        /// <summary>
        /// Creates a unique string by appending an incrementing number if needed.
        /// </summary>
        public static string UniqueFrom(this string value, IEnumerable<string> values, string separator = "#")
        {
            var set = values is ICollection<string> c
                ? new HashSet<string>(c, StringComparer.OrdinalIgnoreCase)
                : new HashSet<string>(values, StringComparer.OrdinalIgnoreCase);

            int index = 1;
            string newValue = value;
            while (set.Contains(newValue))
            {
                newValue = $"{value}{separator}{index++}";
            }
            return newValue;
        }

        /// <summary>
        /// Determines whether the string equals any of the provided values, ignoring case.
        /// </summary>
        public static bool AnyFrom(this string value, IEnumerable<string> values)
            => values.Contains(value, StringComparer.OrdinalIgnoreCase);

        /// <summary>
        /// Splits the string by the given separators trimming empty results.
        /// </summary>
        public static IEnumerable<string> SmartSplit(this string data, params string[] separator)
            => data
                .Split(separator, StringSplitOptions.None)
                .Select(e => e.Trim())
                .Where(e => !string.IsNullOrEmpty(e));

        /// <summary>
        /// Encodes the string into Base64 using UTF8.
        /// </summary>
        public static string ToBase64(this string data)
            => Convert.ToBase64String(Encoding.UTF8.GetBytes(data));

        /// <summary>
        /// Decodes the string from Base64 assuming UTF8 encoding.
        /// </summary>
        public static string FromBase64(this string data)
            => Encoding.UTF8.GetString(Convert.FromBase64String(data));

        #endregion
    }
}
