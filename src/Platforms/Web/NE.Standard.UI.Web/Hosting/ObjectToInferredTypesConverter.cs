using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Converts <see cref="object"/>-typed members from the boxed <see cref="JsonElement"/> that
/// System.Text.Json produces by default into their inferred native CLR value, so hub messages
/// carrying <c>object</c>/<c>object?[]</c> fields (e.g. command dynamic parameters) deserialize into
/// plain <see cref="string"/>/<see cref="long"/>/<see cref="double"/>/<see cref="bool"/> values instead
/// of opaque <see cref="JsonElement"/> boxes.
/// </summary>
public sealed class ObjectToInferredTypesConverter : JsonConverter<object?>
{
    public override object? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using JsonDocument document = JsonDocument.ParseValue(ref reader);
        return ToInferredValue(document.RootElement);
    }

    public override void Write(Utf8JsonWriter writer, object? value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);

        if (value is null)
        {
            writer.WriteNullValue();
            return;
        }

        if (value.GetType() == typeof(object))
        {
            writer.WriteStartObject();
            writer.WriteEndObject();
            return;
        }

        JsonSerializer.Serialize(writer, value, value.GetType(), options);
    }

    private static object? ToInferredValue(JsonElement element)
        => element.ValueKind switch
        {
            JsonValueKind.String => element.GetString(),
            JsonValueKind.Number => ToInferredNumber(element),
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.Null or JsonValueKind.Undefined => null,
            JsonValueKind.Array => ToInferredArray(element),
            JsonValueKind.Object => ToInferredObject(element),
            _ => throw new NotSupportedException($"Unsupported JSON value kind '{element.ValueKind}'.")
        };

    private static object ToInferredNumber(JsonElement element)
        => element.TryGetInt64(out var longValue) ? longValue : element.GetDouble();

    private static object?[] ToInferredArray(JsonElement element)
    {
        var result = new object?[element.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in element.EnumerateArray())
            result[index++] = ToInferredValue(item);

        return result;
    }

    private static Dictionary<string, object?> ToInferredObject(JsonElement element)
    {
        Dictionary<string, object?> result = new(StringComparer.Ordinal);

        foreach (JsonProperty property in element.EnumerateObject())
            result[property.Name] = ToInferredValue(property.Value);

        return result;
    }
}
