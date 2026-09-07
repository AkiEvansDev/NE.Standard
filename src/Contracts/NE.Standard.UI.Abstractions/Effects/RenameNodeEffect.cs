using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Opens the inline rename field on one node of a tree, the way F2 does.
/// </summary>
public sealed class RenameNodeEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that renames the node with <paramref name="key"/> in the tree identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public RenameNodeEffect(string targetComponentId, string key, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters), key)
    { }

    /// <summary>
    /// Creates an effect that renames the node with <paramref name="key"/> in the given tree.
    /// </summary>
    public RenameNodeEffect(UIComponentReference target, string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target.Id);
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        Target = target;
        Key = key;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.RenameNode;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the tree.
    /// </summary>
    public UIComponentReference Target { get; }

    /// <summary>
    /// Gets the key of the node to rename.
    /// </summary>
    public string Key { get; }

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
        => new CompiledRenameNodeEffect(resolver.ResolveComponent(Target), Key);
}

internal sealed class CompiledRenameNodeEffect(UIComponentAddress target, string key) : ClientEffect
{
    public override string Kind => ClientEffectKinds.RenameNode;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;

    public UIComponentAddress Target { get; } = target;

    public string Key { get; } = key;
}
