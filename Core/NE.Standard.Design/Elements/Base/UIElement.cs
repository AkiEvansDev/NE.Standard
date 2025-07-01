using NE.Standard.Design.Styles;
using NE.Standard.Design.Types;
using NE.Standard.Serialization;
using System;
using System.Collections.Generic;
using System.Text;

namespace NE.Standard.Design.Elements.Base
{
    [ObjectSerializable]
    public abstract class UIElement
    {
        public int Id { get; set; }
        public bool Enabled { get; set; } = true;

        public virtual int Row { get; set; } = 0;
        public virtual int Column { get; set; } = 0;

        public virtual int RowSpan { get; set; } = 1;
        public virtual int ColumnSpan { get; set; } = 12;

        public virtual Alignment HorizontalAlignment { get; set; } = Alignment.Stretch;
        public virtual Alignment VerticalAlignment { get; set; } = Alignment.Start;

        public UIStyleConfig? OverrideStyle { get; set; }
    }
}
