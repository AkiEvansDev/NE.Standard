using NE.Standard.Design.Elements.Base;
using NE.Standard.Serialization;
using System.Collections.Generic;

namespace NE.Standard.Design.Elements
{
    public interface IUIPage
    {
        List<UIDialog> Dialogs { get; }
        IUILayout? Content { get; }
    }

    [ObjectSerializable]
    public class UIPage : IUIPage
    {
        public List<UIDialog> Dialogs { get; set; }
        public IUILayout? Content { get; set; }

        public UIPage()
        {
            Dialogs = new List<UIDialog>();
        }
    }
}
