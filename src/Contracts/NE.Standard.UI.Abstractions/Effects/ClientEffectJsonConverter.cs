using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Serializes client effects using their runtime type while keeping the public transport shape stable.
/// </summary>
public sealed class ClientEffectJsonConverter : JsonConverter<ClientEffect>
{
    private static readonly FrozenDictionary<string, Type> BuiltInTypes = new Dictionary<string, Type>(StringComparer.Ordinal)
    {
        [ClientEffectKinds.Navigate] = typeof(NavigateEffect),
        [ClientEffectKinds.Focus] = typeof(CompiledFocusEffect),
        [ClientEffectKinds.ScrollTo] = typeof(CompiledScrollToEffect),
        [ClientEffectKinds.Show] = typeof(CompiledShowEffect),
        [ClientEffectKinds.Hide] = typeof(CompiledHideEffect),
        [ClientEffectKinds.Collapse] = typeof(CompiledCollapseEffect),
        [ClientEffectKinds.OpenDialog] = typeof(OpenDialogEffect),
        [ClientEffectKinds.CloseDialog] = typeof(CloseDialogEffect),
        [ClientEffectKinds.ShowNotification] = typeof(ShowNotificationEffect),
        [ClientEffectKinds.DownloadFile] = typeof(DownloadFileEffect),
        [ClientEffectKinds.Scroll] = typeof(CompiledScrollEffect),
        [ClientEffectKinds.SetTheme] = typeof(SetThemeEffect),
        [ClientEffectKinds.RenameTab] = typeof(CompiledRenameTabEffect),
        [ClientEffectKinds.CopyToClipboard] = typeof(CompiledCopyToClipboardEffect)
    }.ToFrozenDictionary(StringComparer.Ordinal);

    /// <inheritdoc />
    /// <remarks>
    /// Only resolves the built-in kinds; a package's own effect kind is never deserialized back.
    /// </remarks>
    public override ClientEffect? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using JsonDocument document = JsonDocument.ParseValue(ref reader);

        if (!TryGetProperty(document.RootElement, "kind", out JsonElement kindElement) || kindElement.ValueKind != JsonValueKind.String)
            throw new JsonException("Client effect kind is required.");

        var kind = kindElement.GetString() ?? string.Empty;

        // Looked up by kind because System.Text.Json would otherwise serialize by the declared element type, losing everything but Kind.
        return BuiltInTypes.TryGetValue(kind, out Type? effectType)
            ? (ClientEffect?)document.RootElement.Deserialize(effectType, options)
            : throw new JsonException($"Client effect kind '{kind}' has no type to read back.");
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
