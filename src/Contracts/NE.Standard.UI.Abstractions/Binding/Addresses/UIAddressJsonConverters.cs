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
    private readonly int _maxParameters;

    /// <summary>
    /// Initializes an unbounded component address converter.
    /// </summary>
    public UIComponentAddressJsonConverter()
        : this(int.MaxValue)
    {
    }

    /// <summary>
    /// Initializes a component address converter bounded to at most <paramref name="maxParameters"/> dynamic parameters.
    /// </summary>
    public UIComponentAddressJsonConverter(int maxParameters)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(maxParameters);
        _maxParameters = maxParameters;
    }

    public override UIComponentAddress Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType != JsonTokenType.StartObject)
            throw new JsonException("A component address must be an object.");

        UIComponentId id = default;
        object?[]? parameters = null;

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
                parameters = UIDynamicParametersJsonConverter.ReadParameters(ref reader, _maxParameters);
            else if (reader.TokenType is JsonTokenType.StartObject or JsonTokenType.StartArray)
                reader.Skip();
        }

        if (id.IsEmpty)
            throw new JsonException("A component address must carry a component id.");

        return new UIComponentAddress(id, parameters);
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

/// <summary>
/// Reads the keys addressing an item the way the runtime takes them — each an <see cref="int"/>, a string or null — wherever the
/// wire carries them: in an address, with a written value, with a command.
/// </summary>
public sealed class UIDynamicParametersJsonConverter : JsonConverter<object?[]>
{
    private readonly int _maxParameters;

    /// <summary>
    /// Initializes an unbounded dynamic parameters converter.
    /// </summary>
    public UIDynamicParametersJsonConverter()
        : this(int.MaxValue)
    {
    }

    /// <summary>
    /// Initializes a dynamic parameters converter bounded to at most <paramref name="maxParameters"/> entries.
    /// </summary>
    public UIDynamicParametersJsonConverter(int maxParameters)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(maxParameters);
        _maxParameters = maxParameters;
    }

    public override object?[] Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType != JsonTokenType.StartArray)
            throw new JsonException("Dynamic parameters must be an array.");

        return ReadParameters(ref reader, _maxParameters);
    }

    // Read by hand rather than as object?[]: that gives a JsonElement, or a long under the hub's options, which the runtime refuses
    // only once it resolves the binding — as its own failure rather than a malformed call.
    internal static object?[] ReadParameters(ref Utf8JsonReader reader, int maxParameters = int.MaxValue)
    {
        List<object?> parameters = [];

        while (reader.Read() && reader.TokenType != JsonTokenType.EndArray)
        {
            if (parameters.Count >= maxParameters)
                throw new JsonException($"Dynamic parameters cannot exceed {maxParameters} entries.");

            parameters.Add(reader.TokenType switch
            {
                JsonTokenType.Null => null,
                JsonTokenType.String => reader.GetString(),
                JsonTokenType.Number when reader.TryGetInt32(out var number) => number,
                _ => throw new JsonException($"Dynamic parameter #{parameters.Count} must be int or string.")
            });
        }

        return [.. parameters];
    }

    public override void Write(Utf8JsonWriter writer, object?[] value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(value);

        writer.WriteStartArray();

        foreach (var parameter in value)
            JsonSerializer.Serialize(writer, parameter, options);

        writer.WriteEndArray();
    }
}
