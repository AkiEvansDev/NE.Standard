using System.Collections.Generic;

namespace NE.Standard.Design.Components
{
    public interface IArea : IBlock
    {
        List<Block> Blocks { get; }
    }

    public abstract class Area<T> : Block<T>, IArea
        where T : Area<T>
    {
        public override Alignment HorizontalAlignment { get; set; } = Alignment.Stretch;
        public override Alignment VerticalAlignment { get; set; } = Alignment.Stretch;

        public List<Block> Blocks { get; set; }

        public Area()
        {
            Blocks = new List<Block>();
        }
    }
}
