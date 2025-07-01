using NE.Standard.Design.Elements.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace NE.Standard.Design.Elements
{
    public class UILabel : UIElement
    {
        public string Label { get; set; } = default!;
        public string? Description { get; set; }
    }
}
