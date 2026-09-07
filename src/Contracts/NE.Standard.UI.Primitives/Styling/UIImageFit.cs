namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines how an image is fitted into its layout bounds; <see langword="null"/> leaves it to the platform's default.
/// </summary>
public enum UIImageFit
{
    /// <summary>
    /// Stretches the image to fill its bounds, ignoring aspect ratio.
    /// </summary>
    Fill = 0,

    /// <summary>
    /// Scales the image to fit entirely within its bounds while preserving aspect ratio.
    /// </summary>
    Contain = 1,

    /// <summary>
    /// Scales the image to cover its bounds while preserving aspect ratio, cropping if needed.
    /// </summary>
    Cover = 2,

    /// <summary>
    /// Renders the image at its natural size, without scaling.
    /// </summary>
    None = 3,
}
