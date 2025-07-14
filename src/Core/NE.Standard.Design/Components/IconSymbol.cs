using NE.Standard.Serialization;

namespace NE.Standard.Design.Components
{
    public enum IconStyle
    {
        Regular = 0,
        Outlined = 1,
        Sharp = 2,
    }

    [NEObject]
    public struct IconSymbol
    {
        public MaterialIcon Icon { get; set; }
        public IconStyle Style { get; set; }

        public IconSymbol(MaterialIcon icon, IconStyle style = IconStyle.Regular)
        {
            Icon = icon;
            Style = style;
        }
    }
}
