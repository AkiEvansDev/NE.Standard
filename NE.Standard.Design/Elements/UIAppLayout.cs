using NE.Standard.Design.Elements.Base;

namespace NE.Standard.Design.Elements
{
    public class UIDialogRenderer : UIElement { }
    public class UINotificationRenderer : UIElement { }
    public class UIPageRenderer : UIElement { }

    public class UIAppLayout : UIGrid
    {
        public UIGrid Overlay { get; set; } = default!;
    }
}
