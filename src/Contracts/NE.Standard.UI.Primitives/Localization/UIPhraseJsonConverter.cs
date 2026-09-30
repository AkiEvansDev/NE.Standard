using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Primitives.Localization;

/// <summary>
/// Writes a <see cref="UIPhrase"/> as <c>{"key":…,"args":{…}}</c> — <c>args</c> only when it has arguments — or an author's text as
/// <c>{"text":…}</c>, and reads it back — a plain string too, read as an author's text, which is what it converts to.
/// </summary>
/// <remarks>
/// An argument travels as a string, a number, a <see langword="bool"/>, <see langword="null"/>, a nested phrase or a moment
/// (<see cref="UIMoment"/>, in its own shape, which the page writes in the reader's zone); anything else as its invariant text, which is
/// what the server formats it as, so the page shows the same.
/// </remarks>
public sealed class UIPhraseJsonConverter : JsonConverter<UIPhrase>
{
    private const string KeyName = "key";
    private const string ArgumentsName = "args";
    private const string TextName = "text";

    /// <inheritdoc />
    public override UIPhrase? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null)
            return null;

        if (reader.TokenType == JsonTokenType.String)
            return UIPhrase.Text(reader.GetString()!);

        using JsonDocument document = JsonDocument.ParseValue(ref reader);

        return ReadPhrase(document.RootElement);
    }

    private static UIPhrase ReadPhrase(JsonElement element)
    {
        if (element.ValueKind != JsonValueKind.Object)
            throw new JsonException("A phrase is an object with a key.");

        string? key = null;
        Dictionary<string, object?>? arguments = null;

        foreach (JsonProperty property in element.EnumerateObject())
        {
            if (string.Equals(property.Name, TextName, StringComparison.OrdinalIgnoreCase) && property.Value.ValueKind == JsonValueKind.String)
                return UIPhrase.Text(property.Value.GetString()!);

            if (string.Equals(property.Name, KeyName, StringComparison.OrdinalIgnoreCase))
            {
                key = property.Value.ValueKind == JsonValueKind.String ? property.Value.GetString() : null;
            }
            else if (string.Equals(property.Name, ArgumentsName, StringComparison.OrdinalIgnoreCase) && property.Value.ValueKind == JsonValueKind.Object)
            {
                arguments = new Dictionary<string, object?>(StringComparer.Ordinal);

                foreach (JsonProperty argument in property.Value.EnumerateObject())
                    arguments[argument.Name] = ReadArgument(argument.Value);
            }
        }

        return string.IsNullOrWhiteSpace(key)
            ? throw new JsonException("A phrase needs a key.")
            : new UIPhrase(key, arguments);
    }

    private static object? ReadArgument(JsonElement value)
        => value.ValueKind switch
        {
            JsonValueKind.String => value.GetString(),
            JsonValueKind.Number => value.TryGetInt64(out var whole) ? (object)whole : value.GetDouble(),
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.Object => UIMomentJsonConverter.IsMoment(value) ? UIMomentJsonConverter.ReadMoment(value) : ReadPhrase(value),
            _ => null
        };

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, UIPhrase value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(value);

        writer.WriteStartObject();

        if (value.IsText)
        {
            writer.WriteString(TextName, value.Key);
            writer.WriteEndObject();
            return;
        }

        writer.WriteString(KeyName, value.Key);

        if (value.Arguments is not null)
        {
            writer.WriteStartObject(ArgumentsName);

            foreach (KeyValuePair<string, object?> argument in value.Arguments)
            {
                writer.WritePropertyName(argument.Key);
                WriteArgument(writer, argument.Value, options);
            }

            writer.WriteEndObject();
        }

        writer.WriteEndObject();
    }

    private void WriteArgument(Utf8JsonWriter writer, object? value, JsonSerializerOptions options)
    {
        switch (value)
        {
            case null:
                writer.WriteNullValue();
                break;
            case string text:
                writer.WriteStringValue(text);
                break;
            case bool flag:
                writer.WriteBooleanValue(flag);
                break;
            case UIPhrase nested:
                Write(writer, nested, options);
                break;
            // JSON has no NaN or infinity; their text is what the server formats them as.
            case double number when !double.IsFinite(number):
                writer.WriteStringValue(number.ToString(CultureInfo.InvariantCulture));
                break;
            case float number when !float.IsFinite(number):
                writer.WriteStringValue(number.ToString(CultureInfo.InvariantCulture));
                break;
            case byte or sbyte or short or ushort or int or uint or long or ulong or float or double or decimal:
                JsonSerializer.Serialize(writer, value, value.GetType(), options);
                break;
            case var _ when UIMoment.TryRead(value, out UIMoment moment):
                JsonSerializer.Serialize(writer, moment, options);
                break;
            default:
                writer.WriteStringValue(Convert.ToString(value, CultureInfo.InvariantCulture));
                break;
        }
    }
}
