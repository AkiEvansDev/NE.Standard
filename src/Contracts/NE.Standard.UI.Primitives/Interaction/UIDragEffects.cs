using System;

namespace NE.Standard.UI.Primitives.Interaction;

/// <summary>
/// What a drag source lets a drop do with its items, combined: move them out of it, copy them, or both.
/// </summary>
[Flags]
public enum UIDragEffects
{
    /// <summary>Nothing: the items are not dragged out of their host.</summary>
    None = 0,

    /// <summary>The items leave the source for the target.</summary>
    Move = 1,

    /// <summary>The items stay in the source and a copy goes to the target.</summary>
    Copy = 2,

    /// <summary>Either, the drop deciding: a move between hosts of one kind, a copy into anything else, Ctrl (⌥ on a Mac) turning a move into a copy.</summary>
    All = Move | Copy,
}
