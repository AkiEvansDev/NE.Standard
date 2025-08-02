using System.Collections.Generic;

namespace NE.Standard.Design.Components
{
    public interface IArea : IBlock
    {
        List<IBlock> Blocks { get; }
    }

    public abstract class Area<T> : Block<T>, IArea
        where T : Area<T>
    {
        public override Alignment HorizontalAlignment { get; set; } = Alignment.Stretch;
        public override Alignment VerticalAlignment { get; set; } = Alignment.Stretch;

        public List<IBlock> Blocks { get; set; }

        public Area()
        {
            Blocks = new List<IBlock>();
        }
    }
}
