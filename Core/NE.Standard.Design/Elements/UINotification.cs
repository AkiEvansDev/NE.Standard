using NE.Standard.Design.Types;
using System;

namespace NE.Standard.Design.Elements
{
    public class UINotification : UILabel
    {
        public string Key { get; set; } = default!;

        public NotificationType NotificationType { get; set; }
        public NotificationDisplayType DisplayType { get; set; }

        public TimeSpan? Timeout { get; set; }
    }
}
