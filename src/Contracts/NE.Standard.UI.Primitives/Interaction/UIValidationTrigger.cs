namespace NE.Standard.UI.Primitives.Interaction;

/// <summary>
/// Defines when a UI validation rule is evaluated.
/// </summary>
public enum UIValidationTrigger
{
    /// <summary>
    /// The rule is evaluated whenever the value changes.
    /// </summary>
    Change = 0,

    /// <summary>
    /// The rule is evaluated when the input loses focus.
    /// </summary>
    Blur = 1,

    /// <summary>
    /// The rule is evaluated when the form is submitted.
    /// </summary>
    Submit = 2,
}
