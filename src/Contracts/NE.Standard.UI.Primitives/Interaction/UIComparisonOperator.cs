namespace NE.Standard.UI.Primitives.Interaction;

/// <summary>
/// Defines comparison operators used by UI validation and interaction rules.
/// </summary>
public enum UIComparisonOperator
{
    /// <summary>
    /// The value must be present (not null, empty, or whitespace).
    /// </summary>
    Required = 0,

    /// <summary>
    /// The value must equal the comparison value.
    /// </summary>
    Equal = 1,

    /// <summary>
    /// The value must not equal the comparison value.
    /// </summary>
    NotEqual = 2,

    /// <summary>
    /// The value must be greater than the comparison value.
    /// </summary>
    Greater = 3,

    /// <summary>
    /// The value must be greater than or equal to the comparison value.
    /// </summary>
    GreaterOrEqual = 4,

    /// <summary>
    /// The value must be less than the comparison value.
    /// </summary>
    Less = 5,

    /// <summary>
    /// The value must be less than or equal to the comparison value.
    /// </summary>
    LessOrEqual = 6,

    /// <summary>
    /// The value must contain the comparison value as a substring.
    /// </summary>
    Like = 7,

    /// <summary>
    /// The value must be contained in the comparison value's collection.
    /// </summary>
    In = 8,

    /// <summary>
    /// The value must match the comparison value as a regular expression.
    /// </summary>
    Regex = 9,

    /// <summary>
    /// The value must contain the comparison value as a substring, ignoring case. What a search box filtering
    /// a list wants — <see cref="Like"/> stays exact, since a validation rule may well mean it.
    /// </summary>
    LikeIgnoreCase = 10,
}
