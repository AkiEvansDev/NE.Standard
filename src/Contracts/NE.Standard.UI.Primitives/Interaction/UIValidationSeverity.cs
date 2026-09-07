namespace NE.Standard.UI.Primitives.Interaction;

/// <summary>
/// What a validation message means: an error stops a submit, a warning and an info only say something.
/// </summary>
public enum UIValidationSeverity
{
    /// <summary>
    /// Blocks a submit and draws both the required marker and the field's edge.
    /// </summary>
    Error = 0,

    /// <summary>
    /// Colours the field's edge but never blocks a submit.
    /// </summary>
    Warning = 1,

    /// <summary>
    /// Speaks only under the field, without touching its edge or blocking a submit.
    /// </summary>
    Info = 2,
}
