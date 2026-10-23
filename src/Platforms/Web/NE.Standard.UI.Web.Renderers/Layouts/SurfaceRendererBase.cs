using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

/// <summary>
/// The chrome every bordered surface wears: padding, background, border, overflow, fill, the click, the address it links to and the
/// name it is announced by.
/// </summary>
public abstract class SurfaceRendererBase : WebComponentRendererBase
{
    private const string ClickableClassName = "ui-surface--clickable";

    private static readonly WebDomOperation[] ClickableOperations =
    [
        WebDomOperation.ToggleClass(ClickableClassName),
        WebDomOperation.ToggleAttribute(WebAttributes.EventSuppress(EventNames.Click), condition: WebValueCondition.IsFalse)
    ];

    /// <summary>An anchor where the surface links to an address (<see cref="ILinkableComponent.Url"/>), so it opens in a new tab and copies as a link.</summary>
    protected override (string ElementName, string ClassName) ResolveRoot(WebRenderContext context)
        => DrawsLink(context) ? ("a", ClassName) : base.ResolveRoot(context);

    /// <summary>Draws the surface onto <paramref name="root"/>, under the shared <c>ui-surface--*</c> modifiers.</summary>
    protected static void RenderSurface(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        SurfaceChromeRenderer.RenderChrome(context, root);
        RenderClickable(context, root);
        RenderFlagClass(context, root, SurfaceComponent.QuietHoverProperty, "ui-surface--quiet-hover");
        RenderLiveRegion(context, root);

        if (DrawsLink(context))
            RenderLinkAddress(context, root, ILinkableComponent.UrlProperty);

        RenderAccessibleName(context, root);
    }

    /// <summary>
    /// Makes <paramref name="root"/> pressable while its <c>Clickable</c> holds, as a surface is (<c>surface-press-engine.ts</c>): the
    /// affordance, the Tab stop and the click; a file tile wears it too. A link wears the affordance alone: its anchor is the stop.
    /// </summary>
    public static void RenderClickable(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // A Tab stop from the first paint, as `surface-press-engine.ts` keeps it: not a picture of the surface, nor one disabled or
        // loading. The engine also gives it its role, which depends on the controls drawn inside it.
        var stops = !context.IsPresentationCopy && !DrawsLink(context) && ReadRenderValue(context, IVisualComponent.EnabledProperty, true) && !ReadRenderValue(context, IVisualComponent.LoadingProperty, false);

        // The click suppress mark rather than `pointer-events: none`: the pipeline keeps walking outwards, so an
        // enclosing handler still gets its turn instead of the subtree going inert.
        _ = RenderProperty<bool?>(context, root, IClickableComponent.ClickableProperty, stops ? RenderClickableStop : RenderClickableMark, ClickableOperations);
    }

    private static void RenderClickableStop(IHtmlElementBuilder target, bool? value)
    {
        RenderClickableMark(target, value);

        if (value == true)
            _ = target.Attribute("tabindex", "0");
    }

    private static void RenderClickableMark(IHtmlElementBuilder target, bool? value)
    {
        if (value == true)
            _ = target.Class(ClickableClassName);
        else
            _ = target.Attribute(WebAttributes.EventSuppress(EventNames.Click));
    }

    // A message's role, read as its words change and as it is shown; a clickable surface's role is the press engine's (a button or
    // a group), and a picture of a surface says nothing.
    private static void RenderLiveRegion(WebRenderContext context, IHtmlElementBuilder root)
    {
        if (context.IsPresentationCopy || ReadRenderValue(context, IClickableComponent.ClickableProperty, false))
            return;

        UILiveRegion? live = ReadRenderValue<UILiveRegion?>(context, SurfaceComponent.LiveRegionProperty, null);

        if (live is UILiveRegion region)
            _ = root.Attribute("role", region == UILiveRegion.Alert ? "alert" : "status");
    }
}
