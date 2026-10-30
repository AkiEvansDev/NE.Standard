using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A component holding the page's writes to its own two-way properties to what it offers — a picker's choices, a gesture it has —
/// read by the server before a write lands; a refused one is answered with the server's value.
/// </summary>
/// <remarks>
/// The check is read once, when the view compiles, from the component's own settings: it judges the value written alone, never the
/// controller. The core's own checks (an input's bounds, a closed component) run as well.
/// </remarks>
public interface IClientWriteCheckComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="ClientWriteCheck"/>.
    /// </summary>
    static UIProperty ClientWriteCheckProperty { get; } = new(nameof(ClientWriteCheck));

    /// <summary>
    /// Gets what the page's writes to the component's own properties are held to; <see langword="null"/> for nothing.
    /// </summary>
    UIClientWriteCheck? ClientWriteCheck { get; }
}

/// <summary>
/// What a component takes from the page for its own two-way properties (<see cref="IClientWriteCheckComponent"/>).
/// </summary>
public abstract class UIClientWriteCheck
{
    /// <summary>
    /// Whether the page may write <paramref name="value"/> to <paramref name="property"/>: the value as the write reads it, in the
    /// property's own type, or <see langword="null"/> for a cleared one. A property the check does not hold is accepted.
    /// </summary>
    public abstract bool Accepts(UIProperty property, object? value);
}
