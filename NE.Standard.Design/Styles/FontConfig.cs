using NE.Standard.Serialization;

namespace NE.Standard.Design.Styles
{
    [ObjectSerializable]
    public class FontConfig
    {
        public string? FontFamily { get; set; }

        public double? Default { get; set; }

        public double? Title { get; set; }
        public double? Header { get; set; }
        public double? Caption { get; set; }
    }
}
