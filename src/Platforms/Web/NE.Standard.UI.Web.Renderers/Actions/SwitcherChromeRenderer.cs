using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Actions;

/// <summary>
/// What both page switchers (<see cref="ISwitcherComponent"/>) draw alike: the button's chrome on the root, and a glyph's slot.
/// </summary>
internal static class SwitcherChromeRenderer
{
    private static readonly WebDomOperation[] IconSizeOperations = [WebDomOperation.Class(converter: WebDomConverters.IconSizeClass)];

    private static readonly WebDomOperation[] GlyphOperations =
    [
        .. IconValueRenderer.Operations,
        WebDomOperation.ToggleAttribute(WebAttributes.Icon, condition: WebValueCondition.DrawsIcon)
    ];

    /// <summary>The tooltip, the button's look, the padding, the ground and the edge, on the root the pointer rests on.</summary>
    public static void RenderChrome(WebRenderContext context, IHtmlElementBuilder root)
    {
        WebComponentRendererBase.RenderTooltip(context, root);

        ButtonRendererBase.RenderButtonLook(context, root);

        ResponsiveRenderer.ApplyResponsiveThickness(context, root, ISurfaceComponent.PaddingProperty, "--ui-padding");

        SurfaceStyleRenderer.RenderBackground(context, root, ISurfaceComponent.BackgroundProperty);

        BorderStyleRenderer.RenderBorderStyle(context, root);
    }

    /// <summary>A glyph drawn from <paramref name="property"/> at the switcher's icon size.</summary>
    public static void RenderGlyph(WebRenderContext context, IHtmlElementBuilder icon, UIProperty property)
    {
        _ = WebComponentRendererBase.RenderProperty<UIIconSize?>(context, icon, ISwitcherComponent.IconSizeProperty, static (target, value) =>
        {
            if (value is UIIconSize iconSize)
                _ = target.Class(WebClassNames.IconSize(iconSize));
        }, IconSizeOperations);

        // The marker as well as the class: `.ui-icon::before` stays hidden until `data-ui-icon` says a glyph is there.
        _ = WebComponentRendererBase.RenderProperty<string?>(context, icon, property, static (target, value) =>
        {
            if (IconValueRenderer.Draws(value))
            {
                _ = target.Attribute(WebAttributes.Icon);
                IconValueRenderer.RenderIconValue(target, value);
            }
        }, GlyphOperations);
    }
}
