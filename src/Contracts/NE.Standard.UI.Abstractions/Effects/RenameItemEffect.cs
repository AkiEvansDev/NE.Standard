using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Opens the inline rename field on one item of a host that renames its items in place (a tree's node, a tabs view's tab) by the
/// item's key, the way F2 or a double-click does.
/// </summary>
public sealed class RenameItemEffect : TargetedClientEffect
{
    /// <summary>
    /// Creates an effect that renames the item with <paramref name="key"/> in the given host.
    /// </summary>
    public RenameItemEffect(UIComponentReference target, string key)
        : base(target)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        Key = key;
    }

    /// <summary>
    /// Creates an effect that renames the item with <paramref name="key"/> in the host identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public RenameItemEffect(string targetComponentId, string key, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters), key)
    { }

    /// <summary>
    /// Creates an effect that renames the item with <paramref name="key"/> in <paramref name="targetComponent"/>.
    /// </summary>
    public RenameItemEffect(IBindableComponent targetComponent, string key, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponent, dynamicParameters), key)
    { }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.RenameItem;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the key of the item to rename.
    /// </summary>
    public string Key { get; }

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);

        return new CompiledRenameItemEffect(resolver.ResolveComponent(Target), Key);
    }
}

internal sealed class CompiledRenameItemEffect(UIComponentAddress target, string key) : CompiledTargetedClientEffect(target)
{
    public override string Kind => ClientEffectKinds.RenameItem;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    public string Key { get; } = key;
}
