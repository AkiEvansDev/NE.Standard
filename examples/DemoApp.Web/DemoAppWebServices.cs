using System;
using Microsoft.Extensions.DependencyInjection;
// The host takes the framework's namespaces as global usings; the words coverage test, which compiles this file too, has none.
#if DEMO_WORDS_COVERAGE
using NE.Standard.UI.Web.CodeInput;
using NE.Standard.UI.Web.Icons.Material;
using NE.Standard.UI.Web.Renderers.DI;
#endif

namespace DemoApp.Web;

/// <summary>DemoApp.Web's registrations, which DemoWordsCoverageTests makes too: each package that brings words is tested as the host adds it.</summary>
internal static class DemoAppWebServices
{
    public static void Register(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddStandardRenderers();
        _ = services.AddCodeInput();
        // Only the glyphs the demo names, in both drawings: registering a whole Material style costs megabytes.
        _ = services.AddMaterialWebIcons(MaterialIconStyle.Fill | MaterialIconStyle.Outlined, DemoIcons.All());
    }
}
