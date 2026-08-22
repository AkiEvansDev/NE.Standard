namespace NE.Standard.UI.Primitives.Recursive;

/// <summary>
/// Defines the kind of segment in a recursive object path.
/// </summary>
public enum PathSegmentKind
{
    /// <summary>
    /// The segment addresses a named property.
    /// </summary>
    Property = 0,

    /// <summary>
    /// The segment addresses a list element by numeric index.
    /// </summary>
    Index = 1,

    /// <summary>
    /// The segment addresses a dictionary element by key.
    /// </summary>
    Key = 2,
}
