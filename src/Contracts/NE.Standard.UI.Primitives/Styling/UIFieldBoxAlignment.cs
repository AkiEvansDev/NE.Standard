namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Which field boxes a panel stands level with, or none.
/// </summary>
public enum UIFieldBoxAlignment
{
    /// <summary>Stands where it is laid out.</summary>
    None = 0,

    /// <summary>Level with small field boxes (<see cref="UIInputSize.Small"/>).</summary>
    Small = 1,

    /// <summary>Level with medium field boxes (<see cref="UIInputSize.Medium"/>).</summary>
    Medium = 2,

    /// <summary>Level with large field boxes (<see cref="UIInputSize.Large"/>).</summary>
    Large = 3,
}
