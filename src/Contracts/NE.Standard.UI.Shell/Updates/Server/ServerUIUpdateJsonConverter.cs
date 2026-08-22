using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Serializes server UI updates using their runtime type while keeping the public transport shape stable.
/// </summary>
public sealed class ServerUIUpdateJsonConverter : JsonConverter<ServerUIUpdate>
{
    /// <inheritdoc />
    public override ServerUIUpdate? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using JsonDocument document = JsonDocument.ParseValue(ref reader);

        if (!TryReadKind(document.RootElement, out ServerUIUpdateKind kind))
            throw new JsonException("Server UI update kind is required.");

        Type updateType = kind switch
        {
            ServerUIUpdateKind.Value => typeof(ServerValueUIUpdate),
            ServerUIUpdateKind.ContextRebuild => typeof(ServerContextRebuildUIUpdate),
            ServerUIUpdateKind.CollectionChange => typeof(ServerCollectionChangeUIUpdate),
            ServerUIUpdateKind.FullResync => typeof(ServerFullResyncUIUpdate),
            ServerUIUpdateKind.Validation => typeof(ServerValidationUIUpdate),
            _ => throw new JsonException($"Server UI update kind '{kind}' is not supported.")
        };

        return (ServerUIUpdate?)document.RootElement.Deserialize(updateType, options);
    }

    private static bool TryReadKind(JsonElement element, out ServerUIUpdateKind kind)
    {
        if (!TryGetProperty(element, "kind", out JsonElement kindElement))
        {
            kind = default;
            return false;
        }

        if (kindElement.ValueKind == JsonValueKind.Number && kindElement.TryGetInt32(out var numericKind))
        {
            kind = (ServerUIUpdateKind)numericKind;
            return Enum.IsDefined(kind);
        }

        if (kindElement.ValueKind == JsonValueKind.String)
        {
            var text = kindElement.GetString();

            if (Enum.TryParse(text, ignoreCase: true, out kind))
                return Enum.IsDefined(kind);

            if (int.TryParse(text, out numericKind))
            {
                kind = (ServerUIUpdateKind)numericKind;
                return Enum.IsDefined(kind);
            }
        }

        kind = default;
        return false;
    }

    private static bool TryGetProperty(JsonElement element, string name, out JsonElement value)
    {
        foreach (JsonProperty property in element.EnumerateObject())
        {
            if (string.Equals(property.Name, name, StringComparison.OrdinalIgnoreCase))
            {
                value = property.Value;
                return true;
            }
        }

        value = default;
        return false;
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, ServerUIUpdate value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);

        if (value is null)
        {
            writer.WriteNullValue();
            return;
        }

        JsonSerializer.Serialize(writer, value, value.GetType(), options);
    }
}
