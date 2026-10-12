using System;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Assets;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Assets;

namespace NE.Standard.UI.Web.Startup;

/// <summary>Draws a framework glyph with an icon of the application's own pack, so the standard actions match the application's icons.</summary>
public static class WebGlyphMapExtensions
{
    /// <summary>
    /// Draws <paramref name="glyph"/>, a <see cref="UIGlyphs"/> name, as <paramref name="icon"/>, a glyph of a registered icon pack,
    /// wherever it is an icon value — a standard action, a dialog's ×, a <c>SetIcon(UIGlyphs.Copy)</c> — on the first paint and every
    /// patch alike.
    /// </summary>
    /// <remarks>
    /// The pack must be registered, the target need not be; a target no registered pack draws fails the startup. A mark the stylesheet
    /// draws itself (a select's chevron, a checkbox's tick) keeps the core's face.
    /// </remarks>
    public static IServiceCollection MapUIGlyph(this IServiceCollection services, string glyph, string icon)
    {
        ArgumentNullException.ThrowIfNull(services);

        WebGlyphMap map = WebPackageRegistration.GetOrAdd(services, static () => new WebGlyphMap(), out var added);

        // A factory, so the stylesheet is written once every pack and every mapping has been registered.
        if (added)
            _ = services.AddSingleton(provider => map.BuildAsset([.. provider.GetServices<IWebIconPack>()]));

        map.Add(glyph, icon);

        return services;
    }
}
