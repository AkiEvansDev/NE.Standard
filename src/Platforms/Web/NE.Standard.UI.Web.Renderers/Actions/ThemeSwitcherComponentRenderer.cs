using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Actions;

/// <summary>Draws the theme switcher as a button carrying both glyphs.</summary>
/// <remarks>The stylesheet picks which one shows, since the shell markup is cached across themes.</remarks>
public sealed class ThemeSwitcherComponentRenderer : ButtonRendererBase
{
    public override string ComponentTypeKey => ThemeSwitcherComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.Button;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class("ui-theme-switcher");

        // The engine's hook is a marker attribute, not the class: a class is styling.
        _ = root.Attribute(WebAttributes.ThemeSwitcher);
        _ = root.Attribute("type", "button");

        // Two glyphs and no words: without this the switcher is a button a reader is told nothing about.
        WebWords.Write(context, root, "aria-label", UIStrings.ThemeSwitch);

        SwitcherChromeRenderer.RenderChrome(context, root);

        RenderGlyph(context, root, "light", ThemeSwitcherComponent.LightIconProperty);
        RenderGlyph(context, root, "dark", ThemeSwitcherComponent.DarkIconProperty);
    }

    private static void RenderGlyph(WebRenderContext context, IHtmlElementBuilder root, string modifier, UIProperty property)
        => _ = root.Element("span", icon =>
        {
            _ = icon.Class("ui-theme-switcher__icon");
            _ = icon.Class($"ui-theme-switcher__icon--{modifier}");
            _ = icon.Class("ui-icon");

            SwitcherChromeRenderer.RenderGlyph(context, icon, property);
        });
}
