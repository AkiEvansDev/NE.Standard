namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines how a background picture's dim is spread over it.
/// </summary>
public enum UIBackgroundDimMode
{
    /// <summary>
    /// Dims the whole picture evenly: the one text reads on anywhere, as a message feed's wallpaper wants.
    /// </summary>
    Uniform = 0,

    /// <summary>
    /// Dims the edges and leaves the middle clear: a frame for a card or a hero picture, not a ground for reading.
    /// </summary>
    Vignette = 1,
}
