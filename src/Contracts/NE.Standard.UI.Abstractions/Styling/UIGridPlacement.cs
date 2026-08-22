using System;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Represents a component placement in a fixed-column grid.
/// </summary>
/// <remarks>
/// <see cref="Column"/> and <see cref="Row"/> are 1-based, matching CSS grid line numbering
/// (the first column/row is 1, not 0).
/// </remarks>
public readonly record struct UIGridPlacement(int Column, int Row, int ColumnSpan = 1, int RowSpan = 1)
{
    /// <summary>
    /// Gets the number of columns in the standard UI grid.
    /// </summary>
    public const int GridColumns = 24;

    /// <summary>
    /// Creates a placement spanning the full grid width.
    /// </summary>
    public static UIGridPlacement Full(int column = 1, int row = 1, int rowSpan = 1)
        => At(column, row, GridColumns, rowSpan);

    /// <summary>
    /// Creates a placement spanning half of the grid width.
    /// </summary>
    public static UIGridPlacement Half(int column = 1, int row = 1, int rowSpan = 1)
        => At(column, row, 12, rowSpan);

    /// <summary>
    /// Creates a placement spanning a third of the grid width.
    /// </summary>
    public static UIGridPlacement Third(int column = 1, int row = 1, int rowSpan = 1)
        => At(column, row, 8, rowSpan);

    /// <summary>
    /// Creates a placement spanning a quarter of the grid width.
    /// </summary>
    public static UIGridPlacement Quarter(int column = 1, int row = 1, int rowSpan = 1)
        => At(column, row, 6, rowSpan);

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
