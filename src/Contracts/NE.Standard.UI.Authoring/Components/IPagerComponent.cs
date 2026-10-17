namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Marks a pager, whose <c>Target</c> the view checks when it compiles: a property of that name on another component means something
/// else, and is not a pager's.
/// </summary>
public interface IPagerComponent : IVisualComponent;
