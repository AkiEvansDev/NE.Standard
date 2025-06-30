using NE.Standard.Serialization;

namespace NE.Standard.Design.Types.Style
{
    [ObjectSerializable]
    public class UIStyleConfig
    {
        public ColorPalette? Colors { get; set; }
        public FontConfig? Font { get; set; }
        public MarginPaddingConfig? Spacing { get; set; }
        public CornerRadiusConfig? Corners { get; set; }
        public BorderStyleConfig? Borders { get; set; }
        public ShadowStyleConfig? Shadows { get; set; }
    }
}
