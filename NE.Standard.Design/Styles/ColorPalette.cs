using NE.Standard.Design.Types;
using NE.Standard.Serialization;

namespace NE.Standard.Design.Styles
{
    [ObjectSerializable]
    public class ColorPalette
    {
        public bool IsDark { get; set; }

        public ColorPath Primary { get; set; }
        public ColorPath Accent { get; set; }

        public ColorPath Background { get; set; }
        public ColorPath Foreground { get; set; }
        public ColorPath Success { get; set; }
        public ColorPath Warning { get; set; }
        public ColorPath Error { get; set; }
        public ColorPath Disabled { get; set; }
        public ColorPath Border { get; set; }
        public ColorPath Hover { get; set; }
    }
}
