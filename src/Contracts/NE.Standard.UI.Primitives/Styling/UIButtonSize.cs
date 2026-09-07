namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// How much room a button takes, independent of what it holds.
/// </summary>
public enum UIButtonSize
{
    /// <summary>Sized to sit inside a row, a toolbar or a list without setting its height.</summary>
    Small = 0,

    /// <summary>The ordinary control height — a button standing on its own.</summary>
    Medium = 1,

    /// <summary>A call to action, where the button is the point of what it sits in.</summary>
    Large = 2,
}
