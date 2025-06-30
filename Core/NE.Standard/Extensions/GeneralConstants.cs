using System.Globalization;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Common constants shared across extensions.
    /// </summary>
    public static class GeneralConstants
    {
        /// <summary>
        /// Default format string used for <see cref="DateTime"/> values.
        /// </summary>
        public const string DATETIME_FORMAT = "MM.dd.yyyy HH:mm:ss.f";

        /// <summary>
        /// Default format string used for <see cref="TimeSpan"/> values.
        /// </summary>
        public const string TIMESPAN_FORMAT = "c";

        /// <summary>
        /// Number formatting rules used by the extension methods.
        /// </summary>
        public static readonly NumberFormatInfo NumberFormat = new NumberFormatInfo()
        {
            NumberGroupSeparator = ".",
            NumberDecimalSeparator = "."
        };
    }
}
