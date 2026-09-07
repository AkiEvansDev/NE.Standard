namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Where a dialog's panel stands: centred over the page, or against one edge of the viewport as a sheet the full length of that edge.
/// </summary>
public enum UIDialogPlacement
{
    /// <summary>Centred over the page.</summary>
    Center,

    /// <summary>Against the left edge, the viewport's full height.</summary>
    Left,

    /// <summary>Against the right edge, the viewport's full height.</summary>
    Right,

    /// <summary>Against the top edge, the viewport's full width.</summary>
    Top,

    /// <summary>Against the bottom edge, the viewport's full width.</summary>
    Bottom
}
