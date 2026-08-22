namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines semantic input types for text input components.
/// </summary>
public enum UITextInputType
{
    /// <summary>
    /// Plain, unformatted text input.
    /// </summary>
    Text = 0,

    /// <summary>
    /// Input intended for an email address, with matching keyboard/validation hints.
    /// </summary>
    Email = 1,

    /// <summary>
    /// Input intended for a password, masking the entered characters.
    /// </summary>
    Password = 2,

    /// <summary>
    /// Input intended for a search query.
    /// </summary>
    Search = 3,

    /// <summary>
    /// Input intended for a telephone number, with matching keyboard hints.
    /// </summary>
    Tel = 4,

    /// <summary>
    /// Input intended for a URL, with matching keyboard/validation hints.
    /// </summary>
    Url = 5,
}
