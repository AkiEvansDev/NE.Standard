using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Opens the inline rename field on one item of a host that renames its items in place (a tree's node, a tabs view's tab) by the
/// item's key, or directly on a standalone text component, the way F2 or a double-click does.
/// </summary>
public sealed class RenameItemEffect : TargetedClientEffect
{
    /// <summary>
    /// Creates an effect that renames the targeted text component in place.
    /// </summary>
    public RenameItemEffect(UIComponentReference target)
        : base(target)
    { }

    /// <summary>
    /// Creates an effect that renames the text component identified by <paramref name="targetComponentId"/> in place.
    /// </summary>
    public RenameItemEffect(string targetComponentId)
        : this(new UIComponentReference(targetComponentId))
    { }

    /// <summary>
    /// Creates an effect that renames <paramref name="targetComponent"/> in place.
    /// </summary>
    public RenameItemEffect(IBindableComponent targetComponent)
        : this(new UIComponentReference(targetComponent))
    { }

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

    /// <summary>
    /// Creates an effect that renames the targeted text component in place.
    /// </summary>
    public static RenameItemEffect Of(UIComponentReference target)
        => new(target);

    /// <summary>
    /// Creates an effect that renames the text component identified by <paramref name="targetComponentId"/> in place.
    /// </summary>
    public static RenameItemEffect Of(string targetComponentId, params object?[]? dynamicParameters)
        => new(new UIComponentReference(targetComponentId, dynamicParameters));

    /// <summary>
    /// Creates an effect that renames <paramref name="targetComponent"/> in place.
    /// </summary>
    public static RenameItemEffect Of(IBindableComponent targetComponent, params object?[]? dynamicParameters)
        => new(new UIComponentReference(targetComponent, dynamicParameters));

    [JsonConstructor]
    internal RenameItemEffect(UIComponentAddress? resolvedTarget, string? key = null)
        : base(resolvedTarget)
    {
        Key = key;
    }

    private RenameItemEffect(UIComponentAddress resolvedTarget, UIComponentReference target, string? key)
        : base(resolvedTarget, target)
    {
        Key = key;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.RenameItem;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the key of the item to rename when targeting an items host, or <see langword="null"/> when targeting a text component directly.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Key { get; }

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);

        return ResolvedTarget is not null ? this : new RenameItemEffect(resolver.ResolveComponent(Target), Target, Key);
    }
}
