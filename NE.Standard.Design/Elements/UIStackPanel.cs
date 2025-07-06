using NE.Standard.Design.Elements.Base;

namespace NE.Standard.Design.Elements
{
    public enum StackOrientation
    {
        Vertical,
        Horizontal
    }

    public sealed class UIStackPanel : UILayout<UIStackPanel>
    {
        public StackOrientation Orientation { get; set; }
        public int Spacing { get; set; }
    }
}
