using System;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.Json.Serialization;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// A value already written as JSON, handed to the hub as-is, so <see cref="WebOutgoingValues"/> isn't serializing it a second time.
/// </summary>
internal sealed class WebRawJsonValue(byte[] json)
{
    public byte[] Json { get; } = json;
}

/// <summary>Writes the bytes as they are; the hub's payload options carry it (<see cref="WebHubProtocol"/>).</summary>
internal sealed class WebRawJsonValueConverter : JsonConverter<WebRawJsonValue>
{
    public override WebRawJsonValue Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => throw new NotSupportedException("A raw JSON value is written, never read.");

    public override void Write(Utf8JsonWriter writer, WebRawJsonValue value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(value);

        // Validated when it was written by the same options; validating it again would be the second pass this type exists to avoid.
        writer.WriteRawValue(value.Json, skipInputValidation: true);
    }
}

/// <summary>Holds pre-serialized UTF-8 JSON for inline <see cref="ServerCollectionChangeUIUpdate.Items"/> measured by <see cref="WebOutgoingValues"/>.</summary>
internal static class WebRawCollectionItems
{
    private static readonly ConditionalWeakTable<ServerCollectionItemChange[], byte[]> PreSerialized = [];

    public static void Remember(ServerCollectionItemChange[] items, byte[] json)
    {
        if (items.Length > 0)
            PreSerialized.AddOrUpdate(items, json);
    }

    public static bool TryGet(ServerCollectionItemChange[] items, [NotNullWhen(true)] out byte[]? json)
        => items.Length > 0 ? PreSerialized.TryGetValue(items, out json) : (json = null) is not null;
}

internal sealed class WebRawCollectionItemsConverter : JsonConverter<ServerCollectionItemChange[]>
{
    public static WebRawCollectionItemsConverter Instance { get; } = new();

    public override ServerCollectionItemChange[]? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null)
            return null;

        if (reader.TokenType != JsonTokenType.StartArray)
            throw new JsonException("Expected JSON array for collection item changes.");

        System.Collections.Generic.List<ServerCollectionItemChange> items = [];

        while (reader.Read())
        {
            if (reader.TokenType == JsonTokenType.EndArray)
                return [.. items];

            items.Add(JsonSerializer.Deserialize<ServerCollectionItemChange>(ref reader, options)!);
        }

        throw new JsonException("Unexpected end of JSON array for collection item changes.");
    }

    public override void Write(Utf8JsonWriter writer, ServerCollectionItemChange[] value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);

        if (value is null)
        {
            writer.WriteNullValue();
            return;
        }

        if (WebRawCollectionItems.TryGet(value, out var rawJson))
        {
            writer.WriteRawValue(rawJson, skipInputValidation: true);
            return;
        }

        writer.WriteStartArray();

        for (var i = 0; i < value.Length; i++)
            JsonSerializer.Serialize(writer, value[i], options);

        writer.WriteEndArray();
    }
}
