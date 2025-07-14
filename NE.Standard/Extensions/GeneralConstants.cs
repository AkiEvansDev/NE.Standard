using System.Globalization;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Defines general-purpose constants shared across formatting and conversion extensions,
    /// including default formats for <see cref="DateTime"/> and <see cref="TimeSpan"/>, and number formatting rules.
    /// </summary>
    public static class GeneralConstants
    {
        /// <summary>
        /// The default format string for <see cref="DateTime"/> values, using the constant format specifier <c>"o"</c>.
        /// </summary>
        public const string DATETIME_FORMAT = "o";

        /// <summary>
        /// The default format string for <see cref="TimeSpan"/> values, using the constant format specifier <c>"c"</c>.
        /// </summary>
        public const string TIMESPAN_FORMAT = "c";

        /// <summary>
        /// A shared <see cref="NumberFormatInfo"/> instance used for numeric parsing and formatting operations.
        /// Uses dot <c>'.'</c> as both the group and decimal separator.
        /// </summary>
        public static readonly NumberFormatInfo NumberFormat = new NumberFormatInfo()
        {
            NumberGroupSeparator = ".",
            NumberDecimalSeparator = "."
        };
    }
}
