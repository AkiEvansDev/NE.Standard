namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A component whose own parts are presses — a tab strip's tabs, an expander's summary, a tree's rows, a grid's headers, a chart's
/// legend — and so a control a link may not hold: an anchor takes no press inside.
/// </summary>
public interface IPressablePartsComponent : IVisualComponent
{
    /// <summary>Whether its parts are presses as it is set up; one that always draws them says so by default.</summary>
    bool HasPressableParts => true;
}
