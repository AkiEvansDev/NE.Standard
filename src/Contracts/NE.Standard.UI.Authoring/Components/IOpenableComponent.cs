using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A component with a popup the reader opens and closes — a flyout, a package's popup; the server never answers a close with a
/// reopening, since a popup closes by an outside press or Escape, which nothing refuses.
/// </summary>
public interface IOpenableComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for whether the popup is open.
    /// </summary>
    static UIProperty IsOpenProperty { get; } = new("IsOpen");
}
