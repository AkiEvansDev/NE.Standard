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
        => reader.TokenType == JsonTokenType.String
            ? new UIProperty(reader.GetString() ?? throw new JsonException("A property key must not be empty."))
            : throw new JsonException("A property key must be a string.");

    public override void Write(Utf8JsonWriter writer, UIProperty value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        writer.WriteStringValue(value.Name);
    }
}
