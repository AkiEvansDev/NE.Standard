using NE.Standard.Serialization;
using System.Collections.Generic;

namespace NE.Standard.Design.Elements.Base
{
    /// <summary>
    /// Handles client-side validation.
    /// </summary>
    [ObjectSerializable]
    public struct UIValidationRule
    {
        public ValidationType ValidationType { get; set; }
        public object? ValidationValue { get; set; }
        public string? ErrorMessage { get; set; }
    }

    public interface IUIProperty : IUIElement
    {
        bool ReadOnly { get; }
        List<UIValidationRule>? ValidationRules { get; }
    }

    public abstract class UIProperty<T> : UIElement<T>, IUIProperty
        where T : UIProperty<T>
    {
        public bool ReadOnly { get; set; } = false;
        public List<UIValidationRule>? ValidationRules { get; set; }

        public T AddValidationRule(ValidationType validation, object? value = null, string? error = null)
        {
            ValidationRules ??= new List<UIValidationRule>();
            ValidationRules.Add(new UIValidationRule
            {
                ValidationType = validation,
                ValidationValue = value,
                ErrorMessage = error
            });

            return (T)this;
        }
    }
}
