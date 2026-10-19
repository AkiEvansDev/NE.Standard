using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using NE.Standard.UI.Primitives.Json;

namespace NE.Standard.UI.Primitives.Localization;

/// <summary>
/// Writes a <see cref="UIFileSize"/> as <c>{"fileSize":45}</c> — its bytes — and reads that shape back, nothing else.
/// </summary>
public sealed class UIFileSizeJsonConverter : JsonConverter<UIFileSize>
{
    private const string FileSizeName = "fileSize";

    /// <inheritdoc />
    public override UIFileSize Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using JsonDocument document = JsonDocument.ParseValue(ref reader);

        return ReadFileSize(document.RootElement);
    }

    /// <summary>Whether an object on the wire is a file size rather than a phrase: it names one.</summary>
    internal static bool IsFileSize(JsonElement element)
        => element.TryGetPropertyIgnoreCase(FileSizeName, out _);

    /// <summary>Reads <c>{"fileSize":…}</c>, refusing any other member and bytes that are no whole number from zero up.</summary>
    internal static UIFileSize ReadFileSize(JsonElement element)
    {
        if (element.ValueKind != JsonValueKind.Object)
            throw new JsonException("A file size is an object naming its bytes.");

        long? bytes = null;

        foreach (JsonProperty property in element.EnumerateObject())
        {
            if (!string.Equals(property.Name, FileSizeName, StringComparison.OrdinalIgnoreCase))
                throw new JsonException($"A file size has no member '{property.Name}'.");

            bytes = property.Value.ValueKind == JsonValueKind.Number && property.Value.TryGetInt64(out var whole) && whole >= 0
                ? whole
                : throw new JsonException("A file size's bytes are a whole number from zero up.");
        }

        return bytes is { } read
            ? new UIFileSize(read)
            : throw new JsonException("A file size needs its bytes.");
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, UIFileSize value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);

        writer.WriteStartObject();
        writer.WriteNumber(FileSizeName, value.Bytes);
        writer.WriteEndObject();
    }
}
