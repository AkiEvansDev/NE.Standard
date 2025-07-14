using NE.Standard.Design.Components;
using NE.Standard.Design.UI.Common;

namespace NE.Standard.Design.UI
{
    public sealed class UIButton : UIAction<UIButton>
    {
        public BlockStyle Style { get; set; } = BlockStyle.Primary;

        public string Label { get; set; } = default!;
        public IconSymbol? Icon { get; set; }
    }
}
