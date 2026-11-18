using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Shell.Transport;

internal sealed class UIHubAttachRequest
{
    public required string ClientWindowId { get; init; }

    public required string Route { get; init; }

    public string? PageId { get; init; }

    public string? View { get; init; }

    public long? Since { get; init; }

    public string? Runtime { get; init; }

    [JsonConverter(typeof(UIHubNavigationParametersJsonConverter))]
    public IReadOnlyDictionary<string, object?>? Parameters { get; init; }

    public string? TimeZone { get; init; }

    public UIHubClientStateRequest? ClientState { get; init; }

    public bool SwitchRuntime { get; init; }
}

internal sealed class UIHubClientStateRequest
{
    public bool Visible { get; init; } = true;

    public UINotificationPermission NotificationPermission { get; init; }

    public static UIHubClientStateRequest? FromClientState(UIClientState state)
        => state == UIClientState.Unreported
            ? null
            : new UIHubClientStateRequest
            {
                Visible = state.IsVisible,
                NotificationPermission = state.NotificationPermission
            };

    public UIClientState ToClientState()
        => Enum.IsDefined(NotificationPermission)
            ? new UIClientState(Visible, NotificationPermission)
            : throw new InvalidOperationException($"Notification permission '{NotificationPermission}' is not one a page reports.");
}

internal sealed class UIHubAttachResult
{
    public ServerChangeSet InitialChanges { get; init; } = ServerChangeSet.Empty;

    public bool Reload { get; init; }

    public string? Runtime { get; init; }

    public long? RetentionMilliseconds { get; init; }

    public bool Fresh { get; init; }
}

internal sealed class UIHubValueChangeRequest
{
    public required int ComponentId { get; init; }

    public required string PropertyName { get; init; }

    [JsonConverter(typeof(UIDynamicParametersJsonConverter))]
    public object?[] DynamicParameters { get; init; } = [];

    public JsonElement? Value { get; init; }

    public string? ValueToken { get; init; }
}

internal sealed class UIHubCommandRequest
{
    public UIEventId EventId { get; init; }

    public string? Action { get; init; }

    [JsonConverter(typeof(UIDynamicParametersJsonConverter))]
    public object?[] DynamicParameters { get; init; } = [];

    public string? DynamicParametersToken { get; init; }

    public int? RequestId { get; init; }
}

internal sealed class UIHubChangeSetRequest
{
    public required UIHubValueChangeRequest[] Updates { get; init; }
}

internal sealed class UIHubItemWindowRequest
{
    public required int ComponentId { get; init; }

    [JsonConverter(typeof(UIDynamicParametersJsonConverter))]
    public object?[] DynamicParameters { get; init; } = [];

    public required string Anchor { get; init; }

    public int Offset { get; init; }

    public string? Key { get; init; }

    public required int Count { get; init; }

    public bool Extend { get; init; }
}

internal sealed class UIHubLeaveRequest
{
    public required string Target { get; init; }
}

internal sealed class UIHubAddressRequest
{
    [JsonConverter(typeof(UIHubNavigationParametersJsonConverter))]
    public IReadOnlyDictionary<string, object?>? Parameters { get; init; }
}

internal sealed class UIHubSetThemeRequest
{
    public required string Theme { get; init; }
}

internal sealed class UIHubSetThemeColorsRequest
{
    public UIThemeColors? Colors { get; init; }
}

internal sealed class UIHubThemeColorsResult
{
    public string Css { get; init; } = string.Empty;
}

internal sealed class UIHubSetLanguageRequest
{
    public required string Language { get; init; }
}

internal sealed class UIHubLanguageResult
{
    public required string Language { get; init; }

    public required string Href { get; init; }
}

internal sealed class UIHubTranslateRequest
{
    public required string Language { get; init; }

    public string[] Keys { get; init; } = [];
}

internal sealed class UIHubTranslateResult
{
    public required string Language { get; init; }

    public required IReadOnlyDictionary<string, string> Words { get; init; }
}

internal sealed class UISessionKeyWireEffect(string token) : ClientEffect
{
    public const string KindName = "SessionKey";

