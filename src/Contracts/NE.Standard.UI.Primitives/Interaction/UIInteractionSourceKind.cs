namespace NE.Standard.UI.Primitives.Interaction;

/// <summary>
/// Defines the source kind that triggers a UI interaction.
/// </summary>
public enum UIInteractionSourceKind
{
    /// <summary>
    /// The interaction is triggered by a property value change.
    /// </summary>
    Property = 0,

    /// <summary>
    /// The interaction is triggered by an event.
    /// </summary>
    Event = 1,
}
