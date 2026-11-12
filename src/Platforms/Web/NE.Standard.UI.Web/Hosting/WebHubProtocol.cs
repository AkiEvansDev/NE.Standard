using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using Microsoft.AspNetCore.SignalR;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The hub's JSON: the wire conventions, an <c>object</c>-typed value read back within the application's element and depth bounds,
/// bounded dynamic-parameter arrays, and a value already written passed through as its bytes.
/// </summary>
internal static class WebHubProtocol
{
    public static void Configure(JsonHubProtocolOptions options, UISecurityOptions? security = null)
    {
        ArgumentNullException.ThrowIfNull(options);

        var maxElements = security?.MaxClientValueElements ?? 100_000;
        var maxDepth = security?.MaxClientValueDepth ?? 32;
        var maxParameters = Math.Min(maxElements, Math.Max(maxDepth + 8, 32));
        UIDynamicParametersJsonConverter dynamicParameters = new(maxParameters);
        WebNavigationParametersJsonConverter navigationParameters = new(maxElements, maxDepth);

        JsonSerializerOptions serializerOptions = options.PayloadSerializerOptions;
        WebWireJson.Apply(serializerOptions);
        serializerOptions.MaxDepth = Math.Max(serializerOptions.MaxDepth, maxDepth + 8);
        serializerOptions.Converters.Add(new ObjectToInferredTypesConverter(maxElements, maxDepth));
        serializerOptions.Converters.Add(new UIComponentAddressJsonConverter(maxParameters));
        serializerOptions.Converters.Add(dynamicParameters);
        serializerOptions.Converters.Add(new WebRawJsonValueConverter());
        serializerOptions.TypeInfoResolver = (serializerOptions.TypeInfoResolver ?? new DefaultJsonTypeInfoResolver()).WithAddedModifier(type =>
        {
            if (type.Kind != JsonTypeInfoKind.Object)
                return;

            foreach (JsonPropertyInfo property in type.Properties)
            {
                if (property.CustomConverter is UIDynamicParametersJsonConverter)
                    property.CustomConverter = dynamicParameters;
                else if (property.CustomConverter is WebNavigationParametersJsonConverter)
                    property.CustomConverter = navigationParameters;
            }
        });
    }
}

internal sealed class WebNavigationParametersJsonConverter : JsonConverter<IReadOnlyDictionary<string, object?>?>
{
    private readonly int _maxElements;
    private readonly int _maxDepth;

    public WebNavigationParametersJsonConverter()
        : this(int.MaxValue, int.MaxValue)
    {
    }

    public WebNavigationParametersJsonConverter(int maxElements, int maxDepth)
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
