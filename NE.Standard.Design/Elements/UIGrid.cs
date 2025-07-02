using NE.Standard.Design.Elements.Base;
using NE.Standard.Serialization;
using System;

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

    public class UIGrid : UIContainer
    {
        public GridDefinition[] Columns { get; set; } = Array.Empty<GridDefinition>();
        public GridDefinition[] Rows { get; set; } = Array.Empty<GridDefinition>();
    }
}
