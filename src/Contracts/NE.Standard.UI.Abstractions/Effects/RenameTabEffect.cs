using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Opens the inline rename field on one tab of a tabs view, the way a double-click does.
/// </summary>
public sealed class RenameTabEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that renames the tab with <paramref name="key"/> in the tabs view identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public RenameTabEffect(string targetComponentId, string key, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters), key)
    { }

    /// <summary>
    /// Creates an effect that renames the tab with <paramref name="key"/> in the given tabs view.
    /// </summary>
    public RenameTabEffect(UIComponentReference target, string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target.Id);
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        Target = target;
        Key = key;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.RenameTab;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the tabs view.
    /// </summary>
    public UIComponentReference Target { get; }

    /// <summary>
    /// Gets the key of the tab to rename.
    /// </summary>
    public string Key { get; }

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
        => new CompiledRenameTabEffect(resolver.ResolveComponent(Target), Key);
}

internal sealed class CompiledRenameTabEffect(UIComponentAddress target, string key) : ClientEffect
{
    public override string Kind => ClientEffectKinds.RenameTab;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;

    public UIComponentAddress Target { get; } = target;

    public string Key { get; } = key;
}
