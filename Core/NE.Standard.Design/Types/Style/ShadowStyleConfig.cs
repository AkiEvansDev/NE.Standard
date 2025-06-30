using NE.Standard.Serialization;

namespace NE.Standard.Design.Types.Style
{
    [ObjectSerializable]
    public class ShadowStyleConfig
    {
        public bool EnableShadows { get; set; }

        public double Elevation1 { get; set; }
        public double Elevation2 { get; set; }
        public double Elevation3 { get; set; }
    }
}
