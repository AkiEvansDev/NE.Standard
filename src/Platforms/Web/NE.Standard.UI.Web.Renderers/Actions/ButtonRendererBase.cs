using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Actions;

/// <summary>
/// The chrome every button-shaped control draws: its type class, submit form id, padding, background and
/// border. Shared by <see cref="ButtonComponentRenderer"/> and <see cref="ActionComponentRenderer"/>, which
/// differ only in what sits inside the element.
/// </summary>
public abstract class ButtonRendererBase : WebComponentRendererBase
{
    protected override string ElementName => "button";

    /// <summary>
    /// Whether the element rendered is a real <c>button</c>, and therefore needs <c>type="button"</c> so it
    /// never submits an enclosing form. A menu entry is an anchor and would be handed an invalid attribute.
    /// </summary>
    protected virtual bool IsButtonElement => true;

    /// <summary>
    /// Writes the shared chrome. The <c>ui-button</c> class itself is the caller's, since a derived renderer
    /// names its own class and wears this one beside it — the way <c>SearchComponentRenderer</c> wears
    /// <c>ui-select</c>.
    /// </summary>
    protected void RenderButtonChrome(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        if (IsButtonElement)
            _ = root.Attribute("type", "button");

        _ = RenderProperty<UIButtonType?>(context, root, ButtonComponent.TypeProperty, static (target, value) =>
        {
            if (value is UIButtonType type)
                _ = target.Class(WebClassNames.ButtonClass(type));
        }, [WebDomOperation.Class(converter: WebDomConverters.ButtonClass)]);

        _ = RenderProperty<string?>(context, root, ButtonComponent.SubmitFormIdProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("data-ui-submit-form-id", value);
        }, [WebDomOperation.Attribute("data-ui-submit-form-id")]);

        ResponsiveRenderer.ApplyResponsiveThickness(context, root, ButtonComponent.PaddingProperty, "--ui-padding");

        _ = RenderProperty<UIThemeColor?>(context, root, ButtonComponent.BackgroundProperty, static (target, value) =>
        {
            if (value is UIThemeColor background && WebCssValues.ThemeColor(background) is { Length: > 0 } css)
                _ = target.Style("background", css);
        }, [WebDomOperation.Style("background", converter: WebDomConverters.ThemeColorCss)]);

        BorderStyleRenderer.RenderBorderStyle(context, root);
    }
}
