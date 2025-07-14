using NE.Standard.Serialization;

namespace NE.Standard.Design.Components
{
    public enum UnitType
    {
        Star = 1,
        Absolute = 2
    }

    [NEObject]
    public struct GridUnit
    {
        public UnitType Unit { get; set; }
        public double Value { get; set; }

        public GridUnit(UnitType unit, double value)
        {
            Unit = unit;
            Value = value;
        }

        public readonly GridUnit Star(double value)
            => new GridUnit(UnitType.Star, value);

        public readonly GridUnit Absolute(double value)
            => new GridUnit(UnitType.Absolute, value);
    }

    [NEObject]
    public struct GridPlacement
    {
        public int Column { get; set; }
        public int Row { get; set; }
        public int ColumnSpan { get; set; }
        public int RowSpan { get; set; }

        public GridPlacement(int column, int row, int columnSpan = 1, int rowSpan = 1)
        {
            Column = column;
            Row = row;
            ColumnSpan = columnSpan;
            RowSpan = rowSpan;
        }
    }

    [NEObject]
    public struct BlockThickness
    {
        public int Left { get; set; }
        public int Top { get; set; }
        public int Right { get; set; }
        public int Bottom { get; set; }

        public BlockThickness(int value) : this(value, value, value, value) { }
        public BlockThickness(int leftRight, int topBottom) : this(leftRight, topBottom, leftRight, topBottom) { }

        public BlockThickness(int left, int top, int right, int bottom)
        {
            Left = left;
            Top = top;
            Right = right;
            Bottom = bottom;
        }
    }
}
