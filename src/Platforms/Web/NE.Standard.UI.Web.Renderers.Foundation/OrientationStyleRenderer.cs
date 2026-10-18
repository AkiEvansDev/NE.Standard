using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Renders an orientation (<c>IOrientationComponent</c>'s, or a host's own) as its class, kept by a live patch.</summary>
public static class OrientationStyleRenderer
{
    private static readonly WebDomOperation[] Operations = [WebDomOperation.Class(converter: WebDomConverters.OrientationClass)];

    public static void RenderOrientation(WebRenderContext context, IHtmlElementBuilder target, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<UIOrientation?>(context, target, property, static (element, value) =>
        {
            if (value is UIOrientation orientation)
                _ = element.Class(WebClassNames.Orientation(orientation));
        }, Operations);
    }
}
