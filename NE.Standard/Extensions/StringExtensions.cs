using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Provides extension methods for working with <see cref="string"/> values,
    /// including type conversion, case-insensitive operations, formatting, and manipulation.
    /// </summary>
    public static class StringExtensions
    {
        #region TryConversions

        /// <summary>
        /// Attempts to convert the string to a <see cref="bool"/>.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="result">When this method returns, contains the parsed boolean value if conversion succeeded; otherwise, <c>false</c>.</param>
        /// <returns><c>true</c> if parsing succeeded; otherwise, <c>false</c>.</returns>
        public static bool TryToBool(this string? value, out bool result)
            => bool.TryParse(value, out result);

        /// <summary>
        /// Attempts to convert the string to a <see cref="byte"/>.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="result">The output byte value if conversion succeeds.</param>
        /// <returns><c>true</c> if parsing succeeded; otherwise, <c>false</c>.</returns>
        public static bool TryToByte(this string? value, out byte result)
            => byte.TryParse(value, out result);

        /// <summary>
        /// Attempts to convert the string to a <see cref="short"/>.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="result">The output short value if conversion succeeds.</param>
        /// <returns><c>true</c> if parsing succeeded; otherwise, <c>false</c>.</returns>
        public static bool TryToShort(this string? value, out short result)
            => short.TryParse(value, out result);

        /// <summary>
        /// Attempts to convert the string to an <see cref="int"/>.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="result">The output integer value if conversion succeeds.</param>
        /// <returns><c>true</c> if parsing succeeded; otherwise, <c>false</c>.</returns>
        public static bool TryToInt(this string? value, out int result)
            => int.TryParse(value, out result);

        /// <summary>
        /// Attempts to convert the string to a <see cref="long"/>.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="result">The output long value if conversion succeeds.</param>
        /// <returns><c>true</c> if parsing succeeded; otherwise, <c>false</c>.</returns>
        public static bool TryToLong(this string? value, out long result)
            => long.TryParse(value, out result);

        /// <summary>
        /// Attempts to convert the string to a <see cref="float"/>.
        /// Replaces ',' with '.' and uses <see cref="GeneralConstants.NumberFormat"/>.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="result">The output float value if conversion succeeds.</param>
        /// <returns><c>true</c> if parsing succeeded; otherwise, <c>false</c>.</returns>
        public static bool TryToFloat(this string? value, out float result)
            => float.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out result);

        /// <summary>
        /// Attempts to convert the string to a <see cref="double"/>.
        /// Replaces ',' with '.' and uses <see cref="GeneralConstants.NumberFormat"/>.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="result">The output double value if conversion succeeds.</param>
        /// <returns><c>true</c> if parsing succeeded; otherwise, <c>false</c>.</returns>
        public static bool TryToDouble(this string? value, out double result)
            => double.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out result);

        /// <summary>
        /// Attempts to convert the string to a <see cref="decimal"/> using <see cref="GeneralConstants.NumberFormat"/>.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="result">The output decimal value if conversion succeeds.</param>
        /// <returns><c>true</c> if parsing succeeded; otherwise, <c>false</c>.</returns>
        public static bool TryToDecimal(this string? value, out decimal result)
            => decimal.TryParse(value?.Replace(',', '.'), NumberStyles.Number, GeneralConstants.NumberFormat, out result);

        /// <summary>
        /// Attempts to convert the string to a <see cref="DateTime"/> using a specified or default format.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="result">The resulting <see cref="DateTime"/> if conversion succeeds.</param>
        /// <param name="format">The date format. If <c>null</c>, uses <see cref="GeneralConstants.DATETIME_FORMAT"/>.</param>
        /// <param name="provider">The format provider. If <c>null</c>, uses <see cref="CultureInfo.InvariantCulture"/>.</param>
        /// <returns><c>true</c> if parsing succeeded; otherwise, <c>false</c>.</returns>
        public static bool TryToDate(this string? value, out DateTime result, string? format = null, IFormatProvider? provider = null)
            => DateTime.TryParseExact(value, format ?? GeneralConstants.DATETIME_FORMAT, provider ?? CultureInfo.InvariantCulture, DateTimeStyles.None, out result);

        /// <summary>
        /// Attempts to convert the string to a <see cref="TimeSpan"/> using a specified or default format.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="result">The resulting <see cref="TimeSpan"/> if conversion succeeds.</param>
        /// <param name="format">The time format. If <c>null</c>, uses <see cref="GeneralConstants.TIMESPAN_FORMAT"/>.</param>
        /// <param name="provider">The format provider. If <c>null</c>, uses <see cref="CultureInfo.InvariantCulture"/>.</param>
        /// <returns><c>true</c> if parsing succeeded; otherwise, <c>false</c>.</returns>
        public static bool TryToTime(this string? value, out TimeSpan result, string? format = null, IFormatProvider? provider = null)
            => TimeSpan.TryParseExact(value, format ?? GeneralConstants.TIMESPAN_FORMAT, provider ?? CultureInfo.InvariantCulture, out result);

        /// <summary>
        /// Attempts to convert the string to a value of the specified enumeration type <typeparamref name="T"/>.
        /// </summary>
        /// <typeparam name="T">The target enum type.</typeparam>
        /// <param name="value">The input string.</param>
        /// <param name="result">The resulting enum value if parsing succeeds.</param>
        /// <returns><c>true</c> if parsing succeeded; otherwise, <c>false</c>.</returns>
        public static bool TryToEnum<T>(this string? value, out T result) where T : struct, Enum
            => Enum.TryParse(value, out result);

        #endregion

        #region Conversions

        /// <summary>
        /// Converts the string to a <see cref="bool"/> value, or returns the specified <paramref name="defaultValue"/> if parsing fails.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <param name="defaultValue">The value to return if the conversion fails. Default is <c>false</c>.</param>
        /// <returns>A <see cref="bool"/> value parsed from the string, or <paramref name="defaultValue"/> if conversion fails.</returns>
        public static bool ToBool(this string? value, bool defaultValue = default)
            => bool.TryParse(value, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="bool"/>.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <returns>The parsed <see cref="bool"/> value, or <c>null</c> if conversion fails.</returns>
        public static bool? ToNullableBool(this string? value)
            => bool.TryParse(value, out var result) ? result : (bool?)null;

        /// <summary>
        /// Converts the string to a <see cref="byte"/> value, or returns the specified <paramref name="defaultValue"/> if parsing fails.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <param name="defaultValue">The fallback value if conversion fails. Default is 0.</param>
        /// <returns>A <see cref="byte"/> value parsed from the string, or <paramref name="defaultValue"/> if parsing fails.</returns>
        public static byte ToByte(this string? value, byte defaultValue = default)
            => byte.TryParse(value, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="byte"/>.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <returns>The parsed <see cref="byte"/> value, or <c>null</c> if conversion fails.</returns>
        public static byte? ToNullableByte(this string? value)
            => byte.TryParse(value, out var result) ? result : (byte?)null;

        /// <summary>
        /// Converts the string to a <see cref="short"/> value, or returns the specified <paramref name="defaultValue"/> if parsing fails.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <param name="defaultValue">The fallback value if conversion fails. Default is 0.</param>
        /// <returns>A <see cref="short"/> value parsed from the string, or <paramref name="defaultValue"/> if parsing fails.</returns>
        public static short ToShort(this string? value, short defaultValue = default)
            => short.TryParse(value, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="short"/>.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <returns>The parsed <see cref="short"/> value, or <c>null</c> if conversion fails.</returns>
        public static short? ToNullableShort(this string? value)
            => short.TryParse(value, out var result) ? result : (short?)null;

        /// <summary>
        /// Converts the string to an <see cref="int"/> value, or returns the specified <paramref name="defaultValue"/> if parsing fails.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <param name="defaultValue">The fallback value if conversion fails. Default is 0.</param>
        /// <returns>An <see cref="int"/> parsed from the string, or <paramref name="defaultValue"/> if parsing fails.</returns>
        public static int ToInt(this string? value, int defaultValue = default)
            => int.TryParse(value, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="int"/>.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <returns>The parsed <see cref="int"/> value, or <c>null</c> if conversion fails.</returns>
        public static int? ToNullableInt(this string? value)
            => int.TryParse(value, out var result) ? result : (int?)null;

        /// <summary>
        /// Converts the string to a <see cref="long"/> value, or returns the specified <paramref name="defaultValue"/> if parsing fails.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <param name="defaultValue">The fallback value if conversion fails. Default is 0.</param>
        /// <returns>A <see cref="long"/> parsed from the string, or <paramref name="defaultValue"/> if parsing fails.</returns>
        public static long ToLong(this string? value, long defaultValue = default)
            => long.TryParse(value, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="long"/>.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <returns>The parsed <see cref="long"/> value, or <c>null</c> if conversion fails.</returns>
        public static long? ToNullableLong(this string? value)
            => long.TryParse(value, out var result) ? result : (long?)null;

        /// <summary>
        /// Converts the string to a <see cref="float"/> value using <see cref="GeneralConstants.NumberFormat"/>, or returns the specified <paramref name="defaultValue"/> if parsing fails.
        /// </summary>
        /// <param name="value">The input string to convert. Commas are replaced with dots before parsing.</param>
        /// <param name="defaultValue">The fallback value if conversion fails. Default is 0.</param>
        /// <returns>A <see cref="float"/> parsed from the string, or <paramref name="defaultValue"/> if parsing fails.</returns>
        public static float ToFloat(this string? value, float defaultValue = default)
            => float.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="float"/> using <see cref="GeneralConstants.NumberFormat"/>.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <returns>The parsed <see cref="float"/> value, or <c>null</c> if conversion fails.</returns>
        public static float? ToNullableFloat(this string? value)
            => float.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out var result) ? result : (float?)null;

        /// <summary>
        /// Converts the string to a <see cref="double"/> value using <see cref="GeneralConstants.NumberFormat"/>, or returns the specified <paramref name="defaultValue"/> if parsing fails.
        /// </summary>
        /// <param name="value">The input string to convert. Commas are replaced with dots before parsing.</param>
        /// <param name="defaultValue">The fallback value if conversion fails. Default is 0.</param>
        /// <returns>A <see cref="double"/> parsed from the string, or <paramref name="defaultValue"/> if parsing fails.</returns>
        public static double ToDouble(this string? value, double defaultValue = default)
            => double.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="double"/> using <see cref="GeneralConstants.NumberFormat"/>.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <returns>The parsed <see cref="double"/> value, or <c>null</c> if conversion fails.</returns>
        public static double? ToNullableDouble(this string? value)
            => double.TryParse(value?.Replace(',', '.'), NumberStyles.AllowThousands | NumberStyles.Float, GeneralConstants.NumberFormat, out var result) ? result : (double?)null;

        /// <summary>
        /// Converts the string to a <see cref="decimal"/> using <see cref="GeneralConstants.NumberFormat"/>, or returns the specified <paramref name="defaultValue"/> if parsing fails.
        /// </summary>
        /// <param name="value">The input string to convert. Commas are replaced with dots before parsing.</param>
        /// <param name="defaultValue">The fallback value if conversion fails. Default is 0.</param>
        /// <returns>A <see cref="decimal"/> parsed from the string, or <paramref name="defaultValue"/> if parsing fails.</returns>
        public static decimal ToDecimal(this string? value, decimal defaultValue = default)
            => decimal.TryParse(value?.Replace(',', '.'), NumberStyles.Number, GeneralConstants.NumberFormat, out var result) ? result : defaultValue;

        /// <summary>
        /// Converts the string to a nullable <see cref="decimal"/> using <see cref="GeneralConstants.NumberFormat"/>.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <returns>The parsed <see cref="decimal"/> value, or <c>null</c> if conversion fails.</returns>
        public static decimal? ToNullableDecimal(this string? value)
            => decimal.TryParse(value?.Replace(',', '.'), NumberStyles.Number, GeneralConstants.NumberFormat, out var result) ? result : (decimal?)null;

        /// <summary>
        /// Converts the string to a <see cref="DateTime"/> using the specified or default format.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <param name="format">The expected format. Defaults to <see cref="GeneralConstants.DATETIME_FORMAT"/> if <c>null</c>.</param>
        /// <param name="provider">The format provider. Defaults to <see cref="CultureInfo.InvariantCulture"/> if <c>null</c>.</param>
        /// <param name="defaultValue">The fallback value if conversion fails.</param>
        /// <returns>A parsed <see cref="DateTime"/> or <paramref name="defaultValue"/> if conversion fails.</returns>
        public static DateTime ToDate(this string? value, string? format = null, IFormatProvider? provider = null, DateTime defaultValue = default)
        {
            if (string.IsNullOrWhiteSpace(value))
                return defaultValue;

            return DateTime.TryParseExact(value, format ?? GeneralConstants.DATETIME_FORMAT, provider ?? CultureInfo.InvariantCulture, DateTimeStyles.None, out var exact) ? exact : defaultValue;
        }

        /// <summary>
        /// Converts the string to a nullable <see cref="DateTime"/> using the specified or default format.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <param name="format">The expected format. Defaults to <see cref="GeneralConstants.DATETIME_FORMAT"/> if <c>null</c>.</param>
        /// <param name="provider">The format provider. Defaults to <see cref="CultureInfo.InvariantCulture"/> if <c>null</c>.</param>
        /// <returns>A parsed <see cref="DateTime"/>, or <c>null</c> if conversion fails.</returns>
        public static DateTime? ToNullableDate(this string? value, string? format = null, IFormatProvider? provider = null)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            return DateTime.TryParseExact(value, format ?? GeneralConstants.DATETIME_FORMAT, provider ?? CultureInfo.InvariantCulture, DateTimeStyles.None, out var exact) ? exact : (DateTime?)null;
        }

        /// <summary>
        /// Converts the string to a <see cref="TimeSpan"/> using the specified or default format.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <param name="format">The expected format. Defaults to <see cref="GeneralConstants.TIMESPAN_FORMAT"/> if <c>null</c>.</param>
        /// <param name="provider">The format provider. Defaults to <see cref="CultureInfo.InvariantCulture"/> if <c>null</c>.</param>
        /// <param name="defaultValue">The fallback value if conversion fails.</param>
        /// <returns>A parsed <see cref="TimeSpan"/>, or <paramref name="defaultValue"/> if conversion fails.</returns>
        public static TimeSpan ToTime(this string? value, string? format = null, IFormatProvider? provider = null, TimeSpan defaultValue = default)
        {
            if (string.IsNullOrWhiteSpace(value))
                return defaultValue;

            return TimeSpan.TryParseExact(value, format ?? GeneralConstants.TIMESPAN_FORMAT, provider ?? CultureInfo.InvariantCulture, out var exact) ? exact : defaultValue;
        }

        /// <summary>
        /// Converts the string to a nullable <see cref="TimeSpan"/> using the specified or default format.
        /// </summary>
        /// <param name="value">The input string to convert.</param>
        /// <param name="format">The expected format. Defaults to <see cref="GeneralConstants.TIMESPAN_FORMAT"/> if <c>null</c>.</param>
        /// <param name="provider">The format provider. Defaults to <see cref="CultureInfo.InvariantCulture"/> if <c>null</c>.</param>
        /// <returns>A parsed <see cref="TimeSpan"/>, or <c>null</c> if conversion fails.</returns>
        public static TimeSpan? ToNullableTime(this string? value, string? format = null, IFormatProvider? provider = null)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            return TimeSpan.TryParseExact(value, format ?? GeneralConstants.TIMESPAN_FORMAT, provider ?? CultureInfo.InvariantCulture, out var exact) ? exact : (TimeSpan?)null;
        }

        /// <summary>
        /// Converts the string to a value of the specified enumeration <paramref name="enumType"/>.
        /// </summary>
        /// <param name="value">The string representation of the enumeration value.</param>
        /// <param name="enumType">The target enumeration type.</param>
        /// <returns>An instance of <paramref name="enumType"/> corresponding to the specified string.</returns>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="enumType"/> is <c>null</c>.</exception>
        /// <exception cref="ArgumentException">Thrown if <paramref name="enumType"/> is not an enum type.</exception>
        /// <exception cref="ArgumentException">Thrown if the value cannot be parsed into the specified enum type.</exception>
        public static object ToEnum(this string value, Type enumType)
            => Enum.Parse(enumType ?? throw new ArgumentNullException(nameof(enumType)), value);

        /// <summary>
        /// Converts the string to a value of the specified enumeration type <typeparamref name="T"/>.
        /// </summary>
        /// <typeparam name="T">The target enumeration type.</typeparam>
        /// <param name="value">The string representation of the enumeration value.</param>
        /// <returns>An instance of <typeparamref name="T"/> corresponding to the specified string.</returns>
        /// <exception cref="ArgumentException">Thrown if the value cannot be parsed into the enum type <typeparamref name="T"/>.</exception>
        public static T ToEnum<T>(this string value) where T : struct, Enum
            => (T)Enum.Parse(typeof(T), value);

        #endregion

        #region String operations

        /// <summary>
        /// Determines whether two strings are equal using case-insensitive comparison.
        /// </summary>
        /// <param name="value1">The first string.</param>
        /// <param name="value2">The second string.</param>
        /// <returns><c>true</c> if the strings are equal ignoring case; otherwise, <c>false</c>.</returns>
        public static bool EqualsIgnoreCase(this string? value1, string? value2)
            => string.Equals(value1, value2, StringComparison.OrdinalIgnoreCase);

        /// <summary>
        /// Determines whether the source string contains the specified substring using case-insensitive comparison.
        /// </summary>
        /// <param name="value">The source string.</param>
        /// <param name="part">The substring to search for.</param>
        /// <returns><c>true</c> if the substring is found; otherwise, <c>false</c>.</returns>
        public static bool ContainsIgnoreCase(this string? value, string part)
            => value?.IndexOf(part, StringComparison.OrdinalIgnoreCase) >= 0;

        /// <summary>
        /// Determines whether any word from <paramref name="value2"/> exists in <paramref name="value1"/> using case-insensitive comparison.
        /// </summary>
        /// <param name="value1">The source text.</param>
        /// <param name="value2">The text to extract search terms from.</param>
        /// <returns><c>true</c> if any word from <paramref name="value2"/> is found in <paramref name="value1"/>; otherwise, <c>false</c>.</returns>
        public static bool Search(this string value1, string value2)
        {
            var parts = value2.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            return parts.Any(p => value1.Contains(p, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Determines whether any token from <paramref name="value2"/> (split by custom separators) exists in <paramref name="value1"/>.
        /// </summary>
        /// <param name="value1">The source string.</param>
        /// <param name="value2">The string containing tokens.</param>
        /// <param name="separator">The token separators.</param>
        /// <returns><c>true</c> if any token matches; otherwise, <c>false</c>.</returns>
        public static bool Search(this string value1, string value2, params string[] separator)
        {
            var parts = value2.Split(separator, StringSplitOptions.RemoveEmptyEntries);
            return parts.Any(p => value1.Contains(p, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Capitalizes the first character of the string.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <returns>The string with the first character in uppercase.</returns>
        public static string UpFirst(this string value)
            => string.IsNullOrEmpty(value) ? value : char.ToUpper(value[0]) + value[1..];

        /// <summary>
        /// Converts the first character of the string to lowercase.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <returns>The string with the first character in lowercase.</returns>
        public static string LowFirst(this string value)
            => string.IsNullOrEmpty(value) ? value : char.ToLower(value[0]) + value[1..];

        /// <summary>
        /// Determines whether the string is <c>null</c> or consists only of whitespace characters.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <returns><c>true</c> if the string is <c>null</c> or whitespace; otherwise, <c>false</c>.</returns>
        public static bool IsNull(this string? value)
            => string.IsNullOrWhiteSpace(value);

        /// <summary>
        /// Returns the fallback <paramref name="value2"/> if <paramref name="value1"/> is <c>null</c> or whitespace.
        /// </summary>
        /// <param name="value1">The primary value.</param>
        /// <param name="value2">The fallback value.</param>
        /// <returns><paramref name="value1"/> if not null/whitespace; otherwise, <paramref name="value2"/>.</returns>
        public static string Empty(this string? value1, string value2)
            => string.IsNullOrWhiteSpace(value1) ? value2 : value1;

        /// <summary>
        /// Converts a PascalCase or camelCase string to snake_case.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <returns>The snake_case representation of the input.</returns>
        public static string ToSnakeCase(this string value)
        {
            if (value.IsNull())
                return value;

            var sb = new StringBuilder();
            for (int i = 0; i < value.Length; i++)
            {
                if (char.IsUpper(value[i]))
                {
                    if (i > 0)
                        sb.Append('_');
                    sb.Append(char.ToLower(value[i]));
                }
                else
                {
                    sb.Append(value[i]);
                }
            }
            return sb.ToString();
        }

        /// <summary>
        /// Converts a snake_case string to PascalCase.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <returns>The PascalCase representation of the input.</returns>
        public static string ToPascalCase(this string value)
        {
            if (value.IsNull())
                return value;

            var parts = value.Split('_', StringSplitOptions.RemoveEmptyEntries);
            var sb = new StringBuilder();
            foreach (var part in parts)
            {
                sb.Append(part.UpFirst());
            }
            return sb.ToString();
        }

        /// <summary>
        /// Ensures uniqueness of the string by appending an incrementing number if a conflict exists in the specified collection.
        /// </summary>
        /// <param name="value">The base value to check.</param>
        /// <param name="values">The collection of existing values.</param>
        /// <param name="separator">The separator used before the increment (default is <c>#</c>).</param>
        /// <returns>A unique string value.</returns>
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
        /// Determines whether the string equals any value in the provided collection, ignoring case.
        /// </summary>
        /// <param name="value">The string to test.</param>
        /// <param name="values">A collection of comparison strings.</param>
        /// <returns><c>true</c> if <paramref name="value"/> matches any entry; otherwise, <c>false</c>.</returns>
        public static bool AnyFrom(this string value, IEnumerable<string> values)
            => values.Contains(value, StringComparer.OrdinalIgnoreCase);

        /// <summary>
        /// Splits the string by the specified separators, trims each segment, and excludes empty entries.
        /// </summary>
        /// <param name="data">The input string to split.</param>
        /// <param name="separator">The delimiters to use for splitting.</param>
        /// <returns>A filtered and trimmed sequence of string segments.</returns>
        public static IEnumerable<string> SmartSplit(this string data, params string[] separator)
            => data
                .Split(separator, StringSplitOptions.None)
                .Select(e => e.Trim())
                .Where(e => !string.IsNullOrEmpty(e));

        /// <summary>
        /// Encodes the string into Base64 using UTF-8 encoding.
        /// </summary>
        /// <param name="data">The input string.</param>
        /// <returns>The Base64-encoded representation.</returns>
        public static string ToBase64(this string data)
            => Convert.ToBase64String(Encoding.UTF8.GetBytes(data));

        /// <summary>
        /// Decodes a Base64-encoded string assuming UTF-8 encoding.
        /// </summary>
        /// <param name="data">The Base64-encoded input.</param>
        /// <returns>The decoded string.</returns>
        public static string FromBase64(this string data)
            => Encoding.UTF8.GetString(Convert.FromBase64String(data));

        #endregion
    }
}
