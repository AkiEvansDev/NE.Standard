namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines how an image is fitted into its layout bounds.
/// </summary>
public enum UIImageFit
{
    /// <summary>
    /// Uses the platform's default fitting behavior.
    /// </summary>
    Default = 0,

    /// <summary>
    /// Stretches the image to fill its bounds, ignoring aspect ratio.
    /// </summary>
    Fill = 1,

    /// <summary>
    /// Scales the image to fit entirely within its bounds while preserving aspect ratio.
    /// </summary>
    Contain = 2,

    /// <summary>
    /// Scales the image to cover its bounds while preserving aspect ratio, cropping if needed.
    /// </summary>
    Cover = 3,

    /// <summary>
    /// Renders the image at its natural size, without scaling.
    /// </summary>
    None = 4,
}
