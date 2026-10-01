namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// The frame an image input fits a chosen picture to before it uploads.
/// </summary>
public enum UIImageCrop
{
    /// <summary>
    /// No crop: the chosen file uploads as it is.
    /// </summary>
    None = 0,

    /// <summary>
    /// A square frame: a cover, a logo, a thumbnail.
    /// </summary>
    Square = 1,

    /// <summary>
    /// A round frame for an avatar; the picture sent is still the square under it.
    /// </summary>
    Circle = 2
}
