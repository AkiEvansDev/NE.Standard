using NE.Standard.Serialization;

namespace NE.Standard.Design.Types.Style
{
    [ObjectSerializable]
    public class BorderStyleConfig
    {
        public double Thickness { get; set; }
        public ColorPath Color { get; set; }

        public double FocusThickness { get; set; }
        public ColorPath FocusColor { get; set; }
    }
}
