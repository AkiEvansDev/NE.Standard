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

/// <summary>
/// Reads and writes a compiled id as the bare number behind it.
/// </summary>
public class UIIdJsonConverter<TId>(Func<int, TId> create) : JsonConverter<TId>
    where TId : struct, IUIId
{
    /// <inheritdoc/>
    public override TId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => create(UIIdJson.Read(ref reader));

    /// <inheritdoc/>
    public override void Write(Utf8JsonWriter writer, TId value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        writer.WriteNumberValue(value.Value);
    }
}

/// <inheritdoc cref="UIIdJsonConverter{TId}"/>
public sealed class UIComponentIdJsonConverter() : UIIdJsonConverter<UIComponentId>(value => new UIComponentId(value));

/// <inheritdoc cref="UIIdJsonConverter{TId}"/>
public sealed class UIBindingIdJsonConverter() : UIIdJsonConverter<UIBindingId>(value => new UIBindingId(value));

/// <inheritdoc cref="UIIdJsonConverter{TId}"/>
public sealed class UIBindingSourceIdJsonConverter() : UIIdJsonConverter<UIBindingSourceId>(value => new UIBindingSourceId(value));

/// <inheritdoc cref="UIIdJsonConverter{TId}"/>
public sealed class UIBindingTemplateIdJsonConverter() : UIIdJsonConverter<UIBindingTemplateId>(value => new UIBindingTemplateId(value));

/// <inheritdoc cref="UIIdJsonConverter{TId}"/>
public sealed class UIEventIdJsonConverter() : UIIdJsonConverter<UIEventId>(value => new UIEventId(value));

/// <inheritdoc cref="UIIdJsonConverter{TId}"/>
public sealed class UIContextIdJsonConverter() : UIIdJsonConverter<UIContextId>(value => new UIContextId(value));
