using System;
using System.Globalization;
using System.Text.Json;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// Writes the number culture a component's client formats with, as one JSON attribute the nearest ancestor carries — a grid
/// writes it once on its root for every cell.
/// </summary>
public static class NumberCultureRenderer
{
    /// <summary>Writes the pack for an authored culture name; an unknown or empty name is the invariant culture.</summary>
    public static void RenderNumberCulture(IHtmlElementBuilder target, string? cultureName)
        => RenderNumberCulture(target, UICultures.Resolve(cultureName));

    public static void RenderNumberCulture(IHtmlElementBuilder target, CultureInfo culture)
    {
        ArgumentNullException.ThrowIfNull(target);
        ArgumentNullException.ThrowIfNull(culture);

        _ = target.Attribute(WebAttributes.NumberCulture, JsonSerializer.Serialize(WebNumberCulturePack.FromCulture(culture), WebWireJson.Options));
    }
}
