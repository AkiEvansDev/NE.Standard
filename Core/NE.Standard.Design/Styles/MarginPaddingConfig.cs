using NE.Standard.Serialization;

namespace NE.Standard.Design.Styles
{
    [ObjectSerializable]
    public class MarginPaddingConfig
    {
        public double Default { get; set; }
        public double Text { get; set; }
        public double Button { get; set; }
        public double Page { get; set; }

        public double Section { get; set; }
        public double BetweenElements { get; set; }
    }
}
