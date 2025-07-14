using NE.Standard.Design.Components;
using System.Collections.Generic;

namespace NE.Standard.Design.UI.Common
{
    public interface IUIInput : IBlock
    {
        object? ObjectValue { get; }
        bool ReadOnly { get; }
        List<BlockValidation>? Validations { get; }
    }

    public abstract class UIInput<T, V> : Block<T>, IUIInput
        where T : UIInput<T, V>
    {
        public override Alignment HorizontalAlignment { get; set; } = Alignment.Stretch;
        public override Alignment VerticalAlignment { get; set; } = Alignment.Center;

        public V Value { get; set; } = default!;
        object? IUIInput.ObjectValue => Value;

        public virtual bool ReadOnly { get; set; } = false;
        public List<BlockValidation>? Validations { get; set; }

        public T AddValidation(RuleType type, object? value = null, bool invert = false, string? error = null)
        {
            Validations ??= new List<BlockValidation>();
            Validations.Add(new BlockValidation
            {
                ValidationType = type,
                ValidationValue = value,
                Invert = invert,
                ErrorMessage = error
            });

            return (T)this;
        }
    }
}
