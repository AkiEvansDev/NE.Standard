using NE.Standard.Serialization;

namespace NE.Standard.Design.Types.Style
{
    [ObjectSerializable]
    public class FontConfig
    {
        public string? FontFamily { get; set; }

        public double Title { get; set; }
        public double SubTitle { get; set; }
        public double Header { get; set; }
        public double Caption { get; set; }
        public double Default { get; set; }
        public double Button { get; set; }

        public double Input { get; set; }
        public double Label { get; set; }
    }
}
