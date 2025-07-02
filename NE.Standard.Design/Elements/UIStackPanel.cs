using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Types;

namespace NE.Standard.Design.Elements
{
    public class UIStackPanel : UIContainer
    {
        public StackOrientation Orientation { get; set; } = StackOrientation.Vertical;
        public int Spacing { get; set; } = 0;
    }
}
