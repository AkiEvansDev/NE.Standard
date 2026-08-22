using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// The JSON conventions shared by everything this platform sends its client — live hub payloads and the
/// page's render metadata alike.
/// </summary>
/// <remarks>
/// The two have to agree, because the client compares a value from one against a value from the other: an
/// item's property against a template variant key, a live value against a filter's comparison value.
/// </remarks>
public static class WebWireJson
{
    /// <summary>
    /// Applies the conventions to <paramref name="options"/>: a property travels camel-cased, an enum as its
    /// name and never its ordinal.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Everything else here already assumes the enum name — a template variant is keyed by it, the client's
    /// DOM converters look it up first, and every reader on the way back parses it before falling back to an
    /// ordinal. An ordinal would also tie both halves to the enum's declaration order.
    /// </para>
    /// <para>
    /// The naming policy is set rather than inherited. The metadata options took it from
    /// <see cref="JsonSerializerDefaults.Web"/> and the hub's from SignalR's own default, so both were
    /// already camel-cased — but by two separate coincidences, and the client reads every wire model by its
    /// camel-cased member alone.
    /// </para>
    /// </remarks>
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
