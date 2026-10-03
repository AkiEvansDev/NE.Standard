using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using NE.Standard.UI.Compiled.Items;

namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Represents an inserted, removed, or replaced collection item.
/// </summary>
/// <remarks>What it does not carry is left out on the wire, and the page reads it as null.</remarks>
[JsonConverter(typeof(ServerCollectionItemChangeJsonConverter))]
public sealed class ServerCollectionItemChange
{
    /// <summary>
    /// Gets the item index, when the item is addressed by index.
    /// </summary>
    public int? Index { get; init; }

    /// <summary>
    /// Gets the item key, when the item is addressed by key.
    /// </summary>
    public string? Key { get; init; }

    /// <summary>
    /// Gets the previous item key for replace changes.
    /// </summary>
    public string? OldKey { get; init; }

    /// <summary>
    /// Gets the item value, written without its nulls and empty collections, kept to <see cref="Projection"/>
    /// (<see cref="ServerItemJsonConverter"/>).
    /// </summary>
    public object? Item { get; init; }

    /// <summary>
    /// Gets what the host the item goes to reads off it, so the item carries that alone; null sends it whole. Not on the wire.
    /// </summary>
    public UIItemProjection? Projection { get; init; }

    /// <summary>
    /// Validates the collection item change.
    /// </summary>
    public void Validate()
    {
        if (Index is < 0)
            throw new ArgumentOutOfRangeException(nameof(Index), Index, "Index cannot be negative.");

        if (Key is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(Key);

        if (OldKey is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(OldKey);

        if (Index is null && Key is null)
            throw new InvalidOperationException("Item change must provide either index or key.");
    }
}

/// <summary>
/// Writes a collection item change: what it carries, and its item kept to the host's projection.
/// </summary>
public sealed class ServerCollectionItemChangeJsonConverter : JsonConverter<ServerCollectionItemChange>
{
    /// <inheritdoc />
    public override ServerCollectionItemChange? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => throw new NotSupportedException("A collection item change is written to the page, never read back.");

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, ServerCollectionItemChange value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(value);
        ArgumentNullException.ThrowIfNull(options);

        writer.WriteStartObject();

        if (value.Index is int index)
            writer.WriteNumber(ServerItemJsonConverter.PropertyName(options, nameof(ServerCollectionItemChange.Index)), index);

        if (value.Key is not null)
            writer.WriteString(ServerItemJsonConverter.PropertyName(options, nameof(ServerCollectionItemChange.Key)), value.Key);

        if (value.OldKey is not null)
            writer.WriteString(ServerItemJsonConverter.PropertyName(options, nameof(ServerCollectionItemChange.OldKey)), value.OldKey);

        if (value.Item is not null)
        {
            writer.WritePropertyName(ServerItemJsonConverter.PropertyName(options, nameof(ServerCollectionItemChange.Item)));
            ServerItemJsonConverter.WriteItem(writer, value.Item, value.Projection, options);
        }

        writer.WriteEndObject();
    }
}
