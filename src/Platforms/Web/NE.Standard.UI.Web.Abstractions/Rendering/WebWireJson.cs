using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// The JSON conventions shared by everything this platform sends its client — live hub payloads and render metadata alike.
/// </summary>
public static class WebWireJson
{
    /// <summary>
    /// Applies the conventions to <paramref name="options"/>: a property travels camel-cased, an enum as its name and never its ordinal.
    /// </summary>
    public static void Apply(JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(options);
        options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.Converters.Add(new JsonStringEnumConverter());
    }

    /// <summary>
    /// A fresh web-flavoured options instance carrying the conventions.
    /// </summary>
    public static JsonSerializerOptions CreateOptions()
    {
        JsonSerializerOptions options = new(JsonSerializerDefaults.Web);
        Apply(options);

        return options;
    }
}
