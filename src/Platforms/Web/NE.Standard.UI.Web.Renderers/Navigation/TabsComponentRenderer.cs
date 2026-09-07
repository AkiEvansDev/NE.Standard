using System;
using System.Collections.Generic;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>A caption strip over a set of pages, both halves of each tab being real components in their own regions.</summary>
public sealed class TabsComponentRenderer : WebComponentRendererBase
{
    private const string HeaderRegionPrefix = "tab-header:";

    public override string ComponentTypeKey => TabsComponent.ComponentTypeKey;

    protected override string ClassName => "ui-tabs";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        SelectionStyleRenderer.RenderSelectionStyle(context, root);

        // The selected key rides on the root rather than as a class per tab, so a click and a server patch drive one fact.
        _ = root.Attribute(WebAttributes.ValueKind, WebValueKinds.TabsSelected);
        _ = RenderProperty<string?>(context, root, TabsComponent.SelectedKeyProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(WebAttributes.TabsSelected, value);
        }, [WebDomOperation.Attribute(WebAttributes.TabsSelected, target: "root")]);

        RenderFlagClass(context, root, TabsComponent.ShowOverflowProperty, "ui-tabs--no-overflow", WebValueCondition.IsFalse);

        List<string> keys = ResolveTabKeys(context);

        _ = root.Element("div", strip =>
        {
            _ = strip.Class("ui-tabs__strip");
            _ = strip.Attribute("role", "tablist");

            foreach (var key in keys)
                RenderRegion(context, strip, TabRegionNames.Header(key));

            RenderTabOverflowButton(context, strip);
        });

        _ = root.Element("div", pages =>
        {
            _ = pages.Class("ui-tabs__pages");

            foreach (var key in keys)
            {
                _ = pages.Element("div", page =>
                {
                    _ = page.Class("ui-tabs__page");
                    _ = page.Attribute(WebAttributes.TabPage, key);
                    _ = page.Attribute("role", "tabpanel");

                    RenderRegion(context, page, TabRegionNames.Page(key));
                });
            }
        });
    }

    /// <summary>The tab order, read off the compiled slots, which are recorded in the order they were added.</summary>
    private static List<string> ResolveTabKeys(WebRenderContext context)
    {
        List<string> keys = [];

        foreach (UIComponentSlot slot in context.Node.Slots)
        {
            if (slot.Kind == UIComponentSlotKind.Region && slot.Key is { } name && name.StartsWith(HeaderRegionPrefix, StringComparison.Ordinal))
                keys.Add(name[HeaderRegionPrefix.Length..]);
        }

        return keys;
    }
}
