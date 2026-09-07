using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Abstractions.Binding.Properties;

/// <summary>
/// Writes a property key as its name, which is all it is.
/// </summary>
public sealed class UIPropertyJsonConverter : JsonConverter<UIProperty>
{
    public override UIProperty Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
            return new UIProperty(reader.GetString() ?? throw new JsonException("A property key must not be empty."));

        if (reader.TokenType != JsonTokenType.StartObject)
            throw new JsonException("A property key must be a string.");

        string? name = null;

        while (reader.Read() && reader.TokenType != JsonTokenType.EndObject)
        {
            if (reader.TokenType != JsonTokenType.PropertyName)
                continue;

            var isName = reader.ValueTextEquals("name") || reader.ValueTextEquals("Name");

            _ = reader.Read();

            if (isName && reader.TokenType == JsonTokenType.String)
                name = reader.GetString();
            else if (reader.TokenType is JsonTokenType.StartObject or JsonTokenType.StartArray)
                reader.Skip();
        }

        return new UIProperty(name ?? throw new JsonException("A property key must carry a name."));
    }

    public override void Write(Utf8JsonWriter writer, UIProperty value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        writer.WriteStringValue(value.Name);
    }
}
