using System;
using Microsoft.AspNetCore.SignalR;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The hub's JSON: the wire conventions, an <c>object</c>-typed value read back as what it is, and a value already written passed
/// through as its bytes.
/// </summary>
internal static class WebHubProtocol
{
    public static void Configure(JsonHubProtocolOptions options)
    {
        ArgumentNullException.ThrowIfNull(options);

        WebWireJson.Apply(options.PayloadSerializerOptions);
        options.PayloadSerializerOptions.Converters.Add(new ObjectToInferredTypesConverter());
        options.PayloadSerializerOptions.Converters.Add(new WebRawJsonValueConverter());
    }
}
