using System.Collections.Generic;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// A pane container's places at one tier once its panes keep their sizes (<see cref="UIPaneLayout.Arrange"/>): each place's cells, and
/// the order its tracks stand in along each axis as authored indices, null where they stand as authored.
/// </summary>
public sealed record UIPaneArrangement(IReadOnlyList<UIGridPlacement> Cells, IReadOnlyList<int>? ColumnOrder, IReadOnlyList<int>? RowOrder);
