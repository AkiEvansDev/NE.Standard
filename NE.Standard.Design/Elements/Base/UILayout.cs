using System.Collections.Generic;

namespace NE.Standard.Design.Elements.Base
{
    public interface IUILayout : IUIElement
    {
        List<UIElement> Elements { get; }
    }

    public abstract class UILayout<T> : UIElement<T>, IUILayout
        where T : UILayout<T>
    {
        public List<UIElement> Elements { get; set; }

        public UILayout()
        {
            Elements = new List<UIElement>();
        }
    }
}
