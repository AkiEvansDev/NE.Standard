using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Abstractions.Identity;

/// <summary>
/// Reads the number behind a compiled id, however it was written.
/// </summary>
internal static class UIIdJson
{
    public static int Read(ref Utf8JsonReader reader)
    {
        if (reader.TokenType == JsonTokenType.Number)
            return reader.GetInt32();

        if (reader.TokenType == JsonTokenType.Null)
            return 0;

        if (reader.TokenType != JsonTokenType.StartObject)
            throw new JsonException("A compiled id must be a number.");

        var value = 0;

        while (reader.Read() && reader.TokenType != JsonTokenType.EndObject)
        {
            if (reader.TokenType != JsonTokenType.PropertyName)
                continue;

            var isValue = reader.ValueTextEquals("value") || reader.ValueTextEquals("Value");

            _ = reader.Read();

            if (isValue && reader.TokenType == JsonTokenType.Number)
                value = reader.GetInt32();
            else if (reader.TokenType is JsonTokenType.StartObject or JsonTokenType.StartArray)
                reader.Skip();
        }

        return value;
    }
}

public sealed class UIComponentIdJsonConverter : JsonConverter<UIComponentId>
{
    public override UIComponentId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => new(UIIdJson.Read(ref reader));

    public override void Write(Utf8JsonWriter writer, UIComponentId value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        writer.WriteNumberValue(value.Value);
    }
}

public sealed class UIBindingIdJsonConverter : JsonConverter<UIBindingId>
{
    public override UIBindingId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => new(UIIdJson.Read(ref reader));

    public override void Write(Utf8JsonWriter writer, UIBindingId value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        writer.WriteNumberValue(value.Value);
    }
}

public sealed class UIBindingSourceIdJsonConverter : JsonConverter<UIBindingSourceId>
{
    public override UIBindingSourceId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => new(UIIdJson.Read(ref reader));

    public override void Write(Utf8JsonWriter writer, UIBindingSourceId value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        writer.WriteNumberValue(value.Value);
    }
}

public sealed class UIBindingTemplateIdJsonConverter : JsonConverter<UIBindingTemplateId>
{
    public override UIBindingTemplateId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => new(UIIdJson.Read(ref reader));

    public override void Write(Utf8JsonWriter writer, UIBindingTemplateId value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        writer.WriteNumberValue(value.Value);
    }
}

public sealed class UIEventIdJsonConverter : JsonConverter<UIEventId>
{
    public override UIEventId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => new(UIIdJson.Read(ref reader));

    public override void Write(Utf8JsonWriter writer, UIEventId value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        writer.WriteNumberValue(value.Value);
    }
}

public sealed class UIContextIdJsonConverter : JsonConverter<UIContextId>
{
    public override UIContextId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => new(UIIdJson.Read(ref reader));

    public override void Write(Utf8JsonWriter writer, UIContextId value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        writer.WriteNumberValue(value.Value);
    }
}
