using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to take a component out of the layout — the room it held closes up.
/// </summary>
/// <remarks>
/// The pair to <see cref="HideEffect"/>, which leaves the room where it is.
/// </remarks>
public sealed class CollapseEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that collapses the component identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public CollapseEffect(string targetComponentId, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters))
    { }

    /// <summary>
    /// Creates an effect that collapses the given target component.
    /// </summary>
    public CollapseEffect(UIComponentReference target)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target.Id);
        Target = target;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.Collapse;

    /// <summary>
    /// Gets the target component reference.
    /// </summary>
    public UIComponentReference Target { get; }

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
        => new CompiledCollapseEffect(resolver.ResolveComponent(Target));
}

internal sealed class CompiledCollapseEffect(UIComponentAddress target) : ClientEffect
{
    public override string Kind => ClientEffectKinds.Collapse;

    public UIComponentAddress Target { get; } = target;
}
