using System;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Represents a component placement in a fixed-column grid.
/// </summary>
/// <remarks>
/// <see cref="Column"/> and <see cref="Row"/> are 1-based.
/// </remarks>
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
