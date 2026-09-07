using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Abstractions.Binding.Addresses;

/// <summary>
/// Writes a component address as the two things it is: an id, and the keys addressing the item it is inside.
/// </summary>
public sealed class UIComponentAddressJsonConverter : JsonConverter<UIComponentAddress>
{
    public override UIComponentAddress Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType != JsonTokenType.StartObject)
            throw new JsonException("A component address must be an object.");

        UIComponentId id = default;
        List<object?>? parameters = null;

        while (reader.Read() && reader.TokenType != JsonTokenType.EndObject)
        {
            if (reader.TokenType != JsonTokenType.PropertyName)
                continue;

            var isId = reader.ValueTextEquals("id") || reader.ValueTextEquals("Id");
            var isParameters = reader.ValueTextEquals("dynamicParameters") || reader.ValueTextEquals("DynamicParameters");

            _ = reader.Read();

            if (isId)
                id = JsonSerializer.Deserialize<UIComponentId>(ref reader, options);
            else if (isParameters && reader.TokenType == JsonTokenType.StartArray)
                parameters = JsonSerializer.Deserialize<List<object?>>(ref reader, options);
            else if (reader.TokenType is JsonTokenType.StartObject or JsonTokenType.StartArray)
                reader.Skip();
        }

        return new UIComponentAddress(id, parameters?.ToArray());
    }

    public override void Write(Utf8JsonWriter writer, UIComponentAddress value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);

        writer.WriteStartObject();

        writer.WritePropertyName("id");
        JsonSerializer.Serialize(writer, value.Id, options);

        if (value.HasDynamicParameters)
        {
            writer.WritePropertyName("dynamicParameters");
            JsonSerializer.Serialize(writer, value.DynamicParameters, options);
        }

        writer.WriteEndObject();
    }
}
