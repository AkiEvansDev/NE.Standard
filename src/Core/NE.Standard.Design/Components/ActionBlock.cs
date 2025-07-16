namespace NE.Standard.Design.Components
{
    public interface IActionBlock : IBlock
    {
        string Action { get; }
        object[]? Parameters { get; }
    }

    public abstract class ActionBlock<T> : Block<T>, IActionBlock
        where T : ActionBlock<T>
    {
        public override Alignment HorizontalAlignment { get; set; } = Alignment.Stretch;
        public override Alignment VerticalAlignment { get; set; } = Alignment.Center;

        public string Action { get; set; } = default!;
        public object[]? Parameters { get; set; }
    }
}
