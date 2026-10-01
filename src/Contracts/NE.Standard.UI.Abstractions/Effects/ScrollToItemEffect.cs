using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to bring one row of an items host into view by its item's key — a group header standing over the row with
/// it — and to keep it there through the window's layout until the reader scrolls.
/// </summary>
/// <remarks>
/// The row is looked for once the command's changes are on the page, so a command that reads a windowed source's window
/// (<c>LoadWindowAsync</c>) and answers with this effect shows that window at the row: what a jump to a day or a search hit asks for.
/// A row not among the ones the host has drawn — outside the window, or not yet drawn by a virtualized host — is not looked for further.
/// </remarks>
public sealed class ScrollToItemEffect : TargetedClientEffect
{
    /// <summary>
    /// Creates an effect that brings the row with <paramref name="key"/> of the given items host into view.
    /// </summary>
    public ScrollToItemEffect(UIComponentReference target, string key)
        : base(target)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        Key = key;
    }

    /// <summary>
    /// Creates an effect that brings the row with <paramref name="key"/> of the items host identified by
    /// <paramref name="targetComponentId"/> into view.
    /// </summary>
    public ScrollToItemEffect(string targetComponentId, string key, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters), key)
    { }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.ScrollToItem;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the key of the row's item.
    /// </summary>
    public string Key { get; }

    /// <summary>
    /// Gets where along the host's viewport the row stands; at its top unless set.
    /// </summary>
    public ScrollToBlock Block { get; init; } = ScrollToBlock.Start;

    /// <summary>
    /// Gets the scrolling behavior; at once unless set, since a jump lands in a window just read.
    /// </summary>
    public ScrollToBehavior Behavior { get; init; } = ScrollToBehavior.Auto;

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);

        return new CompiledScrollToItemEffect(resolver.ResolveComponent(Target), Key, Block, Behavior);
    }
}

internal sealed class CompiledScrollToItemEffect(UIComponentAddress target, string key, ScrollToBlock block, ScrollToBehavior behavior) : CompiledTargetedClientEffect(target)
{
    public override string Kind => ClientEffectKinds.ScrollToItem;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;

    public string Key { get; } = key;
    public ScrollToBlock Block { get; } = block;
    public ScrollToBehavior Behavior { get; } = behavior;
}
