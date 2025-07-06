using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Models;

namespace NE.Standard.Design.Elements
{
    /// <summary>
    /// Place for displaying dialogs.
    /// </summary>
    public class UIDialogRenderer : UIElement<UIDialogRenderer> { }

    /// <summary>
    /// Place for displaying notifications.
    /// </summary>
    public class UINotificationRenderer : UIElement<UINotificationRenderer> { }

    /// <summary>
    /// Place for displaying current page.
    /// </summary>
    public class UIPageRenderer : UIElement<UIPageRenderer> { }

    public sealed class UIApp
    {
        public IModel? AppModel { get; set; }
        public IUILayout? OverlayLayout { get; set; }
        public IUILayout? ContentLayout { get; set; }
    }
}
