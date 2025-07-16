using System;
using System.Collections.Generic;
using System.Text;

namespace NE.Standard.Design.Components
{
    public interface IAreaBlock : IBlock
    {
        List<Block> Blocks { get; }
    }

    public abstract class AreaBlock<T> : Block<T>, IAreaBlock
        where T : AreaBlock<T>
    {
        public override Alignment HorizontalAlignment { get; set; } = Alignment.Stretch;
        public override Alignment VerticalAlignment { get; set; } = Alignment.Stretch;

        public List<Block> Blocks { get; set; }

        public AreaBlock()
        {
            Blocks = new List<Block>();
        }
    }
}