    public override string Kind => KindName;

    public string Token { get; } = token;
}

internal sealed class UIStoredLanguageWireEffect(string language, string href) : ClientEffect
{
    public override string Kind => ClientEffectKinds.SetLanguage;

    public string Language { get; } = language;

    public string Href { get; } = href;
}

internal sealed class UIStoredThemeColorsWireEffect(UIThemeColors? colors, string css) : ClientEffect
{
    public override string Kind => ClientEffectKinds.SetThemeColors;

    public UIThemeColors? Colors { get; } = colors;

    public string Css { get; } = css;
}

internal sealed class UIHubNavigationParametersJsonConverter : JsonConverter<IReadOnlyDictionary<string, object?>?>
{
    private readonly int _maxElements;
    private readonly int _maxDepth;

    public UIHubNavigationParametersJsonConverter()
        : this(int.MaxValue, int.MaxValue)
    {
    }

    public UIHubNavigationParametersJsonConverter(int maxElements, int maxDepth)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxElements);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxDepth);

        _maxElements = maxElements;
        _maxDepth = maxDepth;
    }

    public override IReadOnlyDictionary<string, object?>? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null)
            return null;

        if (reader.TokenType != JsonTokenType.StartObject)
            throw new JsonException("Navigation parameters must be an object.");

        using JsonDocument document = JsonDocument.ParseValue(ref reader);

        return ObjectToInferredTypesConverter.ToInferredValue(document.RootElement, _maxElements, _maxDepth) is Dictionary<string, object?> parameters
            ? parameters
            : throw new JsonException("Navigation parameters exceed the configured element count or nesting depth limits.");
    }

    public override void Write(Utf8JsonWriter writer, IReadOnlyDictionary<string, object?>? value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);

        if (value is null)
        {
            writer.WriteNullValue();
            return;
        }

        writer.WriteStartObject();

        foreach (KeyValuePair<string, object?> entry in value)
        {
            writer.WritePropertyName(entry.Key);
            JsonSerializer.Serialize(writer, entry.Value, options);
        }

        writer.WriteEndObject();
    }
}

internal sealed class UIHubClientEffectJsonConverter : JsonConverter<ClientEffect>
{
    private static readonly ClientEffectJsonConverter Inner = new();

    public override ClientEffect? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        Utf8JsonReader fallbackReader = reader;
        using JsonDocument doc = JsonDocument.ParseValue(ref reader);
        JsonElement root = doc.RootElement;

        if (root.TryGetProperty("kind", out JsonElement kindEl) && kindEl.ValueKind == JsonValueKind.String)
        {
            var kind = kindEl.GetString();
            if (string.Equals(kind, UISessionKeyWireEffect.KindName, StringComparison.Ordinal))
            {
                var token = root.GetProperty("token").GetString() ?? string.Empty;
                return new UISessionKeyWireEffect(token);
            }

            if (string.Equals(kind, ClientEffectKinds.SetLanguage, StringComparison.Ordinal)
                && root.TryGetProperty("href", out JsonElement hrefEl)
                && hrefEl.ValueKind == JsonValueKind.String)
            {
                var language = root.GetProperty("language").GetString() ?? string.Empty;
                return new UIStoredLanguageWireEffect(language, hrefEl.GetString()!);
            }

            if (string.Equals(kind, ClientEffectKinds.SetThemeColors, StringComparison.Ordinal)
                && root.TryGetProperty("css", out JsonElement cssEl))
            {
                UIThemeColors? colors = root.TryGetProperty("colors", out JsonElement colorsEl) && colorsEl.ValueKind != JsonValueKind.Null
                    ? colorsEl.Deserialize<UIThemeColors>(options)
                    : null;
                var css = cssEl.ValueKind == JsonValueKind.String ? cssEl.GetString() ?? string.Empty : string.Empty;
                return new UIStoredThemeColorsWireEffect(colors, css);
            }
        }

        return Inner.Read(ref fallbackReader, typeToConvert, options);
    }

    public override void Write(Utf8JsonWriter writer, ClientEffect value, JsonSerializerOptions options)
        => Inner.Write(writer, value, options);
}
