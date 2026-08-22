using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Serializes client effects using their runtime type while keeping the public transport shape stable.
/// </summary>
/// <remarks>
/// Without this, <see cref="System.Text.Json"/> writes every element of a <see cref="ClientEffect"/>[]
/// using the declared element type — which has no members beyond <see cref="ClientEffect.Kind"/> — so the
/// client would receive effects stripped of everything that makes them actionable.
/// </remarks>
public sealed class ClientEffectJsonConverter : JsonConverter<ClientEffect>
{
    /// <inheritdoc />
    public override ClientEffect? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using JsonDocument document = JsonDocument.ParseValue(ref reader);

        if (!TryReadKind(document.RootElement, out ClientEffectKind kind))
            throw new JsonException("Client effect kind is required.");

        // The discriminator exists because System.Text.Json serializes a ClientEffect[] by its *declared*
        // element type: without it the client receives objects carrying nothing but the base members, which
        // fails as an empty payload rather than as an exception. Write() passes value.GetType() for the same
        // reason. ServerUIUpdate/ServerUIUpdateJsonConverter is the other instance of this pair.
        Type effectType = kind switch
        {
            ClientEffectKind.Navigate => typeof(NavigateEffect),
            ClientEffectKind.Focus => typeof(CompiledFocusEffect),
            ClientEffectKind.ScrollTo => typeof(CompiledScrollToEffect),
            ClientEffectKind.Show => typeof(CompiledShowEffect),
            ClientEffectKind.Hide => typeof(CompiledHideEffect),
            ClientEffectKind.OpenDialog => typeof(OpenDialogEffect),
            ClientEffectKind.CloseDialog => typeof(CloseDialogEffect),
            ClientEffectKind.ShowNotification => typeof(ShowNotificationEffect),
            ClientEffectKind.DownloadFile => typeof(DownloadFileEffect),
            ClientEffectKind.Scroll => typeof(CompiledScrollEffect),
            _ => throw new JsonException($"Client effect kind '{kind}' is not supported.")
        };

        return (ClientEffect?)document.RootElement.Deserialize(effectType, options);
    }

    private static bool TryReadKind(JsonElement element, out ClientEffectKind kind)
    {
        if (!TryGetProperty(element, "kind", out JsonElement kindElement))
        {
            kind = default;
            return false;
        }

        if (kindElement.ValueKind == JsonValueKind.Number && kindElement.TryGetInt32(out var numericKind))
        {
            kind = (ClientEffectKind)numericKind;
            return Enum.IsDefined(kind);
        }

        if (kindElement.ValueKind == JsonValueKind.String)
        {
            var text = kindElement.GetString();

            if (Enum.TryParse(text, ignoreCase: true, out kind))
                return Enum.IsDefined(kind);

            if (int.TryParse(text, out numericKind))
            {
                kind = (ClientEffectKind)numericKind;
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
    public override void Write(Utf8JsonWriter writer, ClientEffect value, JsonSerializerOptions options)
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
