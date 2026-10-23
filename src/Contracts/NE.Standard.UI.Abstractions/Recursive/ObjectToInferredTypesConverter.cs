using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// Converts boxed <see cref="JsonElement"/> values back into their inferred native CLR type for <see cref="object"/>-typed members:
/// text, a whole or a fractional number, a boolean, an array of them, or a dictionary.
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

    /// <summary>The element as its inferred CLR value, whatever its size.</summary>
    public static object? ToInferredValue(JsonElement element)
    {
        var budget = int.MaxValue;

        return TryToInferred(element, 1, int.MaxValue, ref budget, out var value) ? value : throw new UnreachableException();
    }

    /// <summary>
    /// The element as its inferred CLR value, built only while it holds at most <paramref name="maxElements"/> list items and document
    /// fields, counted through every level, and nests at most <paramref name="maxDepth"/> deep; past either, the build stops there
    /// and answers <see cref="RecursiveValuePastLimits.Instance"/>, which <see cref="RecursiveValueCoercion.IsWithinLimits"/> refuses.
    /// </summary>
    /// <remarks>
    /// The limits as <see cref="RecursiveValueCoercion.IsWithinLimits"/> counts them, applied while reading: a megabyte of tiny elements
    /// is refused before it becomes a graph many times its size.
    /// </remarks>
    public static object? ToInferredValue(JsonElement element, int maxElements, int maxDepth)
    {
        var budget = maxElements;

        return TryToInferred(element, 1, maxDepth, ref budget, out var value) ? value : RecursiveValuePastLimits.Instance;
    }

    private static bool TryToInferred(JsonElement element, int depth, int maxDepth, ref int budget, out object? value)
    {
        if (element.ValueKind == JsonValueKind.Array)
            return TryToInferredArray(element, depth, maxDepth, ref budget, out value);

        if (element.ValueKind == JsonValueKind.Object)
            return TryToInferredObject(element, depth, maxDepth, ref budget, out value);

        value = ToInferredScalar(element);
        return true;
    }

    private static bool TryToInferredArray(JsonElement element, int depth, int maxDepth, ref int budget, out object? value)
    {
        value = null;

        var length = element.GetArrayLength();

        if (depth > maxDepth || (budget -= length) < 0)
            return false;

        var result = new object?[length];
        var index = 0;

        foreach (JsonElement item in element.EnumerateArray())
        {
            if (!TryToInferred(item, depth + 1, maxDepth, ref budget, out result[index++]))
                return false;
        }

        value = result;
        return true;
    }

    private static bool TryToInferredObject(JsonElement element, int depth, int maxDepth, ref int budget, out object? value)
    {
        value = null;

        if (depth > maxDepth)
            return false;

        Dictionary<string, object?> result = new(StringComparer.Ordinal);

        foreach (JsonProperty property in element.EnumerateObject())
        {
            if (--budget < 0 || !TryToInferred(property.Value, depth + 1, maxDepth, ref budget, out var item))
                return false;

            result[property.Name] = item;
        }

        value = result;
        return true;
    }

    private static object? ToInferredScalar(JsonElement element)
        => element.ValueKind switch
        {
            JsonValueKind.String => element.GetString(),
            JsonValueKind.Number => ToInferredNumber(element),
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.Null or JsonValueKind.Undefined => null,
            _ => throw new NotSupportedException($"Unsupported JSON value kind '{element.ValueKind}'.")
        };

    private static object ToInferredNumber(JsonElement element)
        => element.TryGetInt64(out var longValue) ? longValue : element.GetDouble();
}
