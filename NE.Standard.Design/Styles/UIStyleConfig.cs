using NE.Standard.Serialization;

namespace NE.Standard.Design.Styles
{
    [ObjectSerializable]
    public class UIStyleConfig
    {
        public FontConfig? Font { get; set; }
        public PaletteConfig? Colors { get; set; }

        public double? CardRadius { get; set; }
        public double? ButtonRadius { get; set; }
        public double? InputRadius { get; set; }
    }
}
