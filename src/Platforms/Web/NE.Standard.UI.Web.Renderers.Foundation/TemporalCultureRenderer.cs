using System;
using System.Globalization;
using System.Text.Json;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// Writes the temporal culture a component's client formats with, as one JSON attribute the nearest ancestor carries, beside the
/// number culture. For a component formatting many dates under one root, like a grid's date cells — temporal inputs carry
/// their own attribute instead.
/// </summary>
public static class TemporalCultureRenderer
{
    // The wire's conventions: the client reads the same camel-cased names the temporal input's engine and the metadata use.
    private static readonly JsonSerializerOptions PackJsonOptions = WebWireJson.CreateOptions();

    /// <summary>Writes the pack for an authored culture name; an unknown or empty name is the invariant culture.</summary>
    public static void RenderTemporalCulture(IHtmlElementBuilder target, string? cultureName)
        => RenderTemporalCulture(target, WebCultures.Resolve(cultureName));

    public static void RenderTemporalCulture(IHtmlElementBuilder target, CultureInfo culture)
    {
        ArgumentNullException.ThrowIfNull(target);
        ArgumentNullException.ThrowIfNull(culture);

        _ = target.Attribute(WebAttributes.TemporalCulture, JsonSerializer.Serialize(WebTemporalCulturePack.FromCulture(culture), PackJsonOptions));
    }
}
