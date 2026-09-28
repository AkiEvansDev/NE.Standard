using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A button whose end opens a menu. In <see cref="UISplitButtonMode.Menu"/> the whole button opens it, so a click of its own would
/// never run — the compiler refuses one.
/// </summary>
public interface ISplitButtonComponent : IVisualComponent
{
    /// <summary>
    /// Gets which part opens the menu: the end part alone, or the whole button; unset is the end part.
    /// </summary>
    UISplitButtonMode? Mode { get; }
}
