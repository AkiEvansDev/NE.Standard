using System.Text.Json;
using NE.Standard.UI.Primitives.Json;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// The JSON conventions shared by everything this platform sends its client — live hub payloads and render metadata alike.
/// </summary>
public static class WebWireJson
{
    /// <inheritdoc cref="UIWireJson.Options"/>
    public static JsonSerializerOptions Options => UIWireJson.Options;

    /// <inheritdoc cref="UIWireJson.Apply"/>
    public static void Apply(JsonSerializerOptions options)
        => UIWireJson.Apply(options);

    /// <inheritdoc cref="UIWireJson.CreateOptions"/>
    public static JsonSerializerOptions CreateOptions()
        => UIWireJson.CreateOptions();
}
