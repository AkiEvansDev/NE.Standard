namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// A pane of a pane container and the grid cells of the place it was added at, which it holds until the viewer moves it.
/// </summary>
/// <param name="Name">The pane's name, as the container's layout lists it.</param>
/// <param name="Placement">The place's cells, per breakpoint.</param>
public readonly record struct UIPanePlace(string Name, UIResponsive<UIGridPlacement> Placement);
