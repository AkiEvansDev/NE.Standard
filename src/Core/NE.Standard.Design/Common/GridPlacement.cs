using NE.Standard.Serialization;

namespace NE.Standard.Design.Common
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

        public static GridUnit Star(double value)
            => new GridUnit(UnitType.Star, value);

        public static GridUnit Absolute(double value)
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
}
