using NE.Standard.Design.Elements.Base;

namespace NE.Standard.Design.Elements
{
    public class UILabel<T> : UIElement<T>
        where T : UILabel<T>
    {
        public string? Label { get; set; }
        public string? Description { get; set; }
    }

    public class UILabel : UILabel<UILabel> { }
    public class UIText : UILabel<UIText> { }
}
