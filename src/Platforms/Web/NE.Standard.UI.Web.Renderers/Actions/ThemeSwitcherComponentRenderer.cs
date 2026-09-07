using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Actions;

/// <summary>
/// Draws the theme switcher as a button carrying both glyphs; the stylesheet picks which one shows, since the
/// shell markup is cached across themes.
/// </summary>
public sealed class ThemeSwitcherComponentRenderer : ButtonRendererBase
{
    public override string ComponentTypeKey => ThemeSwitcherComponent.ComponentTypeKey;

    protected override string ClassName => "ui-button";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class("ui-theme-switcher");

        // The engine's hook is a marker attribute, not the class: a class is styling.
        _ = root.Attribute("data-ui-theme-switcher", "");

        RenderThemeSwitcherChrome(context, root);

        RenderGlyph(context, root, "light", ThemeSwitcherComponent.LightIconProperty);
        RenderGlyph(context, root, "dark", ThemeSwitcherComponent.DarkIconProperty);
    }

    /// <summary>The shared button chrome, minus the label.</summary>
    private static void RenderThemeSwitcherChrome(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = root.Attribute("type", "button");

        RenderTooltip(context, root);

        _ = RenderProperty<UIButtonType?>(context, root, ThemeSwitcherComponent.TypeProperty, static (target, value) =>
        {
            if (value is UIButtonType type)
                _ = target.Class(WebClassNames.ButtonClass(type));
        }, [WebDomOperation.Class(converter: WebDomConverters.ButtonClass)]);

        _ = RenderProperty<UIButtonSize?>(context, root, ThemeSwitcherComponent.SizeProperty, static (target, value) =>
        {
            if (value is UIButtonSize size)
                _ = target.Class(WebClassNames.ButtonSize(size));
        }, [WebDomOperation.Class(converter: WebDomConverters.ButtonSizeClass)]);

        ResponsiveRenderer.ApplyResponsiveThickness(context, root, ThemeSwitcherComponent.PaddingProperty, "--ui-padding");

        SurfaceStyleRenderer.RenderBackground(context, root, ThemeSwitcherComponent.BackgroundProperty);

        BorderStyleRenderer.RenderBorderStyle(context, root);
    }

    private static void RenderGlyph(WebRenderContext context, IHtmlElementBuilder root, string modifier, UIProperty property)
    {
        _ = root.Element("span", icon =>
        {
            _ = icon.Class("ui-theme-switcher__icon");
            _ = icon.Class($"ui-theme-switcher__icon--{modifier}");
            _ = icon.Class("ui-icon");

            _ = RenderProperty<UIIconSize?>(context, icon, ThemeSwitcherComponent.IconSizeProperty, static (target, value) =>
            {
                if (value is UIIconSize iconSize)
                    _ = target.Class(WebClassNames.IconSize(iconSize));
            }, [WebDomOperation.Class(converter: WebDomConverters.IconSizeClass)]);

            // The marker as well as the class: `.ui-icon::before` stays hidden until `data-ui-icon` says a glyph is there.
            _ = RenderProperty<string?>(context, icon, property, static (target, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    _ = target.Attribute(WebAttributes.Icon);
                    IconValueRenderer.RenderIconValue(target, value);
                }
            }, [
                .. IconValueRenderer.Operations,
                WebDomOperation.ToggleAttribute(WebAttributes.Icon, condition: WebValueCondition.HasText)
            ]);
        });
    }
}
