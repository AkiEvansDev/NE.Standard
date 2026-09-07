using System;
using System.Globalization;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

/// <summary>A separator the viewer drags; what it moves is the parent container's tracks, and <c>grid-splitter-engine.ts</c> does the moving.</summary>
public sealed class GridSplitterComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => GridSplitterComponent.ComponentTypeKey;

    protected override string ClassName => "ui-grid-splitter";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // Render-time only: which axis a bar divides is how the page is laid out.
        _ = ResolveRenderValue(context, GridSplitterComponent.OrientationProperty, out UIOrientation? orientation, out _);
        UIOrientation resolved = orientation ?? UIOrientation.Vertical;

        _ = root.Class(WebClassNames.Orientation(resolved));
        _ = root.Attribute("role", "separator");
        _ = root.Attribute("tabindex", "0");
        _ = root.Attribute("aria-orientation", resolved == UIOrientation.Vertical ? "vertical" : "horizontal");
        _ = root.Attribute("aria-label", context.Translate(UIStrings.SplitterLabel));

        _ = RenderProperty<double?>(context, root, GridSplitterComponent.StepProperty, static (target, value) =>
        {
            if (value is double step && step > 0)
                _ = target.Attribute(WebAttributes.SplitterStep, step.ToString(CultureInfo.InvariantCulture));
        }, [WebDomOperation.Attribute(WebAttributes.SplitterStep)]);

        ThemeColorRenderer.RenderThemeColor(context, root, GridSplitterComponent.ColorProperty);
    }
}
