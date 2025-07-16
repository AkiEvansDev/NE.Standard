using NE.Standard.Design.Common;
using NE.Standard.Design.Components;

namespace NE.Standard.Design.UI
{
    public sealed class ButtonBlock : ActionBlock<ButtonBlock>
    {
        public const string StyleProperty = nameof(Style);
        public const string IconProperty = nameof(Icon);
        public const string LabelProperty = nameof(Label);

        public BlockStyle Style { get; set; } = BlockStyle.Primary;
        public IconSymbol? Icon { get; set; }
        public string Label { get; set; } = default!;
    }
}
