using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Puts text into a text field where the reader left its caret, in place of its selection — an emoji, a mention, a snippet — as
/// typing would: the caret after it, the field's input raised, the edit in the field's own undo. Either a literal, or the key of the
/// row whose press raised it.
/// </summary>
/// <remarks>
/// <see cref="CurrentItemKey(string, object?[])"/> reads the row the press came from, so it runs only in an interaction
/// (<c>InteractOn("click", …)</c> on a row's part); returned from a command there is no row, and the page inserts nothing.
/// </remarks>
public sealed class InsertTextEffect : TargetedClientEffect
{
    private InsertTextEffect(UIComponentReference target, string? text) : base(target)
    {
        Text = text;
    }

    /// <summary>
    /// Inserts <paramref name="text"/> as given into the field identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public static InsertTextEffect Literal(string targetComponentId, string text, params object?[]? dynamicParameters)
        => Literal(new UIComponentReference(targetComponentId, dynamicParameters), text);

    /// <summary>
    /// Inserts <paramref name="text"/> as given into the given field.
    /// </summary>
    public static InsertTextEffect Literal(UIComponentReference target, string text)
    {
        ArgumentException.ThrowIfNullOrEmpty(text);
        return new InsertTextEffect(target, text);
    }

    /// <summary>
    /// Inserts the key of the row whose press raised the effect into the field identified by <paramref name="targetComponentId"/>;
    /// an interaction's alone.
    /// </summary>
    public static InsertTextEffect CurrentItemKey(string targetComponentId, params object?[]? dynamicParameters)
        => CurrentItemKey(new UIComponentReference(targetComponentId, dynamicParameters));

    /// <summary>
    /// Inserts the key of the row whose press raised the effect into the given field; an interaction's alone.
    /// </summary>
    public static InsertTextEffect CurrentItemKey(UIComponentReference target)
        => new(target, null);

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.InsertText;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the literal text; null when the text is the key of the row the press came from.
    /// </summary>
    public string? Text { get; }

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);
        return new CompiledInsertTextEffect(resolver.ResolveComponent(Target), Text, Text is null);
    }
}

internal sealed class CompiledInsertTextEffect(UIComponentAddress target, string? text, bool itemKey) : CompiledTargetedClientEffect(target)
{
    public override string Kind => ClientEffectKinds.InsertText;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    public string? Text { get; } = text;

    /// <summary>Whether the text is the key of the row the press came from, in place of <see cref="Text"/>.</summary>
    public bool ItemKey { get; } = itemKey;
}
