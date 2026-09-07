using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Puts text on the viewer's clipboard: either a literal, or the current value of a component.
/// </summary>
public sealed class CopyToClipboardEffect : ClientEffect
{
    private CopyToClipboardEffect(string? text, UIComponentReference? target)
    {
        Text = text;
        Target = target;
    }

    /// <summary>
    /// Copies <paramref name="text"/> as given.
    /// </summary>
    public static CopyToClipboardEffect Literal(string text)
    {
        ArgumentNullException.ThrowIfNull(text);
        return new CopyToClipboardEffect(text, null);
    }

    /// <summary>
    /// Copies the value the component identified by <paramref name="targetComponentId"/> holds when the effect runs.
    /// </summary>
    public static CopyToClipboardEffect ValueOf(string targetComponentId, params object?[]? dynamicParameters)
        => ValueOf(new UIComponentReference(targetComponentId, dynamicParameters));

    /// <summary>
    /// Copies the value the given component holds when the effect runs.
    /// </summary>
    public static CopyToClipboardEffect ValueOf(UIComponentReference target)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target.Id);
        return new CopyToClipboardEffect(null, target);
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.CopyToClipboard;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the literal text; null when the text is read off <see cref="Target"/>.
    /// </summary>
    public string? Text { get; }

    /// <summary>
    /// Gets the component whose value is copied; null when <see cref="Text"/> is given.
    /// </summary>
    public UIComponentReference? Target { get; }

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);
        return new CompiledCopyToClipboardEffect(Text, Target is null ? null : resolver.ResolveComponent(Target.Value));
    }
}

internal sealed class CompiledCopyToClipboardEffect(string? text, UIComponentAddress? target) : ClientEffect
{
    public override string Kind => ClientEffectKinds.CopyToClipboard;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;

    public string? Text { get; } = text;

    public UIComponentAddress? Target { get; } = target;
}
