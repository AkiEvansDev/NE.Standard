using System;
using System.Collections.Generic;
using System.Text;

namespace NE.Standard.Design.Types
{
    public class UIPage : UIElement
    {
        public string? Title { get; set; }
        public string? Description { get; set; }

        public List<UIElement>? Elements { get; set; }
    }
}
