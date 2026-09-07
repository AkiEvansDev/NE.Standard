namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// What an item lets a host do with it, each unset by default: be chosen, be dragged, be removed, be renamed, open its menu. A
/// host reads what it understands — a tree's heading that refuses the choice folds on a click instead, a pinned node is neither
/// dragged nor removed, a tab that cannot be removed shows no close. The built-in templates bind each to the matching
/// <c>IItemAbilitiesComponent</c> property of the row, so a flag flipped on a live item reaches its row.
/// </summary>
public interface IItemAbilitiesModel
{
    /// <summary>
    /// Gets whether the item may be chosen; unset means it may.
    /// </summary>
    bool? CanSelect { get; }

    /// <summary>
    /// Gets whether the item may be dragged, where its host drags at all; unset means it may.
    /// </summary>
    bool? CanDrag { get; }

    /// <summary>
    /// Gets whether the item may be removed by the host's own gesture — a tab's close, a row's Delete key; unset means it may.
    /// </summary>
    bool? CanRemove { get; }

    /// <summary>
    /// Gets whether the item may be renamed in place, where its host renames at all; unset means it may.
    /// </summary>
    bool? CanRename { get; }

    /// <summary>
    /// Gets whether a right-click on the item opens the menu its template carries; unset means it does.
    /// </summary>
    bool? CanShowContextMenu { get; }
}
