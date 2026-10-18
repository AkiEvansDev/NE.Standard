using System;
using System.Text.Json;
using NE.Standard.UI.Primitives.Json;

namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Serializes server UI updates using their runtime type while keeping the public transport shape stable.
/// </summary>
public sealed class ServerUIUpdateJsonConverter : UIRuntimeTypeJsonConverter<ServerUIUpdate>
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
            ServerUIUpdateKind.CollectionChange => typeof(ServerCollectionChangeUIUpdate),
            ServerUIUpdateKind.FullResync => typeof(ServerFullResyncUIUpdate),
            ServerUIUpdateKind.Validation => typeof(ServerValidationUIUpdate),
            ServerUIUpdateKind.Page => typeof(ServerPageUIUpdate),
            _ => throw new JsonException($"Server UI update kind '{kind}' is not supported.")
        };

        return (ServerUIUpdate?)document.RootElement.Deserialize(updateType, options);
    }

    private static bool TryReadKind(JsonElement element, out ServerUIUpdateKind kind)
    {
        if (!element.TryGetPropertyIgnoreCase("kind", out JsonElement kindElement))
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
            // Enum.TryParse already reads a numeric kind, and invariantly; no culture-bound int.TryParse after it.
            if (Enum.TryParse(kindElement.GetString(), ignoreCase: true, out kind))
                return Enum.IsDefined(kind);
        }

        kind = default;
        return false;
    }
}
