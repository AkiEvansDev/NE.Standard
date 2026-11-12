using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Layouts;

/// <summary>
/// Marks an unframed layout panel (<c>data-ui-clip-reach</c>) when its unframed descendants protrude a focus halo, hover contour, thumb,
/// tab underline or hung glyph edge past its box, so <c>Overflow = Hidden</c> clips ordinary content at 0 px without slicing interactive chrome.
/// </summary>
internal static class LayoutClipReachRenderer
{
    public const string ClipReachAttribute = "data-ui-clip-reach";

    private const byte None = 0;
    private const byte Contour = 1;
    private const byte Glyph = 2;

    private static readonly ConditionalWeakTable<CompiledView, ConcurrentDictionary<UIComponentId, byte>> ReachByView = [];

    public static void Render(WebRenderContext context, IHtmlElementBuilder root)
    {
        CompiledView view = context.ViewResolution.View;
        ConcurrentDictionary<UIComponentId, byte> cache = ReachByView.GetValue(view, static _ => new ConcurrentDictionary<UIComponentId, byte>());
        var reach = cache.GetOrAdd(context.Node.ComponentId, id => Compute(view, id));

        if (reach == Glyph)
            _ = root.Attribute(ClipReachAttribute, "glyph");
        else if (reach == Contour)
            _ = root.Attribute(ClipReachAttribute, "contour");
    }

    private static byte Compute(CompiledView view, UIComponentId id)
    {
        if (HasStaticFrame(view, id))
            return None;

        var reach = None;
        IReadOnlyList<UIComponentId> children = view.Graph.GetChildren(id);

        for (var i = 0; i < children.Count; i++)
        {
            UIComponentId childId = children[i];
            UIComponentNode child = view.Graph.GetRequired(childId);

            if (HasNegativeMargin(view, childId))
                reach = Contour;

            var childReach = ChildReach(view, childId, child.TypeKey);
            if (childReach == Glyph)
                return Glyph;

            if (childReach > reach)
                reach = childReach;
        }

        return reach;
    }

    private static bool HasStaticFrame(CompiledView view, UIComponentId id)
    {
        if (TryGetStatic(view, id, ISurfaceComponent.BackgroundProperty, out UIThemeColor? bg) && bg is not null)
            return true;

        if (TryGetStatic(view, id, ISurfaceComponent.BackgroundImageProperty, out string? image) && !string.IsNullOrWhiteSpace(image))
            return true;

        if (TryGetStatic(view, id, IBorderedComponent.BorderThicknessProperty, out UIResponsive<UIThickness>? border) && border is UIResponsive<UIThickness> b && HasPositiveSide(b))
            return true;

        return false;
    }

    private static bool TryGetStatic<T>(CompiledView view, UIComponentId id, UIProperty property, out T? value)
    {
        if (view.State.TryGetValue(id, property, out CompiledUIPropertyValue? prop) && !prop.IsBind && prop.Value is T typed)
        {
            value = typed;
            return true;
        }

        value = default;
        return false;
    }

    private static bool HasPositiveSide(UIResponsive<UIThickness> responsive)
    {
        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (responsive.Get(tier) is UIThickness t && (t.Left > 0 || t.Top > 0 || t.Right > 0 || t.Bottom > 0))
                return true;
        }

        return false;
    }

    private static bool HasNegativeMargin(CompiledView view, UIComponentId id)
        => TryGetStatic(view, id, IVisualComponent.MarginProperty, out UIResponsive<UIThickness>? margin) && margin is UIResponsive<UIThickness> m && HasNegativeSide(m);

    private static bool HasNegativeSide(UIResponsive<UIThickness> responsive)
    {
        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (responsive.Get(tier) is UIThickness t && (t.Left < 0 || t.Top < 0 || t.Right < 0 || t.Bottom < 0))
                return true;
        }

        return false;
    }

    private static byte ChildReach(CompiledView view, UIComponentId childId, string typeKey)
    {
        if (typeKey == StackPanelComponent.ComponentTypeKey)
        {
            if (TryGetStatic(view, childId, StackPanelComponent.GlyphEdgeProperty, out UIAlignment? edge) && edge is UIAlignment.Start or UIAlignment.End)
                return Glyph;

            return Compute(view, childId);
        }

        if (typeKey == ContainerComponent.ComponentTypeKey || typeKey == WrapPanelComponent.ComponentTypeKey || typeKey == AccordionComponent.ComponentTypeKey)
            return Compute(view, childId);

        // Every IInputComponent (built-in or add-on) carries IsReadOnly in View.State and draws a 2 px focus halo, toggle wash or thumb.
        if (view.State.TryGetValue(childId, IInputComponent.IsReadOnlyProperty, out _))
        {
            return TryGetStatic(view, childId, IFieldInputComponent.ShowFocusEdgeProperty, out bool? showFocusEdge) && showFocusEdge == false
                ? None
                : Contour;
        }

        if (typeKey == BreadcrumbsComponent.ComponentTypeKey || typeKey == TabsComponent.ComponentTypeKey)
            return Contour;

        if (typeKey == ExpanderComponent.ComponentTypeKey)
            return TryGetStatic(view, childId, ExpanderComponent.VariantProperty, out UIExpanderVariant? variant) && variant == UIExpanderVariant.Quiet ? Contour : None;

        if (typeKey == KeyValueActionComponent.ComponentTypeKey)
            return !HasStaticFrame(view, childId) ? Contour : None;

        if (typeKey == ItemsViewComponent.ComponentTypeKey)
        {
            UIScrollMode hx = TryGetStatic(view, childId, IScrollableComponent.HorizontalScrollProperty, out UIScrollMode? horizontal) && horizontal is UIScrollMode h ? h : UIScrollMode.Disabled;
            UIScrollMode vy = TryGetStatic(view, childId, IScrollableComponent.VerticalScrollProperty, out UIScrollMode? vertical) && vertical is UIScrollMode v ? v : UIScrollMode.Auto;
            return hx == UIScrollMode.Disabled && vy == UIScrollMode.Disabled ? Contour : None;
        }

        if (typeKey == ButtonComponent.ComponentTypeKey)
        {
            return TryGetStatic(view, childId, IOverflowComponent.OverflowProperty, out UIOverflow? overflow) && overflow == UIOverflow.Show
                && TryGetStatic(view, childId, ITextBaseComponent.BadgePlacementProperty, out UITextBadgePlacement? placement)
                && placement is not null and not UITextBadgePlacement.Inline and not UITextBadgePlacement.Trailing
                ? Contour
                : None;
        }

        return None;
    }
}
