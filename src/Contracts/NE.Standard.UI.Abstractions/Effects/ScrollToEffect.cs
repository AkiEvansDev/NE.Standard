using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Defines the scrolling behavior used by a scroll-to effect.
/// </summary>
public enum ScrollToBehavior
{
    /// <summary>
    /// Uses the platform's default scrolling behavior.
    /// </summary>
    Auto = 0,

    /// <summary>
    /// Animates the scroll smoothly.
    /// </summary>
    Smooth = 1
}

/// <summary>
/// Defines the target block alignment used by a scroll-to effect.
/// </summary>
public enum ScrollToBlock
{
    /// <summary>
    /// Aligns the target's start edge to the visible area.
    /// </summary>
    Start = 0,

    /// <summary>
    /// Centers the target within the visible area.
    /// </summary>
    Center = 1,

    /// <summary>
    /// Aligns the target's end edge to the visible area.
    /// </summary>
    End = 2,

    /// <summary>
    /// Scrolls the minimum amount needed to bring the target into view.
    /// </summary>
    Nearest = 3
}

/// <summary>
/// Requests the UI client to scroll a component into view.
/// </summary>
public sealed class ScrollToEffect : TargetedClientEffect
{
    /// <summary>
    /// Creates an effect aimed at the given target component with the specified behavior and block alignment.
    /// </summary>
    public ScrollToEffect(UIComponentReference target, ScrollToBehavior behavior, ScrollToBlock block)
        : base(target)
    {
        Behavior = behavior;
        Block = block;
    }

    /// <summary>
    /// Creates an effect that scrolls the component identified by <paramref name="targetComponentId"/>
    /// into view, using the default behavior and block alignment.
    /// </summary>
    public ScrollToEffect(string targetComponentId, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters), ScrollToBehavior.Smooth, ScrollToBlock.Nearest)
    { }

    /// <summary>
    /// Creates an effect that scrolls the component identified by <paramref name="targetComponentId"/>
    /// into view, using the given behavior and block alignment.
    /// </summary>
    public ScrollToEffect(string targetComponentId, ScrollToBehavior behavior, ScrollToBlock block, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters), behavior, block)
    { }

    /// <summary>
    /// Creates an effect that scrolls <paramref name="targetComponent"/>
    /// into view, using the default behavior and block alignment.
    /// </summary>
    public ScrollToEffect(IBindableComponent targetComponent, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponent, dynamicParameters), ScrollToBehavior.Smooth, ScrollToBlock.Nearest)
    { }

    /// <summary>
    /// Creates an effect that scrolls <paramref name="targetComponent"/>
    /// into view, using the given behavior and block alignment.
    /// </summary>
    public ScrollToEffect(IBindableComponent targetComponent, ScrollToBehavior behavior, ScrollToBlock block, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponent, dynamicParameters), behavior, block)
    { }

    [JsonConstructor]
    internal ScrollToEffect(UIComponentAddress? resolvedTarget, ScrollToBehavior behavior, ScrollToBlock block)
        : base(resolvedTarget)
    {
        Behavior = behavior;
        Block = block;
    }

    private ScrollToEffect(UIComponentAddress resolvedTarget, UIComponentReference target, ScrollToBehavior behavior, ScrollToBlock block)
        : base(resolvedTarget, target)
    {
        Behavior = behavior;
        Block = block;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.ScrollTo;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the scrolling behavior.
    /// </summary>
    public ScrollToBehavior Behavior { get; init; }

    /// <summary>
    /// Gets the target block alignment.
    /// </summary>
    public ScrollToBlock Block { get; init; }

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);
        return ResolvedTarget is not null ? this : new ScrollToEffect(resolver.ResolveComponent(Target), Target, Behavior, Block);
    }
}
