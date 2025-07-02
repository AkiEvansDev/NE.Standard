using NE.Standard.Design.Styles;
using NE.Standard.Design.Types;
using NE.Standard.Serialization;

namespace NE.Standard.Design.Elements.Base
{
    [ObjectSerializable]
    public struct UILayoutPlacement
    {
        public int Row { get; set; }
        public int Column { get; set; }
        public int RowSpan { get; set; }
        public int ColumnSpan { get; set; }
    }

    [ObjectSerializable]
    public abstract class UIElement
    {
        public string Id { get; set; } = default!;
        public bool Enabled { get; set; } = true;

        public virtual Alignment HorizontalAlignment { get; set; } = Alignment.Stretch;
        public virtual Alignment VerticalAlignment { get; set; } = Alignment.Start;

        public UILayoutPlacement? LayoutPlacement { get; set; }
        public UIStyleConfig? OverrideStyle { get; set; }
    }
}
