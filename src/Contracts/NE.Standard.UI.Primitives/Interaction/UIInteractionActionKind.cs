namespace NE.Standard.UI.Primitives.Interaction;

/// <summary>
/// Defines what a UI interaction does when it is triggered.
/// </summary>
public enum UIInteractionActionKind
{
    /// <summary>
    /// The interaction assigns a value to a target property.
    /// </summary>
    SetProperty = 0,

    /// <summary>
    /// The interaction runs a client effect.
    /// </summary>
    Effect = 1,

    /// <summary>
    /// The interaction copies the source property's value into the target property, live while the reader moves the source.
    /// </summary>
    CopyValue = 2,
}
