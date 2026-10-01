using System;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Asks the reader, in the framework's own dialog, whether to leave a page that holds unsaved work: Leave goes to
/// <see cref="Target"/>, Stay keeps the page. What a controller's <c>OnLeaveRequestedAsync</c> answers unless it asks in its own.
/// </summary>
public sealed class ConfirmLeaveEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that asks before leaving for <paramref name="target"/>, an address of this site.
    /// </summary>
    public ConfirmLeaveEffect(string target)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target);
        Target = target;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.ConfirmLeave;

    /// <summary>
    /// Gets the address the reader leaves for on Leave, as the leave named it.
    /// </summary>
    public string Target { get; }
}
