using System;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// A component's placement in the fixed-column grid: 1-based column/row, and how many columns/rows it spans.
/// </summary>
public readonly record struct UIGridPlacement(int Column, int Row, int ColumnSpan = 1, int RowSpan = 1)
{
    /// <summary>
    /// Gets the number of columns in the standard UI grid.
    /// </summary>
    public const int GridColumns = 24;

    /// <summary>
    /// Creates a placement at the given column and row with the given spans.
    /// </summary>
    public static UIGridPlacement At(int column, int row, int columnSpan = 1, int rowSpan = 1)
        => new(column, row, columnSpan, rowSpan);

    /// <summary>
    /// Validates that column/row are 1-based (at least 1) and spans are positive.
    /// </summary>
    public void Validate()
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(Column, 1);
        ArgumentOutOfRangeException.ThrowIfLessThan(Row, 1);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(ColumnSpan);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(RowSpan);
    }

    public override string ToString()
        => $"UIGridPlacement({Column}, {Row}, {ColumnSpan}, {RowSpan})";
}
