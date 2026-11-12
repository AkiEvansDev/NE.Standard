using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Puts text on the viewer's clipboard: either a literal, or what a component holds — a field's value, else the words it shows.
/// </summary>
public sealed class CopyToClipboardEffect : ClientEffect
{
    private CopyToClipboardEffect(string? text, UIComponentReference? target, UIComponentAddress? resolvedTarget = null)
    {
        Text = text;
        Target = target;
        ResolvedTarget = resolvedTarget;
    }

    [JsonConstructor]
    internal CopyToClipboardEffect(string? text, UIComponentAddress? resolvedTarget)
    {
        Text = text;
        ResolvedTarget = resolvedTarget;
    }

    /// <summary>
    /// Copies <paramref name="text"/> as given.
    /// </summary>
    public static CopyToClipboardEffect Literal(string text)
    {
        ArgumentNullException.ThrowIfNull(text);
        return new CopyToClipboardEffect(text, target: null);
    }

    /// <summary>
    /// Copies what the component identified by <paramref name="targetComponentId"/> holds when the effect runs: a field's value, else the
    /// words it shows — a message's text in its row, copied by the row's own button with no round trip.
    /// </summary>
    public static CopyToClipboardEffect ValueOf(string targetComponentId, params object?[]? dynamicParameters)
        => ValueOf(new UIComponentReference(targetComponentId, dynamicParameters));

    /// <summary>
    /// Copies what <paramref name="targetComponent"/> holds when the effect runs: a field's value, else the
    /// words it shows — a message's text in its row, copied by the row's own button with no round trip.
    /// </summary>
    public static CopyToClipboardEffect ValueOf(IBindableComponent targetComponent, params object?[]? dynamicParameters)
        => ValueOf(new UIComponentReference(targetComponent, dynamicParameters));

    /// <summary>
    /// Copies what the given component holds when the effect runs: a field's value, else the words it shows.
    /// </summary>
    public static CopyToClipboardEffect ValueOf(UIComponentReference target)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target.Id);
        return new CopyToClipboardEffect(null, target);
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.CopyToClipboard;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the literal text; null when the text is read off <see cref="Target"/>.
    /// </summary>
    public string? Text { get; }

    /// <summary>
    /// Gets the component whose value or shown words are copied; null when <see cref="Text"/> is given.
    /// </summary>
    [JsonIgnore]
    public UIComponentReference? Target { get; }

    /// <summary>
    /// Gets the resolved component address once compiled or received over the wire; null when <see cref="Text"/> is given.
    /// </summary>
    [JsonInclude]
    [JsonPropertyName("target")]
    public UIComponentAddress? ResolvedTarget { get; }

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);

        if (ResolvedTarget is not null || Target is null)
            return this;

        return new CopyToClipboardEffect(Text, Target, resolver.ResolveComponent(Target.Value));
    }
}
