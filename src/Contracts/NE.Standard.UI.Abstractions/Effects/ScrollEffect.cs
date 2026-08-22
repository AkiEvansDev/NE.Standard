using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Defines the position a scroll effect moves a container to.
/// </summary>
public enum ScrollPosition
{
    /// <summary>
    /// Scrolls to the start of the axis.
    /// </summary>
    Start = 0,

    /// <summary>
    /// Scrolls to the end of the axis.
    /// </summary>
    End = 1,

    /// <summary>
    /// Scrolls to an absolute offset along the axis.
    /// </summary>
    Offset = 2,

    /// <summary>
    /// Scrolls back by one visible page.
    /// </summary>
    PageBack = 3,

    /// <summary>
    /// Scrolls forward by one visible page.
    /// </summary>
    PageForward = 4
}

/// <summary>
/// Requests the UI client to scroll a container, as opposed to bringing a component into view.
/// </summary>
public sealed class ScrollEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that scrolls the container identified by <paramref name="targetComponentId"/> to the given position.
    /// </summary>
    public ScrollEffect(string targetComponentId, ScrollPosition position, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters), position)
    { }

    /// <summary>
    /// Creates an effect that scrolls the given container to the given position.
    /// </summary>
    public ScrollEffect(UIComponentReference target, ScrollPosition position)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target.Id);

        Target = target;
        Position = position;
    }

    /// <inheritdoc />
    public override ClientEffectKind Kind => ClientEffectKind.Scroll;

    /// <summary>
    /// Gets the target container reference.
    /// </summary>
    public UIComponentReference Target { get; }

    /// <summary>
    /// Gets the position the container is scrolled to.
    /// </summary>
    public ScrollPosition Position { get; }

    /// <summary>
    /// Gets the axis scrolled by the effect.
    /// </summary>
    public UIOrientation Axis { get; init; } = UIOrientation.Vertical;

    /// <summary>
    /// Gets the absolute offset used when <see cref="Position"/> is <see cref="ScrollPosition.Offset"/>.
    /// </summary>
    public double Offset { get; init; }

    /// <summary>
    /// Gets the scrolling behavior.
    /// </summary>
    public ScrollToBehavior Behavior { get; init; } = ScrollToBehavior.Smooth;

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);

        return new CompiledScrollEffect(resolver.ResolveComponent(Target), Position, Axis, Offset, Behavior);
    }
}

internal sealed class CompiledScrollEffect(UIComponentAddress target, ScrollPosition position, UIOrientation axis, double offset, ScrollToBehavior behavior) : ClientEffect
{
    public override ClientEffectKind Kind => ClientEffectKind.Scroll;

    public UIComponentAddress Target { get; } = target;
    public ScrollPosition Position { get; } = position;
    public UIOrientation Axis { get; } = axis;
    public double Offset { get; } = offset;
    public ScrollToBehavior Behavior { get; } = behavior;
}
