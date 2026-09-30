using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Primitives.Localization;

/// <summary>
/// A <see cref="UIPhrase"/> standing as a text property's whole value (a model's title, description, tooltip): an author's text as the
/// plain string it stands for, as a string travelled before, any other phrase as <see cref="UIPhraseJsonConverter"/> writes it.
/// </summary>
/// <remarks>
/// For a property only, never an argument, where a plain string is a literal. Strict: a string or a phrase's object, or
/// <see langword="null"/>; anything else is refused.
/// </remarks>
public sealed class UIPhraseValueJsonConverter : JsonConverter<UIPhrase>
{
    private static readonly UIPhraseJsonConverter Phrase = new();

    /// <inheritdoc />
    public override UIPhrase? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => reader.TokenType switch
        {
            JsonTokenType.Null => null,
            JsonTokenType.String or JsonTokenType.StartObject => Phrase.Read(ref reader, typeToConvert, options),
            _ => throw new JsonException("A text property's value is a string or a phrase.")
        };

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, UIPhrase value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(value);

        if (value.IsText)
            writer.WriteStringValue(value.Key);
        else
            Phrase.Write(writer, value, options);
    }
}
