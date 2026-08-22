using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Defines the scrolling behavior used by a scroll-to effect.
/// </summary>
public enum ScrollToBehavior
{
    /// <summary>
    /// Uses the browser's default scrolling behavior.
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
public sealed class ScrollToEffect : ClientEffect
{
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
    /// Creates an effect that scrolls the given target component into view.
    /// </summary>
    public ScrollToEffect(UIComponentReference target, ScrollToBehavior behavior, ScrollToBlock block)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target.Id);
        Target = target;
        Behavior = behavior;
        Block = block;
    }

    /// <inheritdoc />
    public override ClientEffectKind Kind => ClientEffectKind.ScrollTo;

    /// <summary>
    /// Gets the target component reference.
    /// </summary>
    public UIComponentReference Target { get; }

    /// <summary>
    /// Gets the scrolling behavior.
    /// </summary>
    public ScrollToBehavior Behavior { get; init; } = ScrollToBehavior.Smooth;

    /// <summary>
    /// Gets the target block alignment.
    /// </summary>
    public ScrollToBlock Block { get; init; } = ScrollToBlock.Nearest;

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
        => new CompiledScrollToEffect(resolver.ResolveComponent(Target), Behavior, Block);
}

internal sealed class CompiledScrollToEffect(UIComponentAddress target, ScrollToBehavior behavior, ScrollToBlock block) : ClientEffect
{
    public override ClientEffectKind Kind => ClientEffectKind.ScrollTo;

    public UIComponentAddress Target { get; } = target;
    public ScrollToBehavior Behavior { get; } = behavior;
    public ScrollToBlock Block { get; } = block;
}
