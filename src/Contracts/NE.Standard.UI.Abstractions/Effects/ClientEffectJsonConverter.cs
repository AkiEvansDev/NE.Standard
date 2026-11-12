using System;
using System.Collections.Concurrent;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using NE.Standard.UI.Primitives.Json;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// A client effect whose kind has no registered CLR type in this process, preserving its wire kind and payload intact.
/// </summary>
[JsonConverter(typeof(RawClientEffectJsonConverter))]
public sealed class RawClientEffect : ClientEffect
{
    /// <summary>
    /// Initializes a raw client effect from its wire kind and JSON object payload.
    /// </summary>
    public RawClientEffect(string kind, JsonElement data)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(kind);

        Kind = kind;
        Data = data.Clone();
    }

    /// <inheritdoc />
    public override string Kind { get; }

    /// <summary>
    /// Gets the raw JSON object carried on the wire.
    /// </summary>
    public JsonElement Data { get; }
}

internal sealed class RawClientEffectJsonConverter : JsonConverter<RawClientEffect>
{
    public override RawClientEffect? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using JsonDocument document = JsonDocument.ParseValue(ref reader);

        if (!document.RootElement.TryGetPropertyIgnoreCase("kind", out JsonElement kindElement) || kindElement.ValueKind != JsonValueKind.String)
            throw new JsonException("Client effect kind is required.");

        var kind = kindElement.GetString();

        return string.IsNullOrWhiteSpace(kind)
            ? throw new JsonException("Client effect kind is required.")
            : new RawClientEffect(kind, document.RootElement);
    }

    public override void Write(Utf8JsonWriter writer, RawClientEffect value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(value);

        value.Data.WriteTo(writer);
    }
}

/// <summary>
/// Serializes client effects using their runtime type while keeping the public transport shape stable.
/// </summary>
public sealed class ClientEffectJsonConverter : UIRuntimeTypeJsonConverter<ClientEffect>
{
    private static readonly string AbstractionsAssemblyName = typeof(ClientEffect).Assembly.GetName().Name!;
    private static readonly ConcurrentDictionary<string, Type> RegisteredTypes = new(StringComparer.Ordinal);
    private static readonly ConcurrentDictionary<Assembly, byte> ScannedAssemblies = new();

    private static readonly FrozenDictionary<string, Type> BuiltInTypes = new Dictionary<string, Type>(StringComparer.Ordinal)
    {
        [ClientEffectKinds.Navigate] = typeof(NavigateEffect),
        [ClientEffectKinds.NavigateBack] = typeof(NavigateBackEffect),
        [ClientEffectKinds.Focus] = typeof(FocusEffect),
        [ClientEffectKinds.ScrollTo] = typeof(ScrollToEffect),
        [ClientEffectKinds.ScrollToItem] = typeof(ScrollToItemEffect),
        [ClientEffectKinds.OpenDialog] = typeof(OpenDialogEffect),
        [ClientEffectKinds.CloseDialog] = typeof(CloseDialogEffect),
        [ClientEffectKinds.ShowNotification] = typeof(ShowNotificationEffect),
        [ClientEffectKinds.Announce] = typeof(AnnounceEffect),
        [ClientEffectKinds.DownloadFile] = typeof(DownloadFileEffect),
        [ClientEffectKinds.Scroll] = typeof(ScrollEffect),
        [ClientEffectKinds.SetTheme] = typeof(SetThemeEffect),
        [ClientEffectKinds.SetThemeColors] = typeof(SetThemeColorsEffect),
        [ClientEffectKinds.SetLanguage] = typeof(SetLanguageEffect),
        [ClientEffectKinds.RenameItem] = typeof(RenameItemEffect),
        [ClientEffectKinds.CopyToClipboard] = typeof(CopyToClipboardEffect),
        [ClientEffectKinds.InsertText] = typeof(InsertTextEffect),
        [ClientEffectKinds.DiscardForm] = typeof(DiscardFormEffect),
        [ClientEffectKinds.OpenPicker] = typeof(OpenPickerEffect),
        [ClientEffectKinds.ConfirmLeave] = typeof(ConfirmLeaveEffect),
        [ClientEffectKinds.ReplaceAddress] = typeof(ReplaceAddressEffect),
        [ClientEffectKinds.PushAddress] = typeof(PushAddressEffect),
        [ClientEffectKinds.RequestNotificationPermission] = typeof(RequestNotificationPermissionEffect),
        [ClientEffectKinds.ShowSystemNotification] = typeof(ShowSystemNotificationEffect),
        [ClientEffectKinds.ShowImage] = typeof(ShowImageEffect),
        [ClientEffectKinds.DevelopmentReport] = typeof(DevelopmentReportEffect)
    }.ToFrozenDictionary(StringComparer.Ordinal);

