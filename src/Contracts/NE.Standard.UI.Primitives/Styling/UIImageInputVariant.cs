namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// What an image input is drawn as.
/// </summary>
public enum UIImageInputVariant
{
    /// <summary>
    /// A large picture: a drop area with the picture as its preview.
    /// </summary>
    Picture = 0,

    /// <summary>
    /// A small round picture replaced in place — a person, a team, a project.
    /// </summary>
    Avatar = 1,

    /// <summary>
    /// A row like the file input's: a thumbnail, the picture's name, and the pick control at the end.
    /// </summary>
    Inline = 2
}
