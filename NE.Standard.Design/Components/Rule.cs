using NE.Standard.Serialization;

namespace NE.Standard.Design.Components
{
    public enum RuleType
    {
        Required = 1,
        Equals = 2,
        Greater = 3,
        GreaterOrEqual = 4,
        Less = 5,
        LessOrEqual = 6,
        Like = 7,
        In = 8,
        Regex = 9
    }

    [NEObject]
    public class Rule
    {
        public RuleType ValidationType { get; set; }
        public object? ValidationValue { get; set; }

        public bool Invert { get; set; } = false;
    }

    public class ValidationRule : Rule
    {
        public string? ErrorMessage { get; set; }
    }

    public enum InteractionType
    {
        Disable = 1,
        Hide = 2,
    }

    public class InteractionRule : Rule
    {
        public InteractionType InteractionType { get; set; } = InteractionType.Disable;

        public string TargetId { get; set; } = default!;
        public string TargetProperty { get; set; } = default!;
    }
}
