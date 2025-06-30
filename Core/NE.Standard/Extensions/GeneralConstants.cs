using System.Globalization;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Common constants shared across extensions.
    /// </summary>
    public static class GeneralConstants
    {
        public const string DATETIME_FORMAT = "MM.dd.yyyy HH:mm:ss.f";
        public const string TIMESPAN_FORMAT = "c";

        public static readonly NumberFormatInfo NumberFormat = new NumberFormatInfo()
        {
            NumberGroupSeparator = ".",
            NumberDecimalSeparator = "."
        };
    }
}
