namespace NE.Standard.UI.Primitives.Recursive;

/// <summary>
/// Defines the kind of change reported for a recursively observed value.
/// </summary>
public enum RecursiveChangeKind
{
    /// <summary>
    /// A property value was set.
    /// </summary>
    Set = 0,

    /// <summary>
    /// One or more elements were added to a collection.
    /// </summary>
    Add = 1,

    /// <summary>
    /// One or more elements were removed from a collection.
    /// </summary>
    Remove = 2,

    /// <summary>
    /// One or more elements were replaced in place within a collection.
    /// </summary>
    Replace = 3,

    /// <summary>
    /// One or more elements were moved to a different position within a collection.
    /// </summary>
    Move = 4,

    /// <summary>
    /// The entire collection or object graph was reset.
    /// </summary>
    Reset = 5,
}
