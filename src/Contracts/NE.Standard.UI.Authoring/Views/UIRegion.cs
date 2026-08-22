using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Authoring.Views;

/// <summary>
/// Defines a named region declared by an authored UI view.
/// </summary>
public sealed class UIRegion
{
    /// <summary>
    /// Gets the stable region key.
    /// </summary>
    public required string Key { get; init; }

    /// <summary>
    /// Gets the root component rendered in the region.
    /// </summary>
    public required IVisualComponent Root { get; init; }
}
