using System;
using System.Text.Json;
using System.Text.Json.Serialization;

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
