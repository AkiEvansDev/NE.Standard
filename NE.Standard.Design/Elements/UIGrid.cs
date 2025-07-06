using NE.Standard.Design.Elements.Base;

namespace NE.Standard.Design.Elements
{
    public struct GridDefinition
    {
        public double? Absolute { get; set; }
        public double? Star { get; set; }
    }

    public sealed class UIGrid : UILayout<UIGrid>
    {
        public override Alignment HorizontalAlignment { get; set; } = Alignment.Stretch;
        public override Alignment VerticalAlignment { get; set; } = Alignment.Stretch;

        public GridDefinition[] Columns { get; set; }
        public GridDefinition[] Rows { get; set; }

        public UIGrid()
        {
            Columns = new GridDefinition[0];
            Rows = new GridDefinition[0];
        }
    }
}
