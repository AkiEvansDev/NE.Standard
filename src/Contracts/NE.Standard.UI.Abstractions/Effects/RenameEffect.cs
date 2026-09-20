using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Opens the inline rename field on one keyed entry of a component (a tab, a tree node), the way a double-click or F2 does.
/// </summary>
public abstract class RenameEffect : TargetedClientEffect
{
    /// <summary>
    /// Creates an effect that renames the entry with <paramref name="key"/> in the given component.
    /// </summary>
    protected RenameEffect(UIComponentReference target, string key)
        : base(target)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        Key = key;
    }

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the key of the entry to rename.
    /// </summary>
    public string Key { get; }

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);

        return new CompiledRenameEffect(Kind, resolver.ResolveComponent(Target), Key);
    }
}

/// <summary>
/// Opens the inline rename field on one tab of a tabs view, the way a double-click does.
/// </summary>
public sealed class RenameTabEffect(UIComponentReference target, string key) : RenameEffect(target, key)
{
    /// <summary>
    /// Creates an effect that renames the tab with <paramref name="key"/> in the tabs view identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public RenameTabEffect(string targetComponentId, string key, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters), key)
    { }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.RenameTab;
}

/// <summary>
/// Opens the inline rename field on one node of a tree, the way F2 does.
/// </summary>
public sealed class RenameNodeEffect(UIComponentReference target, string key) : RenameEffect(target, key)
{
    /// <summary>
    /// Creates an effect that renames the node with <paramref name="key"/> in the tree identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public RenameNodeEffect(string targetComponentId, string key, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters), key)
    { }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.RenameNode;
}

/// <summary>The resolved form of either rename: the kind travels as a value, so one type reads both back.</summary>
internal sealed class CompiledRenameEffect(string kind, UIComponentAddress target, string key) : CompiledTargetedClientEffect(target)
{
    public override string Kind { get; } = kind;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;

    public string Key { get; } = key;
}
