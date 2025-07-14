using NE.Standard.Design.UI.Common;

namespace NE.Standard.Design.UI
{
    public abstract class UILabel<T> : Block<T>
        where T : UILabel<T>
    {
        public string? Label { get; set; }
        public string? Description { get; set; }
    }

    public sealed class UILabel : UILabel<UILabel> { }
    public sealed class UIText : UILabel<UIText> { }
}
