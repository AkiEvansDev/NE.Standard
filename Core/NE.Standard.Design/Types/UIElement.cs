using NE.Standard.Serialization;

namespace NE.Standard.Design.Types
{
    [ObjectSerializable]
    public abstract class UIElement
    {
        public string? Id { get; set; }
        public LayoutConfig? Layout { get; set; }
    }

    [ObjectSerializable]
    public class LayoutConfig
    {
        public int Row { get; set; } = 0;
        public int Column { get; set; } = 0;

        public int ColumnSpan { get; set; } = 12;
        public int RowSpan { get; set; } = 1;

        public Alignment HorizontalAlignment { get; set; } = Alignment.Stretch;
        public Alignment VerticalAlignment { get; set; } = Alignment.Top;
    }
}
