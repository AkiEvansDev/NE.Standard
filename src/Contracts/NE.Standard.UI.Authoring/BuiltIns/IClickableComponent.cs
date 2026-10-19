using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A component pressable as a whole where it is asked to be — a surface, a card, a file tile: the affordance and the click both.
/// </summary>
public interface IClickableComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Clickable"/>.
    /// </summary>
    static UIProperty ClickableProperty { get; } = new UIProperty(nameof(Clickable));

    /// <summary>
    /// Gets whether the whole component is actionable — the affordance and the click both; unset, it is where it has a click of its
    /// own (a command or an interaction on its click, or an address it links to), and false or bound, that value gates the click.
    /// Controls inside are unaffected.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    bool? Clickable { get; }
}
