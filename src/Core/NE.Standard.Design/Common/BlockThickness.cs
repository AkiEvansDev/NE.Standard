using NE.Standard.Serialization;

namespace NE.Standard.Design.Common
{
    [NEObject]
    public struct BlockThickness
    {
        public int Left { get; set; }
        public int Top { get; set; }
        public int Right { get; set; }
        public int Bottom { get; set; }

        public BlockThickness(int value) : this(value, value, value, value) { }
        public BlockThickness(int leftRight, int topBottom) : this(leftRight, topBottom, leftRight, topBottom) { }

        public BlockThickness(int left, int top, int right, int bottom)
        {
            Left = left;
            Top = top;
            Right = right;
            Bottom = bottom;
        }
    }
}
