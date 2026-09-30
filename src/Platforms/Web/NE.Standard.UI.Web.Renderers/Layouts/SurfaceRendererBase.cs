using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

/// <summary>The chrome every bordered surface wears: padding, background, border, overflow, fill and the click.</summary>
public abstract class SurfaceRendererBase : WebComponentRendererBase
{
    private const string ClickableClassName = "ui-surface--clickable";

    /// <summary>Draws the surface onto <paramref name="root"/>, under the shared <c>ui-surface--*</c> modifiers.</summary>
    protected static void RenderSurface(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        SurfaceChromeRenderer.RenderChrome(context, root);

        // A Tab stop from the first paint, as `surface-press-engine.ts` keeps it: not a picture of the surface, nor one disabled or
        // loading. The engine also gives it its role, which depends on the controls drawn inside it.
        var stops = !context.IsPresentationCopy && ReadRenderValue(context, IVisualComponent.EnabledProperty, true) && !ReadRenderValue(context, IVisualComponent.LoadingProperty, false);

        // The click suppress mark rather than `pointer-events: none`: the pipeline keeps walking outwards, so an
        // enclosing handler still gets its turn instead of the subtree going inert.
        _ = RenderProperty<bool?>(context, root, SurfaceComponent.ClickableProperty, stops ? RenderClickableStop : RenderClickable, [
            WebDomOperation.ToggleClass(ClickableClassName),
            WebDomOperation.ToggleAttribute(WebAttributes.EventSuppress(EventNames.Click), condition: WebValueCondition.IsFalse)
        ]);
    }

    private static void RenderClickableStop(IHtmlElementBuilder target, bool? value)
    {
        RenderClickable(target, value);

        if (value == true)
            _ = target.Attribute("tabindex", "0");
    }

    private static void RenderClickable(IHtmlElementBuilder target, bool? value)
    {
        if (value == true)
            _ = target.Class(ClickableClassName);
        else
            _ = target.Attribute(WebAttributes.EventSuppress(EventNames.Click));
    }
}
