namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// The shape an image input takes.
/// </summary>
public enum UIImageInputShape
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
    Inline = 2,

    /// <summary>
    /// A row of thumbnails and nothing else — each with its remove and its upload's progress, the whole of it not on the page while
    /// empty — that takes several files: a picture as its thumbnail and, where <c>Accept</c> lets others in, any other file as its
    /// kind's glyph over its name. Its chooser is opened from elsewhere (<c>OpenPickerEffect</c>) or fed by a drop target.
    /// </summary>
    Shelf = 3
}
