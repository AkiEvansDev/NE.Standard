using NE.Standard.Design.Types;
using NE.Standard.Serialization;

namespace NE.Standard.Design.Elements.Base
{
    [ObjectSerializable]
    public struct UIValidationRule
    {
        public ValidationType ValidationType { get; set; }
        public object? Value { get; set; }
        public string? ErrorMessage { get; set; }
    }

    public abstract class UIProperty : UILabel
    {
        public bool Editable { get; set; } = true;

        public BindingType BindingType { get; set; }
        public string? BindingProperty { get; set; }

        public UIValidationRule[]? ValidationRules { get; set; }
    }
}
