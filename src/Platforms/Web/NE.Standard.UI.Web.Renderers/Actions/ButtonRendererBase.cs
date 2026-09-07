using System;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Actions;

/// <summary>The chrome every button-shaped control draws: type class, submit form id, padding, background and border.</summary>
public abstract class ButtonRendererBase : WebComponentRendererBase
{
    protected override string ElementName => "button";

    /// <summary>Whether a real <c>button</c> is rendered, and so needs <c>type="button"</c> to never submit an enclosing form.</summary>
    protected virtual bool IsButtonElement => true;

    /// <summary>Whether the button writes its Overflow inline; a caption that draws outside its box says no and leaves it to the stylesheet.</summary>
    protected virtual bool RendersOverflow => true;

    /// <summary>Writes the shared chrome; the <c>ui-button</c> class itself is the caller's to add.</summary>
    protected void RenderButtonChrome(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        if (IsButtonElement)
            _ = root.Attribute("type", "button");

        // On the button, not on its label.
        RenderTooltip(context, root);

        if (RendersOverflow)
            OverflowStyleRenderer.RenderOverflow(context, root);

        _ = RenderProperty<UIButtonType?>(context, root, ButtonComponent.TypeProperty, static (target, value) =>
        {
            if (value is UIButtonType type)
                _ = target.Class(WebClassNames.ButtonClass(type));
        }, [WebDomOperation.Class(converter: WebDomConverters.ButtonClass)]);

        _ = RenderProperty<UIButtonSize?>(context, root, ButtonComponent.SizeProperty, static (target, value) =>
        {
            if (value is UIButtonSize size)
                _ = target.Class(WebClassNames.ButtonSize(size));
        }, [WebDomOperation.Class(converter: WebDomConverters.ButtonSizeClass)]);

        _ = RenderProperty<string?>(context, root, ButtonComponent.SubmitFormIdProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(WebAttributes.SubmitFormId, value);
        }, [WebDomOperation.Attribute(WebAttributes.SubmitFormId)]);

        ResponsiveRenderer.ApplyResponsiveThickness(context, root, ButtonComponent.PaddingProperty, "--ui-padding");

        SurfaceStyleRenderer.RenderBackground(context, root, ButtonComponent.BackgroundProperty);

        BorderStyleRenderer.RenderBorderStyle(context, root);
    }

    /// <summary>Draws the button's label — icon, title, description and badge — into a box the chrome can address.</summary>
    protected static void RenderButtonLabel(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Element("span", label =>
        {
            _ = label.Class("ui-button__content");

            TextContentRendererBase.RenderTextBody(context, root, label, new WebTextBodyOptions
            {
                IncludeTextLayout = true,
                DefaultBadgePlacement = UITextBadgePlacement.Trailing
            });
        });
    }
}
