using NE.Standard.Design.Elements.Base;

namespace NE.Standard.Design.Elements
{
    public abstract class UICard<T> : UIElement<UICard>
        where T : UICard<T>
    {
        public IUILayout? Content { get; set; }
    }

    public class UICard : UICard<UICard> { }
}