    /// <summary>
    /// Registers a wire effect kind with the concrete <see cref="ClientEffect"/> type used to read it back.
    /// </summary>
    public static void Register(string kind, Type effectType)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(kind);
        ArgumentNullException.ThrowIfNull(effectType);

        if (effectType.IsAbstract || !typeof(ClientEffect).IsAssignableFrom(effectType))
            throw new ArgumentException($"'{effectType.FullName}' must be a concrete wire ClientEffect type.", nameof(effectType));

        RegisteredTypes[kind] = effectType;
    }

    /// <inheritdoc />
    public override ClientEffect? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using JsonDocument document = JsonDocument.ParseValue(ref reader);

        if (!document.RootElement.TryGetPropertyIgnoreCase("kind", out JsonElement kindElement) || kindElement.ValueKind != JsonValueKind.String)
            throw new JsonException("Client effect kind is required.");

        var kind = kindElement.GetString() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(kind))
            throw new JsonException("Client effect kind is required.");

        // Looked up by kind because System.Text.Json would otherwise serialize by the declared element type, losing everything but Kind.
        return TryResolveEffectType(kind, out Type? effectType)
            ? (ClientEffect?)document.RootElement.Deserialize(effectType!, options)
            : new RawClientEffect(kind, document.RootElement);
    }

    private static bool TryResolveEffectType(string kind, out Type? effectType)
    {
        if (BuiltInTypes.TryGetValue(kind, out effectType) || RegisteredTypes.TryGetValue(kind, out effectType))
            return true;

        ScanLoadedAssemblies();

        return RegisteredTypes.TryGetValue(kind, out effectType);
    }

    private static void ScanLoadedAssemblies()
    {
        foreach (Assembly assembly in AppDomain.CurrentDomain.GetAssemblies())
        {
            if (assembly.IsDynamic || !ScannedAssemblies.TryAdd(assembly, 0) || !ReferencesAbstractions(assembly))
                continue;

            Type?[] types;

            try
            {
                types = assembly.GetTypes();
            }
            catch (ReflectionTypeLoadException exception)
            {
                types = exception.Types;
            }

            foreach (Type? type in types)
            {
                if (type is null || type.IsAbstract || type == typeof(RawClientEffect) || !typeof(ClientEffect).IsAssignableFrom(type))
                    continue;

                FieldInfo? kindField = type.GetField("EffectKind", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);

                if (kindField is { IsLiteral: true } && kindField.FieldType == typeof(string) && kindField.GetRawConstantValue() is string effectKind && !string.IsNullOrWhiteSpace(effectKind))
                    _ = RegisteredTypes.TryAdd(effectKind, type);
            }
        }
    }

    private static bool ReferencesAbstractions(Assembly assembly)
    {
        if (assembly == typeof(ClientEffect).Assembly)
            return true;

        foreach (AssemblyName reference in assembly.GetReferencedAssemblies())
        {
            if (string.Equals(reference.Name, AbstractionsAssemblyName, StringComparison.Ordinal))
                return true;
        }

        return false;
    }
}
