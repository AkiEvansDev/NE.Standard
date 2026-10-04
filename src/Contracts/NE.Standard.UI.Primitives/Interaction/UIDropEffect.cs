namespace NE.Standard.UI.Primitives.Interaction;

/// <summary>
/// What a drop asks of the items it carries (<c>UIDrop.Effect</c>).
/// </summary>
public enum UIDropEffect
{
    /// <summary>The items leave their source for the target.</summary>
    Move = 0,

    /// <summary>The items stay where they are and the target takes a copy.</summary>
    Copy = 1,
}
