using NE.Standard.Design.Binding;
using NE.Standard.Design.Common;

namespace NE.Standard.Design.Components
{
    public interface IInputBlock : IBlock
    {
        IconSymbol? Icon { get; }
        string Label { get; }
        string? Placeholder { get; }

        object? ObjectValue { get; }
        bool ReadOnly { get; }

        string? Error { get; }
    }

    public abstract class InputBlock<T, V> : Block<T>, IInputBlock
        where T : InputBlock<T, V>
    {
        public const string IconProperty = nameof(Icon);
        public const string LabelProperty = nameof(Label);
        public const string PlaceholderProperty = nameof(Placeholder);
        public const string ValueProperty = nameof(Value);
        public const string ReadOnlyProperty = nameof(ReadOnly);
        public const string ErrorProperty = nameof(Error);

        public override Alignment HorizontalAlignment { get; set; } = Alignment.Stretch;
        public override Alignment VerticalAlignment { get; set; } = Alignment.Center;

        public IconSymbol? Icon { get; set; }
        public string Label { get; set; } = default!;
        public string? Placeholder { get; set; }

        public V Value { get; set; } = default!;
        object? IInputBlock.ObjectValue => Value;

        public virtual bool ReadOnly { get; set; } = false;

        public string? Error { get; set; }

        public T ErrorInteraction(string id, string property, InteractionType type = InteractionType.Required, object? value = null, bool invert = false, string? error = null)
        {
            return Interaction(ErrorProperty, id, property, type, value, invert, error);
        }
    }
}
