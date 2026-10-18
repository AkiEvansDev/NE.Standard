using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Text.Json;
using NE.Standard.UI.Primitives.Json;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Serializes client effects using their runtime type while keeping the public transport shape stable.
/// </summary>
public sealed class ClientEffectJsonConverter : UIRuntimeTypeJsonConverter<ClientEffect>
{
    private static readonly FrozenDictionary<string, Type> BuiltInTypes = new Dictionary<string, Type>(StringComparer.Ordinal)
    {
        [ClientEffectKinds.Navigate] = typeof(NavigateEffect),
        [ClientEffectKinds.NavigateBack] = typeof(NavigateBackEffect),
        [ClientEffectKinds.Focus] = typeof(CompiledFocusEffect),
        [ClientEffectKinds.ScrollTo] = typeof(CompiledScrollToEffect),
        [ClientEffectKinds.ScrollToItem] = typeof(CompiledScrollToItemEffect),
        [ClientEffectKinds.Show] = typeof(CompiledShowEffect),
        [ClientEffectKinds.Hide] = typeof(CompiledHideEffect),
        [ClientEffectKinds.Collapse] = typeof(CompiledCollapseEffect),
        [ClientEffectKinds.OpenDialog] = typeof(OpenDialogEffect),
        [ClientEffectKinds.CloseDialog] = typeof(CloseDialogEffect),
        [ClientEffectKinds.ShowNotification] = typeof(ShowNotificationEffect),
        [ClientEffectKinds.Announce] = typeof(AnnounceEffect),
        [ClientEffectKinds.DownloadFile] = typeof(DownloadFileEffect),
        [ClientEffectKinds.Scroll] = typeof(CompiledScrollEffect),
        [ClientEffectKinds.SetTheme] = typeof(SetThemeEffect),
        [ClientEffectKinds.SetThemeColors] = typeof(SetThemeColorsEffect),
        [ClientEffectKinds.SetLanguage] = typeof(SetLanguageEffect),
        [ClientEffectKinds.RenameTab] = typeof(CompiledRenameEffect),
        [ClientEffectKinds.RenameNode] = typeof(CompiledRenameEffect),
        [ClientEffectKinds.CopyToClipboard] = typeof(CompiledCopyToClipboardEffect),
        [ClientEffectKinds.InsertText] = typeof(CompiledInsertTextEffect),
        [ClientEffectKinds.DiscardForm] = typeof(DiscardFormEffect),
        [ClientEffectKinds.OpenPicker] = typeof(CompiledOpenPickerEffect),
        [ClientEffectKinds.ConfirmLeave] = typeof(ConfirmLeaveEffect),
        [ClientEffectKinds.ReplaceAddress] = typeof(ReplaceAddressEffect),
        [ClientEffectKinds.PushAddress] = typeof(PushAddressEffect),
        [ClientEffectKinds.RequestNotificationPermission] = typeof(RequestNotificationPermissionEffect),
        [ClientEffectKinds.ShowSystemNotification] = typeof(ShowSystemNotificationEffect),
        [ClientEffectKinds.ShowImage] = typeof(CompiledShowImageEffect)
    }.ToFrozenDictionary(StringComparer.Ordinal);

    /// <inheritdoc />
    /// <remarks>
    /// Only resolves the built-in kinds; a package's own effect kind is never deserialized back.
    /// </remarks>
    public override ClientEffect? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using JsonDocument document = JsonDocument.ParseValue(ref reader);

        if (!document.RootElement.TryGetPropertyIgnoreCase("kind", out JsonElement kindElement) || kindElement.ValueKind != JsonValueKind.String)
            throw new JsonException("Client effect kind is required.");

        var kind = kindElement.GetString() ?? string.Empty;

        // Looked up by kind because System.Text.Json would otherwise serialize by the declared element type, losing everything but Kind.
        return BuiltInTypes.TryGetValue(kind, out Type? effectType)
            ? (ClientEffect?)document.RootElement.Deserialize(effectType, options)
            : throw new JsonException($"Client effect kind '{kind}' has no type to read back.");
    }
}
