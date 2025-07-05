using NE.Standard.Design.Elements.Base;
using NE.Standard.Serialization;

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

    [ObjectSerializable]
    public class UIAppLayout
    {
        public IUILayout? Overlay { get; set; }
        public IUILayout? Content { get; set; }
    }
}
