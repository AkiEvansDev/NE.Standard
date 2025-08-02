using NE.Standard.Design.Components;

namespace NE.Standard.Design.UI
{
    public class LabelBlock<T> : Block<T>
        where T : LabelBlock<T>
    {
        public const string LabelProperty = nameof(Label);
        public const string DescriptionProperty = nameof(Description);

        public string Label { get; set; } = default!;
        public string? Description { get; set; }

        public T BindLabel(string path)
            => Bind(LabelProperty, path);

        public T BindDescription(string path)
            => Bind(DescriptionProperty, path);
    }

    public sealed class LabelBlock : LabelBlock<LabelBlock> { }
}
