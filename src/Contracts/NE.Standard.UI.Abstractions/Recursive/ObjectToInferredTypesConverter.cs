using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// Converts boxed <see cref="JsonElement"/> values back into their inferred native CLR type for <see cref="object"/>-typed members:
/// text, a whole or a fractional number, a boolean, an array of them, or a dictionary. The hub reads a client's value through it,
/// and <see cref="RecursiveValueCoercion"/> rebuilds a model through it, so an <see cref="object"/> inside a model reads the same way.
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
