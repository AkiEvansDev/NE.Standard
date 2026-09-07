using System;
using System.Globalization;
using System.Text.Json;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// Writes the number culture a component's client formats with — one JSON attribute an engine reads off the nearest element
/// carrying it, so a grid writes it once on its root for every typed cell under it.
/// </summary>
public static class NumberCultureRenderer
{
    // The wire's conventions: the client reads the same camel-cased names the temporal pack and the metadata use.
    private static readonly JsonSerializerOptions PackJsonOptions = WebWireJson.CreateOptions();

    /// <summary>Writes the pack for an authored culture name; an unknown or empty name is the invariant culture.</summary>
    public static void RenderNumberCulture(IHtmlElementBuilder target, string? cultureName)
        => RenderNumberCulture(target, WebCultures.Resolve(cultureName));

    public static void RenderNumberCulture(IHtmlElementBuilder target, CultureInfo culture)
    {
        ArgumentNullException.ThrowIfNull(target);
        ArgumentNullException.ThrowIfNull(culture);

        _ = target.Attribute(WebAttributes.NumberCulture, JsonSerializer.Serialize(WebNumberCulturePack.FromCulture(culture), PackJsonOptions));
    }
}
