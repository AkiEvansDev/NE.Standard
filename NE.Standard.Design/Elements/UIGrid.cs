using NE.Standard.Design.Elements.Base;
using NE.Standard.Serialization;

namespace NE.Standard.Design.Elements
{
    [ObjectSerializable]
    public struct GridDefinition
    {
        public double? Absolute { get; set; }
        public double? Star { get; set; }

        public double? Min { get; set; }
        public double? Max { get; set; }
    }

    public class UIGrid : UILayout<UIGrid>
    {
        public GridDefinition[] Columns { get; set; }
        public GridDefinition[] Rows { get; set; }

        public UIGrid()
        {
            Columns = new GridDefinition[0];
            Rows = new GridDefinition[0];
        }
    }
}
