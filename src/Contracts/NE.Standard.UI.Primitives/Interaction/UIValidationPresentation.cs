namespace NE.Standard.UI.Primitives.Interaction;

/// <summary>
/// Where a field's validation message goes: a line under the field, or a mark at its edge that speaks in a tooltip.
/// </summary>
public enum UIValidationPresentation
{
    /// <summary>
    /// A line under the field, except where the field sits in a cell of a grid — a table's, a key-value row's — where it is a mark.
    /// </summary>
    Auto = 0,

    /// <summary>
    /// A line under the field, wherever the field is.
    /// </summary>
    Message = 1,

    /// <summary>
    /// A mark at the field's edge, the message in its tooltip; the field keeps its height.
    /// </summary>
    Marker = 2,
}
