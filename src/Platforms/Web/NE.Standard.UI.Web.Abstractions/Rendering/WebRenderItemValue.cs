using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using NE.Standard.UI.Compiled.Items;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// One server-rendered item, addressed by the same key its element carries.
/// </summary>
[JsonConverter(typeof(WebRenderItemValueJsonConverter))]
public sealed class WebRenderItemValue
{
    public required string Key { get; init; }

    /// <summary>The item, written as a change's is: without its nulls and empty collections, kept to <see cref="Projection"/>.</summary>
    public object? Item { get; init; }

    /// <summary>What the host reads off the item, so it carries that alone; null sends it whole. Not on the wire.</summary>
    public UIItemProjection? Projection { get; init; }

    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(Key))
            throw new InvalidOperationException("Item value key must not be empty.");
    }
}

/// <summary>
/// Writes a server-rendered item's value as a collection change writes its item.
/// </summary>
public sealed class WebRenderItemValueJsonConverter : JsonConverter<WebRenderItemValue>
{
    /// <inheritdoc />
    public override WebRenderItemValue? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => throw new NotSupportedException("A server-rendered item's value is written to the page, never read back.");

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, WebRenderItemValue value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(value);
        ArgumentNullException.ThrowIfNull(options);

        writer.WriteStartObject();
        writer.WriteString(ServerItemJsonConverter.PropertyName(options, nameof(WebRenderItemValue.Key)), value.Key);

        if (value.Item is not null)
        {
            writer.WritePropertyName(ServerItemJsonConverter.PropertyName(options, nameof(WebRenderItemValue.Item)));
            ServerItemJsonConverter.WriteItem(writer, value.Item, value.Projection, options);
        }

        writer.WriteEndObject();
    }
}
