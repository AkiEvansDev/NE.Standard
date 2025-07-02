using NE.Standard.Design.Elements.Base;

namespace NE.Standard.Design.Elements
{
    public class UILabel : UIElement
    {
        public string Label { get; set; } = default!;
        public string? Description { get; set; }
    }

    public class UITest : UILabel { }
}
