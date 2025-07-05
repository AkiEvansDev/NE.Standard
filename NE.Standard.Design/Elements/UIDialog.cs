using NE.Standard.Serialization;
using System;

namespace NE.Standard.Design.Elements
{
    public enum NotificationType
    {
        Message,
        Warning,
        Error
    }

    public enum NotificationDisplayType
    {
        Manual,
        Timeout
    }

    [ObjectSerializable]
    public struct UINotification
    {
        public string? Label { get; set; }
        public string? Description { get; set; }

        public NotificationType NotificationType { get; set; }
        public NotificationDisplayType DisplayType { get; set; }

        public TimeSpan? Timeout { get; set; }
    }

    public class UIDialog : UICard<UIDialog> { }
}
