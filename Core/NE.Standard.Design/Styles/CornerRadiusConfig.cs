using NE.Standard.Serialization;

namespace NE.Standard.Design.Styles
{
    [ObjectSerializable]
    public class CornerRadiusConfig
    {
        public double Small { get; set; }
        public double Medium { get; set; }
        public double Large { get; set; }
        public double Button { get; set; }
        public double Input { get; set; }
    }
}
