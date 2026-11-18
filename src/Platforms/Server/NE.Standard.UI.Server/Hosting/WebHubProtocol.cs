using System;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using Microsoft.AspNetCore.SignalR;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Json;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Shell.Transport;
using NE.Standard.UI.Shell.Updates.Server;

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
        UIHubNavigationParametersJsonConverter navigationParameters = new(maxElements, maxDepth);

        JsonSerializerOptions serializerOptions = options.PayloadSerializerOptions;
        UIWireJson.Apply(serializerOptions);
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
                else if (property.CustomConverter is UIHubNavigationParametersJsonConverter)
                    property.CustomConverter = navigationParameters;
                else if (type.Type == typeof(ServerCollectionChangeUIUpdate) && property.PropertyType == typeof(ServerCollectionItemChange[]))
                    property.CustomConverter = WebRawCollectionItemsConverter.Instance;
            }
        });
    }
}
