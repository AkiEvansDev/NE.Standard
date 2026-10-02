namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// The shape a picture standing alone is drawn in.
/// </summary>
public enum UIImageShape
{
    /// <summary>
    /// The box the layout gives it, its corners as <c>CornerRadius</c> says.
    /// </summary>
    Default = 0,

    /// <summary>
    /// A circle: a square box, the picture filling it and cropped to its middle unless <c>Fit</c> says otherwise — a person, a team.
    /// </summary>
    Circle = 1
}
