using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding;
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
public sealed class ScrollEffect : TargetedClientEffect
{
    /// <summary>
    /// Creates an effect aimed at the given container and position.
    /// </summary>
    public ScrollEffect(UIComponentReference target, ScrollPosition position)
        : base(target)
    {
        Position = position;
    }

    /// <summary>
    /// Creates an effect that scrolls the container identified by <paramref name="targetComponentId"/> to the given position.
    /// </summary>
    public ScrollEffect(string targetComponentId, ScrollPosition position, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters), position)
    { }

    /// <summary>
    /// Creates an effect that scrolls <paramref name="targetComponent"/> to the given position.
    /// </summary>
    public ScrollEffect(IBindableComponent targetComponent, ScrollPosition position, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponent, dynamicParameters), position)
    { }

    [JsonConstructor]
    internal ScrollEffect(UIComponentAddress? resolvedTarget, ScrollPosition position, UIOrientation axis = UIOrientation.Vertical, double offset = 0d, ScrollToBehavior behavior = ScrollToBehavior.Smooth)
        : base(resolvedTarget)
    {
        Position = position;
        Axis = axis;
        Offset = offset;
        Behavior = behavior;
    }

    private ScrollEffect(UIComponentAddress resolvedTarget, UIComponentReference target, ScrollPosition position, UIOrientation axis, double offset, ScrollToBehavior behavior)
        : base(resolvedTarget, target)
    {
        Position = position;
        Axis = axis;
        Offset = offset;
        Behavior = behavior;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.Scroll;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

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

        return ResolvedTarget is not null ? this : new ScrollEffect(resolver.ResolveComponent(Target), Target, Position, Axis, Offset, Behavior);
    }
}
