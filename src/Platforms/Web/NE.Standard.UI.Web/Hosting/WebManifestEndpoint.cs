using System;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>Serves the application's web app manifest (<see cref="WebEndpointOptions.Manifest"/>) at <see cref="Path"/>.</summary>
internal static class WebManifestEndpoint
{
    /// <summary>The address the shell links the manifest by.</summary>
    public const string Path = "/_ne/manifest.webmanifest";

    public static void Map(IEndpointRouteBuilder endpoints)
    {
        ArgumentNullException.ThrowIfNull(endpoints);

        _ = endpoints.MapGet(Path, Serve);
    }

    private static IResult Serve(HttpContext http)
    {
        WebManifestOptions? manifest = http.RequestServices.GetRequiredService<IOptions<WebEndpointOptions>>().Value.Manifest;

        if (manifest is null)
            return Results.NotFound();

        manifest.Validate();

        return Results.Text(JsonSerializer.Serialize(Write(manifest)), "application/manifest+json");
    }

    /// <summary>The manifest in the members the format names.</summary>
    private static Dictionary<string, object?> Write(WebManifestOptions manifest)
    {
        List<Dictionary<string, object?>> icons = [];

        foreach (WebManifestIcon icon in manifest.Icons)
            icons.Add(WithoutUnset(new Dictionary<string, object?> { ["src"] = icon.Source, ["sizes"] = icon.Sizes, ["type"] = icon.Type, ["purpose"] = icon.Purpose }));

        return WithoutUnset(new Dictionary<string, object?>
        {
            ["name"] = manifest.Name,
            ["short_name"] = manifest.ShortName ?? manifest.Name,
            ["description"] = manifest.Description,
            ["start_url"] = manifest.StartAddress,
            ["display"] = manifest.Display switch
            {
                WebManifestDisplay.Fullscreen => "fullscreen",
                WebManifestDisplay.MinimalUi => "minimal-ui",
                WebManifestDisplay.Browser => "browser",
                _ => "standalone"
            },
            ["theme_color"] = manifest.ThemeColor,
            ["background_color"] = manifest.BackgroundColor,
            ["icons"] = icons
        });
    }

    /// <summary>The members set: one left unset is left out, as the format reads a missing member, not a null one.</summary>
    private static Dictionary<string, object?> WithoutUnset(Dictionary<string, object?> members)
    {
        foreach (var name in new List<string>(members.Keys))
        {
            if (members[name] is null)
                _ = members.Remove(name);
        }

        return members;
    }
}
